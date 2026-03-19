import Link from "next/link";
import { ArrowRight, PlayCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/shared/button";
import { Badge } from "@/components/shared/badge";
import { Card } from "@/components/shared/card";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-20 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge label="AI Viral Clip Engine" />
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white md:text-6xl">
            Turn one long video into 10 viral clips.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            ClipForge AI analyzes transcript, scenes, emotion, motion, hook strength, and platform trends to produce polished short-form edits faster than manual workflows.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/signup">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/dashboard">
                <PlayCircle className="mr-2 h-4 w-4" />
                View Demo
              </Link>
            </Button>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 text-sm text-slate-400">
            <span>YouTube, MP4, and web-hosted video ingestion</span>
            <span>Trend-aware scoring by platform</span>
            <span>9:16 reframing, captions, and CTA overlays</span>
          </div>
        </div>
        <Card className="relative overflow-hidden border-cyan-400/20 bg-slate-950/70 shadow-glow">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-rose-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="relative space-y-5">
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <p className="text-sm text-slate-400">Current project</p>
                <p className="mt-1 font-medium">Founder Podcast Episode 42</p>
              </div>
              <Badge label="Analyzing" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { label: "Viral score", value: "91/100" },
                { label: "Clips generated", value: "10" },
                { label: "Best platform", value: "Instagram Reels" },
                { label: "Top badge", value: "Strong Hook" }
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-xl font-semibold">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/5 to-rose-400/10 p-5">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-cyan-300" />
                <p className="font-medium">Trend-aware hook detection</p>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                “Most founders bury the best insight at minute 23. We surface the payoff first, then edit for retention and conversion.”
              </p>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
