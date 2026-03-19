import type { GeneratedClip, Platform, Project, TranscriptSegment } from "@/types";
import { suggestCta } from "@/lib/ai/engines/cta-engine";
import { scoreSegment } from "@/lib/ai/engines/trend-scoring";
import { analyzeEmotion, analyzeScenes, transcribeVideo } from "@/lib/ai/providers/mock-providers";
import { updateProject } from "@/lib/db/repository";
import { setProjectStatus } from "@/lib/jobs/job-runner";
import { average, createId } from "@/lib/utils";

function createCaptions(segment: TranscriptSegment[]) {
  return segment.flatMap((item) =>
    item.text.split(" ").map((word, index) => ({
      id: createId("cap"),
      startMs: item.startMs + index * 300,
      endMs: item.startMs + (index + 1) * 300,
      text: word,
      highlighted: index % 4 === 0
    }))
  );
}

function generateClipTitle(segment: TranscriptSegment, index: number) {
  const label = [
    "Hook-first Breakdown",
    "Retention Spike Moment",
    "Best CTA Cut",
    "High Emotion Highlight",
    "Best for Reels",
    "Best for Shorts",
    "Replay-worthy Edit",
    "Audience Magnet",
    "Fast Scroll Stopper",
    "Polished Viral Angle"
  ][index];

  return `${label}: ${segment.keywords[0] ?? "creator insight"}`;
}

export async function processProject(project: Project) {
  await setProjectStatus(project.id, "analyzing", 25);

  const transcript = await transcribeVideo({
    sourceUrl: project.sourceUrl,
    storagePath: project.sourceVideo?.storagePath ?? "/samples/source-video.mp4"
  });
  const scenes = await analyzeScenes();
  const emotions = await analyzeEmotion();

  await setProjectStatus(project.id, "generating", 60);

  const exportUrl = project.sourceVideo?.storagePath ?? "/samples/source-video.mp4";
  const ctaText = suggestCta(transcript);
  const clips: GeneratedClip[] = Array.from({ length: 10 }, (_, index) => {
    const segment = transcript[index % transcript.length];
    const preferredPlatform = project.targetPlatforms[index % project.targetPlatforms.length] as Platform;
    const score = scoreSegment(segment, preferredPlatform);
    const startMs = Math.max(0, segment.startMs - 1000);
    const duration = project.targetDurations[index % project.targetDurations.length];
    const endMs = startMs + duration * 1000;
    const motionBoost = scenes[index % scenes.length]?.intensity ?? 76;
    const emotionBoost = emotions[index % emotions.length]?.score ?? 74;
    const viralScore = average([...Object.values(score.breakdown), motionBoost, emotionBoost]);
    const hookText = segment.text.split(".")[0];

    return {
      id: createId("clip"),
      projectId: project.id,
      title: generateClipTitle(segment, index),
      summary: `Auto-generated from ${preferredPlatform} scoring with motion and emotion boosts.`,
      startMs,
      endMs,
      duration,
      viralScore,
      platforms: [preferredPlatform],
      badges: [
        score.breakdown.hook > 85 ? "Strong Hook" : "High Clarity",
        score.breakdown.emotion > 80 ? "High Emotion" : "Best CTA"
      ],
      hookText,
      ctaText,
      breakdown: score.breakdown,
      transcriptSegmentIds: [segment.id],
      captions: createCaptions([segment]),
      aspectRatio: "9:16",
      exportUrl,
      thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
      favorite: index < 3,
      socialPackage: {
        title: generateClipTitle(segment, index),
        postText: `${hookText}. ${ctaText}.`,
        hashtags: [
          "#clipforgeai",
          "#tiktokgrowth",
          "#youtubeShorts",
          "#instagramreels",
          "#viralvideo"
        ],
        platformSuggestion: {
          tiktok: "Lead with captions and keep the pace tight.",
          youtubeShorts: "Use a promise-led title with keyword clarity.",
          instagramReels: "Favor strong visual framing and concise text.",
          facebookReels: "Use a direct CTA with a practical benefit."
        }
      }
    };
  });

  const updatedProject = await updateProject(project.id, {
    status: "completed",
    transcript,
    clips,
    compareTopClipIds: clips.slice(0, 3).map((clip) => clip.id)
  });

  await setProjectStatus(project.id, "completed", 100);
  return updatedProject;
}
