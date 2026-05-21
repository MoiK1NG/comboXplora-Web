"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { Search, MapPin, Sparkles, BookOpen, ChevronRight, User } from "lucide-react";
import hacedoresRaw from "../../data/hacedores.json";

type HostCategory = 
    | "Todos" 
    | "Cocina tradicional" 
    | "Artesanía" 
    | "Música" 
    | "Danza" 
    | "Narración" 
    | "Tradición oral" 
    | "Patrimonio" 
    | "Arte urbano";

interface HacedorData {
    id: string;
    name: string;
    slug: string;
    profileImage: string;
    coverImage: string;
    category: string;
    neighborhood: string;
    shortDescription: string;
    fullStory: string;
    gallery: string[];
    instagram: string;
    whatsapp: string;
    specialties: string[];
    experiences: string[];
}

const CATEGORIES: HostCategory[] = [
    "Todos",
    "Cocina tradicional",
    "Artesanía",
    "Música",
    "Danza",
    "Narración",
    "Tradición oral",
    "Patrimonio",
    "Arte urbano",
];

const hacedoresList = hacedoresRaw as HacedorData[];

export default function HacedoresDirectoryPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<HostCategory>("Todos");

    // Filter hacedores based on search and category
    const filteredHacedores = useMemo(() => {
        return hacedoresList.filter((hac) => {
            const matchesCategory = selectedCategory === "Todos" || hac.category === selectedCategory;
            
            const normalizedSearch = searchQuery.toLowerCase().trim();
            const matchesSearch = 
                normalizedSearch === "" ||
                hac.name.toLowerCase().includes(normalizedSearch) ||
                hac.neighborhood.toLowerCase().includes(normalizedSearch) ||
                hac.specialties.some((spec) => spec.toLowerCase().includes(normalizedSearch)) ||
                hac.shortDescription.toLowerCase().includes(normalizedSearch);

            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory]);

    // Group filtered hacedores by category for rich visualization
    const groupedHacedores = useMemo(() => {
        const groups: Record<string, HacedorData[]> = {};
        filteredHacedores.forEach((hac) => {
            if (!groups[hac.category]) {
                groups[hac.category] = [];
            }
            groups[hac.category].push(hac);
        });
        return groups;
    }, [filteredHacedores]);

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] relative overflow-hidden font-sans">
            {/* Background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-15%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

            <Navbar />

            <main className="flex-grow pt-32 pb-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-16 text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6 animate-pulse">
                            <Sparkles size={14} />
                            Hacedores de Identidad
                        </span>
                        <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6">
                            Directorio de <br />
                            <span className="text-primary">Hacedores Culturales</span>
                        </h1>
                        <p className="text-lg text-gray-500 font-medium leading-relaxed">
                            Conoce a los maestros, artistas y sabios tradicionales que custodian la herencia viva de Barranquilla. Detrás de cada experiencia hay un rostro y una historia de resiliencia.
                        </p>
                    </div>

                    {/* Search & Filter bar */}
                    <div className="mb-12 space-y-6">
                        {/* Search Input */}
                        <div className="max-w-xl mx-auto relative group">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors duration-300">
                                <Search size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nombre, especialidad o barrio..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-white border border-gray-100 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.05)] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm font-medium"
                            />
                        </div>

                        {/* Category filter pills */}
                        <div className="flex flex-wrap items-center justify-center gap-3 py-4 overflow-x-auto">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-[10px] sm:text-[11px] font-black tracking-widest uppercase transition-all duration-300 border-2 ${selectedCategory === cat
                                            ? "bg-gray-900 border-gray-900 text-white shadow-lg -translate-y-0.5"
                                            : "bg-white border-gray-50 text-gray-400 hover:border-primary hover:text-gray-900"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Dynamic grid or grouped listing */}
                    {filteredHacedores.length > 0 ? (
                        <div className="space-y-16">
                            {Object.entries(groupedHacedores).map(([cat, list]) => (
                                <div key={cat} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    {/* Saber group header */}
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-4">
                                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                            <BookOpen size={16} />
                                        </div>
                                        <h2 className="font-outfit text-2xl font-black text-gray-900 uppercase tracking-wider">
                                            {cat}
                                        </h2>
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-black text-gray-500">
                                            {list.length} {list.length === 1 ? "Hacedor" : "Hacedores"}
                                        </span>
                                    </div>

                                    {/* Grid of hacedor cards */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {list.map((hac) => (
                                            <Link
                                                key={hac.id}
                                                href={`/hacedores/${hac.slug}`}
                                                className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-1 transition-all duration-500"
                                            >
                                                {/* Header image / Backdrop */}
                                                <div className="relative h-32 bg-gray-50 overflow-hidden">
                                                    {hac.coverImage && (
                                                        <Image
                                                            src={hac.coverImage}
                                                            alt={hac.name}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                                                        />
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                                                </div>

                                                {/* Profile contents */}
                                                <div className="p-8 pt-0 relative flex-grow flex flex-col">
                                                    {/* Floating Profile Image */}
                                                    <div className="relative -mt-10 mb-4 inline-block">
                                                        <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg bg-gray-100">
                                                            {hac.profileImage ? (
                                                                <Image
                                                                    src={hac.profileImage}
                                                                    alt={hac.name}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                                    <User size={32} />
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Name and neighborhood */}
                                                    <div className="mb-4">
                                                        <h3 className="font-outfit text-xl font-black text-gray-900 group-hover:text-primary transition-colors duration-300">
                                                            {hac.name}
                                                        </h3>
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold mt-1">
                                                            <MapPin size={12} className="text-primary" />
                                                            {hac.neighborhood}
                                                        </div>
                                                    </div>

                                                    {/* Short Bio */}
                                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium flex-grow">
                                                        {hac.shortDescription}
                                                    </p>

                                                    {/* specialties preview */}
                                                    <div className="flex flex-wrap gap-1.5 mb-6">
                                                        {hac.specialties.slice(0, 3).map((spec, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 rounded-full bg-gray-50 text-[10px] text-gray-500 font-bold uppercase tracking-wider border border-gray-100"
                                                            >
                                                                {spec}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {/* Link indicator */}
                                                    <div className="border-t border-gray-50 pt-4 flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-900">
                                                        <span>Ver portafolio</span>
                                                        <ChevronRight size={14} className="text-primary group-hover:translate-x-1 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        /* Empty state */
                        <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border-2 border-dashed border-gray-200 p-8 max-w-xl mx-auto">
                            <p className="text-gray-400 font-medium italic text-lg mb-2">No se encontraron hacedores</p>
                            <p className="text-gray-400 text-sm">Prueba ajustando los filtros o tu búsqueda de términos.</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
