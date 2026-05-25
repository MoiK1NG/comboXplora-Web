import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendEmpresaNotification } from '../../../lib/email';
import type { EmpresaPayload } from '../../../lib/types';

export async function POST(request: Request) {
  try {
    const body: EmpresaPayload = await request.json();
    const { company_name, contact_name, email, phone, website, interest_type, message, num_people, preferred_date, budget_range } = body;

    if (!company_name?.trim() || !contact_name?.trim() || !email?.trim()) {
      return NextResponse.json(
        { error: 'Empresa, contacto y email son obligatorios.' },
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
        .from('empresas_interesadas')
        .insert({
          company_name: company_name.trim(),
          contact_name: contact_name.trim(),
          email: email.trim(),
          phone,
          website,
          interest_type,
          message,
          num_people,
          preferred_date,
          budget_range,
        });

      if (dbError) {
        console.error('[empresa API] Supabase error:', dbError.message);
      }
    }

    if (process.env.RESEND_API_KEY) {
      await sendEmpresaNotification({ company_name, contact_name, email, phone, website, interest_type, message, num_people, preferred_date, budget_range });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[empresa API] Error:', err);
    return NextResponse.json(
      { error: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}
