"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../lib/supabase-client";
import {
  Star, Users, Map, ArrowRight, Activity,
  BookOpen, Building2, MessageSquare, ClipboardList,
  TrendingUp, Bell,
} from "lucide-react";
import { isSupabaseConfigured } from "../../lib/supabase";

interface StatCard {
  label: string;
  value: number | string;
  sublabel: string;
  icon: React.ReactNode;
  href: string;
  colorClass: string;
  accent: string;
}

interface Notification {
  label: string;
  count: number;
  href: string;
  color: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    experiencias: 0,
    hacedores: 0,
    mapPoints: 0,
    relatos: 0,
    empresas: 0,
    contacto: 0,
    postulaciones: 0,
    // nuevos sin revisar
    newEmpresas: 0,
    newContacto: 0,
    newPostulaciones: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    const cfg = isSupabaseConfigured();
    setConfigured(cfg);

    async function load() {
      if (!cfg) { setIsLoading(false); return; }

      const supabase = createClient();
      try {
        const [
          { count: expCount },
          { count: hacCount },
          { count: mapCount },
          { count: relCount },
          { count: empCount },
          { count: ctCount },
          { count: postCount },
          { count: newEmpCount },
          { count: newCtCount },
          { count: newPostCount },
        ] = await Promise.all([
          supabase.from("experiencias").select("*", { count: "exact", head: true }),
          supabase.from("hacedores").select("*", { count: "exact", head: true }),
          supabase.from("mapa_cultural").select("*", { count: "exact", head: true }),
          supabase.from("relatos").select("*", { count: "exact", head: true }),
          supabase.from("empresas_interesadas").select("*", { count: "exact", head: true }),
          supabase.from("formularios_contacto").select("*", { count: "exact", head: true }),
          supabase.from("postulaciones").select("*", { count: "exact", head: true }),
          supabase.from("empresas_interesadas").select("*", { count: "exact", head: true }).eq("status", "nuevo"),
          supabase.from("formularios_contacto").select("*", { count: "exact", head: true }).eq("status", "nuevo"),
          supabase.from("postulaciones").select("*", { count: "exact", head: true }).eq("status", "nueva"),
        ]);

        setStats({
          experiencias: expCount ?? 0,
          hacedores: hacCount ?? 0,
          mapPoints: mapCount ?? 0,
          relatos: relCount ?? 0,
          empresas: empCount ?? 0,
          contacto: ctCount ?? 0,
          postulaciones: postCount ?? 0,
          newEmpresas: newEmpCount ?? 0,
          newContacto: newCtCount ?? 0,
          newPostulaciones: newPostCount ?? 0,
        });
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, []);

  const contentCards: StatCard[] = [
    {
      label: "Experiencias",
      value: isLoading ? "—" : stats.experiencias,
      sublabel: "publicadas",
      icon: <Star size={20} />,
      href: "/admin/experiencias",
      colorClass: "bg-amber-50 text-amber-600",
      accent: "#F59E0B",
    },
    {
      label: "Hacedores",
      value: isLoading ? "—" : stats.hacedores,
      sublabel: "activos",
      icon: <Users size={20} />,
      href: "/admin/hacedores",
      colorClass: "bg-blue-50 text-blue-600",
      accent: "#3B82F6",
    },
    {
      label: "Relatos",
      value: isLoading ? "—" : stats.relatos,
      sublabel: "publicados",
      icon: <BookOpen size={20} />,
      href: "/admin/relatos",
      colorClass: "bg-violet-50 text-violet-600",
      accent: "#8B5CF6",
    },
    {
      label: "Mapa Cultural",
      value: isLoading ? "—" : stats.mapPoints,
      sublabel: "puntos visibles",
      icon: <Map size={20} />,
      href: "/admin/mapa-cultural",
      colorClass: "bg-emerald-50 text-emerald-600",
      accent: "#10B981",
    },
  ];

  const communityCards: StatCard[] = [
    {
      label: "Empresas",
      value: isLoading ? "—" : stats.empresas,
      sublabel: "interesadas",
      icon: <Building2 size={20} />,
      href: "/admin/empresas",
      colorClass: "bg-rose-50 text-rose-600",
      accent: "#F43F5E",
    },
    {
      label: "Contacto",
      value: isLoading ? "—" : stats.contacto,
      sublabel: "mensajes",
      icon: <MessageSquare size={20} />,
      href: "/admin/contacto",
      colorClass: "bg-cyan-50 text-cyan-600",
      accent: "#06B6D4",
    },
    {
      label: "Postulaciones",
      value: isLoading ? "—" : stats.postulaciones,
      sublabel: "recibidas",
      icon: <ClipboardList size={20} />,
      href: "/admin/postulaciones",
      colorClass: "bg-orange-50 text-orange-600",
      accent: "#F97316",
    },
  ];

  const notifications: Notification[] = [
    { label: "Empresas nuevas sin revisar", count: stats.newEmpresas, href: "/admin/empresas", color: "text-rose-600 bg-rose-50" },
    { label: "Mensajes de contacto nuevos", count: stats.newContacto, href: "/admin/contacto", color: "text-cyan-600 bg-cyan-50" },
    { label: "Postulaciones pendientes", count: stats.newPostulaciones, href: "/admin/postulaciones", color: "text-orange-600 bg-orange-50" },
  ].filter((n) => n.count > 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-outfit text-3xl font-black text-gray-900 tracking-tight">
            Panel de Control
          </h1>
          <p className="text-gray-400 mt-1 text-sm font-medium">
            Bienvenido a ComboXplora Admin · {new Date().toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-bold border ${configured ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
          {configured ? "● Supabase conectado" : "● Modo offline"}
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Bell size={16} className="text-[#F4C430]" />
            <h2 className="font-outfit text-sm font-black text-gray-900 uppercase tracking-wider">
              Requieren atención
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {notifications.map((n) => (
              <Link
                key={n.label}
                href={n.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:shadow-sm ${n.color}`}
              >
                <span>{n.label}</span>
                <span className="font-black text-lg ml-2">{n.count}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Content Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-gray-400" />
          <h2 className="font-outfit text-sm font-black text-gray-400 uppercase tracking-widest">
            Contenido
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {contentCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3 group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.colorClass}`}>
                {card.icon}
              </div>
              <div>
                <div className="font-outfit text-3xl font-black text-gray-900 leading-none">
                  {card.value}
                </div>
                <div className="text-xs font-bold text-gray-800 mt-1">{card.label}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{card.sublabel}</div>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-300 group-hover:text-gray-700 transition-colors mt-auto">
                Gestionar <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Community Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Activity size={16} className="text-gray-400" />
          <h2 className="font-outfit text-sm font-black text-gray-400 uppercase tracking-widest">
            Comunidad
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {communityCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-4 group"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${card.colorClass}`}>
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-outfit text-2xl font-black text-gray-900">{card.value}</div>
                <div className="text-sm font-bold text-gray-700">{card.label}</div>
                <div className="text-xs text-gray-400">{card.sublabel}</div>
              </div>
              <ArrowRight size={16} className="text-gray-200 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* Quick actions + Instructions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-[#F4C430]" />
            <h2 className="font-outfit text-base font-black text-gray-900">Acciones rápidas</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Nueva experiencia", href: "/admin/experiencias", color: "text-amber-700 bg-amber-50 hover:bg-amber-100" },
              { label: "Nuevo hacedor", href: "/admin/hacedores", color: "text-blue-700 bg-blue-50 hover:bg-blue-100" },
              { label: "Nuevo relato", href: "/admin/relatos", color: "text-violet-700 bg-violet-50 hover:bg-violet-100" },
              { label: "Punto en mapa", href: "/admin/mapa-cultural", color: "text-emerald-700 bg-emerald-50 hover:bg-emerald-100" },
              { label: "Ver postulaciones", href: "/admin/postulaciones", color: "text-orange-700 bg-orange-50 hover:bg-orange-100" },
              { label: "Ver mensajes", href: "/admin/contacto", color: "text-cyan-700 bg-cyan-50 hover:bg-cyan-100" },
            ].map((ql) => (
              <Link
                key={ql.label}
                href={ql.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-xs transition-all ${ql.color}`}
              >
                {ql.label}
                <ArrowRight size={12} />
              </Link>
            ))}
          </div>
        </div>

        <div className="bg-gray-950 rounded-2xl p-5 text-white">
          <h2 className="font-outfit text-base font-black mb-4 text-[#F4C430]">
            Guía rápida
          </h2>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              "Gestiona experiencias, hacedores y relatos en el menú de la izquierda.",
              "Activa/desactiva el toggle de visibilidad para controlar qué aparece en el sitio.",
              "Las postulaciones y formularios te llegan por correo automáticamente.",
              "Sube imágenes directamente desde los formularios de edición.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-[#F4C430] text-black flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
