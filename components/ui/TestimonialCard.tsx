import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
    name: string;
    city: string;
    quote: string;
    avatarSrc?: string;
}

export function TestimonialCard({ name, city, quote, avatarSrc }: TestimonialCardProps) {
    return (
        <div className="flex flex-col bg-white dark:bg-zinc-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-zinc-800 min-w-[300px] md:min-w-[400px]">
            <div className="flex text-primary mb-6">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                ))}
            </div>

            <p className="font-sans text-lg text-gray-700 dark:text-gray-300 italic mb-8 flex-grow">
                "{quote}"
            </p>

            <div className="flex items-center gap-4">
                {avatarSrc ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                        <Image src={avatarSrc} alt={name} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-xl">
                        {name.charAt(0)}
                    </div>
                )}

                <div>
                    <h4 className="font-bold font-outfit text-foreground">{name}</h4>
                    <p className="text-sm text-gray-500 font-sans">{city}</p>
                </div>
            </div>
        </div>
    );
}
