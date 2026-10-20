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

const MONTHS_LONG = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const WEEKDAYS_LONG = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

/** "sábado 12 de julio" */
export function formatLongDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return `${WEEKDAYS_LONG[dt.getDay()]} ${d} de ${MONTHS_LONG[m - 1]}`;
}

/** Convierte "8:00:00 a.m." o "14:30" a horas y minutos en 24 h. Null si no se entiende. */
export function parseTimeTo24h(raw: string | null | undefined): { h: number; m: number } | null {
  if (!raw) return null;
  const s = raw.toLowerCase().replace(/\s/g, "").replace(/\./g, "");
  const match = s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?(am|pm)?$/);
  if (!match) return null;
  let h = Number(match[1]);
  const m = Number(match[2]);
  if (match[3] === "pm" && h < 12) h += 12;
  if (match[3] === "am" && h === 12) h = 0;
  if (h > 23 || m > 59) return null;
  return { h, m };
}

export type EventBucket = "hoy" | "semana" | "proximos";

export function bucketFor(iso: string, today: string = todayISO()): EventBucket {
  if (iso === today) return "hoy";
  if (iso <= addDaysISO(today, 7)) return "semana";
  return "proximos";
}

/**
 * Enlace para "Añadir a Google Calendar". Horas en Bogotá; sin hora, evento de día completo.
 */
export function googleCalendarUrl(opts: {
  title: string; dateISO: string; startTime?: string; endTime?: string; location?: string; details?: string;
}): string {
  const start = parseTimeTo24h(opts.startTime);
  const end = parseTimeTo24h(opts.endTime);
  const ymd = opts.dateISO.replace(/-/g, "");
  let dates: string;
  if (start) {
    const stamp = (t: { h: number; m: number }) => `${ymd}T${pad(t.h)}${pad(t.m)}00`;
    const endT = end ?? { h: Math.min(start.h + 2, 23), m: start.m };
    dates = `${stamp(start)}/${stamp(endT)}`;
  } else {
    dates = `${ymd}/${addDaysISO(opts.dateISO, 1).replace(/-/g, "")}`;
  }
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    dates,
    ctz: "America/Bogota",
  });
  if (opts.location) params.set("location", opts.location);
  if (opts.details) params.set("details", opts.details);
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
