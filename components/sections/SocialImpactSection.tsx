import React from 'react';
import Image from 'next/image';
import { Heart, Globe2, TrendingUp } from 'lucide-react';

export function SocialImpactSection() {
    const impacts = [
        {
            icon: <Heart className="text-[#DE5858]" size={36} />,
            title: "Preservación Vital",
            desc: "Apoyamos directamente a los portadores de tradiciones que mantienen vivo el legado cultural de Barranquilla."
        },
        {
            icon: <TrendingUp className="text-[#2A9D8F]" size={36} />,
            title: "Economía Local",
            desc: "El 80% de los ingresos van directamente a los hacedores locales y sus familias en la ciudad."
        },
        {
            icon: <Globe2 className="text-[#4E89AE]" size={36} />,
            title: "Sostenibilidad",
            desc: "Promovemos un turismo regenerativo que respeta las comunidades y enriquece su cotidianidad."
        }
    ];

    return (
        <section id="impacto" className="relative py-28 bg-[#fdf5e6] overflow-hidden">
            {/* Soft Background Elements */}
            <div className="absolute inset-0 z-0">
                <Image src="/images/social_impact_1772729871790.png" alt="Impacto Social" fill className="object-cover opacity-10 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#fdf5e6] via-[#fdf5e6]/80 to-[#fdf5e6]/50" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-gray-900 text-balance tracking-tight">
                        Tu exploración genera <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#c79a10]">impacto real</span>
                    </h2>
                    <p className="font-sans text-gray-600 text-[1.15rem] leading-[1.8] max-w-3xl mx-auto">
                        Cada reserva en ComboXplora se traduce en oportunidades directas para los guardianes de nuestra identidad. Un modelo donde todos ganamos.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {impacts.map((item, idx) => (
                        <div key={idx} className="bg-white/80 backdrop-blur-xl border border-white p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 group">
                            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                {item.icon}
                            </div>
                            <h3 className="font-outfit text-3xl font-black mb-5 text-gray-900">{item.title}</h3>
                            <p className="font-sans text-gray-600 leading-relaxed text-[1.05rem]">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
