type FilterType = "Todas" | "Gastronomía" | "Arte" | "Literatura" | "Música" | "Comunidad";

interface MapFiltersProps {
    currentFilter: FilterType;
    setFilter: (filter: FilterType) => void;
}

const CATEGORIES: FilterType[] = ["Todas", "Gastronomía", "Arte", "Literatura", "Música", "Comunidad"];

export function MapFilters({ currentFilter, setFilter }: MapFiltersProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 border ${currentFilter === cat
                        ? "bg-gray-900 border-gray-900 text-white shadow-md -translate-y-0.5"
                        : "bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
