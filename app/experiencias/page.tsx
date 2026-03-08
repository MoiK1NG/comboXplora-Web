import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { ExperienceCard } from "../../components/experiences/experience-card";
import { experiences } from "../../lib/map-data";

export default function ExperienciasPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow pt-24 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className="mb-12 md:mb-20 text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                            Catálogo de Experiencias <span className="text-primary">Culturales</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                            Descubre Barranquilla a través de los ojos de sus hacedores. Talleres, recorridos y encuentros auténticos que te conectan con nuestra esencia.
                        </p>
                    </div>

                    {/* Grid Layout */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {experiences.map((exp) => (
                            <ExperienceCard key={exp.id} experience={exp} />
                        ))}
                    </div>

                    {/* Empty State / Coming Soon */}
                    <div className="mt-20 p-8 rounded-3xl bg-gray-50 border border-dashed border-gray-200 text-center">
                        <p className="text-gray-500 font-medium italic">
                            Estamos trabajando para traer más experiencias auténticas pronto...
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
