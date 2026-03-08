import { Dispatch, SetStateAction } from "react";

type FilterType = "all" | "experience" | "audio";

interface MapFiltersProps {
    currentFilter: FilterType;
    setFilter: Dispatch<SetStateAction<FilterType>>;
}

export function MapFilters({ currentFilter, setFilter }: MapFiltersProps) {
    return (
        <div className="flex flex-wrap gap-2 mb-4">
            <button
                onClick={() => setFilter("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentFilter === "all"
                        ? "bg-gray-800 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
            >
                Todos
            </button>
            <button
                onClick={() => setFilter("experience")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentFilter === "experience"
                        ? "bg-[#F4C430] text-gray-900"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
            >
                Experiencias
            </button>
            <button
                onClick={() => setFilter("audio")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentFilter === "audio"
                        ? "bg-[#2A9D8F] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
            >
                Puntos Sonoros
            </button>
        </div>
    );
}
