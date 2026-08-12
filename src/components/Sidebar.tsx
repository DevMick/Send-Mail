"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tableau de bord", icon: "⊞", section: "Principal" },
  { href: "/compose", label: "Composer un email", icon: "✏️", badge: "New", section: null },
  { href: "/templates", label: "Modèles de templates", icon: "📚", section: "Bibliothèque" },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-[260px] min-h-screen bg-slate-900 fixed top-0 left-0 z-50 flex flex-col">
      {/* Brand */}
      <div className="px-6 py-5 flex items-center gap-3 border-b border-white/[0.08]">
        <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
          ✉️
        </div>
        <div>
          <div className="text-slate-100 font-bold text-lg leading-tight tracking-tight">SendMail</div>
          <div className="text-slate-500 text-[11px] font-medium tracking-widest uppercase">Plateforme email</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 pt-4 flex-1">
        {links.map((link, i) => {
          const prevSection = i > 0 ? links[i - 1].section : null;
          const showSection = link.section && link.section !== prevSection;
          const isActive = path === link.href;

          return (
            <div key={link.href}>
              {showSection && (
                <div className="text-slate-500 text-[10px] font-bold tracking-widest uppercase px-3 pt-3 pb-1.5">
                  {link.section}
                </div>
              )}
              <Link
                href={link.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
                {link.badge && (
                  <span className="ml-auto bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            </div>
          );
        })}

        <div className="h-px bg-white/[0.06] mx-3 my-2" />
        <div className="text-slate-500 text-[10px] font-bold tracking-widest uppercase px-3 pt-1 pb-1.5">Configuration</div>

        <a href="#" className="sidebar-link">
          <span>⚙️</span> Paramètres SMTP
        </a>
        <a href="#" className="sidebar-link">
          <span>🛡️</span> Anti-spam
        </a>
      </nav>

      {/* SMTP status */}
      <div className="px-6 py-4 border-t border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_0_3px_rgba(74,222,128,0.2)] flex-shrink-0" />
          <div>
            <div className="text-slate-400 text-xs font-semibold">SMTP Hostinger</div>
            <div className="text-slate-600 text-[11px]">smtp.hostinger.com:465 · SSL</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
