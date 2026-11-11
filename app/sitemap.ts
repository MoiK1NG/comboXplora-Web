import type { MetadataRoute } from "next";
import { fetchExperiences, fetchHacedores, fetchApprovedEvents, fetchRelatos } from "../lib/db";
import { SITE_URL } from "../lib/site";

// El mapa del sitio para buscadores. Se regenera cada hora con lo que esté activo.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/experiencias`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/eventos`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/mapa-cultural`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/hacedores`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/relatos`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/empresas`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/hacedores/unete`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/postula-tu-experiencia`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contacto`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const [experiences, hacedores, events, relatos] = await Promise.all([
    fetchExperiences(),
    fetchHacedores(),
    fetchApprovedEvents(),
    fetchRelatos(),
  ]);

  return [
    ...fixed,
    ...experiences.map(e => ({ url: `${SITE_URL}/experiencias/${e.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...hacedores.map(h => ({ url: `${SITE_URL}/hacedores/${h.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...events.filter(e => e.eventSlug).map(e => ({ url: `${SITE_URL}/eventos/${e.eventSlug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...relatos.map(r => ({ url: `${SITE_URL}/relatos/${r.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
