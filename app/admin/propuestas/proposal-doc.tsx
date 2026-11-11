"use client";

import { useEffect, useState } from "react";
import { Check, X, CalendarDays, MapPin, Users, Phone, Mail, Globe } from "lucide-react";
import { formatLongDate } from "../../../lib/event-dates";

/* ─────────────────────────────────────────────────────────────
   Borrador de propuesta. Todo es texto editable: nada se inventa,
   sale de la experiencia, del hacedor o de lo que escriba Moisés.
   Las listas van una por línea; "Título | texto" separa con barra.
───────────────────────────────────────────────────────────── */
export type Draft = {
  cliente: string; clienteLegal: string;
  fecha: string; hora: string; lugar: string;
  experienciaSlug: string;
  titulo: string; subtitulo: string; duracion: string;
  gancho: string; descripcion: string; vivir: string;
  hacedorSlug: string; hacedorNombre: string; hacedorRol: string; hacedorTexto: string; hacedorFoto: string;
  momentosTitulo: string; momentos: string; aprender: string;
  incluye: string; noIncluye: string; coordinar: string;
  valor: string; valorNota: string; formaPago: string; documento: string; pasos: string;
  fotos: string[];
};

export const EMPTY_DRAFT: Draft = {
  cliente: "", clienteLegal: "",
  fecha: "", hora: "", lugar: "",
  experienciaSlug: "",
  titulo: "", subtitulo: "", duracion: "",
  gancho: "", descripcion: "", vivir: "",
  hacedorSlug: "", hacedorNombre: "", hacedorRol: "", hacedorTexto: "", hacedorFoto: "",
  momentosTitulo: "", momentos: "", aprender: "",
  incluye: "",
  noIncluye: "Transporte de ida y vuelta para los asistentes.\nSeguro ni asistencia médica.\nPropinas ni gastos no especificados.",
  coordinar: "Número de participantes | Cada persona recibe sus materiales.\nHora de inicio | Para organizar el montaje.\nEspacio | Mesas y sillas para todos.",
  valor: "", valorNota: "",
  formaPago: "Transferencia bancaria o depósito. Nu Bank, llave @MCP793, a nombre de Moises Camargo.",
  documento: "",
  pasos: "Confirmamos el número de participantes y la hora de inicio.\nCoordinamos juntos el espacio.\nEl día de la experiencia llegamos antes y montamos todo.",
  fotos: [],
};

const lines = (s: string) => s.split("\n").map(l => l.trim()).filter(Boolean);
const parts = (l: string) => l.split("|").map(p => p.trim());

export function formatValor(raw: string): string {
  const n = Number(String(raw).replace(/[^\d]/g, ""));
  return n > 0 ? "$" + new Intl.NumberFormat("es-CO").format(n) : "";
}

export function fechaLarga(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const txt = formatLongDate(iso);
  return txt.charAt(0).toUpperCase() + txt.slice(1) + " de " + iso.slice(0, 4);
}

const LOGO = {
  plano: "/logos/ds/cx-plano-ink.png",
  sticker: "/logos/ds/cx-sticker-amarillo.png",
  principal: "/logos/ds/cx-principal-amarillo.png",
};

