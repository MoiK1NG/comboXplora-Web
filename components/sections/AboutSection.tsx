import React from 'react';
import Image from 'next/image';

export function AboutSection() {
    const stats = [
        { value: "40+", label: "Hacedores Locales" },
        { value: "100%", label: "Impacto Directo" },
        { value: "5", label: "Tipos de Experiencia" }
    ];

    return (
        <section id="nosotros" className="py-32 bg-[#FAFAFA] relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">

                    {/* Left: Asymmetric Editorial Gallery */}
                    <div className="relative order-2 lg:order-1 h-[700px] w-full">
                        {/* Soft backdrop shape */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 rounded-[4rem] -rotate-6" />

                        {/* Large Image */}
                        <div className="absolute top-0 left-0 w-[65%] h-[60%] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-[8px] border-white z-20">
                            <Image src="/images/authentic/about_left.jpg" alt="Comunidad ComboXplora interactuando" fill className="object-cover object-center hover:scale-105 transition-transform duration-[1.5s]" />
                        </div>

                        {/* Medium Image */}
                        <div className="absolute bottom-10 right-0 w-[55%] h-[55%] rounded-[2.5rem] overflow-hidden shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border-[8px] border-white z-30">
                            <Image src="/images/authentic/about_right.jpg" alt="Gastronomía local Barranquilla" fill className="object-cover object-center hover:scale-105 transition-transform duration-[1.5s]" />
                        </div>

                        {/* Small Brand Card */}
                        <div className="absolute top-[40%] left-[5%] w-[35%] aspect-square rounded-[2rem] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] p-6 z-40 flex flex-col justify-center items-center text-center group cursor-pointer">
                            <Image src="/logos/ComboXplora-06.png" alt="Logo" width={120} height={120} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
                            <p className="font-outfit font-black text-sm text-gray-400 tracking-widest uppercase mt-4">Est. 2024</p>
                        </div>
                    </div>

                    {/* Right: Editorial Typography */}
                    <div className="order-1 lg:order-2">
                        <h2 className="font-outfit text-5xl md:text-6xl font-black text-gray-900 mb-8 tracking-tight leading-[1.1] text-balance">
                            Más que turismo, es <span className="text-accent italic font-serif font-medium">pertenencia.</span>
                        </h2>

                        <div className="space-y-6 font-sans text-[1.15rem] leading-[1.8] text-gray-500">
                            <p>
                                ComboXplora nace de la convicción de que la verdadera esencia de Barranquilla no está en monumentos vacíos, sino en las manos que amasan el millo y las voces que cantan al río.
                            </p>
                            <p>
                                No somos una agencia tradicional. Somos una plataforma impulsada por la comunidad, diseñada para que te sumerjas en la ciudad real, apoyando directamente la economía de nuestros hacedores culturales.
                            </p>
                        </div>

                        {/* Elegant Divider */}
                        <div className="w-16 h-1 bg-gray-200 rounded-full my-12" />

                        <div className="grid grid-cols-3 gap-8">
                            {stats.map((stat, i) => (
                                <div key={i} className="flex flex-col">
                                    <span className="font-outfit text-4xl md:text-[2.75rem] font-black text-gray-900 mb-2 leading-none">
                                        {stat.value}
                                    </span>
                                    <span className="font-sans text-[0.75rem] font-bold text-gray-400 uppercase tracking-widest leading-tight">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
