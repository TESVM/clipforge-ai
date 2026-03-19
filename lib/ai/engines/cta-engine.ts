import type { TranscriptSegment } from "@/types";

export function suggestCta(transcript: TranscriptSegment[]) {
  const corpus = transcript.map((segment) => segment.text.toLowerCase()).join(" ");

  if (corpus.includes("consult") || corpus.includes("client")) {
    return "Book a consultation";
  }

  if (corpus.includes("shop") || corpus.includes("product")) {
    return "Shop now";
  }

  if (corpus.includes("website") || corpus.includes("visit")) {
    return "Visit our website";
  }

  if (corpus.includes("community") || corpus.includes("comment")) {
    return "Comment your thoughts";
  }

  return "Follow for more";
}
