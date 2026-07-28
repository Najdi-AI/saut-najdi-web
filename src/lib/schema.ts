import {
  SITE_URL,
  SITE_NAME_AR,
  SITE_NAME_EN,
  SUPPORT_EMAIL,
} from "./site";
import { localePath, type Locale } from "./i18n";

/**
 * JSON-LD builders (blueprint §8.7 + schema map). No `Review`, no
 * `AggregateRating`, no `telephone` — those are forbidden until real.
 */

type JsonLd = Record<string, unknown>;

export function organization(locale: Locale): JsonLd {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    alternateName: locale === "ar" ? SITE_NAME_EN : SITE_NAME_AR,
    url: SITE_URL,
    logo: `${SITE_URL}/brand/symbol-fill.svg`,
    email: SUPPORT_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riyadh",
      addressCountry: "SA",
    },
  };
}

export function webSite(locale: Locale): JsonLd {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    inLanguage: locale === "ar" ? "ar" : "en",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function softwareApplication(locale: Locale): JsonLd {
  const featureList =
    locale === "ar"
      ? [
          "وكيل صوتي بالذكاء الاصطناعي يرد على المكالمات بلهجات سعودية (نجدي، حجازي، خليجي) وبالعربية والإنجليزية",
          "تصعيد فوري لموظف بشري بكامل سياق المكالمة",
          "إشراف مباشر: استماع وهمس واستلام المكالمة من لوحة التحكم",
          "قاعدة معرفة عربية من ملفات PDF وWord مع تعرّف ضوئي عربي",
          "حجوزات ومواعيد تلقائية مع تقويم للفريق",
          "قنوات نصية: واتساب وتيليجرام ودردشة الموقع في صندوق موحد",
          "لوحة تحكم بسجل المكالمات والنصوص والتسجيلات والملخصات",
          "سجل تدقيق غير قابل للتعديل وحذف تلقائي للتسجيلات بعد 90 يوماً",
        ]
      : [
          "AI voice agent answering calls in Saudi dialects (Najdi, Hijazi, Khaleeji), Arabic and English",
          "Instant escalation to a human employee with full conversation context",
          "Live supervision: listen, whisper, or take over from the dashboard",
          "Arabic knowledge base from PDF/Word documents with true Arabic OCR",
          "Automatic bookings with a team-managed reservations calendar",
          "Text channels: WhatsApp, Telegram and website chat in one inbox",
          "Dashboard with call logs, transcripts, recordings and summaries",
          "Append-only audit log and automatic 90-day recording deletion",
        ];
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: locale === "ar" ? SITE_NAME_AR : SITE_NAME_EN,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    featureList,
    publisher: { "@id": `${SITE_URL}/#organization` },
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

export function breadcrumbs(
  locale: Locale,
  crumbs: { name: string; path: string }[],
): JsonLd {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${localePath(locale, c.path)}`,
    })),
  };
}

export function service(locale: Locale, name: string, description: string): JsonLd {
  return {
    "@type": "Service",
    name,
    description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "Saudi Arabia" },
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
