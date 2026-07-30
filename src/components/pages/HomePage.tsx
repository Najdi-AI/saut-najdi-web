import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { POSITIONING_AR, POSITIONING_EN, CAL_LINK_DEMO } from "@/lib/site";
import { Waveform } from "@/components/Waveform";
import { DialectChips } from "@/components/DialectChips";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { HeroVisual } from "@/components/HeroVisual";
import { ProcessSteps } from "@/components/ProcessSteps";
import { AnimatedIcon, IconChip, type IconName } from "@/components/icons";
import { TrustStrip } from "@/components/TrustStrip";
import { SampleConversation } from "@/components/SampleConversation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { DemoCta } from "@/components/DemoCta";
import { homeFaq } from "@/content/faq";

/**
 * Homepage per blueprint §6.1. Wave-1 notes: capability cards other than
 * human-handoff render unlinked until their pages ship; sector tiles are
 * unlinked; the product-screenshot section is omitted until demo-tenant
 * screenshots exist (never fabricate one — §2.2).
 */

const t = {
  ar: {
    h1a: "وكيل صوتي بالذكاء الاصطناعي يرد على عملائك — ",
    h1b: "باللهجة اللي يفهمونها",
    positioning: POSITIONING_AR,
    ctaPrimary: "احجز عرضاً",
    ctaSecondary: "شوف كيف يشتغل",
    problem: {
      heading: "كم مكالمة راحت عليك هالأسبوع؟",
      cards: [
        { title: "يتصلون بعد الدوام", body: "العميل ما يعرف دوامك. يتصل، ما أحد يرد عليه، يدق على اللي بعدك." },
        { title: "فريق الرد يكلفك", body: "رواتب وورديات، وأغلب المكالمات نفس الأسئلة تنعاد." },
        { title: "كل مرة يعيد قصته", body: "يتنقل بين ثلاثة موظفين ويكرر كلامه ثلاث مرات." },
      ],
    },
    how: {
      heading: "كيف يشتغل؟",
      steps: [
        { title: "يتصل العميل", body: "على رقمك المخصص، بأي وقت — الوكيل جاهز." },
        { title: "يرد الوكيل بلهجته ويفهم وش يبغى", body: "يسمع، يفهم القصد، ويرد طبيعي — والعميل يقدر يقاطعه مثل ما يقاطع أي موظف." },
        { title: "ينفذ", body: "يحجز، يجاوب من معلومات نشاطك، يسجل التفاصيل — مو بس كلام." },
        { title: "وإذا احتاج الموضوع إنسان؟", body: "موظفك يستلم وكل التفاصيل قدامه — النص والملخص وتاريخ العميل." },
      ],
      link: "اقرأ رحلة المكالمة كاملة",
    },
    hybrid: {
      eyebrow: "الفرق الهجين",
      heading: "مو بس ذكاء… وراه ناس",
      body: "الذكاء الاصطناعي يرد على الروتيني، وموظفك موجود للحظات اللي تحتاج إنسان — شكوى، سؤال حساس، عميل يبغى يسمع صوت بشري. والأهم: لما يستلم موظفك، يستلم وهو فاهم كل شي.",
      link: "شوف صفحة التصعيد للموظف البشري",
    },
    capabilities: {
      heading: "وش يقدم لك؟",
      cards: [
        { title: "الوكيل الصوتي", body: "يرد بلهجة عملائك ويقدر يقاطعونه ويكمل معهم طبيعي.", path: null },
        { title: "التصعيد للموظف البشري", body: "المكالمة تروح لموظفك بكامل سياقها — والفريق يقدر يسمع ويستلم مباشرة.", path: "product/human-handoff" },
        { title: "قاعدة المعرفة العربية", body: "حط ملفاتك PDF وWord — حتى الممسوحة ضوئياً — ووكيلك يتعلم منها.", path: null },
        { title: "بناء الوكيل", body: "سوّ وكيلك بنفسك بقوالب جاهزة لقطاعك — بدون سطر كود.", path: null },
        { title: "لوحة التحكم", body: "كل مكالمة قدامك: مين اتصل، وش قال، ووش صار — نص وتسجيل وملخص.", path: null },
      ],
      soon: "صفحات تفصيلية لكل قدرة — قريباً",
    },
    sectors: {
      heading: "لأي نشاط؟",
      tiles: [
        { sector: "عيادات ومستشفيات", quote: "«أبغى أحجز موعد»" },
        { sector: "مطاعم", quote: "«أبغى أطلب»" },
        { sector: "فنادق", quote: "«عندكم غرفة فاضية؟»" },
        { sector: "عقارات", quote: "«الشقة للحين متاحة؟»" },
        { sector: "تجزئة", quote: "«وصل طلبي؟»" },
      ],
      note: "قوالب جاهزة لهذه القطاعات — وصفحة مخصصة لكل قطاع قريباً.",
    },
    governance: {
      heading: "بياناتك تحكمها قواعد وصلاحيات — مو بس محفوظة",
      bullets: [
        "مصمّم بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL)",
        "التخزين في منطقة الخليج (الدوحة)",
        "سجل تدقيق ما ينعدل ولا ينحذف",
        "صلاحيات وأدوار لكل موظف",
      ],
      link: "صفحة الأمان والبيانات",
    },
    faqHeading: "أسئلة تدور ببالك؟",
    faqLink: "كل الأسئلة الشائعة",
  },
  en: {
    h1a: "An AI voice agent that answers your customers — ",
    h1b: "in the dialect they understand",
    positioning: POSITIONING_EN,
    ctaPrimary: "Book a demo",
    ctaSecondary: "See how it works",
    problem: {
      heading: "How many calls did you miss this week?",
      cards: [
        { title: "They call after hours", body: "Customers don't know your working hours. They call, nobody answers, they call your competitor." },
        { title: "A reply team is expensive", body: "Salaries and shifts — and most calls are the same questions on repeat." },
        { title: "They repeat their story every time", body: "Bounced between three employees, telling the same story three times." },
      ],
    },
    how: {
      heading: "How does it work?",
      steps: [
        { title: "The customer calls", body: "On your dedicated line, any time — the agent is ready." },
        { title: "The agent answers in their dialect and understands", body: "It listens, gets the intent, replies naturally — and callers can interrupt it like any human." },
        { title: "It acts", body: "Books, answers from your business's information, records the details — not just talk." },
        { title: "And when it needs a human?", body: "Your employee takes over with everything in front of them — transcript, summary, customer history." },
      ],
      link: "Read the full journey of a call",
    },
    hybrid: {
      eyebrow: "The hybrid difference",
      heading: "Not just AI. People behind it.",
      body: "The AI handles the routine; your employee is there for the moments that need a human — a complaint, a sensitive question, a customer who wants a human voice. And when your employee takes over, they take over already knowing everything.",
      link: "See the human handoff page",
    },
    capabilities: {
      heading: "What do you get?",
      cards: [
        { title: "The voice agent", body: "Answers in your customers' dialect; callers can interrupt and it keeps up naturally.", path: null },
        { title: "Human handoff", body: "The call reaches your employee with full context — and your team can listen in and take over live.", path: "product/human-handoff" },
        { title: "Arabic knowledge base", body: "Upload your PDF and Word files — even scans — and your agent learns from them.", path: null },
        { title: "Agent builder", body: "Build your agent yourself with sector-ready templates — no code.", path: null },
        { title: "The dashboard", body: "Every call in front of you: who called, what they said, what happened — transcript, recording, summary.", path: null },
      ],
      soon: "Detailed pages for each capability — coming soon",
    },
    sectors: {
      heading: "Built for which businesses?",
      tiles: [
        { sector: "Clinics & hospitals", quote: "“I'd like to book an appointment”" },
        { sector: "Restaurants", quote: "“I'd like to order”" },
        { sector: "Hotels", quote: "“Do you have a room free?”" },
        { sector: "Real estate", quote: "“Is the apartment still available?”" },
        { sector: "Retail", quote: "“Has my order arrived?”" },
      ],
      note: "Ready-made templates for these sectors — with a dedicated page for each coming soon.",
    },
    governance: {
      heading: "Your data is governed, not just stored",
      bullets: [
        "Designed to comply with the Saudi Personal Data Protection Law (PDPL)",
        "Storage in the Gulf region (Doha)",
        "An audit log that can't be edited or deleted",
        "Roles and permissions for every employee",
      ],
      link: "Security & data page",
    },
    faqHeading: "Questions on your mind?",
    faqLink: "All frequently asked questions",
  },
} as const;

