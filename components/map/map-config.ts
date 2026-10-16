import {
  UtensilsCrossed, Music, Landmark, Palette, Users, Leaf, BookOpen,
  Footprints, Scissors, BookText, Star, Ticket, Headphones,
  type LucideIcon,
} from "lucide-react";
import type { MapItem } from "../../lib/types";

/** Historias (audios y relatos) quedan guardadas pero fuera del mapa por ahora. */
export const SHOW_HISTORIAS = false;

/** Centro de Barranquilla. */
export const MAP_CENTER: [number, number] = [10.9685, -74.7813];

export type LayerKey = "experience" | "evento";

export const LAYERS: Record<LayerKey, { label: string; short: string; color: string; ink: string; soft: string }> = {
  experience: {
    label: "Experiencias ComboXplora",
    short: "Experiencias",
    color: "#F4C430",
    ink: "#1F2937",
    soft: "#FEF6D8",
  },
  evento: {
    label: "Eventos de la comunidad",
    short: "Eventos",
    color: "#2563EB",
    ink: "#FFFFFF",
    soft: "#E8EFFD",
  },
};

export function layerOf(item: MapItem): LayerKey {
  return item.type === "evento" ? "evento" : "experience";
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Gastronomía": UtensilsCrossed,
  "Música": Music,
  "Tradición": Landmark,
  "Arte": Palette,
  "Comunidad": Users,
  "Naturaleza": Leaf,
  "Historia": BookOpen,
  "Danza": Footprints,
  "Artesanía": Scissors,
  "Literatura": BookText,
};

/** Ícono del pin: el de su primera categoría conocida, o uno por tipo. */
export function iconFor(item: MapItem): LucideIcon {
  for (const cat of item.categories || []) {
    const icon = CATEGORY_ICONS[cat];
    if (icon) return icon;
  }
  if (item.type === "evento") return Ticket;
  if (item.type === "audio" || item.type === "relato") return Headphones;
  return Star;
}

/** Distancia en km entre dos puntos (fórmula de haversine). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(km < 10 ? 1 : 0).replace(".", ",")} km`;
}

/** Enlace para llegar: el que mandó el organizador o Google Maps con las coordenadas. */
export function directionsUrl(item: MapItem): string {
  if (item.mapsUrl && /^https?:\/\//i.test(item.mapsUrl)) return item.mapsUrl;
  return `https://www.google.com/maps/dir/?api=1&destination=${item.lat},${item.lng}`;
}

/** Las respuestas del formulario vienen como "Sí", "Sí, en el lugar", "No"… */
export function isYes(value: string | undefined): boolean {
  return !!value && /^\s*s[ií]\b/i.test(value);
}
