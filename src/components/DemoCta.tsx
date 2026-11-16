import { CAL_LINK_QUICK } from "@/lib/site";
import { DemoLink } from "./DemoLink";
import type { Locale } from "@/lib/i18n";
import { CalButton } from "./CalButton";
import { Reveal } from "./Reveal";

/**
 * The standard end-of-page demo CTA block (blueprint §4.3): a Charcoal
 * `.on-dark` band with a serif heading, «احجز عرضاً» as the page's one red
 * button, and the quick-call tertiary line. It pads only itself, so the
 * section before it brings its own bottom room (page/Section).
 */
const t = {
  ar: {
    heading: "جاهز تشوف كيف يرد على عملائك؟",
    line: "عرض تعريفي مدته 30 دقيقة — نوريك المنصة حية ونجاوب على أسئلتك.",
    cta: "احجز عرضاً",
    quick: "عندك سؤال سريع؟ احجز مكالمة 15 دقيقة",
  },
  en: {
    heading: "Ready to see it answer your customers?",
    line: "A 30-minute intro demo — we show you the platform live and answer your questions.",
    cta: "Book a demo",
    quick: "Got a quick question? Book a 15-minute call",
  },
} as const;

export function DemoCta({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <section className="on-dark py-[clamp(96px,11.2vw,168px)]">
      <Reveal className="container grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-6">
        <h2 className="font-display text-[clamp(32px,3.9vw,56px)] leading-[1.25] font-medium text-balance lg:col-span-7">
          {s.heading}
        </h2>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="max-w-[44ch] text-[1.0625rem] leading-[1.7] text-muted-foreground sm:text-[1.25rem]">{s.line}</p>
          <div className="mt-8 flex flex-col items-start gap-3">
            <DemoLink locale={locale}>{s.cta}</DemoLink>
            <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="link" className="text-foreground! underline">
              {s.quick}
            </CalButton>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
