type FilterType = "Todas" | "Gastronomía" | "Arte" | "Literatura" | "Música" | "Comunidad";

interface MapFiltersProps {
    currentFilter: FilterType;
    setFilter: (filter: FilterType) => void;
}

const CATEGORIES: FilterType[] = ["Todas", "Gastronomía", "Arte", "Literatura", "Música", "Comunidad"];

export function MapFilters({ currentFilter, setFilter }: MapFiltersProps) {
    return (
        <div className="flex flex-wrap items-center gap-3 mb-10 pb-4">
            {CATEGORIES.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2.5 rounded-full text-[10px] sm:text-[11px] font-black tracking-[0.15em] uppercase transition-all duration-500 border-2 ${currentFilter === cat
                            ? "bg-gray-900 border-gray-900 text-white shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)] -translate-y-1 scale-105"
                            : "bg-white border-gray-100 text-gray-400 hover:border-primary hover:text-gray-900 hover:shadow-xl hover:-translate-y-0.5"
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}
