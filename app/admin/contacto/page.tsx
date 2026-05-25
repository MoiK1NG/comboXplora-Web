"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import {
  Trash2, X, Save, Loader2, Search, MessageSquare, Mail, Phone,
} from "lucide-react";

interface ContactoRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  source: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "leido", label: "Leído" },
  { value: "respondido", label: "Respondido" },
];

function ContactoModal({
  item, onClose, onSave, isSaving,
}: {
  item: ContactoRow | null;
  onClose: () => void;
  onSave: (id: string, status: string, notes: string) => Promise<void>;
  isSaving: boolean;
}) {
  const [status, setStatus] = useState(item?.status || "nuevo");
  const [notes, setNotes] = useState(item?.admin_notes || "");
  useEffect(() => { if (item) { setStatus(item.status); setNotes(item.admin_notes || ""); } }, [item]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-outfit text-xl font-black text-gray-900">Mensaje de Contacto</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          {/* Sender info */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-2.5">
            <p className="font-outfit font-black text-gray-900 text-base">{item.name}</p>
            <a href={`mailto:${item.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F4C430] transition-colors">
              <Mail size={13} className="text-gray-400" /> {item.email}
            </a>
            {item.phone && <p className="flex items-center gap-2 text-sm text-gray-600"><Phone size={13} className="text-gray-400" /> {item.phone}</p>}
            <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>

          {item.subject && (
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Asunto</p>
              <p className="text-sm font-semibold text-gray-800">{item.subject}</p>
            </div>
          )}

          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Mensaje</p>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{item.message}</div>
          </div>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Estado</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white">
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Notas internas</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Observaciones..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] resize-none" />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex gap-3">
          <button onClick={() => onSave(item.id, status, notes)} disabled={isSaving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60">
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
          <a href={`mailto:${item.email}?subject=Re: ${item.subject || "Tu mensaje"}`} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 flex items-center gap-2">
            <Mail size={14} /> Responder
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminContactoPage() {
  const [items, setItems] = useState<ContactoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<ContactoRow | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("formularios_contacto").select("*").order("created_at", { ascending: false });
    setItems((data as ContactoRow[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  async function handleSave(id: string, status: string, notes: string) {
    setIsSaving(true);
    const { error } = await supabase.from("formularios_contacto").update({ status, admin_notes: notes }).eq("id", id);
    if (error) showToast(error.message, "err");
    else { showToast("Mensaje actualizado.", "ok"); setSelected(null); await load(); }
    setIsSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("formularios_contacto").delete().eq("id", deleteId);
    if (error) showToast(error.message, "err");
    else { showToast("Mensaje eliminado.", "ok"); await load(); }
    setDeleteId(null);
    setIsDeleting(false);
  }

  const filtered = items.filter((i) => {
    const matchSearch =
      i.name?.toLowerCase().includes(search.toLowerCase()) ||
      i.email?.toLowerCase().includes(search.toLowerCase()) ||
      i.subject?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || i.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const newCount = items.filter((i) => i.status === "nuevo").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="font-outfit text-2xl font-black text-gray-900">Mensajes de Contacto</h1>
        <p className="text-sm text-gray-400 mt-0.5">{items.length} total{newCount > 0 && <> · <span className="text-cyan-500 font-bold">{newCount} nuevos</span></>}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nombre, email o asunto..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
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
          <MessageSquare size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No hay mensajes de contacto.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(item)}>
              <div className="flex items-center gap-4 px-5 py-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === "nuevo" ? "bg-cyan-100" : "bg-gray-100"}`}>
                  <MessageSquare size={17} className={item.status === "nuevo" ? "text-cyan-600" : "text-gray-400"} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-outfit font-black text-gray-900 text-sm">{item.name}</span>
                    <StatusBadge status={item.status} />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {item.email} · {item.subject || "Sin asunto"} · {new Date(item.created_at).toLocaleDateString("es-CO")}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={(ev) => { ev.stopPropagation(); setDeleteId(item.id); }}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <div className="px-5 pb-3 text-xs text-gray-400 line-clamp-1 border-t border-gray-50">{item.message}</div>
            </div>
          ))}
        </div>
      )}

      <ContactoModal item={selected} onClose={() => setSelected(null)} onSave={handleSave} isSaving={isSaving} />
      <ConfirmDialog open={!!deleteId} message="¿Eliminar este mensaje de contacto?" confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={isDeleting} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
