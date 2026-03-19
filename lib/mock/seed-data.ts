import type {
  ClipCandidate,
  GeneratedClip,
  Platform,
  ProcessingJob,
  Project,
  TranscriptSegment,
  TrendScoreBreakdown
} from "@/types";
import { average, createId } from "@/lib/utils";

const defaultPlatforms: Platform[] = [
  "tiktok",
  "youtubeShorts",
  "instagramReels",
  "facebookReels"
];

function createTranscript(): TranscriptSegment[] {
  return [
    {
      id: createId("seg"),
      startMs: 0,
      endMs: 9000,
      text: "Most creators spend hours chopping a single podcast into clips that still fail to hook in the first two seconds.",
      speaker: "Host",
      emphasis: 88,
      emotion: 72,
      keywords: ["creators", "podcast", "hook"]
    },
    {
      id: createId("seg"),
      startMs: 9000,
      endMs: 20000,
      text: "The winning move is identifying the exact moment where tension, payoff, and audience curiosity all spike together.",
      speaker: "Host",
      emphasis: 91,
      emotion: 79,
      keywords: ["tension", "payoff", "curiosity"]
    },
    {
      id: createId("seg"),
      startMs: 20000,
      endMs: 33000,
      text: "When we detect emotion in the voice, movement on screen, and a clear promise, the retention curve usually jumps.",
      speaker: "Host",
      emphasis: 84,
      emotion: 83,
      keywords: ["emotion", "movement", "retention"]
    },
    {
      id: createId("seg"),
      startMs: 33000,
      endMs: 47000,
      text: "Then we reframe for vertical, burn in captions, and end with a call to action that matches the topic instead of feeling bolted on.",
      speaker: "Host",
      emphasis: 80,
      emotion: 68,
      keywords: ["vertical", "captions", "CTA"]
    },
    {
      id: createId("seg"),
      startMs: 47000,
      endMs: 65000,
      text: "That is how one long-form video becomes ten clips that are coherent, fast, and ready for TikTok, Shorts, and Reels.",
      speaker: "Host",
      emphasis: 93,
      emotion: 90,
      keywords: ["coherent", "TikTok", "Reels"]
    }
  ];
}

function createBreakdown(seed: number): TrendScoreBreakdown {
  return {
    hook: 80 + (seed % 14),
    emotion: 70 + (seed % 20),
    clarity: 76 + (seed % 12),
    retention: 79 + (seed % 16),
    motion: 68 + (seed % 20),
    emphasis: 74 + (seed % 18),
    cta: 66 + (seed % 24),
    trend: 72 + (seed % 19),
    shareability: 78 + (seed % 15),
    replay: 70 + (seed % 18)
  };
}

function createCandidate(index: number, transcript: TranscriptSegment[]): ClipCandidate {
  const breakdown = createBreakdown(index * 7);
  const transcriptSegmentIds = transcript
    .slice(Math.max(0, index % 3), Math.min(transcript.length, 3 + (index % 3)))
    .map((segment) => segment.id);
  const score = average(Object.values(breakdown));

  return {
    id: createId("cand"),
    title: [
      "The Hook That Changes Retention",
      "Why Vertical Clips Win Faster",
      "The Exact Viral Editing Stack",
      "How to Build Better Reels",
      "The Creator Retention Formula",
      "Use Emotion to Lift Watch Time",
      "What Makes a Clip Rewatchable",
      "Turn Long Form into 10 Shorts",
      "How to End with a CTA",
      "The Fastest Clip Repurposing Flow"
    ][index],
    summary: "AI-selected highlight with strong hook, motion, and conversion potential.",
    startMs: index * 5500,
    endMs: index * 5500 + [15000, 30000, 45000, 60000][index % 4],
    duration: [15, 30, 45, 60][index % 4] as 15 | 30 | 45 | 60,
    viralScore: score,
    platforms: defaultPlatforms.slice(0, 2 + (index % 3)),
    badges: [
      ["Strong Hook", "Best for Reels"],
      ["High Emotion", "Replay Value"],
      ["Best CTA", "High Retention"],
      ["Fast Pacing", "Best for Shorts"]
    ][index % 4],
    hookText: [
      "This is where most creators lose the viewer.",
      "Watch what happens when the hook lands immediately.",
      "This editing move changes everything.",
      "Most people miss this retention trick."
    ][index % 4],
    ctaText: [
      "Follow for more creator growth tactics",
      "Subscribe for more short-form strategy",
      "Comment if you want the full workflow",
      "Visit our site to automate your clips"
    ][index % 4],
    breakdown,
    transcriptSegmentIds
  };
}

