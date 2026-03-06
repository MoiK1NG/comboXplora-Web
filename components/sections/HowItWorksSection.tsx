import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

export function HowItWorksSection() {
    const steps = [
        {
            icon: <Search size={40} className="text-gray-900" />,
            title: "Descubre",
            description: "Explora nuestra curaduría de experiencias auténticas guiadas por hacedores culturales locales.",
            color: "bg-primary/20",
            delay: "0s"
        },
        {
            icon: <Users size={40} className="text-gray-900" />,
            title: "Conecta",
            description: "Reserva tu cupo y únete a un grupo reducido de personas curiosas como tú, listos para explorar.",
            color: "bg-accent/20",
            delay: "100ms"
        },
        {
            icon: <Sparkles size={40} className="text-gray-900" />,
            title: "Vive",
            description: "Sumérgete en la cultura, haz nuevos amigos, aprende algo nuevo y crea recuerdos inolvidables.",
            color: "bg-orange-100",
            delay: "200ms"
        }
    ];

    return (
        <section id="como-funciona" className="py-32 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <SectionHeader
                    title="Tu próxima historia empieza aquí"
                    subtitle="Tres simples pasos para sumergirte en la verdadera Barranquilla, apoyando el patrimonio local."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-28 relative">
                    {/* Subtle Elegance Connecting Dashed Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-[2px] border-t-2 border-dashed border-gray-200" />

                    {steps.map((step, index) => (
                        <div key={index}
                            className="relative flex flex-col items-center text-center z-10 group"
                            style={{ animationDelay: step.delay }}>

                            {/* Premium Floating Icon Container */}
                            <div className="relative w-32 h-32 mb-10 flex items-center justify-center">
                                {/* Soft backdrop blob */}
                                <div className={`absolute inset-0 ${step.color} rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                                {/* Main geometric shape */}
                                <div className="relative w-28 h-28 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 rounded-[2rem] flex items-center justify-center group-hover:-translate-y-3 transition-transform duration-500 ease-out rotate-3 group-hover:rotate-0">
                                    <div className="-rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Elegant Step Number Badge */}
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gray-900 border-[3px] border-white text-white rounded-full flex items-center justify-center font-outfit font-black text-lg shadow-md z-20">
                                    {index + 1}
                                </div>
                            </div>

                            <h3 className="font-outfit text-3xl font-black text-gray-900 mb-4 tracking-tight">{step.title}</h3>
                            <p className="font-sans text-gray-500 text-[1.1rem] leading-[1.7] max-w-[280px]">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
