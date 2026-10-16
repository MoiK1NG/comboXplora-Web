"use client";

import { createElement, useEffect, useRef } from "react";
import { MapPin, CalendarDays, Navigation } from "lucide-react";
import type { MapItem } from "../../lib/types";
import { LAYERS, iconFor, layerOf, distanceKm, formatDistance } from "./map-config";
import { relativeDateLabel, formatTime } from "../../lib/event-dates";
import type { LatLng } from "./cultural-map";

interface MapListProps {
  items: MapItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  userLocation: LatLng | null;
  onClearFilters?: () => void;
}

function Thumb({ item }: { item: MapItem }) {
  const layer = LAYERS[layerOf(item)];
  if (item.coverImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.coverImage} alt="" loading="lazy" className="w-16 h-16 rounded-xl object-cover bg-gray-100 flex-shrink-0" />;
  }
  return (
    <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: layer.soft }}>
      {createElement(iconFor(item), { size: 22, color: layerOf(item) === "evento" ? layer.color : "#B8860B", "aria-hidden": true })}
    </div>
  );
}

export function MapList({ items, selectedId, onSelect, userLocation, onClearFilters }: MapListProps) {
  const rowRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Al seleccionar un pin, la fila correspondiente queda a la vista
  useEffect(() => {
    if (!selectedId) return;
    rowRefs.current[selectedId]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center gap-3 py-12 px-6">
        <MapPin size={28} className="text-gray-300" aria-hidden="true" />
        <p className="text-sm font-semibold text-gray-700">No hay lugares con esos filtros.</p>
        {onClearFilters && (
          <button type="button" onClick={onClearFilters} className="text-sm font-bold text-gray-900 underline underline-offset-4">
            Ver todo el mapa
          </button>
        )}
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-1.5" aria-label="Lugares en el mapa">
      {items.map(item => {
        const layerKey = layerOf(item);
        const layer = LAYERS[layerKey];
        const active = item.id === selectedId;
        const place = item.type === "evento" ? item.venueName || item.address : item.neighborhood || item.locationLabel;
        return (
          <li key={item.id}>
            <button
              ref={el => { rowRefs.current[item.id] = el; }}
              type="button"
              onClick={() => onSelect(item.id)}
              aria-current={active ? "true" : undefined}
              className={`w-full flex items-center gap-3.5 p-2.5 rounded-2xl text-left transition-colors border focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 ${
                active ? "bg-gray-900 border-gray-900" : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
              }`}
            >
              <Thumb item={item} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: layer.color }} aria-hidden="true" />
                  <span className={`text-[10px] font-black uppercase tracking-[0.12em] ${active ? "text-gray-400" : "text-gray-400"}`}>
                    {layer.short}
                    {item.categories?.[0] ? ` · ${item.categories[0]}` : ""}
                  </span>
                </div>
                <p className={`font-outfit font-black text-[15px] leading-snug line-clamp-2 ${active ? "text-white" : "text-gray-900"}`}>
                  {item.title}
                </p>
                <div className={`mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs ${active ? "text-gray-300" : "text-gray-500"}`}>
                  {item.eventDate && (
                    <span className={`inline-flex items-center gap-1 font-bold ${active ? "text-blue-300" : "text-blue-700"}`}>
                      <CalendarDays size={12} aria-hidden="true" />
                      {relativeDateLabel(item.eventDate)}
                      {item.startTime ? ` · ${formatTime(item.startTime)}` : ""}
                    </span>
                  )}
                  {place && (
                    <span className="inline-flex items-center gap-1 min-w-0">
                      <MapPin size={12} aria-hidden="true" className="flex-shrink-0" />
                      <span className="truncate">{place}</span>
                    </span>
                  )}
                  {userLocation && (
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Navigation size={11} aria-hidden="true" />
                      {formatDistance(distanceKm(userLocation, item))}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
