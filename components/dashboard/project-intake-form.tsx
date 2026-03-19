"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload, Youtube } from "lucide-react";
import { Button } from "@/components/shared/button";

const platformOptions = [
  { label: "TikTok", value: "tiktok" },
  { label: "YouTube Shorts", value: "youtubeShorts" },
  { label: "Instagram Reels", value: "instagramReels" },
  { label: "Facebook Reels", value: "facebookReels" }
] as const;

const durationOptions = [15, 30, 45, 60] as const;

export function ProjectIntakeForm() {
  const router = useRouter();
  const [title, setTitle] = useState("Founder Podcast Episode");
  const [description, setDescription] = useState(
    "Clip the strongest founder growth moments, retention hooks, and CTA-driven insights."
  );
  const [sourceType, setSourceType] = useState<"youtube" | "upload" | "web">("youtube");
  const [sourceUrl, setSourceUrl] = useState("https://www.youtube.com/watch?v=demo123");
  const [platforms, setPlatforms] = useState<string[]>(["tiktok", "instagramReels"]);
  const [durations, setDurations] = useState<number[]>([15, 30, 45]);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleSelection<T extends string | number>(value: T, current: T[], setter: (next: T[]) => void) {
    setter(current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append("title", title);
    payload.append("description", description);
    payload.append("sourceType", sourceType);
    payload.append("sourceUrl", sourceUrl);
    payload.append("targetPlatforms", JSON.stringify(platforms));
    payload.append("targetDurations", JSON.stringify(durations));
    if (file) payload.append("file", file);

    const response = await fetch("/api/projects", {
      method: "POST",
      body: payload
    });

    const result = await response.json();
    if (response.ok) {
      router.push(`/dashboard/projects/${result.project.id}`);
      router.refresh();
      return;
    }

    setIsSubmitting(false);
    alert(result.error ?? "Failed to create project.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Project name</span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Source type</span>
          <select
            className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
            value={sourceType}
            onChange={(event) => setSourceType(event.target.value as "youtube" | "upload" | "web")}
          >
            <option value="youtube">YouTube URL</option>
            <option value="upload">Upload MP4/MPEG-4</option>
            <option value="web">Web-hosted video URL</option>
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Creative brief</span>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      {sourceType === "upload" ? (
        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-cyan-400/30 bg-cyan-400/5 p-6 text-center">
          <Upload className="h-8 w-8 text-cyan-300" />
          <span className="mt-3 font-medium text-white">Drag and drop your MP4 or choose a file</span>
          <span className="mt-2 text-sm text-slate-400">{file?.name ?? "No file selected"}</span>
          <input
            type="file"
            accept="video/mp4,video/m4v,video/quicktime"
            className="hidden"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          />
        </label>
      ) : (
        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm text-slate-300">
            <Youtube className="h-4 w-4" />
            Video URL
          </span>
          <input
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
            value={sourceUrl}
            onChange={(event) => setSourceUrl(event.target.value)}
          />
        </label>
      )}
      <div>
        <p className="mb-3 text-sm text-slate-300">Target platforms</p>
        <div className="flex flex-wrap gap-3">
          {platformOptions.map((platform) => (
            <button
              key={platform.value}
              type="button"
              onClick={() => toggleSelection(platform.value, platforms, setPlatforms)}
              className={`rounded-full px-4 py-2 text-sm ${
                platforms.includes(platform.value)
                  ? "bg-cyan-400 text-slate-950"
                  : "border border-white/10 bg-white/5 text-slate-300"
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-3 text-sm text-slate-300">Target durations</p>
        <div className="flex flex-wrap gap-3">
          {durationOptions.map((duration) => (
            <button
              key={duration}
              type="button"
              onClick={() => toggleSelection(duration, durations, setDurations)}
              className={`rounded-full px-4 py-2 text-sm ${
                durations.includes(duration)
                  ? "bg-rose-400 text-white"
                  : "border border-white/10 bg-white/5 text-slate-300"
              }`}
            >
              {duration}s
            </button>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating project..." : "Generate 10 clips"}
      </Button>
    </form>
  );
}