function createGeneratedClip(
  index: number,
  projectId: string,
  transcript: TranscriptSegment[],
  exportUrl: string
): GeneratedClip {
  const candidate = createCandidate(index, transcript);

  return {
    ...candidate,
    projectId,
    aspectRatio: "9:16",
    captions: transcript.flatMap((segment, segmentIndex) =>
      segment.text.split(" ").slice(0, 8).map((word, wordIndex) => ({
        id: createId("cap"),
        startMs: segment.startMs + wordIndex * 420,
        endMs: segment.startMs + (wordIndex + 1) * 420,
        text: word,
        highlighted: wordIndex % 3 === 0 || segmentIndex === index % transcript.length
      }))
    ),
    exportUrl,
    thumbnailUrl: `https://images.unsplash.com/photo-149${index}0000000?auto=format&fit=crop&w=900&q=80`,
    favorite: index < 2,
    socialPackage: {
      title: candidate.title,
      postText: `${candidate.hookText} ${candidate.ctaText}.`,
      hashtags: ["#viralclips", "#contentstrategy", "#shortformvideo", "#creatorgrowth"],
      platformSuggestion: {
        tiktok: "Lead with the hook text overlay and keep captions bold.",
        youtubeShorts: "Use a curiosity title with a promise-driven CTA.",
        instagramReels: "Pair with a concise caption and save-worthy ending.",
        facebookReels: "Keep the CTA explicit and benefit-focused."
      }
    }
  };
}

export function createMockProject(partial?: Partial<Project>): Project {
  const projectId = partial?.id ?? createId("proj");
  const transcript = partial?.transcript ?? createTranscript();
  const sourceVideo =
    partial?.sourceVideo ??
    {
      id: createId("src"),
      projectId,
      sourceType: partial?.sourceType ?? "youtube",
      sourceUrl: partial?.sourceUrl ?? "https://www.youtube.com/watch?v=demo123",
      durationSec: 65,
      width: 1920,
      height: 1080,
      storagePath: "/samples/source-video.mp4"
    };
  const clips =
    partial?.clips ??
    Array.from({ length: 10 }, (_, index) =>
      createGeneratedClip(index, projectId, transcript, sourceVideo.storagePath)
    );

  return {
    id: projectId,
    userId: partial?.userId ?? "user_demo",
    title: partial?.title ?? "Creator Growth Podcast Episode 12",
    status: partial?.status ?? "completed",
    sourceType: partial?.sourceType ?? "youtube",
    sourceUrl: partial?.sourceUrl ?? "https://www.youtube.com/watch?v=demo123",
    description:
      partial?.description ?? "Weekly creator strategy episode focused on short-form growth and content repurposing.",
    createdAt: partial?.createdAt ?? new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    updatedAt: partial?.updatedAt ?? new Date().toISOString(),
    targetPlatforms: partial?.targetPlatforms ?? defaultPlatforms,
    targetDurations: partial?.targetDurations ?? [15, 30, 45, 60],
    sourceVideo,
    transcript,
    clips,
    compareTopClipIds: partial?.compareTopClipIds ?? clips.slice(0, 3).map((clip) => clip.id)
  };
}

export function createMockJobs(projectId: string): ProcessingJob[] {
  return [
    {
      id: createId("job"),
      projectId,
      type: "analysis",
      status: "completed",
      progress: 100,
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 4).toISOString()
    },
    {
      id: createId("job"),
      projectId,
      type: "export",
      status: "completed",
      progress: 100,
      createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
      updatedAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
    }
  ];
}
