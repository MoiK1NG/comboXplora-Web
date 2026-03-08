"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Experience, AudioPoint, MapItem } from "../../lib/types";
import Link from "next/link";
import { MapPin, Clock, ChevronRight } from "lucide-react";

// Leaflet default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface CulturalMapProps {
    items: MapItem[];
}

export default function CulturalMap({ items }: CulturalMapProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
                <p className="text-gray-400 font-medium">Cargando mapa...</p>
            </div>
        );
    }

    const createCustomIcon = (type: "experience" | "audio") => {
        const color = type === "experience" ? "#F4C430" : "#2A9D8F";

        // We use a simple divIcon allowing Tailwind classes
        const html = `
      <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; transform: scale(1); transition: transform 0.2s;" class="hover:scale-110">
      </div>
    `;

        return L.divIcon({
            html,
            className: "custom-leaflet-marker", // generic class to avoid default background
            iconSize: [28, 28],
            iconAnchor: [14, 14],
        });
    };

    return (
        <MapContainer
            center={[10.9685, -74.7813]}
            zoom={13}
            scrollWheelZoom={true}
            className="w-full h-full z-0"
            zoomControl={false}
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
                >
                    <Popup className="custom-popup" minWidth={240}>
                        <div className="p-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-[#F4C430] py-0.5 px-2 bg-[#F4C430]/10 rounded-full mb-2 inline-block">
                                {item.category}
                            </span>
                            <h3 className="text-base font-extrabold text-gray-900 mb-2 leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-xs text-gray-500 mb-4 line-clamp-2">
                                {item.shortDescription}
                            </p>

                            <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium mb-4">
                                <span className="flex items-center gap-1">
                                    <MapPin size={10} className="text-[#F4C430]" /> {item.type === 'experience' ? item.neighborhood : 'Presencial'}
                                </span>
                                {item.type === 'experience' && (
                                    <span className="flex items-center gap-1">
                                        <Clock size={10} className="text-[#F4C430]" /> {item.duration}
                                    </span>
                                )}
                            </div>

                            <Link
                                href={`/experiencias/${item.slug}`}
                                className="flex items-center justify-center w-full py-2 px-4 bg-gray-900 hover:bg-primary text-white hover:text-black text-xs font-bold rounded-lg transition-all duration-300 group"
                            >
                                Ver experiencia
                                <ChevronRight size={14} className="ml-1 transform group-hover:translate-x-0.5 transition-transform" />
                            </Link>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
