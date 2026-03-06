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
        <div className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-zinc-800">
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-in-out"
                />
                <div className="absolute top-4 left-4 z-20">
                    <CategoryBadge category={category} className="shadow-md backdrop-blur-md bg-white/90" />
                </div>
            </div>

            {/* Content Container */}
            <div className="flex flex-col flex-grow p-6 md:p-8">
                <h3 className="font-outfit text-2xl font-bold text-foreground mb-3 group-hover:text-accent transition-colors duration-300">
                    {title}
                </h3>
                <p className="font-sans text-gray-600 dark:text-gray-400 mb-8 flex-grow line-clamp-3">
                    {description}
                </p>

                <Button variant="secondary" className="w-full">
                    Explorar Experiencia
                </Button>
            </div>
        </div>
    );
}
