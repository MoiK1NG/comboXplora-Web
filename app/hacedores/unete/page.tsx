"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../../components/layouts/Navbar";
import { Footer } from "../../../components/layouts/Footer";
import {
  ClipboardList, Award, Rocket, CheckCircle, ChevronRight, Loader2, Send, Sparkles,
} from "lucide-react";

const EXPERIENCE_TYPES = [
  { value: "gastronomia", label: "Gastronomía" },
  { value: "musica", label: "Música" },
  { value: "artesanias", label: "Artesanías" },
  { value: "storytelling", label: "Storytelling / Relatos" },
  { value: "danza", label: "Danza" },
  { value: "arte", label: "Arte visual" },
  { value: "tradicion", label: "Tradición" },
  { value: "otro", label: "Otro" },
];

const STEPS = [
  {
    icon: <ClipboardList className="w-7 h-7 text-primary" />,
    title: "1. Cuéntanos tu saber",
    desc: "Qué haces, dónde lo haces y qué te gustaría compartir con quien visita Barranquilla.",
  },
  {
    icon: <Award className="w-7 h-7 text-teal-500" />,
    title: "2. Curaduría y co-creación",
    desc: "Nos sentamos contigo a darle forma a la experiencia y a fijar un precio justo por tu trabajo.",
  },
  {
    icon: <Rocket className="w-7 h-7 text-gray-900" />,
    title: "3. Al aire con el mundo",
    desc: "Publicamos tu experiencia en el catálogo y en el mapa, y empiezan a llegar reservas.",
  },
];

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5";

const EMPTY = {
  name: "", email: "", phone: "", neighborhood: "", experience_type: "",
  experience_title: "", experience_description: "", why_join: "", social_links: "",
};

export default function UneteHacedorPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setErrorMsg("Nombre y correo son obligatorios.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/postulacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} />
            Hacedores
          </span>
          <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6 text-balance">
            Haz parte de ComboXplora <br className="hidden sm:block" />
            <span className="text-primary">como hacedor</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            ¿Cocinas, tocas, tejes, cuentas o guardas una tradición de Barranquilla? Conviértela en una experiencia que viajeros y locales puedan vivir contigo.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-outfit text-2xl font-black text-gray-900 mb-3">Cómo funciona</h2>
              <p className="text-gray-500 leading-relaxed font-medium text-sm">
                No necesitas tener nada armado. Tú pones el saber; nosotros ponemos la curaduría, la difusión y las reservas.
              </p>
            </div>
            <div className="space-y-4">
              {STEPS.map(s => (
                <div key={s.title} className="bg-white rounded-3xl border border-gray-100 p-6 flex items-start gap-5 hover:shadow-lg transition-shadow">
                  <div className="p-3.5 bg-gray-50 rounded-2xl flex-shrink-0">{s.icon}</div>
                  <div>
                    <h3 className="font-outfit text-base font-black text-gray-900">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Conoce a quienes ya hacen parte en la página de <Link href="/hacedores" className="font-bold text-gray-700 underline underline-offset-4">hacedores</Link>.
              Si lo tuyo es un evento puntual, regístralo en el <Link href="/postula-tu-experiencia" className="font-bold text-gray-700 underline underline-offset-4">mapa cultural</Link>.
            </p>
          </div>

          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h3 className="font-outfit text-xl font-black text-gray-900">¡Recibimos tu solicitud!</h3>
                <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                  La revisamos con calma y te contactamos en los próximos días para conocerte y darle forma a tu experiencia.
                </p>
                <button onClick={() => { setForm(EMPTY); setStatus("idle"); }} className="text-sm font-bold text-emerald-700 hover:underline">
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 text-white rounded-3xl p-7 sm:p-8 shadow-2xl">
                <h3 className="font-outfit text-xl font-black mb-1 leading-tight">Cuéntanos de ti</h3>
                <p className="text-gray-400 text-sm mb-6">Cinco minutos. Lo demás lo armamos juntos.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelCls} htmlFor="name">Nombre completo *</label>
                    <input id="name" value={form.name} onChange={set("name")} required placeholder="Tu nombre" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} htmlFor="email">Correo *</label>
                      <input id="email" type="email" value={form.email} onChange={set("email")} required placeholder="tu@correo.com" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="phone">Teléfono o WhatsApp</label>
                      <input id="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+57 300 000 0000" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls} htmlFor="neighborhood">Barrio donde la harías</label>
                      <input id="neighborhood" value={form.neighborhood} onChange={set("neighborhood")} placeholder="Barrio Abajo, Rebolo…" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls} htmlFor="experience_type">Tipo</label>
                      <select id="experience_type" value={form.experience_type} onChange={set("experience_type")} className={inputCls}>
                        <option value="">Selecciona</option>
                        {EXPERIENCE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="experience_title">Cómo llamarías tu experiencia</label>
                    <input id="experience_title" value={form.experience_title} onChange={set("experience_title")} placeholder="Ej: Taller de tambores en el patio de mi casa" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="experience_description">En qué consiste</label>
                    <textarea id="experience_description" value={form.experience_description} onChange={set("experience_description")} rows={3} placeholder="Qué harían las personas contigo, cuánto dura, qué se llevan…" className={inputCls + " resize-none"} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="why_join">Por qué quieres hacer parte</label>
                    <textarea id="why_join" value={form.why_join} onChange={set("why_join")} rows={2} placeholder="Lo que tú quieras contarnos" className={inputCls + " resize-none"} />
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="social_links">Instagram, TikTok o página web</label>
                    <input id="social_links" value={form.social_links} onChange={set("social_links")} placeholder="@tuusuario o un enlace" className={inputCls} />
                  </div>

                  {errorMsg && <p className="text-xs text-red-400 font-medium" role="alert">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-black text-sm rounded-xl hover:bg-white hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : <><Send size={15} /> Quiero ser hacedor <ChevronRight size={14} /></>}
                  </button>
                  <p className="text-[10px] text-gray-500 text-center font-medium">
                    Revisamos cada solicitud a mano. <Link href="/tratamiento-de-datos" className="underline">Tratamiento de datos</Link>.
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
