import Link from "next/link";
import type { Route } from "next";
import { BarChart3, Film, FolderKanban, Home, Rocket, Settings2 } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/shared/badge";

export function DashboardShell({
  children,
  userName
}: {
  children: ReactNode;
  userName: string;
}) {
  const nav: Array<{ href: Route; label: string; icon: typeof Home }> = [
    { href: "/dashboard", label: "Overview", icon: Home },
    { href: "/dashboard", label: "Projects", icon: FolderKanban },
    { href: "/dashboard", label: "Clips", icon: Film },
    { href: "/dashboard", label: "Analytics", icon: BarChart3 },
    { href: "/dashboard", label: "Exports", icon: Rocket },
    { href: "/dashboard", label: "Settings", icon: Settings2 }
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.12),transparent_20%),linear-gradient(180deg,#020617_0%,#0f172a_100%)] text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-4 lg:grid-cols-[260px_1fr] lg:px-6">
        <aside className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/70">ClipForge AI</p>
            <h1 className="mt-2 text-2xl font-semibold">Creator Console</h1>
            <p className="mt-2 text-sm text-slate-400">Turn one long-form video into 10 viral-ready clips.</p>
          </div>
          <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4">
            <p className="text-sm text-slate-300">Logged in as</p>
            <p className="mt-1 font-medium">{userName}</p>
            <div className="mt-3">
              <Badge label="Pro Plan" />
            </div>
          </div>
          <nav className="space-y-2">
            {nav.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <main>{children}</main>
      </div>
    </div>
  );
}
