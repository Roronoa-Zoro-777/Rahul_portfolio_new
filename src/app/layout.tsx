import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionConfig } from "framer-motion";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { SpiderVerseFX } from "@/components/effects/SpiderVerseFX";
import { SpiderShooterPointer } from "@/components/effects/SpiderShooterPointer";
import { SpideyEffects } from "@/components/effects/spidey/SpideyEffects";
import { SITE_URL } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rahul B — Data Analytics Portfolio",
  description:
    "Rahul B's data analytics portfolio: skills, tools, projects, and contact details. Explore interactive dashboards and cinematic data experiences.",
  keywords: [
    "Rahul B",
    "Data Analyst",
    "Data Analytics",
    "Portfolio",
    "Dashboard",
    "SQL",
    "Python",
    "Tableau",
  ],
  authors: [{ name: "Rahul B" }],
  creator: "Rahul B",
  publisher: "Rahul B",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: "Rahul B — Data Analytics Portfolio",
    description: "Explore the data analytics portfolio of Rahul B, featuring interactive dashboards and insights.",
    url: SITE_URL,
    siteName: "Rahul B Portfolio",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rahul B — Data Analytics Portfolio",
    description: "Explore the data analytics portfolio of Rahul B.",
    creator: "@rahulb",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased relative`}
    >
      <body className="relative min-h-full bg-background text-foreground grain">
        <MotionConfig reducedMotion="user">
          <SmoothScrollProvider>
            {children}
            <ScrollToTop />
            <SpiderVerseFX />
            <SpiderShooterPointer />
            <SpideyEffects />
          </SmoothScrollProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
