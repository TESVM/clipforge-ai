import { spawn } from "child_process";
import ffprobePath from "ffprobe-static";

interface ProbeResult {
  durationSec: number;
  width?: number;
  height?: number;
}

export function probeVideo(filePath: string) {
  return new Promise<ProbeResult>((resolve, reject) => {
    if (!ffprobePath.path) {
      reject(new Error("ffprobe-static binary not available."));
      return;
    }

    const child = spawn(ffprobePath.path, [
      "-v",
      "error",
      "-print_format",
      "json",
      "-show_format",
      "-show_streams",
      filePath
    ]);

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", reject);
    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(stderr || `ffprobe exited with code ${code}`));
        return;
      }

      const parsed = JSON.parse(stdout) as {
        format?: { duration?: string };
        streams?: Array<{ codec_type?: string; width?: number; height?: number }>;
      };
      const videoStream = parsed.streams?.find((stream) => stream.codec_type === "video");

      resolve({
        durationSec: Math.round(Number(parsed.format?.duration ?? 0)),
        width: videoStream?.width,
        height: videoStream?.height
      });
    });
  });
}
