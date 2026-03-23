import { X, Clock, MapPin, Music, ChevronRight } from "lucide-react";
import { Experience, AudioPoint, MapItem } from "../../lib/types";
import Link from "next/link";
import Image from "next/image";

interface MapSidebarProps {
    item: MapItem | null;
    onClose: () => void;
}

export function MapSidebar({ item, onClose }: MapSidebarProps) {
    if (!item) return null;

    return (
        <div className="absolute top-0 right-0 h-full w-full sm:w-80 md:w-96 bg-white shadow-2xl z-[500] flex flex-col transition-transform duration-300 transform translate-x-0 border-l border-gray-100">
            <div className="relative h-48 sm:h-56 w-full">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-sm transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
                <div className="absolute inset-0 bg-gray-200">
                    <div className="w-full h-full object-cover">
                        {/* Using a regular img tag for mock data, or Next Image if images are real */}
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-400">
                            [Imagen: {item.coverImage.split('/').pop()}]
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider inline-flex items-center gap-1">
                    {item.type === "experience" ? (
                        <><MapPin className="w-3 h-3 text-[#F4C430]" /> Experiencia</>
                    ) : (
                        <><Music className="w-3 h-3 text-[#2A9D8F]" /> Audio</>
                    )}
                </div>
            </div>

            <div className="p-6 flex-1 overflow-y-auto flex flex-col">
                <div className="mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {item.categories[0]}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 mt-1 leading-tight">
                        {item.title}
                    </h2>
                </div>

                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                    {item.shortDescription}
                </p>

                {item.type === "experience" && (
                    <div className="mt-6 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <MapPin className="w-4 h-4 text-[#F4C430]" />
                            <span className="font-medium">Barrio:</span> {item.neighborhood}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <Clock className="w-4 h-4 text-[#F4C430]" />
                            <span className="font-medium">Duración:</span> {item.duration}
                        </div>
                    </div>
                )}

                {item.type === "audio" && (
                    <div className="mt-6 flex flex-col gap-4">
                        <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                <span className="text-gray-500 font-bold text-xs">{item.narrator.charAt(0)}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs text-gray-500">Narrador</span>
                                <span className="font-medium text-gray-900">{item.narrator}</span>
                            </div>
                        </div>

                        <div className="bg-[#2A9D8F]/10 p-4 rounded-xl flex items-center gap-4">
                            <button className="w-12 h-12 bg-[#2A9D8F] hover:bg-[#218276] text-white rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-md">
                                <Music className="w-5 h-5 ml-1" />
                            </button>
                            <div className="flex-1">
                                <div className="h-2 bg-gray-300 rounded-full w-full">
                                    <div className="h-2 bg-[#2A9D8F] rounded-full w-1/3"></div>
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-medium">
                                    <span>0:00</span>
                                    <span>Audio de prueba</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6">
                    <Link
                        href={item.type === "experience" ? `/experiencias/${item.slug}` : `/audios/${item.slug}`}
                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-white font-semibold transition-all shadow-md hover:shadow-lg ${item.type === "experience"
                            ? "bg-[#F4C430] hover:bg-[#e0b42c] text-gray-900 shadow-[#F4C430]/20"
                            : "bg-[#2A9D8F] hover:bg-[#218276] shadow-[#2A9D8F]/20"
                            }`}
                    >
                        Ver {item.type === "experience" ? "experiencia" : "historia sonora"}
                        <ChevronRight className={`w-4 h-4 ${item.type === "experience" ? "text-gray-900" : "text-white"}`} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
