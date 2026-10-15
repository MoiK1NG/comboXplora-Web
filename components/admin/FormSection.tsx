// Separador con título para agrupar campos dentro de una ficha del admin.
export function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4 pt-1">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{title}</span>
                <div className="h-px flex-1 bg-gray-100" />
            </div>
            {children}
        </div>
    );
}