export const PROPOSAL_CSS = `
.pp { --y:#F4C430; --ink:#111827; --teal:#2A9D8F; --butter:#FFFBF0; --stone:#F6F5F2;
  --g100:#f3f4f6; --g200:#e5e7eb; --g400:#9ca3af; --g500:#6b7280; --g600:#4b5563; --g700:#374151;
  color: var(--g700); font-family: var(--font-inter), system-ui, sans-serif; font-size: 10.5pt; line-height: 1.65;
  -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.pp, .pp * { box-sizing: border-box; margin: 0; padding: 0; }
.pp-page { width: 210mm; height: 297mm; position: relative; overflow: hidden; background: #fff; break-after: page; page-break-after: always; }
.pp-page:last-child { break-after: auto; page-break-after: auto; }
.pp .pad { padding: 30mm 18mm 22mm; height: 100%; display: flex; flex-direction: column; }
.pp h1, .pp h2, .pp h3 { font-family: var(--font-outfit), system-ui, sans-serif; font-weight: 900; color: var(--ink); letter-spacing: -0.02em; line-height: 1.05; text-wrap: balance; }
.pp h2 { font-size: 27pt; margin-bottom: 5mm; }
.pp h3 { font-size: 13pt; line-height: 1.15; }
.pp .eyebrow { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #9A7B0A; margin-bottom: 3mm; }
.pp .lead { font-size: 12pt; line-height: 1.6; color: var(--g600); max-width: 150mm; white-space: pre-line; }
.pp img { display: block; }
.pp ul { list-style: none; }
.pp svg { flex-shrink: 0; }
.pp .ph { position: absolute; top: 12mm; left: 18mm; right: 18mm; display: flex; align-items: center; justify-content: space-between; gap: 6mm; }
.pp .ph img { height: 9mm; }
.pp .ph span { font-size: 7pt; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--g400); text-align: right; }
.pp .pf { position: absolute; bottom: 10mm; left: 18mm; right: 18mm; display: flex; justify-content: space-between; font-size: 7.5pt; color: var(--g400); border-top: 0.3mm solid var(--g100); padding-top: 3mm; }
.pp .pf b { font-variant-numeric: tabular-nums; font-weight: 600; color: var(--g500); }
.pp .ph-fill { position: relative; border-radius: 6mm; overflow: hidden; background: var(--stone); }
.pp .ph-fill img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.pp .num { flex-shrink: 0; width: 5.5mm; height: 5.5mm; border-radius: 50%; background: var(--ink); color: #fff; font-size: 7.5pt; font-weight: 700; display: flex; align-items: center; justify-content: center; margin-top: 0.4mm; }

.pp .cover { background: var(--ink); color: #fff; }
.pp .cover-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 40%; }
.pp .cover-veil { position: absolute; inset: 0; background: linear-gradient(to top, rgb(17 24 39 / 0.96) 0%, rgb(17 24 39 / 0.82) 30%, rgb(17 24 39 / 0.25) 58%, rgb(17 24 39 / 0.35) 100%); }
.pp .cover-in { position: absolute; inset: 0; padding: 16mm 18mm 18mm; display: flex; flex-direction: column; justify-content: space-between; }
.pp .cover-logo { height: 24mm; align-self: flex-start; }
.pp .pill { display: inline-flex; background: var(--y); color: var(--ink); font-size: 7.5pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; padding: 2mm 4.5mm; border-radius: 999px; }
.pp .cover h1 { color: #fff; font-size: 44pt; line-height: 1; margin: 6mm 0 5mm; max-width: 168mm; }
.pp .cover-sub { font-size: 13pt; line-height: 1.5; color: rgb(255 255 255 / 0.82); max-width: 140mm; margin-bottom: 9mm; }
.pp .meta { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; border-top: 0.3mm solid rgb(255 255 255 / 0.22); padding-top: 6mm; }
.pp .meta div { display: flex; gap: 2.5mm; align-items: flex-start; font-size: 10pt; line-height: 1.35; color: #fff; }
.pp .meta small { display: block; font-size: 6.8pt; letter-spacing: 0.16em; text-transform: uppercase; color: rgb(255 255 255 / 0.6); font-weight: 600; margin-bottom: 0.8mm; }
.pp .meta svg { color: var(--y); margin-top: 0.6mm; }

.pp .exp-grid { display: grid; grid-template-columns: 1fr 78mm; gap: 9mm; margin-top: 7mm; }
.pp .exp-grid.solo { grid-template-columns: 1fr; }
.pp .cards { display: flex; flex-direction: column; gap: 4.5mm; }
.pp .card { background: var(--butter); border-radius: 5mm; padding: 5.5mm 6mm; }
.pp .card p { font-size: 10pt; line-height: 1.55; margin-top: 1.5mm; }
.pp .card.plain { display: flex; gap: 3mm; align-items: flex-start; font-size: 10.3pt; line-height: 1.5; }
.pp .card.plain svg { color: var(--teal); margin-top: 1mm; }
.pp .strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: auto; padding-top: 7mm; }
.pp .strip .ph-fill { height: 47mm; border-radius: 5mm; }
.pp .cap { font-size: 7.5pt; color: var(--g400); margin-top: 2.5mm; }

.pp .maker { display: grid; grid-template-columns: 74mm 1fr; gap: 10mm; margin-top: 6mm; align-items: start; }
.pp .maker.solo { grid-template-columns: 1fr; }
.pp .maker .ph-fill { height: 96mm; }
.pp .maker .ph-fill img { object-position: 50% 12%; }
.pp .maker h3 { font-size: 21pt; margin-bottom: 1.5mm; }
.pp .role { font-size: 8pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #218276; margin-bottom: 5mm; }
.pp .maker p.txt { margin-bottom: 3.5mm; white-space: pre-line; }
.pp .about { margin-top: auto; background: var(--ink); color: rgb(255 255 255 / 0.8); border-radius: 6mm; padding: 8mm; display: grid; grid-template-columns: 30mm 1fr; gap: 8mm; align-items: center; }
.pp .about img { width: 100%; }
.pp .about h3 { color: #fff; margin-bottom: 2mm; }
.pp .about p { font-size: 9.5pt; line-height: 1.6; }

.pp .two { display: grid; grid-template-columns: 1fr 70mm; gap: 10mm; margin-top: 7mm; }
.pp .two.solo { grid-template-columns: 1fr; }
.pp .tl { position: relative; padding-left: 9mm; }
.pp .tl::before { content: ""; position: absolute; left: 2.2mm; top: 2mm; bottom: 4mm; width: 0.5mm; background: var(--g200); }
.pp .tl-item { position: relative; padding-bottom: 7mm; }
.pp .tl-item::before { content: ""; position: absolute; left: -9mm; top: 1.2mm; width: 5mm; height: 5mm; border-radius: 50%; background: var(--y); border: 1mm solid #fff; box-shadow: 0 0 0 0.3mm var(--g200); }
.pp .dur { display: inline-block; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--g500); background: var(--g100); padding: 0.8mm 3mm; border-radius: 999px; margin-bottom: 1.8mm; font-variant-numeric: tabular-nums; }
.pp .tl-item p { font-size: 9.8pt; line-height: 1.55; margin-top: 1.2mm; }
.pp .learn { background: var(--stone); border-radius: 6mm; padding: 6.5mm; align-self: start; }
.pp .learn h3 { margin-bottom: 4mm; }
.pp .learn li { display: flex; gap: 2.5mm; font-size: 9.3pt; line-height: 1.5; margin-bottom: 3mm; }
.pp .learn li svg { color: var(--teal); margin-top: 0.8mm; }
.pp .wide { margin-top: auto; height: 62mm; }
.pp .note { font-size: 8.5pt; color: var(--g500); margin-top: 1mm; }

.pp .cols { display: grid; grid-template-columns: 1fr 1fr; gap: 7mm; margin-top: 6mm; }
.pp .cols.solo { grid-template-columns: 1fr; }
.pp .box { border-radius: 6mm; padding: 6mm 6.5mm 3.5mm; }
.pp .box.yes { background: var(--butter); }
.pp .box.no { background: var(--stone); }
.pp .box h3 { margin-bottom: 4.5mm; }
.pp .box li { display: flex; gap: 2.8mm; font-size: 9.8pt; line-height: 1.45; margin-bottom: 2.6mm; }
.pp .box.yes svg { color: var(--teal); margin-top: 0.9mm; }
.pp .box.no svg { color: var(--g400); margin-top: 1mm; }
.pp .need { margin-top: 7mm; display: grid; grid-template-columns: 1fr 58mm; gap: 7mm; }
.pp .need.solo { grid-template-columns: 1fr; }
.pp .need-list { border: 0.3mm solid var(--g200); border-radius: 6mm; padding: 6mm 6.5mm 3.5mm; }
.pp .need-list h3 { margin-bottom: 4mm; }
.pp .need-list li { display: flex; gap: 3mm; font-size: 9.8pt; line-height: 1.45; margin-bottom: 2.6mm; }
.pp .need-list li b { color: var(--ink); font-weight: 600; }
.pp .need .ph-fill { min-height: 60mm; }

.pp .price { background: var(--y); border-radius: 7mm; padding: 9mm 10mm; display: grid; grid-template-columns: 1fr auto; gap: 8mm; align-items: end; margin-top: 6mm; }
.pp .price small { display: block; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: rgb(17 24 39 / 0.7); margin-bottom: 2mm; }
.pp .price b { font-family: var(--font-outfit), system-ui, sans-serif; font-weight: 900; font-size: 44pt; line-height: 0.95; color: var(--ink); letter-spacing: -0.03em; font-variant-numeric: tabular-nums; }
.pp .price b span { font-size: 16pt; letter-spacing: 0; margin-left: 1.5mm; }
.pp .price p { font-size: 9.5pt; line-height: 1.5; color: var(--ink); max-width: 62mm; }
.pp .kv { display: grid; grid-template-columns: 1fr 1fr; gap: 5mm 8mm; margin-top: 7mm; }
.pp .kv div { border-top: 0.3mm solid var(--g200); padding-top: 3mm; }
.pp .kv small { display: block; font-size: 7pt; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--g400); margin-bottom: 1mm; }
.pp .kv p { font-size: 10pt; line-height: 1.5; color: var(--ink); }
.pp .next { margin-top: 8mm; }
.pp .next h3 { margin-bottom: 4mm; }
.pp .next li { display: flex; gap: 3mm; font-size: 10pt; line-height: 1.5; margin-bottom: 3mm; }
.pp .close { margin-top: auto; display: grid; grid-template-columns: 92mm 1fr; gap: 7mm; align-items: stretch; }
.pp .close.solo { grid-template-columns: 1fr; }
.pp .close .ph-fill { height: 66mm; }
.pp .contact { background: var(--ink); border-radius: 6mm; padding: 6.5mm 7mm; color: #fff; display: flex; flex-direction: column; justify-content: center; }
.pp .contact h3 { color: #fff; margin-bottom: 3.5mm; }
.pp .contact p { display: flex; align-items: center; gap: 2.5mm; font-size: 9.8pt; margin-bottom: 1.8mm; color: rgb(255 255 255 / 0.9); }
.pp .contact svg { color: var(--y); }
.pp .contact .legal { font-size: 7.3pt; color: rgb(255 255 255 / 0.55); margin: 2.5mm 0 0; display: block; line-height: 1.5; }
`;

