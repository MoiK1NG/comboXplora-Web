// Publicador automático de Instagram: publica en @comboxplora las piezas aprobadas
// con fecha de hoy. Lo corre el cron de Vercel (app/api/cron/publicador).
// Es el mismo método que contenido/estudio/publicar.mjs + publicador.md, pasado al servidor.
//
// Reglas que no se rompen en ningún modo:
// - nunca publica una pieza que no esté en "aprobada" ni fuera de su fecha;
// - nunca publica en otra cuenta (comprueba que el token sea de @comboxplora);
// - nunca aprueba ni cambia fechas; solo pasa a "publicada" lo que publicó;
// - si una publicación falla, no reintenta: anota el error y avisa.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export const CUENTA = { id: '17841469419391266', usuario: 'comboxplora' };
export const HORA = { desde: '17:50', hasta: '21:00' }; // hora de Colombia
export const DIAS = ['lunes', 'jueves'];
export type Modo = 'APAGADO' | 'ENSAYO' | 'ENCENDIDO';

const GRAPH = 'https://graph.facebook.com/v23.0';
const MANUAL = /PUBLICAR:\s*manual/i;

type Pieza = {
  id: string;
  titulo: string;
  formato: string | null;
  estado: string;
  fecha_programada: string | null;
  caption: string | null;
  assets: string[] | null;
  notas_admin: string | null;
  ig_media_id: string | null;
};

type Contenido =
  | { media_type: 'CAROUSEL'; children: string[] }
  | { media_type: 'REELS'; video_url: string }
  | { media_type: 'IMAGE'; image_url: string };

export type Resultado = {
  id: string;
  titulo: string;
  formato: string | null;
  accion: 'publicada' | 'habria_publicado' | 'no_publicar' | 'manual' | 'revisar' | 'fallo';
  detalle?: string;
  enlace?: string;
};

export function db(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY.');
  return createClient(url, key, { auth: { persistSession: false } });
}

// Fecha y hora de Colombia (UTC-5, sin horario de verano).
export function ahoraColombia(d = new Date()) {
  const c = new Date(d.getTime() - 5 * 3600e3).toISOString();
  return { fecha: c.slice(0, 10), hora: c.slice(11, 16) };
}
const diaSemana = (f: string) =>
  new Date(`${f}T12:00:00Z`).toLocaleDateString('es-CO', { weekday: 'long', timeZone: 'UTC' });

// Sin fila o sin tabla, el publicador queda APAGADO.
export async function leerModo(sb: SupabaseClient): Promise<Modo> {
  const { data } = await sb.from('publicador_ajustes').select('modo').eq('id', 1).maybeSingle();
  const m = data?.modo;
  return m === 'ENSAYO' || m === 'ENCENDIDO' ? m : 'APAGADO';
}

// ── Revisión de la pieza (lo mismo que revisar() de publicar.mjs) ──

async function revisarArchivo(url: string) {
  try {
    const r = await fetch(url, { method: 'HEAD' });
    if (!r.ok) return `no abre (${r.status}): ${url}`;
    const tipo = r.headers.get('content-type') ?? '';
    const mb = Number(r.headers.get('content-length') ?? 0) / 1e6;
    if (/\.jpe?g(\?|$)/i.test(url) && (!tipo.includes('jpeg') || mb > 8)) return `imagen no válida (${tipo}, ${mb.toFixed(1)} MB): ${url}`;
    if (/\.mp4(\?|$)/i.test(url) && (!tipo.includes('mp4') || mb > 300)) return `video no válido (${tipo}, ${mb.toFixed(1)} MB): ${url}`;
    return null;
  } catch (e) {
    return `no abre (${(e as Error).message}): ${url}`;
  }
}

