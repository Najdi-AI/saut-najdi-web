import type { Locale } from "./i18n";

/**
 * «N دقائق قراءة» with Arabic number agreement: دقيقة for 1, دقيقتين for 2
 * (the dual carries the number, so no digit), دقائق when the last two
 * digits are 3-10, and دقيقة again from 11 (11-99, 100, 101-102...).
 * Digits stay Latin (blueprint §2.1).
 */
function arReadTime(m: number): string {
  if (m === 1) return "دقيقة قراءة";
  if (m === 2) return "دقيقتين قراءة";
  const lastTwo = m % 100;
  return `${m} ${lastTwo >= 3 && lastTwo <= 10 ? "دقائق" : "دقيقة"} قراءة`;
}

/**
 * Blog chrome strings and date formatting. Separate from content/blog.ts so
 * the posts file stays purely content, and separate from content/chrome.ts
 * because these are section-scoped rather than site-wide.
 */
export const blogStrings = {
  ar: {
    h1: "المدونة",
    lead:
      "مقالات عن الرد الآلي على المكالمات، وحماية البيانات، واللهجات السعودية في أنظمة الصوت — مكتوبة لمن يقيّم حلاً فعلياً، لا لمحركات البحث.",
    readTime: arReadTime,
    backToBlog: "كل المقالات",
    published: "نُشر في",
    ctaTitle: "تبي تشوف هذا الكلام على أرض الواقع؟",
    ctaBody:
      "احجز عرضاً تعريفياً مدته 30 دقيقة، وجرّب الوكيل بلهجة عملائك وبأسئلتك أنت.",
    ctaButton: "احجز عرضاً تعريفياً",
    related: "اقرأ أيضاً",
    homeHeading: "من المدونة",
    homeLead: "مقالات لمن يقيّم حلاً فعلياً — لا محتوى مكتوب لمحركات البحث.",
    homeCta: "كل المقالات",
  },
  en: {
    h1: "Blog",
    lead:
      "Writing on automated call answering, data protection, and Saudi dialects in voice systems — written for people evaluating a real solution, not for search engines.",
    readTime: (m: number) => `${m} min read`,
    backToBlog: "All articles",
    published: "Published",
    ctaTitle: "Want to see this in practice?",
    ctaBody:
      "Book a 30-minute demo and test the agent in your customers' dialect, with your own questions.",
    ctaButton: "Book a demo",
    related: "Read next",
    homeHeading: "From the blog",
    homeLead: "Written for people evaluating a real solution — not for search engines.",
    homeCta: "All articles",
  },
} as const;

/**
 * Gregorian dates in both locales.
 *
 * `ar-SA` alone resolves to the Islamic calendar in most runtimes, which would
 * print a Hijri date next to an ISO `datetime` attribute holding a Gregorian
 * one — two different dates on the same element. `-u-ca-gregory` pins the
 * calendar so the visible text and the machine-readable value agree, and
 * `-nu-latn` pins Latin digits: `ar-SA` defaults to Arabic-Indic (١٨ أغسطس
 * ٢٠٢٦), which breaks blueprint §2.1 and sat next to the Latin read time.
 */
/**
 * Cover art, DERIVED from the slug rather than stored per post.
 *
 * A field would be one more thing to keep in sync, and its failure mode is
 * silent — a typo'd path renders a broken image and a dead og:image. The
 * generator writes `public/blog/<slug>.png`, so the slug already is the
 * contract. A post without a file will fail visibly in review, which is the
 * right way round.
 *
 * 1200×630 so the same asset serves the page header, og:image and the
 * BlogPosting JSON-LD instead of maintaining three sizes.
 */
export const POST_IMAGE_W = 1200;
export const POST_IMAGE_H = 630;
export function postImage(post: { slug: string; cover?: string }): string {
  return post.cover ?? `/blog/${post.slug}.png`;
}

export function formatPostDate(iso: string, locale: Locale): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(d);
}
