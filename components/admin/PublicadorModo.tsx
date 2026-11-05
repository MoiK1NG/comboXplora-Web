"use client";

import { useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Zap } from "lucide-react";

type Modo = "APAGADO" | "ENSAYO" | "ENCENDIDO";

const MODOS: { value: Modo; label: string; ayuda: string; className: string }[] = [
  { value: "APAGADO", label: "Apagado", ayuda: "No hace nada. Publicas tú.", className: "bg-gray-100 text-gray-600" },
  { value: "ENSAYO", label: "Ensayo", ayuda: "Te avisa qué habría publicado, sin publicar.", className: "bg-amber-50 text-amber-700" },
  { value: "ENCENDIDO", label: "Encendido", ayuda: "Publica lo aprobado los lunes y jueves a las 6:00 p. m.", className: "bg-emerald-50 text-emerald-700" },
];

// Modo del publicador automático que corre en Vercel (tabla publicador_ajustes).
export function PublicadorModo({ supabase, userEmail }: { supabase: SupabaseClient; userEmail: string | null }) {
  const [modo, setModo] = useState<Modo | null>(null);
  const [ultima, setUltima] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    let activo = true;
    Promise.all([
      supabase.from("publicador_ajustes").select("modo").eq("id", 1).maybeSingle(),
      supabase.from("publicador_registro").select("resumen").order("created_at", { ascending: false }).limit(1),
    ]).then(([a, r]) => {
      if (!activo) return;
      if (a.error) { setError(a.error.message); return; }
      setModo((a.data?.modo as Modo) ?? "APAGADO");
      setUltima(r.data?.[0]?.resumen ?? null);
    });
    return () => { activo = false; };
  }, [supabase]);

  const cambiar = async (nuevo: Modo) => {
    if (nuevo === modo) return;
    if (nuevo === "ENCENDIDO" && !window.confirm("Desde ahora el publicador de Vercel publica solo lo aprobado. ¿Apagaste la tarea de la computadora?")) return;
    setGuardando(true);
    const { error: e } = await supabase.from("publicador_ajustes")
      .upsert({ id: 1, modo: nuevo, actualizado_por: userEmail, updated_at: new Date().toISOString() });
    setGuardando(false);
    if (e) setError(e.message);
    else setModo(nuevo);
  };

  if (error) {
    return (
      <p className="text-xs text-gray-400">
        Publicador automático: no se pudo leer su modo. Si la tabla no existe, corré{" "}
        <code className="font-mono">supabase-publicador.sql</code>. ({error})
      </p>
    );
  }
  if (!modo) return null;
  const actual = MODOS.find((m) => m.value === modo)!;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
          <Zap size={12} /> Publicador automático
        </p>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {MODOS.map((m) => (
            <button key={m.value} disabled={guardando} onClick={() => cambiar(m.value)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wider transition-all ${
                modo === m.value ? `${m.className} shadow-sm` : "text-gray-500 hover:text-gray-800"
              }`}>
              {m.label}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-500">{actual.ayuda}</p>
      {ultima && <p className="text-[11px] text-gray-400 break-words">Última corrida: {ultima}</p>}
    </div>
  );
}
