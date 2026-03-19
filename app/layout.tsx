import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ClipForge AI",
  description:
    "AI-powered short-form video repurposing platform that turns long-form content into 10 viral-ready clips."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
