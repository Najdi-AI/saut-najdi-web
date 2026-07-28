import type { Locale } from "@/lib/i18n";
import { CAL_LINK_DEMO, CAL_LINK_QUICK } from "@/lib/site";
import { CalInline } from "@/components/CalInline";
import { CalButton } from "@/components/CalButton";
import { Waveform } from "@/components/Waveform";

/**
 * /demo (blueprint §2.4): server-rendered copy on top, the inline
 * Cal.com embed below. Pricing is sized here — no pricing page (§6.5).
 */

const t = {
  ar: {
    h1: "احجز عرضاً تعريفياً",
    lead: "عرض مدته 30 دقيقة: نوريك المنصة حية، نسمّعك الوكيل بلهجتك، ونجاوب على كل أسئلتك.",
    pricingNote: "وفي نفس العرض نقيّم احتياجك — حجم مكالماتك وقنواتك — ونعطيك عرض سعر واضح يناسب نشاطك.",
    expect: {
      heading: "وش تتوقع في العرض؟",
      items: [
        "تسمع الوكيل يرد بلهجة عملائك — حي، مو تسجيل",
        "نشرح كيف يستلم موظفك المكالمة بكامل سياقها",
        "نشوف نشاطك ووش يناسبه من القوالب الجاهزة",
        "نجاوب على أسئلة الأمان والبيانات وPDPL",
        "ونرسم لك خطة تجهيز واضحة، خطوة بخطوة",
      ],
    },
    quick: "ما عندك 30 دقيقة؟ احجز مكالمة سريعة — 15 دقيقة لأسئلتك",
    loading: "التقويم يحمّل…",
  },
  en: {
    h1: "Book an intro demo",
    lead: "A 30-minute demo: we show you the platform live, let you hear the agent in your customers' dialect, and answer every question.",
    pricingNote: "In the same demo we assess your needs — call volume and channels — and give you a clear offer that fits your business.",
    expect: {
      heading: "What to expect in the demo",
      items: [
        "Hear the agent answer in your customers' dialect — live, not a recording",
        "See how your employee takes over a call with full context",
        "Look at your business and which ready-made template fits it",
        "Get your security, data and PDPL questions answered",
        "Leave with a clear step-by-step setup plan",
      ],
    },
    quick: "Short on time? Book a quick 15-minute call for your questions",
    loading: "Loading the calendar…",
  },
} as const;

export function DemoPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="bg-gradient-to-b from-white to-canvas">
        <div className="container py-12 text-center">
          <h1 className="text-h1">{s.h1}</h1>
          <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-ink/75">{s.lead}</p>
          <p className="mx-auto mt-2 max-w-2xl text-body-lg leading-relaxed text-brand-purple">{s.pricingNote}</p>
          <Waveform bars={36} maxHeight={30} className="mt-6 opacity-70" />
        </div>
      </section>

      <section className="container pb-16">
        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1fr_1.4fr]">
          <aside className="card">
            <h2 className="text-h4">{s.expect.heading}</h2>
            <ul className="mt-4 space-y-3">
              {s.expect.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body-lg leading-relaxed text-ink/75">
                  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden className="mt-1 shrink-0 text-brand-blue">
                    <path d="M3 9.5l4 4 8-9" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-line pt-5">
              <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="link">
                {s.quick}
              </CalButton>
            </div>
          </aside>
          <CalInline calLink={CAL_LINK_DEMO} locale={locale} loadingLabel={s.loading} />
        </div>
      </section>
    </>
  );
}
