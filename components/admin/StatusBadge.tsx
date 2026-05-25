type Status = string;

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  // Contacto / Empresas
  nuevo: { label: "Nuevo", className: "bg-blue-50 text-blue-700 border-blue-100" },
  revisado: { label: "Revisado", className: "bg-amber-50 text-amber-700 border-amber-100" },
  contactado: { label: "Contactado", className: "bg-purple-50 text-purple-700 border-purple-100" },
  cerrado: { label: "Cerrado", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  descartado: { label: "Descartado", className: "bg-gray-50 text-gray-500 border-gray-200" },
  leido: { label: "Leído", className: "bg-indigo-50 text-indigo-700 border-indigo-100" },
  respondido: { label: "Respondido", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  // Postulaciones
  nueva: { label: "Nueva", className: "bg-blue-50 text-blue-700 border-blue-100" },
  revisada: { label: "Revisada", className: "bg-amber-50 text-amber-700 border-amber-100" },
  aprobada: { label: "Aprobada", className: "bg-emerald-50 text-emerald-700 border-emerald-100" },
  rechazada: { label: "Rechazada", className: "bg-red-50 text-red-700 border-red-100" },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = STATUS_MAP[status] ?? {
    label: status,
    className: "bg-gray-50 text-gray-600 border-gray-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider ${config.className} ${className}`}
    >
      {config.label}
    </span>
  );
}
