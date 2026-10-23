"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import {
  Plus, X, Save, Loader2, Search, CalendarDays, CheckCircle2, Undo2,
  Trash2, Edit2, ExternalLink, Sparkles, Ban, Send, Instagram, ArrowRight,
  Eye, ChevronLeft, ChevronRight, Copy, Check, ImageOff, Download, Film, Images, Clock,
} from "lucide-react";

/* ─────────────────────────────────────────────────────
   Tipos y catálogos
───────────────────────────────────────────────────── */
type Pilar = "xplorers" | "hacedores" | "empresas" | "notoriedad";
type Estado =
  | "idea" | "tema_propuesto" | "producir" | "borrador" | "auditado"
  | "pieza_propuesta" | "aprobada" | "publicada" | "descartada";

interface Pieza {
  id: string;
  titulo: string;
  pilar: Pilar;
  formato: string | null;
  estado: Estado;
  origen: string;
  hacedor_id: string | null;
  experiencia_id: string | null;
  fuente_url: string | null;
  fuente_fecha: string | null;
  hueco: string | null;
  nota: number | null;
  motivo: string | null;
  fecha_programada: string | null;
  borrador: string | null;
  auditoria: string | null;
  gancho: string | null;
  caption: string | null;
  assets: string[] | null;
  tema_aprobado_at: string | null;
  pieza_aprobada_at: string | null;
  aprobado_por: string | null;
  ig_media_id: string | null;
  ig_permalink: string | null;
  publicada_at: string | null;
  metricas: Record<string, number> | null;
  metricas_at: string | null;
  notas_admin: string | null;
  created_at: string;
  updated_at: string | null;
}

