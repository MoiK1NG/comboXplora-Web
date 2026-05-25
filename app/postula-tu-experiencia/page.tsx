"use client";

import { useState } from "react";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import {
  ClipboardList, Award, Rocket, CheckCircle, ChevronRight,
  Loader2, Send,
} from "lucide-react";

const EXPERIENCE_TYPES = [
  { value: "gastronomia", label: "Gastronomía" },
  { value: "musica", label: "Música" },
  { value: "artesanias", label: "Artesanías" },
  { value: "storytelling", label: "Storytelling / Relatos" },
  { value: "danza", label: "Danza" },
  { value: "otro", label: "Otro" },
];

export default function PostulaExperienciaPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    neighborhood: "",
    experience_type: "",
    experience_title: "",
    experience_description: "",
    why_join: "",
    social_links: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) {
      setErrorMsg("Nombre y email son obligatorios.");
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
      if (!res.ok) throw new Error(data.error || "Error al enviar.");
      setStatus("success");
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error al enviar.");
      setStatus("error");
    }
  }

  const steps = [
    {
      icon: <ClipboardList className="w-7 h-7 text-primary animate-pulse" />,
      title: "1. Envía tu propuesta",
      desc: "Cuéntanos sobre tu taller, recorrido o saber tradicional en pocos minutos.",
    },
    {
      icon: <Award className="w-7 h-7 text-teal-500 animate-pulse" />,
      title: "2. Curaduría y Co-creación",
      desc: "Nos conectamos contigo para perfeccionar la experiencia y fijar precios justos.",
    },
    {
      icon: <Rocket className="w-7 h-7 text-gray-900 animate-bounce" />,
      title: "3. ¡Al aire con el mundo!",
      desc: "Publicamos tu experiencia para que viajeros comiencen a reservar.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC] font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <CheckCircle size={14} />
            Únete a ComboXplora
          </span>
          <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6">
            Postula tu <br />
            <span className="text-primary">Experiencia Cultural</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            ¿Eres un hacedor local, artista o guardián de la tradición en Barranquilla? Comparte tu saber con el mundo.
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Steps */}
          <div className="lg:col-span-3 space-y-8">
            <div>
              <h2 className="font-outfit text-2xl font-black text-gray-900 mb-3">El proceso de curaduría</h2>
              <p className="text-gray-500 leading-relaxed font-medium text-sm">
                Cada experiencia pasa por un proceso de curaduría para garantizar autenticidad y calidad.
              </p>
            </div>
            <div className="space-y-4">
              {steps.map((s, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-gray-100 p-6 flex items-start gap-5 hover:shadow-lg transition-shadow">
                  <div className="p-3.5 bg-gray-50 rounded-2xl">{s.icon}</div>
                  <div>
                    <h3 className="font-outfit text-base font-black text-gray-900">{s.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mt-1">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-2 sticky top-24">
            {status === "success" ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle size={24} className="text-emerald-600" />
                </div>
                <h3 className="font-outfit text-xl font-black text-gray-900">¡Postulación recibida!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Revisaremos tu propuesta manualmente y nos comunicaremos contigo en los próximos días.
                </p>
                <button
                  onClick={() => { setForm({ name: "", email: "", phone: "", neighborhood: "", experience_type: "", experience_title: "", experience_description: "", why_join: "", social_links: "" }); setStatus("idle"); }}
                  className="text-sm font-bold text-emerald-600 hover:underline"
                >
                  Enviar otra postulación
                </button>
              </div>
            ) : (
              <div className="bg-gray-900 text-white rounded-3xl p-7 shadow-2xl">
                <h3 className="font-outfit text-xl font-black mb-6 leading-tight">
                  Completa el formulario
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nombre */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      value={form.name}
                      onChange={set("name")}
                      required
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all"
                    />
                  </div>

                  {/* Email + Teléfono */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email *</label>
                      <input type="email" value={form.email} onChange={set("email")} required placeholder="tú@email.com" className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Teléfono</label>
                      <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+57..." className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all" />
                    </div>
                  </div>

                  {/* Barrio + Tipo */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Barrio</label>
                      <input value={form.neighborhood} onChange={set("neighborhood")} placeholder="Barrio Abajo..." className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Tipo</label>
                      <select value={form.experience_type} onChange={set("experience_type")} className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all">
                        <option value="">Selecciona</option>
                        {EXPERIENCE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Título de la experiencia */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Título de tu experiencia</label>
                    <input value={form.experience_title} onChange={set("experience_title")} placeholder="Ej: Taller de tambores vallenatos" className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all" />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Descripción breve</label>
                    <textarea value={form.experience_description} onChange={set("experience_description")} rows={3} placeholder="¿En qué consiste tu experiencia?" className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all resize-none" />
                  </div>

                  {/* Redes sociales */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Instagram / TikTok / Web</label>
                    <input value={form.social_links} onChange={set("social_links")} placeholder="@tuusuario o enlace..." className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-white/10 text-white placeholder-gray-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#F4C430]/40 focus:border-[#F4C430]/50 transition-all" />
                  </div>

                  {errorMsg && (
                    <p className="text-xs text-red-400 font-medium">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-black font-black text-sm rounded-xl hover:bg-white hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                  >
                    {status === "loading" ? (
                      <><Loader2 size={16} className="animate-spin" /> Enviando...</>
                    ) : (
                      <><Send size={15} /> Postular mi experiencia <ChevronRight size={14} /></>
                    )}
                  </button>

                  <p className="text-[10px] text-gray-600 text-center font-medium">
                    * Revisión manual antes de publicación
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
