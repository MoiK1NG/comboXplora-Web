import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPostulacionNotification, sendPostulacionConfirmation } from '../../../lib/email';
import type { PostulacionPayload } from '../../../lib/types';

export async function POST(request: Request) {
  try {
    const body: PostulacionPayload = await request.json();
    const {
      name, email, phone, neighborhood, experience_type,
      experience_title, experience_description, why_join, social_links,
    } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: 'Nombre y email son obligatorios.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Prefer service role key (bypasses RLS). Fall back to anon key.
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[postulacion] Supabase env vars missing');
      return NextResponse.json(
        { error: 'Configuración del servidor incompleta. Contacta al administrador.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: dbError } = await supabase.from('postulaciones').insert({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      neighborhood: neighborhood?.trim() || null,
      experience_type: experience_type || null,
      experience_title: experience_title?.trim() || null,
      experience_description: experience_description?.trim() || null,
      why_join: why_join?.trim() || null,
      social_links: social_links?.trim() || null,
      status: 'nueva',
    });

    if (dbError) {
      console.error('[postulacion] DB insert error:', dbError.message, dbError.code);
      return NextResponse.json(
        { error: 'No se pudo guardar la postulación. Inténtalo de nuevo.' },
        { status: 500 }
      );
    }

    // Send emails (fire-and-forget — don't fail the request if email fails)
    const emailPayload = {
      name: name.trim(), email: email.trim(), phone, neighborhood,
      experience_type, experience_title, experience_description,
      why_join, social_links,
    };
    Promise.allSettled([
      sendPostulacionNotification(emailPayload),
      sendPostulacionConfirmation(emailPayload),
    ]).then((results) => {
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.error(`[postulacion] Email ${i === 0 ? 'admin' : 'user'} error:`, r.reason);
        }
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[postulacion] Unexpected error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
