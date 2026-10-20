"use client";

import { createElement } from "react";
import Link from "next/link";
import { eventPath } from "../../lib/site";
import {
  MapPin, Clock, X, CalendarDays, Navigation, Wifi, Accessibility, Car, Bath, ArrowLeft, MessageCircle, Ticket,
} from "lucide-react";
import type { MapItem } from "../../lib/types";
import { getWhatsAppUrl } from "../../lib/whatsapp";
import { LAYERS, layerOf, iconFor, directionsUrl, isYes, distanceKm, formatDistance } from "./map-config";
import { relativeDateLabel, formatTime } from "../../lib/event-dates";
import type { LatLng } from "./cultural-map";

interface SelectedExperiencePanelProps {
  item: MapItem;
  onClose: () => void;
  userLocation?: LatLng | null;
  /** "panel" en escritorio, "sheet" dentro de la ficha deslizable del celular */
  variant?: "panel" | "sheet";
}

function Cover({ item, compact }: { item: MapItem; compact: boolean }) {
  const layer = LAYERS[layerOf(item)];
  const h = compact ? "h-36" : "h-52";
  if (item.coverImage) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={item.coverImage} alt="" className={`w-full ${h} object-cover`} />;
  }
  return (
    <div className={`w-full ${h} flex items-center justify-center`} style={{ background: layer.soft }}>
      {createElement(iconFor(item), { size: 44, color: layerOf(item) === "evento" ? layer.color : "#B8860B", "aria-hidden": true })}
    </div>
  );
}

function Row({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-700">{icon}</div>
      <div className="pt-1.5 text-sm text-gray-600 leading-snug min-w-0">{children}</div>
    </div>
  );
}

const AMENITIES = [
  { key: "wifi", label: "Wi-Fi", icon: Wifi },
  { key: "accesible", label: "Accesible", icon: Accessibility },
  { key: "parqueadero", label: "Parqueadero", icon: Car },
  { key: "banos", label: "Baños", icon: Bath },
] as const;

export function SelectedExperiencePanel({ item, onClose, userLocation, variant = "panel" }: SelectedExperiencePanelProps) {
  const compact = variant === "sheet";
  const layerKey = layerOf(item);
  const layer = LAYERS[layerKey];
  const isEvent = item.type === "evento";
  const amenities = AMENITIES.filter(a => isYes(item.amenities?.[a.key]));
  const timeRange = [formatTime(item.startTime), formatTime(item.endTime)].filter(Boolean).join(" – ");

  return (
    <article className={`bg-white overflow-hidden ${compact ? "" : "rounded-[2rem] border border-gray-100 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.18)]"}`}>
      <div className="relative">
        <Cover item={item} compact={compact} />
        <button
          type="button"
          onClick={onClose}
          aria-label={compact ? "Volver a la lista" : "Cerrar"}
          className="absolute top-3 left-3 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-gray-900 shadow-md hover:bg-white transition-colors"
        >
          {compact ? <ArrowLeft size={18} /> : <X size={18} />}
        </button>
        <span
          className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.12em] shadow"
          style={{ background: layer.color, color: layer.ink }}
        >
          {layer.label}
        </span>
      </div>

      <div className={compact ? "p-5" : "p-7"}>
        {item.categories?.length > 0 && (
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 mb-2">{item.categories.join(" · ")}</p>
        )}
        <h3 className={`font-outfit font-black text-gray-900 leading-tight text-balance ${compact ? "text-xl" : "text-2xl"} mb-3`}>
          {item.title}
        </h3>
        {item.shortDescription && (
          <p className={`text-gray-500 leading-relaxed text-sm mb-6 ${compact ? "line-clamp-4" : ""}`}>{item.shortDescription}</p>
        )}

        <div className="flex flex-col gap-3 mb-6">
          {isEvent && item.eventDate && (
            <Row icon={<CalendarDays size={15} />}>
              <span className="font-bold text-gray-900">{relativeDateLabel(item.eventDate)}</span>
              {timeRange && <span> · {timeRange}</span>}
            </Row>
          )}
          {isEvent ? (
            (item.venueName || item.address) && (
              <Row icon={<MapPin size={15} />}>
                {item.venueName && <span className="block font-bold text-gray-900">{item.venueName}</span>}
                {item.address && <span className="block">{item.address}</span>}
              </Row>
            )
          ) : (
            <Row icon={<MapPin size={15} />}>
              {item.locationLabel && <span className="block font-bold text-gray-900">{item.locationLabel}</span>}
              <span className="block">{item.neighborhood}</span>
              {item.meetingPoint && <span className="block text-xs text-gray-400 mt-0.5">Punto de encuentro: {item.meetingPoint}</span>}
            </Row>
          )}
          {!isEvent && item.duration && <Row icon={<Clock size={15} />}>{item.duration}</Row>}
          {userLocation && (
            <Row icon={<Navigation size={15} />}>
              <span className="tabular-nums">A {formatDistance(distanceKm(userLocation, item))} de ti</span>
            </Row>
          )}
        </div>

        {isEvent && amenities.length > 0 && (
          <ul className="flex flex-wrap gap-2 mb-6" aria-label="Servicios del lugar">
            {amenities.map(a => (
              <li key={a.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold">
                <a.icon size={13} aria-hidden="true" /> {a.label}
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          {isEvent ? (
            <>
              {item.eventSlug && (
                <Link
                  href={eventPath(item.eventSlug)}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
                >
                  Ver evento
                </Link>
              )}
              {item.registrationUrl ? (
                <a
                  href={item.registrationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
                >
                  <Ticket size={16} /> Inscribirse
                </a>
              ) : (
                <a
                  href={directionsUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
                >
                  <Navigation size={16} /> Cómo llegar
                </a>
              )}
            </>
          ) : (
            <>
              {item.slug && (
                <Link
                  href={`/experiencias/${item.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
                >
                  Ver experiencia
                </Link>
              )}
              <a
                href={getWhatsAppUrl(item.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 px-5 py-3.5 rounded-xl font-bold text-sm transition-colors"
              >
                <MessageCircle size={16} /> Reservar
              </a>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
