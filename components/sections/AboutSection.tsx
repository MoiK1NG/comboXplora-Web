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
        <section id="nosotros" className="py-28 bg-[#FFFDF7] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Visual Side */}
                    <div className="relative order-2 lg:order-1">
                        <div className="grid grid-cols-2 gap-5 h-[650px]">
                            <div className="space-y-5">
                                <div className="relative h-2/3 w-full rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white group">
                                    <Image src="/images/experience_culture_1772730369365.png" alt="Cultura" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                                <div className="relative h-1/3 w-full rounded-[2.5rem] overflow-hidden shadow-sm border border-black/5 bg-primary/10 flex items-center justify-center p-8">
                                    <Image src="/logos/ComboXplora-04.png" alt="Logo" width={180} height={180} className="object-contain" />
                                </div>
                            </div>
                            <div className="space-y-5 pt-16">
                                <div className="relative h-1/4 w-full rounded-[2.5rem] overflow-hidden shadow-sm border border-black/5 bg-accent/10 flex items-center justify-center font-outfit text-3xl font-black text-accent tracking-wide">
                                    Auténtico
                                </div>
                                <div className="relative h-3/4 w-full rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white group">
                                    <Image src="/images/experience_historia_1772729674439.png" alt="Historia" fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                </div>
                            </div>
                        </div>

                        {/* Decor blob */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-4/5 bg-primary/20 rounded-full filter blur-[120px] -z-10" />
                    </div>

                    {/* Text Side */}
                    <div className="order-1 lg:order-2 pl-0 lg:pl-10">
                        <SectionHeader
                            title="Más que un tour, es vivir la ciudad"
                            subtitle="ComboXplora no es turismo tradicional. Somos una plataforma impulsada por la comunidad para conectar a locales y visitantes con la esencia vibrante de Barranquilla."
                            centered={false}
                        />

                        <div className="space-y-8 font-sans text-gray-600 text-[1.15rem] leading-[1.8]">
                            <p>
                                Creemos que la mejor manera de conocer un lugar es a través de las personas que crean su cultura todos los días. Artesanos, músicos, cocineras tradicionales y narradores locales son tus anfitriones.
                            </p>
                            <p>
                                Al unirte a una experiencia ComboXplora, no solo apoyas la economía local, sino que contribuyes a la preservación del patrimonio cultural, escuchas historias reales y forjas conexiones genuinas.
                            </p>
                        </div>

                        <div className="mt-16 grid grid-cols-3 gap-8 pt-10 border-t-2 border-gray-100">
                            {stats.map((stat, i) => (
                                <div key={i}>
                                    <p className="font-outfit text-[2.75rem] font-black text-gray-900 mb-2">{stat.value}</p>
                                    <p className="font-sans text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
