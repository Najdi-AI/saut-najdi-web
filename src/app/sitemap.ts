import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/i18n";
import { updated } from "@/content/updated";
import { getAllPosts } from "@/lib/allPosts";

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
/** One entry per locale, with the reciprocal hreflang block. */
function entries(
  path: string,
  lastModified: Date,
  changeFrequency: "weekly" | "monthly" | "yearly",
  priority: number,
): MetadataRoute.Sitemap {
  return (["ar", "en"] as const).map((locale) => ({
    url: `${SITE_URL}${localePath(locale, path)}`,
    lastModified,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        ar: `${SITE_URL}${localePath("ar", path)}`,
        en: `${SITE_URL}${localePath("en", path)}`,
        // Mirrors the page-level hreflang in src/lib/seo.ts — the two
        // signals disagreeing is an avoidable crawler ambiguity.
        "x-default": `${SITE_URL}${localePath("ar", path)}`,
      },
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sortedPosts_ = await getAllPosts();
  const staticPages = paths.flatMap((path) =>
    entries(path, new Date(updated[keyOf(path)]), freq(path), prio(path)),
  );

  /**
   * Posts date themselves from their own `date` field, not from
   * content/updated.ts. That map is a hand-maintained record of when a fixed
   * page's copy changed; a post's publication date is intrinsic to the post,
   * and duplicating it into a second file is how the two drift.
   *
   * The index is `weekly` because it genuinely changes whenever a post lands.
   * Posts are `monthly` — they are written to stay correct, not to churn, and
   * claiming otherwise trains crawlers to discount the field everywhere.
   */
  const blogIndexDate = sortedPosts_.length
    ? new Date(sortedPosts_[0].date)
    : new Date(updated.home);
  const blogPages = [
    ...entries("blog", blogIndexDate, "weekly", 0.8),
    ...sortedPosts_.flatMap((p) =>
      entries(`blog/${p.slug}`, new Date(p.date), "monthly", 0.7),
    ),
  ];

  return [...staticPages, ...blogPages];
}
