"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { CoordInput } from "../../../components/admin/CoordInput";
import { CategoryPicker } from "../../../components/admin/CategoryPicker";
import { FormSection } from "../../../components/admin/FormSection";
import { CATEGORIES, parseCoordinates, slugify } from "../../../lib/admin-utils";
import { eventPath } from "../../../lib/site";
import { parseFechaEvento, todayISO, formatShortDate, formatTime } from "../../../lib/event-dates";
import type { EventoRow } from "../../../lib/types";
import {
  Trash2, X, Save, Loader2, Search, CalendarDays, Mail, MapPin,
  CheckCircle2, XCircle, Edit2, ExternalLink, AlertTriangle, Lock, Send, Ticket,
} from "lucide-react";

/* ─── Estados ─────────────────────────────────────────── */
const STATUS_OPTIONS = [
  { value: "nuevo",     label: "Nuevo",     color: "text-orange-600 bg-orange-50 border-orange-200" },
  { value: "aprobado",  label: "Aprobado",  color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "rechazado", label: "Rechazado", color: "text-red-600 bg-red-50 border-red-200" },
];

/* ─── Formulario (todo como texto) ───────────────────── */
type FormState = {
  nombre_evento: string; tipo_evento: string; descripcion: string;
  hora_inicio: string; hora_fin: string; direccion: string; link_maps: string;
  nombre_lugar: string; tipo_espacio: string;
  wifi: string; accesible: string; parqueadero: string; banos: string; detalles_adicionales: string;
  nombre_responsable: string; email_contacto: string; telefono: string;
  admin_notes: string; status: string;
  fecha: string; lat: string; lng: string; categorias: string; imagen: string;
  link_inscripcion: string;
};

/** Slug estable: nombre del evento + 4 caracteres del id, para que dos eventos iguales no choquen. */
function makeSlug(nombre: string | null, id: string): string {
  const base = slugify(nombre || "evento") || "evento";
  return `${base}-${id.replace(/-/g, "").slice(0, 4)}`;
}

function rowToForm(r: EventoRow): FormState {
  const coords = r.lat != null && r.lng != null ? null : parseCoordinates(r.link_maps || "");
  return {
    nombre_evento: r.nombre_evento ?? "", tipo_evento: r.tipo_evento ?? "", descripcion: r.descripcion ?? "",
    hora_inicio: r.hora_inicio ?? "", hora_fin: r.hora_fin ?? "", direccion: r.direccion ?? "",
    link_maps: r.link_maps ?? "", nombre_lugar: r.nombre_lugar ?? "", tipo_espacio: r.tipo_espacio ?? "",
    wifi: r.wifi ?? "", accesible: r.accesible ?? "", parqueadero: r.parqueadero ?? "", banos: r.banos ?? "",
    detalles_adicionales: r.detalles_adicionales ?? "",
    nombre_responsable: r.nombre_responsable ?? "", email_contacto: r.email_contacto ?? "", telefono: r.telefono ?? "",
    admin_notes: r.admin_notes ?? "", status: r.status || "nuevo",
    fecha: r.fecha ?? parseFechaEvento(r.fecha_evento) ?? "",
    lat: r.lat != null ? String(r.lat) : coords ? String(coords.lat) : "",
    lng: r.lng != null ? String(r.lng) : coords ? String(coords.lng) : "",
    categorias: (r.categorias ?? []).join(", "),
    imagen: r.imagen ?? "",
    link_inscripcion: r.link_inscripcion ?? "",
  };
}

function formToPayload(f: FormState, row: Pick<EventoRow, "id" | "slug">) {
  const num = (s: string) => { const n = parseFloat(s); return Number.isFinite(n) ? n : null; };
  const txt = (s: string) => (s.trim() === "" ? null : s.trim());
  return {
    nombre_evento: txt(f.nombre_evento), tipo_evento: txt(f.tipo_evento), descripcion: txt(f.descripcion),
    hora_inicio: txt(f.hora_inicio), hora_fin: txt(f.hora_fin), direccion: txt(f.direccion),
    link_maps: txt(f.link_maps), nombre_lugar: txt(f.nombre_lugar), tipo_espacio: txt(f.tipo_espacio),
    wifi: txt(f.wifi), accesible: txt(f.accesible), parqueadero: txt(f.parqueadero), banos: txt(f.banos),
    detalles_adicionales: txt(f.detalles_adicionales),
    nombre_responsable: txt(f.nombre_responsable), email_contacto: txt(f.email_contacto), telefono: txt(f.telefono),
    admin_notes: txt(f.admin_notes), status: f.status,
    fecha: txt(f.fecha), lat: num(f.lat), lng: num(f.lng),
    categorias: f.categorias.split(",").map(s => s.trim()).filter(Boolean),
    imagen: txt(f.imagen),
    link_inscripcion: txt(f.link_inscripcion),
    // El slug se fija la primera vez que se aprueba y no cambia más: los enlaces compartidos siguen vivos
    slug: row.slug ?? (f.status === "aprobado" ? makeSlug(f.nombre_evento, row.id) : null),
  };
}

