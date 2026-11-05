import { NextResponse } from 'next/server';
import { correr, lineas, registrar, resumen, type Corrida } from '../../../../lib/publicador';
import { sendPublicadorAviso } from '../../../../lib/email';

// Lo dispara el cron de Vercel (vercel.json) los lunes y jueves a las 6:00 p. m. de Colombia.
// Vercel manda "Authorization: Bearer <CRON_SECRET>"; sin esa clave no corre.
// ?probar=1 lo corre como ENSAYO a cualquier hora: no publica nada.
export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const escapar = (t: string) => t.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

function asunto(c: Corrida) {
  const publicadas = c.piezas.filter((p) => p.accion === 'publicada').length;
  const fallos = c.piezas.filter((p) => p.accion === 'fallo').length;
  if (fallos) return `Publicador: ${fallos} pieza(s) no se publicaron`;
  if (publicadas) return `Publicado en @comboxplora: ${c.piezas.find((p) => p.accion === 'publicada')!.titulo}`;
  if (c.modo === 'ENSAYO') return `Ensayo del publicador (${c.ahora})`;
  return `Publicador (${c.ahora})`;
}

export async function GET(request: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || request.headers.get('authorization') !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: 'No autorizado.' }, { status: 401 });
  }
  const probar = new URL(request.url).searchParams.get('probar') === '1';

  try {
    const corrida = await correr({ probar });
    if (corrida.modo !== 'APAGADO') {
      await registrar(corrida).catch((e) => console.error('[publicador] registro:', e));
      if ((corrida.piezas.length || corrida.errores.length || probar) && process.env.RESEND_API_KEY) {
        const encabezado = `${corrida.modo} · ${corrida.ahora}${corrida.cuenta ? ` · ${corrida.cuenta} verificada` : ''}`;
        await sendPublicadorAviso({ asunto: asunto(corrida), lineas: [encabezado, ...lineas(corrida)].map(escapar) })
          .catch((e) => console.error('[publicador] aviso:', e));
      }
    }
    return NextResponse.json({ ...corrida, resumen: resumen(corrida) });
  } catch (err) {
    console.error('[publicador] Error:', err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
