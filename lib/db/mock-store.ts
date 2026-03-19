import { promises as fs } from "fs";
import path from "path";
import { requirePersistentDatabase } from "@/lib/deployment";
import type { ProcessingJob, Project, UserProfile } from "@/types";
import { createMockJobs, createMockProject } from "@/lib/mock/seed-data";

export interface MockDatabase {
  users: UserProfile[];
  projects: Project[];
  jobs: ProcessingJob[];
}

const dbPath = path.join(process.cwd(), "public/data/mock-db.json");

async function ensureStore() {
  const seedDatabase = async () => {
    const seededProject = createMockProject();
    const seed: MockDatabase = {
      users: [
        {
          id: "user_demo",
          email: "demo@clipforge.ai",
          name: "ClipForge Demo",
          plan: "pro",
          image: null
        }
      ],
      projects: [seededProject],
      jobs: createMockJobs(seededProject.id)
    };
    await fs.mkdir(path.dirname(dbPath), { recursive: true });
    await fs.writeFile(dbPath, JSON.stringify(seed, null, 2), "utf8");
  };

  try {
    await fs.access(dbPath);
  } catch {
    await seedDatabase();
    return;
  }

  const existing = JSON.parse(await fs.readFile(dbPath, "utf8")) as Partial<MockDatabase>;
  if (!existing.projects?.length) {
    await seedDatabase();
  }
}

export async function readMockDb(): Promise<MockDatabase> {
  requirePersistentDatabase();
  await ensureStore();
  const raw = await fs.readFile(dbPath, "utf8");
  return JSON.parse(raw) as MockDatabase;
}

export async function writeMockDb(data: MockDatabase) {
  requirePersistentDatabase();
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), "utf8");
}
