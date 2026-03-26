"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Experience, AudioPoint, MapItem } from "../../lib/types";
import { getWhatsAppUrl } from "../../lib/whatsapp";
import Link from "next/link";
import { MapPin, Clock, ChevronRight } from "lucide-react";

interface CulturalMapProps {
    items: MapItem[];
    onMarkerClick?: (item: MapItem) => void;
}

export default function CulturalMap({ items, onMarkerClick }: CulturalMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Leaflet default icon fix - only runs in browser
        if (typeof window !== 'undefined') {
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });
            setMounted(true);
        }
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-gray-400 font-sans font-bold text-xs uppercase tracking-widest animate-pulse">
                    Preparando Mapa Cultural...
                </p>
            </div>
        );
    }

    const createCustomIcon = (type: "experience" | "audio") => {
        const color = type === "experience" ? "#F4C430" : "#2A9D8F";

        const html = `
      <div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; transform: scale(1); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);" class="hover:scale-125 hover:shadow-2xl">
      </div>
    `;

        return L.divIcon({
            html,
            className: "custom-leaflet-marker",
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });
    };

    return (
        <div style={{ height: '100%', width: '100%', position: 'absolute', inset: 0 }}>
            <MapContainer
                center={[10.9685, -74.7813]}
                zoom={14}
                scrollWheelZoom={true}
                className="w-full h-full z-0"
                zoomControl={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                {items.map((item) => (
                    <Marker
                        key={item.id}
                        position={[item.lat, item.lng]}
                        icon={createCustomIcon(item.type)}
                        eventHandlers={{
                            click: () => onMarkerClick?.(item)
                        }}
                    >
                        <Popup className="custom-popup" minWidth={260}>
                            <div className="p-3">
                                <span className="text-[9px] font-black uppercase tracking-widest text-primary py-1 px-3 bg-primary/10 rounded-full mb-3 inline-block">
                                    {item.categories.join(' • ')}
                                </span>
                                <h3 className="font-outfit text-lg font-black text-gray-900 mb-2 leading-tight">
                                    {item.title}
                                </h3>
                                <p className="font-sans text-[11px] text-gray-500 mb-5 line-clamp-2 leading-relaxed">
                                    {item.shortDescription}
                                </p>

                                <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold mb-5 border-t border-gray-50 pt-3">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin size={12} className="text-primary" /> {item.type === 'experience' ? item.neighborhood : 'Presencial'}
                                    </span>
                                    {item.type === 'experience' && (
                                        <span className="flex items-center gap-1.5">
                                            <Clock size={12} className="text-primary" /> {item.duration}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col gap-2 mt-2">
                                    <Link
                                        href={`/experiencias/${item.slug}`}
                                        className="flex items-center justify-center w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md"
                                    >
                                        Descubrir más
                                    </Link>

                                    {item.type === 'experience' && (
                                        <a
                                            href={getWhatsAppUrl(item.title)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-full py-3 px-4 bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md"
                                        >
                                            Reservar
                                        </a>
                                    )}
                                </div>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
