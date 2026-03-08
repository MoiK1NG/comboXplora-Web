import { Map, Headphones } from "lucide-react";

export function MapLegend() {
    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-4 flex flex-col gap-3 lg:absolute lg:bottom-4 lg:left-4 z-[400] lg:mt-0 lg:max-w-[200px]">
            <h3 className="text-sm font-semibold text-gray-800">Leyenda</h3>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#F4C430] flex-shrink-0 flex items-center justify-center">
                        <Map className="w-2.5 h-2.5 text-yellow-900" />
                    </div>
                    <span className="text-xs text-gray-600">Experiencias Culturales</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-[#2A9D8F] flex-shrink-0 flex items-center justify-center">
                        <Headphones className="w-2.5 h-2.5 text-white" />
                    </div>
                    <span className="text-xs text-gray-600">Historias Sonoras</span>
                </div>
            </div>
        </div>
    );
}
