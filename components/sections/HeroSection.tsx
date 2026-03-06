import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#FAFAFA] dark:bg-black">
            {/* Decorative blobs */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[30rem] h-[30rem] bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                {/* Text Content */}
                <div className="text-left">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 uppercase tracking-widest">
                        Turismo Cultural Auténtico
                    </div>
                    <h1 className="font-outfit text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] mb-6 text-balance">
                        Descubre Barranquilla a Través de su Gente
                    </h1>
                    <p className="font-sans text-xl text-gray-600 dark:text-gray-300 mb-10 text-balance max-w-xl">
                        Conecta con locales, hacedores culturales y la verdadera esencia de la ciudad. Vive experiencias inmersivas que no encontrarás en guías turísticas tradicionales.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button size="lg" className="px-8 text-lg w-full sm:w-auto">
                            Explorar Experiencias
                        </Button>
                        <Button variant="secondary" size="lg" className="px-8 text-lg w-full sm:w-auto">
                            Conocer Más
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center gap-4 text-sm font-sans font-medium text-gray-500">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-200 object-cover flex items-center justify-center text-xs overflow-hidden`}>
                                    <Image src={`/images/experience_community_1772729851298.png`} alt="User" width={40} height={40} className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <p>+500 exploradores ya vivieron la experiencia</p>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full h-[500px] lg:h-[650px] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800">
                    <Image
                        src="/images/hero_barranquilla_1772729237395.png"
                        alt="Grupo de amigos disfrutando en Barranquilla"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute bottom-6 left-6 right-6 md:right-auto bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl flex items-center gap-4 hidden sm:flex">
                        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white text-xl font-bold">
                            100%
                        </div>
                        <div>
                            <p className="font-outfit font-bold text-foreground">Conexión Local</p>
                            <p className="font-sans text-sm text-gray-500">Experiencias guiadas por hacedores</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
