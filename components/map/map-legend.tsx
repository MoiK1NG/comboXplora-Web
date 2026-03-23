import { Map, Headphones } from "lucide-react";

export function MapLegend() {
    return (
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-[1.5rem] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100 mt-4 flex flex-col gap-5 lg:absolute lg:bottom-8 lg:left-8 z-[400] lg:mt-0 w-full lg:max-w-[240px] animate-in fade-in duration-700">
            <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Simbología</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    Explora el territorio a través de dos tipos de interacciones culturales.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#F4C430] flex-shrink-0 flex items-center justify-center shadow-lg shadow-yellow-500/20 border-2 border-white">
                        <Map className="w-5 h-5 text-yellow-900" />
                    </div>
                    <div>
                        <span className="text-sm font-black text-gray-900 block mb-1">Experiencias</span>
                        <span className="text-[11px] text-gray-500 font-medium leading-tight block">Talleres, recorridos y actividades presenciales guiadas por hacedores.</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#2A9D8F] flex-shrink-0 flex items-center justify-center shadow-lg shadow-teal-500/20 border-2 border-white">
                        <Headphones className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <span className="text-sm font-black text-gray-900 block mb-1">Historias</span>
                        <span className="text-[11px] text-gray-500 font-medium leading-tight block">Memorias sonoras y guías narradas para escuchar en el territorio.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
