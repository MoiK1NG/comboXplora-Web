"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  open,
  title = "¿Estás seguro?",
  message,
  confirmLabel = "Confirmar",
  onConfirm,
  onCancel,
  isLoading = false,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-gray-100">
        <div className="flex gap-4 items-start mb-4">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
              variant === "danger"
                ? "bg-red-100 text-red-600"
                : "bg-amber-100 text-amber-600"
            }`}
          >
            <AlertTriangle size={18} />
          </div>
          <div>
            <h3 className="font-outfit font-black text-gray-900 text-base leading-tight">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all disabled:opacity-60 ${
              variant === "danger"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {isLoading ? "Procesando..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
