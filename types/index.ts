export type ProjectStatus = "queued" | "analyzing" | "generating" | "completed" | "failed";

export type SourceType = "youtube" | "upload" | "web";

export type Platform = "tiktok" | "youtubeShorts" | "instagramReels" | "facebookReels";

export type ClipDuration = 15 | 30 | 45 | 60;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  plan: "starter" | "pro" | "scale";
}

export interface TranscriptSegment {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  speaker: string;
  emphasis: number;
  emotion: number;
  keywords: string[];
}

export interface CaptionToken {
  id: string;
  startMs: number;
  endMs: number;
  text: string;
  highlighted: boolean;
}

export interface TrendScoreBreakdown {
  hook: number;
  emotion: number;
  clarity: number;
  retention: number;
  motion: number;
  emphasis: number;
  cta: number;
  trend: number;
  shareability: number;
  replay: number;
}

export interface ClipCandidate {
  id: string;
  title: string;
  summary: string;
  startMs: number;
  endMs: number;
  duration: ClipDuration;
  viralScore: number;
  platforms: Platform[];
  badges: string[];
  hookText: string;
  ctaText: string;
  breakdown: TrendScoreBreakdown;
  transcriptSegmentIds: string[];
}

export interface GeneratedClip extends ClipCandidate {
  projectId: string;
  captions: CaptionToken[];
  aspectRatio: "9:16" | "1:1" | "16:9";
  exportUrl: string;
  thumbnailUrl: string;
  favorite: boolean;
  socialPackage: {
    title: string;
    postText: string;
    hashtags: string[];
    platformSuggestion: Record<Platform, string>;
  };
}

export interface SourceVideo {
  id: string;
  projectId: string;
  sourceType: SourceType;
  sourceUrl?: string;
  fileName?: string;
  mimeType?: string;
  durationSec: number;
  width?: number;
  height?: number;
  storagePath: string;
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  status: ProjectStatus;
  sourceType: SourceType;
  sourceUrl?: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  targetPlatforms: Platform[];
  targetDurations: ClipDuration[];
  sourceVideo?: SourceVideo;
  transcript: TranscriptSegment[];
  clips: GeneratedClip[];
  compareTopClipIds: string[];
}

export interface DashboardStats {
  totalProjects: number;
  totalClips: number;
  averageViralScore: number;
  activeExports: number;
}

export interface ProcessingJob {
  id: string;
  projectId: string;
  type: "analysis" | "export";
  status: ProjectStatus;
  clipId?: string;
  progress: number;
  outputUrl?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FeatureFlags {
  teamWorkspaces: boolean;
  brandTemplates: boolean;
  autoPosting: boolean;
}
