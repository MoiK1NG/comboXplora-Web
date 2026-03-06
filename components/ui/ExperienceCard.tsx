import React from 'react';
import Image from 'next/image';
import { CategoryBadge } from './CategoryBadge';
import { Button } from './Button';

type CategoryType = 'Cultura' | 'Gastronomía' | 'Música' | 'Historia' | 'Comunidad';

interface ExperienceCardProps {
    imageSrc: string;
    category: CategoryType;
    title: string;
    description: string;
}

export function ExperienceCard({ imageSrc, category, title, description }: ExperienceCardProps) {
    return (
        <div className="group relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 border border-black/5">
            {/* Image Container */}
            <div className="relative h-72 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent group-hover:opacity-80 transition-opacity duration-500 z-10" />
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-5 left-5 z-20">
                    <CategoryBadge category={category} className="shadow-md backdrop-blur-md bg-white/90" />
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-8">
                <h3 className="font-outfit text-2xl font-bold text-gray-900 mb-3 group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>
                <p className="font-sans text-gray-600 mb-8 flex-grow line-clamp-3 leading-relaxed">
                    {description}
                </p>

                <div className="pt-6 border-t border-gray-100 mt-auto">
                    <Button variant="secondary" className="w-full">
                        Explorar Experiencia
                    </Button>
                </div>
            </div>
        </div>
    );
}
