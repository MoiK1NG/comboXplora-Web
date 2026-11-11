import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Headphones, Video, MapPin, ChevronRight } from "lucide-react";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { fetchRelatos } from "../../lib/db";
import type { Relato } from "../../lib/types";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "../../lib/site";

// Se regenera cada 10 minutos; al publicar desde el admin se refresca al momento.
export const revalidate = 600;

export const metadata: Metadata = {
  title: `Relatos de Barranquilla | ${SITE_NAME}`,
  description: "Historias, memorias y voces de los barrios de Barranquilla, contadas por su gente.",
  alternates: { canonical: `${SITE_URL}/relatos` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/relatos`,
    siteName: SITE_NAME,
    title: "Relatos de Barranquilla",
    description: "Historias, memorias y voces de los barrios de Barranquilla.",
    images: [{ url: DEFAULT_OG_IMAGE }],
    locale: "es_CO",
  },
};

const TYPE_META = {
  escrito: { label: "Para leer", icon: BookOpen },
  audio: { label: "Para escuchar", icon: Headphones },
  video: { label: "Para ver", icon: Video },
} as const;

function RelatoCard({ relato, featured }: { relato: Relato; featured: boolean }) {
  const meta = TYPE_META[relato.type] ?? TYPE_META.escrito;
  return (
    <Link
      href={`/relatos/${relato.slug}`}
      className={`group flex flex-col bg-white rounded-[2rem] border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-900 ${
        featured ? "md:col-span-2 md:flex-row" : ""
      }`}
    >
      <div className={`relative bg-[#EAF5F3] overflow-hidden ${featured ? "md:w-1/2 aspect-[4/3] md:aspect-auto md:min-h-[320px]" : "aspect-[4/3]"}`}>
        {relato.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={relato.coverImage} alt="" loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#2A9D8F]"><meta.icon size={48} aria-hidden="true" /></div>
        )}
        <span className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2A9D8F] text-white text-[10px] font-black uppercase tracking-[0.12em] shadow">
          <meta.icon size={12} aria-hidden="true" /> {meta.label}
        </span>
      </div>
      <div className={`flex flex-col p-7 ${featured ? "md:w-1/2 md:p-10 md:justify-center" : ""}`}>
        {relato.categories.length > 0 && (
          <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#218276] mb-2">{relato.categories.join(" · ")}</p>
        )}
        <h2 className={`font-outfit font-black text-gray-900 leading-tight text-balance ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>{relato.title}</h2>
        {relato.excerpt && <p className="mt-3 text-gray-500 leading-relaxed text-sm sm:text-base line-clamp-3">{relato.excerpt}</p>}
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400 font-medium">
          {relato.author && <span>Por {relato.author}</span>}
          {relato.neighborhood && <span className="inline-flex items-center gap-1"><MapPin size={12} aria-hidden="true" />{relato.neighborhood}</span>}
        </div>
        <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-gray-900">
          Leer relato <ChevronRight size={14} className="text-[#2A9D8F] group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export default async function RelatosPage() {
  const relatos = await fetchRelatos();

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC]">
      <Navbar />

      <main className="flex-grow pt-24 lg:pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <header className="mb-10 max-w-2xl">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#218276] mb-3">Barranquilla · Relatos</p>
            <h1 className="font-outfit text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[0.95] text-balance">
              La ciudad contada <span className="text-primary">por su gente</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
              Historias, memorias y voces de los barrios. Para leer con calma antes de salir a conocerlos.
            </p>
          </header>

          {relatos.length === 0 ? (
            <div className="rounded-[2rem] border-2 border-dashed border-gray-200 bg-white/60 px-6 py-16 text-center">
              <BookOpen size={36} className="mx-auto text-gray-300 mb-4" aria-hidden="true" />
              <h2 className="font-outfit text-xl font-black text-gray-900">Estamos escribiendo los primeros relatos</h2>
              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto leading-relaxed">
                Mientras tanto, conoce a los hacedores que guardan estas historias.
              </p>
              <Link href="/hacedores" className="inline-flex items-center gap-2 mt-6 px-5 py-3 rounded-xl bg-primary text-gray-900 font-black text-sm hover:bg-[#E3B520]">
                Ver hacedores <ChevronRight size={16} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatos.map((r, i) => <RelatoCard key={r.id} relato={r} featured={i === 0 && relatos.length !== 2} />)}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
