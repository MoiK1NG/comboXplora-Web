"use client";

import { Search, X } from "lucide-react";
import { LAYERS, type LayerKey } from "./map-config";
import type { DateRange } from "../../lib/event-dates";

export type TypeFilter = "todo" | LayerKey;

export interface MapFilterState {
  type: TypeFilter;
  category: string | null;
  dateRange: DateRange;
  query: string;
}

export const INITIAL_FILTERS: MapFilterState = {
  type: "todo",
  category: null,
  dateRange: "proximos",
  query: "",
};

interface MapFiltersProps {
  value: MapFilterState;
  onChange: (next: MapFilterState) => void;
  counts: Record<LayerKey, number>;
  categories: string[];
  showDateFilter: boolean;
}

const DATE_OPTIONS: { key: DateRange; label: string }[] = [
  { key: "proximos", label: "Próximos" },
  { key: "semana", label: "Esta semana" },
  { key: "mes", label: "Este mes" },
];

function Chip({
  active, onClick, children, dot,
}: { active: boolean; onClick: () => void; children: React.ReactNode; dot?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900 ${
        active
          ? "bg-gray-900 border-gray-900 text-white"
          : "bg-white border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900"
      }`}
    >
      {dot && <span className="w-2.5 h-2.5 rounded-full ring-2 ring-white/70" style={{ background: dot }} aria-hidden="true" />}
      {children}
    </button>
  );
}

export function MapFilters({ value, onChange, counts, categories, showDateFilter }: MapFiltersProps) {
  const set = (patch: Partial<MapFilterState>) => onChange({ ...value, ...patch });
  const total = counts.experience + counts.evento;

  return (
    <div className="flex flex-col gap-3">
      {/* Buscador */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          value={value.query}
          onChange={e => set({ query: e.target.value })}
          placeholder="Busca por nombre, barrio o lugar"
          aria-label="Buscar en el mapa"
          className="w-full pl-11 pr-10 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/50 focus:border-[#F4C430] transition-all"
        />
        {value.query && (
          <button
            type="button"
            onClick={() => set({ query: "" })}
            aria-label="Borrar búsqueda"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Tipo */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
        <Chip active={value.type === "todo"} onClick={() => set({ type: "todo" })}>
          Todo <span className="tabular-nums opacity-60">{total}</span>
        </Chip>
        {(Object.keys(LAYERS) as LayerKey[]).map(k => (
          <Chip key={k} active={value.type === k} onClick={() => set({ type: k })} dot={LAYERS[k].color}>
            {LAYERS[k].label} <span className="tabular-nums opacity-60">{counts[k]}</span>
          </Chip>
        ))}
      </div>

      {/* Categoría y fecha */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap items-center">
        {showDateFilter && (
          <>
            {DATE_OPTIONS.map(o => (
              <button
                key={o.key}
                type="button"
                onClick={() => set({ dateRange: o.key })}
                aria-pressed={value.dateRange === o.key}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
                  value.dateRange === o.key ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
              >
                {o.label}
              </button>
            ))}
            <span className="flex-shrink-0 w-px h-5 bg-gray-200 mx-1" aria-hidden="true" />
          </>
        )}
        <button
          type="button"
          onClick={() => set({ category: null })}
          aria-pressed={value.category === null}
          className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
            value.category === null ? "bg-[#F4C430] text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
          }`}
        >
          Todas las categorías
        </button>
        {categories.map(cat => (
          <button
            key={cat}
            type="button"
            onClick={() => set({ category: value.category === cat ? null : cat })}
            aria-pressed={value.category === cat}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-colors ${
              value.category === cat ? "bg-[#F4C430] text-gray-900" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
