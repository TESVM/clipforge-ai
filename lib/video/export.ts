import { promises as fs } from "fs";
import path from "path";
import { spawn } from "child_process";
import ffmpegPath from "ffmpeg-static";
import type { GeneratedClip, Project } from "@/types";
import { captionTextFromTokens } from "@/lib/video/captions";
import { createId } from "@/lib/utils";

const publicDir = path.join(process.cwd(), "public");
const exportDir = path.join(publicDir, "uploads", "exports");

function getOutputDimensions(aspectRatio: GeneratedClip["aspectRatio"]) {
  switch (aspectRatio) {
    case "1:1":
      return { width: 1080, height: 1080 };
    case "16:9":
      return { width: 1920, height: 1080 };
    case "9:16":
    default:
      return { width: 1080, height: 1920 };
  }
}

function toAbsolutePublicPath(assetPath: string) {
  const clean = assetPath.startsWith("/") ? assetPath.slice(1) : assetPath;
  return path.join(publicDir, clean);
}

async function fileExistsAndHasBytes(filePath: string) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile() && stat.size > 0;
  } catch {
    return false;
  }
}

function runFfmpeg(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    if (!ffmpegPath) {
      reject(new Error("ffmpeg-static binary not available."));
      return;
    }

    const child = spawn(ffmpegPath, args, {
      stdio: ["ignore", "ignore", "pipe"]
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(stderr || `FFmpeg exited with code ${code}`));
    });
  });
}

async function resolveFontFile() {
  const candidates = [
    "/System/Library/Fonts/Supplemental/Arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial Unicode.ttf",
    "/System/Library/Fonts/Supplemental/Helvetica.ttc",
    "/Library/Fonts/Arial.ttf"
  ];

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      continue;
    }
  }

  return null;
}

function formatAssTime(seconds: number) {
  const whole = Math.max(0, seconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const secs = Math.floor(whole % 60);
  const centis = Math.floor((whole - Math.floor(whole)) * 100);
  return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}.${centis.toString().padStart(2, "0")}`;
}

function escapeAssText(text: string) {
  return text.replace(/\{/g, "\\{").replace(/\}/g, "\\}").replace(/\n/g, "\\N");
}

async function createSubtitleFile(clip: GeneratedClip) {
  const durationSeconds = Math.max(1, (clip.endMs - clip.startMs) / 1000);
  const ctaStart = Math.max(0, durationSeconds - 2.25);
  const subtitlePath = path.join(exportDir, `${clip.id}-${createId("overlay")}.ass`);
  const fontFile = await resolveFontFile();
  const fontName = fontFile?.includes("Arial") ? "Arial" : "Helvetica";
  const ass = `[Script Info]
ScriptType: v4.00+
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Hook,${fontName},54,&H00FFFFFF,&H00FFFFFF,&H00000000,&H66000000,1,0,0,0,100,100,0,0,1,2,0,8,70,70,90,1
Style: Caption,${fontName},42,&H00FFFFFF,&H00FFFFFF,&H00000000,&H88000000,1,0,0,0,100,100,0,0,1,2,0,2,70,70,130,1
Style: CTA,${fontName},58,&H00FFFFFF,&H00FFFFFF,&H00000000,&HAA000000,1,0,0,0,100,100,0,0,1,2,0,5,70,70,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
Dialogue: 0,${formatAssTime(0)},${formatAssTime(Math.min(3.4, durationSeconds))},Hook,,0,0,0,,${escapeAssText(
    clip.hookText
  )}
Dialogue: 0,${formatAssTime(0)},${formatAssTime(durationSeconds)},Caption,,0,0,0,,${escapeAssText(
    captionTextFromTokens(clip.captions)
  )}
Dialogue: 0,${formatAssTime(ctaStart)},${formatAssTime(durationSeconds)},CTA,,0,0,0,,${escapeAssText(
    clip.ctaText
  )}
`;

  await fs.writeFile(subtitlePath, ass, "utf8");
  return subtitlePath;
}

async function renderFromSource(inputPath: string, outputPath: string, clip: GeneratedClip) {
  const startSeconds = Math.max(0, clip.startMs / 1000);
  const durationSeconds = Math.max(1, (clip.endMs - clip.startMs) / 1000);
  const { width, height } = getOutputDimensions(clip.aspectRatio);
  const subtitlePath = await createSubtitleFile(clip);
  const subtitleFilterPath = subtitlePath.replace(/\\/g, "/").replace(/:/g, "\\:");
  const scaleFilter = `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2:black,fps=30,subtitles='${subtitleFilterPath}'`;

  await runFfmpeg([
    "-y",
    "-ss",
    `${startSeconds}`,
    "-i",
    inputPath,
    "-t",
    `${durationSeconds}`,
    "-vf",
    scaleFilter,
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    outputPath
  ]);
}

async function renderSyntheticFallback(outputPath: string, clip: GeneratedClip) {
  const durationSeconds = Math.max(1, (clip.endMs - clip.startMs) / 1000);
  const { width, height } = getOutputDimensions(clip.aspectRatio);
  const subtitlePath = await createSubtitleFile(clip);
  const subtitleFilterPath = subtitlePath.replace(/\\/g, "/").replace(/:/g, "\\:");
  await runFfmpeg([
    "-y",
    "-f",
    "lavfi",
    "-i",
    `testsrc2=size=${width}x${height}:rate=30:duration=${durationSeconds}`,
    "-f",
    "lavfi",
    "-i",
    `anullsrc=r=48000:cl=stereo`,
    "-vf",
    `subtitles='${subtitleFilterPath}'`,
    "-shortest",
    "-c:v",
    "libx264",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    outputPath
  ]);
}

export async function ensureClipExport(project: Project, clip: GeneratedClip) {
  await fs.mkdir(exportDir, { recursive: true });

  const fileName = `${project.id}-${clip.id}-${createId("export")}.mp4`;
  const outputPath = path.join(exportDir, fileName);
  const publicPath = `/uploads/exports/${fileName}`;
  const inputPath = project.sourceVideo?.storagePath
    ? toAbsolutePublicPath(project.sourceVideo.storagePath)
    : null;

  const hasRenderableInput = inputPath ? await fileExistsAndHasBytes(inputPath) : false;

  if (hasRenderableInput && inputPath) {
    await renderFromSource(inputPath, outputPath, clip);
  } else {
    await renderSyntheticFallback(outputPath, clip);
  }

  return {
    outputPath,
    publicPath
  };
}
