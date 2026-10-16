"use client";

import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, ZoomControl, CircleMarker, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { MapItem } from "../../lib/types";
import { LAYERS, MAP_CENTER, iconFor, layerOf, type LayerKey } from "./map-config";

export type LatLng = { lat: number; lng: number };

interface CulturalMapProps {
  items: MapItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  userLocation: LatLng | null;
  /** Cambia cada vez que se pide centrar en la ubicación del usuario. */
  locateNonce: number;
}

/* ─── Pines ─────────────────────────────────────────── */

const iconCache = new Map<string, L.DivIcon>();

function pinIcon(item: MapItem, state: "normal" | "selected" | "dimmed"): L.DivIcon {
  const layerKey = layerOf(item);
  const layer = LAYERS[layerKey];
  const Icon = iconFor(item);
  const key = `${layerKey}|${Icon.displayName ?? ""}|${(item.categories || [])[0] ?? ""}|${state}`;
  const cached = iconCache.get(key);
  if (cached) return cached;

  const size = state === "selected" ? 46 : 36;
  const glyph = renderToStaticMarkup(
    <Icon size={state === "selected" ? 20 : 16} color={layer.ink} strokeWidth={2.4} aria-hidden="true" />,
  );
  const html = `<div class="cx-pin cx-pin--${state}" style="--pin:${layer.color};width:${size}px;height:${size}px">${glyph}</div>`;

  const icon = L.divIcon({
    html,
    className: "cx-pin-wrap",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
  iconCache.set(key, icon);
  return icon;
}

type ItemMarker = L.Marker & { cxLayer?: LayerKey };

function clusterIcon(cluster: L.MarkerCluster): L.DivIcon {
  const children = cluster.getAllChildMarkers() as ItemMarker[];
  const layers = new Set(children.map(m => m.cxLayer));
  const only = layers.size === 1 ? [...layers][0] : undefined;
  const bg = only ? LAYERS[only].color : "#111827";
  const ink = only ? LAYERS[only].ink : "#F4C430";
  const count = cluster.getChildCount();
  const size = count < 10 ? 40 : count < 30 ? 48 : 56;
  return L.divIcon({
    html: `<div class="cx-cluster" style="background:${bg};color:${ink};width:${size}px;height:${size}px">${count}</div>`,
    className: "cx-pin-wrap",
    iconSize: [size, size],
  });
}

/* ─── Capa agrupada (leaflet.markercluster, imperativa) ─ */

function ClusterLayer({ items, selectedId, onSelect }: Pick<CulturalMapProps, "items" | "selectedId" | "onSelect">) {
  const map = useMap();
  const groupRef = useRef<L.MarkerClusterGroup | null>(null);
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);

  useEffect(() => {
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 44,
      disableClusteringAtZoom: 17,
      iconCreateFunction: clusterIcon,
    });
    groupRef.current = group;
    map.addLayer(group);
    return () => { map.removeLayer(group); groupRef.current = null; };
  }, [map]);

  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    group.clearLayers();
    const markers = items.map(item => {
      const state = !selectedId ? "normal" : item.id === selectedId ? "selected" : "dimmed";
      const marker = L.marker([item.lat, item.lng], {
        icon: pinIcon(item, state),
        title: item.title,
        alt: item.title,
        keyboard: true,
        zIndexOffset: state === "selected" ? 1000 : 0,
        riseOnHover: true,
      }) as ItemMarker;
      marker.cxLayer = layerOf(item);
      marker.on("click", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        onSelectRef.current(item.id);
      });
      marker.on("keypress", (e: L.LeafletKeyboardEvent) => {
        if (e.originalEvent.key === "Enter") onSelectRef.current(item.id);
      });
      return marker;
    });
    group.addLayers(markers);
  }, [items, selectedId]);

  return null;
}

/* ─── Movimientos de cámara ─────────────────────────── */

