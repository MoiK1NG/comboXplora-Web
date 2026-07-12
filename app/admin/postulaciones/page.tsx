"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import {
  Trash2, X, Save, Loader2, Search, ClipboardList, Mail, Phone,
  CheckCircle2, XCircle, Edit2, MapPin, ExternalLink,
} from "lucide-react";

interface PostulacionRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  neighborhood: string;
  experience_type: string;
  experience_title: string;
  experience_description: string;
  why_join: string;
  social_links: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "nueva",     label: "Nueva",     color: "text-orange-600 bg-orange-50 border-orange-200" },
  { value: "revisada",  label: "Revisada",  color: "text-blue-600 bg-blue-50 border-blue-200" },
  { value: "aprobada",  label: "Aprobada",  color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  { value: "rechazada", label: "Rechazada", color: "text-red-600 bg-red-50 border-red-200" },
];

const EXP_TYPE_OPTIONS = [
  { value: "gastronomia",  label: "Gastronomía" },
  { value: "musica",       label: "Música" },
  { value: "artesanias",   label: "Artesanías" },
  { value: "storytelling", label: "Storytelling" },
  { value: "danza",        label: "Danza" },
  { value: "arte",         label: "Arte Visual" },
  { value: "tradicion",    label: "Tradición" },
  { value: "otro",         label: "Otro" },
];

