import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createElement } from "react";
import {
  CalendarDays, Clock, MapPin, Navigation, Ticket, Wifi, Accessibility, Car, Bath, CalendarPlus, Map as MapIcon, ArrowLeft,
} from "lucide-react";
import { Navbar } from "../../../components/layouts/Navbar";
import { Footer } from "../../../components/layouts/Footer";
import { ShareButtons } from "../../../components/eventos/share-buttons";
import { fetchEventBySlug } from "../../../lib/db";
import { LAYERS, iconFor, directionsUrl, isYes } from "../../../components/map/map-config";
import { formatLongDate, formatTime, relativeDateLabel, googleCalendarUrl, todayISO } from "../../../lib/event-dates";
import { eventUrl, DEFAULT_OG_IMAGE, SITE_NAME } from "../../../lib/site";

// La página se regenera cada 10 minutos; al aprobar un evento aparece sin redeploy.
export const revalidate = 600;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const item = await fetchEventBySlug(slug);
  if (!item || !item.eventDate) {
    return { title: `Evento no encontrado | ${SITE_NAME}` };
  }
  const when = `${formatLongDate(item.eventDate)}${item.startTime ? `, ${formatTime(item.startTime)}` : ""}`;
  const where = item.venueName || item.address || "Barranquilla";
  const description = `${when} · ${where}. ${item.shortDescription || "Evento cultural en Barranquilla."}`.slice(0, 200);
  const url = eventUrl(slug);
  return {
    title: `${item.title} | Agenda cultural de Barranquilla`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: item.title,
      description,
      images: [{ url: item.coverImage || DEFAULT_OG_IMAGE }],
      locale: "es_CO",
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      description,
      images: [item.coverImage || DEFAULT_OG_IMAGE],
    },
  };
}

const AMENITIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "accesible", label: "Accesible", icon: Accessibility },
  { key: "parqueadero", label: "Parqueadero", icon: Car },
  { key: "banos", label: "Baños", icon: Bath },
] as const;

export default async function EventoPage({ params }: Params) {
  const { slug } = await params;
  const item = await fetchEventBySlug(slug);
  if (!item || !item.eventDate) notFound();

  const layer = LAYERS.evento;
  const isPast = item.eventDate < todayISO();
  const time = [formatTime(item.startTime), formatTime(item.endTime)].filter(Boolean).join(" – ");
  const place = [item.venueName, item.address].filter(Boolean);
  const amenities = AMENITIES.filter(a => isYes(item.amenities?.[a.key]));
  const url = eventUrl(slug);
  const calendarUrl = googleCalendarUrl({
    title: item.title,
    dateISO: item.eventDate,
    startTime: item.startTime,
    endTime: item.endTime,
    location: place.join(", "),
    details: `${item.shortDescription || ""}\n\n${url}`.trim(),
  });
  const shareText = `${item.title} · ${relativeDateLabel(item.eventDate)}${time ? ` ${time}` : ""}${item.venueName ? ` en ${item.venueName}` : ""}`;

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC]">
      <Navbar />

      <main className="flex-grow pt-24 lg:pt-28 pb-16">
        <article className="max-w-5xl mx-auto px-4 sm:px-6">
          <Link href="/eventos" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 mb-5">
            <ArrowLeft size={14} /> Agenda cultural
          </Link>

          {/* Portada */}
          <div className="relative rounded-[2rem] overflow-hidden border border-gray-100 bg-gray-100 aspect-[16/9] sm:aspect-[21/9]">
            {item.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.coverImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: layer.soft }}>
                {createElement(iconFor(item), { size: 72, color: layer.color, "aria-hidden": true })}
              </div>
            )}
            <span
              className="absolute top-4 left-4 inline-flex items-center px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.12em] shadow"
              style={{ background: layer.color, color: layer.ink }}
            >
              {layer.label}
            </span>
            {isPast && (
              <span className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-gray-900/85 text-white text-[10px] font-black uppercase tracking-[0.12em]">
                Ya pasó
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-8 lg:gap-12 mt-8">
            {/* Columna principal */}
            <div>
              {(item.categories?.length > 0 || item.eventKind) && (
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-blue-700 mb-3">
                  {item.categories?.length > 0 ? item.categories.join(" · ") : item.eventKind}
                </p>
              )}
              <h1 className="font-outfit text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1] text-balance">
                {item.title}
              </h1>

              <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-800" style={{ background: layer.soft }}>
                    <CalendarDays size={18} aria-hidden="true" />
                  </div>
                  <div>
                    <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400">Cuándo</dt>
                    <dd className="text-sm font-bold text-gray-900 capitalize">{formatLongDate(item.eventDate)}</dd>
                    {time && <dd className="text-sm text-gray-600 inline-flex items-center gap-1 mt-0.5"><Clock size={12} aria-hidden="true" />{time}</dd>}
                  </div>
                </div>
                {place.length > 0 && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-800" style={{ background: layer.soft }}>
                      <MapPin size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <dt className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dónde</dt>
                      {item.venueName && <dd className="text-sm font-bold text-gray-900">{item.venueName}</dd>}
                      {item.address && <dd className="text-sm text-gray-600">{item.address}</dd>}
                    </div>
                  </div>
                )}
              </dl>

              {item.shortDescription && (
                <div className="mt-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 mb-3">Sobre el evento</h2>
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg whitespace-pre-line max-w-[65ch]">{item.shortDescription}</p>
                </div>
              )}

              {amenities.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 mb-3">El lugar cuenta con</h2>
                  <ul className="flex flex-wrap gap-2">
                    {amenities.map(a => (
                      <li key={a.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
                        <a.icon size={13} aria-hidden="true" /> {a.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-10">
                <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 mb-3">Compartir</h2>
                <ShareButtons url={url} title={item.title} text={shareText} />
              </div>
            </div>

            {/* Acciones */}
            <aside className="lg:sticky lg:top-28 self-start">
              <div className="bg-white rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_-25px_rgba(0,0,0,0.2)] p-6 flex flex-col gap-3">
                <p className="text-sm text-gray-500">
                  <span className="font-black text-gray-900">{relativeDateLabel(item.eventDate)}</span>
                  {time ? ` · ${time}` : ""}
                </p>
                {item.registrationUrl && !isPast && (
                  <a
                    href={item.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-4 rounded-xl font-black text-sm transition-colors"
                  >
                    <Ticket size={16} /> Inscribirse
                  </a>
                )}
                <a
                  href={directionsUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center justify-center gap-2 px-5 py-4 rounded-xl font-black text-sm transition-colors ${
                    item.registrationUrl && !isPast ? "bg-gray-900 hover:bg-gray-800 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Navigation size={16} /> Cómo llegar
                </a>
                {!isPast && (
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <CalendarPlus size={16} /> Añadir a mi calendario
                  </a>
                )}
                <Link
                  href={`/mapa-cultural?evento=${encodeURIComponent(slug)}`}
                  className="inline-flex items-center justify-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 py-2"
                >
                  <MapIcon size={15} /> Ver en el mapa cultural
                </Link>
                <p className="text-[11px] text-gray-400 leading-relaxed border-t border-gray-100 pt-3 mt-1">
                  Evento organizado por la comunidad y revisado por ComboXplora. Los detalles pueden cambiar; confirma con el organizador.
                </p>
              </div>
            </aside>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
