"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClient } from "../../../lib/supabase-client";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";

/* ─────────────────────────────────────────────────────
   Formulario (necesita Suspense por useSearchParams)
───────────────────────────────────────────────────── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Mostrar error si viene del callback de auth
  useEffect(() => {
    if (searchParams.get("error") === "auth_error") {
      setError("El enlace de autenticación expiró o es inválido. Intenta de nuevo.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        // Mensajes de error claros en español
        const msg = authError.message.toLowerCase();
        if (msg.includes("invalid login") || msg.includes("invalid credentials")) {
          setError("Usuario o contraseña incorrectos. Verifica tus datos.");
        } else if (msg.includes("email not confirmed")) {
          setError("Debes confirmar tu correo antes de ingresar.");
        } else if (msg.includes("too many requests")) {
          setError("Demasiados intentos. Espera unos minutos.");
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      // Login exitoso → pequeño feedback visual antes de redirigir
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 800);
    } catch {
      setError("Error de conexión. Verifica tu internet e intenta de nuevo.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Blobs de fondo orgánicos */}
      <div className="absolute top-[-10%] right-[-8%] w-[50%] h-[50%] bg-[#F4C430]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-8%] left-[-10%] w-[45%] h-[45%] bg-emerald-400/7 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[35%] left-[2%] w-[18%] h-[18%] bg-[#F4C430]/6 rounded-full blur-[60px] pointer-events-none" />

      {/* Dot grid sutil */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Card */}
        <div className="bg-white rounded-[2rem] border border-gray-100/80 p-8 shadow-[0_24px_64px_-16px_rgba(0,0,0,0.12)]">

          {/* Logo oficial */}
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

          {/* Bienvenida */}
          <p className="text-center text-gray-500 text-sm font-medium mb-6 leading-relaxed">
            Ingresa tus credenciales para acceder al panel de control de ComboXplora.
          </p>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3.5 text-sm font-medium">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            {/* Éxito */}
            {success && (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl px-4 py-3.5 text-sm font-semibold">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Sesión iniciada correctamente. Redirigiendo…</span>
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-[#F4C430] hover:bg-[#E3B520] active:scale-[0.98] text-gray-900 font-black text-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#F4C430]/25 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Iniciando sesión…
                </>
              ) : success ? (
                <>
                  <CheckCircle size={16} />
                  ¡Bienvenido!
                </>
              ) : (
                "Ingresar al panel →"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 font-medium mt-6">
          Acceso exclusivo para administradores de ComboXplora
          <br />
          © {new Date().getFullYear()} ComboXplora · Barranquilla, Colombia
        </p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Export con Suspense (requerido por useSearchParams)
───────────────────────────────────────────────────── */
export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-4">
          <div className="relative w-48 h-14">
            <Image src="/logos/logo_principal.png" alt="ComboXplora" fill className="object-contain" priority />
          </div>
          <Loader2 size={24} className="animate-spin text-[#F4C430]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
