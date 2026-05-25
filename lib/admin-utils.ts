import { nanoid } from "nanoid";

/* ─────────────────────────────────────────────────────────────
   IDs únicos con prefijo
   Ejemplo: generateId("exp") → "exp_V1StGXR8"
───────────────────────────────────────────────────────────── */
export function generateId(prefix: string): string {
  return `${prefix}_${nanoid(8)}`;
}

/* ─────────────────────────────────────────────────────────────
   Slug automático desde un título
   "Taller de Turbantes" → "taller-de-turbantes"
───────────────────────────────────────────────────────────── */
export function slugify(text: string): string {
  return text
    .normalize("NFD")                         // descomponer tildes
    .replace(/[̀-ͯ]/g, "")          // quitar diacríticos
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")            // solo alfanumérico
    .replace(/\s+/g, "-")                     // espacios → guiones
    .replace(/-+/g, "-")                      // guiones dobles → uno
    .replace(/^-|-$/g, "");                   // limpiar extremos
}

/* ─────────────────────────────────────────────────────────────
   Parsear coordenadas desde texto libre o enlace de Google Maps

   Soporta:
   · "10.9850, -74.7820"
   · "10.9850,-74.7820"
   · https://maps.app.goo.gl/xxx  (necesita follow redirect — solo extrae lo que puede)
   · https://www.google.com/maps/place/.../@10.9850,-74.7820,...
   · https://maps.google.com/?q=10.9850,-74.7820
   · https://www.google.com/maps?q=10.9850,-74.7820
───────────────────────────────────────────────────────────── */
export interface ParsedCoords {
  lat: number;
  lng: number;
}

export function parseCoordinates(input: string): ParsedCoords | null {
  if (!input.trim()) return null;

  // 1. Coordenadas directas: "10.9850, -74.7820"
  const directMatch = input.match(/(-?\d{1,3}\.\d+)[,\s]+(-?\d{1,3}\.\d+)/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lng = parseFloat(directMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // 2. URL de Google Maps con @lat,lng
  // https://www.google.com/maps/place/.../@10.9850,-74.7820,17z/...
  const atMatch = input.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // 3. URL con ?q=lat,lng
  // https://maps.google.com/?q=10.9850,-74.7820
  const qMatch = input.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) {
    const lat = parseFloat(qMatch[1]);
    const lng = parseFloat(qMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  // 4. URL con ll=lat,lng
  const llMatch = input.match(/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (llMatch) {
    const lat = parseFloat(llMatch[1]);
    const lng = parseFloat(llMatch[2]);
    if (isValidCoord(lat, lng)) return { lat, lng };
  }

  return null;
}

function isValidCoord(lat: number, lng: number): boolean {
  return (
    !isNaN(lat) && !isNaN(lng) &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  );
}

/* ─────────────────────────────────────────────────────────────
   Categorías predefinidas de ComboXplora
───────────────────────────────────────────────────────────── */
export const CATEGORIES = [
  "Gastronomía",
  "Música",
  "Tradición",
  "Arte",
  "Comunidad",
  "Naturaleza",
  "Historia",
  "Danza",
  "Artesanía",
  "Literatura",
] as const;

export type Category = (typeof CATEGORIES)[number];

/* ─────────────────────────────────────────────────────────────
   Duraciones predefinidas
───────────────────────────────────────────────────────────── */
export const DURATIONS = [
  "1 hora",
  "1.5 horas",
  "2 horas",
  "2.5 horas",
  "3 horas",
  "4 horas",
  "Medio día",
  "Día completo",
  "Fin de semana",
];

/* ─────────────────────────────────────────────────────────────
   Barrios de Barranquilla
───────────────────────────────────────────────────────────── */
export const NEIGHBORHOODS = [
  "El Prado",
  "Manga",
  "Las Nieves",
  "Barranquillita",
  "San Roque",
  "Rebolo",
  "El Boliche",
  "Montecristo",
  "Villa Country",
  "Altamira",
  "Boston",
  "Centro Histórico",
  "Ciudadela Metropolitana",
  "El Carmen",
  "Los Andes",
  "Modelo",
  "El Silencio",
  "Chiquinquirá",
  "San José",
  "Simón Bolívar",
];

/* ─────────────────────────────────────────────────────────────
   Categorías de hacedores
───────────────────────────────────────────────────────────── */
export const HACEDOR_CATEGORIES = [
  "Gastronomía",
  "Música",
  "Arte Visual",
  "Artesanía",
  "Danza y Folclor",
  "Literatura",
  "Moda y Textiles",
  "Tradición Oral",
  "Fotografía",
  "Teatro",
  "Arquitectura Patrimonial",
  "Medicina Tradicional",
];
