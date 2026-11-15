import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = { ar: "الباقات", en: "Plans" } as const;

/** The four-tier pricing walk (decision 185). A stub until PR 8 pricing-walk-flip builds it. */
export function Pricing({ locale }: { locale: Locale }) {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="pricing-title" title={title[locale]} />
    </section>
  );
}
