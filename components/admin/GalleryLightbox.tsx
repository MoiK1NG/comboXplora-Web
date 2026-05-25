"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { Star } from "lucide-react";

interface GalleryLightboxProps {
  images: string[];
  altPrefix?: string;
}

export function GalleryLightbox({ images, altPrefix = "Imagen" }: GalleryLightboxProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const open = (i: number) => setSelectedIndex(i);
  const close = () => setSelectedIndex(null);

  const prev = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + images.length) % images.length);
  }, [selectedIndex, images.length]);

  const next = useCallback(() => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % images.length);
  }, [selectedIndex, images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedIndex, prev, next]);

  // Prevent body scroll when open
  useEffect(() => {
    if (selectedIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [selectedIndex]);

  return (
    <>
      {/* Gallery Grid */}
      <div className="space-y-4">
        <h3 className="font-outfit text-xl font-black text-gray-900 flex items-center gap-2">
          <Star className="text-[#F4C430] w-5 h-5" />
          Galería de Momentos
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {images.map((imgUrl, i) => (
            <button
              key={i}
              onClick={() => open(i)}
              className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gray-100 group border border-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#F4C430] focus:ring-offset-2 transition-all"
              aria-label={`Ver ${altPrefix} ${i + 1} en pantalla completa`}
            >
              <Image
                src={imgUrl}
                alt={`${altPrefix} ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                <ZoomIn
                  size={28}
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={close}
        >
          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur rounded-full text-white text-xs font-bold tracking-widest z-10">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Close */}
          <button
            onClick={close}
            className="absolute top-5 right-5 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>

          {/* Prev */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Image */}
          <div
            className="relative w-full max-w-4xl max-h-[85vh] mx-16 rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full" style={{ paddingBottom: "66.67%" }}>
              <Image
                src={images[selectedIndex]}
                alt={`${altPrefix} ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                priority
              />
            </div>
          </div>

          {/* Next */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-all hover:scale-110"
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={24} />
            </button>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                  className={`relative w-12 h-9 rounded-lg overflow-hidden border-2 transition-all ${
                    i === selectedIndex
                      ? "border-[#F4C430] scale-110 shadow-lg"
                      : "border-white/30 opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
