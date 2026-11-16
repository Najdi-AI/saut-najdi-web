import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";
import { howCopy } from "./copy";
import { HowSteps } from "./HowSteps";
import { BookState, HandoffState, RingState } from "./states";

/**
 * How it works (Try 1 states, mockups/index.html .how and states.html): the
 * three statements and the product fragment each one sets. The fragments
 * are server markup handed to the one small client island, which only
 * decides the layout and which state shows.
 */
export function How({ locale }: { locale: Locale }) {
  const t = howCopy[locale];
  return (
    <section aria-labelledby="how-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="how-title" title={t.title} className="pb-5 min-[641px]:pb-14" />
      <HowSteps
        steps={t.steps}
        states={[<RingState key="ring" t={t.ring} />, <BookState key="book" t={t.book} />, <HandoffState key="handoff" t={t.handoff} />]}
      />
    </section>
  );
}
