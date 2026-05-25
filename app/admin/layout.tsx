"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient } from "../../lib/supabase-client";
import {
  LayoutDashboard,
  Map,
  Users,
  Star,
  ExternalLink,
  Menu,
  X,
  ChevronRight,
  BookOpen,
  Building2,
  MessageSquare,
  ClipboardList,
  LogOut,
  User,
} from "lucide-react";

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
    items: [
      { href: "/admin", label: "Dashboard", icon: <LayoutDashboard size={17} />, exact: true },
    ],
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

function Sidebar({
  isOpen,
  onClose,
  userEmail,
  onLogout,
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
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-950 flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/8">
          <Link href="/admin" className="flex flex-col" onClick={onClose}>
            <span className="font-outfit text-lg font-black text-white tracking-tight">
              Combo<span className="text-[#F4C430]">Xplora</span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-0.5">
              Admin Panel
            </span>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-500 hover:text-white transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <p className="px-3 mb-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-gray-600">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isExact = item.exact
                    ? pathname === item.href
                    : pathname.startsWith(item.href) && item.href !== "/admin";
                  const active = item.exact
                    ? pathname === item.href
                    : isExact;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
                        ${active
                          ? "bg-[#F4C430] text-gray-900 shadow-sm"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                        }
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

        {/* Footer: user + logout */}
        <div className="border-t border-white/8 p-3 space-y-1">
          <Link
            href="/"
            target="_blank"
            onClick={onClose}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-500 hover:text-white hover:bg-white/5 transition-all duration-150"
          >
            <ExternalLink size={14} />
            Ver sitio web
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

function TopBar({
  onOpenMenu,
  onLogout,
}: {
  onOpenMenu: () => void;
  onLogout: () => void;
}) {
  const pathname = usePathname();
  const segment = pathname.split("/")[2] ?? "";
  const sectionLabel = SECTION_CRUMB_MAP[segment] ?? "";

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-5 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu size={19} />
        </button>

        <nav className="flex items-center gap-1.5 text-sm">
          <Link
            href="/admin"
            className={`font-semibold transition-colors ${
              pathname === "/admin"
                ? "text-gray-900 font-black"
                : "text-gray-400 hover:text-gray-700"
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
          <ExternalLink size={12} />
          Ver Sitio
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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 font-sans">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userEmail={userEmail}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-auto">
        <TopBar
          onOpenMenu={() => setSidebarOpen(true)}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-5 lg:p-7 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
