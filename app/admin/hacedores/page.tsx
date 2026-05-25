"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { fetchHacedores, HacedorData } from "../../../lib/db";
import {
    generateId, slugify,
    HACEDOR_CATEGORIES, NEIGHBORHOODS,
} from "../../../lib/admin-utils";
import {
    Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
    Loader2, ExternalLink, Search, ChevronDown, ChevronUp, User,
} from "lucide-react";

// ─────────────────────────────────────────────
// Toast
// ─────────────────────────────────────────────
function Toast({ message, type, onDone }: { message: string; type: "ok" | "err"; onDone: () => void }) {
    useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
    return (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold text-white ${type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
            {message}
        </div>
    );
}

// ─────────────────────────────────────────────
// Section divider
// ─────────────────────────────────────────────
function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{title}</span>
                <div className="h-px flex-1 bg-gray-100" />
            </div>
            {children}
        </div>
    );
}

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all bg-white";
const labelCls = "block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5";

// ─────────────────────────────────────────────
// FormState
// ─────────────────────────────────────────────
const EMPTY_FORM = {
    id: "", name: "", slug: "", category: "",
    profile_image: "", cover_image: "", short_description: "", full_story: "",
    gallery: "", neighborhood: "", instagram: "", whatsapp: "",
    specialties: "", experiences: "", is_active: true,
};
type FormState = typeof EMPTY_FORM;

// ─────────────────────────────────────────────
// Converters
// ─────────────────────────────────────────────
function hacedorToForm(h: HacedorData): FormState {
    return {
        id: h.id,
        name: h.name,
        slug: h.slug,
        category: h.category,
        profile_image: h.profileImage,
        cover_image: h.coverImage,
        short_description: h.shortDescription,
        full_story: h.fullStory,
        gallery: (h.gallery || []).join("\n"),
        neighborhood: h.neighborhood,
        instagram: h.instagram,
        whatsapp: h.whatsapp,
        specialties: (h.specialties || []).join("\n"),
        experiences: (h.experiences || []).join(", "),
        is_active: h.isActive ?? true,
    };
}

