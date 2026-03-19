import { Film, FolderKanban, Rocket, Zap } from "lucide-react";
import type { DashboardStats } from "@/types";
import { Card } from "@/components/shared/card";

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  const items = [
    { label: "Projects", value: stats.totalProjects, icon: FolderKanban },
    { label: "Generated clips", value: stats.totalClips, icon: Film },
    { label: "Average viral score", value: `${stats.averageViralScore}/100`, icon: Zap },
    { label: "Active exports", value: stats.activeExports, icon: Rocket }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <Card key={item.label}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-400">{item.label}</p>
            <item.icon className="h-5 w-5 text-cyan-300" />
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
