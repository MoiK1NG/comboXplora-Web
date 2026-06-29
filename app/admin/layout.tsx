"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { createClient } from "../../lib/supabase-client";
import {
  LayoutDashboard, Map, Users, Star, ExternalLink,
  Menu, X, ChevronRight, BookOpen, Building2,
  MessageSquare, ClipboardList, LogOut, User,
  Upload, Clock, CheckCircle2, ChevronDown as ChevronDownIcon, Loader2,
} from "lucide-react";
import { ChangesProvider, useChanges } from "./changes-context";

/* ─────────────────────────────────────────────────────
   Tipos de navegación
───────────────────────────────────────────────────── */
interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  exact?: boolean;
}
interface NavSection {
  title: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    items: [{ href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} />, exact: true }],
  },
  {
    title: "Contenido",
    items: [
      { href: "/admin/experiencias", label: "Experiencias", icon: <Star size={17} /> },
      { href: "/admin/hacedores", label: "Hacedores", icon: <Users size={17} /> },
      { href: "/admin/relatos", label: "Relatos", icon: <BookOpen size={17} /> },
      { href: "/admin/mapa-cultural", label: "Mapa Cultural", icon: <Map size={17} /> },
    ],
  },
  {
    title: "Comunidad",
    items: [
      { href: "/admin/empresas", label: "Empresas", icon: <Building2 size={17} /> },
      { href: "/admin/contacto", label: "Contacto", icon: <MessageSquare size={17} /> },
      { href: "/admin/postulaciones", label: "Postulaciones", icon: <ClipboardList size={17} /> },
    ],
  },
];

const SECTION_CRUMB_MAP: Record<string, string> = {
  experiencias: "Experiencias",
  hacedores: "Hacedores",
  relatos: "Relatos",
  "mapa-cultural": "Mapa Cultural",
  empresas: "Empresas",
  contacto: "Contacto",
  postulaciones: "Postulaciones",
};

