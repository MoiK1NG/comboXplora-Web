"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Experience, AudioPoint, MapItem } from "../../lib/types";

// Leaflet default icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface CulturalMapProps {
    items: MapItem[];
    onMarkerClick: (item: MapItem) => void;
}

export default function CulturalMap({ items, onMarkerClick }: CulturalMapProps) {
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
        const bgClass = type === "experience" ? "bg-[#F4C430]" : "bg-[#2A9D8F]";
        const borderClass = "border-white border-2";
        const shadowClass = "shadow-lg";

        // We use a simple divIcon allowing Tailwind classes
        const html = `
      <div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); display: flex; align-items: center; justify-content: center;">
      </div>
    `;

        return L.divIcon({
            html,
            className: "custom-leaflet-marker", // generic class to avoid default background
            iconSize: [24, 24],
            iconAnchor: [12, 12],
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
                    eventHandlers={{
                        click: () => onMarkerClick(item),
                    }}
                />
            ))}
        </MapContainer>
    );
}
