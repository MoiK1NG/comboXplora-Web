import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
    return (
        <div className={`mb-12 ${centered ? 'text-center' : 'text-left'}`}>
            <h2 className="font-outfit text-3xl md:text-5xl font-bold text-foreground mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="font-sans text-gray-600 dark:text-gray-400 max-w-2xl text-lg md:text-xl leading-relaxed mx-auto">
                    {subtitle}
                </p>
            )}
            <div className={`h-1.5 w-20 bg-accent rounded-full mt-6 ${centered ? 'mx-auto' : ''}`} />
        </div>
    );
}
