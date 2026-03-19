# ClipForge AI

ClipForge AI is a production-style Next.js 15 SaaS MVP for turning one long-form video into 10 polished short-form clips. The current implementation ships with mocked AI analysis, local file storage, demo auth, and a scalable architecture for plugging in real transcription, vision, queueing, storage, and export providers later.

## Stack

- Next.js 15 App Router
- React 19 + TypeScript
- Tailwind CSS
- NextAuth credentials demo flow
- Prisma schema for PostgreSQL
- Local JSON mock persistence for the MVP runtime
- FFmpeg-ready processing architecture
- BullMQ-ready job abstraction

## What is included

- Premium SaaS landing page
- Login and signup screens
- Protected creator dashboard
- Video intake flow for YouTube URLs, MP4 uploads, and future web-hosted sources
- Project storage and job statuses
- Mock AI pipeline for transcription, scene detection, emotion scoring, CTA suggestions, and viral clip ranking
- Top 10 clip results UI
- Clip editor for title, timing, aspect ratio, favorite state, and CTA
- Export job endpoint
- Prisma schema covering the requested production entities
- Seed script and local mock database
- Feature-flag scaffold for team workspaces, brand templates, and auto-posting

## Local setup

1. Create the project env file.

```bash
cp .env.example .env
```

2. Install dependencies.

```bash
npm install
```

3. Start the app.

```bash
npm run dev
```

4. Open `http://localhost:3000`.

5. Use the demo credentials from `.env.example`:
   `demo@clipforge.ai` / `Demo123!`

## Optional Prisma/PostgreSQL setup

The runtime MVP defaults to the local JSON store so it works without a live database. To wire Prisma into a real PostgreSQL database:

1. Start PostgreSQL.
2. Set `DATABASE_URL` in `.env`.
3. Set `USE_PRISMA=true`.
4. Run:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

## Main folders

- `app/`: App Router pages and API routes
- `components/`: UI building blocks and dashboard/editor modules
- `lib/ai/`: provider interfaces, scoring engines, and processing pipeline
- `lib/db/`: mock store, repository layer, and Prisma client
- `lib/storage/`: local upload storage abstraction
- `prisma/`: schema and seed
- `types/`: shared TypeScript domain types

## What is mocked right now

- AI transcription provider
- Scene and emotion detection
- Hook and highlight selection
- Viral scoring output
- Caption token generation
- Export rendering
- Stripe billing
- BullMQ execution
- S3 / GCS storage
- Real FFmpeg processing

## Where to plug in real providers

- Transcription:
  Replace `lib/ai/providers/mock-providers.ts` with OpenAI Whisper, Deepgram, AssemblyAI, or Google Speech.
- Vision and scene analysis:
  Replace the same provider layer with OpenAI vision/video tooling, AWS Rekognition, Google Video Intelligence, or TwelveLabs.
- Trend scoring:
  Extend `lib/ai/engines/trend-scoring.ts` to ingest platform analytics, posting performance, or your own historical clip data.
- Rendering and exports:
  Add FFmpeg orchestration in a job worker and map export outputs to S3 or GCS.
- Queueing:
  Replace the simple job abstraction in `lib/jobs/job-runner.ts` with BullMQ workers backed by Redis.
- Storage:
  Swap `lib/storage/local-storage.ts` for S3 or GCS adapters without changing intake route contracts.

## Recommended production next steps

1. Replace demo credentials auth with Clerk or a full NextAuth + Prisma adapter flow.
2. Move runtime persistence from JSON to PostgreSQL and enforce repository parity between mock and Prisma implementations.
3. Add Redis + BullMQ workers for analysis and export queues.
4. Add FFmpeg composition jobs for reframing, subtitle burn-in, transitions, and CTA cards.
5. Add signed asset URLs and object storage.
6. Add observability, structured audit logs, rate limiting, and Sentry.
7. Add billing, usage metering, and subscription gating.
8. Add real upload resumability and larger-file handling.

## Suggested providers

- Transcription:
  OpenAI Whisper, Deepgram, AssemblyAI
- Vision / video understanding:
  TwelveLabs, Google Video Intelligence, AWS Rekognition, OpenAI multimodal APIs
- Trend analysis:
  Internal analytics warehouse, TikTok Creative Center data, YouTube Analytics, Meta performance exports
- Video processing:
  FFmpeg, AWS MediaConvert, Mux, or Cloudinary

## Local commands

```bash
npm run dev
npm run build
npm run lint
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```
