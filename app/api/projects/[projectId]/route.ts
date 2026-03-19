import { NextResponse } from "next/server";
import { getJobsByProject, getProject } from "@/lib/db/repository";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    return NextResponse.json({ error: "Project not found." }, { status: 404 });
  }

  const jobs = await getJobsByProject(projectId);
  return NextResponse.json({ project, jobs });
}
