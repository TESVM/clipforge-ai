import Link from "next/link";
import { Star } from "lucide-react";
import type { GeneratedClip } from "@/types";
import { ExportButton } from "@/components/dashboard/export-button";
import { Badge } from "@/components/shared/badge";
import { Button } from "@/components/shared/button";
import { Card } from "@/components/shared/card";
import { formatTimestamp } from "@/lib/utils";

export function ClipGrid({ clips }: { clips: GeneratedClip[] }) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      {clips.map((clip) => (
        <Card key={clip.id} className="overflow-hidden p-0">
          <div className="aspect-[16/9] bg-[linear-gradient(135deg,rgba(34,211,238,0.18),rgba(15,23,42,0.8),rgba(251,113,133,0.2))] p-5">
            <div className="flex h-full flex-col justify-between rounded-[28px] border border-white/10 bg-slate-950/60 p-5">
              <div className="flex items-center justify-between">
                <Badge label={`${clip.viralScore}/100 Viral Score`} />
                {clip.favorite ? <Star className="h-4 w-4 fill-amber-300 text-amber-300" /> : null}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{clip.platforms.join(" / ")}</p>
                <h3 className="mt-2 text-xl font-semibold text-white">{clip.title}</h3>
                <p className="mt-2 text-sm text-slate-300">{clip.hookText}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {clip.badges.map((badge) => (
                  <Badge key={badge} label={badge} tone={badge.includes("CTA") ? "warm" : "default"} />
                ))}
              </div>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>
                {formatTimestamp(clip.startMs)} - {formatTimestamp(clip.endMs)}
              </span>
              <span>{clip.aspectRatio}</span>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">{clip.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Button asChild variant="secondary">
                <Link href={`/dashboard/clips/${clip.id}`}>Edit clip</Link>
              </Button>
              <ExportButton clipId={clip.id} />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
