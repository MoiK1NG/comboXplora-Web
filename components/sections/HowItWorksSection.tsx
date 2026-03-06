import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

export function HowItWorksSection() {
    const steps = [
        {
            icon: <Search size={40} className="text-primary" />,
            title: "Descubre",
            description: "Explora nuestra curaduría de experiencias auténticas guiadas por hacedores culturales locales."
        },
        {
            icon: <Users size={40} className="text-accent" />,
            title: "Conecta",
            description: "Reserva tu cupo y únete a un grupo reducido de personas curiosas como tú, listos para explorar."
        },
        {
            icon: <Sparkles size={40} className="text-yellow-600" />,
            title: "Vive",
            description: "Sumérgete en la cultura, haz nuevos amigos, aprende algo nuevo y crea recuerdos inolvidables."
        }
    ];

    return (
        <section id="como-funciona" className="py-24 bg-[#FAFAFA] dark:bg-black relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Cómo Funciona"
                    subtitle="Tres pasos sencillos para empezar tu próxima aventura en Barranquilla."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary via-accent to-yellow-600 opacity-20" />

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center z-10">
                            <div className="w-32 h-32 rounded-full bg-white dark:bg-zinc-900 shadow-xl border border-gray-100 dark:border-zinc-800 flex items-center justify-center mb-8 relative group hover:scale-105 transition-transform duration-300">
                                {step.icon}
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-outfit font-bold text-xl">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="font-outfit text-2xl font-bold text-foreground mb-4">{step.title}</h3>
                            <p className="font-sans text-gray-600 dark:text-gray-400 text-lg max-w-sm">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
