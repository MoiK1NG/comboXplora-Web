"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import {
  Trash2, X, Save, Loader2, Search, ChevronDown, ChevronUp,
  Building2, Mail, Phone, Globe, ExternalLink,
} from "lucide-react";

interface EmpresaRow {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  website: string;
  interest_type: string;
  message: string;
  num_people: number | null;
  preferred_date: string;
  budget_range: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

const INTEREST_LABELS: Record<string, string> = {
  sponsorship: "Patrocinio",
  partnership: "Alianza estratégica",
  booking_group: "Reserva grupal",
  csr: "Responsabilidad social",
  other: "Otro",
};

const STATUS_OPTIONS = [
  { value: "nuevo", label: "Nuevo" },
  { value: "revisado", label: "Revisado" },
  { value: "contactado", label: "Contactado" },
  { value: "cerrado", label: "Cerrado" },
  { value: "descartado", label: "Descartado" },
];

// ─────────────────────────────────────────────
// Detail Modal
// ─────────────────────────────────────────────
function EmpresaModal({
  empresa, onClose, onSave, isSaving,
}: {
  empresa: EmpresaRow | null;
  onClose: () => void;
  onSave: (id: string, status: string, notes: string) => Promise<void>;
  isSaving: boolean;
}) {
  const [status, setStatus] = useState(empresa?.status || "nuevo");
  const [notes, setNotes] = useState(empresa?.admin_notes || "");
  useEffect(() => {
    if (empresa) { setStatus(empresa.status); setNotes(empresa.admin_notes || ""); }
  }, [empresa]);

  if (!empresa) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-outfit text-xl font-black text-gray-900">Empresa Interesada</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={18} /></button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-6">
          {/* Company info */}
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
                <Building2 size={18} className="text-rose-600" />
              </div>
              <div>
                <p className="font-outfit font-black text-gray-900 text-lg leading-tight">{empresa.company_name}</p>
                <p className="text-sm text-gray-500 font-medium">{empresa.contact_name}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2 pt-2">
              <a href={`mailto:${empresa.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F4C430] transition-colors">
                <Mail size={14} className="text-gray-400" /> {empresa.email}
              </a>
              {empresa.phone && <p className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" /> {empresa.phone}</p>}
              {empresa.website && (
                <a href={empresa.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#F4C430] transition-colors">
                  <Globe size={14} className="text-gray-400" /> {empresa.website} <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[
              { label: "Tipo de interés", value: INTEREST_LABELS[empresa.interest_type] || empresa.interest_type },
              { label: "Número de personas", value: empresa.num_people?.toString() },
              { label: "Fecha preferida", value: empresa.preferred_date },
              { label: "Presupuesto", value: empresa.budget_range },
              { label: "Fecha de contacto", value: new Date(empresa.created_at).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }) },
            ].filter((d) => d.value).map((d) => (
              <div key={d.label}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{d.label}</p>
                <p className="text-sm font-medium text-gray-800 mt-0.5">{d.value}</p>
              </div>
            ))}

            {empresa.message && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Mensaje</p>
                <p className="text-sm text-gray-700 mt-1 leading-relaxed bg-gray-50 rounded-xl p-3">{empresa.message}</p>
              </div>
            )}
          </div>

          {/* Admin controls */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Estado</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white"
              >
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Notas internas</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Observaciones del equipo..."
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] resize-none"
              />
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex gap-3">
          <button
            onClick={() => onSave(empresa.id, status, notes)}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Guardando..." : "Guardar cambios"}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50">Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AdminEmpresasPage() {
  const [empresas, setEmpresas] = useState<EmpresaRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState<EmpresaRow | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("empresas_interesadas").select("*").order("created_at", { ascending: false });
    setEmpresas((data as EmpresaRow[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  async function handleSave(id: string, status: string, notes: string) {
    setIsSaving(true);
    const { error } = await supabase.from("empresas_interesadas").update({ status, admin_notes: notes }).eq("id", id);
    if (error) showToast(error.message, "err");
    else { showToast("Empresa actualizada.", "ok"); setSelected(null); await load(); }
    setIsSaving(false);
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("empresas_interesadas").delete().eq("id", deleteId);
    if (error) showToast(error.message, "err");
    else { showToast("Empresa eliminada.", "ok"); await load(); }
    setDeleteId(null);
    setIsDeleting(false);
  }

  const filtered = empresas.filter((e) => {
    const matchSearch =
      e.company_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.contact_name?.toLowerCase().includes(search.toLowerCase()) ||
      e.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !filterStatus || e.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const newCount = empresas.filter((e) => e.status === "nuevo").length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit text-2xl font-black text-gray-900">Empresas Interesadas</h1>
          <p className="text-sm text-gray-400 mt-0.5">{empresas.length} total · {newCount > 0 && <span className="text-rose-500 font-bold">{newCount} nuevas</span>}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar empresa, contacto o email..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
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
          <Building2 size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="font-medium">No hay empresas registradas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                  <Building2 size={18} className="text-rose-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-outfit font-black text-gray-900 text-sm">{e.company_name}</span>
                    <StatusBadge status={e.status} />
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {e.contact_name} · {e.email} · {INTEREST_LABELS[e.interest_type] || e.interest_type || "Sin tipo"} · {new Date(e.created_at).toLocaleDateString("es-CO")}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => setSelected(e)} className="px-3 py-2 rounded-xl text-xs font-bold bg-gray-50 hover:bg-[#F4C430] hover:text-gray-900 text-gray-600 transition-all">Revisar</button>
                  <button onClick={() => setDeleteId(e.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                  <button onClick={() => setExpandedId(expandedId === e.id ? null : e.id)} className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    {expandedId === e.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>
              {expandedId === e.id && e.message && (
                <div className="px-5 pb-4 pt-2 border-t border-gray-50 bg-gray-50/50">
                  <p className="text-sm text-gray-600 leading-relaxed">{e.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <EmpresaModal empresa={selected} onClose={() => setSelected(null)} onSave={handleSave} isSaving={isSaving} />
      <ConfirmDialog open={!!deleteId} message="¿Eliminar este registro de empresa? Esta acción no se puede deshacer." confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={isDeleting} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