function MapController({
  items, selectedId, userLocation, locateNonce,
}: Pick<CulturalMapProps, "items" | "selectedId" | "userLocation" | "locateNonce">) {
  const map = useMap();
  const fittedRef = useRef(false);

  // Encuadre inicial: todos los puntos visibles
  useEffect(() => {
    if (fittedRef.current || items.length === 0) return;
    fittedRef.current = true;
    if (items.length === 1) {
      map.setView([items[0].lat, items[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(items.map(i => [i.lat, i.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }, [items, map]);

  // Ir al punto seleccionado (solo cuando cambia la selección)
  const itemsRef = useRef(items);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => {
    if (!selectedId) return;
    const item = itemsRef.current.find(i => i.id === selectedId);
    if (!item) return;
    const zoom = Math.max(map.getZoom(), 16);
    const size = map.getSize();
    // En celular la ficha tapa la mitad de abajo: el pin queda en el cuarto superior
    const shiftY = window.innerWidth < 1024 ? size.y * 0.25 : 0;
    const center = map.unproject(map.project([item.lat, item.lng], zoom).add([0, shiftY]), zoom);
    map.flyTo(center, zoom, { duration: 0.6 });
  }, [selectedId, map]);

  // Ir a la ubicación del usuario cuando lo pide
  const userRef = useRef(userLocation);
  useEffect(() => { userRef.current = userLocation; }, [userLocation]);
  useEffect(() => {
    const loc = userRef.current;
    if (!loc || locateNonce === 0) return;
    map.flyTo([loc.lat, loc.lng], 15, { duration: 0.8 });
  }, [locateNonce, map]);

  return null;
}

/** Clic en el mapa vacío cierra la selección. */
function DeselectOnMapClick({ onSelect }: Pick<CulturalMapProps, "onSelect">) {
  useMapEvents({ click: () => onSelect(null) });
  return null;
}

export default function CulturalMap({ items, selectedId, onSelect, userLocation, locateNonce }: CulturalMapProps) {
  return (
    <div className="absolute inset-0">
      <style>{PIN_CSS}</style>
      <MapContainer
        center={MAP_CENTER}
        zoom={14}
        scrollWheelZoom
        zoomControl={false}
        className="w-full h-full z-0"
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        <ZoomControl position="topright" />
        <ClusterLayer items={items} selectedId={selectedId} onSelect={onSelect} />
        <MapController items={items} selectedId={selectedId} userLocation={userLocation} locateNonce={locateNonce} />
        <DeselectOnMapClick onSelect={onSelect} />
        {userLocation && (
          <>
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={18}
              pathOptions={{ color: "#2563EB", weight: 0, fillColor: "#2563EB", fillOpacity: 0.15 }}
              interactive={false}
            />
            <CircleMarker
              center={[userLocation.lat, userLocation.lng]}
              radius={7}
              pathOptions={{ color: "#FFFFFF", weight: 3, fillColor: "#2563EB", fillOpacity: 1 }}
              interactive={false}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}

const PIN_CSS = `
.cx-pin-wrap { background: transparent; border: 0; }
.cx-pin {
  display: flex; align-items: center; justify-content: center;
  border-radius: 9999px; background: var(--pin);
  border: 3px solid #fff;
  box-shadow: 0 6px 16px -4px rgba(17, 24, 39, .35);
  transition: transform .2s ease, opacity .2s ease, box-shadow .2s ease;
  cursor: pointer;
}
.cx-pin:hover { transform: scale(1.12); }
.cx-pin--selected {
  box-shadow: 0 0 0 4px #fff, 0 0 0 8px var(--pin), 0 12px 24px -6px rgba(17,24,39,.45);
}
.cx-pin--dimmed { opacity: .55; }
.cx-pin--dimmed:hover { opacity: 1; }
.cx-cluster {
  display: flex; align-items: center; justify-content: center;
  border-radius: 9999px; border: 3px solid #fff;
  font: 900 14px/1 var(--font-outfit), system-ui, sans-serif;
  font-variant-numeric: tabular-nums;
  box-shadow: 0 8px 20px -6px rgba(17, 24, 39, .45);
  cursor: pointer;
}
.leaflet-marker-icon:focus-visible { outline: none; }
.leaflet-marker-icon:focus-visible .cx-pin,
.leaflet-marker-icon:focus-visible .cx-cluster { outline: 3px solid #111827; outline-offset: 3px; }
/* Base más calma para que los pines de color resalten */
.leaflet-tile-pane { filter: saturate(.5) brightness(1.04) contrast(.95); }
.leaflet-container { font-family: var(--font-inter), system-ui, sans-serif; }
@media (prefers-reduced-motion: reduce) { .cx-pin { transition: none; } }
`;
