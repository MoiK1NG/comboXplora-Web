"use client";

import Link from "next/link";
import { Navbar } from "../../components/layouts/Navbar";
import { Footer } from "../../components/layouts/Footer";
import { ClipboardList, Award, Rocket, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <ClipboardList className="w-7 h-7 text-primary" />,
    title: "1. Registra tu evento",
    desc: "Qué es, cuándo, dónde y cómo es el lugar. Te toma cinco minutos.",
  },
  {
    icon: <Award className="w-7 h-7 text-teal-500" />,
    title: "2. Lo revisamos",
    desc: "Confirmamos fecha y ubicación. Si falta algo, te escribimos.",
  },
  {
    icon: <Rocket className="w-7 h-7 text-gray-900" />,
    title: "3. Sale en el mapa y la agenda",
    desc: "Con su propia página para que lo compartas por WhatsApp e Instagram.",
  },
];

export default function PostulaExperienciaPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFC] font-sans">
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />
      <Navbar />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <div className="max-w-4xl mx-auto px-6 text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <CheckCircle size={14} />
            Mapa cultural
          </span>
          <h1 className="font-outfit text-4xl sm:text-6xl font-black text-gray-900 tracking-tight leading-[0.95] mb-6 text-balance">
            Registra tu evento <br className="hidden sm:block" />
            <span className="text-primary">en el mapa cultural</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">
            ¿Organizas un concierto, una obra, un taller o una feria en Barranquilla? Regístralo y lo publicamos gratis en la agenda y en el mapa.
          </p>
        </div>

        {/* Content grid */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
          {/* Left: Steps */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-outfit text-2xl font-black text-gray-900 mb-3">Cómo funciona</h2>
              <p className="text-gray-500 leading-relaxed font-medium text-sm">
                Revisamos cada evento antes de publicarlo para que la agenda sea confiable.
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
            <p className="text-xs text-gray-400 leading-relaxed">
              ¿Eres hacedor y quieres ofrecer tu propia experiencia con nosotros? Eso es otra cosa:{" "}
              <Link href="/hacedores/unete" className="font-bold text-gray-700 underline underline-offset-4">únete como hacedor</Link>.
            </p>
          </div>

          {/* Right: Google Form embed */}
          <div className="lg:col-span-3">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 bg-white">
              <iframe
                src="https://docs.google.com/forms/d/e/1FAIpQLSclTCFuFQk-e8N2_6LlFEj5YY1zlEZ1G7XLmjo6OGDwl-kPuw/viewform?embedded=true"
                width="100%"
                height="2053"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title="Postula tu experiencia"
                className="block w-full"
              >
                Cargando…
              </iframe>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
