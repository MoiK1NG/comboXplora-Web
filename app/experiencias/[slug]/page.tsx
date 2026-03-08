import { Navbar } from "../../../components/layouts/Navbar";
import { Footer } from "../../../components/layouts/Footer";
import { ExperienceHero } from "../../../components/experiences/experience-hero";
import { ExperienceDetails } from "../../../components/experiences/experience-details";
import { experiences } from "../../../lib/map-data";
import { notFound } from "next/navigation";

export default async function ExperienciaDetalle({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const exp = experiences.find((e) => e.slug === resolvedParams.slug);

    if (!exp) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow pt-20">
                <ExperienceHero experience={exp} />
                <ExperienceDetails experience={exp} />
            </main>

            <Footer />
        </div>
    );
}