/** Qué le falta a un evento para poder publicarse en el mapa. Lista vacía = listo. */
function missingForApproval(f: Pick<FormState, "fecha" | "lat" | "lng">, aceptaPromocion: string | null): string[] {
  const missing: string[] = [];
  if (!f.fecha) missing.push("la fecha");
  if (!Number.isFinite(parseFloat(f.lat)) || !Number.isFinite(parseFloat(f.lng))) missing.push("la ubicación");
  if (aceptaPromocion && /^\s*no\b/i.test(aceptaPromocion)) missing.push("la autorización del organizador (respondió que no)");
  return missing;
}

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white transition-all";
const labelCls = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5";

/* ─── Ficha lateral ──────────────────────────────────── */
function EventoModal({
  item, onClose, onSave, isSaving,
}: {
  item: EventoRow | null;
  onClose: () => void;
  onSave: (id: string, data: ReturnType<typeof formToPayload>) => Promise<void>;
  isSaving: boolean;
}) {
  // La ficha se monta de nuevo por cada evento (key en el padre), así el estado inicial basta.
  const [form, setForm] = useState<FormState | null>(() => (item ? rowToForm(item) : null));

  if (!item || !form) return null;

  const set = (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => (f ? { ...f, [k]: e.target.value } : f));

  const missing = missingForApproval(form, item.acepta_promocion);
  const canApprove = missing.length === 0;
  const wantsApproval = form.status === "aprobado";
  const blocked = wantsApproval && !canApprove;
  const isPast = !!form.fecha && form.fecha < todayISO();

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="min-w-0">
            <h2 className="font-outfit text-xl font-black text-gray-900 truncate">{form.nombre_evento || "Evento sin nombre"}</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Recibido el {new Date(item.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
            </p>
            {item.slug && item.status === "aprobado" && (
              <a href={eventPath(item.slug)} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-bold text-blue-600 hover:underline">
                <ExternalLink size={12} /> Ver página pública
              </a>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-7">
          {/* Estado */}
          <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-2xl">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setForm(f => (f ? { ...f, status: opt.value } : f))}
                className={`py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${
                  form.status === opt.value ? opt.color + " border-current shadow-sm" : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Publicar en el mapa */}
          <FormSection title="Publicar en el mapa">
            {!canApprove && (
              <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-xs leading-relaxed">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                <p>Para aprobarlo y que salga en el mapa falta {missing.join(", ")}.</p>
              </div>
            )}
            <div>
              <label className={labelCls}>Fecha del evento</label>
              <input type="date" value={form.fecha} onChange={set("fecha")} className={inputCls} />
              <p className="text-[11px] text-gray-400 mt-1">
                En el formulario escribió: <span className="font-semibold text-gray-600">{item.fecha_evento || "—"}</span>
                {isPast && <span className="ml-2 text-red-500 font-bold">· Esta fecha ya pasó, no saldrá en el mapa</span>}
              </p>
            </div>
            <div>
              <label className={labelCls}>Ubicación</label>
              {form.link_maps && (
                <a href={form.link_maps} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline mb-3">
                  <ExternalLink size={12} /> Abrir el enlace que mandó el organizador
                </a>
              )}
              <CoordInput
                lat={form.lat}
                lng={form.lng}
                onChangeLat={v => setForm(f => (f ? { ...f, lat: v } : f))}
                onChangeLng={v => setForm(f => (f ? { ...f, lng: v } : f))}
              />
            </div>
            <div>
              <label className={labelCls}>Categorías en el mapa</label>
              <CategoryPicker
                value={form.categorias}
                onChange={v => setForm(f => (f ? { ...f, categorias: v } : f))}
                options={CATEGORIES}
              />
              <p className="text-[11px] text-gray-400 mt-1">Tipo según el formulario: {form.tipo_evento || "—"}</p>
            </div>
            <div>
              <label className={labelCls}>Enlace de inscripción (opcional)</label>
              <input value={form.link_inscripcion} onChange={set("link_inscripcion")} placeholder="https://lu.ma/… o donde la gente se apunta" className={inputCls} />
              <p className="text-[11px] text-gray-400 mt-1">Si el organizador usa Luma u otra plataforma, la página del evento muestra el botón Inscribirse hacia ese enlace.</p>
            </div>
            <div>
              <label className={labelCls}>Imagen (opcional)</label>
              <input value={form.imagen} onChange={set("imagen")} placeholder="https://..." className={inputCls} />
              {form.imagen && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.imagen} alt="" className="mt-2 w-full h-28 object-cover rounded-xl bg-gray-100" />
              )}
            </div>
          </FormSection>

          {/* Evento */}
          <FormSection title="Evento">
            <div>
              <label className={labelCls}>Nombre</label>
              <input value={form.nombre_evento} onChange={set("nombre_evento")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tipo</label>
              <input value={form.tipo_evento} onChange={set("tipo_evento")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Descripción</label>
              <textarea value={form.descripcion} onChange={set("descripcion")} rows={4} className={inputCls + " resize-none"} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Hora de inicio</label>
                <input value={form.hora_inicio} onChange={set("hora_inicio")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hora de fin</label>
                <input value={form.hora_fin} onChange={set("hora_fin")} className={inputCls} />
              </div>
            </div>
          </FormSection>

          {/* Lugar */}
          <FormSection title="Lugar">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre del lugar</label>
                <input value={form.nombre_lugar} onChange={set("nombre_lugar")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Tipo de espacio</label>
                <input value={form.tipo_espacio} onChange={set("tipo_espacio")} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Dirección</label>
              <input value={form.direccion} onChange={set("direccion")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Enlace de Google Maps</label>
              <input value={form.link_maps} onChange={set("link_maps")} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {([["wifi", "Wi-Fi"], ["accesible", "Accesible"], ["parqueadero", "Parqueadero"], ["banos", "Baños"]] as const).map(([k, label]) => (
                <div key={k}>
                  <label className={labelCls}>{label}</label>
                  <input value={form[k]} onChange={set(k)} className={inputCls} />
                </div>
              ))}
            </div>
            <div>
              <label className={labelCls}>Detalles adicionales</label>
              <textarea value={form.detalles_adicionales} onChange={set("detalles_adicionales")} rows={2} className={inputCls + " resize-none"} />
            </div>
          </FormSection>

          {/* Responsable */}
          <FormSection title="Responsable">
            <p className="flex items-center gap-1.5 text-[11px] text-gray-400 -mt-1">
              <Lock size={11} /> Estos datos no se publican en el mapa.
            </p>
            <div>
              <label className={labelCls}>Nombre</label>
              <input value={form.nombre_responsable} onChange={set("nombre_responsable")} className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Email</label>
                <input value={form.email_contacto} onChange={set("email_contacto")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Teléfono</label>
                <input value={form.telefono} onChange={set("telefono")} className={inputCls} />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-bold text-gray-700">Autoriza promoción:</span> {item.acepta_promocion || "—"}
            </p>
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <Send size={12} className={item.aviso_aprobacion_enviado_at ? "text-emerald-500" : "text-gray-300"} />
              {item.aviso_aprobacion_enviado_at
                ? <>Aviso de aprobación enviado el {new Date(item.aviso_aprobacion_enviado_at).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}.</>
                : item.status === "aprobado"
                  ? <>Aviso de aprobación pendiente: el Apps Script lo envía en los próximos minutos.</>
                  : <>Al aprobarlo, el organizador recibe un correo con el enlace a su página.</>}
            </p>
          </FormSection>

          {/* Notas */}
          <FormSection title="Notas internas">
            <textarea
              value={form.admin_notes}
              onChange={set("admin_notes")}
              rows={3}
              placeholder="Solo visibles en el admin…"
              className={inputCls + " resize-none"}
            />
          </FormSection>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 space-y-2">
          {blocked && (
            <p className="text-[11px] text-red-500 font-semibold">No se puede guardar como aprobado: falta {missing.join(", ")}.</p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => onSave(item.id, formToPayload(form, item))}
              disabled={isSaving || blocked}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isSaving ? "Guardando…" : "Guardar cambios"}
            </button>
            {form.email_contacto && (
              <a
                href={`mailto:${form.email_contacto}?subject=Tu evento en el Mapa Cultural de ComboXplora`}
                className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
              >
                <Mail size={14} /> Escribir
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Página ─────────────────────────────────────────── */
export default function AdminEventosPage() {
  const [items, setItems] = useState<EventoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<EventoRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
  const supabase = useMemo(() => createClient(), []);

  // Sin spinner en recargas: la lista se actualiza en el lugar.
  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("created_at", { ascending: false });
    setLoadError(error ? error.message : null);
    setItems((data as EventoRow[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  async function handleSave(id: string, data: ReturnType<typeof formToPayload>) {
    setIsSaving(true);
    const { error } = await supabase.from("eventos").update(data).eq("id", id);
    if (error) {
      showToast(
        /column|fecha|lat|categorias/i.test(error.message)
          ? "Falta correr supabase-eventos-mapa.sql en Supabase."
          : error.message,
        "err",
      );
    } else {
      showToast(data.status === "aprobado" ? "Evento aprobado: ya sale en el mapa y en la agenda." : "Evento guardado.", "ok");
      setSelected(null);
      // La agenda y la página del evento se guardan en caché: se refrescan al momento
      fetch("/api/admin/revalidate", { method: "POST" }).catch(() => {});
      await load();
    }
    setIsSaving(false);
  }

  async function quickStatus(item: EventoRow, status: "aprobado" | "rechazado") {
    if (status === "aprobado") {
      const missing = missingForApproval(rowToForm(item), item.acepta_promocion);
      if (missing.length > 0) {
        setSelected(item);
        showToast(`Completa ${missing.join(", ")} para aprobarlo.`, "err");
        return;
      }
      // Guarda también lo precargado (fecha y ubicación sacadas del formulario)
      const f = rowToForm(item);
      await handleSave(item.id, formToPayload({ ...f, status: "aprobado" }, item));
      return;
    }
    const { error } = await supabase.from("eventos").update({ status }).eq("id", item.id);
    if (error) showToast(error.message, "err");
    else {
      showToast("Evento rechazado.", "ok");
      fetch("/api/admin/revalidate", { method: "POST" }).catch(() => {});
      await load();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("eventos").delete().eq("id", deleteId);
    if (error) showToast(error.message, "err");
    else {
      showToast("Evento eliminado.", "ok");
      fetch("/api/admin/revalidate", { method: "POST" }).catch(() => {});
      await load();
    }
    setDeleteId(null);
    setIsDeleting(false);
  }

  const today = todayISO();
  const filtered = items.filter(i => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      i.nombre_evento?.toLowerCase().includes(q) ||
      i.nombre_lugar?.toLowerCase().includes(q) ||
      i.direccion?.toLowerCase().includes(q) ||
      i.tipo_evento?.toLowerCase().includes(q) ||
      i.nombre_responsable?.toLowerCase().includes(q);
    const matchStatus = !filterStatus || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    nuevo: items.filter(i => i.status === "nuevo").length,
    aprobado: items.filter(i => i.status === "aprobado").length,
    rechazado: items.filter(i => i.status === "rechazado").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-outfit text-2xl font-black text-gray-900">Eventos de la comunidad</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Llegan del formulario de Google. Al aprobarlos con fecha y ubicación salen en el mapa y en la agenda, con su propia página para compartir.
        </p>
      </div>

      {loadError && (
        <div className="flex gap-3 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertTriangle size={18} className="flex-shrink-0" />
          <p>No se pudieron cargar los eventos: {loadError}</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",      value: items.length,     color: "bg-gray-50 text-gray-700",       btn: "" },
          { label: "Nuevos",     value: counts.nuevo,     color: "bg-orange-50 text-orange-700",   btn: "nuevo" },
          { label: "Aprobados",  value: counts.aprobado,  color: "bg-emerald-50 text-emerald-700", btn: "aprobado" },
          { label: "Rechazados", value: counts.rechazado, color: "bg-red-50 text-red-700",         btn: "rechazado" },
        ].map(c => (
          <button
            key={c.label}
            onClick={() => setFilterStatus(filterStatus === c.btn ? "" : c.btn)}
            className={`rounded-2xl p-4 text-left transition-all hover:shadow-sm border-2 ${c.color} ${filterStatus === c.btn ? "border-current" : "border-transparent"}`}
          >
            <div className="text-2xl font-black font-outfit tabular-nums">{c.value}</div>
            <div className="text-xs font-bold uppercase tracking-wider mt-0.5">{c.label}</div>
          </button>
        ))}
      </div>

      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por evento, lugar, dirección o responsable…"
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CalendarDays size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium">{items.length === 0 ? "Todavía no llegaron eventos del formulario." : "No hay eventos que coincidan."}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(item => {
            const fecha = item.fecha ?? parseFechaEvento(item.fecha_evento);
            const past = !!fecha && fecha < today;
            const onMap = item.status === "aprobado" && item.lat != null && item.lng != null && !!item.fecha && !past;
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 px-5 py-4">
                  <button
                    onClick={() => setSelected(item)}
                    className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${past ? "bg-gray-100 text-gray-400" : "bg-blue-50 text-blue-700"}`}
                    aria-label="Abrir evento"
                  >
                    {fecha ? (
                      <>
                        <span className="text-[9px] font-black uppercase leading-none">{formatShortDate(fecha).split(" ")[2]}</span>
                        <span className="text-lg font-black font-outfit leading-none mt-0.5 tabular-nums">{Number(fecha.slice(8, 10))}</span>
                      </>
                    ) : (
                      <CalendarDays size={18} />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <button onClick={() => setSelected(item)} className="font-outfit font-black text-gray-900 text-sm text-left hover:underline">
                        {item.nombre_evento || "Evento sin nombre"}
                      </button>
                      <StatusBadge status={item.status} />
                      {onMap && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 uppercase tracking-wide">En el mapa</span>
                      )}
                      {past && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-500 uppercase tracking-wide">Ya pasó</span>
                      )}
                      {item.aviso_aprobacion_enviado_at && (
                        <span title="El organizador ya recibió el correo de aprobación" className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 uppercase tracking-wide">Avisado</span>
                      )}
                      {item.link_inscripcion && (
                        <span title="Tiene enlace de inscripción" className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 uppercase tracking-wide"><Ticket size={10} /> Inscripción</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      {item.tipo_evento && <span>{item.tipo_evento}</span>}
                      {(item.nombre_lugar || item.direccion) && (
                        <span className="flex items-center gap-1"><MapPin size={10} />{item.nombre_lugar || item.direccion}</span>
                      )}
                      {item.hora_inicio && <span>{formatTime(item.hora_inicio)}{item.hora_fin ? ` – ${formatTime(item.hora_fin)}` : ""}</span>}
                      {item.nombre_responsable && <span>· {item.nombre_responsable}</span>}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 flex-shrink-0">
                    {item.status !== "aprobado" && (
                      <button title="Aprobar" onClick={() => quickStatus(item, "aprobado")}
                        className="p-2 rounded-lg hover:bg-emerald-50 text-gray-300 hover:text-emerald-600 transition-colors">
                        <CheckCircle2 size={17} />
                      </button>
                    )}
                    {item.status !== "rechazado" && (
                      <button title="Rechazar" onClick={() => quickStatus(item, "rechazado")}
                        className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                        <XCircle size={17} />
                      </button>
                    )}
                    {item.slug && item.status === "aprobado" && (
                      <a href={eventPath(item.slug)} target="_blank" rel="noopener noreferrer" title="Ver página pública"
                        className="p-2 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors">
                        <ExternalLink size={15} />
                      </a>
                    )}
                    <button title="Editar" onClick={() => setSelected(item)}
                      className="p-2 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors">
                      <Edit2 size={15} />
                    </button>
                    <button title="Eliminar" onClick={() => setDeleteId(item.id)}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                {item.descripcion && (
                  <p className="px-5 pb-4 -mt-1 pl-[5.25rem] text-xs text-gray-400 leading-relaxed line-clamp-2">{item.descripcion}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EventoModal key={selected?.id ?? "none"} item={selected} onClose={() => setSelected(null)} onSave={handleSave} isSaving={isSaving} />
      <ConfirmDialog
        open={!!deleteId}
        message="¿Eliminar este evento permanentemente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
