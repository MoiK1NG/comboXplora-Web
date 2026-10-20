import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Map as MapIcon, ChevronRight, PlusCircle } from "lucide-react";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { EventCard } from "../../components/eventos/event-card";
import { fetchApprovedEvents } from "../../lib/db";
import { bucketFor, todayISO, type EventBucket } from "../../lib/event-dates";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "../../lib/site";

// Se regenera cada 10 minutos: los eventos aprobados aparecen sin redeploy.
export const revalidate = 600;

export const metadata: Metadata = {
  title: `Agenda cultural de Barranquilla | ${SITE_NAME}`,
  description: "Qué hay hoy, esta semana y próximamente en Barranquilla: eventos culturales organizados por la comunidad y revisados por ComboXplora.",
  alternates: { canonical: `${SITE_URL}/eventos` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/eventos`,
    siteName: SITE_NAME,
    title: "Agenda cultural de Barranquilla",
    description: "Qué hay hoy, esta semana y próximamente en la ciudad.",
    images: [{ url: DEFAULT_OG_IMAGE }],
    locale: "es_CO",
  },
};

const BUCKETS: { key: EventBucket; title: string; hint: string }[] = [
  { key: "hoy", title: "Hoy", hint: "Lo que pasa hoy en la ciudad" },
  { key: "semana", title: "Esta semana", hint: "Los próximos siete días" },
  { key: "proximos", title: "Próximamente", hint: "Para ir agendando" },
];

const FORM_URL = "https://forms.gle/ybAHeH8TZ2U1z1f88";

export default async function AgendaPage() {
  const events = (await fetchApprovedEvents()).filter(e => e.eventSlug && e.eventDate);
  const today = todayISO();
  const grouped = BUCKETS.map(b => ({ ...b, items: events.filter(e => bucketFor(e.eventDate!, today) === b.key) }));
  const total = events.length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC]">
      <Navbar />

      <main className="flex-grow pt-24 lg:pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <header className="mb-8 lg:mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-700 mb-3">Barranquilla · Agenda cultural</p>
              <h1 className="font-outfit text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[0.95] text-balance">
                ¿Qué hay <span className="text-primary">esta semana</span>?
              </h1>
              <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
                Eventos que organiza la comunidad y revisamos uno por uno. Toca uno para ver cómo llegar, inscribirte o compartirlo.
              </p>
            </div>
            <Link
              href="/mapa-cultural"
              className="inline-flex items-center gap-2 self-start sm:self-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-bold text-gray-800 whitespace-nowrap"
            >
              <MapIcon size={15} /> Ver en el mapa
            </Link>
          </header>

          {total === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
              <CalendarDays size={36} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
              <h2 className="font-outfit text-xl font-black text-gray-900">Todavía no hay eventos programados</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                Los eventos que la comunidad registra aparecen aquí cuando los revisamos. ¿Organizas algo? Cuéntanos.
              </p>
              <a href={FORM_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-gray-900 font-black text-sm hover:bg-[#E3B520]">
                <PlusCircle size={16} /> Registrar mi evento
              </a>
            </div>
          ) : (
            <div className="flex flex-col gap-10">
              {grouped.filter(g => g.items.length > 0).map(g => (
                <section key={g.key} aria-labelledby={`bucket-${g.key}`}>
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <h2 id={`bucket-${g.key}`} className="font-outfit text-2xl font-black text-gray-900">{g.title}</h2>
                      <p className="text-xs text-gray-400 font-medium">{g.hint}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 tabular-nums">
                      {g.items.length} {g.items.length === 1 ? "evento" : "eventos"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {g.items.map(item => <EventCard key={item.id} item={item} />)}
                  </div>
                </section>
              ))}
            </div>
          )}

          {/* Llamado a registrar */}
          <div className="mt-14 bg-gray-900 rounded-[2rem] px-6 py-8 sm:px-10 sm:py-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-outfit text-2xl font-black mb-2">¿Organizas un evento cultural?</h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Regístralo y, si cumple los criterios, lo publicamos en la agenda y en el mapa con su propia página para compartir. Es gratis.
              </p>
            </div>
            <a
              href={FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-primary text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors whitespace-nowrap"
            >
              Registrar evento <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
