import Link from "next/link";
import { notFound } from "next/navigation";
import { ClipGrid } from "@/components/dashboard/clip-grid";
import { ExportButton } from "@/components/dashboard/export-button";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress";
import { requireSession } from "@/lib/auth/session";
import { getProject } from "@/lib/db/repository";

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ projectId: string }>;
}) {
  const session = await requireSession();
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  const progress =
    project.status === "queued" ? 12 : project.status === "analyzing" ? 44 : project.status === "generating" ? 78 : 100;

  return (
    <DashboardShell userName={session.user.name ?? "Creator"}>
      <div className="space-y-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Project</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{project.title}</h1>
            <p className="mt-3 max-w-3xl text-slate-300">{project.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge label={project.status} />
            <Button asChild variant="secondary">
              <Link href={`/api/projects/${project.id}/process`}>Re-run analysis</Link>
            </Button>
          </div>
        </div>
        <Card>
          <div className="grid gap-6 lg:grid-cols-3">
            <div>
              <p className="text-sm text-slate-400">Processing progress</p>
              <div className="mt-3">
                <ProgressBar value={progress} />
              </div>
              <p className="mt-3 text-sm text-slate-300">{project.clips.length || 10} clip slots ready for export.</p>
            </div>
            <div>
              <p className="text-sm text-slate-400">Platforms</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.targetPlatforms.map((platform) => (
                  <Badge key={platform} label={platform} />
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400">Duration presets</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.targetDurations.map((duration) => (
                  <Badge key={duration} label={`${duration}s`} tone="gold" />
                ))}
              </div>
            </div>
          </div>
        </Card>
        <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Generated clips</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">Top 10 ranked outputs</h2>
              </div>
              {project.clips[0] ? <ExportButton clipId={project.clips[0].id} /> : null}
            </div>
            <ClipGrid clips={project.clips} />
          </section>
          <div className="space-y-6">
            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Compare view</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Top ranked clip comparison</h2>
              <div className="mt-5 space-y-4">
                {project.clips
                  .filter((clip) => project.compareTopClipIds.includes(clip.id))
                  .map((clip) => (
                    <div key={clip.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-white">{clip.title}</p>
                        <Badge label={`${clip.viralScore}`} />
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {clip.badges.map((badge) => (
                          <Badge key={badge} label={badge} tone={badge.includes("Emotion") ? "warm" : "default"} />
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </Card>
            <Card>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">SEO and social package</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Post-ready metadata</h2>
              <div className="mt-5 space-y-4 text-sm text-slate-300">
                <p>Suggested title: {project.clips[0]?.socialPackage.title}</p>
                <p>Suggested caption: {project.clips[0]?.socialPackage.postText}</p>
                <p>Hashtags: {project.clips[0]?.socialPackage.hashtags.join(" ")}</p>
                <p>Posting note: {project.clips[0]?.socialPackage.platformSuggestion.instagramReels}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
