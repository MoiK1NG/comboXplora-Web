import React from 'react';

type CategoryType = 'Cultura' | 'Gastronomía' | 'Música' | 'Historia' | 'Comunidad';

interface CategoryBadgeProps {
    category: CategoryType;
    className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
    const colors: Record<CategoryType, string> = {
        Cultura: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800",
        Gastronomía: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800",
        Música: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800",
        Historia: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
        Comunidad: "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800"
    };

    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${colors[category]} ${className}`}>
            {category}
        </span>
    );
}
