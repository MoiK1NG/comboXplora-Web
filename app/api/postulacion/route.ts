import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendPostulacionNotification } from '../../../lib/email';
import type { PostulacionPayload } from '../../../lib/types';

export async function POST(request: Request) {
  try {
    const body: PostulacionPayload = await request.json();
    const { name, email, phone, neighborhood, experience_type, experience_title, experience_description, why_join, social_links } = body;

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Nombre y email son obligatorios.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && serviceKey) {
      const supabase = createClient(supabaseUrl, serviceKey);
      const { error: dbError } = await supabase
        .from('postulaciones')
        .insert({
          name: name.trim(),
          email: email.trim(),
          phone,
          neighborhood,
          experience_type,
          experience_title,
          experience_description,
          why_join,
          social_links,
        });

      if (dbError) {
        console.error('[postulacion API] Supabase error:', dbError.message);
      }
    }

    if (process.env.RESEND_API_KEY) {
      await sendPostulacionNotification({ name, email, phone, neighborhood, experience_type, experience_title, experience_description, why_join, social_links });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[postulacion API] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
