import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = { ar: "يوم كامل مع وكيلك", en: "A full day with your agent" } as const;

/** A day on the board (Try 3 capabilities). A stub until PR 6 home-day-hub builds it. */
export function Day({ locale }: { locale: Locale }) {
  return (
    <section id="day" aria-labelledby="day-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="day-title" title={title[locale]} />
    </section>
  );
}
