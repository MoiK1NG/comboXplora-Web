"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { fetchHacedores, HacedorData } from "../../../lib/db";
import {
    Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
    Loader2, ExternalLink, Search, ChevronDown, ChevronUp, User,
} from "lucide-react";

function Toast({ message, type, onDone }: { message: string; type: "ok" | "err"; onDone: () => void }) {
    useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
    return (
        <div className={`fixed bottom-6 right-6 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold text-white ${type === "ok" ? "bg-emerald-600" : "bg-red-600"}`}>
            {message}
        </div>
    );
}

const EMPTY_FORM = {
    id: "", name: "", slug: "", category: "",
    profile_image: "", cover_image: "", short_description: "", full_story: "",
    gallery: "", neighborhood: "", instagram: "", whatsapp: "",
    specialties: "", experiences: "", is_active: true,
};
type FormState = typeof EMPTY_FORM;

function hacedorToForm(h: HacedorData): FormState {
    return {
        id: h.id, name: h.name, slug: h.slug, category: h.category,
        profile_image: h.profileImage, cover_image: h.coverImage,
        short_description: h.shortDescription, full_story: h.fullStory,
        gallery: (h.gallery || []).join("\n"),
        neighborhood: h.neighborhood, instagram: h.instagram, whatsapp: h.whatsapp,
        specialties: (h.specialties || []).join("\n"),
        experiences: (h.experiences || []).join(", "),
        is_active: true,
    };
}

function formToPayload(f: FormState) {
    const toArr = (s: string, sep = "\n") =>
        s.split(sep).map(x => x.trim()).filter(Boolean);
    return {
        id: f.id.trim(), name: f.name, slug: f.slug.trim(), category: f.category,
        profile_image: f.profile_image, cover_image: f.cover_image,
        short_description: f.short_description, full_story: f.full_story,
        gallery: toArr(f.gallery), neighborhood: f.neighborhood,
        instagram: f.instagram, whatsapp: f.whatsapp,
        specialties: toArr(f.specialties),
        experiences: toArr(f.experiences, ","),
        is_active: f.is_active,
    };
}

function HacedorModal({
    open, onClose, onSave, initial, isSaving,
}: { open: boolean; onClose: () => void; onSave: (f: FormState) => Promise<void>; initial: FormState; isSaving: boolean }) {
    const [form, setForm] = useState<FormState>(initial);
    useEffect(() => setForm(initial), [initial]);
    const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="font-outfit text-xl font-black text-gray-900">
                        {form.id ? "Editar Hacedor" : "Nuevo Hacedor"}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={18} /></button>
                </div>
                <div className="flex-1 px-6 py-6 space-y-5">
                    {([
                        { label: "ID (ej: hac-6)", key: "id" as const, disabled: !!form.id && form.id.trim() !== "" && initial.id !== "" },
                        { label: "Nombre", key: "name" as const },
                        { label: "Slug (URL)", key: "slug" as const },
                        { label: "Categoría", key: "category" as const },
                        { label: "Barrio", key: "neighborhood" as const },
                        { label: "WhatsApp (ej: 573122475789)", key: "whatsapp" as const },
                        { label: "Instagram URL", key: "instagram" as const },
                        { label: "URL foto de perfil", key: "profile_image" as const },
                        { label: "URL imagen de portada", key: "cover_image" as const },
                    ] as { label: string; key: keyof FormState; disabled?: boolean }[]).map(({ label, key, disabled }) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">{label}</label>
                            <input
                                value={String(form[key])}
                                onChange={set(key)}
                                disabled={disabled}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                    ))}
                    {([
                        { label: "Descripción corta", key: "short_description" as const },
                        { label: "Historia completa", key: "full_story" as const },
                        { label: "Especialidades (una por línea)", key: "specialties" as const },
                        { label: "IDs de experiencias (separados por coma)", key: "experiences" as const },
                        { label: "Galería – URLs (una por línea)", key: "gallery" as const },
                    ] as { label: string; key: keyof FormState }[]).map(({ label, key }) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">{label}</label>
                            <textarea
                                value={String(form[key])}
                                onChange={set(key)}
                                rows={3}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all resize-none"
                            />
                        </div>
                    ))}
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div
                            onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.is_active ? "bg-[#F4C430]" : "bg-gray-200"}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">¿Activo?</span>
                    </label>
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
                    <button onClick={() => onSave(form)} disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Guardando..." : "Guardar"}
                    </button>
                    <button onClick={onClose} className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all">Cancelar</button>
                </div>
            </div>
        </div>
    );
}

