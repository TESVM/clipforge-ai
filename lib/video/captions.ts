import type { CaptionToken } from "@/types";
import { createId } from "@/lib/utils";

export function captionTextFromTokens(tokens: CaptionToken[]) {
  return tokens.map((token) => token.text).join(" ").trim();
}

export function buildCaptionTokensFromText(text: string, startMs: number, endMs: number): CaptionToken[] {
  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (!words.length) {
    return [];
  }

  const duration = Math.max(1, endMs - startMs);
  const step = Math.max(200, Math.floor(duration / words.length));

  return words.map((word, index) => ({
    id: createId("cap"),
    startMs: startMs + index * step,
    endMs: Math.min(endMs, startMs + (index + 1) * step),
    text: word,
    highlighted: index % 3 === 0
  }));
}
