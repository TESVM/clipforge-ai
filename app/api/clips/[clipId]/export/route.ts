import { NextResponse } from "next/server";
import { getClip, getLatestExportJobByClipId, getProjectByClipId } from "@/lib/db/repository";
import { enqueueExportJob } from "@/lib/jobs/export-queue";

async function createExportResponse(clipId: string) {
  const clip = await getClip(clipId);
  const project = await getProjectByClipId(clipId);

  if (!clip || !project) {
    return NextResponse.json({ error: "Clip not found." }, { status: 404 });
  }

  const job = await enqueueExportJob(project.id, clipId);
  return NextResponse.json(
    {
      clipId,
      status: "queued",
      job
    },
    { status: 202 }
  );
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ clipId: string }> }
) {
  const { clipId } = await params;
  const clip = await getClip(clipId);

  if (!clip) {
    return NextResponse.json({ error: "Clip not found." }, { status: 404 });
  }

  const latest = await getLatestExportJobByClipId(clipId);
  const wantsJson = new URL(request.url).searchParams.get("format") === "json";

  if (!latest) {
    if (wantsJson) {
      return NextResponse.json({ clipId, status: "idle" });
    }

    return NextResponse.redirect(new URL(clip.exportUrl, request.url));
  }

  if (wantsJson || latest.status !== "completed" || !latest.outputUrl) {
    return NextResponse.json({
      clipId,
      status: latest.status,
      job: latest
    });
  }

  return NextResponse.redirect(new URL(latest.outputUrl, request.url));
}

export async function POST(
  _: Request,
  { params }: { params: Promise<{ clipId: string }> }
) {
  const { clipId } = await params;
  return createExportResponse(clipId);
}
