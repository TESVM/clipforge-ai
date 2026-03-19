export const env = {
  databaseUrl: process.env.DATABASE_URL ?? "",
  nextAuthUrl: process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  nextAuthSecret: process.env.NEXTAUTH_SECRET ?? "clipforge-demo-secret",
  demoUserEmail: process.env.DEMO_USER_EMAIL ?? "demo@clipforge.ai",
  demoUserPassword: process.env.DEMO_USER_PASSWORD ?? "Demo123!",
  storageMode: process.env.STORAGE_MODE ?? "local",
  localUploadDir: process.env.LOCAL_UPLOAD_DIR ?? "./public/uploads",
  usePrisma: process.env.USE_PRISMA === "true"
};
