import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { localePath } from "@/lib/i18n";

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

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return paths.flatMap((path) =>
    (["ar", "en"] as const).map((locale) => ({
      url: `${SITE_URL}${localePath(locale, path)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : path === "product/human-handoff" ? 0.9 : 0.7,
      alternates: {
        languages: {
          ar: `${SITE_URL}${localePath("ar", path)}`,
          en: `${SITE_URL}${localePath("en", path)}`,
        },
      },
    })),
  );
}
