import type { Platform, TranscriptSegment, TrendScoreBreakdown } from "@/types";
import { average, clamp } from "@/lib/utils";

export const platformWeights: Record<Platform, TrendScoreBreakdown> = {
  tiktok: {
    hook: 18,
    emotion: 12,
    clarity: 8,
    retention: 14,
    motion: 10,
    emphasis: 8,
    cta: 6,
    trend: 10,
    shareability: 8,
    replay: 6
  },
  youtubeShorts: {
    hook: 14,
    emotion: 10,
    clarity: 12,
    retention: 16,
    motion: 8,
    emphasis: 10,
    cta: 8,
    trend: 8,
    shareability: 6,
    replay: 8
  },
  instagramReels: {
    hook: 16,
    emotion: 14,
    clarity: 8,
    retention: 14,
    motion: 10,
    emphasis: 8,
    cta: 6,
    trend: 8,
    shareability: 10,
    replay: 6
  },
  facebookReels: {
    hook: 12,
    emotion: 10,
    clarity: 12,
    retention: 12,
    motion: 8,
    emphasis: 10,
    cta: 12,
    trend: 8,
    shareability: 8,
    replay: 8
  }
};

export function scoreSegment(segment: TranscriptSegment, platform: Platform) {
  const base: TrendScoreBreakdown = {
    hook: clamp(segment.emphasis + 4),
    emotion: clamp(segment.emotion),
    clarity: clamp(68 + segment.keywords.length * 6),
    retention: clamp((segment.emphasis + segment.emotion) / 2 + 8),
    motion: clamp(64 + segment.keywords.length * 5),
    emphasis: clamp(segment.emphasis),
    cta: clamp(56 + segment.text.length % 28),
    trend: clamp(62 + segment.keywords.length * 7),
    shareability: clamp(66 + segment.text.split(" ").length),
    replay: clamp(60 + segment.emphasis / 3)
  };

  const weights = platformWeights[platform];
  const total = average(
    Object.entries(base).map(([key, value]) => value * (weights[key as keyof TrendScoreBreakdown] / 10))
  );

  return { breakdown: base, total: clamp(total) };
}
