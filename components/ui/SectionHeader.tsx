import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
    return (
        <div className={`mb-16 ${centered ? 'text-center flex flex-col items-center' : 'text-left'}`}>
            <h2 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                {title}
            </h2>
            {subtitle && (
                <p className="font-sans text-gray-600 max-w-3xl text-lg md:text-xl leading-relaxed">
                    {subtitle}
                </p>
            )}
            <div className={`h-1.5 w-24 bg-accent rounded-full mt-8 ${centered ? '' : ''}`} />
        </div>
    );
}
