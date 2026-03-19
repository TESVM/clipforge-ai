import * as Progress from "@radix-ui/react-progress";

export function ProgressBar({ value }: { value: number }) {
  return (
    <Progress.Root className="relative h-2 overflow-hidden rounded-full bg-white/10">
      <Progress.Indicator
        className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-rose-400 transition-transform duration-500"
        style={{ width: `${value}%` }}
      />
    </Progress.Root>
  );
}
