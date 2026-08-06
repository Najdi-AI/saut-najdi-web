import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/i18n";
import { updated } from "@/content/updated";

/** All indexable pages, both locales, with hreflang alternates (§8.6). */
const paths = [
  "",
  "how-it-works",
  "product/human-handoff",
  "security",
  "demo",
  "contact",
  "about",
  "faq",
  "privacy",
  "terms",
  "dpa",
];

const keyOf = (p: string) => (p === "" ? "home" : p);
const LEGAL = new Set(["privacy", "terms", "dpa"]);
const OFTEN = new Set(["", "faq", "demo"]);

function freq(p: string): "weekly" | "monthly" | "yearly" {
  if (LEGAL.has(p)) return "yearly";
  if (OFTEN.has(p)) return "weekly";
  return "monthly";
}

/**
 * lastModified reads the hand-maintained dates in src/content/updated.ts, not
 * build time: a lastmod that always equals the fetch date teaches crawlers to
 * ignore the field, forfeiting the one crawl-scheduling signal a small site
 * has. Bump the date there when a page's copy actually changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return paths.flatMap((path) =>
    (["ar", "en"] as const).map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified: new Date(updated[keyOf(path)]),
      changeFrequency: freq(path),
      priority: path === "" ? 1 : path === "product/human-handoff" ? 0.9 : 0.7,
      alternates: {
        languages: {
          ar: `${SITE_URL}${localePath("ar", path)}`,
          en: `${SITE_URL}${localePath("en", path)}`,
          // Mirrors the page-level hreflang in src/lib/seo.ts — the two
          // signals disagreeing is an avoidable crawler ambiguity.
          "x-default": `${SITE_URL}${localePath("ar", path)}`,
        },
      },
    })),
  );
}
