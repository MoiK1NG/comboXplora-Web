"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { fetchExperiences } from "../../../lib/db";
import type { Experience } from "../../../lib/types";
import {
    generateId, slugify,
    CATEGORIES, DURATIONS, NEIGHBORHOODS,
} from "../../../lib/admin-utils";
import {
    Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
    Loader2, ExternalLink, Search, ChevronDown, ChevronUp,
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

// ─────────────────────────────────────────────
// Category chip picker (multi-select)
// ─────────────────────────────────────────────
function CategoryPicker({
    value, onChange, options,
}: {
    value: string;
    onChange: (v: string) => void;
    options: readonly string[];
}) {
    const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
    function toggle(cat: string) {
        const next = selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat];
        onChange(next.join(", "));
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map(cat => (
                <button
                    key={cat} type="button" onClick={() => toggle(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selected.includes(cat)
                            ? "bg-[#F4C430] text-gray-900 shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────
// Select helper
// ─────────────────────────────────────────────
const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all bg-white";
const labelCls = "block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5";

// ─────────────────────────────────────────────
// FormState
// ─────────────────────────────────────────────
const EMPTY_FORM = {
    id: "",
    title: "",
    slug: "",
    categories: "",
    short_description: "",
    full_description: "",
    duration: "",
    neighborhood: "",
    location: "",
    meeting_point: "",
    lat: "10.9850",
    lng: "-74.7820",
    image: "",
    gallery: "",
    includes: "",
    what_to_expect: "",
    recommendations: "",
    is_featured: false,
    is_active: true,
};
type FormState = typeof EMPTY_FORM;

// ─────────────────────────────────────────────
// Convert Experience → FormState (edit mode)
// ─────────────────────────────────────────────
function expToForm(e: Experience): FormState {
    return {
        id: e.id,
        title: e.title,
        slug: e.slug,
        categories: (e.categories || []).join(", "),
        short_description: e.shortDescription || "",
        full_description: e.fullDescription || "",
        duration: e.duration || "",
        neighborhood: e.neighborhood || "",
        location: e.locationLabel || "",
        meeting_point: e.meetingPoint || "",
        lat: String(e.lat ?? "10.9850"),
        lng: String(e.lng ?? "-74.7820"),
        image: e.coverImage || "",
        gallery: (e.gallery || []).join("\n"),
        includes: (e.includes || []).join("\n"),
        what_to_expect: (e.whatToExpect || []).join("\n"),
        recommendations: (e.recommendations || []).join("\n"),
        is_featured: e.isFeatured ?? false,
        is_active: e.isActive ?? true,
    };
}

// ─────────────────────────────────────────────
// FormState → Supabase payload
// ─────────────────────────────────────────────
function formToSupabase(f: FormState) {
    const toArr = (s: string) =>
        s.split(/[,\n]+/).map(x => x.trim()).filter(Boolean);
    return {
        id: f.id.trim(),
        title: f.title,
        slug: f.slug.trim(),
        categories: toArr(f.categories),
        short_description: f.short_description,
        full_description: f.full_description,
        duration: f.duration,
        neighborhood: f.neighborhood,
        location: f.location,
        meeting_point: f.meeting_point,
        coordinates: { lat: parseFloat(f.lat), lng: parseFloat(f.lng) },
        image: f.image,
        gallery: toArr(f.gallery),
        includes: toArr(f.includes),
        what_to_expect: toArr(f.what_to_expect),
        recommendations: toArr(f.recommendations),
        is_featured: f.is_featured,
        is_active: f.is_active,
    };
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────
function ExperienceModal({
    open, onClose, onSave, initial, isSaving, isNew,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (form: FormState) => Promise<void>;
    initial: FormState;
    isSaving: boolean;
    isNew: boolean;
}) {
    const [form, setForm] = useState<FormState>(initial);
    const [slugManual, setSlugManual] = useState(false);

    useEffect(() => {
        setForm(initial);
        // When editing an existing item, don't auto-override the slug
        setSlugManual(!isNew);
    }, [initial, isNew]);

    const set = (k: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
            setForm(f => ({ ...f, [k]: e.target.value }));

    function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const title = e.target.value;
        setForm(f => ({
            ...f,
            title,
            ...(isNew && !slugManual ? { slug: slugify(title) } : {}),
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
                            {isNew ? "Nueva Experiencia" : "Editar Experiencia"}
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

                    {/* ID badge (only on new) */}
                    {isNew && (
                        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
                            <span className={labelCls + " mb-0"}>ID</span>
                            <code className="text-sm font-mono text-gray-700 flex-1">{form.id}</code>
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">auto</span>
                        </div>
                    )}

                    {/* ── Básico ── */}
                    <FormSection title="Información básica">
                        {/* Título */}
                        <div>
                            <label className={labelCls}>Título</label>
                            <input
                                value={form.title}
                                onChange={handleTitleChange}
                                placeholder="Ej: Taller de Tambores en el Prado"
                                className={inputCls}
                            />
                        </div>

                        {/* Slug */}
                        <div>
                            <label className={labelCls}>
                                Slug (URL)
                                {isNew && !slugManual && (
                                    <span className="ml-2 text-[10px] font-bold text-gray-400 normal-case tracking-normal">
                                        · auto desde título
                                    </span>
                                )}
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">/experiencias/</span>
                                <input
                                    value={form.slug}
                                    onChange={e => { setSlugManual(true); set("slug")(e); }}
                                    placeholder="taller-de-tambores"
                                    className={inputCls + " pl-[8.5rem]"}
                                />
                            </div>
                        </div>

                        {/* Categorías */}
                        <div>
                            <label className={labelCls}>Categorías</label>
                            <CategoryPicker
                                value={form.categories}
                                onChange={v => setForm(f => ({ ...f, categories: v }))}
                                options={CATEGORIES}
                            />
                        </div>

                        {/* Duración */}
                        <div>
                            <label className={labelCls}>Duración</label>
                            <select value={form.duration} onChange={set("duration")} className={inputCls}>
                                <option value="">Seleccionar duración…</option>
                                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>

                        {/* Barrio */}
                        <div>
                            <label className={labelCls}>Barrio / Vecindario</label>
                            <select value={form.neighborhood} onChange={set("neighborhood")} className={inputCls}>
                                <option value="">Seleccionar barrio…</option>
                                {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                    </FormSection>

                    {/* ── Ubicación ── */}
                    <FormSection title="Ubicación">
                        <div>
                            <label className={labelCls}>Nombre del lugar</label>
                            <input value={form.location} onChange={set("location")}
                                placeholder="Ej: Casa Cultural El Prado" className={inputCls} />
                        </div>
                        <div>
                            <label className={labelCls}>Punto de encuentro</label>
                            <input value={form.meeting_point} onChange={set("meeting_point")}
                                placeholder="Ej: Entrada principal" className={inputCls} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className={labelCls}>Latitud</label>
                                <input value={form.lat} onChange={set("lat")}
                                    placeholder="10.9850" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Longitud</label>
                                <input value={form.lng} onChange={set("lng")}
                                    placeholder="-74.7820" className={inputCls} />
                            </div>
                        </div>
                    </FormSection>

                    {/* ── Contenido ── */}
                    <FormSection title="Contenido">
                        {([
                            { label: "Descripción corta", key: "short_description" as const, rows: 2, ph: "Una frase que invite a vivir esta experiencia…" },
                            { label: "Descripción completa", key: "full_description" as const, rows: 4, ph: "Detalla la experiencia con toda la riqueza cultural…" },
                            { label: "Qué incluye (una por línea)", key: "includes" as const, rows: 3, ph: "Guía local\nMaterial didáctico" },
                            { label: "Qué esperar (una por línea)", key: "what_to_expect" as const, rows: 3, ph: "Música en vivo\nDegustación de platos típicos" },
                            { label: "Recomendaciones (una por línea)", key: "recommendations" as const, rows: 2, ph: "Ropa cómoda\nCámara fotográfica" },
                        ] as { label: string; key: keyof FormState; rows: number; ph: string }[]).map(({ label, key, rows, ph }) => (
                            <div key={key}>
                                <label className={labelCls}>{label}</label>
                                <textarea
                                    value={String(form[key])}
                                    onChange={set(key)}
                                    rows={rows}
                                    placeholder={ph}
                                    className={inputCls + " resize-none"}
                                />
                            </div>
                        ))}
                    </FormSection>

                    {/* ── Imágenes ── */}
                    <FormSection title="Imágenes">
                        <div>
                            <label className={labelCls}>URL imagen principal</label>
                            <input value={form.image} onChange={set("image")}
                                placeholder="https://..." className={inputCls} />
                            {form.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.image} alt="" className="mt-2 w-full h-32 object-cover rounded-xl bg-gray-100" />
                            )}
                        </div>
                        <div>
                            <label className={labelCls}>Galería — URLs (una por línea)</label>
                            <textarea
                                value={form.gallery} onChange={set("gallery")} rows={4}
                                placeholder="https://ejemplo.com/foto1.jpg&#10;https://ejemplo.com/foto2.jpg"
                                className={inputCls + " resize-none"}
                            />
                        </div>
                    </FormSection>

                    {/* ── Opciones ── */}
                    <FormSection title="Opciones">
                        <div className="flex items-center gap-6">
                            {([
                                { label: "¿Activa?", key: "is_active" as const },
                                { label: "¿Destacada?", key: "is_featured" as const },
                            ] as { label: string; key: "is_active" | "is_featured" }[]).map(({ label, key }) => (
                                <label key={key} className="flex items-center gap-3 cursor-pointer">
                                    <div
                                        onClick={() => setForm(f => ({ ...f, [key]: !f[key] }))}
                                        className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form[key] ? "bg-[#F4C430]" : "bg-gray-200"}`}
                                    >
                                        <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-5" : "translate-x-0"}`} />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700">{label}</span>
                                </label>
                            ))}
                        </div>
                    </FormSection>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
                    <button
                        onClick={() => onSave(form)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 shadow-sm shadow-[#F4C430]/30"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Guardando…" : "Guardar experiencia"}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all"
                    >
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
export default function AdminExperienciasPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
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
        const data = await fetchExperiences({ includeInactive: true });
        setExperiences(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

    function openNew() {
        setEditForm({ ...EMPTY_FORM, id: generateId("exp") });
        setIsNew(true);
        setModalOpen(true);
    }

    function openEdit(exp: Experience) {
        setEditForm(expToForm(exp));
        setIsNew(false);
        setModalOpen(true);
    }

    async function handleSave(form: FormState) {
        if (!form.title.trim()) { showToast("El título es obligatorio.", "err"); return; }
        if (!form.slug.trim())  { showToast("El slug es obligatorio.", "err"); return; }
        if (!form.id.trim())    { showToast("Error: ID no generado.", "err"); return; }
        setIsSaving(true);
        try {
            const payload = formToSupabase(form);
            const { error } = await supabase.from("experiencias").upsert(payload, { onConflict: "id" });
            if (error) throw error;
            showToast("Experiencia guardada con éxito.", "ok");
            setModalOpen(false);
            await load();
        } catch (e: any) {
            showToast(e.message || "Error al guardar.", "err");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggle(exp: Experience) {
        const { error } = await supabase
            .from("experiencias")
            .update({ is_active: !exp.isActive })
            .eq("id", exp.id);
        if (error) showToast(error.message, "err");
        else {
            showToast(exp.isActive ? "Experiencia ocultada del sitio." : "Experiencia visible en el sitio.", "ok");
            await load();
        }
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Eliminar esta experiencia? Esta acción no se puede deshacer.")) return;
        const { error } = await supabase.from("experiencias").delete().eq("id", id);
        if (error) showToast(error.message, "err");
        else { showToast("Experiencia eliminada.", "ok"); await load(); }
    }

    const activeCount = experiences.filter(e => e.isActive !== false).length;
    const hiddenCount = experiences.filter(e => e.isActive === false).length;

    const filtered = experiences.filter(e => {
        const q = search.toLowerCase();
        const matchesSearch =
            e.title.toLowerCase().includes(q) ||
            e.neighborhood?.toLowerCase().includes(q) ||
            e.categories?.some(c => c.toLowerCase().includes(q));
        const matchesVis =
            visFilter === "all" ? true :
            visFilter === "active" ? e.isActive !== false :
            e.isActive === false;
        return matchesSearch && matchesVis;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit text-2xl font-black text-gray-900">Experiencias</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {activeCount} activas · {hiddenCount} ocultas
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start sm:self-auto"
                >
                    <Plus size={16} /> Nueva Experiencia
                </button>
            </div>

            {/* Visibility tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 w-fit">
                {([
                    { key: "all",    label: `Todas (${experiences.length})` },
                    { key: "active", label: `Visibles (${activeCount})` },
                    { key: "hidden", label: `Ocultas (${hiddenCount})` },
                ] as const).map(tab => (
                    <button key={tab.key} onClick={() => setVisFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            visFilter === tab.key ? "bg-gray-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Buscar por título, barrio o categoría…"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                />
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={28} className="animate-spin text-[#F4C430]" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">No se encontraron experiencias.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(exp => (
                        <div key={exp.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${exp.isActive === false ? "border-gray-100 opacity-60 grayscale-[40%]" : "border-gray-100"}`}>
                            {/* Inactive banner */}
                            {exp.isActive === false && (
                                <div className="px-5 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <EyeOff size={11} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oculta en el sitio web</span>
                                    </div>
                                    <button onClick={() => handleToggle(exp)}
                                        className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 px-2 py-0.5 rounded-lg hover:bg-emerald-50 transition-colors">
                                        ↑ Volver a mostrar
                                    </button>
                                </div>
                            )}

                            <div className="flex items-center gap-4 px-5 py-4">
                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                    {exp.coverImage && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={exp.coverImage} alt={exp.title} className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-outfit font-black text-gray-900 text-sm leading-tight">{exp.title}</span>
                                        {exp.categories?.slice(0, 2).map(cat => (
                                            <span key={cat} className="px-2 py-0.5 rounded-full bg-[#F4C430]/15 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-0.5">
                                        {exp.neighborhood} · {exp.duration} · <code className="bg-gray-50 px-1 rounded text-gray-500">/{exp.slug}</code>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <a href={`/experiencias/${exp.slug}`} target="_blank"
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Ver en sitio">
                                        <ExternalLink size={15} />
                                    </a>
                                    <button onClick={() => handleToggle(exp)}
                                        title={exp.isActive !== false ? "Ocultar del sitio" : "Mostrar en el sitio"}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        {exp.isActive !== false
                                            ? <Eye size={15} className="text-emerald-500" />
                                            : <EyeOff size={15} className="text-gray-400" />}
                                    </button>
                                    <button onClick={() => openEdit(exp)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Editar">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(exp.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Eliminar">
                                        <Trash2 size={15} />
                                    </button>
                                    <button onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                                        className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                        {expandedId === exp.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                </div>
                            </div>

                            {expandedId === exp.id && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50 text-sm text-gray-600">
                                    <p className="leading-relaxed line-clamp-3">{exp.shortDescription}</p>
                                    {exp.includes && exp.includes.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {exp.includes.map((inc, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-white border border-gray-100 text-xs font-medium text-gray-500">{inc}</span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <ExperienceModal
                open={modalOpen} onClose={() => setModalOpen(false)}
                onSave={handleSave} initial={editForm} isSaving={isSaving} isNew={isNew}
            />
            {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
        </div>
    );
}
