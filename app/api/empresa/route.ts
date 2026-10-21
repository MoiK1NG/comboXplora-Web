import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmpresaNotification } from '../../../lib/email';
import type { EmpresaPayload } from '../../../lib/types';

const INTEREST_TYPES = new Set(['sponsorship', 'partnership', 'booking_group', 'csr', 'other']);

export async function POST(request: Request) {
  try {
    const body: EmpresaPayload = await request.json();
    const { company_name, contact_name, email, phone, website, interest_type, message, num_people, preferred_date, budget_range } = body;

    if (!company_name?.trim() || !contact_name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Empresa, persona de contacto y correo son obligatorios.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'El correo no parece válido.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Service role si existe; si no, la anon key (la tabla permite INSERT público)
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('[empresa] Supabase env vars missing');
      return NextResponse.json({ error: 'Configuración del servidor incompleta.' }, { status: 500 });
    }

    const clean = (s?: string | null) => (s && s.trim() ? s.trim() : null);
    const people = Number(num_people);

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: dbError } = await supabase.from('empresas_interesadas').insert({
      company_name: company_name.trim(),
      contact_name: contact_name.trim(),
      email: email.trim().toLowerCase(),
      phone: clean(phone),
      website: clean(website),
      interest_type: interest_type && INTEREST_TYPES.has(interest_type) ? interest_type : null,
      message: clean(message),
      num_people: Number.isFinite(people) && people > 0 ? Math.round(people) : null,
      preferred_date: clean(preferred_date),
      budget_range: clean(budget_range),
      status: 'nuevo',
    });

    if (dbError) {
      console.error('[empresa] DB insert error:', dbError.message, dbError.code);
      return NextResponse.json({ error: 'No se pudo guardar. Inténtalo de nuevo o escríbenos por WhatsApp.' }, { status: 500 });
    }

    // El correo no debe frenar la respuesta ni hacerla fallar
    if (process.env.RESEND_API_KEY) {
      sendEmpresaNotification({ company_name, contact_name, email, phone, website, interest_type, message, num_people, preferred_date, budget_range })
        .catch((err) => console.error('[empresa] Email error:', err));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[empresa] Unexpected error:', err);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
