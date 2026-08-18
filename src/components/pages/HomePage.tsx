import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Waveform } from "@/components/Waveform";
import { DialectChips } from "@/components/DialectChips";
import { Reveal } from "@/components/Reveal";
import { HeroVisual } from "@/components/HeroVisual";
import { ProcessSteps } from "@/components/ProcessSteps";
import { AnimatedIcon, IconChip, type IconName } from "@/components/icons";
import { TrustStrip } from "@/components/TrustStrip";
import { SampleConversation } from "@/components/SampleConversation";
import { FaqAccordion } from "@/components/FaqAccordion";
import { BookingDesk } from "@/components/BookingDesk";
import { BlogTeaser } from "@/components/BlogTeaser";
import { homeFaq } from "@/content/faq";

/**
 * Homepage per blueprint §6.1. Wave 2 gave every capability card and every
 * sector tile a real destination, so both grids are fully linked and the two
 * "coming soon" lines under them are gone — the activation rule in spec P2-22
 * is that the link and the page ship together, in both directions.
 *
 * Copy pass: the page is a scan, not a read. One idea per block, a bold title
 * plus one or two short sentences, outcome before mechanism. Every H2 stays
 * question-shaped with its answer immediately under it.
 *
 * The hero sub-line is written here rather than pulled from POSITIONING_AR/EN:
 * the shared constant is a long positioning sentence and still names a Gulf
 * voice that is not in the shipped catalog. The hero wants a shorter line
 * anyway, and it must not repeat a voice we do not have.
 *
 * Still deliberately absent: the product-screenshot section, until demo-tenant
 * screenshots actually exist (never fabricate one — §2.2).
 */

