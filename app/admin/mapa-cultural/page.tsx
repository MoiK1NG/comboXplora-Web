"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { fetchMapPoints } from "../../../lib/db";
import type { MapItem } from "../../../lib/types";
import {
    Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
    Loader2, ExternalLink, Search, ChevronDown, ChevronUp, Map,
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
    id: "", title: "", slug: "", type: "experience" as "experience" | "audio",
    categories: "", description: "", lat: "10.9850", lng: "-74.7820",
    image: "", neighborhood: "", tags: "",
    linked_experience_slug: "", audio_url: "", narrator: "", is_active: true,
};
type FormState = typeof EMPTY_FORM;

function mapItemToForm(item: MapItem): FormState {
    return {
        id: item.id, title: item.title, slug: item.slug || "",
        type: item.type === 'relato' ? 'experience' : item.type,
        categories: (item.categories || []).join(", "),
        description: item.shortDescription || "",
        lat: String(item.lat), lng: String(item.lng),
        image: item.coverImage || "",
        neighborhood: item.neighborhood || "",
        tags: (item.tags || []).join(", "),
        linked_experience_slug: item.slug || "",
        audio_url: item.audioUrl || "",
        narrator: item.narrator || "",
        is_active: true,
    };
}

function formToPayload(f: FormState) {
    const toArr = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean);
    return {
        id: f.id.trim(), title: f.title, slug: f.slug.trim(),
        type: f.type,
        categories: toArr(f.categories),
        description: f.description,
        coordinates: { lat: parseFloat(f.lat), lng: parseFloat(f.lng) },
        image: f.image, neighborhood: f.neighborhood,
        tags: toArr(f.tags),
        linked_experience_slug: f.linked_experience_slug || null,
        audio_url: f.audio_url || null,
        narrator: f.narrator || null,
        is_active: f.is_active,
    };
}

