import {
  SITE_URL,
  SITE_NAME_AR,
  SITE_NAME_EN,
  SUPPORT_EMAIL,
  POSITIONING_AR,
  POSITIONING_EN,
  TAGLINE_AR,
  TAGLINE_EN,
} from "./site";
import { localePath, type Locale } from "./i18n";
import { SOCIAL } from "@/content/social";

/**
 * JSON-LD builders (blueprint §8.7 + schema map). No `Review`, no
 * `AggregateRating`, no `telephone` — those are forbidden until real, and
 * there is no phone number to put in one anyway (blueprint §2.2).
 *
 * Every node carries a stable `@id` and references its neighbours by `@id`
 * rather than repeating them: that is what turns 22 pages of loose nodes into
 * one entity graph a knowledge engine can actually resolve.
 */

type JsonLd = Record<string, unknown>;

/**
 * Derived, never hand-maintained. content/social.ts is the one list, and the
 * footer's icon row renders from it too — so the profiles a visitor can click
 * and the profiles this graph claims as the same entity cannot drift apart.
 *
 * That file documents the verification rule and which platforms are
 * deliberately excluded; add profiles there, not here.
 */
export const SAME_AS: string[] = SOCIAL.map((s) => s.url);

/**
 * Topical scope for the Organization. These are claims about what we work on,
 * not about what we have shipped — every one traces to a live capability or a
 * page on this site.
 */
const KNOWS_ABOUT = {
  ar: [
    "الوكيل الصوتي بالذكاء الاصطناعي",
    "الرد الآلي على المكالمات",
    "مراكز الاتصال",
    "خدمة العملاء",
    "اللهجة النجدية",
    "اللهجة الحجازية",
    "اللهجة الشامية",
    "التعرف على الكلام العربي",
    "قواعد المعرفة العربية",
    "واتساب للأعمال",
    "تيليجرام",
    "نظام حماية البيانات الشخصية السعودي (PDPL)",
  ],
  en: [
    "AI voice agents",
    "Automated call answering",
    "Contact centres",
    "Customer service automation",
    "Najdi Arabic dialect",
    "Hijazi Arabic dialect",
    "Levantine Arabic dialect",
    "Arabic speech recognition",
    "Arabic knowledge bases",
    "WhatsApp Business",
    "Telegram",
    "Saudi Personal Data Protection Law (PDPL)",
  ],
} as const;

export function organization(locale: Locale): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    // Both names in both locales: the brand is searched transliterated as
    // often as it is searched in Arabic.
    alternateName: [SITE_NAME_EN, SITE_NAME_AR],
    url: SITE_URL,
    description: locale === "ar" ? POSITIONING_AR : POSITIONING_EN,
    slogan: locale === "ar" ? TAGLINE_AR : TAGLINE_EN,
    // An ImageObject with real dimensions, not a bare URL string: Google's
    // logo handling effectively ignores SVG, which is why the previous
    // symbol-fill.svg value was doing nothing.
    logo: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#logo`,
      url: `${SITE_URL}/brand/logo-512.png`,
      contentUrl: `${SITE_URL}/brand/logo-512.png`,
      width: 512,
      height: 512,
      caption: locale === "ar" ? "شعار صوت نجدي" : "Saut Najdi logo",
    },
    image: { "@id": `${SITE_URL}/#logo` },
    email: SUPPORT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    // najdiai.com is the PARENT company's own site — referenced as an entity
    // relationship only. Never redirected, never treated as a mirror.
    parentOrganization: {
      "@type": "Organization",
      name: "Najdi AI",
      url: "https://najdiai.com",
    },
    // Email only. `telephone` stays out until a real number exists.
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: SUPPORT_EMAIL,
        availableLanguage: ["ar", "en"],
        areaServed: "SA",
      },
    ],
    knowsAbout: KNOWS_ABOUT[locale],
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function webSite(locale: Locale): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    alternateName: locale === "ar" ? SITE_NAME_EN : SITE_NAME_AR,
    description: locale === "ar" ? POSITIONING_AR : POSITIONING_EN,
    inLanguage: locale === "ar" ? "ar-SA" : "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
    // Deliberately NO potentialAction/SearchAction: there is no site search
    // endpoint, and declaring one that 404s is a broken signal, not a win.
  };
}

/**
 * The per-page node every branch of the graph hangs off. Without it the
 * Organization node on an inner page is an orphan with nothing to say about
 * the page it sits on.
 */
export function webPage(
  locale: Locale,
  path: string,
  name: string,
  description: string,
  dateModified: string,
): JsonLd {
  const url = `${SITE_URL}${localePath(locale, path)}`;
  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    dateModified,
    inLanguage: locale === "ar" ? "ar-SA" : "en",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
    primaryImageOfPage: { "@id": `${SITE_URL}/#logo` },
    // The root emits no BreadcrumbList, so it must not reference one — a
    // dangling @id is worse than an absent property.
    ...(path ? { breadcrumb: { "@id": `${url}#breadcrumb` } } : {}),
  };
}

