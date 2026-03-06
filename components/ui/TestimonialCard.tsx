import React from 'react';
import Image from 'next/image';
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
    name: string;
    city: string;
    quote: string;
    avatarSrc?: string;
}

export function TestimonialCard({ name, city, quote, avatarSrc }: TestimonialCardProps) {
    return (
        <div className="relative flex flex-col bg-white rounded-3xl p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 border border-black/5 min-w-[320px] md:min-w-[420px] group">

            {/* Decorative Quote Icon */}
            <div className="absolute top-8 right-8 text-primary/20 group-hover:text-primary/40 transition-colors duration-300">
                <Quote size={48} />
            </div>

            <div className="flex text-primary mb-6 relative z-10">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" strokeWidth={0} />
                ))}
            </div>

            <p className="font-sans text-lg text-gray-700 italic mb-10 flex-grow relative z-10 leading-relaxed">
                "{quote}"
            </p>

            <div className="flex items-center gap-5 mt-auto relative z-10 pt-6 border-t border-gray-50">
                {avatarSrc ? (
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md border-2 border-white">
                        <Image src={avatarSrc} alt={name} fill className="object-cover" />
                    </div>
                ) : (
                    <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-xl shadow-inner">
                        {name.charAt(0)}
                    </div>
                )}

                <div>
                    <h4 className="font-bold font-outfit text-gray-900 text-lg">{name}</h4>
                    <p className="text-sm text-gray-500 font-sans tracking-wide">{city}</p>
                </div>
            </div>
        </div>
    );
}
