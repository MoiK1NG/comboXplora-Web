import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // Si Supabase no está configurado, redirigir al login con aviso
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || supabaseUrl === 'YOUR_SUPABASE_URL' || !supabaseKey) {
    // En desarrollo sin Supabase configurado: dejar pasar (fallback mode)
    return supabaseResponse;
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refrescar la sesión (importante para tokens expirados)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPath = request.nextUrl.pathname === '/admin/login';

  // Si intenta acceder a /admin/* sin sesión → redirect a login
  if (isAdminPath && !isLoginPath && !user) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = '/admin/login';
    return NextResponse.redirect(loginUrl);
  }

  // Si ya tiene sesión e intenta ir a /admin/login → redirect a dashboard
  if (isLoginPath && user) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = '/admin';
    return NextResponse.redirect(dashboardUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
