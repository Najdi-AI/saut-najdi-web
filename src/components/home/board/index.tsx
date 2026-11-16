import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = { ar: "مكالمة فاتت؟ فلوس راحت.", en: "A missed call is money gone." } as const;

/** The missed-calls receipt (Try 3 board). A stub until PR 7 home-board-faq builds it. */
export function Board({ locale }: { locale: Locale }) {
  return (
    <section id="board" aria-labelledby="board-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="board-title" title={title[locale]} />
    </section>
  );
}
