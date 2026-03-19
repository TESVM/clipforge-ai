import { notFound } from "next/navigation";
import { ExportButton } from "@/components/dashboard/export-button";
import { ClipEditorForm } from "@/components/editor/clip-editor-form";
import { DashboardShell } from "@/components/layout/dashboard-shell";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { requireSession } from "@/lib/auth/session";
import { getClip } from "@/lib/db/repository";

export default async function ClipEditorPage({
  params
}: {
  params: Promise<{ clipId: string }>;
}) {
  const session = await requireSession();
  const { clipId } = await params;
  const clip = await getClip(clipId);

  if (!clip) {
    notFound();
  }

  return (
    <DashboardShell userName={session.user.name ?? "Creator"}>
      <div className="grid gap-6 py-2 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="overflow-hidden p-0">
          <div className="aspect-[9/16] bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(15,23,42,0.95),rgba(251,113,133,0.22))] p-6">
            <div className="flex h-full flex-col justify-between rounded-[32px] border border-white/10 bg-black/30 p-6">
              <div className="flex items-center justify-between">
                <Badge label={`${clip.viralScore}/100 Viral`} />
                <Badge label={clip.aspectRatio} tone="gold" />
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-slate-300">Hook overlay</p>
                <h1 className="mt-3 text-3xl font-semibold leading-tight text-white">{clip.hookText}</h1>
                <p className="mt-4 text-sm text-slate-300">{clip.ctaText}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Caption preview</p>
                <p className="mt-3 text-lg font-semibold text-white">
                  {clip.captions
                    .slice(0, 10)
                    .map((token) => token.text)
                    .join(" ")}
                </p>
              </div>
            </div>
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Clip editor</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Adjust title, CTA, timing, and export framing</h2>
            <div className="mt-6">
              <ClipEditorForm clip={clip} />
            </div>
          </Card>
          <Card>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Social package</p>
            <h2 className="mt-2 text-xl font-semibold text-white">Publishing metadata</h2>
            <div className="mt-5 space-y-3 text-sm text-slate-300">
              <p>Title: {clip.socialPackage.title}</p>
              <p>Post text: {clip.socialPackage.postText}</p>
              <p>Hashtags: {clip.socialPackage.hashtags.join(" ")}</p>
              <p>Best for TikTok: {clip.socialPackage.platformSuggestion.tiktok}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ExportButton clipId={clip.id} />
              <Button asChild variant="secondary">
                <a href={`/api/clips/${clip.id}/export?format=json`}>Create export job</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
