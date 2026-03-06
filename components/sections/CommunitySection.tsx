import React from 'react';
import Image from 'next/image';
import { SectionHeader } from '../ui/SectionHeader';

export function CommunitySection() {
    return (
        <section id="comunidad" className="py-28 bg-[#FFFBF0] overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Únete a la Tribu"
                    subtitle="Exploradores, creativos, nómadas y locales compartiendo juntos la alegría de descubrir Barranquilla."
                />

                <div className="relative mt-20 group cursor-pointer">
                    <div className="w-full h-[550px] md:h-[700px] rounded-[3.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] relative border-[12px] border-white">
                        <Image src="/images/experience_community_1772729851298.png" alt="Comunidad" fill className="object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-10 left-10 right-10 md:bottom-16 md:left-16 md:right-auto bg-white/95 p-10 rounded-[2.5rem] shadow-2xl max-w-lg backdrop-blur-md border border-white">
                            <h3 className="font-outfit text-4xl font-black text-gray-900 mb-5">Conoce a tu gente</h3>
                            <p className="font-sans text-gray-600 text-[1.1rem] leading-relaxed mb-8">
                                Las experiencias ComboXplora están diseñadas para la interacción. Rompe el hielo, ríe fuerte y vete a casa con nuevos amigos.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className={`w-14 h-14 rounded-full border-4 border-white bg-gray-300 shadow-sm flex items-center justify-center text-xs overflow-hidden`}>
                                            <Image src={i % 2 === 0 ? "/images/experience_gastronomy_1772729379901.png" : "/images/hero_barranquilla_1772729237395.png"} alt="User" width={56} height={56} className="object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <div className="font-sans font-bold text-gray-900">
                                    +1,000 felices
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
