"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { fetchExperiences } from "../../../lib/db";
import type { Experience } from "../../../lib/types";
import {
    Plus,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    X,
    Save,
    Loader2,
    ExternalLink,
    Search,
    ChevronDown,
    ChevronUp,
    Star,
} from "lucide-react";

// ─────────────────────────────────────────────
// Toast notification helper
// ─────────────────────────────────────────────
function Toast({ message, type, onDone }: { message: string; type: "ok" | "err"; onDone: () => void }) {
    useEffect(() => {
        const t = setTimeout(onDone, 3500);
        return () => clearTimeout(t);
    }, [onDone]);
    return (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold text-white transition-all ${type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
            {message}
        </div>
    );
}

// ─────────────────────────────────────────────
// Empty form state
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
// Slide-over Modal
// ─────────────────────────────────────────────
function ExperienceModal({
    open,
    onClose,
    onSave,
    initial,
    isSaving,
}: {
    open: boolean;
    onClose: () => void;
    onSave: (form: FormState) => Promise<void>;
    initial: FormState;
    isSaving: boolean;
}) {
    const [form, setForm] = useState<FormState>(initial);
    useEffect(() => setForm(initial), [initial]);

    const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="font-outfit text-xl font-black text-gray-900">
                        {form.id ? "Editar Experiencia" : "Nueva Experiencia"}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Form body */}
                <div className="flex-1 px-6 py-6 space-y-5">
                    {[
                        { label: "ID (ej: exp-6)", key: "id" as const, disabled: !!form.id && form.id !== "" },
                        { label: "Título", key: "title" as const },
                        { label: "Slug (URL: ej. dulces)", key: "slug" as const },
                        { label: "Categorías (separadas por coma)", key: "categories" as const },
                        { label: "Duración (ej: 2 horas)", key: "duration" as const },
                        { label: "Barrio / Vecindario", key: "neighborhood" as const },
                        { label: "Nombre del lugar", key: "location" as const },
                        { label: "Punto de encuentro", key: "meeting_point" as const },
                        { label: "URL imagen principal", key: "image" as const },
                        { label: "Lat (ej: 10.9850)", key: "lat" as const },
                        { label: "Lng (ej: -74.7820)", key: "lng" as const },
                    ].map(({ label, key, disabled }) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                                {label}
                            </label>
                            <input
                                value={String(form[key])}
                                onChange={set(key)}
                                disabled={disabled}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                    ))}
                    {[
                        { label: "Descripción corta", key: "short_description" as const },
                        { label: "Descripción completa", key: "full_description" as const },
                        { label: "Qué incluye (una por línea)", key: "includes" as const },
                        { label: "Qué esperar (una por línea)", key: "what_to_expect" as const },
                        { label: "Recomendaciones (una por línea)", key: "recommendations" as const },
                        { label: "Galería – URLs de imágenes (una por línea)", key: "gallery" as const },
                    ].map(({ label, key }) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">
                                {label}
                            </label>
                            <textarea
                                value={String(form[key])}
                                onChange={set(key)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all resize-none"
                            />
                        </div>
                    ))}
                    <div className="flex items-center gap-4">
                        {[
                            { label: "¿Activa?", key: "is_active" as const },
                            { label: "¿Destacada?", key: "is_featured" as const },
                        ].map(({ label, key }) => (
                            <label key={key} className="flex items-center gap-2 cursor-pointer group">
                                <div
                                    onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                                    className={`w-11 h-6 rounded-full transition-colors duration-200 flex items-center px-0.5 ${form[key] ? "bg-[#F4C430]" : "bg-gray-200"}`}
                                >
                                    <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${form[key] ? "translate-x-5" : "translate-x-0"}`} />
                                </div>
                                <span className="text-sm font-semibold text-gray-700">{label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
                    <button
                        onClick={() => onSave(form)}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Guardando..." : "Guardar"}
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
// Helpers to convert between Experience and FormState
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
        lat: String(e.lat),
        lng: String(e.lng),
        image: e.coverImage || "",
        gallery: (e.gallery || []).join("\n"),
        includes: (e.includes || []).join("\n"),
        what_to_expect: (e.whatToExpect || []).join("\n"),
        recommendations: (e.recommendations || []).join("\n"),
        is_featured: false,
        is_active: true,
    };
}

function formToSupabase(f: FormState) {
    const toArr = (s: string) =>
        s
            .split(/[,\n]+/)
            .map((x) => x.trim())
            .filter(Boolean);
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
// Main Page
// ─────────────────────────────────────────────
export default function AdminExperienciasPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const supabase = createClient();
    const canWrite = true;

    const load = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchExperiences();
        setExperiences(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

    async function handleSave(form: FormState) {
        if (!canWrite) {
            showToast("Supabase no configurado. No se pueden guardar cambios.", "err");
            return;
        }
        if (!form.id || !form.title || !form.slug) {
            showToast("ID, Título y Slug son obligatorios.", "err");
            return;
        }
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
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        const { error } = await supabase
            .from("experiencias")
            .update({ is_active: !(exp as any).is_active })
            .eq("id", exp.id);
        if (error) showToast(error.message, "err");
        else await load();
    }

    async function handleDelete(id: string) {
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        if (!confirm("¿Eliminar esta experiencia? Esta acción no se puede deshacer.")) return;
        const { error } = await supabase.from("experiencias").delete().eq("id", id);
        if (error) showToast(error.message, "err");
        else { showToast("Experiencia eliminada.", "ok"); await load(); }
    }

    const filtered = experiences.filter(
        (e) =>
            e.title.toLowerCase().includes(search.toLowerCase()) ||
            e.neighborhood?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit text-2xl font-black text-gray-900">Experiencias</h1>
                    <p className="text-sm text-gray-400 mt-0.5">{experiences.length} en total</p>
                </div>
                <button
                    onClick={() => { setEditForm(EMPTY_FORM); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start sm:self-auto"
                >
                    <Plus size={16} />
                    Nueva Experiencia
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por título o barrio..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                />
            </div>

            {/* Not configured warning */}
            {!canWrite && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 text-sm font-medium">
                    ⚠️ <strong>Modo solo lectura.</strong> Las ediciones, creación y eliminación requieren Supabase configurado.
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 size={28} className="animate-spin text-[#F4C430]" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">
                    No se encontraron experiencias.
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((exp) => (
                        <div key={exp.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Row */}
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
                                        {exp.categories?.map((cat) => (
                                            <span key={cat} className="px-2 py-0.5 rounded-full bg-[#F4C430]/15 text-amber-700 text-[10px] font-bold uppercase tracking-wider">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-0.5">
                                        {exp.neighborhood} · {exp.duration} · <code className="bg-gray-50 px-1 rounded">/{exp.slug}</code>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <a
                                        href={`/experiencias/${exp.slug}`}
                                        target="_blank"
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                        title="Ver en sitio"
                                    >
                                        <ExternalLink size={15} />
                                    </a>
                                    <button
                                        onClick={() => handleToggle(exp)}
                                        className={`p-2 rounded-lg transition-colors ${canWrite ? "hover:bg-gray-100" : "opacity-40 cursor-not-allowed"}`}
                                        title="Activar/Desactivar"
                                    >
                                        {(exp as any).is_active !== false ? (
                                            <Eye size={15} className="text-emerald-500" />
                                        ) : (
                                            <EyeOff size={15} className="text-gray-400" />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => { setEditForm(expToForm(exp)); setModalOpen(true); }}
                                        className={`p-2 rounded-lg transition-colors ${canWrite ? "hover:bg-gray-100 text-gray-400 hover:text-gray-700" : "opacity-40 cursor-not-allowed"}`}
                                        title="Editar"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(exp.id)}
                                        className={`p-2 rounded-lg transition-colors ${canWrite ? "hover:bg-red-50 text-gray-400 hover:text-red-500" : "opacity-40 cursor-not-allowed"}`}
                                        title="Eliminar"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                    <button
                                        onClick={() => setExpandedId(expandedId === exp.id ? null : exp.id)}
                                        className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        {expandedId === exp.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded detail */}
                            {expandedId === exp.id && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50 text-sm text-gray-600">
                                    <p className="leading-relaxed line-clamp-3">{exp.shortDescription}</p>
                                    {exp.includes && exp.includes.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {exp.includes.map((inc, i) => (
                                                <span key={i} className="px-3 py-1 rounded-full bg-white border border-gray-100 text-xs font-medium text-gray-500">
                                                    {inc}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            <ExperienceModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
                initial={editForm}
                isSaving={isSaving}
            />

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
        </div>
    );
}
