/**
 * POST /api/admin/revalidate
 * Invalida el caché de Next.js para que los cambios del admin
 * se reflejen inmediatamente en el sitio público.
 *
 * Solo disponible para usuarios autenticados (Supabase session).
 */
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // Verificar sesión activa
  const cookieStore = await cookies();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: {
        headers: {
          cookie: cookieStore.toString(),
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // Revalidar todas las rutas públicas de contenido
  const paths = [
    "/",
    "/experiencias",
    "/hacedores",
    "/mapa-cultural",
    "/relatos",
  ];

  for (const path of paths) {
    revalidatePath(path, "page");
    revalidatePath(path, "layout");
  }

  // Revalidar slugs dinámicos (revalida toda la ruta)
  revalidatePath("/experiencias/[slug]", "page");
  revalidatePath("/hacedores/[slug]", "page");

  return NextResponse.json({
    ok: true,
    revalidated: paths,
    timestamp: new Date().toISOString(),
  });
}
