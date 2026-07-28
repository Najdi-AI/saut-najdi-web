import { CAL_LINK_DEMO, CAL_LINK_QUICK } from "@/lib/site";
import type { Locale } from "@/lib/i18n";
import { CalButton } from "./CalButton";
import { Waveform } from "./Waveform";
import { Reveal } from "./Reveal";

/**
 * The standard end-of-page demo CTA block (blueprint §4.3): heading +
 * «احجز عرضاً» + the quick-call tertiary line.
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
    <section className="relative overflow-hidden bg-navy py-16 text-white">
      <div className="absolute inset-0 opacity-20">
        <Waveform bars={72} maxHeight={220} className="h-full" />
      </div>
      <Reveal className="container relative text-center">
        <h2 className="text-h2">{s.heading}</h2>
        <p className="mx-auto mt-3 max-w-xl text-body-lg text-white/80">{s.line}</p>
        <div className="mt-7 flex flex-col items-center gap-4">
          <CalButton
            calLink={CAL_LINK_DEMO}
            locale={locale}
            className="!bg-white !text-ink hover:!bg-canvas"
          >
            {s.cta}
          </CalButton>
          <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="link" className="!text-white/80 hover:!text-white">
            {s.quick}
          </CalButton>
        </div>
      </Reveal>
    </section>
  );
}
