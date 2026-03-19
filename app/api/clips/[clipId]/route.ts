import { NextResponse } from "next/server";
import { getClip, getProjectByClipId, updateClip } from "@/lib/db/repository";
import { clipUpdateSchema } from "@/lib/validators/project";
import { createId } from "@/lib/utils";

function buildCaptionTokensFromText(text: string, startMs: number, endMs: number) {
  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (!words.length) {
    return [];
  }

  const duration = Math.max(1, endMs - startMs);
  const step = Math.max(200, Math.floor(duration / words.length));

  return words.map((word, index) => ({
    id: createId("cap"),
    startMs: startMs + index * step,
    endMs: Math.min(endMs, startMs + (index + 1) * step),
    text: word,
    highlighted: index % 3 === 0
  }));
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ clipId: string }> }
) {
  const { clipId } = await params;
  const clip = await getClip(clipId);

  if (!clip) {
    return NextResponse.json({ error: "Clip not found." }, { status: 404 });
  }

  return NextResponse.json({ clip });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ clipId: string }> }
) {
  const { clipId } = await params;
  const project = await getProjectByClipId(clipId);

  if (!project) {
    return NextResponse.json({ error: "Clip not found." }, { status: 404 });
  }

  const json = await request.json();
  const updates = clipUpdateSchema.parse(json);
  const currentClip = project.clips.find((item) => item.id === clipId);
  const payload = {
    title: updates.title,
    aspectRatio: updates.aspectRatio,
    ctaText: updates.ctaText,
    favorite: updates.favorite,
    startMs: updates.startMs,
    endMs: updates.endMs,
    captions: updates.captionText
      ? buildCaptionTokensFromText(
          updates.captionText,
          updates.startMs ?? currentClip?.startMs ?? 0,
          updates.endMs ?? currentClip?.endMs ?? 1000
        )
      : undefined
  };
  const clip = await updateClip(project.id, clipId, payload);

  return NextResponse.json({ clip });
}
