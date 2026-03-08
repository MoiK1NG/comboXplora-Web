import { audioPoints } from "../../../lib/map-data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Headphones, User, PlayCircle } from "lucide-react";

export default async function AudioDetalle({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const audio = audioPoints.find((a) => a.slug === resolvedParams.slug);

    if (!audio) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="w-full h-64 md:h-96 bg-gray-300 relative">
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 font-medium bg-[#2A9D8F]/20">
                    [Imagen Real: {audio.coverImage.split('/').pop()}]
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-[#2A9D8F]">
                    <Link href="/mapa-cultural" className="inline-flex items-center text-sm text-gray-500 hover:text-[#2A9D8F] mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Volver al mapa
                    </Link>

                    <div className="mb-4">
                        <span className="inline-block px-3 py-1 bg-[#2A9D8F]/10 text-[#218276] rounded-full text-xs font-bold uppercase tracking-wide">
                            {audio.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">{audio.title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{audio.shortDescription}</p>

                    <div className="flex items-center p-4 bg-gray-50 rounded-xl mb-8">
                        <User className="w-5 h-5 text-[#2A9D8F] mr-3" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-semibold">Narrador</p>
                            <p className="font-medium text-gray-900">{audio.narrator}</p>
                        </div>
                    </div>

                    <div className="bg-[#2A9D8F]/5 border border-[#2A9D8F]/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-inner">
                        <button className="w-16 h-16 bg-[#2A9D8F] hover:bg-[#218276] text-white rounded-full flex items-center justify-center flex-shrink-0 transition-transform hover:scale-105 shadow-xl shadow-[#2A9D8F]/30 focus:outline-none focus:ring-4 focus:ring-[#2A9D8F]/50">
                            <PlayCircle className="w-8 h-8 ml-1" />
                        </button>
                        <div className="flex-1 w-full">
                            <div className="flex justify-between text-sm text-gray-600 font-medium mb-2">
                                <span>0:00</span>
                                <span>3:45</span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full w-full cursor-pointer overflow-hidden">
                                <div className="h-full bg-[#2A9D8F] w-0"></div>
                            </div>
                            <div className="mt-4 text-center md:text-left">
                                <p className="text-sm text-gray-500 italic flex items-center justify-center md:justify-start">
                                    <Headphones className="w-4 h-4 mr-2" />
                                    Prueba de reproductor (MVP) - {audio.audioUrl.split('/').pop()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="prose prose-lg text-gray-600 mt-8">
                        <p>
                            Esta es una página de detalle de muestra para la historia sonora.
                            En la versión final se mostrará la transcripción del audio y más detalles sobre el narrador y la historia.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
