import { Captions, Film, Layers3, Radar, Rocket, WandSparkles } from "lucide-react";
import { Card } from "@/components/shared/card";

const features = [
  {
    icon: Radar,
    title: "Deep video analysis",
    body: "Score transcript, visual motion, speaker emotion, pacing shifts, scene cuts, and audience hook density."
  },
  {
    icon: WandSparkles,
    title: "Trend-aware ranking",
    body: "Use configurable platform weights for TikTok, Shorts, Reels, and Facebook Reels."
  },
  {
    icon: Film,
    title: "Coherent clip generation",
    body: "Produce 10 polished clips with smart in/out points, hook-first openings, and CTA endings."
  },
  {
    icon: Captions,
    title: "Dynamic captions",
    body: "Generate editable social-style captions with important word highlights and packaging metadata."
  },
  {
    icon: Layers3,
    title: "Creator-grade editing",
    body: "Vertical reframing, caption overlays, transitions, end cards, and aspect-ratio controls."
  },
  {
    icon: Rocket,
    title: "Export-ready workflow",
    body: "Track processing jobs, compare top clips, download exports, and prep titles, hashtags, and post copy."
  }
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="mb-10 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-200/70">Features</p>
        <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">Built for modern creator teams and AI video ops.</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title} className="rounded-[28px]">
            <feature.icon className="h-8 w-8 text-cyan-300" />
            <h3 className="mt-5 text-xl font-semibold text-white">{feature.title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{feature.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
