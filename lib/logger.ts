type Level = "info" | "warn" | "error";

export function log(level: Level, message: string, metadata?: Record<string, unknown>) {
  const payload = {
    level,
    message,
    metadata,
    timestamp: new Date().toISOString()
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.log(payload);
}
