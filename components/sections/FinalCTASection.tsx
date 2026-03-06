import React from 'react';
import { Button } from '../ui/Button';

export function FinalCTASection() {
    return (
        <section className="bg-primary pt-24 pb-32 px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-y-1/2 -translate-x-1/4" />

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="font-outfit text-5xl md:text-6xl font-black text-black mb-8 text-balance">
                    Listo para redescubrir Barranquilla?
                </h2>
                <p className="font-sans text-xl text-yellow-900 mb-12 max-w-2xl mx-auto text-balance">
                    Únete a la nueva generación de viajeros responsables. Aléjate de las trampas para turistas y vive la ciudad como un local más.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Button
                        className="bg-black text-white hover:bg-zinc-800 hover:text-primary px-10 py-5 text-lg shadow-xl"
                    >
                        Descubre tu próxima experiencia
                    </Button>
                    <Button
                        variant="ghost"
                        className="border-2 border-black text-black hover:bg-black/10 px-10 py-5 text-lg"
                    >
                        Únete como Hacedor
                    </Button>
                </div>
            </div>
        </section>
    );
}
