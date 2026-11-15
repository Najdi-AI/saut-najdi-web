import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { thmanyah } from "../fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatLauncher } from "@/components/ChatLauncher";
import { Gtm, GtmNoScript } from "@/components/Gtm";
import { ThemeScript } from "@/components/ThemeScript";
import { NoScriptReveal } from "@/components/NoScriptReveal";
import { SITE_URL } from "@/lib/site";

/** English mirror of the Arabic root metadata — see (ar)/layout.tsx for why. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Saut Najdi", template: "%s — Saut Najdi" },
  applicationName: "Saut Najdi",
  publisher: "Najd Business Solutions",
  formatDetection: { telephone: false },
  // See (ar)/layout.tsx — robots policy is per-page in pageMetadata().
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#5B6CE5" },
    { media: "(prefers-color-scheme: dark)", color: "#080D1C" },
  ],
};

/** Vercel-only insights — see (ar)/layout.tsx for why. */
const ON_VERCEL = process.env.VERCEL === "1";

/**
 * English root layout — English is a separate piece of writing under /en,
 * never a machine translation (blueprint §2.1).
 */
export default function EnglishRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={thmanyah.variable} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <NoScriptReveal />
      </head>
      <body className="font-sans">
        {/* First child of <body>, per Google's install instructions. */}
        <GtmNoScript />
        <Gtm />
        <Header locale="en" />
        <main id="main">{children}</main>
        <Footer locale="en" />
        <ChatLauncher locale="en" />
        {/* Vercel-only, as in (ar)/layout.tsx: see ON_VERCEL. */}
        {ON_VERCEL && <Analytics />}
        {ON_VERCEL && <SpeedInsights />}
      </body>
    </html>
  );
}
