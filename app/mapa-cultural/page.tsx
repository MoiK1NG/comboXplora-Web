"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { MapFilters } from "../../components/map/map-filters";
import { MapLegend } from "../../components/map/map-legend";
import { experiences, audioPoints } from "../../lib/map-data";
import { MapItem } from "../../lib/types";
import { SelectedExperiencePanel } from "../../components/map/selected-experience-panel";
import Link from "next/link";
import { ArrowLeft, Map as MapIcon, Info, Users, Heart, Star, ChevronRight } from "lucide-react";

// Dynamically import the map to avoid SSR issues with Leaflet
const CulturalMap = dynamic(() => import("../../components/map/cultural-map"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-gray-50 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-gray-400 font-sans font-bold text-xs uppercase tracking-widest animate-pulse">
                Cargando Experiencia...
            </p>
        </div>
    ),
});

type FilterType = "Todas" | "Gastronomía" | "Arte" | "Literatura" | "Música" | "Comunidad";

export default function MapaCulturalPage() {
    const [filter, setFilter] = useState<FilterType>("Todas");
    const [selectedItem, setSelectedItem] = useState<MapItem | null>(null);

    const allItems: MapItem[] = useMemo(() => {
        return [...experiences, ...audioPoints];
    }, []);

    const filteredItems = useMemo(() => {
        if (filter === "Todas") return allItems;
        return allItems.filter((item) => item.category === filter);
    }, [allItems, filter]);

    const quickLinks = [
        { label: "Experiencias", href: "/#experiencias", icon: <Star size={14} /> },
        { label: "Nosotros", href: "/#nosotros", icon: <Users size={14} /> },
        { label: "Impacto", href: "/#impacto", icon: <Heart size={14} /> },
        { label: "Comunidad", href: "/#comunidad", icon: <Info size={14} /> },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute animate-pulse bottom-[5%] left-[-10%] w-[35%] h-[35%] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Top Navigation Bar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-300"
                        >
                            <ArrowLeft size={16} />
                            Volver al inicio
                        </Link>
                        <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />
                        <Link
                            href="/experiencias"
                            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all duration-300"
                        >
                            Ver Experiencias
                        </Link>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/" className="font-outfit text-xl font-black text-gray-900 tracking-tighter">
                            Combo<span className="text-primary">Xplora</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-12 relative z-10">
                {/* Hero Section */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <MapIcon size={14} />
                        Mapa Interactivo MVP
                    </div>
                    <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.9] mb-6">
                        Mapa Cultural de <br />
                        <span className="text-primary">Experiencias</span>
                    </h1>
                    <p className="font-sans text-lg text-gray-500 max-w-2xl leading-relaxed">
                        Explora Barranquilla a través de experiencias auténticas, ubicadas en los territorios donde la cultura vive de la mano de hacedores locales.
                    </p>
                </div>

                {/* Quick Navigation Anchor Links (Landing Sections) */}
                <div className="flex flex-wrap items-center gap-3 mb-12">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 mr-2">Explorar más:</span>
                    {quickLinks.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-100 text-xs font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 hover:shadow-md transition-all duration-300"
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Filters */}
                <div className="relative">
                    <MapFilters currentFilter={filter} setFilter={setFilter} />
                </div>

                {/* Map Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <div className="group relative rounded-[2.5rem] overflow-hidden shadow-[0_30px_70px_-20px_rgba(0,0,0,0.15)] border border-white bg-white min-h-[600px] h-[600px] transition-all duration-700">
                            <CulturalMap
                                items={filteredItems}
                                onMarkerClick={(item) => setSelectedItem(item)}
                            />

                            {/* Floating Map Legend Overlay */}
                            <MapLegend />

                            {/* Tap Indicator for Map UX */}
                            <div className="absolute top-6 right-6 z-40 bg-gray-900/10 backdrop-blur-md px-4 py-2 rounded-full pointer-events-none">
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-900/60">
                                    Haz clic en un punto • Explora
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-8">
                        {selectedItem ? (
                            <SelectedExperiencePanel
                                item={selectedItem}
                                onClose={() => setSelectedItem(null)}
                            />
                        ) : (
                            <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-gray-200 p-10 flex flex-col items-center justify-center text-center gap-6 h-full min-h-[400px]">
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-300">
                                    <MapIcon size={32} />
                                </div>
                                <div>
                                    <h4 className="font-outfit text-lg font-black text-gray-900 mb-2">Selecciona un marcador</h4>
                                    <p className="text-sm text-gray-500 max-w-[200px] leading-relaxed">
                                        Explora los puntos amarillos y turquesas para conocer historias y experiencias únicas.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Secondary CTA */}
                        <div className="bg-gray-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <h4 className="font-outfit text-xl font-black mb-3">¿Buscas el catálogo completo?</h4>
                            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                                Descubre todas nuestras rutas y talleres en una vista detallada.
                            </p>
                            <Link
                                href="/experiencias"
                                className="flex items-center justify-center w-full py-4 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors duration-300"
                            >
                                Catálogo de Experiencias
                                <ChevronRight size={18} />
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            {/* Sub-footer Section */}
            <footer className="bg-white border-t border-gray-100 py-12 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-xs font-medium text-gray-400">
                        © 2026 ComboXplora • Barranquilla, Colombia • Hecho con <Heart size={10} className="inline text-primary" /> territorio.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/politicas" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest">Políticas</Link>
                        <Link href="/terminos" className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest">Términos</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
