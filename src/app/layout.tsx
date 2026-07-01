import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Stellarium — 3D Solar System Explorer",
  description:
    "Explore an interactive 3D solar system, learn about every planet, take space quizzes, and climb the cosmic leaderboard. Built with Next.js, React Three Fiber, and Prisma.",
  keywords: [
    "solar system",
    "3D",
    "space",
    "planets",
    "astronomy",
    "React Three Fiber",
    "Next.js",
    "Stellarium",
  ],
  authors: [{ name: "Stellarium" }],
  openGraph: {
    title: "Stellarium — 3D Solar System Explorer",
    description:
      "Explore an interactive 3D solar system, take space quizzes, and climb the cosmic leaderboard.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Stellarium — 3D Solar System Explorer",
    description:
      "Explore an interactive 3D solar system, take space quizzes, and climb the cosmic leaderboard.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
