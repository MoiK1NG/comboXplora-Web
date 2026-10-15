"use client";

// ─────────────────────────────────────────────
// Category chip picker (multi-select)
// ─────────────────────────────────────────────
export function CategoryPicker({
    value, onChange, options,
}: { value: string; onChange: (v: string) => void; options: readonly string[] }) {
    const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];
    function toggle(cat: string) {
        const next = selected.includes(cat) ? selected.filter(c => c !== cat) : [...selected, cat];
        onChange(next.join(", "));
    }
    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map(cat => (
                <button key={cat} type="button" onClick={() => toggle(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        selected.includes(cat)
                            ? "bg-[#F4C430] text-gray-900 shadow-sm"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                >{cat}</button>
            ))}
        </div>
    );
}
