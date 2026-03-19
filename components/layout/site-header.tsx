import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/shared/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/30">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold tracking-wide">ClipForge AI</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <a href="#features">Features</a>
          <a href="#workflow">Workflow</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Start Free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
