import { cn } from "@/lib/utils";

export function Badge({ label, tone = "default" }: { label: string; tone?: "default" | "warm" | "gold" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
        tone === "default" && "bg-cyan-400/10 text-cyan-200 ring-1 ring-cyan-400/20",
        tone === "warm" && "bg-rose-400/10 text-rose-200 ring-1 ring-rose-400/20",
        tone === "gold" && "bg-amber-400/10 text-amber-200 ring-1 ring-amber-400/20"
      )}
    >
      {label}
    </span>
  );
}
