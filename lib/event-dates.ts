// Utilidades de fechas para eventos del mapa.
// Las fechas se manejan como texto YYYY-MM-DD en hora local (Barranquilla),
// así evitamos corrimientos de un día por zona horaria.

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Hoy como YYYY-MM-DD en la hora local del navegador o servidor. */
export function todayISO(now: Date = new Date()): string {
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Suma días a una fecha YYYY-MM-DD. */
export function addDaysISO(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d + days);
  return todayISO(dt);
}

/**
 * Convierte la fecha que guarda Google Sheets (es-CO, día/mes/año) a YYYY-MM-DD.
 * Acepta "12/7/2026", "12-07-2026", "2026-07-12". Devuelve null si no la reconoce.
 */
export function parseFechaEvento(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const s = raw.trim();

  const iso = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (iso) return `${iso[1]}-${pad(+iso[2])}-${pad(+iso[3])}`;

  const dmy = s.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})/);
  if (dmy) {
    const day = +dmy[1];
    const month = +dmy[2];
    let year = +dmy[3];
    if (year < 100) year += 2000;
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    return `${year}-${pad(month)}-${pad(day)}`;
  }
  return null;
}

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const WEEKDAYS = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];

/** "sáb 12 jul" */
export function formatShortDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WEEKDAYS[dt.getDay()]} ${d} ${MONTHS[m - 1]}`;
}

/** "Hoy", "Mañana" o "sáb 12 jul" */
export function relativeDateLabel(iso: string, today: string = todayISO()): string {
  if (iso === today) return "Hoy";
  if (iso === addDaysISO(today, 1)) return "Mañana";
  return formatShortDate(iso);
}

/** Recorta "8:00:00 a.m." a "8:00 a.m." */
export function formatTime(raw: string | null | undefined): string {
  if (!raw) return "";
  return raw.replace(/^(\d{1,2}:\d{2}):\d{2}/, "$1").trim();
}

export type DateRange = "proximos" | "semana" | "mes";

export function isInRange(iso: string, range: DateRange, today: string = todayISO()): boolean {
  if (iso < today) return false;
  if (range === "proximos") return true;
  const limit = addDaysISO(today, range === "semana" ? 7 : 30);
  return iso <= limit;
}
