import React from 'react';
import { MapPin } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';

export function MapaCulturalSection() {
    return (
        <section id="mapa-cultural" className="py-28 bg-white relative overflow-hidden">
            {/* Decorative Blur Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full filter blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                <SectionHeader
                    title="Mapa Cultural de Experiencias"
                    subtitle="Descubre dónde viven las experiencias culturales de Barranquilla."
                />

                <p className="font-sans text-gray-500 text-[1.15rem] leading-[1.8] max-w-2xl mx-auto mb-16">
                    Próximamente podrás explorar de forma interactiva todo el ecosistema de experiencias y hacedores a lo largo y ancho de nuestra ciudad y el departamento.
                </p>

                {/* Visual Placeholder for the Map */}
                <div className="relative w-full max-w-4xl mx-auto h-[400px] bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex items-center justify-center group">

                    {/* Faint Map Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNCkiLz48L3N2Zz4=')] opacity-50 transition-transform duration-[10s] ease-linear group-hover:scale-110" />

                    {/* Floating Pins */}
                    <div className="absolute top-[30%] left-[25%] text-primary animate-bounce">
                        <MapPin size={32} fill="currentColor" className="text-white" />
                    </div>
                    <div className="absolute top-[60%] right-[30%] text-accent animate-[bounce_2s_infinite]">
                        <MapPin size={40} fill="currentColor" className="text-white" />
                    </div>
                    <div className="absolute bottom-[20%] left-[40%] text-orange-500 animate-[bounce_1.5s_infinite]">
                        <MapPin size={28} fill="currentColor" className="text-white" />
                    </div>

                    {/* Construction Badge */}
                    <div className="relative z-20 flex flex-col items-center bg-white/90 backdrop-blur-md px-8 py-6 rounded-[2rem] shadow-xl border border-gray-100">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 font-bold text-xs uppercase tracking-widest mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                            </span>
                            En Construcción
                        </div>
                        <p className="font-outfit text-2xl font-black text-gray-900 mb-6">Mapa Interactivo</p>
                        <Button variant="secondary" className="cursor-default pointer-events-none">
                            Próximamente
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
