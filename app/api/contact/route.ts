import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendContactNotification } from '../../../lib/email';
import type { ContactFormPayload } from '../../../lib/types';

export async function POST(request: Request) {
  try {
    const body: ContactFormPayload = await request.json();
    const { name, email, phone, subject, message } = body;

    // Validación básica
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: 'Nombre, email y mensaje son obligatorios.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    // Guardar en Supabase (usando service role key para bypass RLS en escritura pública)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Service role si existe; si no, la anon key (la tabla permite INSERT público)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[contact API] Supabase env vars missing');
      return NextResponse.json({ error: 'Configuración del servidor incompleta.' }, { status: 500 });
    }

    const clean = (s?: string | null) => (s && s.trim() ? s.trim() : null);
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: dbError } = await supabase
      .from('formularios_contacto')
      .insert({ name: name.trim(), email: email.trim().toLowerCase(), phone: clean(phone), subject: clean(subject), message: message.trim() });

    if (dbError) {
      console.error('[contact API] Supabase error:', dbError.message, dbError.code);
      return NextResponse.json({ error: 'No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos por WhatsApp.' }, { status: 500 });
    }

    // El correo no debe frenar la respuesta ni hacerla fallar
    if (process.env.RESEND_API_KEY) {
      sendContactNotification({ name, email, phone, subject, message })
        .catch((err) => console.error('[contact API] Email error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[contact API] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
