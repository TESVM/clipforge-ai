import { Prisma, PrismaClient } from "@prisma/client";
import { createMockProject } from "../lib/mock/seed-data";

const prisma = new PrismaClient();

function asJson(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@clipforge.ai" },
    update: {},
    create: {
      email: "demo@clipforge.ai",
      name: "ClipForge Demo"
    }
  });

  await prisma.subscriptionPlan.upsert({
    where: { id: "seed-subscription-plan" },
    update: {},
    create: {
      id: "seed-subscription-plan",
      userId: user.id,
      tier: "pro",
      status: "active",
      stripePrice: "price_demo_pro"
    }
  });

  const project = createMockProject({
    userId: user.id
  });

  await prisma.exportJob.deleteMany({});
  await prisma.generatedClip.deleteMany({});
  await prisma.clipCandidate.deleteMany({});
  await prisma.transcriptSegment.deleteMany({});
  await prisma.sourceVideo.deleteMany({});
  await prisma.project.deleteMany({
    where: {
      userId: user.id
    }
  });

  await prisma.project.create({
    data: {
      id: project.id,
      userId: user.id,
      title: project.title,
      description: project.description,
      status: "completed",
      sourceType: project.sourceType,
      sourceUrl: project.sourceUrl,
      targetPlatforms: project.targetPlatforms,
      targetDurations: project.targetDurations,
      sourceVideo: {
        create: {
          sourceType: project.sourceType,
          sourceUrl: project.sourceUrl,
          fileName: "demo-source.mp4",
          mimeType: "video/mp4",
          durationSec: 65,
          width: 1920,
          height: 1080,
          storagePath: "/samples/source-video.mp4"
        } as never
      },
      transcript: {
        create: project.transcript.map((segment) => ({
          id: segment.id,
          startMs: segment.startMs,
          endMs: segment.endMs,
          text: segment.text,
          speaker: segment.speaker,
          emphasis: segment.emphasis,
          emotion: segment.emotion,
          keywords: segment.keywords
        }))
      },
      clipCandidates: {
        create: project.clips.map((clip) => ({
          id: `cand_${clip.id}`,
          title: clip.title,
          summary: clip.summary,
          startMs: clip.startMs,
          endMs: clip.endMs,
          duration: clip.duration,
          viralScore: clip.viralScore,
          platforms: clip.platforms,
          badges: clip.badges,
          hookText: clip.hookText,
          ctaText: clip.ctaText,
          transcriptSegmentIds: clip.transcriptSegmentIds,
          metadata: asJson(clip.breakdown)
        }))
      },
      generatedClips: {
        create: project.clips.map((clip) => ({
          id: clip.id,
          title: clip.title,
          summary: clip.summary,
          startMs: clip.startMs,
          endMs: clip.endMs,
          duration: clip.duration,
          viralScore: clip.viralScore,
          aspectRatio: "vertical",
          favorite: clip.favorite,
          exportUrl: clip.exportUrl,
          thumbnailUrl: clip.thumbnailUrl,
          hookText: clip.hookText,
          ctaText: clip.ctaText,
          badges: clip.badges,
          platforms: clip.platforms,
          captions: asJson(clip.captions),
          socialPackage: asJson(clip.socialPackage)
        }))
      }
    }
  });

  await prisma.trendProfile.createMany({
    data: [
      { platform: "tiktok", weights: { hook: 18, retention: 14, trend: 10 } },
      { platform: "youtubeShorts", weights: { clarity: 12, retention: 16, emphasis: 10 } },
      { platform: "instagramReels", weights: { emotion: 14, shareability: 10, hook: 16 } },
      { platform: "facebookReels", weights: { cta: 12, clarity: 12, replay: 8 } }
    ],
    skipDuplicates: true
  });

  await prisma.exportJob.create({
    data: {
      projectId: project.id,
      clipId: project.clips[0]?.id,
      status: "completed",
      preset: "instagram-reels",
      outputPath: "/samples/export-demo.mp4",
      metadata: asJson({
        title: project.clips[0]?.socialPackage.title,
        hashtags: project.clips[0]?.socialPackage.hashtags
      })
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
