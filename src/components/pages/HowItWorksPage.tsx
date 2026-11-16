import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { JourneySteps } from "@/components/JourneySteps";
import { IvrComparison } from "@/components/IvrComparison";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";

/**
 * /how-it-works (blueprint §6.6): one call's journey told in dialect —
 * «من أول رنة… إلى آخر سطر في السجل».
 *
 * Copy pass: a brief per stage, not an explanation of it. Each step is one
 * or two short sentences; the seven-step shape is fixed by JourneySteps'
 * icon list and by the HowTo graph that consumes `journeySteps` below.
 *
 * On the inner-page kit (About is the pilot): PageHero, the trust strip, the
 * journey under its question, then the IVR comparison (moved here from the
 * old home, rebrand D4). pageFactory imports this module for journeySteps,
 * so every import here stays server-only or already ships everywhere.
 */

const t = {
  ar: {
    h1: "كيف يشتغل صوت نجدي؟ رحلة مكالمة وحدة — من أول رنة إلى آخر سطر في السجل",
    intro:
      "امشِ مع مكالمة وحدة من أولها لآخرها — هذا اللي يصير بالضبط.",
    cta: "احجز عرضاً",
    answerH2: "كيف يشتغل الرد الآلي بالذكاء الاصطناعي؟",
    capsule:
      "كلام عميلك يصير نص لحظياً، والوكيل يفهم قصده ويرد بصوت طبيعي بلهجته وينفذ الطلب. وإذا احتاج الموضوع إنسان، موظفك يستلم بكامل السياق. وكل شي ينتهي مسجّلاً ومكتوباً وملخّصاً في لوحتك.",
    steps: [
      {
        title: "الرنة الأولى — الوكيل يرد",
        body: "بأي وقت: بعد الدوام، يوم الجمعة، وقت الذروة. ما في انتظار.",
      },
      {
        title: "الكلام يصير نص لحظياً",
        body: "مبني على اللهجات السعودية — «أبغى أحجز بكرة» يفهمها زي ما تنقال.",
      },
      {
        title: "الوكيل يفهم القصد",
        body: "حجز؟ سعر؟ تعديل موعد؟ يرد من أسعارك وأوقاتك وتاريخ العميل معك.",
      },
      {
        title: "يرد بلهجة عميلك",
        body: "صوت طبيعي. وإذا قاطعه العميل يسكت ويسمع، ويقرأ رقم الحجز رقم رقم.",
      },
      {
        title: "ينفذ — مو بس يتكلم",
        body: "يتحقق من الفاضي ويحجز، يسجل تفاصيل الطلب، ويسجل طلب اتصال برا الدوام.",
      },
      {
        title: "وإذا احتاج الموضوع إنسان؟ موظفك يستلم",
        body: "المكالمة تروح لموظفك ومعها النص والملخص وتاريخ العميل، والعميل ما يعيد كلمة. وفريقك يتابع المكالمات الحية ويستلمها من اللوحة.",
      },
      {
        title: "كل شي في لوحتك",
        body: "التسجيل والنص وملخص عربي: ليش اتصل ووش صار. مع أرقام نشاطك محسوبة من مكالماتك.",
      },
    ],
    outro:
      "الرحلة كلها في مكالمة وحدة، وأنت اللي تحدد القواعد: متى يحجز الوكيل، ومتى يحوّل، ومين يستلم. ومن نفس اللوحة يبدأ فريقك مكالمة صادرة — يختار العميل والوكيل، والوكيل يمسك الحوار.",
  },
  en: {
    h1: "How Saut Najdi works: one call's journey — from the first ring to the last line in the log",
    intro:
      "Walk through a single call end to end — this is exactly what happens.",
    cta: "Book a demo",
    answerH2: "How does AI call answering actually work?",
    capsule:
      "Your customer's speech becomes text in real time, the agent works out the intent, replies in a natural voice in the same dialect, and acts on the request. If the matter needs a person, your employee takes over in full context. Everything ends up recorded, transcribed and summarised in your dashboard.",
    steps: [
      {
        title: "The first ring — the agent answers",
        body: "Any hour: after close, on a Friday, at peak. No hold queue.",
      },
      {
        title: "Speech becomes text, in real time",
        body: "Built on Saudi dialects — it understands how people actually talk, not textbook Arabic.",
      },
      {
        title: "The agent works out the intent",
        body: "A booking? A price? A reschedule? It answers from your prices, hours and the caller's history with you.",
      },
      {
        title: "It replies in your customer's dialect",
        body: "Natural speech. Interrupt it and it stops and listens, and it reads booking codes digit by digit.",
      },
      {
        title: "It acts — not just talks",
        body: "Checks availability and books, records order details, and logs a callback request when you're closed.",
      },
      {
        title: "And when it needs a human? Your employee takes over",
        body: "The call arrives with the transcript, summary and customer history, so the caller never repeats a word. Your team can also watch live calls and take one over.",
      },
      {
        title: "Everything lands in your dashboard",
        body: "Recording, transcript and a clear summary of what happened — plus your own activity numbers, worked out from your calls.",
      },
    ],
    outro:
      "That whole journey happens inside one call, and you set the rules: when the agent books on its own, when it hands over, and who takes it. From the same dashboard your team can also place an outbound call — pick the customer and the agent, and the agent holds the conversation.",
  },
} as const;

export function HowItWorksPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <PageHero title={s.h1} lead={s.intro}>
        <DemoLink locale={locale}>{s.cta}</DemoLink>
      </PageHero>

      <TrustStrip locale={locale} />

      {/* The seven steps only answer the query if you read all seven. This
          capsule answers it in one liftable paragraph under the question as
          it is actually typed — the steps below stay the proof. */}
      <Section title={s.answerH2} lead={s.capsule}>
        {/* JourneySteps centres a 2xl list; this box holds it to the start. */}
        <div className="max-w-2xl">
          <JourneySteps steps={s.steps} locale={locale} />
        </div>
        <Reveal className="mt-12 max-w-[60ch] border-t border-border pt-10">
          <p className="text-[1.0625rem] leading-[1.7] sm:text-[1.125rem]">{s.outro}</p>
          <p className="mt-2">
            <Link
              href={localePath(locale, "product/human-handoff")}
              className="inline-flex min-h-11 items-center text-[1.0625rem] font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red sm:text-[1.125rem]"
            >
              {locale === "ar" ? "اعرف أكثر عن التصعيد للموظف البشري ←" : "Learn more about human handoff →"}
            </Link>
          </p>
        </Reveal>
      </Section>

      <IvrComparison locale={locale} className="pb-[clamp(96px,11.2vw,168px)]" />

      <DemoCta locale={locale} />
    </>
  );
}

// Source of truth for the HowTo graph in pageFactory — the steps stay written
// once, here, where the page renders them.
export const journeySteps = { ar: t.ar.steps, en: t.en.steps };
