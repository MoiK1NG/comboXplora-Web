"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { FileDown, RotateCcw, AlertTriangle, Wand2, ImageIcon } from "lucide-react";
import { fetchExperiences, fetchHacedores, type HacedorData } from "../../../lib/db";
import type { Experience } from "../../../lib/types";
import { FormSection } from "../../../components/admin/FormSection";
import { ProposalDoc, PROPOSAL_CSS, EMPTY_DRAFT, formatValor, type Draft } from "./proposal-doc";

const STORAGE_KEY = "cx-propuesta-borrador";

/* Ejemplo real: la propuesta enviada a Edumas (taller de máscaras, 13-nov-2026).
   Sirve de modelo de redacción; las fotos se toman de la experiencia elegida. */
const EDUMAS: Partial<Draft> = {
  cliente: "Edumas",
  clienteLegal: "Fundación para el Desarrollo Social Perfil Humano · Carrera 23a #80-05",
  fecha: "2026-11-13", hora: "", lugar: "Cajacopi Prado",
  titulo: "Taller de pintura de máscaras del Carnaval",
  subtitulo: "Dos horas con un maestro artesano de Galapa para conocer el oficio y pintar una máscara de papel maché con las manos.",
  duracion: "2 horas",
  gancho: "El Carnaval se aprende pintándolo",
  descripcion: "Las máscaras son la cara del Carnaval de Barranquilla. En este taller los participantes no las ven desde afuera: se sientan con un artesano, escuchan de dónde vienen y pintan una con sus propias manos.",
  vivir: "Conocen la historia | De dónde vienen las máscaras, qué representan el torito, el tigre o la marimonda, y cómo se hacen en papel maché.\nPintan su máscara | Cada persona recibe una máscara de papel maché, pinceles y pinturas. El artesano guía el trazo y el color, paso a paso.\nSe la llevan | Una máscara por persona, pintada por quien la hizo.",
  hacedorNombre: "Anthony Pertuz Valdés",
  hacedorRol: "Maestro artesano · Galapa, Atlántico",
  hacedorTexto: "Anthony talla en madera las máscaras del Carnaval de Barranquilla. Aprendió el oficio de su padre y lleva más de 18 años trabajando piezas hechas completamente a mano.\n\nEn 2024, Artesanías de Colombia le otorgó la Medalla a la Maestría Artesanal en la categoría Contemporánea.",
  momentosTitulo: "Dos horas, cuatro momentos",
  momentos: "10 min | Bienvenida | Presentación de ComboXplora y de Anthony. Cada persona encuentra su puesto con la máscara y los materiales listos.\n20 min | La historia y el oficio | Anthony cuenta de dónde vienen las máscaras del Carnaval y muestra cómo nace una máscara de papel maché.\n1 h 15 min | Manos a la obra | Pintura guiada. Se traza el diseño con lápiz, se aplican primero los colores claros y se termina con el negro para los detalles.\n15 min | Cierre y foto | Cada participante muestra su máscara, compartimos el refrigerio y nos tomamos la foto del grupo.",
  aprender: "Por qué las máscaras del Carnaval mezclan herencia africana, indígena y europea.\nLos materiales del oficio: madera, papel maché y tela.\nLos cinco pasos del papel maché: modelado en arcilla, empapelado, desmoldado, estucado y lijado, pintura y brillo.\nLos colores tradicionales: amarillo, rojo, azul, verde, blanco y negro.",
  incluye: "Taller guiado por un maestro artesano, de principio a fin.\nUna máscara de papel maché por persona.\nMateriales de pintura: pinturas, pinceles por persona, paletas, lápices y demás insumos.\nRefrigerio.\nPersonal de apoyo de ComboXplora durante el taller.",
  noIncluye: "Transporte de ida y vuelta para los asistentes.\nSeguro estudiantil ni asistencia médica.\nPropinas ni gastos no especificados.",
  coordinar: "Número de participantes | Cada persona recibe su máscara y su juego de materiales.\nHora de inicio | El taller dura dos horas desde que arrancamos.\nMesas y sillas | Para todos, en un salón donde se pueda pintar.\nPantalla o proyector | Para la presentación de la historia y el oficio.\nIngreso antes del inicio | Para montar los puestos, y un punto de agua cerca para lavar pinceles.",
  valor: "1400000",
  valorNota: "Taller de dos horas con artesano, máscaras, materiales, refrigerio y personal de apoyo.",
  documento: "Cuenta de cobro CC-2026-001, ya enviada junto con el RUT.",
  pasos: "Edumas confirma el número de participantes y la hora de inicio.\nCoordinamos juntos el salón en Cajacopi Prado: mesas, sillas y pantalla.\nEl viernes llegamos antes, montamos los puestos y recibimos al grupo.",
};
const EDUMAS_EXP = "taller-pintura-mascaras-carnaval";
const EDUMAS_HAC = "anthony-pertuz-valdes";

