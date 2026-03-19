import { promises as fs } from "fs";
import path from "path";
import { env } from "@/lib/env";
import type { StoredAsset } from "@/types";
import { createId } from "@/lib/utils";
import { probeVideo } from "@/lib/video/probe";

const allowedMimeTypes = new Set(["video/mp4", "video/m4v", "video/quicktime"]);
const allowedExtensions = new Set(["mp4", "m4v", "mov"]);

export async function saveUpload(file: File): Promise<StoredAsset> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "mp4";

  if (!allowedMimeTypes.has(file.type) && !allowedExtensions.has(extension)) {
    throw new Error("Only MP4, M4V, and MOV uploads are supported.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${createId("upload")}.${extension}`;
  const relativeDir = env.localUploadDir.replace("./", "");
  const absoluteDir = path.join(process.cwd(), relativeDir);
  const filePath = path.join(absoluteDir, fileName);

  await fs.mkdir(absoluteDir, { recursive: true });
  await fs.writeFile(filePath, buffer);
  const metadata = await probeVideo(filePath);

  return {
    fileName,
    storagePath: `/${relativeDir}/${fileName}`,
    durationSec: metadata.durationSec,
    width: metadata.width,
    height: metadata.height
  };
}
