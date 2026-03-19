# ClipForge AI

[![Release](https://img.shields.io/github/v/release/TESVM/clipforge-ai)](https://github.com/TESVM/clipforge-ai/releases/tag/v0.1.0)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![FFmpeg](https://img.shields.io/badge/FFmpeg-local%20exports-green)](https://ffmpeg.org/)
[![Status](https://img.shields.io/badge/status-MVP-orange)](https://github.com/TESVM/clipforge-ai)

ClipForge AI is a production-style Next.js app for turning one long video into 10 short-form clips for TikTok, YouTube Shorts, Instagram Reels, and Facebook Reels.

This repo includes:
- a polished landing page and creator dashboard
- demo auth
- project creation from YouTube URLs, uploads, and future web video sources
- a mocked AI analysis pipeline
- editable clips with titles, captions, CTA text, and aspect ratios
- async FFmpeg-based MP4 exports
- Prisma schema and seed files for a future PostgreSQL-backed production setup

## Status

This is an MVP with a real app structure and a mixed mock/real media pipeline:
- real Next.js app
- real local file uploads
- real local FFmpeg exports
- mocked transcript, scoring, and highlight selection logic

## Demo

There is no hosted live demo yet.

Use the local demo instead:
- run the app on `http://127.0.0.1:3001`
- sign in with the demo account
- create a project
- edit a clip
- render and download an MP4

Demo credentials:

```text
demo@clipforge.ai
Demo123!
```

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- NextAuth credentials flow
- Prisma
- PostgreSQL-ready schema
- FFmpeg / ffprobe static binaries
- local JSON persistence for the default demo runtime

## What Works Today

- landing page
- login and signup screens
- protected dashboard
- project intake flow
- past projects and generated clips
- clip editor
- async export jobs
- MP4 export rendering
- burned hook text, caption text, and CTA overlays
- local upload metadata probing for duration and resolution

## What Is Still Mocked

- speech-to-text transcription
- scene detection
- emotion / motion / hook scoring
- viral ranking logic output
- trend intelligence inputs
- social caption generation quality
- team collaboration
- billing
- cloud storage
- Redis/BullMQ workers

## Quick Start

1. Go to the project:

```bash
cd /Users/tes/clipforge-ai
```

2. Create a local env file:

```bash
cp .env.example .env.local
```

3. Set the auth URL in `.env.local`:

```env
NEXTAUTH_URL="http://127.0.0.1:3001"
```

4. Install packages:

```bash
npm install
```

5. Start the app:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
```

6. Open:

```text
http://127.0.0.1:3001
```

7. Log in with:

```text
demo@clipforge.ai
Demo123!
```

## Screens to Explore

- landing page
- dashboard
- project detail page
- clip editor
- export flow

## Simple Test Flow

1. Log in.
2. Create a project with an MP4 or MOV file.
3. Open a generated clip.
4. Edit the caption text, CTA text, and aspect ratio.
5. Save the clip.
6. Click `Render & Download`.
7. Open the downloaded MP4 in QuickTime.

## Local Commands

```bash
npm run dev -- --hostname 127.0.0.1 --port 3001
npm run build
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Project Structure

- `app/` pages and API routes
- `components/` shared UI, dashboard UI, and clip editor UI
- `lib/ai/` mocked providers, engines, and processing pipeline
- `lib/video/` probing, subtitle/caption helpers, and FFmpeg export logic
- `lib/jobs/` local async export queue scaffolding
- `lib/db/` local repository layer and Prisma client
- `lib/storage/` local upload handling
- `prisma/` schema and seed
- `public/uploads/` uploaded and rendered media

## Optional Prisma Setup

By default, the app uses the local JSON store so it runs without a database.

If you want PostgreSQL + Prisma:

1. Start PostgreSQL.
2. Set `DATABASE_URL` in `.env.local`.
3. Set:

```env
USE_PRISMA=true
```

4. Run:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Deployment Notes

For a real deployment, you should replace the local dev choices with production services:

- local JSON store -> PostgreSQL
- detached local export worker -> BullMQ + Redis worker
- local uploads -> S3 or GCS
- local FFmpeg job execution -> worker container or media service
- demo credentials auth -> Clerk or full NextAuth + Prisma adapter

## Deploy on Vercel

This repository is now prepared for a Vercel deployment path, but you need production services behind it.

### Required for Vercel

- PostgreSQL database
- Prisma enabled
- Vercel Blob enabled
- correct `NEXTAUTH_URL`

### Recommended Vercel env vars

Use `.env.vercel.example` as the template:

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="replace-with-a-long-random-string"
DEMO_USER_EMAIL="demo@clipforge.ai"
DEMO_USER_PASSWORD="Demo123!"
USE_PRISMA="true"
STORAGE_MODE="vercel-blob"
EXPORT_EXECUTION_MODE="inline"
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

### Vercel deployment flow

1. Import the GitHub repo into Vercel.
2. Add the environment variables above.
3. Provision a PostgreSQL database.
4. Run Prisma generate/migrate in your deployment workflow.
5. Enable Vercel Blob and add `BLOB_READ_WRITE_TOKEN`.
6. Deploy.

### Important Vercel note

The current Vercel mode uses:
- Prisma for persistent data
- Vercel Blob for uploaded and rendered media
- inline export execution for short demo exports

For real production scale, move export rendering into an external worker service instead of running FFmpeg inside the request lifecycle.

## Suggested Production Providers

- Transcription: OpenAI Whisper, Deepgram, AssemblyAI
- Vision / scene analysis: TwelveLabs, Google Video Intelligence, OpenAI multimodal APIs
- Storage: AWS S3, Google Cloud Storage
- Media processing: FFmpeg, AWS MediaConvert, Mux, Cloudinary
- Queueing: BullMQ + Redis
- Monitoring: Sentry, PostHog, OpenTelemetry

## Recommended Next Steps

1. Replace mock AI scoring with real transcription and scene analysis.
2. Add word-timed animated captions instead of a single burned block.
3. Add face-aware reframing for vertical clips.
4. Add better CTA card design and brand templates.
5. Move export jobs into a persistent worker queue.
6. Add Stripe billing and usage limits.
7. Deploy the app and worker separately.

## Repository

- GitHub: https://github.com/TESVM/clipforge-ai
- First release: https://github.com/TESVM/clipforge-ai/releases/tag/v0.1.0