function loadDraft(): Draft {
  if (typeof window === "undefined") return EMPTY_DRAFT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_DRAFT, ...JSON.parse(raw) };
  } catch {
    // Sin almacenamiento local se empieza en blanco
  }
  return EMPTY_DRAFT;
}

const photosOf = (e?: Experience) => (e ? Array.from(new Set([e.coverImage, ...(e.gallery || [])].filter(Boolean))) : []);

const inputCls = "w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430] bg-white transition-all";
const labelCls = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5";
const hintCls = "text-[11px] text-gray-400 mt-1 leading-snug";

export default function AdminPropuestasPage() {
  const [d, setD] = useState<Draft>(loadDraft);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [hacedores, setHacedores] = useState<HacedorData[]>([]);
  const [overflow, setOverflow] = useState<string[]>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([fetchExperiences({ includeInactive: true }), fetchHacedores({ includeInactive: true })]).then(([e, h]) => {
      if (!alive) return;
      setExperiences(e);
      setHacedores(h);
    });
    return () => { alive = false; };
  }, []);

  // Autoguardado del borrador en este navegador
  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); } catch { /* sin almacenamiento */ }
  }, [d]);

  // Aviso si alguna página tiene más texto del que cabe
  useEffect(() => {
    const t = setTimeout(() => {
      const root = previewRef.current;
      if (!root) return;
      const over: string[] = [];
      root.querySelectorAll<HTMLElement>(".pp-page .pad").forEach(pad => {
        if (pad.scrollHeight > pad.clientHeight + 4) over.push(pad.closest<HTMLElement>(".pp-page")?.dataset.page || "");
      });
      setOverflow(over);
    }, 350);
    return () => clearTimeout(t);
  }, [d]);

  const set = (k: keyof Draft) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setD(prev => ({ ...prev, [k]: e.target.value }));

  const exp = useMemo(() => experiences.find(e => e.slug === d.experienciaSlug), [experiences, d.experienciaSlug]);
  const available = useMemo(() => photosOf(exp), [exp]);

  function chooseExperience(slug: string) {
    const e = experiences.find(x => x.slug === slug);
    if (!e) { setD(prev => ({ ...prev, experienciaSlug: "" })); return; }
    setD(prev => ({
      ...prev,
      experienciaSlug: slug,
      titulo: e.title,
      subtitulo: e.shortDescription,
      duracion: e.duration,
      gancho: "",
      descripcion: e.fullDescription || e.shortDescription,
      vivir: (e.whatToExpect || []).join("\n"),
      incluye: (e.includes || []).join("\n"),
      fotos: photosOf(e).slice(0, 8),
    }));
  }

  function chooseHacedor(slug: string) {
    const h = hacedores.find(x => x.slug === slug);
    if (!h) { setD(prev => ({ ...prev, hacedorSlug: "", hacedorNombre: "", hacedorRol: "", hacedorTexto: "", hacedorFoto: "" })); return; }
    setD(prev => ({
      ...prev,
      hacedorSlug: slug,
      hacedorNombre: h.name,
      hacedorRol: [h.category, h.neighborhood].filter(Boolean).join(" · "),
      hacedorTexto: h.shortDescription,
      hacedorFoto: h.profileImage,
    }));
  }

  function togglePhoto(src: string) {
    setD(prev => ({ ...prev, fotos: prev.fotos.includes(src) ? prev.fotos.filter(x => x !== src) : [...prev.fotos, src].slice(0, 8) }));
  }

  function loadExample() {
    const e = experiences.find(x => x.slug === EDUMAS_EXP);
    const h = hacedores.find(x => x.slug === EDUMAS_HAC);
    setD({
      ...EMPTY_DRAFT,
      ...EDUMAS,
      experienciaSlug: e ? EDUMAS_EXP : "",
      hacedorSlug: h ? EDUMAS_HAC : "",
      hacedorFoto: h?.profileImage || "",
      fotos: photosOf(e).slice(0, 8),
    });
  }

  function reset() {
    setD(EMPTY_DRAFT);
  }

  function downloadPdf() {
    const prev = document.title;
    document.title = `Propuesta ComboXplora - ${d.titulo || "experiencia"} - ${d.cliente || "cliente"}`;
    window.print();
    setTimeout(() => { document.title = prev; }, 1000);
  }

  const ready = !!d.cliente.trim() && !!d.titulo.trim();

  return (
    <div className="max-w-[1500px] mx-auto">
      <style>{PROPOSAL_CSS}</style>
      <style>{`
        .pp-preview .pp-page { box-shadow: 0 10px 40px -12px rgb(0 0 0 / 0.25); margin: 0 auto 28px; }
        .pp-zoom { zoom: 0.62; }
        @media (min-width: 1536px) { .pp-zoom { zoom: 0.74; } }
        @media print {
          @page { size: A4; margin: 0; }
          html, body { background: #fff !important; }
          .pp-zoom { zoom: 1 !important; }
          .pp-preview { padding: 0 !important; background: #fff !important; border: 0 !important; border-radius: 0 !important; overflow: visible !important; max-height: none !important; }
          .pp-preview .pp-page { box-shadow: none; margin: 0; }
        }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h1 className="font-outfit text-2xl font-black text-gray-900">Propuestas para empresas</h1>
          <p className="text-sm text-gray-400 mt-0.5">Elige la experiencia, completa los datos del cliente y descarga el PDF con la marca.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={loadExample} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-xs hover:bg-gray-50">
            <Wand2 size={14} /> Cargar ejemplo Edumas
          </button>
          <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-bold text-xs hover:bg-gray-50">
            <RotateCcw size={14} /> Empezar de cero
          </button>
          <button
            onClick={downloadPdf}
            disabled={!ready}
            title={ready ? "Abre el diálogo de impresión: elige Guardar como PDF" : "Falta el cliente o el título"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            <FileDown size={16} /> Descargar PDF
          </button>
        </div>
      </div>

      {overflow.length > 0 && (
        <div className="flex gap-3 p-4 mb-5 rounded-2xl bg-amber-50 border border-amber-100 text-amber-800 text-sm print:hidden">
          <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
          <p>Hay más texto del que cabe en: <strong>{overflow.join(", ")}</strong>. Acorta esa sección o quita un ítem; lo que sobra no sale en el PDF.</p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-[400px_minmax(0,1fr)] gap-6 items-start">
        {/* Formulario */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-6 print:hidden xl:max-h-[calc(100vh-190px)] xl:overflow-y-auto">
          <FormSection title="Cliente y fecha">
            <div>
              <label className={labelCls}>Cliente *</label>
              <input value={d.cliente} onChange={set("cliente")} placeholder="Nombre corto, como va en la portada" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Razón social y dirección</label>
              <input value={d.clienteLegal} onChange={set("clienteLegal")} placeholder="Como va en la cuenta de cobro" className={inputCls} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Fecha</label>
                <input type="date" value={d.fecha} onChange={set("fecha")} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Hora</label>
                <input value={d.hora} onChange={set("hora")} placeholder="Ej: 9:00 a. m." className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Lugar</label>
              <input value={d.lugar} onChange={set("lugar")} placeholder="Dónde se hace" className={inputCls} />
            </div>
          </FormSection>

          <FormSection title="Experiencia">
            <div>
              <label className={labelCls}>Experiencia del catálogo</label>
              <select value={d.experienciaSlug} onChange={e => chooseExperience(e.target.value)} className={inputCls}>
                <option value="">Selecciona</option>
                {experiences.map(e => <option key={e.slug} value={e.slug}>{e.title}</option>)}
              </select>
              <p className={hintCls}>Al elegirla se llenan título, descripción, qué incluye y fotos. Después puedes editar todo.</p>
            </div>
            <div>
              <label className={labelCls}>Título en la portada *</label>
              <input value={d.titulo} onChange={set("titulo")} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Frase bajo el título</label>
              <textarea value={d.subtitulo} onChange={set("subtitulo")} rows={2} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Titular de la experiencia</label>
              <input value={d.gancho} onChange={set("gancho")} placeholder="Si lo dejas vacío, usa el título" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Descripción</label>
              <textarea value={d.descripcion} onChange={set("descripcion")} rows={4} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Qué van a vivir</label>
              <textarea value={d.vivir} onChange={set("vivir")} rows={4} className={inputCls + " resize-none"} placeholder={"Uno por línea.\nCon título: Pintan su máscara | Cada persona recibe…"} />
              <p className={hintCls}>Uno por línea. Para ponerle título usa una barra: Título | texto. Caben 3 o 4.</p>
            </div>
          </FormSection>

          <FormSection title="Fotos">
            {available.length === 0 ? (
              <p className="flex items-center gap-2 text-xs text-gray-400"><ImageIcon size={14} /> Elige una experiencia para ver sus fotos.</p>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {available.map(src => {
                    const idx = d.fotos.indexOf(src);
                    return (
                      <button key={src} type="button" onClick={() => togglePhoto(src)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${idx >= 0 ? "border-[#F4C430]" : "border-transparent opacity-50 hover:opacity-100"}`}
                        aria-pressed={idx >= 0}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                        {idx >= 0 && <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#F4C430] text-gray-900 text-[10px] font-black flex items-center justify-center">{idx + 1}</span>}
                      </button>
                    );
                  })}
                </div>
                <p className={hintCls}>Toca para quitar o agregar. El número es el orden: la 1 va en la portada. Máximo 8.</p>
              </>
            )}
          </FormSection>

          <FormSection title="Hacedor">
            <div>
              <label className={labelCls}>Quién la guía</label>
              <select value={d.hacedorSlug} onChange={e => chooseHacedor(e.target.value)} className={inputCls}>
                <option value="">Sin página de hacedor</option>
                {hacedores.map(h => <option key={h.slug} value={h.slug}>{h.name}</option>)}
              </select>
            </div>
            {d.hacedorNombre && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Nombre</label>
                    <input value={d.hacedorNombre} onChange={set("hacedorNombre")} className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Oficio y lugar</label>
                    <input value={d.hacedorRol} onChange={set("hacedorRol")} className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Presentación</label>
                  <textarea value={d.hacedorTexto} onChange={set("hacedorTexto")} rows={5} className={inputCls + " resize-none"} />
                  <p className={hintCls}>Viene de su perfil. Solo datos que el hacedor confirmó.</p>
                </div>
              </>
            )}
          </FormSection>

          <FormSection title="Paso a paso">
            <div>
              <label className={labelCls}>Titular</label>
              <input value={d.momentosTitulo} onChange={set("momentosTitulo")} placeholder="Ej: Dos horas, cuatro momentos" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Momentos</label>
              <textarea value={d.momentos} onChange={set("momentos")} rows={5} className={inputCls + " resize-none"} placeholder={"10 min | Bienvenida | Qué pasa en ese momento"} />
              <p className={hintCls}>Uno por línea: duración | nombre | qué pasa. Si queda vacío, esta página no sale.</p>
            </div>
            <div>
              <label className={labelCls}>Lo que van a aprender</label>
              <textarea value={d.aprender} onChange={set("aprender")} rows={4} className={inputCls + " resize-none"} placeholder="Uno por línea" />
            </div>
          </FormSection>

          <FormSection title="Qué incluye">
            <div>
              <label className={labelCls}>Incluye</label>
              <textarea value={d.incluye} onChange={set("incluye")} rows={5} className={inputCls + " resize-none"} placeholder="Uno por línea" />
            </div>
            <div>
              <label className={labelCls}>No incluye</label>
              <textarea value={d.noIncluye} onChange={set("noIncluye")} rows={3} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Para que salga bien</label>
              <textarea value={d.coordinar} onChange={set("coordinar")} rows={5} className={inputCls + " resize-none"} />
              <p className={hintCls}>Lo que hay que coordinar con el cliente. Título | texto.</p>
            </div>
          </FormSection>

          <FormSection title="Inversión">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Valor en pesos</label>
                <input value={d.valor} onChange={set("valor")} inputMode="numeric" placeholder="1400000" className={inputCls} />
                <p className={hintCls}>{formatValor(d.valor) ? `Se verá ${formatValor(d.valor)} COP` : "Solo números"}</p>
              </div>
              <div>
                <label className={labelCls}>Duración</label>
                <input value={d.duracion} onChange={set("duracion")} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Qué cubre el valor</label>
              <textarea value={d.valorNota} onChange={set("valorNota")} rows={2} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Forma de pago</label>
              <textarea value={d.formaPago} onChange={set("formaPago")} rows={2} className={inputCls + " resize-none"} />
            </div>
            <div>
              <label className={labelCls}>Documento de cobro</label>
              <input value={d.documento} onChange={set("documento")} placeholder="Ej: Cuenta de cobro CC-2026-002" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Siguientes pasos</label>
              <textarea value={d.pasos} onChange={set("pasos")} rows={4} className={inputCls + " resize-none"} />
            </div>
          </FormSection>
        </div>

        {/* Vista previa: en pantalla va reducida; al imprimir sale a tamaño real */}
        <div ref={previewRef} className="pp-preview bg-gray-200/70 rounded-2xl border border-gray-200 p-6 overflow-auto xl:max-h-[calc(100vh-190px)]">
          <div className="pp-zoom">
            <ProposalDoc d={d} />
          </div>
        </div>
      </div>
    </div>
  );
}
