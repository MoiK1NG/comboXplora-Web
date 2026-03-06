"use client";

import React, { useRef } from 'react';
import { SectionHeader } from '../ui/SectionHeader';
import { TestimonialCard } from '../ui/TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function TestimonialsSection() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const testimonials = [
        {
            name: "Andrea V.",
            city: "Bogotá, Colombia",
            quote: "Nunca había vivido Barranquilla así. Hacer arepas con Doña Carmen en Barrio Abajo fue lo mejor de mi viaje, sentí que estaba cocinando con una tía.",
            avatarSrc: "/images/experience_community_1772729851298.png"
        },
        {
            name: "Carlos M.",
            city: "Madrid, España",
            quote: "El taller de cumbia me dejó exhausto e inmensamente feliz. La energía de los músicos es contagiosa. ComboXplora realmente te conecta con la esencia local.",
            avatarSrc: "/images/hero_barranquilla_1772729237395.png"
        },
        {
            name: "Laura P.",
            city: "Medellín, Colombia",
            quote: "Participar en la pintada del mural y entender las historias del barrio cambió por completo mi perspectiva. Ya quiero volver a probar otra experiencia.",
            avatarSrc: "/images/experience_gastronomy_1772729379901.png"
        },
        {
            name: "David T.",
            city: "Miami, USA",
            quote: "Hacer mi propia máscara de Carnaval y llevármela de recuerdo es mil veces mejor que comprar un souvenir cualquiera. Muy recomendado.",
            avatarSrc: "/images/experience_culture_1772730369365.png"
        }
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = direction === 'left' ? -400 : 400;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-[#FAFAFA] dark:bg-black overflow-hidden py-32">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex justify-between items-end mb-16">
                    <SectionHeader
                        title="Historias de Exploradores"
                        subtitle="No nos creas a nosotros, cree en los viajeros que ya lo vivieron."
                        centered={false}
                    />
                    <div className="hidden md:flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center hover:bg-primary hover:text-black transition-colors bg-white dark:bg-zinc-900 shadow-sm"
                            aria-label="Previous testimonials"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-200 dark:border-zinc-800 flex items-center justify-center hover:bg-primary hover:text-black transition-colors bg-white dark:bg-zinc-900 shadow-sm"
                            aria-label="Next testimonials"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Area */}
                <div
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory hide-scroll-bar -mx-6 px-6 lg:mx-0 lg:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {testimonials.map((test, index) => (
                        <div key={index} className="snap-center shrink-0">
                            <TestimonialCard {...test} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