function MapPointModal({
    open, onClose, onSave, initial, isSaving,
}: { open: boolean; onClose: () => void; onSave: (f: FormState) => Promise<void>; initial: FormState; isSaving: boolean }) {
    const [form, setForm] = useState<FormState>(initial);
    useEffect(() => setForm(initial), [initial]);
    const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(f => ({ ...f, [k]: e.target.value }));

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="font-outfit text-xl font-black text-gray-900">
                        {form.id ? "Editar Punto del Mapa" : "Nuevo Punto del Mapa"}
                    </h2>
                    <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-colors"><X size={18} /></button>
                </div>
                <div className="flex-1 px-6 py-6 space-y-5">
                    {/* Type selector */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Tipo</label>
                        <select
                            value={form.type}
                            onChange={set("type")}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                        >
                            <option value="experience">Experiencia</option>
                            <option value="audio">Audio</option>
                        </select>
                    </div>

                    {([
                        { label: "ID (ej: exp-6 ó ap-4)", key: "id" as const, disabled: !!form.id && initial.id !== "" },
                        { label: "Título", key: "title" as const },
                        { label: "Slug (URL)", key: "slug" as const },
                        { label: "Categorías (separadas por coma)", key: "categories" as const },
                        { label: "Barrio / Vecindario", key: "neighborhood" as const },
                        { label: "Tags (separados por coma)", key: "tags" as const },
                        { label: "Lat (ej: 10.9850)", key: "lat" as const },
                        { label: "Lng (ej: -74.7820)", key: "lng" as const },
                        { label: "URL imagen", key: "image" as const },
                        { label: "Slug de experiencia vinculada", key: "linked_experience_slug" as const },
                    ] as { label: string; key: keyof FormState; disabled?: boolean }[]).map(({ label, key, disabled }) => (
                        <div key={key}>
                            <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">{label}</label>
                            <input
                                value={String(form[key])} onChange={set(key)} disabled={disabled}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all disabled:bg-gray-50 disabled:text-gray-400"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Descripción</label>
                        <textarea
                            value={form.description} onChange={set("description")} rows={3}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all resize-none"
                        />
                    </div>

                    {form.type === "audio" && (
                        <>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">URL del Audio (.mp3)</label>
                                <input value={form.audio_url} onChange={set("audio_url")}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5">Nombre del Narrador</label>
                                <input value={form.narrator} onChange={set("narrator")}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all" />
                            </div>
                        </>
                    )}

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div
                            onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                            className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.is_active ? "bg-[#F4C430]" : "bg-gray-200"}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0"}`} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">¿Visible en el mapa?</span>
                    </label>
                </div>
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
                    <button onClick={() => onSave(form)} disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60">
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

// Category color helpers
const TYPE_COLORS: Record<string, string> = {
    experience: "bg-amber-50 text-amber-700",
    audio: "bg-purple-50 text-purple-700",
};

export default function AdminMapaCulturalPage() {
    const [items, setItems] = useState<MapItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "experience" | "audio">("all");
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
        const data = await fetchMapPoints({ includeInactive: true });
        setItems(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

    async function handleSave(form: FormState) {
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        if (!form.id || !form.title) { showToast("ID y Título son obligatorios.", "err"); return; }
        setIsSaving(true);
        try {
            const { error } = await supabase.from("mapa_cultural").upsert(formToPayload(form), { onConflict: "id" });
            if (error) throw error;
            showToast("Punto guardado con éxito.", "ok");
            setModalOpen(false);
            await load();
        } catch (e: any) {
            showToast(e.message || "Error al guardar.", "err");
        } finally {
            setIsSaving(false);
        }
    }

    async function handleToggle(item: MapItem) {
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        await supabase.from("mapa_cultural").update({ is_active: !item.isActive }).eq("id", item.id);
        showToast(item.isActive ? "Punto ocultado del mapa." : "Punto visible en el mapa.", "ok");
        await load();
    }

    async function handleDelete(id: string) {
        if (!canWrite) { showToast("Supabase no configurado.", "err"); return; }
        if (!confirm("¿Eliminar este punto del mapa? Esta acción no se puede deshacer.")) return;
        const { error } = await supabase.from("mapa_cultural").delete().eq("id", id);
        if (error) showToast(error.message, "err");
        else { showToast("Punto eliminado.", "ok"); await load(); }
    }

    const filtered = items.filter(item => {
        const matchesSearch =
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.neighborhood?.toLowerCase().includes(search.toLowerCase()) ||
            item.categories?.some(c => c.toLowerCase().includes(search.toLowerCase()));
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesVis =
            visFilter === "all" ? true :
            visFilter === "active" ? item.isActive !== false :
            item.isActive === false;
        return matchesSearch && matchesType && matchesVis;
    });

    const activeCount = items.filter(i => i.isActive !== false).length;
    const hiddenCount = items.filter(i => i.isActive === false).length;

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-outfit text-2xl font-black text-gray-900">Mapa Cultural</h1>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {activeCount} visibles · {hiddenCount} ocultos · {items.filter(i => i.type === "audio").length} audios
                    </p>
                </div>
                <button
                    onClick={() => { setEditForm(EMPTY_FORM); setModalOpen(true); }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start sm:self-auto"
                >
                    <Plus size={16} /> Nuevo Punto
                </button>
            </div>

            {/* Visibility tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 self-start">
                {([
                    { key: "all", label: `Todos (${items.length})` },
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

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por título, categoría o barrio..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                    {(["all", "experience", "audio"] as const).map(t => (
                        <button key={t}
                            onClick={() => setTypeFilter(t)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${typeFilter === t ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700"}`}
                        >
                            {t === "all" ? "Todos" : t === "experience" ? "Experiencias" : "Audios"}
                        </button>
                    ))}
                </div>
            </div>

            {!canWrite && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-5 py-4 text-sm font-medium">
                    ⚠️ <strong>Modo solo lectura.</strong> Configura Supabase para activar edición.
                </div>
            )}

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">No se encontraron puntos en el mapa.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(item => (
                        <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${item.isActive === false ? "border-gray-100 opacity-60 grayscale-[40%]" : "border-gray-100"}`}>
                            {/* Inactive banner */}
                            {item.isActive === false && (
                                <div className="px-5 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <EyeOff size={11} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oculto en el mapa</span>
                                    </div>
                                    <button
                                        onClick={() => handleToggle(item)}
                                        className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 transition-colors px-2 py-0.5 rounded-lg hover:bg-emerald-50"
                                    >
                                        ↑ Volver a mostrar
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-4 px-5 py-4">
                                {/* Thumbnail */}
                                <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                                    {item.coverImage ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={item.coverImage} alt={item.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300"><Map size={18} /></div>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="font-outfit font-black text-gray-900 text-sm">{item.title}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${TYPE_COLORS[item.type]}`}>
                                            {item.type === "experience" ? "Experiencia" : "Audio"}
                                        </span>
                                        {item.categories?.slice(0, 2).map(cat => (
                                            <span key={cat} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold uppercase">{cat}</span>
                                        ))}
                                    </div>
                                    <div className="text-xs text-gray-400 font-medium mt-0.5">
                                        {item.neighborhood} · lat {item.lat.toFixed(4)}, lng {item.lng.toFixed(4)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                    <a href="/mapa-cultural" target="_blank"
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Ver mapa">
                                        <ExternalLink size={15} />
                                    </a>
                                    <button
                                        onClick={() => handleToggle(item)}
                                        title={item.isActive !== false ? "Ocultar del mapa" : "Mostrar en el mapa"}
                                        className={`p-2 rounded-lg transition-colors ${canWrite ? "hover:bg-gray-100" : "opacity-40 cursor-not-allowed"}`}>
                                        {item.isActive !== false
                                            ? <Eye size={15} className="text-emerald-500" />
                                            : <EyeOff size={15} className="text-gray-400" />}
                                    </button>
                                    <button onClick={() => { setEditForm(mapItemToForm(item)); setModalOpen(true); }}
                                        className={`p-2 rounded-lg text-gray-400 hover:text-gray-700 transition-colors ${!canWrite && "opacity-40 cursor-not-allowed"}`}>
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)}
                                        className={`p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors ${!canWrite && "opacity-40 cursor-not-allowed"}`}>
                                        <Trash2 size={15} />
                                    </button>
                                    <button onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                                        className="p-2 rounded-lg text-gray-300 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                        {expandedId === item.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                                    </button>
                                </div>
                            </div>

                            {expandedId === item.id && (
                                <div className="px-5 pb-5 pt-2 border-t border-gray-50 bg-gray-50/50">
                                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">{item.shortDescription}</p>
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {item.tags?.map((tag, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-white border border-gray-100 text-xs font-medium text-gray-500">{tag}</span>
                                        ))}
                                    </div>
                                    {item.type === "audio" && item.narrator && (
                                        <p className="text-xs text-gray-400 font-semibold mt-2">Narrador: {item.narrator}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <MapPointModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editForm} isSaving={isSaving} />
            {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
        </div>
    );
}
