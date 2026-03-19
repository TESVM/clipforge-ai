import { put } from "@vercel/blob";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { env } from "@/lib/env";
import type { StoredAsset } from "@/types";
import { createId } from "@/lib/utils";
import { probeVideo } from "@/lib/video/probe";

const allowedMimeTypes = new Set(["video/mp4", "video/m4v", "video/quicktime"]);
const allowedExtensions = new Set(["mp4", "m4v", "mov"]);

export async function saveUploadToVercelBlob(file: File): Promise<StoredAsset> {
  const extension = file.name.split(".").pop()?.toLowerCase() ?? "mp4";

  if (!allowedMimeTypes.has(file.type) && !allowedExtensions.has(extension)) {
    throw new Error("Only MP4, M4V, and MOV uploads are supported.");
  }

  if (!env.blobReadWriteToken) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for STORAGE_MODE=vercel-blob.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${createId("upload")}.${extension}`;
  const tempPath = path.join(os.tmpdir(), fileName);

  await fs.writeFile(tempPath, buffer);
  const metadata = await probeVideo(tempPath);
  const blob = await put(`uploads/${fileName}`, buffer, {
    access: "public",
    token: env.blobReadWriteToken,
    contentType: file.type || "video/mp4",
    addRandomSuffix: false
  });

  return {
    fileName,
    storagePath: blob.url,
    durationSec: metadata.durationSec,
    width: metadata.width,
    height: metadata.height
  };
}

export async function uploadRenderedAssetToVercelBlob(filePath: string, fileName: string) {
  if (!env.blobReadWriteToken) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for STORAGE_MODE=vercel-blob.");
  }

  const buffer = await fs.readFile(filePath);
  const blob = await put(`exports/${fileName}`, buffer, {
    access: "public",
    token: env.blobReadWriteToken,
    contentType: "video/mp4",
    addRandomSuffix: false
  });

  return blob.url;
}
