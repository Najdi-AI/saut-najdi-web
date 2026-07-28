import type { Locale } from "@/lib/i18n";
import { fullFaq } from "@/content/faq";
import { FaqAccordion } from "@/components/FaqAccordion";
import { DemoCta } from "@/components/DemoCta";

/** /faq (blueprint §6.9) — the AI-answer surface. */

const t = {
  ar: {
    h1: "الأسئلة الشائعة",
    lead: "كل اللي يدور ببالك عن صوت نجدي — بإجابات واضحة وصريحة.",
  },
  en: {
    h1: "Frequently asked questions",
    lead: "Everything on your mind about Saut Najdi — with clear, straight answers.",
  },
} as const;

export function FaqPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="container py-14">
        <div className="text-center">
          <h1 className="text-h1">{s.h1}</h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg text-ink/70">{s.lead}</p>
        </div>
        <div className="mx-auto mt-10 max-w-2xl">
          <FaqAccordion items={fullFaq[locale]} />
        </div>
      </section>
      <DemoCta locale={locale} />
    </>
  );
}
