"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { GeneratedClip } from "@/types";
import { Button } from "@/components/shared/button";
import { captionTextFromTokens } from "@/lib/video/captions";

export function ClipEditorForm({ clip }: { clip: GeneratedClip }) {
  const router = useRouter();
  const [title, setTitle] = useState(clip.title);
  const [ctaText, setCtaText] = useState(clip.ctaText);
  const [captionText, setCaptionText] = useState(captionTextFromTokens(clip.captions));
  const [aspectRatio, setAspectRatio] = useState(clip.aspectRatio);
  const [favorite, setFavorite] = useState(clip.favorite);
  const [startMs, setStartMs] = useState(clip.startMs);
  const [endMs, setEndMs] = useState(clip.endMs);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);

    const response = await fetch(`/api/clips/${clip.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, ctaText, captionText, aspectRatio, favorite, startMs, endMs })
    });

    if (!response.ok) {
      setIsSaving(false);
      alert("Failed to update clip.");
      return;
    }

    router.refresh();
    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Clip title</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">CTA overlay</span>
        <input
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
          value={ctaText}
          onChange={(event) => setCtaText(event.target.value)}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Burned-in caption text</span>
        <textarea
          className="min-h-28 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
          value={captionText}
          onChange={(event) => setCaptionText(event.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Start (ms)</span>
          <input
            type="number"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
            value={startMs}
            onChange={(event) => setStartMs(Number(event.target.value))}
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">End (ms)</span>
          <input
            type="number"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
            value={endMs}
            onChange={(event) => setEndMs(Number(event.target.value))}
          />
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">Aspect ratio</span>
        <select
          className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white focus:border-cyan-400/40 focus:outline-none"
          value={aspectRatio}
          onChange={(event) => setAspectRatio(event.target.value as "9:16" | "1:1" | "16:9")}
        >
          <option value="9:16">9:16 Vertical</option>
          <option value="1:1">1:1 Square</option>
          <option value="16:9">16:9 Wide</option>
        </select>
      </label>
      <label className="flex items-center gap-3 text-sm text-slate-300">
        <input type="checkbox" checked={favorite} onChange={(event) => setFavorite(event.target.checked)} />
        Mark as favorite
      </label>
      <Button type="submit" className="w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save clip changes"}
      </Button>
    </form>
  );
}
