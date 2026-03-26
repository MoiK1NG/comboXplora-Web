import { CheckCircle2, Star, Info, Calendar, Headphones, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { Experience } from "../../lib/types";
import { getWhatsAppUrl } from "../../lib/whatsapp";

interface ExperienceDetailsProps {
    experience: Experience;
}

export function ExperienceDetails({ experience }: ExperienceDetailsProps) {
    return (
        <section className="bg-white py-12 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 space-y-16">
                        {/* About Section */}
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center">
                                <span className="w-1.5 h-8 bg-primary mr-4 rounded-full" />
                                Sobre la experiencia
                            </h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="leading-relaxed">
                                    {experience.fullDescription}
                                </p>
                            </div>
                        </div>

                        {/* What you will experience */}
                        <div className="bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <Star className="w-6 h-6 text-primary mr-3" />
                                ¿Qué vivirás en este encuentro?
                            </h2>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {experience.whatToExpect.map((item, index) => (
                                    <li key={index} className="flex items-start">
                                        <CheckCircle2 className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                                        <span className="text-gray-700 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Audio Section (MVP) */}
                        <div className="bg-[#2A9D8F]/5 border border-[#2A9D8F]/20 rounded-3xl p-8 md:p-12 mb-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Headphones className="w-6 h-6 text-[#2A9D8F] mr-3" />
                                Escucha esta experiencia
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Sumérgete en la cultura de Barranquilla escuchando la historia de los hacedores locales.
                                Reproduce el audio a continuación para conocer más detalles y secretos.
                            </p>
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
                                <audio controls className="w-full max-w-md" preload="metadata">
                                    {/* Placeholder audio path. Add .mp3 files matching the slug to /public/audios/ */}
                                    <source src={`/audios/${experience.slug}.mp3`} type="audio/mpeg" />
                                    Tu navegador no soporta el elemento de audio.
                                </audio>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 italic text-center">
                                Nota: Si el audio no reproduce, asegúrate de colocar el archivo {experience.slug}.mp3 en 'public/audios/'.
                            </p>
                        </div>

                        {/* Recommendations */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                <Info className="w-6 h-6 text-primary mr-3" />
                                Recomendaciones
                            </h2>
                            <div className="flex flex-wrap gap-3">
                                {experience.recommendations.map((item, index) => (
                                    <span key={index} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-600 font-medium shadow-sm italic">
                                        • {item}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Gallery Section */}
                        {experience.gallery && experience.gallery.length > 0 && (
                            <div className="pt-8 border-t border-gray-100 mt-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                    <ImageIcon className="w-6 h-6 text-primary mr-3" />
                                    Galería de la experiencia
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {experience.gallery.map((imgSrc, index) => (
                                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                                            <Image
                                                src={imgSrc}
                                                alt={`Galería de ${experience.title} - Imagen ${index + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Sidebar Column */}
                    <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                        <div className="bg-white rounded-3xl shadow-2xl shadow-primary/10 border border-gray-100 p-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 px-1">Resumen de reserva</h3>

                            <div className="space-y-4 mb-8">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-3">La experiencia incluye:</h4>
                                    <ul className="space-y-3">
                                        {experience.includes.map((item, index) => (
                                            <li key={index} className="flex items-center text-sm text-gray-600">
                                                <div className="w-1 h-1 bg-accent rounded-full mr-3" />
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <a
                                href={getWhatsAppUrl(experience.title)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-primary hover:bg-[#e0b42c] text-white font-bold py-4 px-6 rounded-2xl shadow-lg shadow-primary/30 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                            >
                                <Calendar className="w-5 h-5" />
                                Reservar experiencia
                            </a>

                            <p className="text-center text-xs text-gray-400 mt-6">
                                * Conecta directamente con el hacedor cultural después de confirmar.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
