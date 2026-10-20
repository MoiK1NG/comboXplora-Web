"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
  url: string;
  title: string;
  text: string;
}

/** Compartir: WhatsApp, copiar enlace y, si el teléfono lo permite, la hoja nativa de compartir. */
export function ShareButtons({ url, title, text }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copia el enlace:", url);
    }
  }

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url });
    } catch {
      // El usuario cerró la hoja de compartir: no es un error
    }
  }

  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1FB958] text-white text-sm font-bold transition-colors"
      >
        <MessageCircle size={16} /> WhatsApp
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold transition-colors"
      >
        {copied ? <Check size={16} className="text-emerald-600" /> : <Link2 size={16} />}
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </button>
      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 text-sm font-bold transition-colors"
        >
          <Share2 size={16} /> Compartir
        </button>
      )}
    </div>
  );
}
