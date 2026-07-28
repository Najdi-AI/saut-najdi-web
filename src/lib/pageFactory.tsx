import type { Metadata } from "next";
import { pageMetadata } from "./seo";
import { meta } from "@/content/meta";
import { chrome } from "@/content/chrome";
import { fullFaq, homeFaq } from "@/content/faq";
import { handoffFaq } from "@/components/pages/HumanHandoffPage";
import { securityFaq } from "@/components/pages/SecurityPage";
import {
  graph,
  organization,
  webSite,
  softwareApplication,
  faqPage,
  breadcrumbs,
  service,
  siteNavigation,
} from "./schema";
import { SITE_URL } from "./site";
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
  });
}

const crumbNames = {
  ar: { home: "الرئيسية", product: "المنتج" },
  en: { home: "Home", product: "Product" },
} as const;

/** Per-page-type JSON-LD @graph (blueprint §8 schema map). */
export function PageJsonLd({ locale, kind }: { locale: Locale; kind: string }) {
  const c = crumbNames[locale];
  let data: Record<string, unknown>;
  switch (kind) {
    case "home":
      data = graph(
        organization(locale),
        webSite(locale),
        softwareApplication(locale),
        faqPage(locale, "", homeFaq[locale]),
        siteNavigation(locale, chrome[locale].nav.map((n) => ({ name: n.label, path: n.path }))),
      );
      break;
    case "product/human-handoff":
      data = graph(
        organization(locale),
        service(
          locale,
          locale === "ar" ? "التصعيد للموظف البشري" : "Human handoff",
          meta[locale]["product/human-handoff"].description,
        ),
        faqPage(locale, "product/human-handoff", handoffFaq[locale]),
        breadcrumbs(locale, [
          { name: c.home, path: "" },
          { name: c.product, path: "product/human-handoff" },
          {
            name: locale === "ar" ? "التصعيد للموظف البشري" : "Human handoff",
            path: "product/human-handoff",
          },
        ]),
      );
      break;
    case "security":
      data = graph(
        organization(locale),
        faqPage(locale, "security", securityFaq[locale]),
        breadcrumbs(locale, [
          { name: c.home, path: "" },
          { name: locale === "ar" ? "الأمان والبيانات" : "Security & data", path: "security" },
        ]),
      );
      break;
    case "faq":
      data = graph(organization(locale), faqPage(locale, "faq", fullFaq[locale]));
      break;
    case "about":
      data = graph(organization(locale), {
        "@type": "AboutPage",
        url: `${SITE_URL}${localePath(locale, "about")}`,
        name: meta[locale].about.title,
      });
      break;
    case "contact":
      data = graph(organization(locale), {
        "@type": "ContactPage",
        url: `${SITE_URL}${localePath(locale, "contact")}`,
        name: meta[locale].contact.title,
      });
      break;
    default:
      data = graph(
        organization(locale),
        breadcrumbs(locale, [
          { name: c.home, path: "" },
          { name: meta[locale][kind]?.title ?? kind, path: kind },
        ]),
      );
  }
  return <JsonLd data={data} />;
}
