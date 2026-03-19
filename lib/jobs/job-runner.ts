import type { ProcessingJob, ProjectStatus } from "@/types";
import { upsertJob, updateProject } from "@/lib/db/repository";
import { log } from "@/lib/logger";
import { createId } from "@/lib/utils";

export async function setProjectStatus(projectId: string, status: ProjectStatus, progress: number) {
  await updateProject(projectId, { status });
  const job: ProcessingJob = {
    id: createId("job"),
    projectId,
    type: "analysis",
    status,
    progress,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  await upsertJob(job);
  log("info", "Project status updated", { projectId, status, progress });
}
