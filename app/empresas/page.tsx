"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import {
  Building2, Users, Handshake, HeartHandshake, Megaphone, Mail, MessageCircle,
  CheckCircle, Loader2, Send, ChevronRight,
} from "lucide-react";
import { WHATSAPP_NUMBER } from "../../lib/whatsapp";

const CONTACT_EMAIL = "comboxplora@gmail.com";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, escribo de parte de una empresa interesada en trabajar con ComboXplora.")}`;

// Los valores coinciden con la tabla empresas_interesadas y con el panel del admin
const INTEREST_OPTIONS = [
  { value: "booking_group", label: "Experiencia para mi equipo" },
  { value: "sponsorship", label: "Patrocinar experiencias o eventos" },
  { value: "partnership", label: "Alianza con ComboXplora" },
  { value: "csr", label: "Programa de responsabilidad social" },
  { value: "other", label: "Otro" },
];

const BUDGET_OPTIONS = [
  "Menos de $1.000.000",
  "$1.000.000 a $3.000.000",
  "$3.000.000 a $10.000.000",
  "Más de $10.000.000",
  "Aún no lo sé",
];

const OFFERS = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Experiencias para equipos",
    desc: "Talleres y recorridos con hacedores locales para integrar a tu equipo, recibir a un cliente o cerrar una jornada. Desde 8 personas, en Barranquilla.",
  },
  {
    icon: <Megaphone className="w-6 h-6" />,
    title: "Patrocinio con nombre propio",
    desc: "Tu marca acompaña una experiencia o un evento del mapa cultural. Visibilidad en la página del evento, en la agenda y en nuestras redes.",
  },
  {
    icon: <Handshake className="w-6 h-6" />,
    title: "Alianzas",
    desc: "Hoteles, agencias, universidades y espacios culturales que quieren ofrecer experiencias auténticas a su gente o a sus visitantes.",
  },
  {
    icon: <HeartHandshake className="w-6 h-6" />,
    title: "Responsabilidad social",
    desc: "Programas que fortalecen el oficio de hacedores de los barrios: formación, equipamiento o compra directa de sus experiencias.",
  },
];

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5";

const EMPTY = {
  company_name: "", contact_name: "", email: "", phone: "", website: "",
  interest_type: "", num_people: "", preferred_date: "", budget_range: "", message: "",
};

