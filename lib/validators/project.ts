import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(400),
  sourceType: z.enum(["youtube", "upload", "web"]),
  sourceUrl: z.string().url().optional().or(z.literal("")),
  targetPlatforms: z
    .array(z.enum(["tiktok", "youtubeShorts", "instagramReels", "facebookReels"]))
    .min(1),
  targetDurations: z.array(z.union([z.literal(15), z.literal(30), z.literal(45), z.literal(60)])).min(1)
});

export const clipUpdateSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  aspectRatio: z.enum(["9:16", "1:1", "16:9"]).optional(),
  ctaText: z.string().min(3).max(120).optional(),
  captionText: z.string().min(1).max(600).optional(),
  favorite: z.boolean().optional(),
  startMs: z.number().min(0).optional(),
  endMs: z.number().min(1).optional()
});
