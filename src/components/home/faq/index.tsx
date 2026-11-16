import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = { ar: "أسئلة تدور ببالك؟", en: "Questions on your mind?" } as const;

/** The home FAQ (Try 3 conversation). A stub until PR 7 home-board-faq builds it. */
export function Faq({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="faq-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="faq-title" title={title[locale]} />
    </section>
  );
}
