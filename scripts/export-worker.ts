import { ensureClipExport } from "../lib/video/export";
import { getClip, getJob, getProjectByClipId, updateClip, upsertJob } from "../lib/db/repository";

async function main() {
  const jobId = process.argv[2];

  if (!jobId) {
    throw new Error("Missing export job id.");
  }

  const job = await getJob(jobId);
  if (!job || !job.clipId) {
    throw new Error("Export job not found.");
  }

  await upsertJob({
    ...job,
    status: "generating",
    progress: 25,
    updatedAt: new Date().toISOString()
  });

  const clip = await getClip(job.clipId);
  const project = await getProjectByClipId(job.clipId);

  if (!clip || !project) {
    await upsertJob({
      ...job,
      status: "failed",
      error: "Clip or project not found.",
      updatedAt: new Date().toISOString()
    });
    return;
  }

  try {
    const rendered = await ensureClipExport(project, clip);
    await updateClip(project.id, clip.id, {
      exportUrl: rendered.publicPath
    });

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
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
