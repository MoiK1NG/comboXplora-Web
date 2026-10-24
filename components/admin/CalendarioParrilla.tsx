"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft, ChevronRight, Film, Images, Lock, Eye, CalendarX2, X, Undo2, AlertTriangle, Inbox,
} from "lucide-react";

/* ─────────────────────────────────────────────────────
   Calendario de la parrilla: cada pieza es una tarjeta que se arrastra a un
   día. En el teléfono (sin arrastre) se toca la tarjeta y después el día.
───────────────────────────────────────────────────── */

export interface PiezaCal {
  id: string;
  titulo: string;
  formato: string | null;
  estado: string;
  pilar: string;
  fecha_programada: string | null;
  assets: string[] | null;
}

interface Props {
  items: PiezaCal[];
  porSemana: number;
  onMover: (id: string, fecha: string | null) => Promise<boolean>;
  onVer: (id: string) => void;
}

const DIAS = ["lun", "mar", "mié", "jue", "vie", "sáb", "dom"];

/* Borde izquierdo de la tarjeta según el estado: de un vistazo se ve qué falta aprobar */
const ESTADO_BORDE: Record<string, string> = {
  idea: "border-l-gray-300",
  tema_propuesto: "border-l-orange-400",
  producir: "border-l-blue-400",
  borrador: "border-l-blue-400",
  auditado: "border-l-purple-400",
  pieza_propuesta: "border-l-orange-500",
  aprobada: "border-l-emerald-500",
  publicada: "border-l-gray-900",
};
const ESTADO_CORTO: Record<string, string> = {
  idea: "Idea", tema_propuesto: "Tema por aprobar", producir: "Producir", borrador: "Borrador",
  auditado: "Auditada", pieza_propuesta: "Por aprobar", aprobada: "Aprobada", publicada: "Publicada",
};

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const desdeIso = (s: string) => { const [y, m, d] = s.slice(0, 10).split("-").map(Number); return new Date(y, m - 1, d); };
const fechaLarga = (s: string) => desdeIso(s).toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
const esVideo = (url: string) => /\.mp4(\?|$)/i.test(url);

/* Semanas (lunes a domingo) que cubren el mes */
function semanasDelMes(anio: number, mes: number): Date[][] {
  const primero = new Date(anio, mes, 1);
  const inicio = new Date(anio, mes, 1 - ((primero.getDay() + 6) % 7));
  const semanas: Date[][] = [];
  const cursor = new Date(inicio);
  do {
    const semana: Date[] = [];
    for (let i = 0; i < 7; i++) { semana.push(new Date(cursor)); cursor.setDate(cursor.getDate() + 1); }
    semanas.push(semana);
  } while (cursor.getMonth() === mes);
  return semanas;
}

