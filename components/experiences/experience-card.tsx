import Link from "next/link";
import { Experience } from "../../lib/types";
import { Clock, MapPin, ChevronRight } from "lucide-react";

interface ExperienceCardProps {
    experience: Experience;
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gray-200">
                    {/* Placeholder for real image */}
                    <div className="w-full h-full bg-[#F4C430]/10 flex items-center justify-center text-gray-400">
                        [Imagen: {experience.coverImage.split('/').pop()}]
                    </div>
                </div>
                <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold text-gray-800 uppercase tracking-widest">
                        {experience.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 line-clamp-2 leading-tight min-h-[3rem]">
                    {experience.title}
                </h3>

                <p className="text-gray-500 text-sm mt-3 line-clamp-3 flex-grow">
                    {experience.shortDescription}
                </p>

                <div className="mt-6 flex flex-col gap-2 border-t border-gray-50 pt-4">
                    <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3.5 h-3.5 mr-2 text-primary" />
                        <span>{experience.duration}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-primary" />
                        <span>{experience.neighborhood}</span>
                    </div>
                </div>

                <div className="mt-6">
                    <Link
                        href={`/experiencias/${experience.slug}`}
                        className="inline-flex items-center justify-center w-full py-3 px-4 bg-gray-50 hover:bg-primary hover:text-white text-gray-700 font-semibold rounded-xl transition-all duration-300 group/btn"
                    >
                        Ver experiencia
                        <ChevronRight className="w-4 h-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
