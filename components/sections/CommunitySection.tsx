import React from 'react';
import Image from 'next/image';
import { SectionHeader } from '../ui/SectionHeader';

export function CommunitySection() {
    return (
        <section id="comunidad" className="py-24 bg-[#FFFBF0] dark:bg-zinc-900 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Únete a la Tribu"
                    subtitle="Exploradores, creativos, nómadas y locales compartiendo juntos la alegría de descubrir Barranquilla."
                />

                <div className="relative mt-16 group cursor-pointer">
                    <div className="w-full h-[500px] md:h-[600px] rounded-[3rem] overflow-hidden shadow-2xl relative">
                        <Image src="/images/experience_community_1772729851298.png" alt="Comunidad" fill className="object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-10 left-10 right-10 md:bottom-16 md:left-16 md:right-auto bg-white dark:bg-black p-8 rounded-3xl shadow-xl max-w-md backdrop-blur-sm bg-white/95">
                            <h3 className="font-outfit text-3xl font-bold text-foreground mb-4">Conoce a tu gente</h3>
                            <p className="font-sans text-gray-600 dark:text-gray-400 mb-6">
                                Las experiencias ComboXplora están diseñadas para la interacción. Rompe el hielo, ríe fuerte y vete a casa con nuevos amigos.
                            </p>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className={`w-12 h-12 rounded-full border-2 border-white bg-gray-300 object-cover flex items-center justify-center text-xs overflow-hidden`}>
                                        <Image src={i % 2 === 0 ? "/images/experience_gastronomy_1772729379901.png" : "/images/hero_barranquilla_1772729237395.png"} alt="User" width={48} height={48} className="object-cover" />
                                    </div>
                                ))}
                                <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center font-bold text-gray-500 z-10 text-sm">
                                    +1K
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
