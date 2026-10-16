"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { LAYERS, type LayerKey } from "./map-config";

const DESCRIPTIONS: Record<LayerKey, string> = {
  experience: "Talleres y recorridos con hacedores, curados por ComboXplora.",
  evento: "Eventos culturales que la comunidad registró y aprobamos.",
};

function LegendBody() {
  return (
    <ul className="flex flex-col gap-3">
      {(Object.keys(LAYERS) as LayerKey[]).map(k => (
        <li key={k} className="flex items-start gap-3">
          <span
            className="mt-0.5 w-4 h-4 rounded-full border-2 border-white shadow flex-shrink-0"
            style={{ background: LAYERS[k].color }}
            aria-hidden="true"
          />
          <div>
            <p className="text-xs font-black text-gray-900">{LAYERS[k].label}</p>
            <p className="text-[11px] text-gray-500 leading-snug">{DESCRIPTIONS[k]}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Escritorio: fija abajo a la izquierda. Celular: botón que la despliega. */
export function MapLegend() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="hidden lg:block absolute bottom-5 left-5 z-[400] w-[250px] bg-white/95 backdrop-blur rounded-2xl border border-gray-100 shadow-lg p-4">
        <LegendBody />
      </div>

      <div className="lg:hidden absolute top-3 left-3 z-[400]">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-label={open ? "Ocultar simbología" : "Ver simbología"}
          className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-800"
        >
          {open ? <X size={18} /> : <Info size={18} />}
        </button>
        {open && (
          <div className="mt-2 w-[240px] bg-white rounded-2xl border border-gray-100 shadow-xl p-4">
            <LegendBody />
          </div>
        )}
      </div>
    </>
  );
}
