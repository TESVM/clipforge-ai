import path from "path";
import { spawn } from "child_process";
import { ensureClipExport } from "@/lib/video/export";
import { env } from "@/lib/env";
import { requireSupportedExportMode } from "@/lib/deployment";
import { getClip, getProjectByClipId, updateClip } from "@/lib/db/repository";
import { createId } from "@/lib/utils";
import { upsertJob } from "@/lib/db/repository";
import type { ProcessingJob } from "@/types";

export async function enqueueExportJob(projectId: string, clipId: string) {
  requireSupportedExportMode();
  const job: ProcessingJob = {
    id: createId("job"),
    projectId,
    clipId,
    type: "export",
    status: "queued",
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  await upsertJob(job);

  if (env.exportExecutionMode === "inline") {
    const clip = await getClip(clipId);
    const project = await getProjectByClipId(clipId);

    if (!clip || !project) {
      await upsertJob({
        ...job,
        status: "failed",
        error: "Clip or project not found.",
        updatedAt: new Date().toISOString()
      });
      return job;
    }

    try {
      await upsertJob({
        ...job,
        status: "generating",
        progress: 25,
        updatedAt: new Date().toISOString()
      });

      const rendered = await ensureClipExport(project, clip);
      await updateClip(project.id, clip.id, { exportUrl: rendered.publicPath });

      await upsertJob({
        ...job,
        status: "completed",
        progress: 100,
        outputUrl: rendered.publicPath,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      await upsertJob({
        ...job,
        status: "failed",
        error: error instanceof Error ? error.message : String(error),
        updatedAt: new Date().toISOString()
      });
    }

    return job;
  }

  if (env.exportExecutionMode === "external") {
    if (!env.externalExportWorkerUrl) {
      throw new Error(
        "EXTERNAL_EXPORT_WORKER_URL is required when EXPORT_EXECUTION_MODE=external."
      );
    }

    await fetch(env.externalExportWorkerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id })
    });

    return job;
  }

  const tsxCli = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
  const worker = path.join(process.cwd(), "scripts", "export-worker.ts");
  const child = spawn(process.execPath, [tsxCli, worker, job.id], {
    detached: true,
    stdio: "ignore"
  });

  child.unref();
  return job;
}
