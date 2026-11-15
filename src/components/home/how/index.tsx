import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = { ar: "كيف يشتغل؟", en: "How does it work?" } as const;

/** How it works (Try 1 states). A stub until PR 5 home-demo-how builds it. */
export function How({ locale }: { locale: Locale }) {
  return (
    <section aria-labelledby="how-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="how-title" title={title[locale]} />
    </section>
  );
}