export function CalendarioParrilla({ items, porSemana, onMover, onVer }: Props) {
  const hoy = iso(new Date());
  const [mes, setMes] = useState(() => { const d = new Date(); return { anio: d.getFullYear(), mes: d.getMonth() }; });
  const [verIdeas, setVerIdeas] = useState(true);
  const [arrastrando, setArrastrando] = useState<string | null>(null);
  const [sobre, setSobre] = useState<string | null>(null);
  const [elegida, setElegida] = useState<string | null>(null);
  const [ultimo, setUltimo] = useState<{ id: string; antes: string | null; despues: string | null } | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  const visibles = useMemo(
    () => items.filter((i) => i.estado !== "descartada" && (verIdeas || i.estado !== "idea")),
    [items, verIdeas],
  );
  const porDia = useMemo(() => {
    const m = new Map<string, PiezaCal[]>();
    for (const i of visibles) if (i.fecha_programada) {
      const k = i.fecha_programada.slice(0, 10);
      m.set(k, [...(m.get(k) ?? []), i]);
    }
    return m;
  }, [visibles]);
  /* Sin fecha: lo que ya está en camino (no las ideas sueltas, que son muchas) */
  const sinFecha = visibles.filter((i) => !i.fecha_programada && i.estado !== "idea" && i.estado !== "publicada");
  const semanas = semanasDelMes(mes.anio, mes.mes);
  const nombreMes = (() => {
    const s = new Date(mes.anio, mes.mes, 1).toLocaleDateString("es-CO", { month: "long", year: "numeric" });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();
  const pieza = (id: string | null) => items.find((i) => i.id === id);

  async function mover(id: string, fecha: string | null) {
    const p = pieza(id);
    if (!p || p.estado === "publicada") return;
    if (fecha && fecha < hoy) { setAviso("Ese día ya pasó. Elige uno de hoy en adelante."); return; }
    const antes = p.fecha_programada?.slice(0, 10) ?? null;
    if (antes === fecha) return;
    if (await onMover(id, fecha)) { setUltimo({ id, antes, despues: fecha }); setAviso(null); }
    setElegida(null);
  }

  function cambiarMes(delta: number) {
    setMes(({ anio, mes }) => { const d = new Date(anio, mes + delta, 1); return { anio: d.getFullYear(), mes: d.getMonth() }; });
  }

  const tarjeta = (p: PiezaCal, compacta: boolean) => {
    const bloqueada = p.estado === "publicada";
    const reel = p.formato === "reel";
    const Icono = reel ? Film : Images;
    const portada = p.assets?.[0];
    return (
      <div
        key={p.id}
        draggable={!bloqueada}
        onDragStart={(e) => { e.dataTransfer.setData("text/plain", p.id); e.dataTransfer.effectAllowed = "move"; setArrastrando(p.id); }}
        onDragEnd={() => { setArrastrando(null); setSobre(null); }}
        onClick={(e) => { e.stopPropagation(); if (!bloqueada) setElegida(elegida === p.id ? null : p.id); else onVer(p.id); }}
        title={`${p.titulo} · ${ESTADO_CORTO[p.estado] ?? p.estado}`}
        className={`group flex items-center gap-1.5 bg-white rounded-lg border border-gray-200 border-l-4 ${ESTADO_BORDE[p.estado] ?? "border-l-gray-300"} p-1 shadow-sm text-left transition-all ${
          bloqueada ? "opacity-60 cursor-pointer" : "cursor-grab active:cursor-grabbing hover:shadow-md"
        } ${arrastrando === p.id ? "opacity-40" : ""} ${elegida === p.id ? "ring-2 ring-[#F4C430]" : ""} ${p.estado === "idea" ? "border-dashed bg-gray-50" : ""}`}
      >
        <div className="relative flex-shrink-0 w-7 h-9 rounded overflow-hidden bg-gray-100">
          {portada ? (
            esVideo(portada)
              ? <video src={`${portada}#t=0.5`} muted preload="metadata" className="w-full h-full object-cover pointer-events-none" />
              // eslint-disable-next-line @next/next/no-img-element
              : <img src={portada} alt="" className="w-full h-full object-cover pointer-events-none" />
          ) : null}
          <span className={`absolute bottom-0 left-0 p-0.5 rounded-tr ${reel ? "bg-gray-900 text-white" : "bg-sky-100 text-sky-700"}`}>
            <Icono size={8} />
          </span>
        </div>
        <span className={`flex-1 min-w-0 font-semibold text-gray-800 leading-tight ${compacta ? "text-[10px] line-clamp-2" : "text-xs line-clamp-2"}`}>
          {p.titulo}
        </span>
        {bloqueada && <Lock size={10} className="flex-shrink-0 text-gray-400" />}
      </div>
    );
  };

  const zona = (clave: string, fecha: string | null) => ({
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; if (sobre !== clave) setSobre(clave); },
    onDragLeave: () => setSobre((s) => (s === clave ? null : s)),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); setSobre(null); setArrastrando(null); if (id) mover(id, fecha); },
    onClick: () => { if (elegida) mover(elegida, fecha); },
  });

  const elegidaP = pieza(elegida);

  return (
    <div className="space-y-4">
      {/* Barra superior */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button onClick={() => cambiarMes(-1)} className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50" title="Mes anterior"><ChevronLeft size={16} /></button>
          <h2 className="font-outfit text-lg font-black text-gray-900 min-w-[170px] text-center">{nombreMes}</h2>
          <button onClick={() => cambiarMes(1)} className="p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50" title="Mes siguiente"><ChevronRight size={16} /></button>
          <button onClick={() => { const d = new Date(); setMes({ anio: d.getFullYear(), mes: d.getMonth() }); }}
            className="ml-1 px-3 py-2 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-100">Hoy</button>
        </div>
        <label className="flex items-center gap-2 text-xs font-bold text-gray-500 cursor-pointer select-none">
          <input type="checkbox" checked={verIdeas} onChange={(e) => setVerIdeas(e.target.checked)} className="accent-[#F4C430]" />
          Mostrar ideas
        </label>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">
        <span className="font-bold">Arrastra una tarjeta a otro día{" "}<span className="font-normal">(en el teléfono: tócala y después toca el día)</span></span>
        {[["border-l-orange-500", "Por aprobar"], ["border-l-emerald-500", "Aprobada"], ["border-l-blue-400", "En producción"], ["border-l-gray-300", "Idea"], ["border-l-gray-900", "Publicada"]].map(([c, l]) => (
          <span key={l} className="flex items-center gap-1.5"><span className={`w-3 h-3 rounded-sm bg-white border border-gray-200 border-l-4 ${c}`} />{l}</span>
        ))}
      </div>

      {/* Pieza elegida (modo tocar) */}
      {elegidaP && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gray-900 text-white px-4 py-3 text-xs">
          <span className="font-bold flex-1 min-w-0 truncate">Mover «{elegidaP.titulo}»: toca un día</span>
          <button onClick={() => onVer(elegidaP.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold"><Eye size={13} /> Ver</button>
          {elegidaP.fecha_programada && (
            <button onClick={() => mover(elegidaP.id, null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 font-bold"><CalendarX2 size={13} /> Quitar fecha</button>
          )}
          <button onClick={() => setElegida(null)} className="p-1.5 rounded-lg hover:bg-white/10" title="Cancelar"><X size={14} /></button>
        </div>
      )}

      {aviso && (
        <div className="flex items-center gap-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 text-xs font-semibold">
          <AlertTriangle size={14} /> <span className="flex-1">{aviso}</span>
          <button onClick={() => setAviso(null)}><X size={13} /></button>
        </div>
      )}

      {ultimo && !elegidaP && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 text-xs font-semibold">
          <span className="flex-1 min-w-0 truncate">
            «{pieza(ultimo.id)?.titulo}» {ultimo.despues ? `quedó para el ${fechaLarga(ultimo.despues)}` : "quedó sin fecha"}.
          </span>
          <button onClick={async () => { const u = ultimo; setUltimo(null); await onMover(u.id, u.antes); }}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-emerald-200 hover:bg-emerald-100 font-bold">
            <Undo2 size={12} /> Deshacer
          </button>
          <button onClick={() => setUltimo(null)}><X size={13} /></button>
        </div>
      )}

      {/* Sin fecha: arriba, para que el mes tenga todo el ancho */}
      <div {...zona("sin-fecha", null)}
        className={`rounded-2xl border-2 border-dashed p-3 transition-colors ${
          sobre === "sin-fecha" ? "border-[#F4C430] bg-amber-50" : "border-gray-200 bg-white"
        }`}>
        <p className="flex items-center gap-1.5 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <Inbox size={12} /> Sin fecha · {sinFecha.length}
          <span className="normal-case tracking-normal font-medium text-gray-400">· arrástralas a un día; suelta aquí una pieza para quitarle la fecha</span>
        </p>
        {sinFecha.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {sinFecha.map((p) => <div key={p.id} className="w-[200px]">{tarjeta(p, false)}</div>)}
          </div>
        )}
      </div>

      <div>
        {/* Mes */}
        <div className="overflow-x-auto -mx-1 px-1">
          <div className="min-w-[680px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[repeat(7,1fr)_44px] bg-gray-50 border-b border-gray-100">
              {DIAS.map((d) => (
                <div key={d} className="px-2 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
              ))}
              <div className="px-1 py-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center" title="Piezas en la semana">Sem</div>
            </div>
            {semanas.map((semana) => {
              const enSemana = semana.reduce((n, d) => n + (porDia.get(iso(d))?.filter((p) => p.estado !== "idea").length ?? 0), 0);
              return (
                <div key={iso(semana[0])} className="grid grid-cols-[repeat(7,1fr)_44px] border-b border-gray-100 last:border-b-0">
                  {semana.map((d) => {
                    const k = iso(d);
                    const delMes = d.getMonth() === mes.mes;
                    const piezas = porDia.get(k) ?? [];
                    const cruce = piezas.filter((p) => p.estado !== "idea").length > 1;
                    const pasado = k < hoy;
                    return (
                      <div key={k} {...zona(k, k)}
                        className={`min-h-[112px] p-1.5 border-r border-gray-100 flex flex-col gap-1 transition-colors ${
                          sobre === k ? (pasado ? "bg-red-50" : "bg-amber-50 ring-2 ring-inset ring-[#F4C430]") : delMes ? "bg-white" : "bg-gray-50/60"
                        } ${elegida && !pasado ? "cursor-pointer hover:bg-amber-50" : ""}`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full ${
                            k === hoy ? "bg-[#F4C430] text-gray-900" : delMes ? (pasado ? "text-gray-300" : "text-gray-700") : "text-gray-300"
                          }`}>{d.getDate()}</span>
                          {cruce && <span title="Dos piezas el mismo día" className="text-[9px] font-black text-red-600 bg-red-50 px-1.5 rounded">×{piezas.filter((p) => p.estado !== "idea").length}</span>}
                        </div>
                        {piezas.map((p) => tarjeta(p, true))}
                      </div>
                    );
                  })}
                  <div className={`flex items-center justify-center text-[11px] font-black ${
                    enSemana > porSemana ? "text-red-600 bg-red-50" : enSemana === porSemana ? "text-emerald-600 bg-emerald-50" : "text-gray-400"
                  }`} title={`${enSemana} piezas (sin contar ideas); el ritmo es ${porSemana} por semana`}>
                    {enSemana}/{porSemana}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