export default function AdminHacedoresPage() {
    const [list, setList] = useState<HacedorData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [visFilter, setVisFilter] = useState<"all" | "active" | "hidden">("all");
    const [modalOpen, setModalOpen] = useState(false);
    const [editForm, setEditForm] = useState<FormState>(EMPTY_FORM);
    const [isSaving, setIsSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "ok" | "err" } | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const supabase = createClient();
    const canWrite = true;

    const load = useCallback(async () => {
        setIsLoading(true);
        const data = await fetchHacedores({ includeInactive: true });
        setList(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

    async function handleSave(form: FormState) {
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        if (!form.id || !form.name || !form.slug) { showToast("ID, Nombre y Slug son obligatorios.", "err"); return; }
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
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        await supabase.from("hacedores").update({ is_active: !h.isActive }).eq("id", h.id);
        showToast(h.isActive ? "Hacedor ocultado del sitio." : "Hacedor visible en el sitio.", "ok");
        await load();
    }

    async function handleDelete(id: string) {
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        if (!confirm("¿Eliminar este hacedor? Esta acción no se puede deshacer.")) return;
        const { error } = await supabase.from("hacedores").delete().eq("id", id);
        if (error) showToast(error.message, "err");
        else { showToast("Hacedor eliminado.", "ok"); await load(); }
    }

    const activeCount = list.filter(h => h.isActive !== false).length;
    const hiddenCount = list.filter(h => h.isActive === false).length;

    const filtered = list.filter(h => {
        const matchesSearch =
            h.name.toLowerCase().includes(search.toLowerCase()) ||
            h.category.toLowerCase().includes(search.toLowerCase()) ||
            h.neighborhood.toLowerCase().includes(search.toLowerCase());
        const matchesVis =
            visFilter === "all" ? true :
            visFilter === "active" ? h.isActive !== false :
            h.isActive === false;
        return matchesSearch && matchesVis;
    });

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit text-2xl font-black text-gray-900">Hacedores</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {list.filter(h => h.isActive).length} activos · {list.filter(h => !h.isActive).length} ocultos
                    </p>
                </div>
                <button
                    onClick={() => { setEditForm(EMPTY_FORM); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Hacedor
                </button>
            </div>

            {/* Visibility tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 self-start">
                {([
                    { key: "all", label: `Todos (${list.length})` },
                    { key: "active", label: `Visibles (${activeCount})` },
                    { key: "hidden", label: `Ocultos (${hiddenCount})` },
                ] as const).map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setVisFilter(tab.key)}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                            visFilter === tab.key
                                ? "bg-gray-900 text-white shadow-sm"
                                : "text-gray-400 hover:text-gray-700"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre, categoría o barrio..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                />
            </div>

            {!canWrite && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 text-sm font-medium">
                    ⚠️ <strong>Modo solo lectura.</strong> Configura Supabase para activar edición.
                </div>
            )}

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">No se encontraron hacedores.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((h) => (
                        <div key={h.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${!h.isActive ? "border-gray-100 opacity-60 grayscale-[40%]" : "border-gray-100"}`}>
                            {/* Inactive banner */}
                            {!h.isActive && (
                                <div className="px-5 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <EyeOff size={11} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oculto en el sitio web</span>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(h)}
                                        className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-0.5 rounded-lg hover:bg-emerald-50"
                                    >
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
                                        {h.neighborhood} · <code className="bg-gray-50 px-1 rounded">/hacedores/{h.slug}</code>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <a href={`/hacedores/${h.slug}`} target="_blank"
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Ver en sitio">
                                        <ExternalLink size={15} />
                                    </a>
                                    <button onClick={() => handleToggle(h)} title={h.isActive ? "Ocultar del sitio" : "Mostrar en el sitio"}
                                        className={`p-2 rounded-lg transition-colors ${canWrite ? "hover:bg-gray-100" : "opacity-40 cursor-not-allowed"}`}>
                                        {h.isActive
                                            ? <Eye size={15} className="text-emerald-500" />
                                            : <EyeOff size={15} className="text-gray-400" />}
                                    </button>
                                    <button onClick={() => { setEditForm(hacedorToForm(h)); setModalOpen(true); }}
                                        className={`p-2 rounded-lg text-gray-400 hover:text-gray-700 transition-colors ${!canWrite && "opacity-40 cursor-not-allowed"}`}>
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(h.id)}
                                        className={`p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ${!canWrite && "opacity-40 cursor-not-allowed"}`}>
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

            <HacedorModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editForm} isSaving={isSaving} />
            {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
        </div>
    );
}
