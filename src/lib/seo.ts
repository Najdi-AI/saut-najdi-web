import type { Metadata } from "next";
import { SITE_URL } from "./site";
import { localePath, type Locale } from "./i18n";

/** Alt text for the generated OG card (src/app/opengraph-image.tsx). */
const OG_ALT = {
  ar: "صوت نجدي — وكيل صوتي سعودي بالذكاء الاصطناعي",
  en: "Saut Najdi — a Saudi AI voice agent",
} as const;

interface PageSeo {
  locale: Locale;
  /** Locale-less path: "", "how-it-works", "product/human-handoff", … */
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
  /** Home only: suppress the layout's "%s — صوت نجدي" template. */
  absoluteTitle?: boolean;
  /**
   * Page-specific social card, e.g. a blog post's cover. Falls back to the
   * generated site-wide card. Must be an absolute path — `metadataBase` on the
   * root layouts resolves it.
   */
  image?: string;
}

/**
 * Per-page metadata (blueprint §8.2–8.4): unique hand-written title and
 * description, self-referencing canonical, reciprocal hreflang with
 * x-default → Arabic.
 *
 * `metadataBase` deliberately lives on the two root layouts, not here — a
 * per-page base only resolves relative URLs on pages that call this helper,
 * which is why the file-convention opengraph-image was never picked up.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
  absoluteTitle,
  image,
}: PageSeo): Metadata {
  const canonical = `${SITE_URL}${localePath(locale, path)}`;
  const ar = `${SITE_URL}${localePath("ar", path)}`;
  const en = `${SITE_URL}${localePath("en", path)}`;
  // Naming the image explicitly is what activates opengraph-image.tsx: an
  // openGraph object without an `images` key suppresses the file convention.
  // A caller-supplied `image` replaces it — same 1200×630 contract, so the
  // alt text and dimensions below hold either way.
  const images = [
    {
      url: image ?? "/opengraph-image",
      width: 1200,
      height: 630,
      // The generated site card keeps its own description; a post cover is
      // better described by that post's title than by a generic brand line.
      alt: image ? title : OG_ALT[locale],
    },
  ];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    // noindex pages get no canonical/hreflang — pointing crawlers at a
    // page they must not index is contradictory (review finding).
    ...(noindex
      ? {}
      : {
          alternates: {
            canonical,
            languages: { ar, en, "x-default": ar },
            // The plain-language brief for AI assistants. robots.txt names it
            // too, but a per-page <link rel="alternate"> is the only pointer a
            // crawler that landed mid-site will ever see.
            types: {
              "text/plain": [
                {
                  url: locale === "ar" ? "/llms-ar.txt" : "/llms.txt",
                  title: "llms.txt",
                },
              ],
              // Site-wide, not blog-only: feed discovery is how a reader
              // subscribes from whatever page they happened to land on, and
              // it is the standard signal aggregators look for in <head>.
              "application/rss+xml": [
                {
                  url: localePath(locale, "feed.xml"),
                  title: locale === "ar" ? "مدونة صوت نجدي" : "Saut Najdi blog",
                },
              ],
            },
          },
        }),
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: locale === "ar" ? "صوت نجدي" : "Saut Najdi",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image ?? "/opengraph-image"],
    },
    // The index/snippet policy lives HERE, per real page, not on the root
    // layouts: a layout-level `robots` is inherited by the 404 boundary too,
    // and a crawler-specific `googlebot` tag OVERRIDES the generic `noindex`
    // Next emits there — which told Googlebot to index our 404s (review
    // finding). The googleBot block lifts the snippet/preview caps that
    // otherwise truncate Arabic answers in AI Overviews.
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
          },
        },
  };
}
