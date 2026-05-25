import { Navbar } from "../../../components/layouts/Navbar";
import { Footer } from "../../../components/layouts/Footer";
import { fetchHacedorBySlug, fetchExperiences } from "../../../lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Instagram, Phone, Award, BookOpen, Star, Sparkles, ArrowLeft } from "lucide-react";
import { ExperienceCard } from "../../../components/experiences/experience-card";

export default async function HacedorPerfilPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const host = await fetchHacedorBySlug(resolvedParams.slug);

    if (!host) {
        notFound();
    }

    // Find full experiences hosted by this hacedor
    const allExperiences = await fetchExperiences();
    const hostedExperiences = allExperiences.filter((exp) => 
        host.experiences.includes(exp.id)
    );

    const waText = encodeURIComponent(`Hola, quiero conocer más sobre la experiencia de ${host.name} en ComboXplora.`);
    const waUrl = `https://wa.me/${host.whatsapp}?text=${waText}`;

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] relative font-sans">
            <Navbar />

            <main className="flex-grow pt-20 pb-24">
                {/* Hero Banner Section */}
                <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-gray-900">
                    {host.coverImage && (
                        <Image
                            src={host.coverImage}
                            alt={host.name}
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    
                    {/* Return button */}
                    <div className="absolute top-6 left-6 z-20">
                        <Link
                            href="/hacedores"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 text-xs font-black uppercase tracking-widest"
                        >
                            <ArrowLeft size={14} />
                            Volver al directorio
                        </Link>
                    </div>
                </div>

                {/* Identity header overlay */}
                <div className="max-w-6xl mx-auto px-6 relative z-10 -mt-16 sm:-mt-24 mb-16">
                    <div className="flex flex-col md:flex-row md:items-end gap-6 sm:gap-8">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 sm:w-48 sm:h-48 rounded-full border-4 border-white overflow-hidden shadow-2xl bg-gray-100 flex-shrink-0">
                            {host.profileImage ? (
                                <Image
                                    src={host.profileImage}
                                    alt={host.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                                    <Sparkles size={48} />
                                </div>
                            )}
                        </div>

                        {/* Text info */}
                        <div className="text-left text-white md:pb-4 flex-grow">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-black text-[10px] font-black uppercase tracking-widest mb-3 shadow-md">
                                {host.category}
                            </span>
                            <h1 className="font-outfit text-4xl sm:text-5xl font-black tracking-tight leading-none text-gray-900 md:text-white drop-shadow-sm">
                                {host.name}
                            </h1>
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 md:text-gray-200 font-bold mt-3">
                                <MapPin size={14} className="text-primary" />
                                {host.neighborhood}, Barranquilla
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
                    {/* Left Column: sidebar with specialties & contact */}
                    <div className="space-y-8">
                        {/* specialties Card */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-outfit text-xl font-black text-gray-900 flex items-center gap-2">
                                <Award className="text-primary w-5 h-5" />
                                Especialidades
                            </h3>
                            <div className="flex flex-col gap-3">
                                {host.specialties.map((spec, i) => (
                                    <div key={i} className="flex gap-3 items-start bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                                        <span className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                        <p className="text-sm font-semibold text-gray-700 leading-tight">{spec}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] space-y-6">
                            <h3 className="font-outfit text-xl font-black text-gray-900 flex items-center gap-2">
                                <Phone className="text-primary w-5 h-5" />
                                Conectar
                            </h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                                Comunícate directamente con el hacedor para consultas o reservas grupales.
                            </p>
                            <div className="flex flex-col gap-3">
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md active:scale-95"
                                >
                                    <Phone size={16} />
                                    WhatsApp
                                </a>
                                <a
                                    href={host.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md active:scale-95"
                                >
                                    <Instagram size={16} />
                                    Instagram
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: main biography, gallery & hosted experiences */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Narrative Story */}
                        <div className="space-y-4">
                            <h2 className="font-outfit text-3xl font-black text-gray-900 flex items-center gap-3">
                                <BookOpen className="text-primary w-6 h-6" />
                                Biografía y Saberes
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-medium whitespace-pre-line">
                                {host.fullStory}
                            </p>
                        </div>

                        {/* Gallery Section */}
                        {host.gallery && host.gallery.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="font-outfit text-xl font-black text-gray-900 flex items-center gap-2">
                                    <Star className="text-primary w-5 h-5" />
                                    Galería de Momentos
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    {host.gallery.map((imgUrl, i) => (
                                        <div key={i} className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gray-100 group border border-gray-100 shadow-sm">
                                            <Image
                                                src={imgUrl}
                                                alt={`${host.name} gallery image ${i + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Hosted experiences */}
                        {hostedExperiences.length > 0 && (
                            <div className="space-y-6 pt-4">
                                <h3 className="font-outfit text-xl font-black text-gray-900 flex items-center gap-2">
                                    <Sparkles className="text-primary w-5 h-5" />
                                    Experiencias que hospeda
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {hostedExperiences.map((exp) => (
                                        <ExperienceCard key={exp.id} experience={exp} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