function labelFor(value: string, options: { value: string; label: string }[]) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/* ─── MODAL ─────────────────────────────────────────── */
function PostulacionModal({
  item,
  onClose,
  onSave,
  isSaving,
}: {
  item: PostulacionRow | null;
  onClose: () => void;
  onSave: (id: string, data: Partial<PostulacionRow>) => Promise<void>;
  isSaving: boolean;
}) {
  const [form, setForm] = useState<Partial<PostulacionRow>>({});

  useEffect(() => {
    if (item) setForm({ ...item });
  }, [item]);

  if (!item) return null;

  const set = (field: keyof PostulacionRow, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const inputCls =
    "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white transition-all";
  const labelCls = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5";

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-outfit text-xl font-black text-gray-900">Editar Postulación</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Recibida el {new Date(item.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Estado */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gray-50 rounded-2xl">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => set("status", opt.value)}
                className={`py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider border-2 transition-all ${
                  form.status === opt.value
                    ? opt.color + " border-current shadow-sm"
                    : "bg-white border-gray-100 text-gray-400 hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Datos de contacto */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">1</span>
              Datos de contacto
            </legend>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre</label>
                <input className={inputCls} value={form.name ?? ""} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input className={inputCls} type="email" value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Teléfono</label>
                <input className={inputCls} value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Barrio</label>
                <input className={inputCls} value={form.neighborhood ?? ""} onChange={(e) => set("neighborhood", e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Experiencia */}
          <fieldset className="space-y-3">
            <legend className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-black">2</span>
              Experiencia propuesta
            </legend>
            <div>
              <label className={labelCls}>Tipo</label>
              <select className={inputCls} value={form.experience_type ?? ""} onChange={(e) => set("experience_type", e.target.value)}>
                <option value="">— Selecciona —</option>
                {EXP_TYPE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Título</label>
              <input className={inputCls} value={form.experience_title ?? ""} onChange={(e) => set("experience_title", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Descripción</label>
              <textarea className={inputCls} rows={4} value={form.experience_description ?? ""} onChange={(e) => set("experience_description", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>¿Por qué quiere unirse?</label>
              <textarea className={inputCls} rows={3} value={form.why_join ?? ""} onChange={(e) => set("why_join", e.target.value)} />
            </div>
            <div>
              <label className={labelCls}>Redes sociales / Web</label>
              <input className={inputCls} value={form.social_links ?? ""} onChange={(e) => set("social_links", e.target.value)} />
            </div>
          </fieldset>

          {/* Notas internas */}
          <fieldset>
            <legend className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-black">3</span>
              Notas internas
            </legend>
            <textarea
              className={inputCls}
              rows={3}
              placeholder="Observaciones del equipo (solo visibles en el admin)..."
              value={form.admin_notes ?? ""}
              onChange={(e) => set("admin_notes", e.target.value)}
            />
          </fieldset>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex gap-3">
          <button
            onClick={() => onSave(item.id, form)}
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 shadow-sm"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          <a
            href={`mailto:${form.email}?subject=Tu postulación en ComboXplora`}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <Mail size={14} /> Responder
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── PAGE ───────────────────────────────────────────── */
export default function AdminPostulacionesPage() {
  const [items, setItems] = useState<PostulacionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<PostulacionRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("postulaciones")
      .select("*")
      .order("created_at", { ascending: false });
    setItems((data as PostulacionRow[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  async function handleSave(id: string, data: Partial<PostulacionRow>) {
    setIsSaving(true);
    const { error } = await supabase.from("postulaciones").update(data).eq("id", id);
    if (error) showToast(error.message, "err");
    else {
      showToast("Postulación guardada.", "ok");
      setSelected(null);
      await load();
    }
    setIsSaving(false);
  }

  async function quickStatus(id: string, status: string) {
    const { error } = await supabase.from("postulaciones").update({ status }).eq("id", id);
    if (error) showToast(error.message, "err");
    else {
      showToast(status === "aprobada" ? "Postulación aprobada." : "Postulación rechazada.", "ok");
      await load();
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("postulaciones").delete().eq("id", deleteId);
    if (error) showToast(error.message, "err");
    else { showToast("Postulación eliminada.", "ok"); await load(); }
    setDeleteId(null);
    setIsDeleting(false);
  }

  const filtered = items.filter((i) => {
    const matchSearch =
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.experience_title?.toLowerCase().includes(search.toLowerCase()) ||
      i.neighborhood?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    nueva:     items.filter((i) => i.status === "nueva").length,
    aprobada:  items.filter((i) => i.status === "aprobada").length,
    rechazada: items.filter((i) => i.status === "rechazada").length,
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-outfit text-2xl font-black text-gray-900">Postulaciones</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {items.length} total
            {counts.nueva > 0 && <> · <span className="text-orange-500 font-bold">{counts.nueva} nuevas</span></>}
            {counts.aprobada > 0 && <> · <span className="text-emerald-600 font-bold">{counts.aprobada} aprobadas</span></>}
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total",     value: items.length,       color: "bg-gray-50 text-gray-700",        btn: "" },
          { label: "Nuevas",    value: counts.nueva,       color: "bg-orange-50 text-orange-700",    btn: "nueva" },
          { label: "Aprobadas", value: counts.aprobada,    color: "bg-emerald-50 text-emerald-700",  btn: "aprobada" },
          { label: "Rechazadas",value: counts.rechazada,   color: "bg-red-50 text-red-700",          btn: "rechazada" },
        ].map((c) => (
          <button
            key={c.label}
            onClick={() => setFilterStatus(filterStatus === c.btn ? "" : c.btn)}
            className={`rounded-2xl p-4 text-left transition-all hover:shadow-sm border-2 ${c.color} ${filterStatus === c.btn ? "border-current" : "border-transparent"}`}
          >
            <div className="text-2xl font-black font-outfit">{c.value}</div>
            <div className="text-xs font-bold uppercase tracking-wider mt-0.5">{c.label}</div>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email, título, barrio..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white"
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={28} className="animate-spin text-[#F4C430]" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ClipboardList size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No hay postulaciones que coincidan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  item.status === "nueva"     ? "bg-orange-100" :
                  item.status === "aprobada"  ? "bg-emerald-100" :
                  item.status === "rechazada" ? "bg-red-100" : "bg-gray-100"
                }`}>
                  <ClipboardList size={17} className={
                    item.status === "nueva"     ? "text-orange-600" :
                    item.status === "aprobada"  ? "text-emerald-600" :
                    item.status === "rechazada" ? "text-red-500" : "text-gray-400"
                  } />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-outfit font-black text-gray-900 text-sm">{item.name}</span>
                    <StatusBadge status={item.status} />
                    {item.experience_type && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 uppercase tracking-wide">
                        {labelFor(item.experience_type, EXP_TYPE_OPTIONS)}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span className="flex items-center gap-1"><Mail size={10} />{item.email}</span>
                    {item.neighborhood && <span className="flex items-center gap-1"><MapPin size={10} />{item.neighborhood}</span>}
                    {item.experience_title && <span className="italic">"{item.experience_title}"</span>}
                    <span>· {new Date(item.created_at).toLocaleDateString("es-CO")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {item.status !== "aprobada" && (
                    <button
                      title="Aprobar"
                      onClick={(e) => { e.stopPropagation(); quickStatus(item.id, "aprobada"); }}
                      className="p-2 rounded-lg hover:bg-emerald-50 text-gray-300 hover:text-emerald-600 transition-colors"
                    >
                      <CheckCircle2 size={17} />
                    </button>
                  )}
                  {item.status !== "rechazada" && (
                    <button
                      title="Rechazar"
                      onClick={(e) => { e.stopPropagation(); quickStatus(item.id, "rechazada"); }}
                      className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                    >
                      <XCircle size={17} />
                    </button>
                  )}
                  <button
                    title="Editar"
                    onClick={(e) => { e.stopPropagation(); setSelected(item); }}
                    className="p-2 rounded-lg hover:bg-blue-50 text-gray-300 hover:text-blue-500 transition-colors"
                  >
                    <Edit2 size={15} />
                  </button>
                  {item.email && (
                    <a
                      href={`mailto:${item.email}?subject=Tu postulación en ComboXplora`}
                      title="Enviar email"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-amber-50 text-gray-300 hover:text-amber-600 transition-colors"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <button
                    title="Eliminar"
                    onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expandable preview */}
              {item.experience_description && (
                <div className="px-5 pb-4 -mt-1">
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 pl-14">
                    {item.experience_description}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <PostulacionModal
        item={selected}
        onClose={() => setSelected(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />
      <ConfirmDialog
        open={!!deleteId}
        message="¿Eliminar esta postulación permanentemente? Esta acción no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