export async function revisar(p: Pieza) {
  const errores: string[] = [];
  const assets = p.assets ?? [];
  const jpg = assets.filter((u) => /\.jpe?g(\?|$)/i.test(u));
  const mp4 = assets.filter((u) => /\.mp4(\?|$)/i.test(u));
  let contenido: Contenido | null = null;
  if (p.formato === 'carrusel') {
    if (jpg.length < 2 || jpg.length > 10 || jpg.length !== assets.length) errores.push(`un carrusel lleva de 2 a 10 láminas .jpg (tiene ${assets.length})`);
    contenido = { media_type: 'CAROUSEL', children: jpg };
  } else if (p.formato === 'reel') {
    if (mp4.length !== 1) errores.push(`un reel lleva un solo .mp4 (tiene ${mp4.length})`);
    contenido = { media_type: 'REELS', video_url: mp4[0] };
  } else if (p.formato === 'imagen') {
    if (jpg.length !== 1) errores.push(`una imagen lleva un solo .jpg (tiene ${jpg.length})`);
    contenido = { media_type: 'IMAGE', image_url: jpg[0] };
  } else {
    errores.push(`formato "${p.formato}" no lo publica el publicador`);
  }
  const caption = (p.caption ?? '').trim();
  if (!caption) errores.push('sin caption');
  if (caption.length > 2200) errores.push(`caption de ${caption.length} caracteres (máximo 2.200)`);
  const hashtags = caption.match(/#[\p{L}\p{N}_]+/gu)?.length ?? 0;
  // Instagram bajó el tope de 30 a 5 hashtags por publicación (anuncio de @creators, 18-dic-2025).
  if (hashtags > 5) errores.push(`${hashtags} hashtags (máximo 5)`);
  for (const u of assets) {
    const e = await revisarArchivo(u);
    if (e) errores.push(e);
  }
  return { errores, contenido, caption };
}

// ── Graph API de Instagram ──

function token() {
  const t = process.env.IG_ACCESS_TOKEN;
  if (!t) throw new Error('Falta IG_ACCESS_TOKEN en las variables de entorno');
  return t;
}

async function graph<T>(ruta: string, params?: Record<string, string>, metodo: 'GET' | 'POST' = 'GET'): Promise<T> {
  const url = new URL(`${GRAPH}/${ruta}`);
  const init: RequestInit = { method: metodo, headers: { Authorization: `Bearer ${token()}` } };
  if (metodo === 'GET') for (const [k, v] of Object.entries(params ?? {})) url.searchParams.set(k, v);
  else init.body = new URLSearchParams(params ?? {});
  const r = await fetch(url, init);
  const json = await r.json().catch(() => ({}));
  if (!r.ok || json.error) throw new Error(`Graph API ${ruta}: ${json.error?.message ?? r.status}`);
  return json as T;
}

// Comprueba que el token publique en @comboxplora y no en otra cuenta.
export async function verificarCuenta() {
  const r = await graph<{ id: string; username: string }>(CUENTA.id, { fields: 'id,username' });
  if (r.username !== CUENTA.usuario) throw new Error(`la cuenta ${CUENTA.id} es @${r.username}, no @${CUENTA.usuario}`);
  return r;
}

// Publicaciones de las últimas 24 horas, para no publicar dos veces la misma pieza.
async function recientes() {
  const r = await graph<{ data: { id: string; caption?: string; timestamp: string; permalink: string }[] }>(
    `${CUENTA.id}/media`, { fields: 'id,caption,timestamp,permalink', limit: '10' });
  const desde = Date.now() - 24 * 3600e3;
  return r.data.filter((m) => Date.parse(m.timestamp) >= desde);
}
const primeraLinea = (t: string) => t.trim().split('\n')[0].trim().toLowerCase();

const esperar = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Espera a que Instagram termine de procesar un contenedor (los reels tardan).
async function esperarContenedor(id: string, limiteMs = 240_000) {
  const fin = Date.now() + limiteMs;
  for (;;) {
    const { status_code } = await graph<{ status_code: string }>(id, { fields: 'status_code' });
    if (status_code === 'FINISHED') return;
    if (status_code === 'ERROR' || status_code === 'EXPIRED') throw new Error(`Instagram no pudo procesar el archivo (${status_code})`);
    if (Date.now() > fin) throw new Error('Instagram tardó más de 4 minutos en procesar el archivo');
    await esperar(5000);
  }
}

async function publicarEnInstagram(c: Contenido, caption: string) {
  let creacion: string;
  if (c.media_type === 'CAROUSEL') {
    const hijos: string[] = [];
    for (const image_url of c.children) {
      const h = await graph<{ id: string }>(`${CUENTA.id}/media`, { image_url, is_carousel_item: 'true' }, 'POST');
      hijos.push(h.id);
    }
    for (const h of hijos) await esperarContenedor(h, 60_000);
    creacion = (await graph<{ id: string }>(`${CUENTA.id}/media`,
      { media_type: 'CAROUSEL', children: hijos.join(','), caption }, 'POST')).id;
  } else if (c.media_type === 'REELS') {
    creacion = (await graph<{ id: string }>(`${CUENTA.id}/media`,
      { media_type: 'REELS', video_url: c.video_url, caption, share_to_feed: 'true' }, 'POST')).id;
  } else {
    creacion = (await graph<{ id: string }>(`${CUENTA.id}/media`, { image_url: c.image_url, caption }, 'POST')).id;
  }
  await esperarContenedor(creacion);
  const { id } = await graph<{ id: string }>(`${CUENTA.id}/media_publish`, { creation_id: creacion }, 'POST');
  const { permalink } = await graph<{ permalink: string }>(id, { fields: 'permalink' });
  return { mediaId: id, permalink };
}

// ── Escritura en la parrilla ──

async function anotar(sb: SupabaseClient, id: string, texto: string, extra: Record<string, unknown> = {}) {
  const { data: p, error } = await sb.from('contenido_piezas').select('estado,notas_admin').eq('id', id).single();
  if (error) throw error;
  if (p.estado !== 'aprobada') throw new Error(`la pieza está en "${p.estado}", no en "aprobada"`);
  const notas = [p.notas_admin, texto].filter(Boolean).join('\n');
  const { error: e2 } = await sb.from('contenido_piezas').update({ ...extra, notas_admin: notas }).eq('id', id);
  if (e2) throw e2;
}

// ── Corrida ──

export type Corrida = {
  modo: Modo;
  fecha: string;
  ahora: string;
  enHora: boolean;
  diaDePublicacion: boolean;
  cuenta: string | null;
  piezas: Resultado[];
  errores: string[];
};

// probar: corre como ENSAYO sea cual sea el modo y la hora (sirve para dispararlo a mano).
export async function correr({ probar = false } = {}): Promise<Corrida> {
  const sb = db();
  const ahora = ahoraColombia();
  const modoGuardado = await leerModo(sb);
  const modo: Modo = probar ? 'ENSAYO' : modoGuardado;
  const enHora = ahora.hora >= HORA.desde && ahora.hora < HORA.hasta;
  const corrida: Corrida = {
    modo, fecha: ahora.fecha, ahora: `${ahora.fecha} ${ahora.hora}`, enHora,
    diaDePublicacion: DIAS.includes(diaSemana(ahora.fecha)), cuenta: null, piezas: [], errores: [],
  };
  if (modo === 'APAGADO') return corrida;

  const { data, error } = await sb.from('contenido_piezas')
    .select('id,titulo,formato,estado,fecha_programada,caption,assets,notas_admin,ig_media_id')
    .eq('estado', 'aprobada').eq('fecha_programada', ahora.fecha);
  if (error) throw error;
  const piezas = (data ?? []) as Pieza[];

  let yaPublicadas: Awaited<ReturnType<typeof recientes>> = [];
  try {
    corrida.cuenta = `@${(await verificarCuenta()).username}`;
    yaPublicadas = await recientes();
  } catch (e) {
    corrida.errores.push(`No se pudo comprobar la cuenta: ${(e as Error).message}. No se publica nada.`);
  }
  const cuentaOk = corrida.cuenta !== null;

  if (modo === 'ENCENDIDO' && !enHora && piezas.length) {
    corrida.errores.push(`Corrió a las ${ahora.hora}, fuera de la ventana ${HORA.desde}–${HORA.hasta}: no se publica. Elige otra fecha en el calendario.`);
  }

  for (const p of piezas) {
    const base = { id: p.id, titulo: p.titulo, formato: p.formato };
    if (MANUAL.test(p.notas_admin ?? '')) { corrida.piezas.push({ ...base, accion: 'manual', detalle: 'PUBLICAR: manual en las notas' }); continue; }
    if (p.ig_media_id) { corrida.piezas.push({ ...base, accion: 'revisar', detalle: `ya tiene ig_media_id ${p.ig_media_id}` }); continue; }
    const { errores, contenido, caption } = await revisar(p);
    if (errores.length || !contenido) { corrida.piezas.push({ ...base, accion: 'no_publicar', detalle: errores.join('; ') }); continue; }
    const repetida = yaPublicadas.find((m) => m.caption && primeraLinea(m.caption) === primeraLinea(caption));
    if (repetida) { corrida.piezas.push({ ...base, accion: 'revisar', detalle: `ya aparece en Instagram: ${repetida.permalink}`, enlace: repetida.permalink }); continue; }

    if (modo === 'ENSAYO') {
      corrida.piezas.push({ ...base, accion: 'habria_publicado', detalle: `${contenido.media_type}, ${(p.assets ?? []).length} archivo(s)` });
      continue;
    }
    if (!cuentaOk) { corrida.piezas.push({ ...base, accion: 'no_publicar', detalle: 'no se pudo comprobar la cuenta' }); continue; }
    if (!enHora) { corrida.piezas.push({ ...base, accion: 'no_publicar', detalle: `fuera de la ventana ${HORA.desde}–${HORA.hasta}` }); continue; }
    try {
      const { mediaId, permalink } = await publicarEnInstagram(contenido, caption);
      const { fecha, hora } = ahoraColombia();
      await anotar(sb, p.id, `Publicada por el publicador automático (${fecha} ${hora}, hora de Colombia): ${permalink}`, {
        estado: 'publicada', ig_media_id: mediaId, ig_permalink: permalink, publicada_at: new Date().toISOString(),
      });
      corrida.piezas.push({ ...base, accion: 'publicada', enlace: permalink });
    } catch (e) {
      const mensaje = (e as Error).message;
      const { fecha, hora } = ahoraColombia();
      await anotar(sb, p.id, `Publicador automático (${fecha} ${hora}): no se publicó. ${mensaje}`).catch(() => {});
      corrida.piezas.push({ ...base, accion: 'fallo', detalle: mensaje });
    }
  }
  return corrida;
}

const ETIQUETA: Record<Resultado['accion'], string> = {
  publicada: 'Publicada', habria_publicado: 'Habría publicado', no_publicar: 'No sale',
  manual: 'La publicas tú', revisar: 'Revisar', fallo: 'Falló',
};

// Una línea por pieza y una por cada error de la corrida.
export function lineas(c: Corrida) {
  const partes = c.piezas.map((p) => `${ETIQUETA[p.accion]} «${p.titulo}»${p.enlace ? ` ${p.enlace}` : ''}${p.detalle && !p.enlace ? ` (${p.detalle})` : ''}`);
  if (!partes.length) partes.push('Sin piezas aprobadas para hoy');
  return [...partes, ...c.errores];
}

export function resumen(c: Corrida) {
  if (c.modo === 'APAGADO') return 'APAGADO: no hizo nada.';
  return `${c.modo} · ${c.ahora}${c.cuenta ? ` · ${c.cuenta} verificada` : ''}: ${lineas(c).join('; ')}`;
}

export async function registrar(c: Corrida) {
  await db().from('publicador_registro').insert({ modo: c.modo, resumen: resumen(c), detalle: c });
}
