import React from 'react';

type CategoryType = 'Cultura' | 'Gastronomía' | 'Música' | 'Historia' | 'Comunidad';

interface CategoryBadgeProps {
    category: CategoryType;
    className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
    const colors: Record<CategoryType, string> = {
        Cultura: "bg-purple-50 text-purple-700 border-purple-200",
        Gastronomía: "bg-orange-50 text-orange-700 border-orange-200",
        Música: "bg-blue-50 text-blue-700 border-blue-200",
        Historia: "bg-amber-50 text-amber-800 border-amber-200",
        Comunidad: "bg-green-50 text-green-700 border-green-200"
    };

    return (
        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm ${colors[category]} ${className}`}>
            {category}
        </span>
    );
}
