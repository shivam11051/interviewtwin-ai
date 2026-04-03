import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "InterviewTwin AI - Ace Your Next Interview",
  description:
    "AI-powered mock interview platform with real-time feedback, personalized coaching, and comprehensive performance analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