export function softwareApplication(locale: Locale): JsonLd {
  const featureList =
    locale === "ar"
      ? [
          "وكيل صوتي بالذكاء الاصطناعي يرد على المكالمات بلهجات سعودية (نجدي، حجازي، شامي) وبالعربية والإنجليزية",
          "تصعيد فوري لموظف بشري بكامل سياق المكالمة",
          "إشراف مباشر: استماع وهمس واستلام المكالمة من لوحة التحكم",
          "قاعدة معرفة عربية من ملفات PDF وWord مع تعرّف ضوئي عربي",
          "حجوزات ومواعيد تلقائية مع تقويم للفريق",
          "قنوات نصية: واتساب وتيليجرام ودردشة الموقع في صندوق موحد",
          "لوحة تحكم بسجل المكالمات والنصوص والتسجيلات والملخصات",
          "سجل تدقيق غير قابل للتعديل وحذف تلقائي للتسجيلات بعد 90 يوماً",
        ]
      : [
          "AI voice agent answering calls in Saudi dialects (Najdi, Hijazi, Levantine), Arabic and English",
          "Instant escalation to a human employee with full conversation context",
          "Live supervision: listen, whisper, or take over from the dashboard",
          "Arabic knowledge base from PDF/Word documents with true Arabic OCR",
          "Automatic bookings with a team-managed reservations calendar",
          "Text channels: WhatsApp, Telegram and website chat in one inbox",
          "Dashboard with call logs, transcripts, recordings and summaries",
          "Append-only audit log and automatic 90-day recording deletion",
        ];
  // This node cannot earn a rich result: Google requires `offers` or
  // `aggregateRating` for that, and we have neither honestly (no public
  // pricing — blueprint §6.5 — and no consented reviews). It exists purely
  // as an entity signal, which is reason enough to keep it accurate.
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    description: locale === "ar" ? POSITIONING_AR : POSITIONING_EN,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Contact center software",
    operatingSystem: "Web",
    inLanguage: ["ar", "en"],
    url: SITE_URL,
    featureList,
    publisher: { "@id": `${SITE_URL}/#organization` },
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export function faqPage(locale: Locale, path: string, items: FaqItem[]): JsonLd {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}${localePath(locale, path)}#faq`,
    mainEntity: items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

/**
 * `leafPath` is the page the trail ends on — it is what the `@id` is built
 * from, so `webPage().breadcrumb` resolves to this node instead of dangling.
 */
export function breadcrumbs(
  locale: Locale,
  leafPath: string,
  crumbs: { name: string; path: string }[],
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${localePath(locale, leafPath)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${localePath(locale, c.path)}`,
    })),
  };
}

/**
 * One Service entity for the whole product, referenced from several pages by
 * `@id` so the mentions consolidate instead of minting a duplicate per page.
 *
 * The name/description are FIXED — an `@id` is an identity assertion, so the
 * same `#service` node must carry the same payload on every page that emits
 * it. Per-page nuance belongs in that page's WebPage node, not here.
 */
export function service(locale: Locale): JsonLd {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}/#service`,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    description: locale === "ar" ? POSITIONING_AR : POSITIONING_EN,
    serviceType:
      locale === "ar"
        ? "وكيل صوتي بالذكاء الاصطناعي لخدمة العملاء"
        : "AI voice agent for customer service",
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
    availableLanguage: ["ar", "en"],
    // The demo booking is the only real intake channel — never `servicePhone`.
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: `${SITE_URL}${localePath(locale, "demo")}`,
      name: locale === "ar" ? "احجز عرضاً تعريفياً" : "Book an intro demo",
    },
  };
}

/**
 * Google retired HowTo rich results, so this earns no SERP feature. It is
 * here because Bing, Perplexity and the AI crawlers still parse it, and the
 * step data already exists in the page source — the transform is free.
 */
export function howTo(
  locale: Locale,
  path: string,
  name: string,
  description: string,
  steps: readonly { title: string; body: string }[],
): JsonLd {
  const url = `${SITE_URL}${localePath(locale, path)}`;
  return {
    "@type": "HowTo",
    "@id": `${url}#howto`,
    name,
    description,
    inLanguage: locale === "ar" ? "ar-SA" : "en",
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
      url: `${url}#step-${i + 1}`,
    })),
  };
}

/**
 * The blog index. `Blog` + an itemList of its posts by `@id`, so the posts and
 * the index resolve as one structure rather than as unrelated documents.
 */
export function blogIndex(
  locale: Locale,
  name: string,
  description: string,
  postUrls: string[],
): JsonLd {
  return {
    "@type": "Blog",
    "@id": `${SITE_URL}${localePath(locale, "blog")}#blog`,
    name,
    description,
    url: `${SITE_URL}${localePath(locale, "blog")}`,
    inLanguage: locale === "ar" ? "ar-SA" : "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
    blogPost: postUrls.map((u) => ({ "@id": `${u}#post` })),
  };
}

/**
 * One post.
 *
 * `author` is the Organization, not a person — invented bylines are the most
 * common fabrication in generated blog schema, and there is no named author to
 * claim. `dateModified` falls back to `datePublished` rather than to build
 * time, which would relabel every post on every deploy.
 *
 * `image` is the post's own 1200×630 cover as a full ImageObject rather than a
 * bare URL — Google wants width and height to consider an image for rich
 * results, and a naked string gives it neither.
 */
export function blogPosting(
  locale: Locale,
  slug: string,
  title: string,
  description: string,
  datePublished: string,
  dateModified: string,
  keywords: string[],
  wordCount: number,
  image: { url: string; width: number; height: number },
): JsonLd {
  const url = `${SITE_URL}${localePath(locale, `blog/${slug}`)}`;
  return {
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@id": `${url}#webpage` },
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: locale === "ar" ? "ar-SA" : "en",
    keywords,
    wordCount,
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    isPartOf: { "@id": `${SITE_URL}${localePath(locale, "blog")}#blog` },
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}${image.url}`,
      contentUrl: `${SITE_URL}${image.url}`,
      width: image.width,
      height: image.height,
      caption: title,
    },
  };
}

export function siteNavigation(locale: Locale, items: { name: string; path: string }[]): JsonLd {
  return {
    "@type": "SiteNavigationElement",
    name: items.map((i) => i.name),
    url: items.map((i) => `${SITE_URL}${localePath(locale, i.path)}`),
  };
}

export function graph(...nodes: JsonLd[]): JsonLd {
  return { "@context": "https://schema.org", "@graph": nodes };
}
