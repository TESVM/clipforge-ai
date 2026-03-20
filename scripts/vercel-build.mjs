import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function fail(message) {
  console.error(`\n[ClipForge AI Vercel Build Error]\n${message}\n`);
  process.exit(1);
}

const required = ["NEXTAUTH_SECRET"];

if (process.env.USE_PRISMA === "true") {
  required.push("DATABASE_URL");
}

if (process.env.STORAGE_MODE === "vercel-blob") {
  required.push("BLOB_READ_WRITE_TOKEN");
}

for (const key of required) {
  if (!process.env[key]) {
    fail(`Missing required environment variable: ${key}`);
  }
}

if (process.env.STORAGE_MODE === "local" && process.env.VERCEL === "1") {
  fail("Vercel deployment cannot use STORAGE_MODE=local. Use STORAGE_MODE=vercel-blob.");
}

if (process.env.EXPORT_EXECUTION_MODE === "detached" && process.env.VERCEL === "1") {
  fail(
    "Vercel deployment cannot use EXPORT_EXECUTION_MODE=detached. Use EXPORT_EXECUTION_MODE=inline."
  );
}

run("npx", ["prisma", "generate"]);

if (process.env.USE_PRISMA === "true") {
  run("npx", ["prisma", "migrate", "deploy"]);
}

run("npx", ["next", "build"]);
