import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { CategoryBadge } from './CategoryBadge';

type CategoryType = 'Cultura' | 'Gastronomía' | 'Música' | 'Historia' | 'Comunidad';

interface ExperienceCardProps {
    imageSrc: string;
    category: CategoryType;
    title: string;
    description: string;
    duration?: string;
    location?: string;
}

export function ExperienceCard({
    imageSrc,
    category,
    title,
    description,
    duration = "3 horas",
    location = "Barranquilla"
}: ExperienceCardProps) {
    return (
        <div className="group relative flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.15)] transition-all duration-[600ms] hover:-translate-y-2 border border-gray-100 cursor-pointer">

            {/* Premium Image Container - 4:5 ratio feel */}
            <div className="relative h-80 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500 z-10" />
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-[800ms] ease-out will-change-transform"
                />
                <div className="absolute top-6 left-6 z-20">
                    <CategoryBadge category={category} className="shadow-lg backdrop-blur-md bg-white/95 border-none px-4 py-2 text-[0.7rem]" />
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-8">
                <h3 className="font-outfit text-[1.4rem] font-black text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300 leading-tight">
                    {title}
                </h3>

                <p className="font-sans text-gray-500 mb-8 flex-grow line-clamp-2 leading-relaxed text-sm">
                    {description}
                </p>

                {/* Metadata Footer */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between text-gray-500 font-sans text-sm font-medium mt-auto">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> {duration}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {location}</span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-black transition-colors duration-300">
                        <ArrowRight size={18} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