export default function EmpresasPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.company_name.trim() || !form.contact_name.trim() || !form.email.trim()) {
      setErrorMsg("Empresa, persona de contacto y correo son obligatorios.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/empresa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          num_people: form.num_people ? Number(form.num_people) : undefined,
          interest_type: form.interest_type || undefined,
          budget_range: form.budget_range || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo enviar.");
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "No se pudo enviar.");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC] font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Encabezado */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Building2 size={14} />
            Para empresas
          </span>
          <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6 text-balance">
            Lleva la cultura de Barranquilla <br className="hidden sm:block" />
            <span className="text-primary">a tu empresa</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Experiencias con hacedores locales para tu equipo, patrocinios con impacto real en los barrios y alianzas que conectan tu marca con la ciudad.
          </p>
        </div>

        {/* Qué ofrecemos */}
        <section className="max-w-6xl mx-auto px-6 mb-20" aria-labelledby="ofrecemos">
          <h2 id="ofrecemos" className="sr-only">Qué ofrecemos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {OFFERS.map(o => (
              <div key={o.title} className="bg-white rounded-3xl border border-gray-100 p-7 flex items-start gap-5 hover:shadow-lg transition-shadow">
                <div className="p-3.5 bg-primary/10 text-[#B8860B] rounded-2xl flex-shrink-0">{o.icon}</div>
                <div>
                  <h3 className="font-outfit text-lg font-black text-gray-900 mb-1.5">{o.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{o.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Por qué */}
        <section className="max-w-6xl mx-auto px-6 mb-20">
          <div className="bg-gray-900 rounded-[2.5rem] px-8 py-10 sm:px-12 sm:py-14 text-white grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-1">
              <h2 className="font-outfit text-3xl font-black leading-tight text-balance">Por qué trabajar con nosotros</h2>
            </div>
            <ul className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <li>
                <p className="font-outfit text-xl font-black text-primary mb-1">Gente real</p>
                <p className="text-gray-400 leading-relaxed">Cada experiencia la guía quien la vive: matronas, picoteros, artesanos y músicos de los barrios.</p>
              </li>
              <li>
                <p className="font-outfit text-xl font-black text-primary mb-1">Impacto directo</p>
                <p className="text-gray-400 leading-relaxed">Lo que paga tu empresa llega a los hacedores. Te contamos a quién y cómo.</p>
              </li>
              <li>
                <p className="font-outfit text-xl font-black text-primary mb-1">Sin complicarte</p>
                <p className="text-gray-400 leading-relaxed">Nosotros coordinamos lugar, materiales y logística. Tú llegas con tu equipo.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* Contacto + formulario */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-outfit text-2xl font-black text-gray-900 mb-3">Hablemos</h2>
              <p className="text-gray-500 leading-relaxed font-medium text-sm">
                Escríbenos directo o déjanos tus datos y te contactamos en máximo dos días hábiles.
              </p>
            </div>
            <div className="space-y-3">
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#25D366] hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0"><MessageCircle size={20} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp</p>
                  <p className="font-bold text-gray-900">+57 312 247 5789</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-900 transition-colors" />
              </a>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=Empresa interesada en ComboXplora`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-900 hover:shadow-md transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-[#B8860B] flex items-center justify-center flex-shrink-0"><Mail size={20} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Correo</p>
                  <p className="font-bold text-gray-900 truncate">{CONTACT_EMAIL}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-900 transition-colors" />
              </a>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              ¿Quieres ver primero qué hacemos? Mira el <Link href="/experiencias" className="font-bold text-gray-700 underline underline-offset-4">catálogo de experiencias</Link> o la <Link href="/eventos" className="font-bold text-gray-700 underline underline-offset-4">agenda cultural</Link>.
            </p>
          </div>

          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h3 className="font-outfit text-xl font-black text-gray-900">Recibimos tus datos</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                  Te escribimos en máximo dos días hábiles. Si prefieres, adelántate por WhatsApp.
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-bold text-emerald-700 hover:underline">
                  <MessageCircle size={14} /> Escribir por WhatsApp
                </a>
              </div>
            ) : (
              <div className="bg-gray-900 text-white rounded-3xl p-7 sm:p-8 shadow-2xl">
                <h3 className="font-outfit text-xl font-black mb-1 leading-tight">Déjanos tus datos</h3>
                <p className="text-gray-400 text-sm mb-6">Cuanto más nos cuentes, más rápido te proponemos algo concreto.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} htmlFor="company_name">Empresa *</label>
                      <input id="company_name" value={form.company_name} onChange={set("company_name")} required placeholder="Nombre de la empresa" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="contact_name">Persona de contacto *</label>
                      <input id="contact_name" value={form.contact_name} onChange={set("contact_name")} required placeholder="Tu nombre" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} htmlFor="email">Correo *</label>
                      <input id="email" type="email" value={form.email} onChange={set("email")} required placeholder="nombre@empresa.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="phone">Teléfono o WhatsApp</label>
                      <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+57 300 000 0000" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} htmlFor="interest_type">Qué te interesa</label>
                      <select id="interest_type" value={form.interest_type} onChange={set("interest_type")} className={inputCls}>
                        <option value="">Selecciona</option>
                        {INTEREST_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="website">Sitio web o Instagram</label>
                      <input id="website" value={form.website} onChange={set("website")} placeholder="empresa.com o @empresa" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className={labelCls} htmlFor="num_people">Personas</label>
                      <input id="num_people" type="number" min={1} value={form.num_people} onChange={set("num_people")} placeholder="Ej: 20" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="preferred_date">Fecha tentativa</label>
                      <input id="preferred_date" value={form.preferred_date} onChange={set("preferred_date")} placeholder="Ej: marzo" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="budget_range">Presupuesto</label>
                      <select id="budget_range" value={form.budget_range} onChange={set("budget_range")} className={inputCls}>
                        <option value="">Selecciona</option>
                        {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="message">Cuéntanos qué tienes en mente</label>
                    <textarea id="message" value={form.message} onChange={set("message")} rows={4} placeholder="Qué buscan, para quién y cuándo…" className={inputCls + " resize-none"} />
                  </div>

                  {errorMsg && <p className="text-xs text-red-400 font-medium" role="alert">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-black text-sm rounded-xl hover:bg-white hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : <><Send size={15} /> Enviar</>}
                  </button>
                  <p className="text-[10px] text-gray-500 text-center font-medium">
                    Usamos tus datos solo para responderte. <Link href="/tratamiento-de-datos" className="underline">Tratamiento de datos</Link>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
