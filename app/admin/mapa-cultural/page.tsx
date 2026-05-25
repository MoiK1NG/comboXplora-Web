"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "../../../lib/supabase-client";
import { fetchMapPoints } from "../../../lib/db";
import type { MapItem } from "../../../lib/types";
import {
    generateId, slugify,
    parseCoordinates, CATEGORIES, NEIGHBORHOODS,
} from "../../../lib/admin-utils";
import {
    Plus, Pencil, Trash2, Eye, EyeOff, X, Save,
    Loader2, ExternalLink, Search, ChevronDown, ChevronUp, Map,
    HelpCircle,
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
// Category chip picker (multi-select)
// ─────────────────────────────────────────────
function CategoryPicker({
    value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
    const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
    function toggle(cat: string) {
        const next = selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat];
        onChange(next.join(", "));
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map(cat => (
                <button key={cat} type="button" onClick={() => toggle(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selected.includes(cat)
                            ? "bg-[#F4C430] text-gray-900 shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >{cat}</button>
            ))}
        </div>
    );
}

// ─────────────────────────────────────────────
// Smart coordinate input (raw coords OR Google Maps URL)
// ─────────────────────────────────────────────
function CoordInput({
    lat, lng, onChangeLat, onChangeLng,
}: { lat: string; lng: string; onChangeLat: (v: string) => void; onChangeLng: (v: string) => void }) {
    const [raw, setRaw] = useState("");
    const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
    const [showHelp, setShowHelp] = useState(false);

    function handleExtract() {
        const parsed = parseCoordinates(raw);
        if (parsed) {
            onChangeLat(String(parsed.lat));
            onChangeLng(String(parsed.lng));
            setStatus("ok");
            setRaw("");
            setTimeout(() => setStatus("idle"), 3000);
        } else {
            setStatus("err");
        }
    }

    return (
        <div className="space-y-3">
            {/* Smart input */}
            <div>
                <div className="flex items-center gap-2 mb-1.5">
                    <span className={labelCls + " mb-0"}>Pegar coordenadas o enlace de Google Maps</span>
                    <button
                        type="button"
                        onClick={() => setShowHelp(v => !v)}
                        className="p-1 rounded-full text-gray-400 hover:text-blue-500 transition-colors"
                        title="¿Cómo obtener las coordenadas?"
                    >
                        <HelpCircle size={14} />
                    </button>
                </div>

                {/* Help panel */}
                {showHelp && (
                    <div className="mb-3 p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 space-y-2">
                        <p className="font-black text-blue-800">¿Cómo obtener las coordenadas?</p>
                        <div className="space-y-1.5 text-blue-600">
                            <p className="font-bold">Opción 1 — Clic derecho en Google Maps:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-1">
                                <li>Abre <strong>Google Maps</strong> y busca el lugar</li>
                                <li>Haz <strong>clic derecho</strong> sobre el punto exacto</li>
                                <li>Aparecerán dos números (ej: <code className="bg-blue-100 px-1 rounded">10.9850, -74.7820</code>)</li>
                                <li>Haz clic en ellos para copiarlos → pégalos aquí</li>
                            </ol>
                            <p className="font-bold mt-2">Opción 2 — Compartir enlace:</p>
                            <ol className="list-decimal list-inside space-y-1 ml-1">
                                <li>Busca el lugar en Google Maps</li>
                                <li>Toca <strong>Compartir → Copiar enlace</strong></li>
                                <li>Pega el enlace completo aquí y pulsa <strong>Extraer</strong></li>
                            </ol>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        value={raw}
                        onChange={e => { setRaw(e.target.value); setStatus("idle"); }}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleExtract())}
                        placeholder='Ej: "10.9850, -74.7820" o URL de Google Maps'
                        className={inputCls + " flex-1"}
                    />
                    <button
                        type="button"
                        onClick={handleExtract}
                        className="px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-black hover:bg-gray-700 transition-all whitespace-nowrap"
                    >
                        Extraer
                    </button>
                </div>

                {status === "ok" && (
                    <p className="text-[11px] text-emerald-600 font-semibold mt-1.5">
                        ✓ Coordenadas extraídas: {lat}, {lng}
                    </p>
                )}
                {status === "err" && (
                    <p className="text-[11px] text-red-500 font-semibold mt-1.5">
                        No se pudo extraer. Prueba con el formato: "10.9850, -74.7820"
                    </p>
                )}
            </div>

            {/* Manual lat/lng */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className={labelCls}>Latitud</label>
                    <input value={lat} onChange={e => { onChangeLat(e.target.value); setStatus("idle"); }}
                        placeholder="10.9850" className={inputCls} />
                </div>
                <div>
                    <label className={labelCls}>Longitud</label>
                    <input value={lng} onChange={e => { onChangeLng(e.target.value); setStatus("idle"); }}
                        placeholder="-74.7820" className={inputCls} />
                </div>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// FormState
// ─────────────────────────────────────────────
const EMPTY_FORM = {
    id: "", title: "", slug: "", type: "experience" as "experience" | "audio",
    categories: "", description: "", lat: "10.9850", lng: "-74.7820",
    image: "", neighborhood: "", tags: "",
    linked_experience_slug: "", audio_url: "", narrator: "", is_active: true,
};
type FormState = typeof EMPTY_FORM;

function mapItemToForm(item: MapItem): FormState {
    return {
        id: item.id,
        title: item.title,
        slug: item.slug || "",
        type: item.type === "relato" ? "experience" : item.type,
        categories: (item.categories || []).join(", "),
        description: item.shortDescription || "",
        lat: String(item.lat),
        lng: String(item.lng),
        image: item.coverImage || "",
        neighborhood: item.neighborhood || "",
        tags: (item.tags || []).join(", "),
        linked_experience_slug: item.slug || "",
        audio_url: item.audioUrl || "",
        narrator: item.narrator || "",
        is_active: item.isActive ?? true,
    };
}

function formToPayload(f: FormState) {
    const toArr = (s: string) => s.split(",").map(x => x.trim()).filter(Boolean);
    return {
        id: f.id.trim(),
        title: f.title,
        slug: f.slug.trim(),
        type: f.type,
        categories: toArr(f.categories),
        description: f.description,
        coordinates: { lat: parseFloat(f.lat), lng: parseFloat(f.lng) },
        image: f.image,
        neighborhood: f.neighborhood,
        tags: toArr(f.tags),
        linked_experience_slug: f.linked_experience_slug || null,
        audio_url: f.audio_url || null,
        narrator: f.narrator || null,
        is_active: f.is_active,
    };
}

// ─────────────────────────────────────────────
// Modal
// ─────────────────────────────────────────────
function MapPointModal({
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
                            {isNew ? "Nuevo Punto del Mapa" : "Editar Punto del Mapa"}
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

                    {/* ── Tipo ── */}
                    <FormSection title="Tipo de punto">
                        <div className="flex gap-3">
                            {(["experience", "audio"] as const).map(t => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setForm(f => ({ ...f, type: t }))}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                                        form.type === t
                                            ? t === "experience"
                                                ? "border-amber-400 bg-amber-50 text-amber-800"
                                                : "border-purple-400 bg-purple-50 text-purple-800"
                                            : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                                    }`}
                                >
                                    {t === "experience" ? "🗺 Experiencia" : "🎧 Audio"}
                                </button>
                            ))}
                        </div>
                    </FormSection>

                    {/* ── Básico ── */}
                    <FormSection title="Información básica">
                        {/* Título */}
                        <div>
                            <label className={labelCls}>Título</label>
                            <input
                                value={form.title}
                                onChange={handleTitleChange}
                                placeholder="Ej: Casa de la Cultura Barranquillita"
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
                            <input
                                value={form.slug}
                                onChange={e => { setSlugManual(true); set("slug")(e); }}
                                placeholder="casa-de-la-cultura"
                                className={inputCls}
                            />
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

                        {/* Barrio */}
                        <div>
                            <label className={labelCls}>Barrio</label>
                            <select value={form.neighborhood} onChange={set("neighborhood")} className={inputCls}>
                                <option value="">Seleccionar barrio…</option>
                                {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className={labelCls}>Tags (separados por coma)</label>
                            <input value={form.tags} onChange={set("tags")}
                                placeholder="patrimonio, música, tradición"
                                className={inputCls} />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className={labelCls}>Descripción</label>
                            <textarea value={form.description} onChange={set("description")} rows={3}
                                placeholder="Describe este lugar o punto de interés cultural…"
                                className={inputCls + " resize-none"} />
                        </div>
                    </FormSection>

                    {/* ── Ubicación ── */}
                    <FormSection title="Ubicación en el mapa">
                        <CoordInput
                            lat={form.lat}
                            lng={form.lng}
                            onChangeLat={v => setForm(f => ({ ...f, lat: v }))}
                            onChangeLng={v => setForm(f => ({ ...f, lng: v }))}
                        />
                    </FormSection>

                    {/* ── Imagen ── */}
                    <FormSection title="Imagen">
                        <div>
                            <label className={labelCls}>URL de la imagen</label>
                            <input value={form.image} onChange={set("image")}
                                placeholder="https://..." className={inputCls} />
                            {form.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={form.image} alt="" className="mt-2 w-full h-28 object-cover rounded-xl bg-gray-100" />
                            )}
                        </div>
                    </FormSection>

                    {/* ── Experiencia vinculada (para type experience) ── */}
                    {form.type === "experience" && (
                        <FormSection title="Experiencia vinculada">
                            <div>
                                <label className={labelCls}>Slug de la experiencia</label>
                                <input value={form.linked_experience_slug} onChange={set("linked_experience_slug")}
                                    placeholder="ej: taller-de-tambores"
                                    className={inputCls} />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Al hacer clic en el pin del mapa, el usuario verá esta experiencia.
                                </p>
                            </div>
                        </FormSection>
                    )}

                    {/* ── Audio (condicional) ── */}
                    {form.type === "audio" && (
                        <FormSection title="Audio">
                            <div>
                                <label className={labelCls}>URL del archivo de audio (.mp3)</label>
                                <input value={form.audio_url} onChange={set("audio_url")}
                                    placeholder="https://ejemplo.com/audio.mp3" className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Nombre del narrador</label>
                                <input value={form.narrator} onChange={set("narrator")}
                                    placeholder="Ej: Don Alberto Castillo" className={inputCls} />
                            </div>
                        </FormSection>
                    )}

                    {/* ── Opciones ── */}
                    <FormSection title="Opciones">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <div
                                onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                                className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.is_active ? "bg-[#F4C430]" : "bg-gray-200"}`}
                            >
                                <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${form.is_active ? "translate-x-5" : "translate-x-0"}`} />
                            </div>
                            <span className="text-sm font-semibold text-gray-700">¿Visible en el mapa?</span>
                        </label>
                    </FormSection>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-5 flex items-center gap-3">
                    <button onClick={() => onSave(form)} disabled={isSaving}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 shadow-sm shadow-[#F4C430]/30">
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        {isSaving ? "Guardando…" : "Guardar punto"}
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
// Type badge colors
// ─────────────────────────────────────────────
const TYPE_COLORS: Record<string, string> = {
    experience: "bg-amber-50 text-amber-700",
    audio: "bg-purple-50 text-purple-700",
};

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
export default function AdminMapaCulturalPage() {
    const [items, setItems] = useState<MapItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<"all" | "experience" | "audio">("all");
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
        const data = await fetchMapPoints({ includeInactive: true });
        setItems(data);
        setIsLoading(false);
    }, []);

    useEffect(() => { load(); }, [load]);

    const showToast = (message: string, type: "ok" | "err") => setToast({ message, type });

    function openNew() {
        setEditForm({ ...EMPTY_FORM, id: generateId("map") });
        setIsNew(true);
        setModalOpen(true);
    }

    function openEdit(item: MapItem) {
        setEditForm(mapItemToForm(item));
        setIsNew(false);
        setModalOpen(true);
    }

    async function handleSave(form: FormState) {
        if (!form.title.trim()) { showToast("El título es obligatorio.", "err"); return; }
        if (!form.id.trim())    { showToast("Error: ID no generado.", "err"); return; }
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
        await supabase.from("mapa_cultural").update({ is_active: !item.isActive }).eq("id", item.id);
        showToast(item.isActive ? "Punto ocultado del mapa." : "Punto visible en el mapa.", "ok");
        await load();
    }

    async function handleDelete(id: string) {
        if (!confirm("¿Eliminar este punto del mapa? Esta acción no se puede deshacer.")) return;
        const { error } = await supabase.from("mapa_cultural").delete().eq("id", id);
        if (error) showToast(error.message, "err");
        else { showToast("Punto eliminado.", "ok"); await load(); }
    }

    const activeCount = items.filter(i => i.isActive !== false).length;
    const hiddenCount = items.filter(i => i.isActive === false).length;

    const filtered = items.filter(item => {
        const q = search.toLowerCase();
        const matchesSearch =
            item.title.toLowerCase().includes(q) ||
            item.neighborhood?.toLowerCase().includes(q) ||
            item.categories?.some(c => c.toLowerCase().includes(q));
        const matchesType = typeFilter === "all" || item.type === typeFilter;
        const matchesVis =
            visFilter === "all" ? true :
            visFilter === "active" ? item.isActive !== false :
            item.isActive === false;
        return matchesSearch && matchesType && matchesVis;
    });

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
                <button onClick={openNew}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all shadow-sm self-start sm:self-auto">
                    <Plus size={16} /> Nuevo Punto
                </button>
            </div>

            {/* Visibility tabs */}
            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-2xl p-1 w-fit">
                {([
                    { key: "all",    label: `Todos (${items.length})` },
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

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Buscar por título, categoría o barrio…"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl p-1">
                    {(["all", "experience", "audio"] as const).map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${typeFilter === t ? "bg-gray-900 text-white" : "text-gray-400 hover:text-gray-700"}`}
                        >
                            {t === "all" ? "Todos" : t === "experience" ? "Exp" : "Audio"}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 size={28} className="animate-spin text-[#F4C430]" /></div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium">No se encontraron puntos en el mapa.</div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(item => (
                        <div key={item.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all duration-200 ${item.isActive === false ? "border-gray-100 opacity-60 grayscale-[40%]" : "border-gray-100"}`}>
                            {item.isActive === false && (
                                <div className="px-5 py-1.5 bg-gray-100 border-b border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <EyeOff size={11} className="text-gray-400" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oculto en el mapa</span>
                                    </div>
                                    <button onClick={() => handleToggle(item)}
                                        className="text-[10px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-700 px-2 py-0.5 rounded-lg hover:bg-emerald-50 transition-colors">
                                        ↑ Volver a mostrar
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-4 px-5 py-4">
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
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        <ExternalLink size={15} />
                                    </a>
                                    <button onClick={() => handleToggle(item)}
                                        title={item.isActive !== false ? "Ocultar del mapa" : "Mostrar en el mapa"}
                                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                                        {item.isActive !== false
                                            ? <Eye size={15} className="text-emerald-500" />
                                            : <EyeOff size={15} className="text-gray-400" />}
                                    </button>
                                    <button onClick={() => openEdit(item)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                                        <Pencil size={15} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
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

            <MapPointModal open={modalOpen} onClose={() => setModalOpen(false)} onSave={handleSave} initial={editForm} isSaving={isSaving} isNew={isNew} />
            {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
        </div>
    );
}
