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
    sections: [
      {
        h: "ليش ما فيه أسعار معلنة على الموقع؟",
        p: "أسعار صوت نجدي على قد حجم مكالماتك وقنواتك واللي تحتاجه فعلاً — عيادة تستقبل مكالمات محدودة في الشهر مو مثل مطعم عليه ضغط في كل مساء. عشان كذا ما نحط جدول أسعار عام ينصف واحد ويظلم الثاني. في العرض نسألك أسئلة قليلة عن نشاطك وقنواتك، وبعدها نرسل لك عرض سعر مكتوب وواضح — بدون رسوم مخفية وبدون التزام تشتري.",
      },
      {
        h: "مين المفروض يحضر من طرفك؟",
        p: "خلها بسيطة: صاحب القرار، والشخص اللي يعرف مكالماتكم اليومية — مدير الفرع أو مسؤول خدمة العملاء، لأنه هو اللي يعرف وش الأسئلة اللي تتكرر ووش المكالمات اللي تضيع. وإذا عندكم مسؤول تقنية أو امتثال ويهمه سؤال البيانات، خله يحضر: نجاوب أسئلة التخزين والمعالجة وPDPL في نفس الجلسة بدل ما ترجعون لنا مرة ثانية.",
      },
      {
        h: "ما أقدر أتصل وأجرب بنفسي قبل العرض؟",
        p: "لسه ما عندنا رقم سعودي تتصل عليه وتجربه، لأن تفعيل الأرقام يمر بإجراءات الجهات التنظيمية للاتصالات، وما نعطي وعداً بتاريخ ما نتحكم فيه. عشان كذا التجربة تصير داخل العرض: نشغّل الوكيل حي، تسمعه بلهجتك، وتسأله اللي تبغى — وتشوف بعينك كيف يستلم الموظف المكالمة وهي شغالة.",
      },
      {
        h: "وش تطلع فيه من العرض؟",
        p: "ثلاثة أشياء: عرض سعر يناسب حجم نشاطك، وخطة تجهيز مكتوبة خطوة بخطوة، وإجابات مباشرة على أسئلة البيانات والأمان. وإذا مشيت معنا، فريقنا يجهز لك الوكيل وقاعدة المعرفة وقواعد التصعيد — ما في تسجيل ذاتي، وما نتركك تركّب النظام بنفسك وتتصرف.",
      },
    ],
    related: [
      { path: "how-it-works", label: "شوف رحلة المكالمة كاملة قبل العرض" },
      { path: "product/human-handoff", label: "كيف يستلم موظفك المكالمة" },
      { path: "security", label: "أسئلة البيانات وPDPL مجاوبة هنا" },
    ],
    faqHeading: "أسئلة عن العرض التعريفي",
    faq: [
      {
        q: "العرض مجاني؟",
        a: "العرض التعريفي في صوت نجدي مجاني وبدون التزام — 30 دقيقة نوريك فيها المنصة حية ونجاوب أسئلتك، وأنت حر بعدها.",
      },
      {
        q: "العرض بالعربي ولا بالإنجليزي؟",
        a: "عرض صوت نجدي بالعربي بشكل افتراضي — وإذا فريقك يفضل الإنجليزي نسويه إنجليزي، وتقدر تسمع الوكيل بالعربي والإنجليزي في نفس الجلسة.",
      },
      {
        q: "ألزم أجهز شي قبل العرض؟",
        a: "ما يلزمك تجهيز في صوت نجدي: جيب معك أكثر خمسة أسئلة يسألها عملاؤك، وإذا عندك ملف أسعار أو جدول مواعيد خله في بالك — نبني عليه المثال أثناء العرض.",
      },
      {
        q: "إذا ما ناسبني الوقت المتاح في التقويم؟",
        a: "إذا ما لقيت وقتاً يناسبك في تقويم صوت نجدي، راسلنا على الإيميل وبنرتب لك وقتاً ثانياً — أو احجز المكالمة السريعة 15 دقيقة وخلاص.",
      },
    ] as FaqItem[],
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
    sections: [
      {
        h: "Why isn't there public pricing on the site?",
        p: "Saut Najdi pricing scales with your call volume, your channels and what you actually need — a clinic taking a modest number of calls a month is not a restaurant under pressure every evening. A single public price list would be fair to one of them and unfair to the other. In the demo we ask a few questions about your business and channels, then send a written, itemised offer — no hidden fees, no obligation to buy.",
      },
      {
        h: "Who should join from your side?",
        p: "Keep it simple: the decision-maker, and whoever actually knows your daily calls — a branch manager or customer-service lead, because they know which questions repeat and which calls are being lost. And if you have an IT or compliance owner who cares about the data question, bring them: storage, processing and PDPL get answered in the same session instead of a second round-trip.",
      },
      {
        h: "Can't I just call in and try it myself first?",
        p: "Not yet — there's no Saudi number you can ring, because number activation runs through Saudi telecom regulatory steps and we won't promise a date we don't control. So the trial happens inside the demo: we run the agent live, you hear it in your dialect, you ask it whatever you want — and you watch an employee take a call over mid-conversation.",
      },
      {
        h: "What do you leave the demo with?",
        p: "Three things: an offer sized to your business, a written step-by-step setup plan, and direct answers on data and security. And if you go ahead, our team builds your agent, your knowledge base and your escalation rules — there's no self-signup, and we don't hand you a system to assemble on your own.",
      },
    ],
    related: [
      { path: "how-it-works", label: "See a full call's journey before you book" },
      { path: "product/human-handoff", label: "How your employee takes a call over" },
      { path: "security", label: "Data and PDPL questions, answered" },
    ],
    faqHeading: "Demo questions",
    faq: [
      {
        q: "Is the demo free?",
        a: "The Saut Najdi intro demo is free and carries no obligation — 30 minutes of the platform live and your questions answered, and you decide afterwards.",
      },
      {
        q: "Is the demo in Arabic or English?",
        a: "The Saut Najdi demo runs in Arabic by default, switches to English if your team prefers it, and you can hear the agent in both languages in the same session.",
      },
      {
        q: "Do I need to prepare anything?",
        a: "Nothing needs preparing for a Saut Najdi demo: bring the five questions your customers ask most, and have your price list or appointment schedule in mind — we'll build the live example around it.",
      },
      {
        q: "What if none of the calendar slots work for me?",
        a: "If no slot in the Saut Najdi calendar fits, email us and we'll arrange another time — or just book the 15-minute quick call instead.",
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
