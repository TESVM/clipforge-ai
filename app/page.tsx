import { Features } from "@/components/marketing/features";
import { Hero } from "@/components/marketing/hero";
import { Pricing } from "@/components/marketing/pricing";
import { SiteHeader } from "@/components/layout/site-header";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-hero-grid text-white">
      <SiteHeader />
      <Hero />
      <Features />
      <section id="workflow" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {[
            "Ingest YouTube, upload MP4, or connect a web-hosted source.",
            "Analyze transcript, scene changes, emotion, pacing, motion, and speaker focus.",
            "Rank the top highlight moments with trend-aware scoring logic per platform.",
            "Generate 10 coherent clips with captions, vertical reframing, CTA overlays, and export metadata."
          ].map((step, index) => (
            <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-cyan-300">0{index + 1}</p>
              <p className="mt-4 text-lg leading-8 text-slate-200">{step}</p>
            </div>
          ))}
        </div>
      </section>
      <Pricing />
    </div>
  );
}
