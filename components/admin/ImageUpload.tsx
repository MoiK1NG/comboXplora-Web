"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  folder = "general",
  label = "Imagen",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Error al subir la imagen.");
      }

      onChange(data.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest">
        {label}
      </label>

      {/* Preview si hay imagen */}
      {value && (
        <div className="relative w-full h-40 rounded-xl overflow-hidden bg-gray-100 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <X size={13} />
          </button>
        </div>
      )}

      {/* URL manual */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://... o sube un archivo"
        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] transition-all"
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${uploading
            ? "border-[#F4C430] bg-amber-50 cursor-not-allowed"
            : "border-gray-200 hover:border-[#F4C430] hover:bg-amber-50/40"
          }`}
      >
        {uploading ? (
          <>
            <Loader2 size={20} className="animate-spin text-[#F4C430]" />
            <span className="text-xs font-semibold text-gray-500">Subiendo...</span>
          </>
        ) : (
          <>
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center">
              <Upload size={16} className="text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-gray-600">
                Arrastra o <span className="text-[#F4C430]">selecciona</span>
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP · Máx 10MB</p>
            </div>
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && (
        <p className="text-xs text-red-600 font-medium flex items-center gap-1">
          <ImageIcon size={12} /> {error}
        </p>
      )}
    </div>
  );
}
