"use client";

import { useState, useMemo, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ChevronRight, LocateFixed, Loader2 } from "lucide-react";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { MapFilters, INITIAL_FILTERS, type MapFilterState } from "../../components/map/map-filters";
import { MapLegend } from "../../components/map/map-legend";
import { MapList } from "../../components/map/map-list";
import { SelectedExperiencePanel } from "../../components/map/selected-experience-panel";
import { BottomSheet, type SheetSnap } from "../../components/map/bottom-sheet";
import { SHOW_HISTORIAS, layerOf, distanceKm, type LayerKey } from "../../components/map/map-config";
import type { LatLng } from "../../components/map/cultural-map";
import type { MapItem } from "../../lib/types";
import mapPointsRaw from "../../data/mapa-cultural.json";
import { fetchMapPoints, fetchApprovedEvents } from "../../lib/db";
import { CATEGORIES } from "../../lib/admin-utils";
import { isInRange } from "../../lib/event-dates";

// Leaflet necesita el navegador: sin SSR
const CulturalMap = dynamic(() => import("../../components/map/cultural-map"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-[#F3F1EA] flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-[#C9A227]" aria-label="Cargando mapa" />
    </div>
  ),
});

function isPublicItem(item: MapItem): boolean {
  if (item.type === "experience" || item.type === "evento") return true;
  return SHOW_HISTORIAS;
}