/* Las fotos originales pesan varios MB cada una y el PDF salía de más de 100 MB.
   Cada foto se reduce en el navegador a JPEG de ancho web antes de entrar al documento. */
const thumbCache = new Map<string, string>();

function shrink(src: string, maxW: number): Promise<string> {
  const key = `${maxW}|${src}`;
  const hit = thumbCache.get(key);
  if (hit) return Promise.resolve(hit);
  return new Promise(resolve => {
    const im = new window.Image();
    im.crossOrigin = "anonymous";
    im.onload = () => {
      try {
        const scale = Math.min(1, maxW / im.naturalWidth);
        const c = document.createElement("canvas");
        c.width = Math.round(im.naturalWidth * scale);
        c.height = Math.round(im.naturalHeight * scale);
        c.getContext("2d")!.drawImage(im, 0, 0, c.width, c.height);
        const out = c.toDataURL("image/jpeg", 0.82);
        thumbCache.set(key, out);
        resolve(out);
      } catch {
        resolve(src); // imagen de otro dominio sin permiso: se usa la original
      }
    };
    im.onerror = () => resolve(src);
    im.src = src;
  });
}

function useSmall(src: string | undefined, maxW: number): string | undefined {
  const [state, setState] = useState<{ src: string; small: string } | null>(null);
  useEffect(() => {
    if (!src) return;
    let alive = true;
    shrink(src, maxW).then(small => { if (alive) setState({ src, small }); });
    return () => { alive = false; };
  }, [src, maxW]);
  if (!src) return undefined;
  return state && state.src === src ? state.small : undefined;
}

