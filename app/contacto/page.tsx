"use client";

import { useState } from "react";
import Link from "next/link";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { Mail, MessageCircle, CheckCircle, Loader2, Send, ChevronRight, Building2, Sparkles, CalendarPlus } from "lucide-react";
import { WHATSAPP_NUMBER } from "../../lib/whatsapp";

const CONTACT_EMAIL = "comboxplora@gmail.com";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, tengo una pregunta sobre ComboXplora.")}`;

const SUBJECTS = [
  "Quiero reservar una experiencia",
  "Tengo una pregunta",
  "Prensa o medios",
  "Otro",
];

const SHORTCUTS = [
  { href: "/empresas", icon: <Building2 size={18} />, title: "¿Escribes de una empresa?", desc: "Experiencias para equipos, patrocinios y alianzas." },
  { href: "/hacedores/unete", icon: <Sparkles size={18} />, title: "¿Eres hacedor?", desc: "Haz parte de ComboXplora con tu saber." },
  { href: "/postula-tu-experiencia", icon: <CalendarPlus size={18} />, title: "¿Organizas un evento?", desc: "Regístralo en el mapa y la agenda cultural." },
];

const inputCls =
  "w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all";
const labelCls = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5";

const EMPTY = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactoPage() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Nombre, correo y mensaje son obligatorios.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
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
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          <div className="lg:col-span-2">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#B8860B] mb-3">Contacto</p>
            <h1 className="font-outfit text-4xl sm:text-5xl font-black text-gray-900 tracking-tight leading-[0.95] text-balance">
              Hablemos de <span className="text-primary">Barranquilla</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-gray-500 leading-relaxed">
              Escríbenos por donde te quede más fácil. Respondemos en máximo dos días hábiles.
            </p>

            <div className="mt-8 space-y-3">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-[#25D366] hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-shrink-0"><MessageCircle size={20} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">WhatsApp</p>
                  <p className="font-bold text-gray-900">+57 312 247 5789</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-900 transition-colors" />
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 hover:border-gray-900 hover:shadow-md transition-all group">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-[#B8860B] flex items-center justify-center flex-shrink-0"><Mail size={20} /></div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Correo</p>
                  <p className="font-bold text-gray-900 truncate">{CONTACT_EMAIL}</p>
                </div>
                <ChevronRight size={16} className="ml-auto text-gray-300 group-hover:text-gray-900 transition-colors" />
              </a>
            </div>

            <ul className="mt-8 space-y-2">
              {SHORTCUTS.map(s => (
                <li key={s.href}>
                  <Link href={s.href} className="flex items-start gap-3 rounded-2xl p-3 -mx-3 hover:bg-gray-50 transition-colors group">
                    <span className="mt-0.5 text-gray-400 group-hover:text-gray-900 transition-colors">{s.icon}</span>
                    <span>
                      <span className="block text-sm font-bold text-gray-900">{s.title}</span>
                      <span className="block text-sm text-gray-500">{s.desc}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            {status === "success" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h2 className="font-outfit text-xl font-black text-gray-900">Mensaje recibido</h2>
                <p className="text-gray-600 text-sm leading-relaxed max-w-md mx-auto">
                  Te respondemos al correo que nos dejaste en máximo dos días hábiles.
                </p>
                <button onClick={() => { setForm(EMPTY); setStatus("idle"); }} className="text-sm font-bold text-emerald-700 hover:underline">
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 text-white rounded-3xl p-7 sm:p-8 shadow-2xl">
                <h2 className="font-outfit text-xl font-black mb-6 leading-tight">Déjanos tu mensaje</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={labelCls} htmlFor="name">Nombre *</label>
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
                  <div>
                    <label className={labelCls} htmlFor="subject">Motivo</label>
                    <select id="subject" value={form.subject} onChange={set("subject")} className={inputCls}>
                      <option value="">Selecciona</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls} htmlFor="message">Mensaje *</label>
                    <textarea id="message" value={form.message} onChange={set("message")} required rows={5} placeholder="Cuéntanos en qué te ayudamos" className={inputCls + " resize-none"} />
                  </div>

                  {errorMsg && <p className="text-xs text-red-400 font-medium" role="alert">{errorMsg}</p>}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-black text-sm rounded-xl hover:bg-white hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {status === "loading" ? <><Loader2 size={16} className="animate-spin" /> Enviando…</> : <><Send size={15} /> Enviar mensaje</>}
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
