import Link from "next/link";
import { ArrowRight, Clock4 } from "lucide-react";
import type { Project } from "@/types";
import { Badge } from "@/components/shared/badge";
import { Card } from "@/components/shared/card";
import { ProgressBar } from "@/components/shared/progress";
import { formatRelativeDate } from "@/lib/utils";

export function ProjectCard({ project }: { project: Project }) {
  const progress =
    project.status === "queued"
      ? 12
      : project.status === "analyzing"
        ? 42
        : project.status === "generating"
          ? 78
          : project.status === "completed"
            ? 100
            : 0;

  return (
    <Card className="rounded-[28px]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{project.sourceType}</p>
          <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-7 text-slate-300">{project.description}</p>
        </div>
        <Badge label={project.status} tone={project.status === "completed" ? "default" : "gold"} />
      </div>
      <div className="mt-6">
        <ProgressBar value={progress} />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-2">
          <Clock4 className="h-4 w-4" />
          Updated {formatRelativeDate(project.updatedAt)}
        </span>
        <span>{project.clips.length} clips</span>
        <span>{project.targetPlatforms.join(", ")}</span>
      </div>
      <Link
        href={`/dashboard/projects/${project.id}`}
        className="mt-6 inline-flex items-center text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
      >
        Open project
        <ArrowRight className="ml-2 h-4 w-4" />
      </Link>
    </Card>
  );
}
