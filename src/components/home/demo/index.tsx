import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";

const title = { ar: "شوفه وهو يرد", en: "Watch it answer" } as const;

/** Try the call (Try 1 showcase). A stub until PR 5 home-demo-how builds it. */
export function Demo({ locale }: { locale: Locale }) {
  return (
    <section id="demo" aria-labelledby="demo-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="demo-title" title={title[locale]} />
    </section>
  );
}
