import path from "path";
import { spawn } from "child_process";
import { createId } from "@/lib/utils";
import { upsertJob } from "@/lib/db/repository";
import type { ProcessingJob } from "@/types";

export async function enqueueExportJob(projectId: string, clipId: string) {
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

  const tsxCli = path.join(process.cwd(), "node_modules", "tsx", "dist", "cli.mjs");
  const worker = path.join(process.cwd(), "scripts", "export-worker.ts");
  const child = spawn(process.execPath, [tsxCli, worker, job.id], {
    detached: true,
    stdio: "ignore"
  });

  child.unref();
  return job;
}
