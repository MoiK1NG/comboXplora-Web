import Link from "next/link";
import { createElement } from "react";
import { MapPin, Clock, Ticket } from "lucide-react";
import type { MapItem } from "../../lib/types";
import { LAYERS, iconFor } from "../map/map-config";
import { formatTime, relativeDateLabel } from "../../lib/event-dates";
import { eventPath } from "../../lib/site";

/** Tarjeta de evento para la agenda. Toda la tarjeta lleva a la página del evento. */
export function EventCard({ item }: { item: MapItem }) {
  if (!item.eventSlug || !item.eventDate) return null;
  const layer = LAYERS.evento;
  const [, m, d] = item.eventDate.split("-").map(Number);
  const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const time = [formatTime(item.startTime), formatTime(item.endTime)].filter(Boolean).join(" – ");
  const place = item.venueName || item.address;

  return (
    <Link
      href={eventPath(item.eventSlug)}
      className="group grid grid-cols-[64px_minmax(0,1fr)] sm:grid-cols-[64px_120px_minmax(0,1fr)] gap-4 items-center bg-white rounded-2xl border border-gray-100 p-3 sm:p-3.5 hover:border-gray-300 hover:shadow-md transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900"
    >
      {/* Fecha */}
      <div className="h-16 rounded-xl flex flex-col items-center justify-center text-blue-800" style={{ background: layer.soft }}>
        <span className="text-[10px] font-black uppercase tracking-wider leading-none">{months[m - 1]}</span>
        <span className="font-outfit text-2xl font-black leading-none mt-1 tabular-nums">{d}</span>
      </div>

      {/* Imagen */}
      <div className="hidden sm:block h-20 rounded-xl overflow-hidden bg-gray-100">
        {item.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.coverImage} alt="" loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: layer.soft }}>
            {createElement(iconFor(item), { size: 24, color: layer.color, "aria-hidden": true })}
          </div>
        )}
      </div>

      {/* Texto */}
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-blue-700 mb-1">
          {relativeDateLabel(item.eventDate)}
          {item.categories?.[0] ? ` · ${item.categories[0]}` : item.eventKind ? ` · ${item.eventKind}` : ""}
        </p>
        <h3 className="font-outfit text-lg font-black text-gray-900 leading-snug line-clamp-2 text-balance">{item.title}</h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          {time && <span className="inline-flex items-center gap-1"><Clock size={12} aria-hidden="true" />{time}</span>}
          {place && <span className="inline-flex items-center gap-1 min-w-0"><MapPin size={12} aria-hidden="true" className="flex-shrink-0" /><span className="truncate">{place}</span></span>}
          {item.registrationUrl && <span className="inline-flex items-center gap-1 text-purple-700 font-bold"><Ticket size={12} aria-hidden="true" />Con inscripción</span>}
        </div>
      </div>
    </Link>
  );
}