const t = {
  ar: {
    h1a: "وكيل صوتي بالذكاء الاصطناعي يرد على عملائك — ",
    h1b: "باللهجة اللي يفهمونها",
    positioning:
      "يرد على مكالماتك على مدار الساعة بلهجة سعودية طبيعية، وموظفك يستلم بكامل السياق متى ما لزم.",
    ctaPrimary: "احجز عرضاً",
    ctaSecondary: "شوف كيف يشتغل",
    problem: {
      heading: "كم مكالمة راحت عليك هالأسبوع؟",
      cards: [
        { title: "يتصلون بعد الدوام", body: "ما أحد يرد، فيدقون على اللي بعدك." },
        { title: "فريق الرد يكلفك", body: "رواتب وورديات، ونفس الأسئلة تتكرر." },
        { title: "كل مرة يعيد قصته", body: "ثلاثة موظفين، ونفس القصة ثلاث مرات." },
      ],
    },
    how: {
      heading: "كيف يشتغل؟",
      steps: [
        { title: "يتصل العميل", body: "على رقمك، بأي وقت." },
        { title: "يرد ويفهم", body: "بلهجة عميلك، ويقدر يقاطعه." },
        { title: "ينفذ", body: "يحجز، يجاوب، يسجل." },
        { title: "يصعّد إذا لزم", body: "موظفك يستلم بكامل السياق." },
      ],
      link: "اقرأ رحلة المكالمة كاملة",
    },
    hybrid: {
      eyebrow: "الفرق الهجين",
      heading: "مو بس ذكاء… وراه ناس",
      body: "الذكاء الاصطناعي ياخذ الروتيني، وموظفك للحظات اللي تحتاج إنسان — ويستلم وهو فاهم كل شي.",
      link: "شوف صفحة التصعيد للموظف البشري",
    },
    vsIvr: {
      heading: "وش الفرق بين الوكيل الصوتي الذكي والرد الآلي القديم (IVR)؟",
      answer: "الـ IVR قائمة يمشي عليها العميل. صوت نجدي يتكلم معه، يفهم قصده، وينفذه.",
      cols: ["الموقف", "الرد الآلي (IVR)", "صوت نجدي"],
      rows: [
        ["العميل يبدأ", "قائمة: اضغط 1، اضغط 2", "يقول اللي يبغاه بلهجته"],
        ["إذا قاطع", "القائمة تكمل", "يسكت ويسمع"],
        ["طلب مو في القائمة", "يعلق أو ينتظر موظف", "يتصرف، وإلا يصعّد"],
        ["حجز موعد", "يحوّلك لموظف", "يحجز داخل نفس المكالمة"],
        ["يحتاج إنسان", "يبدأ من الصفر", "يستلم ومعه النص والملخص"],
      ],
    },
    inbox: {
      heading: "أقدر أجمع المكالمات والواتساب والتيليجرام في صندوق واحد؟",
      answer: "إي — المكالمات وواتساب وتيليجرام ودردشة موقعك في صندوق واحد، وموظفك يدخل على أي محادثة.",
      channels: ["المكالمات", "واتساب للأعمال", "تيليجرام", "دردشة موقعك"],
    },
    capabilities: {
      heading: "وش يقدم لك؟",
      cards: [
        { title: "الوكيل الصوتي", body: "يرد بلهجة عملائك، ويقاطعونه ويكمل معهم طبيعي.", path: "product/voice-agent" },
        { title: "التصعيد للموظف البشري", body: "موظفك يستلم بكامل السياق، ويسمع المكالمة وهي شغالة.", path: "product/human-handoff" },
        { title: "قاعدة المعرفة العربية", body: "ملفاتك PDF وWord، حتى الممسوحة ضوئياً — ووكيلك يجاوب منها.", path: "product/knowledge-base" },
        { title: "بناء الوكيل", body: "سوّ وكيلك بقوالب جاهزة لقطاعك، بدون كود.", path: "product/agent-builder" },
        { title: "لوحة التحكم", body: "كل مكالمة: نص وتسجيل وملخص، وأرقامك محسوبة من مكالماتك. ومنها فريقك يبدأ مكالمة صادرة والوكيل يمسك الحوار.", path: "product/dashboard" },
      ],
    },
    sectors: {
      heading: "لأي نشاط؟",
      tiles: [
        { sector: "عيادات ومستشفيات", quote: "«أبغى أحجز موعد»", path: "solutions/clinics" },
        { sector: "مطاعم", quote: "«أبغى أحجز طاولة»", path: "solutions/restaurants" },
        { sector: "فنادق", quote: "«عندكم غرفة فاضية؟»", path: "solutions/hotels" },
        { sector: "عقارات", quote: "«الشقة للحين متاحة؟»", path: "solutions/real-estate" },
        { sector: "تجزئة", quote: "«وصل طلبي؟»", path: "solutions/retail" },
      ],
      note: "اضغط على قطاعك وشوف وش يتكفل فيه الوكيل ووش يروح لموظفك.",
    },
    governance: {
      heading: "بياناتك تحكمها قواعد وصلاحيات، مو بس محفوظة",
      bullets: [
        "مصمّم بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL)",
        "التخزين في منطقة الخليج (الدوحة)",
        "سجل تدقيق ما ينعدل ولا ينحذف",
        "صلاحيات وأدوار لكل موظف",
      ],
      link: "صفحة الأمان والبيانات",
    },
    closing: {
      heading: "جاهز تشوف كيف يرد على عملائك؟",
      line: "اختر وقت يناسبك — عرض 30 دقيقة، نوريك المنصة حية ونجاوب على أسئلتك.",
    },
    faqHeading: "أسئلة تدور ببالك؟",
    faqLink: "كل الأسئلة الشائعة",
  },
  en: {
    h1a: "An AI voice agent that answers your customers — ",
    h1b: "in the dialect they understand",
    positioning:
      "Answer every customer call around the clock in natural Saudi Arabic — with your team able to take over, in full context, whenever a person should.",
    ctaPrimary: "Book a demo",
    ctaSecondary: "See how it works",
    problem: {
      heading: "How many calls did you miss this week?",
      cards: [
        { title: "They call after hours", body: "Nobody picks up, so they call your competitor." },
        { title: "A reply desk is expensive", body: "Salaries and shifts — for the same questions on repeat." },
        { title: "They repeat themselves", body: "Three employees, three retellings of one story." },
      ],
    },
    how: {
      heading: "How does it work?",
      steps: [
        { title: "The customer calls", body: "Your dedicated line, any hour." },
        { title: "It answers and understands", body: "In their dialect — and they can interrupt it." },
        { title: "It acts", body: "Books, answers, logs the details." },
        { title: "It escalates when needed", body: "Your employee takes over in full context." },
      ],
      link: "Read the full journey of a call",
    },
    hybrid: {
      eyebrow: "The hybrid difference",
      heading: "Not just AI. People behind it.",
      body: "AI takes the routine. Your team takes the moments that need a person — arriving already knowing the whole conversation.",
      link: "See the human handoff page",
    },
    vsIvr: {
      heading: "What's the difference between an AI voice agent and a traditional IVR?",
      answer: "An IVR is a menu the caller has to navigate. Saut Najdi talks to them, works out the intent, and acts on it.",
      cols: ["Situation", "Traditional IVR", "Saut Najdi"],
      rows: [
        ["The caller starts", "A menu: press 1, press 2", "They say what they want"],
        ["The caller interrupts", "The menu carries on", "It stops and listens"],
        ["The request isn't on the menu", "Stuck, or waiting for a person", "It acts, or escalates"],
        ["Booking an appointment", "Transferred to a person", "Booked inside the call"],
        ["A human is needed", "Your employee starts from zero", "They inherit transcript and summary"],
      ],
    },
    inbox: {
      heading: "Can I bring calls, WhatsApp and Telegram into one inbox?",
      answer: "Yes — all of them land in one team inbox, where your staff see a customer's whole history and can step into any conversation.",
      channels: ["Phone calls", "WhatsApp Business", "Telegram", "Website chat"],
    },
    capabilities: {
      heading: "What do you get?",
      cards: [
        { title: "The voice agent", body: "Answers in your customers' dialect; they can interrupt and it keeps up.", path: "product/voice-agent" },
        { title: "Human handoff", body: "Your employee inherits full context, and can listen in live.", path: "product/human-handoff" },
        { title: "Arabic knowledge base", body: "Upload PDF and Word files, even scans — the agent answers from them.", path: "product/knowledge-base" },
        { title: "Agent builder", body: "Build your agent on sector-ready templates. No code.", path: "product/agent-builder" },
        { title: "The dashboard", body: "Every call with transcript, recording, summary and your own numbers. Your team places outbound calls from here too, with the agent talking.", path: "product/dashboard" },
      ],
    },
    sectors: {
      heading: "Built for which businesses?",
      tiles: [
        { sector: "Clinics & hospitals", quote: "“I'd like to book an appointment”", path: "solutions/clinics" },
        { sector: "Restaurants", quote: "“Do you have a table tonight?”", path: "solutions/restaurants" },
        { sector: "Hotels", quote: "“Do you have a room free?”", path: "solutions/hotels" },
        { sector: "Real estate", quote: "“Is the apartment still available?”", path: "solutions/real-estate" },
        { sector: "Retail", quote: "“Has my order arrived?”", path: "solutions/retail" },
      ],
      note: "Open your sector to see exactly what the agent handles and what reaches your staff.",
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
    closing: {
      heading: "Ready to see it answer your customers?",
      line: "Pick a time that suits you — a 30-minute demo of the platform live, with your questions answered.",
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
      {/* 1 · Hero — brand-guideline composition (p18): person + laptop + live bubbles.
          The evaluation-only `data-theme="dark"` that used to sit on this
          section is gone: the attribute now lives on <html>, so the `dark:`
          classes below answer to the visitor's choice instead of being
          hard-on. */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-canvas dark:from-[#0C1326] dark:to-night">
        {/* Brand aurora — a soft spectrum wash so the ground is not flat
            black. Dark only; it would muddy the white hero. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden opacity-[0.30] dark:block"
          style={{
            background:
              "radial-gradient(70% 55% at 18% 8%, rgba(46,196,230,0.22) 0%, transparent 60%), radial-gradient(60% 50% at 88% 22%, rgba(226,12,58,0.16) 0%, transparent 62%), radial-gradient(80% 60% at 55% 100%, rgba(111,63,164,0.20) 0%, transparent 65%)",
          }}
        />
        <div className="container relative grid items-center gap-10 pb-6 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6 lg:pb-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
            <h1 className="max-w-3xl text-h2 sm:text-h1">
              {s.h1a}
              <span className="text-gradient">{s.h1b}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/70 dark:text-white/70">
              {s.positioning}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
              <DemoLink locale={locale}>
                {s.ctaPrimary}
              </DemoLink>
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
      <section className="bg-surface py-16">
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

      {/*
        4b · IVR comparison — the first question-shaped H2 on the page. Real
        <table> markup, not a div grid: row/column structure is what answer
        engines extract, and a grid of divs extracts as prose soup. The
        overflow wrapper keeps the min-width table scrolling inside itself so
        the RTL page body never gains a horizontal scrollbar.
      */}
      <section className="container py-16">
        <Reveal>
          <h2 className="text-center text-h2">{s.vsIvr.heading}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-body-lg leading-relaxed text-ink/75">
            {s.vsIvr.answer}
          </p>
        </Reveal>
        <div className="mx-auto mt-8 max-w-4xl overflow-x-auto rounded-2xl border border-line bg-surface shadow-card">
          <table className="w-full min-w-[640px] border-collapse text-body-lg">
            <thead>
              <tr className="border-b border-line">
                {s.vsIvr.cols.map((c, i) => (
                  <th
                    key={c}
                    scope="col"
                    className={`p-4 text-start font-bold ${i === 2 ? "text-brand-blue" : "text-ink/70"}`}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.vsIvr.rows.map((r) => (
                <tr key={r[0]} className="border-b border-line last:border-0">
                  <th scope="row" className="p-4 text-start font-bold text-ink">
                    {r[0]}
                  </th>
                  <td className="p-4 text-ink/60">{r[1]}</td>
                  <td className="p-4 text-ink/85">{r[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/*
        4c · Unified inbox — answer-first capsule under a question-shaped H2.
        The chips list channels only; it deliberately stops short of claiming
        the agent auto-replies on them (messaging auto-reply is off by
        default), so the promise stays "one inbox a human steps into".
      */}
      <section className="container pb-16">
        <Reveal>
          <h2 className="text-center text-h2">{s.inbox.heading}</h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-body-lg leading-relaxed text-ink/75">
            {s.inbox.answer}
          </p>
        </Reveal>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {s.inbox.channels.map((channel) => (
            <li
              key={channel}
              className="rounded-full border border-line bg-surface px-4 py-1.5 text-body font-medium text-ink/75 shadow-card"
            >
              {channel}
            </li>
          ))}
        </ul>
      </section>

      {/* 5 · Capabilities — five cards, each now a real page (Wave 2) */}
      <section className="bg-surface py-16">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-h2">{s.capabilities.heading}</h2>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {s.capabilities.cards.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.06}>
                <Link href={localePath(locale, c.path)} className="block h-full">
                  <div className="card card-hover group h-full border-brand-blue/25">
                    <IconChip
                      name={(["mic", "people", "doc", "sliders", "chart"] as IconName[])[i]}
                      delay={i * 0.1}
                    />
                    <h3 className="mt-3 text-h4">{c.title}</h3>
                    <p className="mt-2 text-body-lg leading-relaxed text-ink/70">{c.body}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · Sectors — five tiles, each linking to its own sector page (Wave 2) */}
      <section className="container py-16">
        <Reveal>
          <h2 className="text-center text-h2">{s.sectors.heading}</h2>
        </Reveal>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {s.sectors.tiles.map((tile, i) => (
            <Reveal key={tile.sector} delay={i * 0.06}>
              <Link href={localePath(locale, tile.path)} className="block h-full">
                <div className="card card-hover group h-full w-52 text-center">
                  <div className="flex justify-center">
                    <IconChip
                      name={(["clinic", "restaurant", "hotel", "estate", "retail"] as IconName[])[i]}
                      delay={i * 0.1}
                    />
                  </div>
                  <p className="mt-3 text-body-lg font-bold">{tile.sector}</p>
                  <p className="mt-2 text-body text-brand-purple">{tile.quote}</p>
                </div>
              </Link>
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

      {/* 10 · From the blog. Between the FAQ and the booking desk on purpose:
          a visitor who read the FAQ and is not ready to book gets somewhere to
          go that is not the exit, and the dated posts are the page's only
          evidence that the site is actively maintained. */}
      <section className="bg-surface py-16">
        <div className="container">
          <Reveal>
            <BlogTeaser locale={locale} />
          </Reveal>
        </div>
      </section>

      {/* 11 · Close on the booking desk itself, not a button that opens one.
          This is the same component /demo uses. The calendar is the last
          thing on the page rather than one more click away, and because
          CalInline only mounts the iframe when the section nears the
          viewport, a visitor who never scrolls this far pays nothing for it. */}
      <section className="bg-night py-14 sm:py-16">
        <div className="container">
          <Reveal className="text-center">
            <h2 className="text-h2 text-white">{s.closing.heading}</h2>
            <p className="mx-auto mt-3 max-w-xl text-body-lg text-white/70">{s.closing.line}</p>
          </Reveal>
          <div className="mt-10">
            <BookingDesk locale={locale} />
          </div>
        </div>
      </section>
    </>
  );
}
