"use client";

import React, { useState } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { ExperienceCard } from '../ui/ExperienceCard';
import { Button } from '../ui/Button';

type CategoryType = 'Todas' | 'Cultura' | 'Gastronomía' | 'Música' | 'Historia' | 'Comunidad';

export function ExperiencesSection() {
    const [activeCategory, setActiveCategory] = useState<CategoryType>('Todas');

    const categories: CategoryType[] = ['Todas', 'Cultura', 'Gastronomía', 'Música', 'Historia', 'Comunidad'];

    const experiences = [
        {
            id: 1,
            title: "Secretos de la Empanada y Arepa e' Huevo",
            category: "Gastronomía" as const,
            imageSrc: "/images/experience_gastronomy_1772729379901.png",
            description: "Aprende los secretos culinarios de las matronas de Barrio Abajo. Cocina, ríe y degusta los sabores auténticos del Caribe colombiano."
        },
        {
            id: 2,
            title: "Ruta del Tambor y la Cumbia",
            category: "Música" as const,
            imageSrc: "/images/experience_music_1772729653199.png",
            description: "Taller inmersivo de percusión folclórica. Siente el ritmo vibrante de los tambores y aprende los pasos básicos de nuestra amada Cumbia."
        },
        {
            id: 3,
            title: "Mitos y Leyendas del Barrio El Prado",
            category: "Historia" as const,
            imageSrc: "/images/experience_historia_1772729674439.png",
            description: "Recorrido arquitectónico nocturno. Descubre las historias ocultas detrás de las majestuosas mansiones de la época dorada."
        },
        {
            id: 4,
            title: "Taller de Máscaras del Carnaval",
            category: "Cultura" as const,
            imageSrc: "/images/experience_culture_1772730369365.png",
            description: "Pinta tu propia máscara de tradición junto a maestros artesanos que han preservado el legado de nuestro gran Carnaval."
        },
        {
            id: 5,
            title: "Muralismo y Conexión en la Loma",
            category: "Comunidad" as const,
            imageSrc: "/images/experience_community_1772729851298.png",
            description: "Únete a un proyecto de arte urbano comunitario. Transforma espacios públicos mientras compartes historias con la gente del barrio."
        }
    ];

    const filtered = activeCategory === 'Todas' ? experiences : experiences.filter(e => e.category === activeCategory);

    return (
        <section id="experiencias" className="py-24 bg-white dark:bg-zinc-950">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Experiencias Destacadas"
                    subtitle="Una selección curada de aventuras guiadas por nuestros mejores hacedores culturales."
                />

                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-sans font-medium text-sm transition-all duration-300 ${activeCategory === cat ? 'bg-black text-white dark:bg-white dark:text-black shadow-lg translate-y-0.5' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filtered.map(exp => (
                        <ExperienceCard key={exp.id} {...exp} />
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Button variant="secondary" size="lg">Ver Todas las Experiencias</Button>
                </div>
            </div>
        </section>
    );
}
