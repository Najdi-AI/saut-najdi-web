import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = {
  ar: "يشتغل مع قنواتك وسنترالك",
  en: "Works with your channels and your phone system",
} as const;

/** Channels and phone systems (Try 3 hub). A stub until PR 6 home-day-hub builds it. */
export function Hub({ locale }: { locale: Locale }) {
  return (
    <section id="hub" aria-labelledby="hub-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="hub-title" title={title[locale]} />
    </section>
  );
}
