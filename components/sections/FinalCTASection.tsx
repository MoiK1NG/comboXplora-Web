import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function FinalCTASection() {
    return (
        <section className="bg-primary pt-32 pb-40 px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Premium Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/20 rounded-full mix-blend-overlay filter blur-[100px] -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/20 rounded-full mix-blend-multiply filter blur-[120px] translate-y-1/3 -translate-x-1/4" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[1px] border-black/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[1px] border-black/5 rounded-full" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border-[1px] border-black/5 rounded-full" />

            <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
                <div className="inline-flex items-center px-5 py-2 rounded-full bg-white/30 border border-white/50 text-yellow-900 font-bold text-xs mb-10 uppercase tracking-widest shadow-sm backdrop-blur-sm">
                    Aventura Asegurada
                </div>

                <h2 className="font-outfit text-6xl md:text-7xl lg:text-[5rem] font-black text-black mb-8 text-balance leading-[1.05] tracking-tight">
                    ¿Listo para <span className="text-white drop-shadow-md">redescubrir</span> Barranquilla?
                </h2>

                <p className="font-sans text-[1.25rem] text-yellow-900/80 mb-14 max-w-2xl mx-auto text-balance leading-relaxed font-medium">
                    Únete a la nueva generación de viajeros responsables. Aléjate de las trampas para turistas y vive la ciudad como un local más.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 w-full sm:w-auto">
                    <Link href="/#experiencias" className="w-full sm:w-auto">
                        <Button
                            size="lg"
                            className="bg-black text-white hover:bg-gray-900 hover:text-primary px-12 py-5 text-[1.15rem] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] h-20 w-full"
                        >
                            Explorar experiencias
                        </Button>
                    </Link>
                    <Link href="/experiencias" className="w-full sm:w-auto">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="border-2 border-black/20 text-black hover:bg-black/5 hover:border-black px-12 py-5 text-[1.15rem] transition-colors duration-300 h-20 w-full"
                        >
                            Ver experiencias
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
