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
import { voiceAgentFaq } from "@/components/pages/VoiceAgentPage";
import { knowledgeBaseFaq } from "@/components/pages/KnowledgeBasePage";
import { dashboardFaq } from "@/components/pages/DashboardPage";
import { agentBuilderFaq } from "@/components/pages/AgentBuilderPage";
import { clinicsFaq } from "@/components/pages/ClinicsPage";
import { restaurantsFaq } from "@/components/pages/RestaurantsPage";
import { hotelsFaq } from "@/components/pages/HotelsPage";
import { realEstateFaq } from "@/components/pages/RealEstatePage";
import { retailFaq } from "@/components/pages/RetailPage";
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
  blogIndex,
  blogPosting,
} from "./schema";
import { readingMinutes, type BlogPost } from "@/content/blog";
import { getAllPosts } from "@/lib/allPosts";
import { postImage, POST_IMAGE_W, POST_IMAGE_H } from "./blog";
import { SITE_URL, SUPPORT_EMAIL } from "./site";
import { localePath, type Locale } from "./i18n";
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
    "product/voice-agent": "الوكيل الصوتي",
    "product/knowledge-base": "قاعدة المعرفة",
    "product/dashboard": "لوحة التحكم",
    "product/agent-builder": "بناء الوكيل",
    "solutions/clinics": "العيادات",
    "solutions/restaurants": "المطاعم",
    "solutions/hotels": "الفنادق",
    "solutions/real-estate": "العقارات",
    "solutions/retail": "التجزئة",
    security: "الأمان والبيانات",
    blog: "المدونة",
    faq: "الأسئلة الشائعة",
    about: "من نحن",
    contact: "تواصل معنا",
    demo: "احجز عرضاً",
  },
  en: {
    home: "Home",
    "how-it-works": "How it works",
    "product/human-handoff": "Human handoff",
    "product/voice-agent": "Voice agent",
    "product/knowledge-base": "Knowledge base",
    "product/dashboard": "Dashboard",
    "product/agent-builder": "Agent builder",
    "solutions/clinics": "Clinics",
    "solutions/restaurants": "Restaurants",
    "solutions/hotels": "Hotels",
    "solutions/real-estate": "Real estate",
    "solutions/retail": "Retail",
    security: "Security & data",
    blog: "Blog",
    faq: "FAQ",
    about: "About us",
    contact: "Contact",
    demo: "Book a demo",
  },
} as const;

/**
 * The nine Wave-2 pages (spec P2-22) differ in exactly one thing — which FAQ
 * they carry — so they share two switch branches instead of nine
 * copy-pasted ones. Adding a tenth page is: page component with an exported
 * faq, an entry here, a crumb label above, and its `kind` in the right branch.
 */
const wave2Faq = {
  "product/voice-agent": voiceAgentFaq,
  "product/knowledge-base": knowledgeBaseFaq,
  "product/dashboard": dashboardFaq,
  "product/agent-builder": agentBuilderFaq,
  "solutions/clinics": clinicsFaq,
  "solutions/restaurants": restaurantsFaq,
  "solutions/hotels": hotelsFaq,
  "solutions/real-estate": realEstateFaq,
  "solutions/retail": retailFaq,
} as const;

/** Per-page-type JSON-LD @graph (blueprint §8 schema map). */
export async function PageJsonLd({ locale, kind }: { locale: Locale; kind: string }) {
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

  /**
   * Home → leaf. There is no /product or /solutions index page, so no trail is
   * ever 3 deep — the middle segment would have to point at a 404.
   */
  const trail = (key: keyof typeof c) =>
    breadcrumbs(locale, key, [
      { name: c.home, path: "" },
      { name: c[key], path: key },
    ]);

  /**
   * A sector page's own Service node, under a PAGE-scoped @id.
   *
   * `/#service` is a single identity whose payload must read the same on every
   * page that emits it (schema.ts), so a sector name can never be written onto
   * it — that would make five pages assert five different names for one
   * entity. This mints a separate, honestly narrower offering instead, named
   * and described from the page's own hand-written meta, and links it back to
   * the product with `isRelatedTo`. Both nodes ship in the sector graph so
   * that reference resolves inside the document rather than dangling.
   */
  const sectorService = (key: string) => ({
    ...service(locale),
    "@id": `${SITE_URL}${localePath(locale, key)}#service`,
    name: meta[locale][key].title,
    description: meta[locale][key].description,
    isRelatedTo: { "@id": `${SITE_URL}/#service` },
  });

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
    case "product/voice-agent":
    case "product/knowledge-base":
    case "product/dashboard":
    case "product/agent-builder":
      // Four framings of ONE product, exactly like product/human-handoff:
      // they reference the canonical /#service rather than each minting a
      // near-duplicate Service entity that would compete with it.
      data = graph(
        organization(locale),
        webSite(locale),
        wp(kind),
        service(locale),
        faqPage(locale, kind, wave2Faq[kind][locale]),
        trail(kind),
      );
      break;
    case "solutions/clinics":
    case "solutions/restaurants":
    case "solutions/hotels":
    case "solutions/real-estate":
    case "solutions/retail":
      data = graph(
        organization(locale),
        webSite(locale),
        wp(kind),
        service(locale),
        sectorService(kind),
        faqPage(locale, kind, wave2Faq[kind][locale]),
        trail(kind),
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
    case "blog":
      data = graph(
        organization(locale),
        webSite(locale),
        wp("blog"),
        blogIndex(
          locale,
          meta[locale].blog.title,
          meta[locale].blog.description,
          (await getAllPosts()).map((p) => `${SITE_URL}${localePath(locale, `blog/${p.slug}`)}`),
        ),
        trail("blog"),
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

/**
 * A blog post's @graph. Separate from PageJsonLd because posts are the only
 * pages keyed by a runtime slug rather than a fixed entry in content/meta.ts,
 * so they cannot use `wp()` / `trail()`, which both read that map.
 *
 * The breadcrumb is three deep — Home › Blog › post — and unlike the product
 * pages that middle segment points at a real listing, so nothing dangles.
 */
export function BlogPostJsonLd({ locale, post }: { locale: Locale; post: BlogPost }) {
  const c = post[locale];
  const path = `blog/${post.slug}`;
  const url = `${SITE_URL}${localePath(locale, path)}`;
  const cn = crumbNames[locale];

  const wordCount = c.body
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <JsonLd
      data={graph(
        organization(locale),
        webSite(locale),
        // dateModified === date: posts are not edited after publication yet.
        // When one is, add an `updated` field to the post and read it here
        // rather than reaching for build time.
        webPage(locale, path, c.title, c.description, post.date),
        blogPosting(
          locale,
          post.slug,
          c.title,
          c.description,
          post.date,
          post.date,
          [...post.tags[locale]],
          wordCount,
          { url: postImage(post), width: POST_IMAGE_W, height: POST_IMAGE_H },
        ),
        breadcrumbs(locale, path, [
          { name: cn.home, path: "" },
          { name: cn.blog, path: "blog" },
          { name: c.title, path },
        ]),
      )}
    />
  );
}

/** Per-post metadata. Mirrors metaFor() for content that has no meta.ts key. */
export function blogPostMeta(locale: Locale, post: BlogPost): Metadata {
  const c = post[locale];
  return pageMetadata({
    locale,
    path: `blog/${post.slug}`,
    title: c.title,
    description: c.description,
    // The post's own cover, so a shared link previews the article rather than
    // the identical brand card every other page shows.
    image: postImage(post),
  });
}

/** Re-exported so route files import one module. */
export { readingMinutes };
