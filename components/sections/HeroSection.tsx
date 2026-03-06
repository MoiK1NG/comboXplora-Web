import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';

export function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-[#FAFAFA]">
            {/* Soft Decorative blobs */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[40rem] h-[40rem] bg-[#F4C430]/15 rounded-full filter blur-[100px] animate-pulse" />
            <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[35rem] h-[35rem] bg-[#2A9D8F]/10 rounded-full filter blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
                {/* Text Content */}
                <div className="text-left relative">
                    <div className="inline-flex items-center px-5 py-2.5 rounded-full bg-[#fcf8e8] border border-[#f5e3a8] text-[#c79a10] font-bold text-xs mb-8 uppercase tracking-widest shadow-sm">
                        Turismo Cultural Auténtico
                    </div>
                    <h1 className="font-outfit text-5xl md:text-6xl lg:text-[5rem] font-black text-gray-900 leading-[1.05] mb-8 text-balance focus-in-expand">
                        Descubre Barranquilla a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#d8a815]">Través de su Gente</span>
                    </h1>
                    <p className="font-sans text-xl text-gray-600 mb-12 text-balance max-w-xl leading-relaxed">
                        Conecta con locales, hacedores culturales y la verdadera esencia de la ciudad. Vive experiencias inmersivas que no encontrarás en guías turísticas tradicionales.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-5">
                        <Button size="lg" className="px-10 text-lg w-full sm:w-auto h-16 rounded-[2rem]">
                            Explorar Experiencias
                        </Button>
                        <Button variant="secondary" size="lg" className="px-10 text-lg w-full sm:w-auto h-16 rounded-[2rem] bg-white">
                            Conocer Más
                        </Button>
                    </div>

                    <div className="mt-14 flex items-center gap-5 text-sm font-sans font-semibold text-gray-500 bg-white/60 p-4 pr-6 rounded-[2rem] border border-black/5 w-fit backdrop-blur-sm">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className={`w-12 h-12 rounded-full border-[3px] border-white bg-gray-200 object-cover flex items-center justify-center text-xs overflow-hidden shadow-sm`}>
                                    <Image src={`/images/experience_community_1772729851298.png`} alt="User" width={48} height={48} className="object-cover" />
                                </div>
                            ))}
                        </div>
                        <p>
                            <span className="text-gray-900 font-bold block text-base">+500 viajeros</span>
                            ya vivieron la experiencia
                        </p>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative w-full h-[550px] lg:h-[700px] rounded-[3rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] border-8 border-white group">
                    <Image
                        src="/images/hero_barranquilla_1772729237395.png"
                        alt="Grupo de amigos disfrutando en Barranquilla"
                        fill
                        className="object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                    {/* Floating badge */}
                    <div className="absolute bottom-8 left-8 right-8 md:right-auto bg-white/95 backdrop-blur-xl rounded-2xl p-5 shadow-2xl flex items-center gap-5 border border-white">
                        <div className="w-14 h-14 bg-accent/10 rounded-full flex items-center justify-center text-accent text-2xl font-black">
                            100%
                        </div>
                        <div>
                            <p className="font-outfit font-black text-gray-900 text-lg">Conexión Local</p>
                            <p className="font-sans text-sm text-gray-500 font-medium">Experiencias guiadas por hacedores</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
