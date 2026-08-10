import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO, CAL_LINK_QUICK } from "@/lib/site";
import { CalInline } from "@/components/CalInline";
import { CalButton } from "@/components/CalButton";
import { Waveform } from "@/components/Waveform";
import { Reveal } from "@/components/Reveal";
import { FaqAccordion } from "@/components/FaqAccordion";
import { AnimatedIcon } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

/**
 * /demo (blueprint §2.4): server-rendered copy on top, the inline
 * Cal.com embed below. Pricing is sized here — no pricing page (§6.5).
 *
 * Everything under the embed exists because CalInline renders only a
 * loading <p> on the server: without it this — the site's only conversion
 * page — would ship ~80 indexable words. The four question-shaped H2s
 * answer what a visitor hesitates over before booking (price, who to
 * bring, why they can't just call in), and the FAQ below feeds the
 * page's FAQPage node via the `demoFaq` export.
 */

const t = {
  ar: {
    h1: "احجز عرضاً تعريفياً",
    lead: "عرض 30 دقيقة: نوريك المنصة حية، تسمع الوكيل بلهجتك، ونجاوب أسئلتك.",
    pricingNote: "وفي نفس الجلسة نعطيك عرض سعر يناسب حجم مكالماتك.",
    expect: {
      heading: "وش تتوقع في العرض؟",
      items: [
        "تسمع الوكيل يرد بلهجة عملائك — حي، مو تسجيل",
        "تشوف موظفك يستلم المكالمة بكامل سياقها",
        "نختار القالب اللي يناسب نشاطك",
        "نجاوب أسئلة الأمان والبيانات وPDPL",
        "تطلع بخطة تجهيز واضحة",
      ],
    },
    quick: "ما عندك 30 دقيقة؟ احجز مكالمة سريعة — 15 دقيقة",
    loading: "التقويم يحمّل…",
    sections: [
      {
        h: "ليش ما فيه أسعار معلنة على الموقع؟",
        p: "السعر على قد حجم مكالماتك وقنواتك — عيادة مو مثل مطعم عليه ضغط كل مساء. نسألك أسئلة قليلة في العرض، ويوصلك عرض سعر مكتوب بدون رسوم مخفية.",
      },
      {
        h: "مين المفروض يحضر من طرفك؟",
        p: "صاحب القرار، والشخص اللي يعرف مكالماتكم اليومية — مدير الفرع أو مسؤول خدمة العملاء. وإذا عندكم مسؤول تقنية أو امتثال خله يحضر، ونجاوب أسئلة البيانات وPDPL في نفس الجلسة.",
      },
      {
        h: "ما أقدر أتصل وأجرب بنفسي قبل العرض؟",
        p: "ما عندنا للحين رقم سعودي تتصل عليه — تفعيل الأرقام يمر بإجراءات الجهات التنظيمية للاتصالات. بدالها نشغّل الوكيل حي في العرض: تسمعه بلهجتك وتسأله اللي تبغى.",
      },
      {
        h: "وش تطلع فيه من العرض؟",
        p: "عرض سعر يناسب نشاطك، وخطة تجهيز مكتوبة، وإجابات على أسئلة البيانات. وفريقنا هو اللي يجهز لك الوكيل وقاعدة المعرفة وقواعد التصعيد — ما في تسجيل ذاتي.",
      },
    ],
    related: [
      { path: "how-it-works", label: "رحلة المكالمة كاملة" },
      { path: "product/human-handoff", label: "كيف يستلم موظفك المكالمة" },
      { path: "security", label: "أسئلة البيانات وPDPL" },
    ],
    faqHeading: "أسئلة عن العرض التعريفي",
    faq: [
      {
        q: "العرض مجاني؟",
        a: "العرض التعريفي في صوت نجدي مجاني وبدون التزام — 30 دقيقة نوريك فيها المنصة حية ونجاوب أسئلتك.",
      },
      {
        q: "العرض بالعربي ولا بالإنجليزي؟",
        a: "عرض صوت نجدي بالعربي افتراضياً، وإنجليزي إذا فريقك يفضله. وتقدر تسمع الوكيل باللغتين في نفس الجلسة.",
      },
      {
        q: "ألزم أجهز شي قبل العرض؟",
        a: "ما يلزمك تجهيز. جيب معك أكثر خمسة أسئلة يسألها عملاؤك، ونبني عليها المثال الحي في العرض.",
      },
      {
        q: "إذا ما ناسبني الوقت المتاح في التقويم؟",
        a: "راسلنا على الإيميل وبنرتب لك وقتاً ثانياً، أو احجز المكالمة السريعة 15 دقيقة.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Book an intro demo",
    lead: "30 minutes: the platform live, the agent speaking your customers' dialect, and your questions answered.",
    pricingNote: "You leave the same session with a price fitted to your call volume.",
    expect: {
      heading: "What to expect in the demo",
      items: [
        "Hear the agent answer in your customers' dialect — live, not a recording",
        "Watch an employee take over a call with full context",
        "Pick the ready-made template that fits your business",
        "Get your security, data and PDPL questions answered",
        "Leave with a step-by-step setup plan",
      ],
    },
    quick: "Short on time? Book a quick 15-minute call",
    loading: "Loading the calendar…",
    sections: [
      {
        h: "Why isn't there public pricing on the site?",
        p: "Pricing scales with call volume and channels — a clinic taking a few hundred calls a month is not a restaurant under pressure every evening. We ask a few questions in the demo, then send a written, itemised offer with no hidden fees and no obligation.",
      },
      {
        h: "Who should join from your side?",
        p: "The decision-maker, plus whoever knows your daily calls — a branch manager or customer-service lead. Bring your IT or compliance owner too, and storage, processing and PDPL get answered in the same session.",
      },
      {
        h: "Can't I just call in and try it myself first?",
        p: "Not yet — there's no Saudi number to ring, because activation runs through Saudi telecom regulatory steps. Instead we run the agent live in the demo: hear it in your dialect, ask it anything, and watch an employee take the call over mid-conversation.",
      },
      {
        h: "What do you leave the demo with?",
        p: "An offer sized to your business, a written setup plan, and direct answers on data and security. If you go ahead, our team builds the agent, the knowledge base and the escalation rules — there's no self-signup.",
      },
    ],
    related: [
      { path: "how-it-works", label: "A full call's journey" },
      { path: "product/human-handoff", label: "How your employee takes a call over" },
      { path: "security", label: "Data and PDPL questions" },
    ],
    faqHeading: "Demo questions",
    faq: [
      {
        q: "Is the demo free?",
        a: "The Saut Najdi intro demo is free and carries no obligation — 30 minutes of the platform live and your questions answered.",
      },
      {
        q: "Is the demo in Arabic or English?",
        a: "The Saut Najdi demo runs in Arabic by default and switches to English if your team prefers. You can hear the agent in both languages in the same session.",
      },
      {
        q: "Do I need to prepare anything?",
        a: "Nothing needs preparing. Bring the five questions your customers ask most and we'll build the live example around them.",
      },
      {
        q: "What if none of the calendar slots work for me?",
        a: "Email us and we'll arrange another time, or book the 15-minute quick call instead.",
      },
    ] as FaqItem[],
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
              {s.expect.items.map((item, i) => (
                <li key={item} className="flex items-start gap-3 text-body-lg leading-relaxed text-ink/75">
                  <span className="mt-0.5 shrink-0 text-brand-blue">
                    <AnimatedIcon name="check" size={18} delay={i * 0.18} strokeWidth={2.2} />
                  </span>
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

      <section className="bg-white py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            {s.sections.map((sec, i) => (
              <Reveal key={sec.h} delay={i * 0.04}>
                <article className="card">
                  <h2 className="text-h4">{sec.h}</h2>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/80">{sec.p}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-x-6 gap-y-2 text-body-lg">
            {s.related.map((r) => (
              <Link key={r.path} href={localePath(locale, r.path)} className="text-brand-blue hover:underline">
                {r.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* No DemoCta here — the booking embed above already is the CTA. */}
      <section className="container py-16">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>
    </>
  );
}

export const demoFaq = { ar: t.ar.faq, en: t.en.faq };
