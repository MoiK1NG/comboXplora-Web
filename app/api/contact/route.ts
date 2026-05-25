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
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error: dbError } = await supabase
        .from('formularios_contacto')
        .insert({ name: name.trim(), email: email.trim(), phone, subject, message: message.trim() });

      if (dbError) {
        console.error('[contact API] Supabase error:', dbError.message);
      }
    }

    // Enviar email de notificación
    if (process.env.RESEND_API_KEY) {
      await sendContactNotification({ name, email, phone, subject, message });
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