export function HomePage({ locale }: { locale: Locale }) {
  const s = t[locale];
  const faq = homeFaq[locale];

  return (
    <>
      {/* 1 · Hero — brand-guideline composition (p18): person + laptop + live bubbles */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-canvas">
        <div className="container grid items-center gap-10 pb-6 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <h1 className="max-w-3xl text-h2 sm:text-h1">
              {s.h1a}
              <span className="text-gradient">{s.h1b}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/70">
              {s.positioning}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <CalButton calLink={CAL_LINK_DEMO} locale={locale}>
                {s.ctaPrimary}
              </CalButton>
              <Link href={localePath(locale, "how-it-works")} className="btn-secondary">
                {s.ctaSecondary}
              </Link>
            </div>
            <div className="mt-8">
              <DialectChips locale={locale} className="justify-center lg:justify-start" />
            </div>
          </div>
          <HeroVisual locale={locale} />
        </div>
        <Waveform bars={64} maxHeight={44} className="container pb-8" />
      </section>

      <TrustStrip locale={locale} />

      {/* 2 · The problem */}
      <section className="container py-16">
        <Reveal>
          <h2 className="text-center text-h2">{s.problem.heading}</h2>
        </Reveal>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {s.problem.cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <div className="card card-hover group h-full">
                <IconChip name={(["clock", "cost", "repeat"] as IconName[])[i]} delay={i * 0.15} />
                <h3 className="mt-3 text-h4">{c.title}</h3>
                <p className="mt-2 text-body-lg leading-relaxed text-ink/70">{c.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* 3 · How it works */}
      <section className="bg-white py-16">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-h2">{s.how.heading}</h2>
          </Reveal>
          <ProcessSteps steps={s.how.steps} locale={locale} />
          <div className="mt-8 text-center">
            <Link
              href={localePath(locale, "how-it-works")}
              className="font-medium text-brand-blue underline-offset-4 hover:underline"
            >
              {s.how.link} {locale === "ar" ? "←" : "→"}
            </Link>
          </div>
        </div>
      </section>

      {/* 4 · The hybrid difference ★ — the most visual weight on the page */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative">
          <Reveal className="text-center">
            <p className="eyebrow">{s.hybrid.eyebrow}</p>
            <h2 className="mt-2 text-h2">{s.hybrid.heading}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-body-lg leading-relaxed text-ink/75">
              {s.hybrid.body}
            </p>
          </Reveal>
          <div className="mt-10">
            <SampleConversation locale={locale} />
          </div>
          <div className="mt-8 text-center">
            <Link
              href={localePath(locale, "product/human-handoff")}
              className="btn-secondary"
            >
              {s.hybrid.link}
            </Link>
          </div>
        </div>
      </section>

      {/* 5 · Capabilities — five cards at launch (Wave-2 pages activate links) */}
      <section className="bg-white py-16">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-h2">{s.capabilities.heading}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.capabilities.cards.map((c, i) => {
              const inner = (
                <div className={`card group h-full ${c.path ? "card-hover border-brand-blue/25" : ""}`}>
                  <IconChip
                    name={(["mic", "people", "doc", "sliders", "chart"] as IconName[])[i]}
                    delay={i * 0.1}
                  />
                  <h3 className="mt-3 text-h4">{c.title}</h3>
                  <p className="mt-2 text-body-lg leading-relaxed text-ink/70">{c.body}</p>
                </div>
              );
              return (
                <Reveal key={c.title} delay={i * 0.06}>
                  {c.path ? (
                    <Link href={localePath(locale, c.path)} className="block h-full">
                      {inner}
                    </Link>
                  ) : (
                    inner
                  )}
                </Reveal>
              );
            })}
          </div>
          <p className="mt-5 text-center text-body text-ink/60">{s.capabilities.soon}</p>
        </div>
      </section>

      {/* 6 · Sectors — five tiles, unlinked in Wave 1 */}
      <section className="container py-16">
        <Reveal>
          <h2 className="text-center text-h2">{s.sectors.heading}</h2>
        </Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {s.sectors.tiles.map((tile, i) => (
            <Reveal key={tile.sector} delay={i * 0.06}>
              <div className="card card-hover group w-52 text-center">
                <div className="flex justify-center">
                  <IconChip
                    name={(["clinic", "restaurant", "hotel", "estate", "retail"] as IconName[])[i]}
                    delay={i * 0.1}
                  />
                </div>
                <p className="mt-3 text-body-lg font-bold">{tile.sector}</p>
                <p className="mt-2 text-body text-brand-purple">{tile.quote}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-5 text-center text-body text-ink/60">{s.sectors.note}</p>
      </section>

      {/* 8 · Data & governance (7 · screenshot pending demo-tenant assets) */}
      <section className="bg-navy py-16 text-white">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-h2">{s.governance.heading}</h2>
          </Reveal>
          <ul className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {s.governance.bullets.map((b, i) => (
              <li key={b} className="flex items-start gap-3 rounded-xl bg-white/5 p-4 text-body-lg text-white/85">
                <span className="mt-0.5 shrink-0 text-brand-cyan">
                  <AnimatedIcon
                    name={(["shield", "database", "lock", "badge"] as IconName[])[i]}
                    size={20}
                    delay={i * 0.12}
                  />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-7 text-center">
            <Link
              href={localePath(locale, "security")}
              className="font-medium text-brand-cyan underline-offset-4 hover:underline"
            >
              {s.governance.link} {locale === "ar" ? "←" : "→"}
            </Link>
          </div>
        </div>
      </section>

      {/* 9 · FAQ */}
      <section className="container py-16">
        <Reveal>
          <h2 className="text-center text-h2">{s.faqHeading}</h2>
        </Reveal>
        <div className="mx-auto mt-8 max-w-2xl">
          <FaqAccordion items={faq} />
          <div className="mt-5 text-center">
            <Link
              href={localePath(locale, "faq")}
              className="font-medium text-brand-blue underline-offset-4 hover:underline"
            >
              {s.faqLink} {locale === "ar" ? "←" : "→"}
            </Link>
          </div>
        </div>
      </section>

      {/* 10 · Demo CTA */}
      <DemoCta locale={locale} />
    </>
  );
}
