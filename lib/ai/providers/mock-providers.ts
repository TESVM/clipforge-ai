import type { TranscriptSegment } from "@/types";
import { createId } from "@/lib/utils";

export async function transcribeVideo(input: { sourceUrl?: string; storagePath: string }) {
  void input;
  const transcript: TranscriptSegment[] = [
    {
      id: createId("seg"),
      startMs: 0,
      endMs: 10000,
      text: "The first three seconds of a clip decide whether the viewer swipes away.",
      speaker: "Speaker 1",
      emphasis: 92,
      emotion: 75,
      keywords: ["three seconds", "viewer", "swipes"]
    },
    {
      id: createId("seg"),
      startMs: 10000,
      endMs: 22000,
      text: "The best clips start with a payoff, not a preamble, and they keep visual motion on screen.",
      speaker: "Speaker 1",
      emphasis: 88,
      emotion: 78,
      keywords: ["payoff", "visual motion", "clips"]
    },
    {
      id: createId("seg"),
      startMs: 22000,
      endMs: 36000,
      text: "When the speaker is centered, captions punch up the important words, and the CTA feels natural, people finish the video.",
      speaker: "Speaker 1",
      emphasis: 86,
      emotion: 82,
      keywords: ["centered", "captions", "CTA"]
    }
  ];

  return transcript;
}

export async function analyzeScenes() {
  return [
    { startMs: 0, endMs: 12000, intensity: 78, focus: "speaker" },
    { startMs: 12000, endMs: 26000, intensity: 85, focus: "screen-demo" },
    { startMs: 26000, endMs: 42000, intensity: 90, focus: "speaker-closeup" }
  ];
}

export async function analyzeEmotion() {
  return [
    { momentMs: 4000, score: 76 },
    { momentMs: 17000, score: 82 },
    { momentMs: 29000, score: 88 }
  ];
}
