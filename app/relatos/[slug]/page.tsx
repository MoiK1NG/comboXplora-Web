import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Headphones, Video, User } from "lucide-react";
import { Navbar } from "../../../components/layouts/Navbar";
import { Footer } from "../../../components/layouts/Footer";
import { ShareButtons } from "../../../components/eventos/share-buttons";
import { fetchRelatoBySlug } from "../../../lib/db";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "../../../lib/site";

export const revalidate = 600;

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const relato = await fetchRelatoBySlug(slug);
  if (!relato) return { title: `Relato no encontrado | ${SITE_NAME}` };
  const url = `${SITE_URL}/relatos/${slug}`;
  const description = (relato.excerpt || relato.content || "").slice(0, 200);
  return {
    title: `${relato.title} | Relatos de Barranquilla`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      siteName: SITE_NAME,
      title: relato.title,
      description,
      images: [{ url: relato.coverImage || DEFAULT_OG_IMAGE }],
      locale: "es_CO",
    },
    twitter: { card: "summary_large_image", title: relato.title, description, images: [relato.coverImage || DEFAULT_OG_IMAGE] },
  };
}

export default async function RelatoPage({ params }: Params) {
  const { slug } = await params;
  const relato = await fetchRelatoBySlug(slug);
  if (!relato) notFound();

  const paragraphs = (relato.content || "").split(/\n{2,}|\r\n{2,}/).map(p => p.trim()).filter(Boolean);
  const url = `${SITE_URL}/relatos/${slug}`;
  const gallery = (relato.gallery || []).filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC]">
      <Navbar />

      <main className="flex-grow pt-24 lg:pt-28 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link href="/relatos" className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] text-gray-400 hover:text-gray-900 mb-5">
            <ArrowLeft size={14} /> Relatos
          </Link>

          {relato.categories.length > 0 && (
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#218276] mb-3">{relato.categories.join(" · ")}</p>
          )}
          <h1 className="font-outfit text-3xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[1] text-balance">{relato.title}</h1>
          {relato.excerpt && <p className="mt-5 text-lg sm:text-xl text-gray-500 leading-relaxed">{relato.excerpt}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
            {relato.author && <span className="inline-flex items-center gap-1.5"><User size={14} aria-hidden="true" />Por <strong className="text-gray-900 font-bold">{relato.author}</strong></span>}
            {relato.narrator && <span className="inline-flex items-center gap-1.5"><Headphones size={14} aria-hidden="true" />Narra {relato.narrator}</span>}
            {relato.neighborhood && <span className="inline-flex items-center gap-1.5"><MapPin size={14} aria-hidden="true" />{relato.neighborhood}</span>}
          </div>

          {relato.coverImage && (
            <div className="mt-8 rounded-[2rem] overflow-hidden border border-gray-100 aspect-[16/10] bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={relato.coverImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          {relato.audioUrl && (
            <div className="mt-8 rounded-2xl bg-[#EAF5F3] border border-[#CFE8E3] p-5">
              <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.15em] text-[#218276] mb-3"><Headphones size={14} aria-hidden="true" /> Escucha el relato</p>
              <audio controls preload="none" src={relato.audioUrl} className="w-full" />
            </div>
          )}

          {relato.videoUrl && (
            <a
              href={relato.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white font-bold text-sm hover:bg-gray-800 transition-colors"
            >
              <Video size={16} /> Ver el video
            </a>
          )}

          {paragraphs.length > 0 && (
            <div className="mt-10 space-y-6 text-gray-700 text-lg leading-[1.8] max-w-[65ch]">
              {paragraphs.map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
            </div>
          )}

          {gallery.length > 0 && (
            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {gallery.map((src, i) => (
                <div key={i} className="rounded-2xl overflow-hidden aspect-square bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100">
            <h2 className="text-[11px] font-black uppercase tracking-[0.18em] text-gray-400 mb-3">Compartir</h2>
            <ShareButtons url={url} title={relato.title} text={relato.title} />
          </div>

          <div className="mt-10 bg-gray-900 rounded-[2rem] px-6 py-8 sm:px-10 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h2 className="font-outfit text-2xl font-black mb-1">Vívelo en persona</h2>
              <p className="text-gray-400 text-sm leading-relaxed">Experiencias con los hacedores que guardan estas historias.</p>
            </div>
            <Link href="/experiencias" className="inline-flex items-center justify-center px-6 py-4 bg-primary text-gray-900 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-white transition-colors whitespace-nowrap">
              Ver experiencias
            </Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
