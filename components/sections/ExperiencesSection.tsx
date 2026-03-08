"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SectionHeader } from '../ui/SectionHeader';
import { ExperienceCard } from '../ui/ExperienceCard';
import { Button } from '../ui/Button';

type CategoryType = 'Todas' | 'Cultura' | 'Gastronomía' | 'Música' | 'Historia' | 'Comunidad';

export function ExperiencesSection() {
    const [activeCategory, setActiveCategory] = useState<CategoryType>('Todas');

    const categories: CategoryType[] = ['Todas', 'Cultura', 'Gastronomía', 'Música', 'Historia'];

    const experiences = [
        {
            id: 1,
            slug: "matronas",
            title: "Legado de Matronas",
            category: "Gastronomía" as const,
            imageSrc: "/images/authentic/exp_matronas.heic",
            description: "Dulces tradicionales afrocolombianos. Aprende los secretos culinarios de nuestras matronas.",
            duration: "3 horas",
            location: "Barrio Abajo"
        },
        {
            id: 2,
            slug: "mascaras",
            title: "Taller creativo de máscaras",
            category: "Cultura" as const,
            imageSrc: "/images/authentic/exp_mascaras.heic",
            description: "Pinta tu propia máscara de tradición del Carnaval junto a maestros artesanos.",
            duration: "4 horas",
            location: "Galapa"
        },
        {
            id: 3,
            slug: "turbantes",
            title: "Taller de turbantes afrocaribeños",
            category: "Cultura" as const,
            imageSrc: "/images/authentic/exp_turbantes.jpg",
            description: "Explora la identidad, el significado y la belleza de los turbantes afrocolombianos.",
            duration: "2.5 horas",
            location: "Centro"
        },
        {
            id: 4,
            slug: "macondo",
            title: "Macondo en Barranquilla",
            category: "Historia" as const,
            imageSrc: "/images/authentic/exp_macondo.jpg",
            description: "Recorrido literario y nostálgico inspirado en las huellas de Gabriel García Márquez.",
            duration: "3 horas",
            location: "El Prado"
        },
        {
            id: 5,
            slug: "picotera",
            title: "Cultura Picotera",
            category: "Música" as const,
            imageSrc: "/images/authentic/exp_picotera.heic",
            description: "Experiencia musical y de baile auténtico en los barrios populares.",
            duration: "5 horas",
            location: "Las Nieves"
        }
    ];

    const filtered = activeCategory === 'Todas' ? experiences : experiences.filter(e => e.category === activeCategory);

    return (
        <section id="experiencias" className="py-28 bg-[#fafafa]">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Experiencias Destacadas"
                    subtitle="Una selección curada de aventuras guiadas por nuestros mejores hacedores culturales."
                />

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-8 py-3 rounded-full font-sans font-bold text-sm transition-all duration-300 shadow-sm border ${activeCategory === cat
                                ? 'bg-gray-900 border-gray-900 text-white shadow-md -translate-y-1'
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filtered.map(exp => (
                        <ExperienceCard key={exp.id} {...exp} />
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Link href="/experiencias">
                        <Button variant="secondary" size="lg">Ver Todas las Experiencias</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
