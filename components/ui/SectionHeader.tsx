import React from 'react';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    centered?: boolean;
}

export function SectionHeader({ title, subtitle, centered = true }: SectionHeaderProps) {
    return (
        <div className={`mb-20 ${centered ? 'text-center flex flex-col items-center' : 'text-left'}`}>
            <h2 className="font-outfit text-4xl md:text-5xl lg:text-[3.5rem] font-black text-gray-900 mb-6 tracking-tight leading-[1.1] text-balance">
                {title}
            </h2>
            {subtitle && (
                <p className="font-sans text-gray-500 max-w-2xl text-[1.15rem] leading-[1.7] mt-2">
                    {subtitle}
                </p>
            )}
        </div>
    );
}