function Img({ src, maxW, className }: { src: string; maxW: number; className?: string }) {
  const small = useSmall(src, maxW);
  // Mientras se reduce no se pinta nada, para que la original nunca llegue al PDF
  if (!small) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={small} alt="" className={className} data-ready="1" />;
}

function Photo({ src, className = "", maxW = 1100 }: { src?: string; className?: string; maxW?: number }) {
  if (!src) return null;
  return <figure className={`ph-fill ${className}`}><Img src={src} maxW={maxW} /></figure>;
}

/** Devuelve las páginas de la propuesta. Las secciones vacías no generan página. */
export function ProposalDoc({ d }: { d: Draft }) {
  const f = d.fotos;
  const vivir = lines(d.vivir).map(parts);
  const momentos = lines(d.momentos).map(parts);
  const aprender = lines(d.aprender);
  const incluye = lines(d.incluye);
  const noIncluye = lines(d.noIncluye);
  const coordinar = lines(d.coordinar).map(parts);
  const pasos = lines(d.pasos);
  const valor = formatValor(d.valor);
  const fecha = fechaLarga(d.fecha);
  const titulo = d.titulo || "Título de la experiencia";
  const cliente = d.cliente || "Cliente";
  const fechaLugar = [fecha, d.lugar ? `en ${d.lugar}` : ""].filter(Boolean).join(", ");

  const hasMaker = !!d.hacedorNombre.trim();
  const hasPrograma = momentos.length > 0 || aprender.length > 0;
  const hasIncluye = incluye.length > 0 || noIncluye.length > 0 || coordinar.length > 0;

  const pageDefs: ("cover" | "exp" | "maker" | "programa" | "incluye" | "inversion")[] = ["cover", "exp"];
  if (hasMaker) pageDefs.push("maker");
  if (hasPrograma) pageDefs.push("programa");
  if (hasIncluye) pageDefs.push("incluye");
  pageDefs.push("inversion");
  const total = pageDefs.length;
  const n = (k: (typeof pageDefs)[number]) => pageDefs.indexOf(k) + 1;

  const head = (
    <header className="ph">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={LOGO.plano} alt="ComboXplora" />
      <span>Propuesta · {titulo} · {cliente}</span>
    </header>
  );
  const foot = (k: (typeof pageDefs)[number]) => (
    <footer className="pf"><span>comboxplora@gmail.com · (+57) 312 247 5789</span><b>{n(k)} / {total}</b></footer>
  );

  return (
    <div className="pp">
      {/* Portada */}
      <section className="pp-page cover" data-page="Portada">
        {f[0] && <Img className="cover-img" src={f[0]} maxW={1500} />}
        <div className="cover-veil" />
        <div className="cover-in">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="cover-logo" src={f[0] ? LOGO.sticker : LOGO.principal} alt="ComboXplora" />
          <div>
            <span className="pill">Propuesta de experiencia</span>
            <h1>{titulo}</h1>
            {d.subtitulo && <p className="cover-sub">{d.subtitulo}</p>}
            <div className="meta">
              <div><Users size={18} /><span><small>Preparada para</small>{cliente}</span></div>
              <div><CalendarDays size={18} /><span><small>Fecha</small>{fecha || "Por confirmar"}</span></div>
              <div><MapPin size={18} /><span><small>Lugar</small>{d.lugar || "Por confirmar"}</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* La experiencia */}
      <section className="pp-page" data-page="La experiencia">
        {head}
        <div className="pad">
          <p className="eyebrow">La experiencia</p>
          <h2>{d.gancho || titulo}</h2>
          {d.descripcion && <p className="lead">{d.descripcion}</p>}
          <div className={`exp-grid ${f[1] ? "" : "solo"}`}>
            <div className="cards">
              {vivir.map((v, i) =>
                v.length > 1 ? (
                  <div className="card" key={i}><h3>{v[0]}</h3><p>{v.slice(1).join(" ")}</p></div>
                ) : (
                  <div className="card plain" key={i}><Check size={16} /><span>{v[0]}</span></div>
                ),
              )}
            </div>
            <Photo src={f[1]} />
          </div>
          {f[2] && (
            <>
              <div className="strip">
                <Photo src={f[2]} /><Photo src={f[3]} /><Photo src={f[4]} />
              </div>
              <p className="cap">Fotos de experiencias anteriores de ComboXplora.</p>
            </>
          )}
        </div>
        {foot("exp")}
      </section>

      {/* El hacedor */}
      {hasMaker && (
        <section className="pp-page" data-page="El hacedor">
          {head}
          <div className="pad">
            <p className="eyebrow">Quién guía la experiencia</p>
            <h2>La guía un hacedor local</h2>
            <div className={`maker ${d.hacedorFoto ? "" : "solo"}`}>
              <Photo src={d.hacedorFoto} />
              <div>
                <h3>{d.hacedorNombre}</h3>
                {d.hacedorRol && <p className="role">{d.hacedorRol}</p>}
                {d.hacedorTexto.split(/\n{2,}/).filter(Boolean).map((p, i) => <p className="txt" key={i}>{p}</p>)}
              </div>
            </div>
            <div className="about">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={LOGO.principal} alt="ComboXplora" />
              <div>
                <h3>ComboXplora acompaña toda la experiencia</h3>
                <p>Somos una plataforma cultural de Barranquilla que conecta a las personas con hacedores locales. Nuestro equipo monta el espacio, lleva los materiales y está presente de principio a fin.</p>
              </div>
            </div>
          </div>
          {foot("maker")}
        </section>
      )}

      {/* Programa */}
      {hasPrograma && (
        <section className="pp-page" data-page="Cómo será">
          {head}
          <div className="pad">
            <p className="eyebrow">Cómo será</p>
            <h2>{d.momentosTitulo || "El paso a paso"}</h2>
            <p className="note">{[fecha, d.lugar, d.hora ? d.hora : "Hora de inicio por confirmar"].filter(Boolean).join(" · ")}.</p>
            <div className={`two ${momentos.length && aprender.length ? "" : "solo"}`}>
              {momentos.length > 0 && (
                <div className="tl">
                  {momentos.map((m, i) => (
                    <div className="tl-item" key={i}>
                      {m.length > 2 && <span className="dur">{m[0]}</span>}
                      <h3>{m.length > 2 ? m[1] : m[0]}</h3>
                      {(m.length > 2 ? m[2] : m[1]) && <p>{m.length > 2 ? m.slice(2).join(" ") : m[1]}</p>}
                    </div>
                  ))}
                </div>
              )}
              {aprender.length > 0 && (
                <aside className="learn">
                  <h3>Lo que van a aprender</h3>
                  <ul>{aprender.map((a, i) => <li key={i}><Check size={15} /><span>{a}</span></li>)}</ul>
                </aside>
              )}
            </div>
            <Photo src={f[5]} className="wide" />
          </div>
          {foot("programa")}
        </section>
      )}

      {/* Qué incluye */}
      {hasIncluye && (
        <section className="pp-page" data-page="Qué incluye">
          {head}
          <div className="pad">
            <p className="eyebrow">Qué incluye</p>
            <h2>Llevamos todo lo necesario</h2>
            <div className={`cols ${incluye.length && noIncluye.length ? "" : "solo"}`}>
              {incluye.length > 0 && (
                <div className="box yes"><h3>Incluye</h3><ul>{incluye.map((x, i) => <li key={i}><Check size={18} /><span>{x}</span></li>)}</ul></div>
              )}
              {noIncluye.length > 0 && (
                <div className="box no"><h3>No incluye</h3><ul>{noIncluye.map((x, i) => <li key={i}><X size={16} /><span>{x}</span></li>)}</ul></div>
              )}
            </div>
            {coordinar.length > 0 && (
              <div className={`need ${f[6] ? "" : "solo"}`}>
                <div className="need-list">
                  <h3>Para que salga bien</h3>
                  <ul>
                    {coordinar.map((c, i) => (
                      <li key={i}><span className="num">{i + 1}</span><span>{c.length > 1 ? <><b>{c[0]}.</b> {c.slice(1).join(" ")}</> : c[0]}</span></li>
                    ))}
                  </ul>
                </div>
                <Photo src={f[6]} />
              </div>
            )}
          </div>
          {foot("incluye")}
        </section>
      )}

      {/* Inversión */}
      <section className="pp-page" data-page="Inversión">
        {head}
        <div className="pad">
          <p className="eyebrow">Inversión y siguientes pasos</p>
          <h2>Todo en un solo valor</h2>
          <div className="price">
            <div><small>Valor</small><b>{valor || "$ —"}{valor && <span>COP</span>}</b></div>
            {d.valorNota && <p>{d.valorNota}</p>}
          </div>
          <div className="kv">
            {d.formaPago && <div><small>Forma de pago</small><p>{d.formaPago}</p></div>}
            {d.documento && <div><small>Documento de cobro</small><p>{d.documento}</p></div>}
            <div><small>Cliente</small><p>{d.clienteLegal || cliente}</p></div>
            <div><small>Fecha y lugar</small><p>{fechaLugar || "Por confirmar"}{d.hora ? `. ${d.hora}` : fechaLugar ? ". Hora por confirmar." : ""}</p></div>
          </div>
          {pasos.length > 0 && (
            <div className="next">
              <h3>Siguientes pasos</h3>
              <ul>{pasos.map((p, i) => <li key={i}><span className="num">{i + 1}</span><span>{p}</span></li>)}</ul>
            </div>
          )}
          <div className={`close ${f[7] ? "" : "solo"}`}>
            <Photo src={f[7]} />
            <div className="contact">
              <h3>¿Hablamos?</h3>
              <p><Phone size={15} />(+57) 312 247 5789</p>
              <p><Mail size={15} />comboxplora@gmail.com</p>
              <p><Globe size={15} />instagram.com/comboxplora</p>
              <span className="legal">Moises Camargo Perez, representante legal de ComboXplora · NIT 1004277793 · RNT 292530</span>
            </div>
          </div>
        </div>
        {foot("inversion")}
      </section>
    </div>
  );
}