const PILARES: { value: Pilar; label: string; className: string }[] = [
  { value: "xplorers",   label: "Xplorers",   className: "bg-amber-50 text-amber-700 border-amber-200" },
  { value: "hacedores",  label: "Hacedores",  className: "bg-teal-50 text-teal-700 border-teal-200" },
  { value: "empresas",   label: "Empresas",   className: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { value: "notoriedad", label: "Notoriedad", className: "bg-rose-50 text-rose-700 border-rose-200" },
];

const ESTADOS: { value: Estado; label: string; className: string }[] = [
  { value: "idea",            label: "Idea",               className: "bg-gray-50 text-gray-600 border-gray-200" },
  { value: "tema_propuesto",  label: "Tema por aprobar",   className: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "producir",        label: "Producir",           className: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "borrador",        label: "Borrador",           className: "bg-blue-50 text-blue-700 border-blue-200" },
  { value: "auditado",        label: "Auditado",           className: "bg-purple-50 text-purple-700 border-purple-200" },
  { value: "pieza_propuesta", label: "Pieza por aprobar",  className: "bg-orange-50 text-orange-700 border-orange-200" },
  { value: "aprobada",        label: "Aprobada",           className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { value: "publicada",       label: "Publicada",          className: "bg-gray-900 text-white border-gray-900" },
  { value: "descartada",      label: "Descartada",         className: "bg-gray-50 text-gray-400 border-gray-200" },
];

const ORIGENES = [
  { value: "manual",   label: "Manual" },
  { value: "radar",    label: "Radar" },
  { value: "selector", label: "Selector" },
];

const FORMATOS = [
  { value: "carrusel", label: "Carrusel" },
  { value: "reel",     label: "Reel" },
  { value: "imagen",   label: "Imagen" },
  { value: "historia", label: "Historia" },
];

/* Formato bien visible en la tarjeta: reel y carrusel con color e ícono propios */
const FORMATO_ESTILO: Record<string, { className: string; Icono: typeof Film }> = {
  reel:     { className: "bg-gray-900 text-white border-gray-900", Icono: Film },
  carrusel: { className: "bg-sky-50 text-sky-700 border-sky-200", Icono: Images },
};

/* Filtro por formato arriba de la lista */
const FILTROS_FORMATO = [
  { value: "todos",    label: "Todos" },
  { value: "reel",     label: "Reels" },
  { value: "carrusel", label: "Carruseles" },
] as const;
type FiltroFormato = (typeof FILTROS_FORMATO)[number]["value"];

/* Una pieza creada o tocada en los últimos días lleva etiqueta */
const DIAS_RECIENTE = 3;
const tocadaAt = (i: Pieza) => i.updated_at ?? i.created_at;
const esReciente = (iso: string) => Date.now() - new Date(iso).getTime() < DIAS_RECIENTE * 86_400_000;

function haceCuanto(iso: string): string {
  const min = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (min < 60) return `hace ${Math.max(min, 1)} min`;
  if (min < 24 * 60) return `hace ${Math.round(min / 60)} h`;
  const dias = Math.round(min / (24 * 60));
  return dias < 7 ? `hace ${dias} ${dias === 1 ? "día" : "días"}` : fechaCorta(iso);
}

/* Pestañas: agrupan estados según lo que Moisés tiene que hacer */
const TABS: { key: string; label: string; estados: Estado[] }[] = [
  { key: "aprobar",    label: "Por aprobar",   estados: ["tema_propuesto", "pieza_propuesta"] },
  { key: "ideas",      label: "Ideas",         estados: ["idea"] },
  { key: "produccion", label: "En producción", estados: ["producir", "borrador", "auditado"] },
  { key: "listas",     label: "Listas",        estados: ["aprobada"] },
  { key: "publicadas", label: "Publicadas",    estados: ["publicada"] },
  { key: "descartadas",label: "Descartadas",   estados: ["descartada"] },
];

/* Avances dentro de producción: un paso por etapa, sin saltarse la auditoría */
const AVANCES: Partial<Record<Estado, { a: Estado; label: string; mensaje: string }>> = {
  producir:  { a: "borrador",        label: "Borrador listo",           mensaje: "Pieza en borrador." },
  borrador:  { a: "auditado",        label: "Auditada sin bloqueantes", mensaje: "Pieza auditada." },
  auditado:  { a: "pieza_propuesta", label: "Proponer publicación",     mensaje: "Pieza propuesta. Queda por aprobar." },
  aprobada:  { a: "publicada",       label: "Marcar publicada",         mensaje: "Pieza marcada como publicada." },
};

/* Ritmo y mix vigentes (contenido/criterio/criterio.md) */
/* Modo pausa (experiencias en pausa, contenido/criterio/criterio.md): 6 de Notoriedad
   y 2 de Hacedores al mes. Cuando vuelvan las experiencias: 2 por pilar. */
const MODO = "pausa";
const META_MES: Record<Pilar, number> = { xplorers: 0, hacedores: 2, empresas: 0, notoriedad: 6 };
const ESTADOS_QUE_CUENTAN: Estado[] = [
  "producir", "borrador", "auditado", "pieza_propuesta", "aprobada", "publicada",
];

const pilarInfo = (p: string) => PILARES.find((x) => x.value === p);
const estadoInfo = (e: string) => ESTADOS.find((x) => x.value === e);

function mesActual(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function fechaCorta(iso: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function Pill({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}

/* ─────────────────────────────────────────────────────
   Panel de edición
───────────────────────────────────────────────────── */
const VACIA: Partial<Pieza> = { titulo: "", pilar: "xplorers", estado: "idea", origen: "manual", assets: [] };

function PiezaPanel({
  item, isNew, hacedores, experiencias, onClose, onSave, isSaving,
}: {
  item: Partial<Pieza> | null;
  isNew: boolean;
  hacedores: { id: string; name: string }[];
  experiencias: { id: string; title: string }[];
  onClose: () => void;
  onSave: (data: Partial<Pieza>) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Partial<Pieza>>(VACIA);
  const [assetsText, setAssetsText] = useState("");

  useEffect(() => {
    if (item) {
      setForm({ ...item });
      setAssetsText((item.assets ?? []).join("\n"));
    }
  }, [item]);

  if (!item) return null;

  const set = <K extends keyof Pieza>(field: K, value: Pieza[K] | null) =>
    setForm((prev) => ({ ...prev, [field]: value }));
  const str = (v: string) => (v.trim() === "" ? null : v);

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white transition-all";
  const labelCls = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5";
  const legend = (n: number, text: string, color: string) => (
    <legend className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${color}`}>{n}</span>
      {text}
    </legend>
  );

  function handleSave() {
    const assets = assetsText.split("\n").map((s) => s.trim()).filter(Boolean);
    onSave({ ...form, assets });
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-outfit text-xl font-black text-gray-900">
              {isNew ? "Nueva idea" : "Editar pieza"}
            </h2>
            {!isNew && form.estado && (
              <div className="mt-1.5"><Pill className={estadoInfo(form.estado)?.className ?? ""}>{estadoInfo(form.estado)?.label}</Pill></div>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-7">
          {/* 1. Tema */}
          <fieldset className="space-y-3">
            {legend(1, "Tema", "bg-amber-100 text-amber-700")}
            <div>
              <label className={labelCls}>Título del tema</label>
              <input className={inputCls} value={form.titulo ?? ""} onChange={(e) => set("titulo", e.target.value)}
                placeholder="Ej.: Un sábado haciendo bollo con la seño Carmen" />
            </div>
            <div>
              <label className={labelCls}>Pilar</label>
              <div className="grid grid-cols-4 gap-2">
                {PILARES.map((p) => (
                  <button key={p.value} type="button" onClick={() => set("pilar", p.value)}
                    className={`py-2 rounded-xl text-[11px] font-black uppercase tracking-wide border-2 transition-all ${
                      form.pilar === p.value ? p.className + " border-current" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
                    }`}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Formato</label>
                <select className={inputCls} value={form.formato ?? ""} onChange={(e) => set("formato", str(e.target.value))}>
                  <option value="">— Sin definir —</option>
                  {FORMATOS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Fecha programada</label>
                <input type="date" className={inputCls} value={form.fecha_programada ?? ""}
                  onChange={(e) => set("fecha_programada", str(e.target.value))} />
              </div>
              <div>
                <label className={labelCls}>Hacedor</label>
                <select className={inputCls} value={form.hacedor_id ?? ""} onChange={(e) => set("hacedor_id", str(e.target.value))}>
                  <option value="">— Ninguno —</option>
                  {hacedores.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Experiencia</label>
                <select className={inputCls} value={form.experiencia_id ?? ""} onChange={(e) => set("experiencia_id", str(e.target.value))}>
                  <option value="">— Ninguna —</option>
                  {experiencias.map((x) => <option key={x.id} value={x.id}>{x.title}</option>)}
                </select>
              </div>
            </div>
          </fieldset>

          {/* 2. Por qué */}
          <fieldset className="space-y-3">
            {legend(2, "Por qué esta pieza", "bg-blue-100 text-blue-700")}
            {isNew && (
              <div>
                <label className={labelCls}>Origen</label>
                <select className={inputCls} value={form.origen ?? "manual"} onChange={(e) => set("origen", e.target.value)}>
                  {ORIGENES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className={labelCls}>Nota (0-10)</label>
                <input type="number" min={0} max={10} step={0.1} className={inputCls} value={form.nota ?? ""}
                  onChange={(e) => set("nota", e.target.value === "" ? null : Number(e.target.value))} />
              </div>
              <div className="col-span-2">
                <label className={labelCls}>Fuente (enlace)</label>
                <input className={inputCls} value={form.fuente_url ?? ""} onChange={(e) => set("fuente_url", str(e.target.value))}
                  placeholder="https://www.instagram.com/p/…" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Fecha de la fuente</label>
              <input type="date" className={inputCls} value={form.fuente_fecha ?? ""}
                onChange={(e) => set("fuente_fecha", str(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Hueco que cubre</label>
              <input className={inputCls} value={form.hueco ?? ""} onChange={(e) => set("hueco", str(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Motivo del selector</label>
              <textarea className={inputCls} rows={4} value={form.motivo ?? ""} onChange={(e) => set("motivo", str(e.target.value))} />
            </div>
          </fieldset>

          {/* 3. Pieza */}
          <fieldset className="space-y-3">
            {legend(3, "Pieza", "bg-purple-100 text-purple-700")}
            <div>
              <label className={labelCls}>Gancho</label>
              <input className={inputCls} value={form.gancho ?? ""} onChange={(e) => set("gancho", str(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Caption</label>
              <textarea className={inputCls} rows={7} value={form.caption ?? ""} onChange={(e) => set("caption", str(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Borrador / guion</label>
              <textarea className={inputCls} rows={6} value={form.borrador ?? ""} onChange={(e) => set("borrador", str(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Auditoría del editor jefe</label>
              <textarea className={inputCls} rows={4} value={form.auditoria ?? ""} onChange={(e) => set("auditoria", str(e.target.value))} />
            </div>
            <div>
              <label className={labelCls}>Imágenes o videos (una URL por línea)</label>
              <textarea className={inputCls} rows={3} value={assetsText} onChange={(e) => setAssetsText(e.target.value)} />
            </div>
          </fieldset>

          {/* 4. Publicación */}
          {!isNew && (
            <fieldset className="space-y-3">
              {legend(4, "Publicación", "bg-gray-200 text-gray-700")}
              <div>
                <label className={labelCls}>Enlace en Instagram</label>
                <input className={inputCls} value={form.ig_permalink ?? ""} onChange={(e) => set("ig_permalink", str(e.target.value))} />
              </div>
              {form.metricas && (
                <div className="p-4 bg-gray-50 rounded-2xl">
                  <p className={labelCls}>
                    Métricas {form.metricas_at && <>· {new Date(form.metricas_at).toLocaleDateString("es-CO")}</>}
                  </p>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {Object.entries(form.metricas).map(([k, v]) => (
                      <div key={k}>
                        <div className="font-outfit font-black text-gray-900">{v.toLocaleString("es-CO")}</div>
                        <div className="text-[10px] text-gray-400 uppercase tracking-wider">{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(form.tema_aprobado_at || form.pieza_aprobada_at) && (
                <div className="text-xs text-gray-400 leading-relaxed space-y-0.5">
                  {form.tema_aprobado_at && <p>Tema aprobado: {new Date(form.tema_aprobado_at).toLocaleString("es-CO")}</p>}
                  {form.pieza_aprobada_at && <p>Pieza aprobada: {new Date(form.pieza_aprobada_at).toLocaleString("es-CO")}</p>}
                  {form.aprobado_por && <p>Por: {form.aprobado_por}</p>}
                </div>
              )}
            </fieldset>
          )}

          {/* Notas */}
          <fieldset>
            <label className={labelCls}>Notas internas</label>
            <textarea className={inputCls} rows={3} value={form.notas_admin ?? ""}
              onChange={(e) => set("notas_admin", str(e.target.value))} />
          </fieldset>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !form.titulo?.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 shadow-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Guardando..." : isNew ? "Guardar idea" : "Guardar cambios"}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Visor: la publicación tal como va a salir
───────────────────────────────────────────────────── */
// ZIP sin compresión (método "store"): las láminas ya son JPG, comprimirlas no
// ahorra nada y así no sumamos una dependencia solo para esto.
const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(data: Uint8Array) {
  let c = 0xffffffff;
  for (const b of data) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function zipStore(files: { name: string; data: Uint8Array }[]): Blob {
  const partes: BlobPart[] = [];
  const central: BlobPart[] = [];
  let offset = 0;
  let centralSize = 0;
  for (const f of files) {
    const nombre = new TextEncoder().encode(f.name);
    const crc = crc32(f.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, f.data.length, true);
    local.setUint32(22, f.data.length, true);
    local.setUint16(26, nombre.length, true);
    partes.push(local.buffer, nombre, f.data as Uint8Array<ArrayBuffer>);
    const cen = new DataView(new ArrayBuffer(46));
    cen.setUint32(0, 0x02014b50, true);
    cen.setUint16(4, 20, true);
    cen.setUint16(6, 20, true);
    cen.setUint32(16, crc, true);
    cen.setUint32(20, f.data.length, true);
    cen.setUint32(24, f.data.length, true);
    cen.setUint16(28, nombre.length, true);
    cen.setUint32(42, offset, true);
    central.push(cen.buffer, nombre);
    offset += 30 + nombre.length + f.data.length;
    centralSize += 46 + nombre.length;
  }
  const fin = new DataView(new ArrayBuffer(22));
  fin.setUint32(0, 0x06054b50, true);
  fin.setUint16(8, files.length, true);
  fin.setUint16(10, files.length, true);
  fin.setUint32(12, centralSize, true);
  fin.setUint32(16, offset, true);
  return new Blob([...partes, ...central, fin.buffer], { type: "application/zip" });
}

// Los reels se guardan como .mp4 en assets; el resto son láminas .jpg.
const esVideo = (url: string) => /\.mp4(\?|$)/i.test(url);
// Con #t el navegador pinta un cuadro del video como miniatura en vez de negro.
const miniaturaVideo = (url: string) => `${url}#t=0.5`;

const slugDe = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function Visor({
  item, onClose, onEdit, acciones,
}: {
  item: Pieza | null;
  onClose: () => void;
  onEdit: (p: Pieza) => void;
  acciones: (p: Pieza) => React.ReactNode;
}) {
  const [idx, setIdx] = useState(0);
  const [copiado, setCopiado] = useState(false);
  const [descarga, setDescarga] = useState<"nada" | "bajando" | "listo" | "error">("nada");
  const fotos = item?.assets ?? [];

  useEffect(() => {
    if (!item) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => Math.min(i + 1, fotos.length - 1));
      if (e.key === "ArrowLeft") setIdx((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, fotos.length, onClose]);

  if (!item) return null;
  const actual = Math.min(idx, Math.max(fotos.length - 1, 0));
  const p = pilarInfo(item.pilar);
  const e = estadoInfo(item.estado);

  async function descargarTodo() {
    if (!item || !fotos.length) return;
    setDescarga("bajando");
    try {
      const base = `${item.fecha_programada ?? "sin-fecha"}-${slugDe(item.titulo)}`;
      const files = await Promise.all(fotos.map(async (url, i) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Lámina ${i + 1}: ${res.status}`);
        return { name: `${base}-${String(i + 1).padStart(2, "0")}.${esVideo(url) ? "mp4" : "jpg"}`, data: new Uint8Array(await res.arrayBuffer()) };
      }));
      // Un reel es un solo .mp4: se baja tal cual, sin envolverlo en un zip.
      const solo = files.length === 1 && esVideo(fotos[0]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(solo
        ? new Blob([files[0].data as Uint8Array<ArrayBuffer>], { type: "video/mp4" })
        : zipStore(files));
      a.download = solo ? `${base}.mp4` : `${base}.zip`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 10000);
      setDescarga("listo");
    } catch {
      setDescarga("error");
    }
    setTimeout(() => setDescarga("nada"), 2500);
  }

  async function copiar() {
    if (!item?.caption) return;
    await navigator.clipboard.writeText(item.caption);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  const bloque = (titulo: string, contenido: string | null, extra?: React.ReactNode) =>
    contenido ? (
      <section>
        <div className="flex items-center justify-between mb-1.5">
          <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{titulo}</h4>
          {extra}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{contenido}</p>
      </section>
    ) : null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-3 sm:p-6">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-6xl max-h-[94vh] bg-white rounded-3xl shadow-2xl overflow-y-auto lg:overflow-hidden flex flex-col lg:flex-row">
        {/* Láminas */}
        <div className="lg:w-[52%] bg-gray-950 flex flex-col">
          <div className="relative flex-1 flex items-center justify-center p-4 min-h-[320px]">
            {fotos.length ? (
              esVideo(fotos[actual]) ? (
                <video key={fotos[actual]} src={fotos[actual]} controls playsInline loop className="max-h-[55vh] lg:max-h-[70vh] w-auto rounded-2xl" />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotos[actual]} alt={`Lámina ${actual + 1}`} className="max-h-[55vh] lg:max-h-[70vh] w-auto rounded-2xl object-contain" />
              )
            ) : (
              <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
                <ImageOff size={32} /> Esta pieza todavía no tiene imágenes.
              </div>
            )}
            {fotos.length > 1 && (
              <>
                <button onClick={() => setIdx(Math.max(actual - 1, 0))} disabled={actual === 0} title="Anterior"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-gray-900 disabled:opacity-30">
                  <ChevronLeft size={20} />
                </button>
                <button onClick={() => setIdx(Math.min(actual + 1, fotos.length - 1))} disabled={actual === fotos.length - 1} title="Siguiente"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/90 text-gray-900 disabled:opacity-30">
                  <ChevronRight size={20} />
                </button>
                <span className="absolute top-6 right-6 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-bold">
                  {actual + 1}/{fotos.length}
                </span>
              </>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="flex gap-2 px-4 pb-4 overflow-x-auto">
              {fotos.map((src, i) => (
                <button key={src} onClick={() => setIdx(i)}
                  className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === actual ? "border-[#F4C430]" : "border-transparent opacity-60 hover:opacity-100"}`}>
                  {esVideo(src) ? (
                    <video src={miniaturaVideo(src)} muted preload="metadata" className="w-14 h-[70px] object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="w-14 h-[70px] object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
          {fotos.length > 0 && (
            <div className="px-4 pb-4">
              <button onClick={descargarTodo} disabled={descarga === "bajando"}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-[#F4C430] text-gray-900 text-sm font-bold hover:brightness-95 disabled:opacity-60">
                {descarga === "bajando" ? <Loader2 size={16} className="animate-spin" /> : descarga === "listo" ? <Check size={16} /> : <Download size={16} />}
                {descarga === "bajando" ? "Preparando…" : descarga === "listo" ? "Descargado" : descarga === "error" ? "No se pudo descargar, prueba otra vez" : fotos.length === 1 && esVideo(fotos[0]) ? "Descargar video (.mp4)" : `Descargar todo (${fotos.length} ${fotos.length === 1 ? "archivo" : "archivos"})`}
              </button>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="lg:w-[48%] flex flex-col lg:min-h-0">
          <div className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                {p && <Pill className={p.className}>{p.label}</Pill>}
                {e && <Pill className={e.className}>{e.label}</Pill>}
              </div>
              <h3 className="font-outfit text-lg font-black text-gray-900 mt-2 leading-snug">{item.titulo}</h3>
              <p className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-2">
                {item.fecha_programada && <span className="flex items-center gap-1"><CalendarDays size={11} />{fechaCorta(item.fecha_programada)}</span>}
                {item.formato && <span>· {FORMATOS.find((f) => f.value === item.formato)?.label}</span>}
                {fotos.length > 0 && <span>· {fotos.length === 1 && esVideo(fotos[0]) ? "video" : `${fotos.length} ${fotos.length === 1 ? "imagen" : "láminas"}`}</span>}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors flex-shrink-0"><X size={18} /></button>
          </div>

          <div className="flex-1 lg:overflow-y-auto px-6 py-5 space-y-5">
            {bloque("Caption", item.caption,
              item.caption ? (
                <button onClick={copiar} className="flex items-center gap-1 text-[11px] font-bold text-gray-500 hover:text-gray-900">
                  {copiado ? <><Check size={12} /> Copiado</> : <><Copy size={12} /> Copiar</>}
                </button>
              ) : undefined)}
            {bloque("Gancho", item.gancho)}
            {bloque("Láminas / guion", item.borrador)}
            {bloque("Auditoría del editor jefe", item.auditoria)}
            {bloque("Por qué esta pieza", item.motivo)}
            {item.fuente_url && (
              <section>
                <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5">Fuente principal</h4>
                <a href={item.fuente_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline break-all">{item.fuente_url}</a>
              </section>
            )}
            {bloque("Notas internas", item.notas_admin)}
          </div>

          <div className="border-t border-gray-100 px-6 py-4 flex flex-wrap items-center gap-2">
            {acciones(item)}
            <button onClick={() => onEdit(item)}
              className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
              <Edit2 size={14} /> Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Página
───────────────────────────────────────────────────── */
export default function AdminParrillaPage() {
  const [items, setItems] = useState<Pieza[]>([]);
  const [hacedores, setHacedores] = useState<{ id: string; name: string }[]>([]);
  const [experiencias, setExperiencias] = useState<{ id: string; title: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState("aprobar");
  const [search, setSearch] = useState("");
  const [filtroFormato, setFiltroFormato] = useState<FiltroFormato>("todos");
  const [orden, setOrden] = useState<"recientes" | "fecha">("recientes");
  const [selected, setSelected] = useState<Partial<Pieza> | null>(null);
  const [visorId, setVisorId] = useState<string | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
  const supabase = useMemo(() => createClient(), []);

  const fetchParrilla = useCallback(
    () =>
      Promise.all([
        supabase.from("contenido_piezas").select("*").order("created_at", { ascending: false }),
        supabase.from("hacedores").select("id, name").order("name"),
        supabase.from("experiencias").select("id, title").order("title"),
      ]),
    [supabase],
  );

  const applyParrilla = useCallback(
    ([piezas, hac, exp]: Awaited<ReturnType<typeof fetchParrilla>>) => {
      setLoadError(piezas.error ? piezas.error.message : null);
      setItems((piezas.data as Pieza[]) || []);
      setHacedores(hac.data || []);
      setExperiencias(exp.data || []);
      setIsLoading(false);
    },
    [],
  );

  /* isLoading arranca en true; las recargas posteriores no muestran spinner */
  const load = useCallback(async () => applyParrilla(await fetchParrilla()), [applyParrilla, fetchParrilla]);

  useEffect(() => {
    let activo = true;
    fetchParrilla().then((r) => { if (activo) applyParrilla(r); });
    supabase.auth.getUser().then(({ data }) => { if (activo) setUserEmail(data?.user?.email ?? null); });
    return () => { activo = false; };
  }, [fetchParrilla, applyParrilla, supabase]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  /* Sella las aprobaciones cuando una pieza cruza un punto de control */
  function conSellos(data: Partial<Pieza>, prev?: Estado): Partial<Pieza> {
    const out = { ...data };
    const ahora = new Date().toISOString();
    if (data.estado === "producir" && prev === "tema_propuesto") {
      out.tema_aprobado_at = ahora;
      out.aprobado_por = userEmail;
    }
    if (data.estado === "aprobada" && prev === "pieza_propuesta") {
      out.pieza_aprobada_at = ahora;
      out.aprobado_por = userEmail;
    }
    if (data.estado === "publicada" && prev === "aprobada") {
      out.publicada_at = ahora;
    }
    return out;
  }

  async function handleSave(data: Partial<Pieza>) {
    setIsSaving(true);
    /* Campos que no se editan desde el panel */
    const { id, created_at, ...rest } = data;
    void created_at;
    const { error } = isNew
      ? await supabase.from("contenido_piezas").insert({ ...rest, origen: rest.origen ?? "manual", estado: "idea" })
      : await supabase.from("contenido_piezas").update(rest).eq("id", id as string);
    if (error) showToast(error.message, "err");
    else {
      showToast(isNew ? "Idea guardada." : "Pieza guardada.", "ok");
      setSelected(null);
      await load();
    }
    setIsSaving(false);
  }

  async function cambiarEstado(item: Pieza, estado: Estado, mensaje: string) {
    const { error } = await supabase
      .from("contenido_piezas")
      .update(conSellos({ estado }, item.estado))
      .eq("id", item.id);
    if (error) showToast(error.message, "err");
    else { showToast(mensaje, "ok"); await load(); }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("contenido_piezas").delete().eq("id", deleteId);
    if (error) showToast(error.message, "err");
    else { showToast("Pieza eliminada.", "ok"); await load(); }
    setDeleteId(null);
    setIsDeleting(false);
  }

  /* Balance del mes por pilar */
  const balance = useMemo(() => {
    const ym = mesActual();
    return PILARES.map((p) => ({
      ...p,
      count: items.filter(
        (i) => i.pilar === p.value && ESTADOS_QUE_CUENTAN.includes(i.estado) && i.fecha_programada?.startsWith(ym),
      ).length,
    }));
  }, [items]);

  const countFor = (estados: Estado[]) => items.filter((i) => estados.includes(i.estado)).length;
  const tabActual = TABS.find((t) => t.key === tab) ?? TABS[0];

  const enTab = items
    .filter((i) => tabActual.estados.includes(i.estado))
    .filter((i) => {
      const q = search.toLowerCase();
      return !q || i.titulo.toLowerCase().includes(q) || i.caption?.toLowerCase().includes(q) || i.motivo?.toLowerCase().includes(q);
    });
  const countFormato = (f: FiltroFormato) => (f === "todos" ? enTab.length : enTab.filter((i) => i.formato === f).length);
  const filtered = enTab
    .filter((i) => filtroFormato === "todos" || i.formato === filtroFormato)
    .sort((a, b) =>
      orden === "recientes"
        ? tocadaAt(b).localeCompare(tocadaAt(a))
        : (a.fecha_programada ?? "9999").localeCompare(b.fecha_programada ?? "9999"));
  /* La más reciente de la lista lleva "Lo último" */
  const ultimaId = enTab.length ? enTab.reduce((a, b) => (tocadaAt(b) > tocadaAt(a) ? b : a)).id : null;

  const nombreHacedor = (id: string | null) => hacedores.find((h) => h.id === id)?.name;
  const mesLabel = new Date().toLocaleDateString("es-CO", { month: "long" });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-outfit text-2xl font-black text-gray-900">Parrilla de contenido</h1>
          <p className="text-sm text-gray-400 mt-0.5 flex items-start gap-1.5">
            <Instagram size={13} className="mt-[3px] flex-shrink-0" />
            <span>@comboxplora · 2 piezas por semana · modo {MODO}: 6 Notoriedad + 2 Hacedores al mes</span>
          </p>
        </div>
        <button
          onClick={() => { setIsNew(true); setSelected({ ...VACIA }); }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm"
        >
          <Plus size={16} /> Nueva idea
        </button>
      </div>

      {loadError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <p className="font-bold">No se pudo leer la parrilla.</p>
          <p className="mt-1">
            Si la tabla todavía no existe, corré <code className="font-mono">supabase-contenido.sql</code> en el SQL Editor de Supabase.
            Error: {loadError}
          </p>
        </div>
      )}

      {/* Balance del mes */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
          <CalendarDays size={12} /> Mix de {mesLabel} · modo {MODO}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {balance.map((b) => (
            <div key={b.value} className={`rounded-xl border p-3 ${b.className}`}>
              <div className="font-outfit text-xl font-black">
                {b.count}<span className="text-sm opacity-50">/{META_MES[b.value]}</span>
              </div>
              <div className="text-[11px] font-bold uppercase tracking-wider">{b.label}</div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3">
          Cuenta las piezas con fecha en el mes desde que su tema fue aprobado. Si el selector dice &quot;ninguna&quot;, no se rellena.
        </p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {TABS.map((t) => {
          const n = countFor(t.estados);
          const active = t.key === tab;
          const urgente = t.key === "aprobar" && n > 0;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                active ? "bg-gray-900 text-white" : "bg-white text-gray-500 border border-gray-100 hover:border-gray-300"
              }`}
            >
              {t.label}
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] ${
                urgente ? "bg-[#F4C430] text-gray-900" : active ? "bg-white/15" : "bg-gray-100"
              }`}>{n}</span>
            </button>
          );
        })}
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por tema, caption o motivo..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
        />
      </div>

      {/* Formato y orden */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1.5">
          {FILTROS_FORMATO.map((f) => {
            const active = f.value === filtroFormato;
            const Icono = f.value === "todos" ? null : FORMATO_ESTILO[f.value].Icono;
            return (
              <button key={f.value} onClick={() => setFiltroFormato(f.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all ${
                  active ? "bg-[#F4C430] text-gray-900" : "bg-white text-gray-500 border border-gray-200 hover:border-gray-400"
                }`}>
                {Icono && <Icono size={13} />}
                {f.label}
                <span className={`px-1.5 rounded-md text-[10px] ${active ? "bg-gray-900/10" : "bg-gray-100"}`}>{countFormato(f.value)}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1 text-xs font-bold">
          <span className="text-gray-400 mr-1">Ordenar:</span>
          {([["recientes", "Lo último primero"], ["fecha", "Por fecha de salida"]] as const).map(([v, label]) => (
            <button key={v} onClick={() => setOrden(v)}
              className={`px-3 py-1.5 rounded-lg transition-all ${orden === v ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {tab === "listas" && filtered.length > 0 && (
        <p className="text-xs text-gray-500 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
          Estas piezas están aprobadas. Claude solo publica en Instagram piezas en estado Aprobada, y después las mueve a Publicadas con su enlace.
        </p>
      )}

      {/* Lista */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#F4C430]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Sparkles size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium">
            {tab === "aprobar" ? "No hay nada esperando tu aprobación." : "No hay piezas en esta pestaña."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => {
            const p = pilarInfo(item.pilar);
            const e = estadoInfo(item.estado);
            const hacedor = nombreHacedor(item.hacedor_id);
            const fmt = item.formato ? FORMATO_ESTILO[item.formato] : undefined;
            const fmtLabel = FORMATOS.find((f) => f.value === item.formato)?.label;
            const reciente = esReciente(tocadaAt(item));
            const nueva = esReciente(item.created_at);
            return (
              <div key={item.id} className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition-shadow ${
                item.id === ultimaId && reciente ? "border-[#F4C430] ring-1 ring-[#F4C430]/40" : "border-gray-100"
              }`}>
                <div className="flex items-start gap-4 px-5 py-4">
                  {item.assets?.length ? (
                    <button onClick={() => setVisorId(item.id)} title="Ver publicación"
                      className="relative flex-shrink-0 w-16 h-20 rounded-xl overflow-hidden bg-gray-100 hover:ring-2 hover:ring-[#F4C430] transition-all">
                      {esVideo(item.assets[0]) ? (
                        <video src={miniaturaVideo(item.assets[0])} muted preload="metadata" className="w-full h-full object-cover" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.assets[0]} alt="" className="w-full h-full object-cover" />
                      )}
                      {fmt && (
                        <span className={`absolute bottom-1 left-1 p-1 rounded-md ${fmt.className}`}>
                          <fmt.Icono size={11} />
                        </span>
                      )}
                    </button>
                  ) : null}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {fmt && fmtLabel && (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${fmt.className}`}>
                          <fmt.Icono size={11} /> {fmtLabel}
                        </span>
                      )}
                      {item.id === ultimaId && reciente ? (
                        <Pill className="bg-[#F4C430] text-gray-900 border-[#F4C430]">Lo último</Pill>
                      ) : reciente ? (
                        <Pill className="bg-amber-50 text-amber-700 border-amber-200">{nueva ? "Nueva" : "Actualizada"}</Pill>
                      ) : null}
                      {p && <Pill className={p.className}>{p.label}</Pill>}
                      {e && <Pill className={e.className}>{e.label}</Pill>}
                      {item.nota !== null && (
                        <span className="text-[11px] font-black text-gray-500">{String(item.nota).replace(".", ",")}/10</span>
                      )}
                    </div>
                    <button onClick={() => setVisorId(item.id)} className="text-left font-outfit font-black text-gray-900 text-sm mt-2 leading-snug hover:underline">
                      {item.titulo}
                    </button>
                    <div className="text-xs text-gray-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      {item.fecha_programada && <span className="flex items-center gap-1"><CalendarDays size={10} />sale {fechaCorta(item.fecha_programada)}</span>}
                      {item.formato && !fmt && <span>· {fmtLabel}</span>}
                      <span className="flex items-center gap-1">· <Clock size={10} />{tocadaAt(item) === item.created_at ? "agregada" : "actualizada"} {haceCuanto(tocadaAt(item))}</span>
                      {hacedor && <span>· {hacedor}</span>}
                      {item.origen !== "manual" && <span>· vía {item.origen}</span>}
                    </div>
                    {(item.estado === "pieza_propuesta" ? item.caption : item.motivo) && (
                      <p className="text-xs text-gray-500 leading-relaxed mt-2 line-clamp-3 whitespace-pre-line">
                        {item.estado === "pieza_propuesta" ? item.caption : item.motivo}
                      </p>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.ig_permalink && (
                      <a href={item.ig_permalink} target="_blank" rel="noreferrer" title="Ver en Instagram"
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-700 transition-colors">
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button title="Ver publicación" onClick={() => setVisorId(item.id)}
                      className="p-2 rounded-lg hover:bg-amber-50 text-gray-300 hover:text-amber-600 transition-colors">
                      <Eye size={15} />
                    </button>
                    <button title="Editar" onClick={() => { setIsNew(false); setSelected(item); }}
                      className="p-2 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button title="Eliminar" onClick={() => setDeleteId(item.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Puntos de aprobación y avances rápidos */}
                {item.estado !== "publicada" && item.estado !== "descartada" && (
                  <div className="flex flex-wrap gap-2 px-5 pb-4">{accionesDe(item)}</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Visor
        item={items.find((i) => i.id === visorId) ?? null}
        onClose={() => setVisorId(null)}
        onEdit={(p) => { setVisorId(null); setIsNew(false); setSelected(p); }}
        acciones={(p) => (p.estado !== "publicada" && p.estado !== "descartada" ? accionesDe(p) : null)}
      />
      <PiezaPanel
        item={selected}
        isNew={isNew}
        hacedores={hacedores}
        experiencias={experiencias}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={!!deleteId}
        message="¿Eliminar esta pieza de la parrilla? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );

  /* Botones de aprobación y avance según el estado (tarjeta y visor) */
  function accionesDe(item: Pieza) {
    return (
      <>
                    {item.estado === "tema_propuesto" && (
                      <>
                        <button onClick={() => cambiarEstado(item, "producir", "Tema aprobado. Pasa a producción.")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all">
                          <CheckCircle2 size={14} /> Aprobar tema
                        </button>
                        <button onClick={() => cambiarEstado(item, "idea", "Tema devuelto a la lista de ideas.")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
                          <Undo2 size={14} /> Devolver a ideas
                        </button>
                      </>
                    )}
                    {item.estado === "pieza_propuesta" && (
                      <>
                        <button onClick={() => cambiarEstado(item, "aprobada", "Publicación aprobada.")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all">
                          <CheckCircle2 size={14} /> Aprobar publicación
                        </button>
                        <button onClick={() => cambiarEstado(item, "borrador", "Pieza devuelta a borrador.")}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
                          <Undo2 size={14} /> Devolver a borrador
                        </button>
                      </>
                    )}
                    {item.estado === "idea" && (
                      <button onClick={() => cambiarEstado(item, "tema_propuesto", "Tema propuesto. Queda por aprobar.")}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
                        <Send size={14} /> Proponer como tema
                      </button>
                    )}
                    {AVANCES[item.estado] && (
                      <button onClick={() => cambiarEstado(item, AVANCES[item.estado]!.a, AVANCES[item.estado]!.mensaje)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold transition-all">
                        <ArrowRight size={14} /> {AVANCES[item.estado]!.label}
                      </button>
                    )}
                    <button onClick={() => cambiarEstado(item, "descartada", "Pieza descartada.")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 text-xs font-bold transition-all">
                      <Ban size={14} /> Descartar
                    </button>
      </>
    );
  }
}
