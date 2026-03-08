import React from 'react';
import { Search, Users, Sparkles } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';

export function HowItWorksSection() {
    const steps = [
        {
            icon: <Search size={40} className="text-gray-900 group-hover:text-primary transition-colors duration-500" />,
            title: "Descubre",
            description: "Explora nuestra curaduría de experiencias auténticas guiadas por hacedores culturales locales.",
            glow: "bg-primary/20",
            hoverAccent: "group-hover:border-primary group-hover:bg-[#fffdf7]",
            badgeColor: "group-hover:bg-primary group-hover:text-black group-hover:border-primary",
            delay: "0s"
        },
        {
            icon: <Users size={40} className="text-gray-900 group-hover:text-accent transition-colors duration-500" />,
            title: "Conecta",
            description: "Reserva tu cupo y únete a un grupo reducido de personas curiosas como tú, listos para explorar.",
            glow: "bg-accent/20",
            hoverAccent: "group-hover:border-accent group-hover:bg-[#f2f8f7]",
            badgeColor: "group-hover:bg-accent group-hover:text-white group-hover:border-accent",
            delay: "100ms"
        },
        {
            icon: <Sparkles size={40} className="text-gray-900 group-hover:text-[#F4C430] transition-colors duration-500" />,
            title: "Vive",
            description: "Sumérgete en la cultura, haz nuevos amigos, aprende algo nuevo y crea recuerdos inolvidables.",
            glow: "bg-orange-100",
            hoverAccent: "group-hover:border-[#F4C430] group-hover:bg-[#fffdf7]",
            badgeColor: "group-hover:bg-[#F4C430] group-hover:text-black group-hover:border-[#F4C430]",
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
                            <div className="relative w-32 h-32 mb-10 flex items-center justify-center cursor-default">
                                {/* Soft backdrop blob */}
                                <div className={`absolute inset-0 ${step.glow} rounded-full filter blur-[20px] opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110`} />

                                {/* Main geometric shape */}
                                <div className={`relative w-28 h-28 bg-white shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 rounded-[2rem] flex items-center justify-center group-hover:-translate-y-3 transition-all duration-500 ease-out rotate-3 group-hover:rotate-0 ${step.hoverAccent}`}>
                                    <div className="-rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                        {step.icon}
                                    </div>
                                </div>

                                {/* Elegant Step Number Badge */}
                                <div className={`absolute -top-3 -right-3 w-10 h-10 bg-gray-900 border-[3px] border-white text-white rounded-full flex items-center justify-center font-outfit font-black text-lg shadow-md z-20 transition-colors duration-500 ${step.badgeColor}`}>
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
