import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BUCKET = 'comboxplora-media';

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json(
        { error: 'Storage no configurado.' },
        { status: 503 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) {
      return NextResponse.json({ error: 'No se recibió archivo.' }, { status: 400 });
    }

    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic'];
    if (!allowedTypes.includes(file.type) && file.type !== '') {
      // Si no detecta tipo (HEIC en algunos navegadores), lo dejamos pasar
      if (file.type !== '') {
        return NextResponse.json(
          { error: 'Tipo de archivo no permitido. Usa JPG, PNG o WebP.' },
          { status: 400 }
        );
      }
    }

    // Limitar tamaño: 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Archivo demasiado grande. Máximo 10MB.' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const ext = file.name.split('.').pop() || 'jpg';
    const uniqueName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const supabase = createClient(supabaseUrl, serviceKey);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(uniqueName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: false,
      });

    if (uploadError) {
      console.error('[upload API] Storage error:', uploadError.message);
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET)
      .getPublicUrl(uniqueName);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    console.error('[upload API] Error:', err);
    return NextResponse.json(
      { error: 'Error al subir el archivo.' },
      { status: 500 }
    );
  }
}