/* ─────────────────────────────────────────────────────
   Loader de pantalla completa (mientras se verifica sesión)
───────────────────────────────────────────────────── */
function AuthLoader() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center gap-6">
      <div className="relative w-52 h-16">
        <Image
          src="/logos/logo_principal.png"
          alt="ComboXplora"
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-[#F4C430]"
            style={{
              animation: `adminBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
            }}
          />
        ))}
      </div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
        Verificando sesión…
      </p>
      <style>{`
        @keyframes adminBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-7px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────────────── */
function Sidebar({
  isOpen, onClose, userEmail, onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-50 h-full w-64 bg-gray-950 flex flex-col transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
          <Link href="/admin" onClick={onClose} className="relative h-9 w-40">
            <Image
              src="/logos/logo_principal.png"
              alt="ComboXplora"
              fill
              className="object-contain object-left brightness-0 invert"
            />
          </Link>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white transition-colors p-1">
            <X size={18} />
          </button>
        </div>

        {/* Badge admin */}
        <div className="px-5 py-2 border-b border-white/8">
          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#F4C430]">
            Panel Administrativo
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-600">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href) && item.href !== "/admin";
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                        ${active
                          ? "bg-[#F4C430] text-gray-900 shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-white/5"}
                      `}
                    >
                      <span className={active ? "text-gray-900" : ""}>{item.icon}</span>
                      {item.label}
                      {active && <ChevronRight size={13} className="ml-auto opacity-50" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer: sitio + usuario */}
        <div className="border-t border-white/8 p-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink size={14} /> Ver sitio web
          </Link>
          {userEmail && (
            <div className="px-3 py-2.5 rounded-xl bg-white/5 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#F4C430]/20 flex items-center justify-center flex-shrink-0">
                <User size={13} className="text-[#F4C430]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-bold text-white truncate">{userEmail}</p>
                <p className="text-[10px] text-gray-600">Administrador</p>
              </div>
              <button
                onClick={onLogout}
                title="Cerrar sesión"
                className="text-gray-600 hover:text-red-400 transition-colors p-1"
              >
                <LogOut size={14} />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Top Bar
───────────────────────────────────────────────────── */
function TopBar({ onOpenMenu, onLogout }: { onOpenMenu: () => void; onLogout: () => void }) {
  const pathname = usePathname();
  const segment = pathname.split("/")[2] ?? "";
  const sectionLabel = SECTION_CRUMB_MAP[segment] ?? "";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
          <Menu size={19} />
        </button>
        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/admin"
            className={`font-semibold transition-colors ${
              pathname === "/admin" ? "text-gray-900 font-black" : "text-gray-400 hover:text-gray-700"
            }`}
          >
            Admin
          </Link>
          {sectionLabel && (
            <>
              <ChevronRight size={13} className="text-gray-300" />
              <span className="font-black text-gray-900">{sectionLabel}</span>
            </>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href="/"
          target="_blank"
          className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 text-xs font-bold uppercase tracking-widest transition-all"
        >
          <ExternalLink size={12} /> Ver Sitio
        </Link>
        <button
          onClick={onLogout}
          title="Cerrar sesión"
          className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  );
}

/* ─────────────────────────────────────────────────────
   Publish Bar — barra flotante con resumen de cambios
───────────────────────────────────────────────────── */
function PublishBar() {
  const { changes, clearChanges } = useChanges();
  const [publishing, setPublishing] = useState(false);
  const [published, setPublished] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const handlePublish = useCallback(async () => {
    setPublishing(true);
    try {
      await fetch("/api/admin/revalidate", { method: "POST" });
      setPublished(true);
      setTimeout(() => {
        setPublished(false);
        clearChanges();
      }, 3000);
    } catch {
      // silently ignore
    } finally {
      setPublishing(false);
    }
  }, [clearChanges]);

  if (changes.length === 0) return null;

  return (
    <>
      {/* Resumen modal */}
      {showSummary && (
        <div className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSummary(false)} />
          <div className="relative z-10 w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-outfit font-black text-gray-900 text-lg">Cambios pendientes</h3>
              <button onClick={() => setShowSummary(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X size={16} />
              </button>
            </div>
            <div className="px-6 py-4 max-h-72 overflow-y-auto space-y-2">
              {changes.map(c => (
                <div key={c.id} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F4C430] mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{c.description}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">{c.section}</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 flex-shrink-0">
                    <Clock size={10} />
                    {c.timestamp.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-gray-50 flex gap-3">
              <button
                onClick={handlePublish}
                disabled={publishing || published}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-sm transition-all disabled:opacity-60 shadow-sm"
              >
                {publishing ? <><Loader2 size={14} className="animate-spin" /> Publicando…</> :
                 published  ? <><CheckCircle2 size={14} /> ¡Publicado!</> :
                              <><Upload size={14} /> Publicar en el sitio</>}
              </button>
              <button onClick={() => setShowSummary(false)}
                className="px-5 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-white transition-all">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-between gap-4 bg-gray-950 text-white px-5 py-4 shadow-2xl border-t border-white/5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-2 h-2 rounded-full bg-[#F4C430] animate-pulse flex-shrink-0" />
          <p className="text-sm font-semibold truncate">
            {changes.length} cambio{changes.length > 1 ? "s" : ""} listo{changes.length > 1 ? "s" : ""} para publicar
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => setShowSummary(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-xl hover:bg-white/5"
          >
            Ver resumen <ChevronDownIcon size={12} />
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing || published}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F4C430] hover:bg-[#E3B520] text-gray-900 font-black text-xs transition-all disabled:opacity-60"
          >
            {publishing ? <><Loader2 size={13} className="animate-spin" /> Publicando…</> :
             published  ? <><CheckCircle2 size={13} /> ¡Publicado!</> :
                          <><Upload size={13} /> Publicar en el sitio →</>}
          </button>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────
   Root Layout
   IMPORTANTE: el login page está dentro de /admin/*
   entonces TAMBIÉN se renderiza con este layout.
   Solución: si estamos en /admin/login → solo renderizar
   {children}, sin auth gate ni sidebar.
───────────────────────────────────────────────────── */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  const [isAuthChecking, setIsAuthChecking] = useState(!isLoginPage);
  const [isAuthed, setIsAuthed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();

  useEffect(() => {
    if (isLoginPage) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserEmail(data.user.email ?? undefined);
        setIsAuthed(true);
      } else {
        router.replace("/admin/login");
      }
      setIsAuthChecking(false);
    });
  }, [isLoginPage, router]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  if (isLoginPage) return <>{children}</>;
  if (isAuthChecking) return <AuthLoader />;
  if (!isAuthed) return <AuthLoader />;

  return (
    <ChangesProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
        <div className="flex-1 flex flex-col min-w-0 overflow-auto pb-16">
          <TopBar onOpenMenu={() => setSidebarOpen(true)} onLogout={handleLogout} />
          <main className="flex-1 p-5 lg:p-7 max-w-full">
            {children}
          </main>
        </div>
      </div>
      <PublishBar />
    </ChangesProvider>
  );
}
