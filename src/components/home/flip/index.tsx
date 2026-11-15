import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = {
  ar: "جاهز وكيلك يرد عن نشاطك؟",
  en: "Ready for your agent to answer for your business?",
} as const;

/** The closing sentence (Try 3 flip). A stub until PR 8 pricing-walk-flip builds it. */
export function Flip({ locale }: { locale: Locale }) {
  return (
    <section id="book" aria-labelledby="book-title" className="px-5 py-24 sm:px-8 lg:py-40">
      <SectionHead id="book-title" title={title[locale]} />
    </section>
  );
}
