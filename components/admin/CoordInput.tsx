"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react";
import { parseCoordinates } from "../../lib/admin-utils";

const inputCls = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all bg-white";
const labelCls = "block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1.5";

// ─────────────────────────────────────────────
// CoordInput con exclusión mutua:
//  - Modo A: pegar coordenadas directas (ej: "10.9850, -74.7820")
//  - Modo B: pegar enlace de Google Maps
//  Cuando uno tiene contenido, el otro se deshabilita.
// ─────────────────────────────────────────────
export function CoordInput({
    lat, lng, onChangeLat, onChangeLng,
}: { lat: string; lng: string; onChangeLat: (v: string) => void; onChangeLng: (v: string) => void }) {
    const [coordsRaw, setCoordsRaw]   = useState(""); // modo A
    const [mapsUrl, setMapsUrl]       = useState(""); // modo B
    const [statusA, setStatusA] = useState<"idle" | "ok" | "err">("idle");
    const [statusB, setStatusB] = useState<"idle" | "ok" | "err">("idle");
    const [showHelp, setShowHelp]     = useState(false);

    const modeAActive = coordsRaw.trim() !== "";
    const modeBActive = mapsUrl.trim()   !== "";

    // Modo A activo → deshabilitar B; Modo B activo → deshabilitar A
    const disableA = modeBActive;
    const disableB = modeAActive;

    function handleExtractCoords() {
        const parsed = parseCoordinates(coordsRaw);
        if (parsed) {
            onChangeLat(String(parsed.lat));
            onChangeLng(String(parsed.lng));
            setStatusA("ok");
            setTimeout(() => setStatusA("idle"), 4000);
        } else {
            setStatusA("err");
        }
    }

    function handleExtractMaps() {
        const parsed = parseCoordinates(mapsUrl);
        if (parsed) {
            onChangeLat(String(parsed.lat));
            onChangeLng(String(parsed.lng));
            setStatusB("ok");
            setTimeout(() => setStatusB("idle"), 4000);
        } else {
            setStatusB("err");
        }
    }

    function clearA() { setCoordsRaw(""); setStatusA("idle"); }
    function clearB() { setMapsUrl("");   setStatusB("idle"); }

    return (
        <div className="space-y-4">
            {/* ── Opción A: Coordenadas directas ── */}
            <div className={`rounded-xl border-2 p-4 space-y-3 transition-all ${
                disableA ? "border-gray-100 bg-gray-50 opacity-50 pointer-events-none" :
                modeAActive ? "border-emerald-200 bg-emerald-50/30" :
                "border-gray-200 bg-white"
            }`}>
                <div className="flex items-center justify-between">
                    <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
                        A · Coordenadas directas
                    </p>
                    {modeAActive && (
                        <button type="button" onClick={clearA}
                            className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-wider">
                            × limpiar
                        </button>
                    )}
                </div>
                <div className="flex gap-2">
                    <input
                        value={coordsRaw}
                        onChange={e => { setCoordsRaw(e.target.value); setStatusA("idle"); }}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleExtractCoords())}
                        placeholder="Ej: 10.9850, -74.7820"
                        disabled={disableA}
                        className={inputCls + " flex-1"}
                    />
                    <button type="button" onClick={handleExtractCoords} disabled={!coordsRaw.trim()}
                        className="px-4 py-3 rounded-xl bg-gray-900 text-white text-xs font-black hover:bg-gray-700 disabled:opacity-40 transition-all whitespace-nowrap">
                        Extraer
                    </button>
                </div>
                {statusA === "ok" && (
                    <p className="text-[11px] text-emerald-600 font-semibold">✓ Extraídas: {lat}, {lng}</p>
                )}
                {statusA === "err" && (
                    <p className="text-[11px] text-red-500 font-semibold">No se reconocieron las coordenadas. Prueba el formato: 10.9850, -74.7820</p>
                )}
            </div>

            {/* Separador "o" */}
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-xs font-black text-gray-300 uppercase tracking-widest">o</span>
                <div className="h-px flex-1 bg-gray-100" />
            </div>

            {/* ── Opción B: Enlace de Google Maps ── */}
            <div className={`rounded-xl border-2 p-4 space-y-3 transition-all ${
                disableB ? "border-gray-100 bg-gray-50 opacity-50 pointer-events-none" :
                modeBActive ? "border-blue-200 bg-blue-50/30" :
                "border-gray-200 bg-white"
            }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-gray-700 uppercase tracking-widest">
                            B · Enlace de Google Maps
                        </p>
                        <button
                            type="button"
                            onClick={() => setShowHelp(v => !v)}
                            className="w-5 h-5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-black hover:bg-gray-200 flex items-center justify-center transition-colors"
                            title="¿Cómo obtener el enlace?"
                        >
                            <HelpCircle size={11} />
                        </button>
                    </div>
                    {modeBActive && (
                        <button type="button" onClick={clearB}
                            className="text-[10px] font-bold text-red-400 hover:text-red-600 uppercase tracking-wider">
                            × limpiar
                        </button>
                    )}
                </div>

                {/* Help */}
                {showHelp && (
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 space-y-3">
                        <p className="font-black text-blue-800 text-[11px] uppercase tracking-wider">¿Cómo obtener el enlace?</p>
                        <div className="space-y-2.5">
                            <div>
                                <p className="font-bold mb-1">Desde computador (más preciso):</p>
                                <ol className="list-decimal list-inside space-y-1 text-blue-600 ml-1">
                                    <li>Abre <strong>Google Maps</strong> en el navegador</li>
                                    <li>Busca o navega al lugar exacto</li>
                                    <li>Haz <strong>clic derecho</strong> sobre el punto</li>
                                    <li>Aparecen dos números en el menú — <strong>haz clic en ellos</strong> para copiar</li>
                                    <li>Pégalos en el campo A ↑ (más arriba)</li>
                                </ol>
                            </div>
                            <div>
                                <p className="font-bold mb-1">Desde el celular (compartir enlace):</p>
                                <ol className="list-decimal list-inside space-y-1 text-blue-600 ml-1">
                                    <li>Abre <strong>Google Maps</strong> y busca el lugar</li>
                                    <li>Toca el nombre del lugar para ver su ficha</li>
                                    <li>Toca <strong>Compartir</strong> y luego <strong>Copiar enlace</strong></li>
                                    <li>Pega el enlace aquí y toca <strong>Extraer</strong></li>
                                </ol>
                            </div>
                            <p className="text-blue-500 text-[10px] border-t border-blue-100 pt-2">
                                💡 Si el enlace corto (maps.app.goo.gl) no funciona, abre el enlace en el navegador, copia la URL completa de la barra de direcciones y pégala aquí.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <input
                        value={mapsUrl}
                        onChange={e => { setMapsUrl(e.target.value); setStatusB("idle"); }}
                        onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleExtractMaps())}
                        placeholder="https://maps.app.goo.gl/... o URL completa"
                        disabled={disableB}
                        className={inputCls + " flex-1"}
                    />
                    <button type="button" onClick={handleExtractMaps} disabled={!mapsUrl.trim()}
                        className="px-4 py-3 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-700 disabled:opacity-40 transition-all whitespace-nowrap">
                        Extraer
                    </button>
                </div>
                {statusB === "ok" && (
                    <p className="text-[11px] text-emerald-600 font-semibold">✓ Extraídas: {lat}, {lng}</p>
                )}
                {statusB === "err" && (
                    <p className="text-[11px] text-red-500 font-semibold">
                        No se pudieron extraer coordenadas. Intenta con la URL completa del navegador (no el enlace corto).
                    </p>
                )}
            </div>

            {/* ── Resultado: lat/lng editable directamente ── */}
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                    Coordenadas resultantes (editables)
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className={labelCls}>Latitud</label>
                        <input value={lat} onChange={e => { onChangeLat(e.target.value); }}
                            placeholder="10.9850" className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Longitud</label>
                        <input value={lng} onChange={e => { onChangeLng(e.target.value); }}
                            placeholder="-74.7820" className={inputCls} />
                    </div>
                </div>
            </div>
        </div>
    );
}
