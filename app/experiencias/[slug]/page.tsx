import { experiences } from "../../../lib/map-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin } from "lucide-react";

export default async function ExperienciaDetalle({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const exp = experiences.find((e) => e.slug === resolvedParams.slug);

    if (!exp) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="w-full h-64 md:h-96 bg-gray-300 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium bg-[#F4C430]/20">
                    [Imagen Real: {exp.coverImage.split('/').pop()}]
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <Link href="/mapa-cultural" className="inline-flex items-center text-sm text-gray-500 hover:text-[#F4C430] mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al mapa
                    </Link>

                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-[#F4C430]/10 text-[#c29b20] rounded-full text-xs font-bold uppercase tracking-wide">
                            {exp.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{exp.title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{exp.shortDescription}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <MapPin className="w-5 h-5 text-[#F4C430] mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Ubicación</p>
                                <p className="font-medium text-gray-900">{exp.neighborhood}</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                            <Clock className="w-5 h-5 text-[#F4C430] mr-3" />
                            <div>
                                <p className="text-xs text-gray-500 uppercase font-semibold">Duración</p>
                                <p className="font-medium text-gray-900">{exp.duration}</p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg text-gray-600">
                        <p>
                            Esta es una página de detalle de muestra (MVP) para la experiencia cultural.
                            Aquí se integrará más información, fotos, testimonios y botones de reserva en el futuro.
                        </p>
                    </div>

                    <div className="mt-10">
                        <button className="w-full md:w-auto px-8 py-4 bg-[#F4C430] hover:bg-[#e0b42c] text-gray-900 font-bold rounded-xl transition-colors shadow-lg shadow-[#F4C430]/30">
                            Próximamente: Reservar Experiencia
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
