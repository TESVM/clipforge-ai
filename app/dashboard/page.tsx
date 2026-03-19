import { ClipGrid } from "@/components/dashboard/clip-grid";
import { ProjectCard } from "@/components/dashboard/project-card";
import { ProjectIntakeForm } from "@/components/dashboard/project-intake-form";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Card } from "@/components/shared/card";
import { requireSession } from "@/lib/auth/session";
import { getDashboardData } from "@/lib/db/repository";

export default async function DashboardPage() {
  const session = await requireSession();
  const { projects, stats } = await getDashboardData(session.user.id);
  const recentClips = projects.flatMap((project) => project.clips).slice(0, 4);

  return (
    <DashboardShell userName={session.user.name ?? "Creator"}>
      <div className="space-y-6 py-2">
        <section>
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Dashboard</p>
          <h1 className="mt-3 text-4xl font-semibold text-white">Turn one long video into 10 polished short clips.</h1>
          <p className="mt-3 max-w-3xl text-slate-300">
            Upload a video, paste a YouTube link, or import a web-hosted source. ClipForge AI will score the best moments and package them for each platform.
          </p>
        </section>
        <StatsGrid stats={stats} />
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">New project</p>
              <h2 className="mt-2 text-2xl font-semibold text-white">Ingest and generate</h2>
            </div>
            <ProjectIntakeForm />
          </Card>
          <div className="space-y-6">
            {projects.slice(0, 2).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
        <section className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Top clips</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Recent high-scoring exports</h2>
          </div>
          <ClipGrid clips={recentClips} />
        </section>
      </div>
    </DashboardShell>
  );
}