function formToPayload(f: FormState) {
    const toArr = (s: string, sep = "\n") =>
        s.split(sep).map(x => x.trim()).filter(Boolean);
    return {
        id: f.id.trim(),
        name: f.name,
        slug: f.slug.trim(),
        category: f.category,
        profile_image: f.profile_image,
        cover_image: f.cover_image,
        short_description: f.short_description,
        full_story: f.full_story,
        gallery: toArr(f.gallery),
        neighborhood: f.neighborhood,
        instagram: f.instagram,
        whatsapp: f.whatsapp,
        specialties: toArr(f.specialties),
        experiences: toArr(f.experiences, ","),
        is_active: f.is_active,
    };
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────
function HacedorModal({
    open, onClose, onSave, initial, isSaving, isNew,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (f: FormState) => Promise<void>;
    initial: FormState;
    isSaving: boolean;
    isNew: boolean;
}) {
    const [form, setForm] = useState<FormState>(initial);
    const [slugManual, setSlugManual] = useState(false);

    useEffect(() => {
        setForm(initial);
        setSlugManual(!isNew);
    }, [initial, isNew]);

    const set = (k: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }));

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const name = e.target.value;
        setForm(f => ({
            ...f,
            name,
            ...(isNew && !slugManual ? { slug: slugify(name) } : {}),
        }));
    }

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="font-outfit text-xl font-black text-gray-900">
                            {isNew ? "Nuevo Hacedor" : "Editar Hacedor"}
                        </h2>
                        {!isNew && (
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{form.id}</p>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 px-6 py-6 space-y-6">

                    {/* ID badge */}
                    {isNew && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                            <span className={labelCls + " mb-0"}>ID</span>
                            <code className="text-sm font-mono text-gray-700 flex-1">{form.id}</code>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">auto</span>
                        </div>
                    )}

                    {/* ── Perfil ── */}
                    <FormSection title="Perfil">
                        {/* Nombre */}
                        <div>
                            <label className={labelCls}>Nombre completo</label>
                            <input
                                value={form.name}
                                onChange={handleNameChange}
                                placeholder="Ej: Doña Carmen Insignares"
                                className={inputCls}
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className={labelCls}>
                                Slug (URL)
                                {isNew && !slugManual && (
                                    <span className="ml-2 text-[10px] font-bold text-gray-400 normal-case tracking-normal">
                                        · auto desde nombre
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">/hacedores/</span>
                                <input
                                    value={form.slug}
                                    onChange={e => { setSlugManual(true); set("slug")(e); }}
                                    placeholder="dona-carmen-insignares"
                                    className={inputCls + " pl-[7.5rem]"}
                                />
                            </div>
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className={labelCls}>Categoría</label>
                            <select value={form.category} onChange={set("category")} className={inputCls}>
                                <option value="">Seleccionar categoría…</option>
                                {HACEDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        {/* Barrio */}
                        <div>
                            <label className={labelCls}>Barrio</label>
                            <select value={form.neighborhood} onChange={set("neighborhood")} className={inputCls}>
                                <option value="">Seleccionar barrio…</option>
                                {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </FormSection>

                    {/* ── Contacto ── */}
                    <FormSection title="Contacto">
                        <div>
                            <label className={labelCls}>WhatsApp (con código de país)</label>
                            <input value={form.whatsapp} onChange={set("whatsapp")}
                                placeholder="573001234567" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Instagram URL</label>
                            <input value={form.instagram} onChange={set("instagram")}
                                placeholder="https://instagram.com/usuario" className={inputCls} />
                        </div>
                    </FormSection>

                    {/* ── Imágenes ── */}
                    <FormSection title="Imágenes">
                        <div>
                            <label className={labelCls}>Foto de perfil (URL)</label>
                            <input value={form.profile_image} onChange={set("profile_image")}
                                placeholder="https://..." className={inputCls} />
                            {form.profile_image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.profile_image} alt="" className="mt-2 w-20 h-20 object-cover rounded-full bg-gray-100" />
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Imagen de portada (URL)</label>
                            <input value={form.cover_image} onChange={set("cover_image")}
                                placeholder="https://..." className={inputCls} />
                            {form.cover_image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.cover_image} alt="" className="mt-2 w-full h-28 object-cover rounded-xl bg-gray-100" />
                            )}
                        </div>
                    </FormSection>

                    {/* ── Historia ── */}
                    <FormSection title="Historia y descripción">
                        <div>
                            <label className={labelCls}>Descripción corta</label>
                            <textarea value={form.short_description} onChange={set("short_description")} rows={2}
                                placeholder="Una frase que capture la esencia de este hacedor…"
                                className={inputCls + " resize-none"} />
                        </div>
                        <div>
                            <label className={labelCls}>Historia completa</label>
                            <textarea value={form.full_story} onChange={set("full_story")} rows={5}
                                placeholder="Cuenta su trayectoria, su legado cultural, lo que lo hace único…"
                                className={inputCls + " resize-none"} />
                        </div>
                        <div>
                            <label className={labelCls}>Especialidades (una por línea)</label>
                            <textarea value={form.specialties} onChange={set("specialties")} rows={3}
                                placeholder="Gastronomía caribeña&#10;Recetas de tradición oral"
                                className={inputCls + " resize-none"} />
                        </div>
                    </FormSection>

                    {/* ── Galería ── */}
                    <FormSection title="Galería">
                        <div>
                            <label className={labelCls}>URLs de imágenes (una por línea)</label>
                            <textarea value={form.gallery} onChange={set("gallery")} rows={4}
                                placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
                                className={inputCls + " resize-none"} />
                        </div>
                    </FormSection>

                    {/* ── Vinculaciones ── */}
                    <FormSection title="Vinculaciones">
                        <div>
                            <label className={labelCls}>IDs de experiencias (separados por coma)</label>
                            <input value={form.experiences} onChange={set("experiences")}
                                placeholder="exp_abc12345, exp_xyz67890" className={inputCls} />
                        </div>
                    </FormSection>

                    {/* ── Opciones ── */}
                    <FormSection title="Opciones">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.is_active ? "bg-[#F4C430]" : "bg-gray-200"}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0"}`} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">¿Activo?</span>
                        </label>
                    </FormSection>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
                    <button onClick={() => onSave(form)} disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 shadow-sm shadow-[#F4C430]/30">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Guardando…" : "Guardar hacedor"}
                    </button>
                    <button onClick={onClose}
                        className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">
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
export default function AdminHacedoresPage() {
    const [list, setList] = useState<HacedorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [visFilter, setVisFilter] = useState<"all" | "active" | "hidden">("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
    const [isNew, setIsNew] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const supabase = createClient();

    const load = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchHacedores({ includeInactive: true });
        setList(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

    function openNew() {
        setEditForm({ ...EMPTY_FORM, id: generateId("hac") });
        setIsNew(true);
        setModalOpen(true);
    }

    function openEdit(h: HacedorData) {
        setEditForm(hacedorToForm(h));
        setIsNew(false);
        setModalOpen(true);
    }

    async function handleSave(form: FormState) {
        if (!form.name.trim()) { showToast("El nombre es obligatorio.", "err"); return; }
        if (!form.slug.trim()) { showToast("El slug es obligatorio.", "err"); return; }
        if (!form.id.trim())   { showToast("Error: ID no generado.", "err"); return; }
        setIsSaving(true);
        try {
            const { error } = await supabase.from("hacedores").upsert(formToPayload(form), { onConflict: "id" });
            if (error) throw error;
            showToast("Hacedor guardado con éxito.", "ok");
            setModalOpen(false);
            await load();
        } catch (e: any) {
            showToast(e.message || "Error al guardar.", "err");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggle(h: HacedorData) {
        await supabase.from("hacedores").update({ is_active: !h.isActive }).eq("id", h.id);
        showToast(h.isActive ? "Hacedor ocultado del sitio." : "Hacedor visible en el sitio.", "ok");
        await load();
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Eliminar este hacedor? Esta acción no se puede deshacer.")) return;
        const { error } = await supabase.from("hacedores").delete().eq("id", id);
        if (error) showToast(error.message, "err");
        else { showToast("Hacedor eliminado.", "ok"); await load(); }
    }

    const activeCount = list.filter(h => h.isActive !== false).length;
    const hiddenCount = list.filter(h => h.isActive === false).length;

    const filtered = list.filter(h => {
        const q = search.toLowerCase();
        const matchesSearch =
            h.name.toLowerCase().includes(q) ||
            h.category.toLowerCase().includes(q) ||
            h.neighborhood.toLowerCase().includes(q);
        const matchesVis =
            visFilter === "all" ? true :
            visFilter === "active" ? h.isActive !== false :
            h.isActive === false;
        return matchesSearch && matchesVis;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit text-2xl font-black text-gray-900">Hacedores</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {activeCount} activos · {hiddenCount} ocultos
                    </p>
                </div>
                <button onClick={openNew}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start sm:self-auto">
                    <Plus size={16} /> Nuevo Hacedor
                </button>
            </div>

            {/* Visibility tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 w-fit">
                {([
                    { key: "all",    label: `Todos (${list.length})` },
                    { key: "active", label: `Visibles (${activeCount})` },
                    { key: "hidden", label: `Ocultos (${hiddenCount})` },
                ] as const).map(tab => (
                    <button key={tab.key} onClick={() => setVisFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            visFilter === tab.key ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
                        }`}
                    >{tab.label}</button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, categoría o barrio…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">No se encontraron hacedores.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(h => (
                        <div key={h.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${!h.isActive ? "border-gray-100 opacity-60 grayscale-[40%]" : "border-gray-100"}`}>
                            {!h.isActive && (
                                <div className="px-5 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <EyeOff size={11} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oculto en el sitio web</span>
                                    </div>
                                    <button onClick={() => handleToggle(h)}
                                        className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 px-2 py-0.5 rounded-lg hover:bg-emerald-50 transition-colors">
                                        ↑ Volver a mostrar
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
                                    {h.profileImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={h.profileImage} alt={h.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><User size={20} /></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-outfit font-black text-gray-900 text-sm">{h.name}</span>
                                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider">{h.category}</span>
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-0.5">
                                        {h.neighborhood} · <code className="bg-gray-50 px-1 rounded text-gray-500">/hacedores/{h.slug}</code>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <a href={`/hacedores/${h.slug}`} target="_blank"
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        <ExternalLink size={15} />
                                    </a>
                                    <button onClick={() => handleToggle(h)}
                                        title={h.isActive ? "Ocultar del sitio" : "Mostrar en el sitio"}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        {h.isActive ? <Eye size={15} className="text-emerald-500" /> : <EyeOff size={15} className="text-gray-400" />}
                                    </button>
                                    <button onClick={() => openEdit(h)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(h.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                                        <Trash2 size={15} />
                                    </button>
                                    <button onClick={() => setExpandedId(expandedId === h.id ? null : h.id)}
                                        className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                        {expandedId === h.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                </div>
                            </div>
                            {expandedId === h.id && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50 text-sm text-gray-600">
                                    <p className="leading-relaxed line-clamp-3">{h.shortDescription}</p>
                                    {h.specialties?.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {h.specialties.map((spec, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-white border border-gray-100 text-xs font-medium text-gray-500">{spec}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <HacedorModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editForm} isSaving={isSaving} isNew={isNew} />
            {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
        </div>
    );
}
