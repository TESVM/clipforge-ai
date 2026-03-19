import { NextResponse } from "next/server";
import { requireSupportedStorageMode } from "@/lib/deployment";
import { createProject, listProjects, updateProject } from "@/lib/db/repository";
import { env } from "@/lib/env";
import { processProject } from "@/lib/ai/pipeline/process-project";
import { saveUpload } from "@/lib/storage/local-storage";
import { saveUploadToVercelBlob } from "@/lib/storage/vercel-blob-storage";
import { createProjectSchema } from "@/lib/validators/project";
import { log } from "@/lib/logger";

export async function GET() {
  const projects = await listProjects("user_demo");
  return NextResponse.json({ projects });
}

export async function POST(request: Request) {
  try {
    requireSupportedStorageMode();
    const formData = await request.formData();
    const sourceType = String(formData.get("sourceType") ?? "youtube");
    const title = String(formData.get("title") ?? "");
    const description = String(formData.get("description") ?? "");
    const sourceUrl = String(formData.get("sourceUrl") ?? "");
    const targetPlatforms = JSON.parse(String(formData.get("targetPlatforms") ?? "[]"));
    const targetDurations = JSON.parse(String(formData.get("targetDurations") ?? "[]"));
    const parsed = createProjectSchema.parse({
      title,
      description,
      sourceType,
      sourceUrl,
      targetPlatforms,
      targetDurations
    });

    let storagePath = "/samples/source-video.mp4";
    let fileName: string | undefined;
    let durationSec = 65;
    let width: number | undefined = 1920;
    let height: number | undefined = 1080;
    const file = formData.get("file");

    if (file instanceof File) {
      const saved =
        env.storageMode === "vercel-blob"
          ? await saveUploadToVercelBlob(file)
          : await saveUpload(file);
      storagePath = saved.storagePath;
      fileName = saved.fileName;
      durationSec = saved.durationSec;
      width = saved.width;
      height = saved.height;
    }

    const project = await createProject({
      userId: "user_demo",
      title: parsed.title,
      description: parsed.description,
      sourceType: parsed.sourceType,
      sourceUrl: parsed.sourceUrl || undefined,
      targetPlatforms: parsed.targetPlatforms,
      targetDurations: parsed.targetDurations,
      sourceVideo: {
        id: `src_${Date.now()}`,
        projectId: "",
        sourceType: parsed.sourceType,
        sourceUrl: parsed.sourceUrl || undefined,
        fileName,
        mimeType: file instanceof File ? file.type : undefined,
        durationSec,
        width,
        height,
        storagePath
      },
      transcript: [],
      clips: [],
      compareTopClipIds: []
    });

    const processed = await processProject({
      ...project,
      sourceVideo: project.sourceVideo
        ? { ...project.sourceVideo, projectId: project.id }
        : undefined
    });

    if (processed) {
      await updateProject(project.id, processed);
    }

    return NextResponse.json({ project: processed ?? project }, { status: 201 });
  } catch (error) {
    log("error", "Failed to create project", {
      error: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid project payload."
      },
      { status: 400 }
    );
  }
}
