// Dirección pública del sitio. En Vercel se puede fijar NEXT_PUBLIC_SITE_URL;
// si no está, se usa la URL del despliegue actual o la de producción.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
  "https://combo-xplora-web.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "ComboXplora";

export const DEFAULT_OG_IMAGE = "/images/hero_barranquilla_1772729237395.png";

export function eventPath(slug: string): string {
  return `/eventos/${slug}`;
}

export function eventUrl(slug: string): string {
  return `${SITE_URL}${eventPath(slug)}`;
}
