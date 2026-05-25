"use client";

import { useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

type ToastType = "ok" | "err" | "info";

interface ToastProps {
  message: string;
  type: ToastType;
  onDone: () => void;
}

export function Toast({ message, type, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  const styles: Record<ToastType, string> = {
    ok: "bg-emerald-600 text-white",
    err: "bg-red-600 text-white",
    info: "bg-gray-900 text-white",
  };

  const icons: Record<ToastType, React.ReactNode> = {
    ok: <CheckCircle size={16} />,
    err: <XCircle size={16} />,
    info: null,
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold max-w-sm animate-in slide-in-from-bottom-4 ${styles[type]}`}
    >
      {icons[type]}
      <span className="flex-1">{message}</span>
      <button onClick={onDone} className="opacity-70 hover:opacity-100 transition-opacity">
        <X size={14} />
      </button>
    </div>
  );
}
