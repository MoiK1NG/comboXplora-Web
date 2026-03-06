import React from 'react';
import Image from 'next/image';
import { Button } from '../ui/Button';
import { Star } from 'lucide-react';

export function HeroSection() {
    return (
        <section className="relative min-h-[100vh] flex items-center pt-32 pb-24 overflow-hidden bg-white">
            {/* Premium Minimal Grid Background */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />

            {/* Soft Lighting Blobs */}
            <div className="absolute top-0 right-10 w-[500px] h-[500px] bg-primary/10 rounded-full filter blur-[120px] mix-blend-multiply pointer-events-none" />
            <div className="absolute bottom-10 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full filter blur-[120px] mix-blend-multiply pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                {/* Left: Typography & CTAs */}
                <div className="text-left relative z-20">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-orange-50/80 border border-orange-100 text-orange-700 font-bold text-xs mb-8 uppercase tracking-widest shadow-sm backdrop-blur-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                        </span>
                        La Nueva Forma de Viajar
                    </div>

                    <h1 className="font-outfit text-6xl md:text-7xl lg:text-[5.5rem] font-black text-gray-900 leading-[1.02] mb-8 text-balance tracking-tight">
                        Descubre <br />Barranquilla <br />
                        <span className="relative inline-block mt-2">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#c79a10]">a Través de su Gente</span>
                            <svg className="absolute w-full h-4 -bottom-1 left-0 text-primary/30 z-0" viewBox="0 0 100 10" preserveAspectRatio="none">
                                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                            </svg>
                        </span>
                    </h1>

                    <p className="font-sans text-[1.2rem] text-gray-500 mb-12 text-balance max-w-lg leading-[1.7]">
                        Conecta con locales, hacedores culturales y la verdadera esencia de la ciudad. Vive experiencias inmersivas diseñadas para mentes curiosas.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 mb-14">
                        <Button size="lg" className="h-16 w-full sm:w-auto text-lg shadow-[0_8px_20px_-6px_rgba(244,196,48,0.5)]">
                            Descubrir Experiencias
                        </Button>
                        <Button variant="secondary" size="lg" className="h-16 w-full sm:w-auto text-lg">
                            Ver Video
                        </Button>
                    </div>

                    {/* Social Proof Avatar Group */}
                    <div className="flex items-center gap-5">
                        <div className="flex -space-x-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm relative">
                                    <Image src={i === 1 ? "/images/experience_community_1772729851298.png" : i === 2 ? "/images/experience_gastronomy_1772729379901.png" : "/images/hero_barranquilla_1772729237395.png"} alt="User" fill className="object-cover" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-50 flex items-center justify-center font-bold text-gray-600 shadow-sm text-sm z-10">
                                +1k
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex text-primary">
                                {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" strokeWidth={0} />)}
                            </div>
                            <span className="text-sm font-sans font-medium text-gray-600 mt-1">
                                <span className="font-bold text-gray-900">4.9/5</span> de 500+ viajeros
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right: Layered Image Composition */}
                <div className="relative w-full h-[600px] lg:h-[750px] lg:mt-0 mt-10">
                    {/* Offset Frame Decoration */}
                    <div className="absolute top-10 -right-4 w-[90%] h-[90%] rounded-[2.5rem] border-2 border-gray-100/50 bg-gray-50/30 backdrop-blur-sm -rotate-3 transition-transform duration-1000 ease-out hover:rotate-0" />

                    {/* Main Hero Image */}
                    <div className="absolute inset-0 w-[95%] h-[95%] rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.15)] bg-gray-100 group">
                        <Image
                            src="/images/hero_barranquilla_1772729237395.png"
                            alt="Grupo de amigos"
                            fill
                            className="object-cover transform group-hover:scale-105 transition-transform duration-[2s] ease-out will-change-transform"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Floating Floating Metadata Card 1 */}
                    <div className="absolute bottom-20 -left-10 bg-white/95 backdrop-blur-xl rounded-[1.5rem] p-5 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-white/50 flex items-center gap-4 hover:-translate-y-2 transition-transform duration-500 animate-[bounce_6s_infinite_ease-in-out]">
                        <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z" /><circle cx="12" cy="10" r="3" /></svg>
                        </div>
                        <div>
                            <p className="font-outfit font-black text-gray-900 text-lg">100% Local</p>
                            <p className="font-sans text-xs text-gray-500 font-medium">Guiado por hacedores</p>
                        </div>
                    </div>

                    {/* Floating Image Card 2 */}
                    <div className="absolute top-24 -right-6 w-44 h-56 rounded-[1.5rem] overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] border-4 border-white animate-[bounce_7s_infinite_reverse_ease-in-out]">
                        <Image src="/images/experience_culture_1772730369365.png" alt="Cultura" fill className="object-cover" />
                    </div>
                </div>
            </div>
        </section>
    );
}
