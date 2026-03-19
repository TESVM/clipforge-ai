import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}

export function Button({ className, asChild, variant = "primary", children, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 disabled:cursor-not-allowed disabled:opacity-60",
        variant === "primary" &&
          "bg-cyan-400 text-slate-950 shadow-glow hover:bg-cyan-300",
        variant === "secondary" &&
          "border border-white/10 bg-white/5 text-white hover:border-cyan-400/40 hover:bg-white/10",
        variant === "ghost" && "text-slate-300 hover:bg-white/5 hover:text-white",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
