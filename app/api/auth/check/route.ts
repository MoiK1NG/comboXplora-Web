/**
 * GET /api/auth/check
 * Ruta de diagnóstico — SOLO disponible en desarrollo.
 * Muestra el estado de la conexión con Supabase y los usuarios admin.
 *
 * Abrir en el navegador: http://localhost:3000/api/auth/check
 */

import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
  // ── Solo disponible en desarrollo ─────────────────────────────
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { error: "Diagnóstico no disponible en producción." },
      { status: 403 }
    );
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // ── 1. Verificar que las variables de entorno existen ─────────
  const envCheck = {
    NEXT_PUBLIC_SUPABASE_URL: url
      ? `✅ ${url.substring(0, 40)}…`
      : "❌ FALTA (undefined)",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: anonKey
      ? `✅ …${anonKey.slice(-8)}`
      : "❌ FALTA (undefined)",
    SUPABASE_SERVICE_ROLE_KEY: serviceKey
      ? `✅ …${serviceKey.slice(-8)}`
      : "❌ FALTA (undefined)",
  };

  if (!url || !serviceKey) {
    return NextResponse.json({
      diagnóstico: "❌ Variables de entorno faltantes",
      variables: envCheck,
    });
  }

  // ── 2. Conectar con clave de servicio y listar usuarios ────────
  const admin = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { data, error } = await admin.auth.admin.listUsers();

    if (error) {
      return NextResponse.json({
        diagnóstico: "❌ Error al conectar con Supabase Auth",
        error: error.message,
        variables: envCheck,
      });
    }

    const users = (data?.users ?? []).map((u) => ({
      email: u.email,
      id: u.id,
      emailConfirmado: u.email_confirmed_at
        ? `✅ ${u.email_confirmed_at}`
        : "❌ NO confirmado (causa del error de login)",
      creadoEl: u.created_at,
      últimoLogin: u.last_sign_in_at ?? "Nunca",
    }));

    const hayAdmin = users.some((u) =>
      u.email?.includes("comboxplora") || u.email?.includes("admin")
    );

    return NextResponse.json({
      diagnóstico: hayAdmin
        ? "✅ Usuario admin encontrado"
        : "⚠️ No hay usuario admin — ejecuta supabase-admin-user.sql",
      totalUsuarios: users.length,
      usuarios: users,
      variables: envCheck,
      instrucciones: hayAdmin
        ? "Si el login falla, verifica que emailConfirmado sea ✅. Si no, ejecuta supabase-admin-user.sql."
        : "Ejecuta supabase-admin-user.sql en Supabase SQL Editor para crear el usuario admin.",
    });
  } catch (err: any) {
    return NextResponse.json({
      diagnóstico: "❌ Excepción al llamar a Supabase",
      error: err?.message ?? String(err),
      variables: envCheck,
    });
  }
}
