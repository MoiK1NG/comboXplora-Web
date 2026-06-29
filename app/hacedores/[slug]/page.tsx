export const dynamic = "force-dynamic";

import { Navbar } from "../../../components/layouts/Navbar";
import { Footer } from "../../../components/layouts/Footer";
import { fetchHacedorBySlug, fetchExperiences } from "../../../lib/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    MapPin, Instagram, Phone, Award, BookOpen,
    Sparkles, ArrowLeft, User,
} from "lucide-react";
import { ExperienceCard } from "../../../components/experiences/experience-card";
import { GalleryLightbox } from "../../../components/admin/GalleryLightbox";
import { getServerLang } from "../../../lib/server-lang";

export default async function HacedorPerfilPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const resolvedParams = await params;
    const [host, lang] = await Promise.all([
        fetchHacedorBySlug(resolvedParams.slug),
        getServerLang(),
    ]);

    if (!host) notFound();

    const allExperiences = await fetchExperiences();
    const hostedExperiences = allExperiences.filter(exp =>
        host.experiences.includes(exp.id)
    );

    const waText = encodeURIComponent(
        lang === "en"
            ? `Hello, I'd like to learn more about ${host.name}'s experience at ComboXplora.`
            : `Hola, quiero conocer más sobre la experiencia de ${host.name} en ComboXplora.`
    );
    const waUrl = `https://wa.me/${host.whatsapp}?text=${waText}`;

    return (
        <div className="min-h-screen flex flex-col bg-[#FCFCFC] font-sans">
            <Navbar />

            <main className="flex-grow pt-20 pb-24">

                {/* ── Hero Banner ─────────────────────────────────── */}
                <div className="relative w-full h-[26rem] sm:h-[34rem] overflow-hidden bg-gray-900">
                    {/* Cover photo */}
                    {host.coverImage ? (
                        <Image
                            src={host.coverImage}
                            alt={host.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-950" />
                    )}

                    {/* Gradient overlay — very strong at the bottom for legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/10" />

                    {/* Back button */}
                    <div className="absolute top-6 left-6 z-20">
                        <Link
                            href="/hacedores"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all text-xs font-black uppercase tracking-widest border border-white/10"
                        >
                            <ArrowLeft size={13} />
                            {lang === "en" ? "Back" : "Volver"}
                        </Link>
                    </div>

                    {/* Identity block — anchored to bottom of hero */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 px-6 sm:px-10 pb-8 pt-24">
                        <div className="max-w-6xl mx-auto flex items-end gap-5 sm:gap-7">
                            {/* Profile photo */}
                            <div className="relative w-24 h-24 sm:w-36 sm:h-36 flex-shrink-0 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-gray-800">
                                {host.profileImage ? (
                                    <Image
                                        src={host.profileImage}
                                        alt={host.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <User size={40} />
                                    </div>
                                )}
                            </div>

                            {/* Name + meta */}
                            <div className="pb-1">
                                {/* Category badge */}
                                <span className="inline-block px-3 py-1 rounded-full bg-[#F4C430] text-gray-900 text-[10px] font-black uppercase tracking-widest mb-3">
                                    {host.category}
                                </span>

                                {/* Name */}
                                <h1 className="font-outfit text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white mb-3"
                                    style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
                                    {host.name}
                                </h1>

                                {/* Neighborhood */}
                                <div className="flex items-center gap-2 text-sm text-white/80 font-semibold">
                                    <MapPin size={15} className="text-[#F4C430] flex-shrink-0" />
                                    <span>{host.neighborhood}, Barranquilla</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Description below hero ─────────────────────── */}
                {host.shortDescription && (
                    <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-8">
                        <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-3xl">
                            {host.shortDescription}
                        </p>
                    </div>
                )}

                {/* ── Main content grid ───────────────────────────── */}
                <div className="max-w-6xl mx-auto px-6 sm:px-10 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Specialties */}
                        {host.specialties.length > 0 && (
                            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-5">
                                <h3 className="font-outfit text-lg font-black text-gray-900 flex items-center gap-2">
                                    <Award className="text-[#F4C430] w-5 h-5" />
                                    {lang === "en" ? "Specialties" : "Especialidades"}
                                </h3>
                                <div className="flex flex-col gap-2.5">
                                    {host.specialties.map((spec, i) => (
                                        <div key={i} className="flex gap-3 items-start bg-gray-50 p-3.5 rounded-xl border border-gray-50">
                                            <span className="w-2 h-2 rounded-full bg-[#F4C430] mt-1.5 flex-shrink-0" />
                                            <p className="text-sm font-semibold text-gray-700 leading-snug">{spec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Contact */}
                        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm space-y-5">
                            <h3 className="font-outfit text-lg font-black text-gray-900 flex items-center gap-2">
                                <Phone className="text-[#F4C430] w-5 h-5" />
                                {lang === "en" ? "Connect" : "Conectar"}
                            </h3>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider leading-relaxed">
                                {lang === "en" ? "Inquiries and bookings directly with the maker." : "Consultas y reservas directamente con el hacedor."}
                            </p>
                            <div className="flex flex-col gap-3">
                                {host.whatsapp && (
                                    <a
                                        href={waUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
                                    >
                                        <Phone size={15} />
                                        WhatsApp
                                    </a>
                                )}
                                {host.instagram && (
                                    <a
                                        href={host.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-3 w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-sm active:scale-95"
                                    >
                                        <Instagram size={15} />
                                        Instagram
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main column */}
                    <div className="lg:col-span-2 space-y-14">
                        {/* Biography */}
                        {host.fullStory && (
                            <div className="space-y-4">
                                <h2 className="font-outfit text-2xl sm:text-3xl font-black text-gray-900 flex items-center gap-3">
                                    <BookOpen className="text-[#F4C430] w-6 h-6 flex-shrink-0" />
                                    {lang === "en" ? "Biography & Knowledge" : "Biografía y Saberes"}
                                </h2>
                                <p className="text-gray-600 leading-relaxed text-base sm:text-lg font-medium whitespace-pre-line">
                                    {host.fullStory}
                                </p>
                            </div>
                        )}

                        {/* Gallery */}
                        {host.gallery && host.gallery.length > 0 && (
                            <GalleryLightbox
                                images={host.gallery}
                                altPrefix={`${host.name} — galería`}
                            />
                        )}

                        {/* Hosted experiences */}
                        {hostedExperiences.length > 0 && (
                            <div className="space-y-6">
                                <h3 className="font-outfit text-xl font-black text-gray-900 flex items-center gap-2">
                                    <Sparkles className="text-[#F4C430] w-5 h-5" />
                                    {lang === "en" ? "Hosted experiences" : "Experiencias que hospeda"}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {hostedExperiences.map(exp => (
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
