import React from 'react';
import Image from 'next/image';
import { SectionHeader } from '../ui/SectionHeader';

export function AboutSection() {
    const stats = [
        { value: "40+", label: "Hacedores Culturales" },
        { value: "5", label: "Categorías Diferentes" },
        { value: "100%", label: "Impacto Local" }
    ];

    return (
        <section id="nosotros" className="py-24 bg-white dark:bg-zinc-950 relative">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Visual Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="grid grid-cols-2 gap-4 h-[600px]">
                            <div className="space-y-4">
                                <div className="relative h-2/3 w-full rounded-3xl overflow-hidden shadow-lg">
                                    <Image src="/images/experience_culture_1772730369365.png" alt="Cultura" fill className="object-cover" />
                                </div>
                                <div className="relative h-1/3 w-full rounded-3xl overflow-hidden shadow-lg bg-primary/20 flex items-center justify-center">
                                    <Image src="/logos/ComboXplora-04.png" alt="Logo" width={150} height={150} className="object-contain" />
                                </div>
                            </div>
                            <div className="space-y-4 pt-12">
                                <div className="relative h-1/3 w-full rounded-3xl overflow-hidden shadow-lg bg-accent/20 flex items-center justify-center font-outfit text-2xl font-bold text-accent">
                                    Auténtico
                                </div>
                                <div className="relative h-2/3 w-full rounded-3xl overflow-hidden shadow-lg">
                                    <Image src="/images/experience_historia_1772729674439.png" alt="Historia" fill className="object-cover" />
                                </div>
                            </div>
                        </div>

                        {/* Decor blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 rounded-full filter blur-3xl -z-10" />
                    </div>

                    {/* Text Side */}
                    <div className="order-1 lg:order-2">
                        <SectionHeader
                            title="Más que un tour, es vivir la ciudad"
                            subtitle="ComboXplora no es turismo tradicional. Somos una plataforma impulsada por la comunidad para conectar a locales y visitantes con la esencia vibrante de Barranquilla."
                            centered={false}
                        />

                        <div className="space-y-6 font-sans text-gray-600 dark:text-gray-300 text-lg">
                            <p>
                                Creemos que la mejor manera de conocer un lugar es a través de las personas que crean su cultura todos los días. Artesanos, músicos, cocineras tradicionales y narradores locales son tus anfitriones.
                            </p>
                            <p>
                                Al unirte a una experiencia ComboXplora, no solo apoyas la economía local, sino que contribuyes a la preservación del patrimonio cultural, escuchas historias reales y forjas conexiones genuinas.
                            </p>
                        </div>

                        <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-zinc-800">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <p className="font-outfit text-4xl font-black text-primary mb-2">{stat.value}</p>
                                    <p className="font-sans text-sm font-semibold text-gray-500 uppercase tracking-wide">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
