import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { Waveform } from "@/components/Waveform";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";

/**
 * /how-it-works (blueprint §6.6): the long-form explainer told as one
 * call's journey, in dialect — «من أول رنة… إلى آخر سطر في السجل».
 */

const t = {
  ar: {
    h1: "كيف يشتغل صوت نجدي؟ رحلة مكالمة وحدة — من أول رنة إلى آخر سطر في السجل",
    intro:
      "أسهل طريقة تفهم فيها المنصة إنك تمشي مع مكالمة وحدة من البداية للنهاية. هذا اللي يصير بالضبط من لحظة ما يدق عميلك، إلى أن تلقى كل شي مسجل ومكتوب وملخص في لوحتك.",
    cta: "احجز عرضاً",
    steps: [
      {
        title: "الرنة الأولى — الوكيل يرد",
        body: "عميلك يتصل على رقمك المخصص، بأي وقت — بعد الدوام، يوم الجمعة، وقت الذروة. ما في انتظار وما في «اتصل بنا لاحقاً». الوكيل يرد من أول رنة بصوت طبيعي وباللهجة اللي اخترتها لنشاطك.",
      },
      {
        title: "الكلام يصير نص — لحظياً",
        body: "وهو يتكلم، كلام عميلك يتحول إلى نص لحظة بلحظة. والنظام مبني على اللهجات السعودية من أساسه: يفهم «أبغى أحجز بكرة» و«وش أسعاركم» زي ما تنقال فعلاً — مو عربية الكتب المدرسية.",
      },
      {
        title: "الوكيل يفهم القصد",
        body: "الذكاء الاصطناعي يفهم وش يبغى العميل من كلامه: حجز؟ سؤال عن سعر؟ تعديل موعد؟ ويستخدم معلومات نشاطك — أسعارك، أوقاتك، سياساتك — وتاريخ العميل معك إذا اتصل قبل، عشان يرد رد صحيح مو رد عام.",
      },
      {
        title: "يرد بلهجة عميلك",
        body: "الرد يطلع صوت طبيعي وبنفس اللهجة. وإذا قاطعه العميل بنص الجملة — زي ما نسوي كلنا — الوكيل يسكت على طول ويسمع. وإذا قال له رقم حجز، يقرأه رقم رقم عشان يقدر يكتبه.",
      },
      {
        title: "ينفذ — مو بس يتكلم",
        body: "الوكيل يقدر يسوي أشياء حقيقية أثناء المكالمة: يتأكد من المواعيد الفاضية ويحجز، يسجل تفاصيل الطلب، يحفظ تفضيلات العميل عشان المرة الجاية، وإذا كان الاتصال برا الدوام يسجل طلب اتصال ويوعد العميل إن أحد يرجع له.",
      },
      {
        title: "وإذا احتاج الموضوع إنسان؟ موظفك يستلم",
        body: "شكوى، سؤال حساس، عميل يبغى يكلم إنسان — المكالمة تروح لموظفك فوراً، ومعها كل شي: النص الكامل، الملخص، وتاريخ العميل. والعميل ما يعيد كلمة وحدة. فريقك بعد يقدر يتابع المكالمات الحية من اللوحة ويستلم أي مكالمة بنفسه.",
      },
      {
        title: "كل شي في لوحتك",
        body: "بعد ما تسكر المكالمة، تلقاها كاملة في لوحة التحكم: التسجيل، النص، ملخص عربي واضح — ليش اتصل، وش صار، ووش باقي. وكل مكالمة تنضاف لتاريخ العميل، عشان المرة الجاية يكون السياق جاهز.",
      },
    ],
    outro:
      "هذي الرحلة كلها تصير في مكالمة وحدة عادية. والأهم: أنت اللي تحدد القواعد — متى يحجز الوكيل بنفسه، ومتى يحوّل، ومين من موظفينك يستلم.",
  },
  en: {
    h1: "How Saut Najdi works: one call's journey — from the first ring to the last line in the log",
    intro:
      "The easiest way to understand the platform is to walk through a single call from start to finish. This is exactly what happens from the moment your customer dials, to the moment everything sits recorded, transcribed and summarised in your dashboard.",
    cta: "Book a demo",
    steps: [
      {
        title: "The first ring — the agent answers",
        body: "Your customer calls your dedicated number, any time — after hours, on Friday, at peak time. No hold queue, no “call back later.” The agent answers on the first ring with a natural voice, in the dialect you chose for your business.",
      },
      {
        title: "Speech becomes text — in real time",
        body: "As they speak, your customer's words turn into text moment by moment. The system is built on Saudi dialects from the ground up: it understands how people actually talk — not textbook Arabic.",
      },
      {
        title: "The agent understands the intent",
        body: "The AI works out what the customer wants: a booking? a price question? a rescheduled appointment? It uses your business's information — prices, hours, policies — and the caller's history with you if they've called before, so the answer is specific, not generic.",
      },
      {
        title: "It replies in your customer's dialect",
        body: "The reply comes out as natural speech in the same dialect. If the customer interrupts mid-sentence — the way we all do — the agent stops instantly and listens. And when it gives a booking code, it reads it digit by digit so it can actually be written down.",
      },
      {
        title: "It acts — not just talks",
        body: "The agent does real things during the call: checks available slots and books them, records order details, remembers the customer's preferences for next time, and if you're closed, it logs a callback request and promises the customer someone will get back to them.",
      },
      {
        title: "And when it needs a human? Your employee takes over",
        body: "A complaint, a sensitive question, a customer who wants a person — the call goes to your employee immediately, carrying everything: the full transcript, the summary, and the customer's history. The customer never repeats a word. Your team can also watch live calls from the dashboard and take any call over themselves.",
      },
      {
        title: "Everything lands in your dashboard",
        body: "After the call ends, you'll find it complete in the dashboard: the recording, the transcript, a clear summary — why they called, what happened, what's still open. Every call joins the customer's history, so next time the context is already there.",
      },
    ],
    outro:
      "That whole journey happens inside one ordinary call. And most importantly: you set the rules — when the agent books on its own, when it hands over, and which of your employees takes the call.",
  },
} as const;

export function HowItWorksPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="bg-gradient-to-b from-white to-canvas">
        <div className="container py-14 text-center">
          <h1 className="mx-auto max-w-3xl text-h2 sm:text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/70">{s.intro}</p>
          <div className="mt-7">
            <CalButton calLink={CAL_LINK_DEMO} locale={locale}>{s.cta}</CalButton>
          </div>
        </div>
      </section>

      <TrustStrip locale={locale} />

      <section className="container py-16">
        <ol className="relative mx-auto max-w-2xl space-y-6">
          {s.steps.map((step, i) => (
            <Reveal key={step.title} delay={0.05}>
              <li className="card relative">
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-body-lg font-bold text-white"
                  >
                    {i + 1}
                  </span>
                  <div>
                    <h2 className="text-h4">{step.title}</h2>
                    <p className="mt-2 text-body-lg leading-relaxed text-ink/75">{step.body}</p>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
        <Reveal className="mx-auto mt-10 max-w-2xl text-center">
          <Waveform bars={40} maxHeight={32} className="mb-6 opacity-70" />
          <p className="text-body-lg leading-relaxed text-ink/75">{s.outro}</p>
          <p className="mt-4">
            <Link
              href={localePath(locale, "product/human-handoff")}
              className="font-medium text-brand-blue underline-offset-4 hover:underline"
            >
              {locale === "ar" ? "اعرف أكثر عن التصعيد للموظف البشري ←" : "Learn more about human handoff →"}
            </Link>
          </p>
        </Reveal>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}
