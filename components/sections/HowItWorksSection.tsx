import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

export function HowItWorksSection() {
    const steps = [
        {
            icon: <Search size={48} className="text-primary" />,
            title: "Descubre",
            description: "Explora nuestra curaduría de experiencias auténticas guiadas por hacedores culturales locales."
        },
        {
            icon: <Users size={48} className="text-accent" />,
            title: "Conecta",
            description: "Reserva tu cupo y únete a un grupo reducido de personas curiosas como tú, listos para explorar."
        },
        {
            icon: <Sparkles size={48} className="text-yellow-600" />,
            title: "Vive",
            description: "Sumérgete en la cultura, haz nuevos amigos, aprende algo nuevo y crea recuerdos inolvidables."
        }
    ];

    return (
        <section id="como-funciona" className="py-28 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Cómo Funciona"
                    subtitle="Tres pasos sencillos para empezar tu próxima aventura cultural en Barranquilla."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mt-24 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[70px] left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center z-10 group">
                            <div className="w-36 h-36 rounded-3xl bg-[#FAFAFA] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-black/5 flex items-center justify-center mb-10 relative group-hover:-translate-y-3 group-hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] transition-all duration-300 rotate-3 group-hover:rotate-0">
                                <div className="-rotate-3 group-hover:rotate-0 transition-transform duration-300">
                                    {step.icon}
                                </div>
                                {/* Step Number Badge */}
                                <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-900 border-4 border-white text-white rounded-full flex items-center justify-center font-outfit font-black text-xl shadow-lg">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="font-outfit text-3xl font-black text-gray-900 mb-5">{step.title}</h3>
                            <p className="font-sans text-gray-600 text-[1.1rem] leading-relaxed max-w-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
