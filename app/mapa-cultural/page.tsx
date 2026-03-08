"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapFilters } from "../../components/map/map-filters";
import { MapSidebar } from "../../components/map/map-sidebar";
import { MapLegend } from "../../components/map/map-legend";
import { experiences, audioPoints } from "../../lib/map-data";
import { MapItem } from "../../lib/types";

// Dynamically import the map to avoid SSR issues with Leaflet
const CulturalMap = dynamic(() => import("../../components/map/cultural-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">
            <p className="text-gray-400 font-medium">Cargando mapa interactivo...</p>
        </div>
    ),
});

type FilterType = "all" | "experience" | "audio";

export default function MapaCulturalPage() {
    const [filter, setFilter] = useState<FilterType>("all");
    const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

    const allItems: MapItem[] = useMemo(() => {
        return [...experiences, ...audioPoints];
    }, []);

    const filteredItems = useMemo(() => {
        if (filter === "all") return allItems;
        return allItems.filter((item) => item.type === filter);
    }, [allItems, filter]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Header Section */}
            <header className="bg-white border-b border-gray-100 pt-8 pb-6 px-4 sm:px-6 lg:px-8 z-10 relative">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Mapa Cultural de Barranquilla
                    </h1>
                    <p className="mt-3 text-lg text-gray-500 max-w-2xl">
                        Explora experiencias culturales y escucha historias narradas por hacedores locales.
                    </p>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
                {/* Filters */}
                <MapFilters currentFilter={filter} setFilter={setFilter} />

                {/* Map Container relative for sidebar and legend positioning */}
                <div className="relative flex-1 rounded-2xl overflow-hidden shadow-sm border border-gray-200 min-h-[500px]">
                    <CulturalMap
                        items={filteredItems}
                        onMarkerClick={(item) => setSelectedItem(item)}
                    />

                    {/* Map Legend inside Map container */}
                    <MapLegend />

                    {/* Sidebar Panel Overlay */}
                    {selectedItem && (
                        <MapSidebar item={selectedItem} onClose={() => setSelectedItem(null)} />
                    )}
                </div>
            </main>
        </div>
    );
}
