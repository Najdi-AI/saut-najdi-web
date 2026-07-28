import type { Metadata } from "next";
import { SITE_URL } from "./site";
import { localePath, type Locale } from "./i18n";

interface PageSeo {
  locale: Locale;
  /** Locale-less path: "", "how-it-works", "product/human-handoff", … */
  path: string;
  title: string;
  description: string;
  noindex?: boolean;
}

/**
 * Per-page metadata (blueprint §8.2–8.4): unique hand-written title and
 * description, self-referencing canonical, reciprocal hreflang with
 * x-default → Arabic.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
  noindex,
}: PageSeo): Metadata {
  const canonical = `${SITE_URL}${localePath(locale, path)}`;
  const ar = `${SITE_URL}${localePath("ar", path)}`;
  const en = `${SITE_URL}${localePath("en", path)}`;
  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical,
      languages: { ar, en, "x-default": ar },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: locale === "ar" ? "صوت نجدي" : "Saut Najdi",
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
