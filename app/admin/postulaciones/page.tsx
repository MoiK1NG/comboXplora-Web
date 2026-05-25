"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import {
  Trash2, X, Save, Loader2, Search, ClipboardList, Mail, Phone,
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
  { value: "nueva", label: "Nueva" },
  { value: "revisada", label: "Revisada" },
  { value: "aprobada", label: "Aprobada" },
  { value: "rechazada", label: "Rechazada" },
];

const EXP_TYPE_LABELS: Record<string, string> = {
  gastronomia: "Gastronomía",
  musica: "Música",
  artesanias: "Artesanías",
  storytelling: "Storytelling",
  danza: "Danza",
  otro: "Otro",
};

function PostulacionModal({
  item, onClose, onSave, isSaving,
}: {
  item: PostulacionRow | null;
  onClose: () => void;
  onSave: (id: string, status: string, notes: string) => Promise<void>;
  isSaving: boolean;
}) {
  const [status, setStatus] = useState(item?.status || "nueva");
  const [notes, setNotes] = useState(item?.admin_notes || "");
  useEffect(() => { if (item) { setStatus(item.status); setNotes(item.admin_notes || ""); } }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-outfit text-xl font-black text-gray-900">Postulación de Hacedor</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          {/* Sender info */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-2.5">
            <p className="font-outfit font-black text-gray-900 text-base">{item.name}</p>
            <a href={`mailto:${item.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F4C430]">
              <Mail size={13} className="text-gray-400" /> {item.email}
            </a>
            {item.phone && <p className="flex items-center gap-2 text-sm text-gray-600"><Phone size={13} className="text-gray-400" /> {item.phone}</p>}
            {item.neighborhood && <p className="text-sm text-gray-600">📍 {item.neighborhood}</p>}
            <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" })}</p>
          </div>

          {/* Experience details */}
          {[
            { label: "Tipo de experiencia", value: EXP_TYPE_LABELS[item.experience_type] || item.experience_type },
            { label: "Título propuesto", value: item.experience_title },
            { label: "Descripción", value: item.experience_description },
            { label: "¿Por qué quiere unirse?", value: item.why_join },
            { label: "Redes sociales", value: item.social_links },
          ].filter((d) => d.value).map((d) => (
            <div key={d.label}>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{d.label}</p>
              <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3">{d.value}</p>
            </div>
          ))}

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Notas internas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Observaciones del equipo..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] resize-none" />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex gap-3">
          <button onClick={() => onSave(item.id, status, notes)} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
          <a href={`mailto:${item.email}?subject=Tu postulación en ComboXplora`} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 flex items-center gap-2">
            <Mail size={14} /> Responder
          </a>
        </div>
      </div>
    </div>
  );
}

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
    const { data } = await supabase.from("postulaciones").select("*").order("created_at", { ascending: false });
    setItems((data as PostulacionRow[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  async function handleSave(id: string, status: string, notes: string) {
    setIsSaving(true);
    const { error } = await supabase.from("postulaciones").update({ status, admin_notes: notes }).eq("id", id);
    if (error) showToast(error.message, "err");
    else { showToast("Postulación actualizada.", "ok"); setSelected(null); await load(); }
    setIsSaving(false);
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

  const newCount = items.filter((i) => i.status === "nueva").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-outfit text-2xl font-black text-gray-900">Postulaciones</h1>
        <p className="text-sm text-gray-400 mt-0.5">{items.length} total{newCount > 0 && <> · <span className="text-orange-500 font-bold">{newCount} nuevas</span></>}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, email, título..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
        </div>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white">
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <ClipboardList size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No hay postulaciones recibidas aún.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelected(item)}
            >
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === "nueva" ? "bg-orange-100" : item.status === "aprobada" ? "bg-emerald-100" : "bg-gray-100"}`}>
                  <ClipboardList size={17} className={item.status === "nueva" ? "text-orange-600" : item.status === "aprobada" ? "text-emerald-600" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-outfit font-black text-gray-900 text-sm">{item.name}</span>
                    <StatusBadge status={item.status} />
                    {item.experience_type && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 uppercase tracking-wide">
                        {EXP_TYPE_LABELS[item.experience_type] || item.experience_type}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.email}{item.neighborhood ? ` · ${item.neighborhood}` : ""}{item.experience_title ? ` · "${item.experience_title}"` : ""} · {new Date(item.created_at).toLocaleDateString("es-CO")}
                  </div>
                </div>
                <button
                  onClick={(ev) => { ev.stopPropagation(); setDeleteId(item.id); }}
                  className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PostulacionModal item={selected} onClose={() => setSelected(null)} onSave={handleSave} isSaving={isSaving} />
      <ConfirmDialog open={!!deleteId} message="¿Eliminar esta postulación permanentemente?" confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={isDeleting} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
