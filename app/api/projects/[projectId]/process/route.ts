import { NextResponse } from "next/server";
import { processProject } from "@/lib/ai/pipeline/process-project";
import { getProject } from "@/lib/db/repository";

async function run(projectId: string) {
  const project = await getProject(projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const processed = await processProject(project);
  return NextResponse.json({ project: processed });
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  return run(projectId);
}

export async function POST(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  return run(projectId);
}
