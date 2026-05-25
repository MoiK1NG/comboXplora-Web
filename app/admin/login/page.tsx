"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "../../../lib/supabase-client";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";

// Componente interno que usa useSearchParams (requiere Suspense)
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const authError = searchParams.get("error");

  useEffect(() => {
    if (authError === "auth_error") {
      setError("El enlace de autenticación expiró o es inválido. Intenta de nuevo.");
    }
  }, [authError]);

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
        if (authError.message.includes("Invalid login")) {
          setError("Email o contraseña incorrectos.");
        } else {
          setError(authError.message);
        }
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión. Verifica tu internet.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#F4C430]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-amber-900/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Card */}
        <div className="bg-gray-900 rounded-3xl border border-white/5 p-8 shadow-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#F4C430] mb-4 shadow-lg shadow-[#F4C430]/20">
              <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h1 className="font-outfit text-2xl font-black text-white tracking-tight">
              Combo<span className="text-[#F4C430]">Xplora</span>
            </h1>
            <p className="text-gray-500 text-sm font-medium mt-1 tracking-wide">
              Panel Administrativo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error alert */}
            {error && (
              <div className="flex items-start gap-3 bg-red-950/50 border border-red-800/50 text-red-300 rounded-xl px-4 py-3.5 text-sm font-medium">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@comboxplora.com"
                autoComplete="email"
                required
                disabled={isLoading}
                className="w-full px-4 py-3.5 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3.5 pr-12 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#F4C430]/20 mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                "Iniciar sesión"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-6 font-medium">
            Acceso exclusivo para administradores de ComboXplora
          </p>
        </div>

        <p className="text-center text-xs text-gray-700 mt-6">
          © {new Date().getFullYear()} ComboXplora · Todos los derechos reservados
        </p>
      </div>
    </div>
  );
}

// Página exportada con Suspense boundary para useSearchParams
export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#F4C430]" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
