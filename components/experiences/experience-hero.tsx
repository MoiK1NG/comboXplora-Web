import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Tag, MessageCircle } from "lucide-react";
import { Experience } from "../../lib/types";
import { getWhatsAppUrl } from "../../lib/whatsapp";

interface ExperienceHeroProps {
    experience: Experience;
}

export function ExperienceHero({ experience }: ExperienceHeroProps) {
    return (
        <section className="relative w-full">
            {/* Gradient Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-gray-50 to-white -z-10" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 md:pt-12 md:pb-20">
                <Link
                    href="/experiencias"
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
                    Volver al catálogo
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <div className="order-2 lg:order-1">
                        <div className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                            <Tag className="w-3 h-3 mr-2" />
                            {experience.categories[0]}
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
                            {experience.title}
                        </h1>

                        <p className="text-xl text-gray-600 leading-relaxed mb-8">
                            {experience.shortDescription}
                        </p>

                        <div className="flex flex-wrap gap-6 mb-8">
                            <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                                <Clock className="w-5 h-5 text-primary mr-3" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Duración</p>
                                    <p className="text-sm font-semibold text-gray-900">{experience.duration}</p>
                                </div>
                            </div>
                            <div className="flex items-center bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-100">
                                <MapPin className="w-5 h-5 text-primary mr-3" />
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ubicación</p>
                                    <p className="text-sm font-semibold text-gray-900">{experience.neighborhood}, Barranquilla</p>
                                </div>
                            </div>
                        </div>

                        <a
                            href={getWhatsAppUrl(experience.title)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-extrabold uppercase tracking-widest text-sm px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <MessageCircle className="w-5 h-5 mr-3" />
                            Reservar experiencia
                        </a>
                    </div>

                    {/* Image Container */}
                    <div className="order-1 lg:order-2 w-full aspect-[4/3] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                        <div className="absolute inset-0 bg-gray-200">
                            <div className="w-full h-full bg-[#F4C430]/10 flex items-center justify-center text-gray-400">
                                [Imagen Hero: {experience.coverImage.split('/').pop()}]
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
