import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";
import { demoCopyFor } from "./copy";
import { DemoPanel } from "./DemoPanel";
import s from "./Demo.module.css";

/**
 * Try the call (Try 1 showcase, mockups/index.html #demo): the heading and
 * the hint are server markup; the panel is the one client island, and it
 * gets this locale's scripted calls as props, so neither locale's copy
 * ships in the page's JavaScript.
 */
export function Demo({ locale }: { locale: Locale }) {
  const t = demoCopyFor(locale);
  return (
    <section id="demo" aria-labelledby="demo-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <div className={s.col}>
        <SectionHead id="demo-title" title={t.title} lead={t.lead} />
        <DemoPanel locale={locale} t={t} />
        <p className="text-[0.9375rem] text-muted-foreground">{t.hint}</p>
      </div>
    </section>
  );
}
