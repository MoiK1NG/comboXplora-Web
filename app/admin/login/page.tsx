"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../../lib/supabase-client";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle, Info } from "lucide-react";

/* ─────────────────────────────────────────────────────
   Mapa de códigos de error Supabase → mensajes en español
───────────────────────────────────────────────────── */
function translateAuthError(message: string, code?: string): string {
  const m = message.toLowerCase();
  const c = (code ?? "").toLowerCase();

  if (
    m.includes("invalid login credentials") ||
    m.includes("invalid credentials") ||
    m.includes("invalid login") ||
    c === "invalid_credentials"
  ) {
    return "Credenciales incorrectas. Verifica tu email y contraseña.";
  }
  if (m.includes("email not confirmed") || c === "email_not_confirmed") {
    return "El email no está confirmado. Ejecuta el script supabase-admin-user.sql en el SQL Editor de Supabase.";
  }
  if (m.includes("too many requests") || c === "over_request_rate_limit") {
    return "Demasiados intentos fallidos. Espera unos minutos antes de intentar de nuevo.";
  }
  if (m.includes("user not found") || c === "user_not_found") {
    return "No existe una cuenta con este email. Crea el usuario admin en Supabase.";
  }
  if (m.includes("network") || m.includes("fetch")) {
    return "Error de red. Verifica tu conexión a internet.";
  }
  // Devolver el mensaje original si no hay traducción
  return message;
}

/* ─────────────────────────────────────────────────────
   Formulario principal
───────────────────────────────────────────────────── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rawError, setRawError] = useState<string | null>(null); // código crudo para debug
  const [success, setSuccess] = useState(false);
  const [supabaseUrl, setSupabaseUrl] = useState<string>("");

  useEffect(() => {
    // Mostrar URL de Supabase que se está usando (para verificar env vars)
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    setSupabaseUrl(url);

    if (searchParams.get("error") === "auth_error") {
      setError("El enlace de autenticación expiró o es inválido. Intenta de nuevo.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setRawError(null);

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    setIsLoading(true);

    console.log("[AUTH] Intentando login con:", trimmedEmail);
    console.log("[AUTH] Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);

    try {
      const supabase = createClient();

      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (authError) {
        console.error("[AUTH] Error de Supabase:", {
          message: authError.message,
          code: authError.code ?? "sin código",
          status: authError.status,
        });

        setError(translateAuthError(authError.message, authError.code ?? ""));
        // Mostrar código técnico en desarrollo para ayudar al debug
        if (process.env.NODE_ENV === "development") {
          setRawError(`[${authError.code ?? authError.status ?? "?"}] ${authError.message}`);
        }
        setIsLoading(false);
        return;
      }

      console.log("[AUTH] Login exitoso. Usuario:", data.user?.email);
      setSuccess(true);

      // Pequeño delay para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 700);

    } catch (err: any) {
      console.error("[AUTH] Excepción inesperada:", err);
      setError("Error inesperado de conexión. Verifica tu internet e intenta de nuevo.");
      if (process.env.NODE_ENV === "development") {
        setRawError(err?.message ?? String(err));
      }
      setIsLoading(false);
    }
  }

  const isPlaceholder =
    !supabaseUrl || supabaseUrl.includes("placeholder");

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blobs orgánicos de fondo */}
      <div className="absolute top-[-10%] right-[-8%] w-[50%] h-[50%] bg-[#F4C430]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-10%] w-[45%] h-[45%] bg-emerald-400/7 rounded-full blur-[100px] pointer-events-none" />

      {/* Dot-grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">

        {/* ── Alerta de env vars faltantes ── */}
        {isPlaceholder && (
          <div className="mb-4 flex items-start gap-3 bg-amber-50 border border-amber-300 text-amber-800 rounded-2xl px-4 py-3.5 text-xs font-medium">
            <Info size={15} className="flex-shrink-0 mt-0.5" />
            <div>
              <strong>Variables de entorno no cargadas.</strong> Verifica que <code>.env.local</code> exista y tenga <code>NEXT_PUBLIC_SUPABASE_URL</code>.
            </div>
          </div>
        )}

        {/* ── Card principal ── */}
        <div className="bg-white rounded-[2rem] border border-gray-100/80 p-8 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.12)]">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative w-52 h-16 mb-2">
              <Image
                src="/logos/logo_principal.png"
                alt="ComboXplora"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-3 mb-4" />
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-500">
                Panel Administrativo
              </span>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm font-medium mb-6 leading-relaxed">
            Ingresa tus credenciales para acceder al panel de control.
          </p>

          {/* ── Formulario ── */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error traducido */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3.5 text-sm font-medium">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                <div className="space-y-1">
                  <span>{error}</span>
                  {/* Código técnico — solo en desarrollo */}
                  {rawError && (
                    <p className="text-[10px] font-mono text-red-400 mt-1 break-all">
                      {rawError}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Éxito */}
            {success && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-4 py-3.5 text-sm font-semibold">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Sesión iniciada. Redirigiendo al panel…</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@comboxplora.com"
                autoComplete="email"
                required
                disabled={isLoading || success}
                className="w-full px-4 py-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430] focus:bg-white transition-all disabled:opacity-60"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-[11px] font-black text-gray-500 uppercase tracking-[0.15em] mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isLoading || success}
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430] focus:bg-white transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={isLoading || success || isPlaceholder}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#F4C430] hover:bg-[#E3B520] active:scale-[0.98] text-gray-900 font-black text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#F4C430]/25 mt-2"
            >
              {isLoading ? (
                <><Loader2 size={16} className="animate-spin" /> Iniciando sesión…</>
              ) : success ? (
                <><CheckCircle size={16} /> ¡Bienvenido!</>
              ) : (
                "Ingresar al panel →"
              )}
            </button>
          </form>

          {/* ── Info de Supabase (solo dev) ── */}
          {process.env.NODE_ENV === "development" && supabaseUrl && !isPlaceholder && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-mono text-center break-all">
                🔗 {supabaseUrl}
              </p>
              <p className="text-[10px] text-gray-400 text-center mt-1">
                <a href="/api/auth/check" target="_blank" className="underline hover:text-gray-600">
                  Ver diagnóstico de auth →
                </a>
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 font-medium mt-6 leading-relaxed">
          Acceso exclusivo · ComboXplora © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Export con Suspense (necesario por useSearchParams)
───────────────────────────────────────────────────── */
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-4">
          <div className="relative w-48 h-14">
            <Image
              src="/logos/logo_principal.png"
              alt="ComboXplora"
              fill
              className="object-contain"
              priority
            />
          </div>
          <Loader2 size={22} className="animate-spin text-[#F4C430]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
