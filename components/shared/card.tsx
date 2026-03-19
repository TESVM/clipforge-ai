import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_18px_60px_rgba(2,6,23,0.35)] backdrop-blur",
        className
      )}
      {...props}
    />
  );
}
