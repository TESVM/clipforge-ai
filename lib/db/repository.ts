import type { DashboardStats, GeneratedClip, ProcessingJob, Project } from "@/types";
import { createMockProject } from "@/lib/mock/seed-data";
import { average, createId } from "@/lib/utils";
import { readMockDb, writeMockDb } from "@/lib/db/mock-store";

function definedOnly<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined)
  ) as Partial<T>;
}

export async function getDashboardData(userId: string) {
  const db = await readMockDb();
  const projects = db.projects.filter((project) => project.userId === userId);
  const clips = projects.flatMap((project) => project.clips);

  const stats: DashboardStats = {
    totalProjects: projects.length,
    totalClips: clips.length,
    averageViralScore: average(clips.map((clip) => clip.viralScore)),
    activeExports: db.jobs.filter((job) => job.type === "export" && job.status !== "completed").length
  };

  return { projects, jobs: db.jobs, stats };
}

export async function listProjects(userId: string) {
  const db = await readMockDb();
  return db.projects.filter((project) => project.userId === userId);
}

export async function getProject(projectId: string) {
  const db = await readMockDb();
  return db.projects.find((project) => project.id === projectId) ?? null;
}

export async function createProject(input: Partial<Project>) {
  const db = await readMockDb();
  const project = createMockProject({
    ...input,
    id: createId("proj"),
    status: "queued",
    transcript: [],
    clips: [],
    compareTopClipIds: []
  });

  if (project.sourceVideo) {
    project.sourceVideo.projectId = project.id;
  }

  db.projects.unshift(project);
  db.jobs.unshift({
    id: createId("job"),
    projectId: project.id,
    type: "analysis",
    status: "queued",
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  await writeMockDb(db);
  return project;
}

export async function updateProject(projectId: string, updates: Partial<Project>) {
  const db = await readMockDb();
  const index = db.projects.findIndex((project) => project.id === projectId);

  if (index === -1) return null;

  db.projects[index] = {
    ...db.projects[index],
    ...definedOnly(updates),
    updatedAt: new Date().toISOString()
  };

  await writeMockDb(db);
  return db.projects[index];
}

export async function updateClip(projectId: string, clipId: string, updates: Partial<GeneratedClip>) {
  const db = await readMockDb();
  const projectIndex = db.projects.findIndex((project) => project.id === projectId);
  if (projectIndex === -1) return null;

  const clipIndex = db.projects[projectIndex].clips.findIndex((clip) => clip.id === clipId);
  if (clipIndex === -1) return null;

  db.projects[projectIndex].clips[clipIndex] = {
    ...db.projects[projectIndex].clips[clipIndex],
    ...definedOnly(updates)
  };

  await writeMockDb(db);
  return db.projects[projectIndex].clips[clipIndex];
}

export async function getClip(clipId: string) {
  const db = await readMockDb();
  for (const project of db.projects) {
    const clip = project.clips.find((item) => item.id === clipId);
    if (clip) return clip;
  }
  return null;
}

export async function getProjectByClipId(clipId: string) {
  const db = await readMockDb();
  return db.projects.find((project) => project.clips.some((clip) => clip.id === clipId)) ?? null;
}

export async function upsertJob(job: ProcessingJob) {
  const db = await readMockDb();
  const index = db.jobs.findIndex((item) => item.id === job.id);
  if (index === -1) {
    db.jobs.unshift(job);
  } else {
    db.jobs[index] = job;
  }
  await writeMockDb(db);
  return job;
}

export async function getJobsByProject(projectId: string) {
  const db = await readMockDb();
  return db.jobs.filter((job) => job.projectId === projectId);
}

export async function getJob(jobId: string) {
  const db = await readMockDb();
  return db.jobs.find((job) => job.id === jobId) ?? null;
}

export async function getLatestExportJobByClipId(clipId: string) {
  const db = await readMockDb();
  const jobs = db.jobs
    .filter((job) => job.type === "export" && job.clipId === clipId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));

  return jobs[0] ?? null;
}
