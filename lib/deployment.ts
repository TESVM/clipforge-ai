import { env } from "@/lib/env";

export function requirePersistentDatabase() {
  if (env.isVercel && !env.usePrisma) {
    throw new Error(
      "Vercel deployment requires USE_PRISMA=true and a real PostgreSQL DATABASE_URL."
    );
  }
}

export function requireSupportedStorageMode() {
  if (env.isVercel && env.storageMode === "local") {
    throw new Error(
      "Vercel deployment cannot use STORAGE_MODE=local. Use STORAGE_MODE=vercel-blob."
    );
  }
}

export function requireSupportedExportMode() {
  if (env.isVercel && env.exportExecutionMode === "detached") {
    throw new Error(
      "Vercel deployment cannot use detached export workers. Use EXPORT_EXECUTION_MODE=inline for demo deployments or wire EXTERNAL_EXPORT_WORKER_URL."
    );
  }
}
