import React from 'react';
import Image from 'next/image';
import { Heart, Sparkles, Map } from 'lucide-react';

export function SocialImpactSection() {
    const impacts = [
        {
            icon: <Heart strokeWidth={1.5} size={32} className="text-rose-500" />,
            title: "Preservación Vital",
            desc: "Protegemos directamente el legado de los portadores de tradición de Barranquilla."
        },
        {
            icon: <Map strokeWidth={1.5} size={32} className="text-emerald-600" />,
            title: "Economía Circular",
            desc: "El 80% de los ingresos se queda en la comunidad local y fomenta el emprendimiento."
        },
        {
            icon: <Sparkles strokeWidth={1.5} size={32} className="text-secondary" />,
            title: "Turismo Regenerativo",
            desc: "Diseñamos rutas que respetan y enriquecen la cotidianidad, sin alterar negativamente los barrios."
        }
    ];

    return (
        <section id="impacto" className="relative py-32 bg-[#F6F5F2] overflow-hidden">
            {/* Premium Minimal Grid Overlay */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-60" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">

                <div className="flex flex-col lg:flex-row gap-20 items-center">

                    {/* Text Content */}
                    <div className="lg:w-1/2">
                        <h2 className="font-outfit text-5xl md:text-6xl font-black mb-8 text-gray-900 text-balance tracking-tight leading-[1.05]">
                            Tu exploración genera <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#c79a10]">impacto real.</span>
                        </h2>
                        <p className="font-sans text-gray-500 text-[1.15rem] leading-[1.8] max-w-xl mb-12">
                            Cada reserva en ComboXplora no es solo un tour; es una inversión directa en el tejido cultural de la ciudad. Juntos garantizamos que las tradiciones sigan vivas para las próximas generaciones.
                        </p>

                        <div className="space-y-10">
                            {impacts.map((item, idx) => (
                                <div key={idx} className="flex gap-6 group">
                                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-[1.2rem] shadow-[0_8px_20px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                                        {item.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-outfit text-2xl font-black mb-2 text-gray-900">{item.title}</h3>
                                        <p className="font-sans text-gray-500 leading-relaxed text-[1rem]">
                                            {item.desc}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Column */}
                    <div className="lg:w-1/2 relative h-[600px] w-full mt-10 lg:mt-0">
                        <div className="absolute inset-0 rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] bg-white border-8 border-white group">
                            <Image src="/images/authentic/impact_v2.jpg" alt="Impacto Social Comunidad" fill className="object-cover transition-transform duration-[2s] group-hover:scale-105 will-change-transform" />
                            <div className="absolute inset-0 bg-black/10 transition-opacity duration-700 group-hover:opacity-0" />
                        </div>

                        {/* Floating Info Card */}
                        <div className="absolute -bottom-8 -left-8 bg-white p-8 rounded-[2rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-gray-100 max-w-xs animate-[bounce_8s_infinite_ease-in-out]">
                            <p className="font-outfit text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Comunidad Alcanzada</p>
                            <p className="font-outfit text-5xl font-black text-gray-900">+500</p>
                            <p className="font-sans text-sm text-gray-500 mt-2 font-medium">Familias beneficiadas en el último año a través del turismo.</p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
