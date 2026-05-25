"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { Toast } from "../../../components/admin/Toast";
import { ConfirmDialog } from "../../../components/admin/ConfirmDialog";
import { ImageUpload } from "../../../components/admin/ImageUpload";
import {
  Plus, Pencil, Trash2, Eye, EyeOff, X, Save, Loader2,
  Search, ChevronDown, ChevronUp, Star, BookOpen,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface RelatoRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  narrator: string;
  categories: string[];
  neighborhood: string;
  coordinates: { lat: number; lng: number };
  cover_image: string;
  gallery: string[];
  audio_url: string;
  video_url: string;
  type: "escrito" | "audio" | "video";
  tags: string[];
  linked_hacedor_id: string;
  show_on_map: boolean;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
}

const EMPTY_FORM: Omit<RelatoRow, "id" | "created_at"> & { id: string } = {
  id: "",
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  narrator: "",
  categories: [],
  neighborhood: "",
  coordinates: { lat: 10.9878, lng: -74.7889 },
  cover_image: "",
  gallery: [],
  audio_url: "",
  video_url: "",
  type: "escrito",
  tags: [],
  linked_hacedor_id: "",
  show_on_map: false,
  is_featured: false,
  is_active: true,
};

// ─────────────────────────────────────────────
// Form helpers
// ─────────────────────────────────────────────
function arrToStr(arr: string[]) { return (arr || []).join("\n"); }
function strToArr(s: string) { return s.split(/[\n,]+/).map((x) => x.trim()).filter(Boolean); }
function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────
function RelatoModal({
  open, onClose, onSave, initial, isSaving,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: typeof EMPTY_FORM) => Promise<void>;
  initial: typeof EMPTY_FORM;
  isSaving: boolean;
}) {
  const [form, setForm] = useState(initial);
  useEffect(() => setForm(initial), [initial]);

  const set = <K extends keyof typeof EMPTY_FORM>(k: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-outfit text-xl font-black text-gray-900">
            {form.id ? "Editar Relato" : "Nuevo Relato"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 px-6 py-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Título *</label>
            <input
              value={form.title}
              onChange={(e) => {
                const v = e.target.value;
                setForm((f) => ({ ...f, title: v, slug: f.slug || slugify(v) }));
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Slug (URL)</label>
            <input value={form.slug} onChange={set("slug")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Tipo</label>
            <select value={form.type} onChange={set("type")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all bg-white">
              <option value="escrito">Escrito</option>
              <option value="audio">Audio</option>
              <option value="video">Video</option>
            </select>
          </div>

          {/* Author / Narrator */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Autor</label>
              <input value={form.author} onChange={set("author")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Narrador</label>
              <input value={form.narrator} onChange={set("narrator")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
            </div>
          </div>

          {/* Barrio */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Barrio</label>
            <input value={form.neighborhood} onChange={set("neighborhood")} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
          </div>

          {/* Categorías */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Categorías (separadas por coma)</label>
            <input
              value={arrToStr(form.categories).replace(/\n/g, ", ")}
              onChange={(e) => setForm((f) => ({ ...f, categories: strToArr(e.target.value) }))}
              placeholder="Música, Tradición, Comunidad"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
            />
          </div>

          {/* Imagen de portada */}
          <ImageUpload
            value={form.cover_image}
            onChange={(url) => setForm((f) => ({ ...f, cover_image: url }))}
            folder="relatos"
            label="Imagen de portada"
          />

          {/* Extracto */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Extracto / Resumen</label>
            <textarea value={form.excerpt} onChange={set("excerpt")} rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all resize-none" />
          </div>

          {/* Contenido */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Contenido completo</label>
            <textarea value={form.content} onChange={set("content")} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all resize-none" />
          </div>

          {/* Audio / Video URL (condicional) */}
          {form.type === "audio" && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">URL del Audio (mp3)</label>
              <input value={form.audio_url} onChange={set("audio_url")} placeholder="https://..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
            </div>
          )}
          {form.type === "video" && (
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">URL del Video (YouTube embed)</label>
              <input value={form.video_url} onChange={set("video_url")} placeholder="https://www.youtube.com/embed/..." className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
            </div>
          )}

          {/* Coords */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Latitud</label>
              <input
                value={form.coordinates.lat}
                onChange={(e) => setForm((f) => ({ ...f, coordinates: { ...f.coordinates, lat: parseFloat(e.target.value) || 0 } }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Longitud</label>
              <input
                value={form.coordinates.lng}
                onChange={(e) => setForm((f) => ({ ...f, coordinates: { ...f.coordinates, lng: parseFloat(e.target.value) || 0 } }))}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Tags (separados por coma)</label>
            <input
              value={arrToStr(form.tags).replace(/\n/g, ", ")}
              onChange={(e) => setForm((f) => ({ ...f, tags: strToArr(e.target.value) }))}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap items-center gap-5">
            {[
              { label: "Activo", key: "is_active" as const },
              { label: "Destacado", key: "is_featured" as const },
              { label: "Mostrar en mapa", key: "show_on_map" as const },
            ].map(({ label, key }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <div
                  onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                  className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form[key] ? "bg-[#F4C430]" : "bg-gray-200"}`}
                >
                  <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className="text-sm font-semibold text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
          <button
            onClick={() => onSave(form)}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {isSaving ? "Guardando..." : "Guardar"}
          </button>
          <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AdminRelatosPage() {
  const [relatos, setRelatos] = useState<RelatoRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"" | "escrito" | "audio" | "video">("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<typeof EMPTY_FORM>({ ...EMPTY_FORM, id: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("relatos").select("*").order("created_at", { ascending: false });
    setRelatos((data as RelatoRow[]) || []);
    setIsLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

  async function handleSave(form: typeof EMPTY_FORM) {
    if (!form.title || !form.slug) {
      showToast("Título y Slug son obligatorios.", "err"); return;
    }
    setIsSaving(true);
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        slug: form.slug,
        excerpt: form.excerpt,
        content: form.content,
        author: form.author,
        narrator: form.narrator,
        categories: form.categories,
        neighborhood: form.neighborhood,
        coordinates: form.coordinates,
        cover_image: form.cover_image,
        gallery: form.gallery,
        audio_url: form.audio_url,
        video_url: form.video_url,
        type: form.type,
        tags: form.tags,
        linked_hacedor_id: form.linked_hacedor_id || null,
        show_on_map: form.show_on_map,
        is_featured: form.is_featured,
        is_active: form.is_active,
      };
      if (form.id) payload.id = form.id;

      const { error } = await supabase.from("relatos").upsert(payload as never, { onConflict: "id" });
      if (error) throw error;
      showToast("Relato guardado con éxito.", "ok");
      setModalOpen(false);
      await load();
    } catch (e: unknown) {
      showToast((e as Error).message || "Error al guardar.", "err");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleToggle(r: RelatoRow) {
    const { error } = await supabase.from("relatos").update({ is_active: !r.is_active }).eq("id", r.id);
    if (error) showToast(error.message, "err");
    else await load();
  }

  async function handleDelete() {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await supabase.from("relatos").delete().eq("id", deleteId);
    if (error) showToast(error.message, "err");
    else { showToast("Relato eliminado.", "ok"); await load(); }
    setDeleteId(null);
    setIsDeleting(false);
  }

  const typeColors: Record<string, string> = {
    escrito: "bg-violet-50 text-violet-700",
    audio: "bg-emerald-50 text-emerald-700",
    video: "bg-rose-50 text-rose-700",
  };

  const filtered = relatos.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.author?.toLowerCase().includes(search.toLowerCase()) ||
      r.neighborhood?.toLowerCase().includes(search.toLowerCase());
    const matchType = !filterType || r.type === filterType;
    return matchSearch && matchType;
  });

  function openNew() {
    setEditForm({ ...EMPTY_FORM, id: "" });
    setModalOpen(true);
  }

  function openEdit(r: RelatoRow) {
    setEditForm({
      id: r.id,
      title: r.title || "",
      slug: r.slug || "",
      excerpt: r.excerpt || "",
      content: r.content || "",
      author: r.author || "",
      narrator: r.narrator || "",
      categories: r.categories || [],
      neighborhood: r.neighborhood || "",
      coordinates: r.coordinates || { lat: 10.9878, lng: -74.7889 },
      cover_image: r.cover_image || "",
      gallery: r.gallery || [],
      audio_url: r.audio_url || "",
      video_url: r.video_url || "",
      type: r.type || "escrito",
      tags: r.tags || [],
      linked_hacedor_id: r.linked_hacedor_id || "",
      show_on_map: r.show_on_map || false,
      is_featured: r.is_featured || false,
      is_active: r.is_active !== false,
    });
    setModalOpen(true);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit text-2xl font-black text-gray-900">Relatos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{relatos.length} en total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start"
        >
          <Plus size={16} /> Nuevo Relato
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, autor o barrio..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as typeof filterType)}
          className="px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white transition-all"
        >
          <option value="">Todos los tipos</option>
          <option value="escrito">Escrito</option>
          <option value="audio">Audio</option>
          <option value="video">Video</option>
        </select>
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No se encontraron relatos.</p>
          <button onClick={openNew} className="mt-4 text-sm text-[#F4C430] font-bold hover:underline">
            Crear el primero
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  {r.cover_image && <img src={r.cover_image} alt={r.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-outfit font-black text-gray-900 text-sm">{r.title}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${typeColors[r.type] || "bg-gray-50 text-gray-500"}`}>
                      {r.type}
                    </span>
                    {r.is_featured && <Star size={12} className="text-amber-500" />}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {r.author && `${r.author} · `}{r.neighborhood || "Sin barrio"} · <code className="bg-gray-50 px-1 rounded">/{r.slug}</code>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button onClick={() => handleToggle(r)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title={r.is_active ? "Desactivar" : "Activar"}>
                    {r.is_active ? <Eye size={15} className="text-emerald-500" /> : <EyeOff size={15} className="text-gray-400" />}
                  </button>
                  <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => setDeleteId(r.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                  <button onClick={() => setExpandedId(expandedId === r.id ? null : r.id)} className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                    {expandedId === r.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </button>
                </div>
              </div>
              {expandedId === r.id && (
                <div className="px-5 pb-4 pt-2 border-t border-gray-50 bg-gray-50/50 text-sm text-gray-600">
                  <p className="line-clamp-3 leading-relaxed">{r.excerpt || r.content || "Sin descripción."}</p>
                  {(r.categories || []).length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {r.categories.map((c) => (
                        <span key={c} className="px-2.5 py-0.5 rounded-full bg-white border border-gray-100 text-[11px] font-medium text-gray-500">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <RelatoModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editForm} isSaving={isSaving} />
      <ConfirmDialog open={!!deleteId} message="Esta acción eliminará el relato permanentemente." confirmLabel="Eliminar" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} isLoading={isDeleting} />
      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
    </div>
  );
}