function matchesQuery(item: MapItem, q: string): boolean {
  if (!q) return true;
  const hay = [item.title, item.neighborhood, item.locationLabel, item.venueName, item.address, ...(item.categories || [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const needle = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").trim();
  return hay.includes(needle);
}

type GeoStatus = "idle" | "loading" | "denied" | "unsupported";

function MapaCulturalContent() {
  const [allItems, setAllItems] = useState<MapItem[]>(() => (mapPointsRaw as MapItem[]).filter(isPublicItem));
  const [filters, setFilters] = useState<MapFilterState>(INITIAL_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("peek");
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [locateNonce, setLocateNonce] = useState(0);
  const [geoStatus, setGeoStatus] = useState<GeoStatus>("idle");

  const searchParams = useSearchParams();
  const deepLinkSlug = searchParams.get("evento");

  useEffect(() => {
    let alive = true;
    Promise.all([fetchMapPoints(), fetchApprovedEvents()]).then(([points, events]) => {
      if (!alive) return;
      setAllItems([...points, ...events].filter(isPublicItem));
      // /mapa-cultural?evento=<slug> abre ese evento al llegar desde su página o desde un enlace compartido
      if (deepLinkSlug) {
        const hit = events.find(e => e.eventSlug === deepLinkSlug);
        if (hit) {
          setSelectedId(hit.id);
          setSheetSnap("open");
        }
      }
    });
    return () => { alive = false; };
  }, [deepLinkSlug]);

  // Filtros comunes (búsqueda, categoría y fecha). El tipo se aplica después para poder contar por capa.
  const base = useMemo(
    () =>
      allItems.filter(item => {
        if (!matchesQuery(item, filters.query)) return false;
        if (filters.category && !item.categories?.includes(filters.category)) return false;
        if (item.type === "evento" && item.eventDate && !isInRange(item.eventDate, filters.dateRange)) return false;
        return true;
      }),
    [allItems, filters.query, filters.category, filters.dateRange],
  );

  const counts = useMemo<Record<LayerKey, number>>(
    () => ({
      experience: base.filter(i => layerOf(i) === "experience").length,
      evento: base.filter(i => layerOf(i) === "evento").length,
    }),
    [base],
  );

  const filtered = useMemo(() => {
    const list = filters.type === "todo" ? base : base.filter(i => layerOf(i) === filters.type);
    return [...list].sort((a, b) => {
      if (userLocation) return distanceKm(userLocation, a) - distanceKm(userLocation, b);
      const la = layerOf(a), lb = layerOf(b);
      if (la !== lb) return la === "experience" ? -1 : 1;
      if (la === "evento") return (a.eventDate ?? "").localeCompare(b.eventDate ?? "");
      return 0;
    });
  }, [base, filters.type, userLocation]);

  // Categorías que existen en lo que se puede ver, en el orden oficial
  const categories = useMemo(() => {
    const pool = filters.type === "todo" ? allItems : allItems.filter(i => layerOf(i) === filters.type);
    const present = new Set(pool.flatMap(i => i.categories || []));
    const ordered = (CATEGORIES as readonly string[]).filter(c => present.has(c));
    const extra = [...present].filter(c => !(CATEGORIES as readonly string[]).includes(c)).sort();
    return [...ordered, ...extra];
  }, [allItems, filters.type]);

  const hasEvents = useMemo(() => allItems.some(i => i.type === "evento"), [allItems]);
  const selectedItem = filtered.find(i => i.id === selectedId) ?? null;

  const select = useCallback((id: string | null) => {
    setSelectedId(id);
    setSheetSnap("open");
  }, []);

  const clearFilters = useCallback(() => setFilters(INITIAL_FILTERS), []);

  function locateMe() {
    if (!("geolocation" in navigator)) {
      setGeoStatus("unsupported");
      return;
    }
    setGeoStatus("loading");
    navigator.geolocation.getCurrentPosition(
      pos => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocateNonce(n => n + 1);
        setGeoStatus("idle");
      },
      () => setGeoStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }

  const countLabel = `${filtered.length} ${filtered.length === 1 ? "lugar" : "lugares"}`;
  // Sin resultados la ficha se abre sola para mostrar "Ver todo el mapa"
  const effectiveSnap: SheetSnap = filtered.length === 0 && sheetSnap === "peek" ? "open" : sheetSnap;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC]">
      <Navbar />

      <main className="flex-grow pt-24 lg:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Encabezado */}
          <header className="mb-6 lg:mb-8 max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B8860B] mb-3">Barranquilla · Mapa cultural</p>
            <h1 className="font-outfit text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[0.95] text-balance">
              La cultura de la ciudad, <span className="text-primary">barrio por barrio</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
              Experiencias con hacedores locales y eventos que organiza la comunidad. Toca un punto para ver cómo llegar.
            </p>
            {hasEvents && (
              <Link href="/eventos" className="inline-flex items-center gap-1.5 mt-4 text-sm font-bold text-blue-700 hover:underline underline-offset-4">
                Ver la agenda por fechas <ChevronRight size={14} />
              </Link>
            )}
          </header>

          {/* Filtros */}
          <div className="mb-5">
            <MapFilters
              value={filters}
              onChange={setFilters}
              counts={counts}
              categories={categories}
              showDateFilter={hasEvents && filters.type !== "experience"}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_400px] gap-6">
            {/* Mapa */}
            <div className="relative -mx-4 sm:mx-0 h-[74svh] min-h-[520px] lg:h-[680px] sm:rounded-[2rem] overflow-hidden border-y sm:border border-gray-100 bg-[#F3F1EA] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.25)]">
              <CulturalMap
                items={filtered}
                selectedId={selectedItem?.id ?? null}
                onSelect={select}
                userLocation={userLocation}
                locateNonce={locateNonce}
              />

              <MapLegend />

              {/* Cerca de mí */}
              <div className="absolute top-[84px] right-[10px] z-[400] flex flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={locateMe}
                  disabled={geoStatus === "loading"}
                  aria-label="Centrar el mapa en mi ubicación"
                  title="Cerca de mí"
                  className="w-[34px] h-[34px] rounded-[4px] bg-white border-2 border-black/20 bg-clip-padding flex items-center justify-center text-gray-800 hover:bg-gray-50 disabled:opacity-60"
                >
                  {geoStatus === "loading" ? <Loader2 size={16} className="animate-spin" /> : <LocateFixed size={16} />}
                </button>
                {(geoStatus === "denied" || geoStatus === "unsupported") && (
                  <p role="status" className="max-w-[200px] text-right text-[11px] font-semibold bg-white rounded-xl px-3 py-2 shadow-md text-gray-700">
                    {geoStatus === "denied"
                      ? "No pudimos ver tu ubicación. Revisa el permiso del navegador."
                      : "Tu navegador no comparte ubicación."}
                  </p>
                )}
              </div>

              {/* Celular: ficha deslizable */}
              <div className="lg:hidden">
                <BottomSheet
                  snap={effectiveSnap}
                  onSnapChange={setSheetSnap}
                  title={
                    selectedItem ? (
                      <p className="text-sm font-black text-gray-900 truncate">{selectedItem.title}</p>
                    ) : (
                      <p className="text-sm font-black text-gray-900">
                        {countLabel}
                        <span className="font-semibold text-gray-400"> en el mapa</span>
                      </p>
                    )
                  }
                >
                  {selectedItem ? (
                    <SelectedExperiencePanel
                      item={selectedItem}
                      onClose={() => select(null)}
                      userLocation={userLocation}
                      variant="sheet"
                    />
                  ) : (
                    <div className="px-3 pb-6">
                      <MapList
                        items={filtered}
                        selectedId={null}
                        onSelect={select}
                        userLocation={userLocation}
                        onClearFilters={clearFilters}
                      />
                    </div>
                  )}
                </BottomSheet>
              </div>
            </div>

            {/* Escritorio: lista o detalle */}
            <aside className="hidden lg:flex flex-col h-[680px] min-h-0" aria-label="Lugares en el mapa">
              {selectedItem ? (
                <div className="overflow-y-auto min-h-0 rounded-[2rem]">
                  <SelectedExperiencePanel item={selectedItem} onClose={() => select(null)} userLocation={userLocation} />
                </div>
              ) : (
                <div className="flex flex-col min-h-0 h-full bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                  <div className="flex items-baseline justify-between px-5 pt-5 pb-3 border-b border-gray-50">
                    <h2 className="font-outfit text-lg font-black text-gray-900 tabular-nums">{countLabel}</h2>
                    {userLocation && <span className="text-[11px] font-bold text-gray-400">Ordenados por cercanía</span>}
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto p-2.5">
                    <MapList
                      items={filtered}
                      selectedId={selectedItem ? selectedId : null}
                      onSelect={select}
                      userLocation={userLocation}
                      onClearFilters={clearFilters}
                    />
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* Llamado al catálogo */}
          <div className="mt-10 bg-gray-900 rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-outfit text-2xl font-black mb-2">¿Prefieres verlo como catálogo?</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Todas las experiencias con fotos, duración y precio en una sola vista.
              </p>
            </div>
            <Link
              href="/experiencias"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors"
            >
              Ver catálogo <ChevronRight size={16} />
            </Link>
          </div>

          <p className="sr-only" aria-live="polite">{countLabel}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

// useSearchParams exige un límite de Suspense para el prerender
export default function MapaCulturalPage() {
  return (
    <Suspense fallback={null}>
      <MapaCulturalContent />
    </Suspense>
  );
}
