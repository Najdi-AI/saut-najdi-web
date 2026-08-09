import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/i18n";
import { updated } from "@/content/updated";

/** All indexable pages, both locales, with hreflang alternates (§8.6). */
const paths = [
  "",
  "how-it-works",
  "product/human-handoff",
  "product/voice-agent",
  "product/knowledge-base",
  "product/dashboard",
  "product/agent-builder",
  "solutions/clinics",
  "solutions/restaurants",
  "solutions/hotels",
  "solutions/real-estate",
  "solutions/retail",
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
 * Priority is a within-site hint only — it says nothing to Google about this
 * site versus any other, and a sitemap where everything is 1.0 says nothing at
 * all. Home first, the hybrid-handoff differentiator second, then the Wave-2
 * deep dives and sector pages that carry the long tail, then the rest.
 */
function prio(p: string): number {
  if (p === "") return 1;
  if (p === "product/human-handoff") return 0.9;
  if (p.startsWith("solutions/") || p.startsWith("product/")) return 0.8;
  return 0.7;
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
      priority: prio(path),
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
