import "../globals.css";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/react";
import { thmanyah } from "../fonts";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatLauncher } from "@/components/ChatLauncher";
import { SITE_URL } from "@/lib/site";

/**
 * Root-level metadata. `metadataBase` lives HERE rather than in pageMetadata
 * so the relative OG/twitter image paths ('/opengraph-image') resolve against
 * the real origin instead of localhost. `title.template` appends the brand to
 * every page title except the home page, which opts out via `absoluteTitle`
 * (its own title already carries the brand and would otherwise blow the SERP
 * budget). The googleBot block lifts the snippet/preview caps that otherwise
 * truncate Arabic answers in AI Overviews.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "صوت نجدي", template: "%s — صوت نجدي" },
  applicationName: "صوت نجدي",
  publisher: "Najdi AI",
  // No phone number exists yet, so stop iOS from linkifying digit runs
  // (order numbers, dates) into dead tel: links.
  formatDetection: { telephone: false },
  // NO `robots` here on purpose — a layout-level directive is inherited by the
  // 404 boundary, where a googlebot-specific "index" overrides Next's own
  // noindex. The per-page policy lives in pageMetadata() (src/lib/seo.ts).
};

/** Next 15 wants theme-color on `viewport`, not `metadata`. */
export const viewport: Viewport = { themeColor: "#5B6CE5" };

/**
 * Arabic root layout — Arabic is the default language and lives at the
 * root (blueprint §2.1). lang/dir are in the server-rendered HTML.
 */
export default function ArabicRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={thmanyah.variable}>
      <body className="font-sans">
        <Header locale="ar" />
        <main id="main">{children}</main>
        <Footer locale="ar" />
        <ChatLauncher locale="ar" />
        <Analytics />
      </body>
    </html>
  );
}
