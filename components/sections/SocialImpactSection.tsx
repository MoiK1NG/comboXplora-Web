import React from 'react';
import Image from 'next/image';
import { SectionHeader } from '../ui/SectionHeader';
import { Heart, Globe2, TrendingUp } from 'lucide-react';

export function SocialImpactSection() {
    const impacts = [
        {
            icon: <Heart className="text-red-400" size={32} />,
            title: "Preservación",
            desc: "Apoyamos directamente a los portadores de tradiciones que mantienen vivo el legado cultural de Barranquilla."
        },
        {
            icon: <TrendingUp className="text-green-400" size={32} />,
            title: "Economía Local",
            desc: "El 80% de los ingresos van directamente a los hacedores locales y sus familias."
        },
        {
            icon: <Globe2 className="text-blue-400" size={32} />,
            title: "Turismo Sostenible",
            desc: "Promovemos un turismo regenerativo que respeta las comunidades y no altera su cotidianidad negativa."
        }
    ];

    return (
        <section id="impacto" className="relative py-24 bg-zinc-950 text-white overflow-hidden">
            {/* Background with overlay */}
            <div className="absolute inset-0 z-0 opacity-40">
                <Image src="/images/social_impact_1772729871790.png" alt="Impacto Social" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/60 mix-blend-multiply" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="font-outfit text-4xl md:text-5xl font-bold mb-6 text-white text-balance">
                        Tu exploración genera <span className="text-primary underline decoration-accent underline-offset-8">impacto real</span>
                    </h2>
                    <p className="font-sans text-gray-300 text-lg md:text-xl max-w-3xl mx-auto">
                        Cada reserva en ComboXplora se traduce en oportunidades directas para los guardianes de nuestra identidad.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {impacts.map((item, idx) => (
                        <div key={idx} className="bg-white/10 backdrop-blur-lg border border-white/10 p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <h3 className="font-outfit text-2xl font-bold mb-4">{item.title}</h3>
                            <p className="font-sans text-gray-300 leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
