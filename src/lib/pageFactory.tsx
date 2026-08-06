import type { Metadata } from "next";
import { pageMetadata } from "./seo";
import { meta } from "@/content/meta";
import { chrome } from "@/content/chrome";
import { updatedFor } from "@/content/updated";
import { fullFaq } from "@/content/faq";
import { handoffFaq } from "@/components/pages/HumanHandoffPage";
import { securityFaq } from "@/components/pages/SecurityPage";
import { journeySteps } from "@/components/pages/HowItWorksPage";
import { demoFaq } from "@/components/pages/DemoPage";
import {
  graph,
  organization,
  webSite,
  webPage,
  softwareApplication,
  faqPage,
  breadcrumbs,
  service,
  howTo,
  siteNavigation,
} from "./schema";
import { SITE_URL, SUPPORT_EMAIL } from "./site";
import { type Locale } from "./i18n";
import { JsonLd } from "@/components/JsonLd";

/** Path for a meta key: "home" lives at the root. */
function pathOf(key: string): string {
  return key === "home" ? "" : key;
}

export function metaFor(
  locale: Locale,
  key: string,
  opts?: { noindex?: boolean },
): Metadata {
  return pageMetadata({
    locale,
    path: pathOf(key),
    ...meta[locale][key],
    noindex: opts?.noindex,
    // Home's title already carries the brand, so the layout template must not
    // append it a second time.
    absoluteTitle: key === "home",
  });
}

/** Short breadcrumb labels — the visible nav/footer wording, not the SERP title. */
const crumbNames = {
  ar: {
    home: "الرئيسية",
    "how-it-works": "كيف يشتغل",
    "product/human-handoff": "التصعيد للموظف البشري",
    security: "الأمان والبيانات",
    faq: "الأسئلة الشائعة",
    about: "من نحن",
    contact: "تواصل معنا",
    demo: "احجز عرضاً",
  },
  en: {
    home: "Home",
    "how-it-works": "How it works",
    "product/human-handoff": "Human handoff",
    security: "Security & data",
    faq: "FAQ",
    about: "About us",
    contact: "Contact",
    demo: "Book a demo",
  },
} as const;

/** Per-page-type JSON-LD @graph (blueprint §8 schema map). */
export function PageJsonLd({ locale, kind }: { locale: Locale; kind: string }) {
  const c = crumbNames[locale];

  /** The page node every other node on this page hangs off. */
  const wp = (key: string) =>
    webPage(
      locale,
      pathOf(key),
      meta[locale][key].title,
      meta[locale][key].description,
      updatedFor(key),
    );

  /** Home → leaf. There is no /product index page, so no trail is ever 3 deep. */
  const trail = (key: keyof typeof c) =>
    breadcrumbs(locale, key, [
      { name: c.home, path: "" },
      { name: c[key], path: key },
    ]);

  // webSite() rides on EVERY page: webPage().isPartOf points at
  // `/#website`, and each URL is parsed in isolation — without the node in
  // the same @graph that reference dangles on all 22 inner pages.
  let data: Record<string, unknown>;
  switch (kind) {
    case "home":
      // FAQPage markup lives ONLY on /faq. homeFaq is a subset of fullFaq
      // (content/faq.ts), so emitting it here too would publish the same six
      // Q&A entities under two URLs and let Google pick which one to keep.
      data = graph(
        organization(locale),
        webSite(locale),
        wp("home"),
        softwareApplication(locale),
        siteNavigation(locale, chrome[locale].nav.map((n) => ({ name: n.label, path: n.path }))),
      );
      break;
    case "how-it-works":
      data = graph(
        organization(locale),
        webSite(locale),
        wp("how-it-works"),
        service(locale),
        howTo(
          locale,
          "how-it-works",
          locale === "ar"
            ? "كيف يشتغل الرد الآلي بالذكاء الاصطناعي — رحلة مكالمة"
            : "How AI call answering works — one call's journey",
          meta[locale]["how-it-works"].description,
          journeySteps[locale],
        ),
        trail("how-it-works"),
      );
      break;
    case "product/human-handoff":
      data = graph(
        organization(locale),
        webSite(locale),
        wp("product/human-handoff"),
        service(locale),
        faqPage(locale, "product/human-handoff", handoffFaq[locale]),
        trail("product/human-handoff"),
      );
      break;
    case "security":
      data = graph(
        organization(locale),
        webSite(locale),
        wp("security"),
        service(locale),
        faqPage(locale, "security", securityFaq[locale]),
        trail("security"),
      );
      break;
    case "faq":
      data = graph(
        organization(locale),
        webSite(locale),
        wp("faq"),
        faqPage(locale, "faq", fullFaq[locale]),
        trail("faq"),
      );
      break;
    case "demo":
      data = graph(
        organization(locale),
        webSite(locale),
        wp("demo"),
        faqPage(locale, "demo", demoFaq[locale]),
        trail("demo"),
      );
      break;
    case "about":
      // AboutPage IS this page, so it reuses the WebPage node's @id rather
      // than minting a second node at the same URL.
      data = graph(
        organization(locale),
        webSite(locale),
        {
          ...wp("about"),
          "@type": "AboutPage",
          mainEntity: { "@id": `${SITE_URL}/#organization` },
        },
        trail("about"),
      );
      break;
    case "contact":
      data = graph(
        organization(locale),
        webSite(locale),
        {
          ...wp("contact"),
          "@type": "ContactPage",
          // Email only — there is no phone number (blueprint §2.2).
          mainEntity: {
            "@type": "ContactPoint",
            contactType: "customer support",
            email: SUPPORT_EMAIL,
            availableLanguage: ["ar", "en"],
            areaServed: "SA",
          },
        },
        trail("contact"),
      );
      break;
    default:
      data = graph(
        organization(locale),
        webSite(locale),
        wp(kind),
        breadcrumbs(locale, kind, [
          { name: c.home, path: "" },
          { name: meta[locale][kind]?.title ?? kind, path: kind },
        ]),
      );
  }
  return <JsonLd data={data} />;
}
