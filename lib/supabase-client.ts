// Browser client (para Client Components y Admin pages)
// Usa @supabase/ssr para mantener sesión vía cookies automáticamente.
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Durante el build (SSR prerender), las env vars pueden no estar disponibles.
  // Usamos placeholders para que la creación del cliente no lance excepciones.
  // Las llamadas reales a la API ocurren en useEffect (solo en el cliente).
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';
  return createBrowserClient(url, key);
}
