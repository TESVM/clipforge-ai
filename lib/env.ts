const inferredVercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  nextAuthUrl: process.env.NEXTAUTH_URL ?? inferredVercelUrl,
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "clipforge-demo-secret",
  demoUserEmail: process.env.DEMO_USER_EMAIL ?? "demo@clipforge.ai",
  demoUserPassword: process.env.DEMO_USER_PASSWORD ?? "Demo123!",
  storageMode: process.env.STORAGE_MODE ?? "local",
  localUploadDir: process.env.LOCAL_UPLOAD_DIR ?? "./public/uploads",
  usePrisma: process.env.USE_PRISMA === "true",
  exportExecutionMode: process.env.EXPORT_EXECUTION_MODE ?? "detached",
  externalExportWorkerUrl: process.env.EXTERNAL_EXPORT_WORKER_URL ?? "",
  blobReadWriteToken: process.env.BLOB_READ_WRITE_TOKEN ?? "",
  isVercel: process.env.VERCEL === "1",
  nodeEnv: process.env.NODE_ENV ?? "development"
};
