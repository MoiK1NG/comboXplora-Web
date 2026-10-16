"use client";

import { useRef, useState } from "react";
import { ChevronUp } from "lucide-react";

export type SheetSnap = "peek" | "open" | "tall";

interface BottomSheetProps {
  snap: SheetSnap;
  onSnapChange: (snap: SheetSnap) => void;
  title: React.ReactNode;
  children: React.ReactNode;
}

const HEIGHTS: Record<SheetSnap, string> = {
  peek: "76px",
  open: "55%",
  tall: "82%",
};

/**
 * Ficha deslizable desde abajo, para celular. Vive dentro del contenedor del mapa.
 * Se arrastra desde la manija o se toca para abrir y cerrar.
 */
export function BottomSheet({ snap, onSnapChange, title, children }: BottomSheetProps) {
  const startY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  function onPointerDown(e: React.PointerEvent) {
    startY.current = e.clientY;
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // Sin captura igual funciona: solo se pierde el arrastre fuera de la manija
    }
  }
  function onPointerMove(e: React.PointerEvent) {
    if (startY.current === null) return;
    setDragOffset(e.clientY - startY.current);
  }
  function onPointerUp() {
    if (startY.current === null) return;
    const dy = dragOffset;
    startY.current = null;
    setDragOffset(0);
    if (Math.abs(dy) < 8) {
      onSnapChange(snap === "peek" ? "open" : "peek");
    } else if (dy < -40) {
      onSnapChange(snap === "peek" ? "open" : "tall");
    } else if (dy > 40) {
      onSnapChange(snap === "tall" ? "open" : "peek");
    }
  }

  return (
    <section
      aria-label="Lugares del mapa"
      className="absolute inset-x-0 bottom-0 z-[450] flex flex-col bg-white rounded-t-[1.75rem] shadow-[0_-12px_40px_-12px_rgba(17,24,39,0.35)] motion-safe:transition-[height] motion-safe:duration-300 ease-out"
      style={{
        height: `calc(${HEIGHTS[snap]} - ${dragOffset}px)`,
        transitionProperty: dragOffset ? "none" : undefined,
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-expanded={snap !== "peek"}
        aria-label={snap === "peek" ? "Abrir lista de lugares" : "Bajar la lista"}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={e => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onSnapChange(snap === "peek" ? "open" : "peek");
          }
        }}
        className="flex-shrink-0 touch-none select-none cursor-grab active:cursor-grabbing px-5 pt-2.5 pb-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 rounded-t-[1.75rem]"
      >
        <div className="mx-auto w-10 h-1.5 rounded-full bg-gray-200 mb-3" aria-hidden="true" />
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">{title}</div>
          <ChevronUp
            size={18}
            className={`text-gray-400 flex-shrink-0 transition-transform ${snap === "peek" ? "" : "rotate-180"}`}
            aria-hidden="true"
          />
        </div>
      </div>
      <div
        className={`flex-1 min-h-0 overflow-y-auto overscroll-contain ${snap === "peek" && !dragOffset ? "invisible" : ""}`}
        aria-hidden={snap === "peek"}
      >
        {children}
      </div>
    </section>
  );
}
