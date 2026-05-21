"use client";

import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { ClipboardList, Award, Rocket, CheckCircle, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "../../components/ui/Button";

export default function PostulaExperienciaPage() {
    const steps = [
        {
            icon: <ClipboardList className="w-8 h-8 text-primary animate-pulse" />,
            title: "1. Envía tu propuesta",
            desc: "Cuéntanos sobre tu taller, recorrido o saber tradicional en pocos minutos a través de nuestro formulario en línea.",
        },
        {
            icon: <Award className="w-8 h-8 text-teal-500 animate-pulse" />,
            title: "2. Curaduría y Co-creación",
            desc: "Nos conectamos contigo para perfeccionar la ruta, fijar tiempos, precios y asegurar que tu voz sea el centro de la experiencia.",
        },
        {
            icon: <Rocket className="w-8 h-8 text-gray-900 animate-bounce" />,
            title: "3. ¡Al aire con el mundo!",
            desc: "Creamos tu portafolio de hacedor y publicamos tu experiencia en la plataforma para que viajeros nacionales e internacionales comiencen a reservar.",
        },
    ];

    const benefits = [
        "Ingresos justos fijados por ti mismo.",
        "Visibilidad digital y portafolio profesional completo.",
        "Conexión directa con turistas sin intermediarios abusivos.",
        "Capacitación constante en hospitalidad y storytelling cultural.",
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] relative overflow-hidden font-sans">
            {/* Background Animations & Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-15%] w-[45%] h-[45%] bg-teal-500/5 rounded-full blur-[120px] pointer-events-none" />

            <Navbar />

            <main className="flex-grow pt-32 pb-24 relative z-10">
                {/* Hero Section */}
                <div className="max-w-4xl mx-auto px-6 text-center mb-20">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <CheckCircle size={14} />
                        Únete a ComboXplora
                    </span>
                    <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6">
                        Postula tu <br />
                        <span className="text-primary">Experiencia Cultural</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed mt-4 font-medium">
                        ¿Eres un hacedor local, artista o guardián de la tradición en Barranquilla? Comparte tu saber con el mundo y genera ingresos a través del turismo comunitario.
                    </p>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                    {/* Left: Curation & Steps */}
                    <div className="lg:col-span-3 space-y-12">
                        <div>
                            <h2 className="font-outfit text-3xl font-black text-gray-900 mb-4">El proceso de curaduría</h2>
                            <p className="text-gray-500 leading-relaxed font-medium">
                                En ComboXplora valoramos la raíces culturales y el impacto real en la comunidad. Cada experiencia pasa por un proceso de curaduría para garantizar autenticidad, calidad y conexión con la comunidad.
                            </p>
                        </div>

                        {/* Steps Grid */}
                        <div className="space-y-6">
                            {steps.map((s, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white/80 backdrop-blur-md rounded-3xl border border-gray-100 p-8 flex items-start gap-6 hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-primary/10 transition-colors duration-300">
                                        {s.icon}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="font-outfit text-lg font-black text-gray-900">{s.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed font-medium">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: CTA & Benefits */}
                    <div className="lg:col-span-2 space-y-8 sticky top-24">
                        <div className="bg-gray-900 text-white rounded-[2.5rem] p-8 sm:p-10 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.3)] relative overflow-hidden group">
                            {/* Decorative design */}
                            <div className="absolute top-[-20%] right-[-20%] w-48 h-48 bg-primary/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                            <div className="relative z-10 space-y-6">
                                <h3 className="font-outfit text-2xl sm:text-3xl font-black leading-tight">
                                    ¿Listo para empezar a hospedar?
                                </h3>
                                <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-medium">
                                    Haz clic a continuación para llenar nuestro formulario de postulación. Revisaremos tu propuesta manualmente.
                                </p>

                                <a
                                    href="https://forms.gle/VE5hbffhYzLguA5V7"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full inline-flex items-center justify-center gap-3 py-4 bg-primary text-black font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white hover:-translate-y-0.5 transition-all duration-300 shadow-lg active:scale-95"
                                >
                                    Postular experiencia
                                    <ChevronRight size={16} />
                                </a>

                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                        * Revisión manual antes de publicación
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Benefits card */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 space-y-6">
                            <h3 className="font-outfit text-xl font-black text-gray-900">¿Por qué ser un hacedor ComboXplora?</h3>
                            <ul className="space-y-4">
                                {benefits.map((b, idx) => (
                                    <li key={idx} className="flex gap-3 text-sm text-gray-500 font-medium leading-relaxed">
                                        <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-black">✓</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
