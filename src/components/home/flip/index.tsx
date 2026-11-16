import type { ReactNode } from "react";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { FlipBoard, type FlipCopy } from "./FlipBoard";
import s from "./Flip.module.css";

/** Sultan's four businesses first, then Try 3's three. */
const copy: Record<Locale, FlipCopy & { cta: string; note: ReactNode }> = {
  ar: {
    title: "جاهز وكيلك يرد عن نشاطك؟",
    before: ["جاهز وكيلك يرد", "عن"],
    after: "؟",
    words: ["عيادتك", "مطعمك", "محلك", "شركتك", "فندقك", "صالونك", "مكتبك"],
    pick: "نشاطك:",
    all: "الكل",
    picks: ["عيادة", "مطعم", "محل", "شركة", "فندق", "صالون", "مكتب"],
    cta: "احجز عرضاً",
    note: (
      <>
        نتواصل معك ونرتب عرض <bdi dir="ltr">30</bdi> دقيقة، نوريك المنصة حية ونجاوب على أسئلتك.
      </>
    ),
  },
  en: {
    title: "Ready for your agent to answer for your business?",
    // One line that wraps where it fits: a forced break orphans "agent".
    before: ["Ready for your agent to answer for your"],
    after: "?",
    words: ["clinic", "restaurant", "shop", "company", "hotel", "salon", "office"],
    pick: "Your business:",
    all: "All",
    picks: ["Clinic", "Restaurant", "Shop", "Company", "Hotel", "Salon", "Office"],
    cta: "Book a demo",
    note: (
      <>
        We get in touch and set up a <bdi dir="ltr">30</bdi>-minute demo: we show you the platform live and
        answer your questions.
      </>
    ),
  },
};

/**
 * #book, the closing sentence (Try 3 flip): «جاهز وكيلك يرد عن عيادتك؟»
 * with the business word turning, a picker to hold it, and the demo link.
 */
export function Flip({ locale }: { locale: Locale }) {
  const { cta, note, ...t } = copy[locale];
  return (
    <section id="book" aria-labelledby="book-title" className="px-5 py-24 sm:px-8 lg:py-40">
      <FlipBoard locale={locale} t={t}>
        <div className={s.act}>
          <DemoLink locale={locale}>{cta}</DemoLink>
          <p className={s.note}>{note}</p>
        </div>
      </FlipBoard>
    </section>
  );
}
