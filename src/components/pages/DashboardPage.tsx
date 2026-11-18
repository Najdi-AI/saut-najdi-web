import type { ReactNode } from "react";
import { OmniChannels } from "@/components/OmniChannels";
import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { dashboardFaq } from "@/content/pageFaq";

/**
 * /product/dashboard (spec P2-22 row 8). Brief-per-feature: a question
 * heading plus one or two sentences per row.
 *
 * Measurement claim boundary (verified in platform code): the analytics
 * surface measures the CUSTOMER's own calls — total calls, the share the AI
 * handled end to end, average call length, per-call sentiment, plus the
 * team's own star ratings and tags, broken down by agent, outcome, day and
 * hour, with CSV/PDF export. We still publish NO numbers about ourselves (no
 * accuracy %, no cost saving). Never call the star rating CSAT or «رضا
 * العملاء» — it is the team's own rating of the call, applied by staff, not
 * collected from callers. No answer-rate or missed-call-rate claims, and no
 * cost or ROI figures (no cost model exists).
 *
 * The live supervisor surface (listen / whisper / take over) is deliberately
 * NOT given a section or an FAQ here — /product/human-handoff owns that query
 * and this page carries a single pointer sentence instead.
 *
 * On the inner-page kit (About is the pilot): PageHero, then every question
 * with its answer as a ruled row. Its FAQ lives in content/pageFaq.ts.
 */

/** About's ruled row: the question on the start side, its answer beside it. */
function Row({ title, delay = 0, children }: { title: string; delay?: number; children: ReactNode }) {
  return (
    <Reveal delay={delay} className="grid gap-4 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-6">
      <h2 className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium text-balance lg:col-span-5">
        {title}
      </h2>
      <div className="max-w-[60ch] space-y-4 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:col-span-7">
        {children}
      </div>
    </Reveal>
  );
}

const t = {
  ar: {
    h1: "كل مكالمة قدامك: مين اتصل، وش قال، ووش صار",
    intro:
      "المشكلة مو الرد على المكالمة — المشكلة إنك ما تعرف وش صار فيها. مين اتصل أمس؟ وش وعدناه؟ لوحة صوت نجدي تخلي كل مكالمة قابلة للفتح والقراءة والقياس، بالعربي.",
    cta: "احجز عرضاً",
    answer: {
      heading: "وش أشوف في لوحة التحكم بعد كل مكالمة؟",
      capsule:
        "بعد ما تسكر المكالمة بثواني: التسجيل، والنص كامل، وملخص عربي يقول ليش اتصل العميل ووش صار ووش باقي، ومؤشر مزاج المكالمة — مع تقييم بالنجوم ووسوم تسهّل عليك تلقاها بعدين. وكل هذا مربوط بملف العميل. وفوقه: تقويم للحجوزات، وأرقام نشاطك محسوبة من مكالماتك أنت، وصلاحيات تحدد مين يشوف وش، وسجل ما يتعدل لكل اطلاع حساس.",
    },
    sections: [
      {
        title: "وش يطلع لي في سجل المكالمات بالضبط؟",
        body:
          "كل مكالمة سطر تفتحه: التسجيل تشغّله من مكانك، والنص الكامل — كلام العميل والوكيل بالترتيب — وملخص عربي يختصرها في ثوانٍ، ومؤشر مزاج المكالمة. تقيّمها بالنجوم وتحط عليها وسوماً زي «شكوى» أو «سؤال سعر». والنص قابل للبحث، فلو قال عميل «قلت لكم قبل شهر» تقرأ اللي انقال بالحرف. التسجيلات تُفتح بروابط موقّعة قصيرة الصلاحية. مدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات.",
      },
      {
        title: "أشوف أرقام أداء نشاطي؟",
        body:
          "إي، أرقامك أنت محسوبة من مكالماتك: إجمالي المكالمات، ونسبة اللي أنهاها الوكيل لحاله، ومتوسط مدة المكالمة، ومزاج كل مكالمة، وتقييمات فريقك بالنجوم والوسوم اللي حطها. وتقسمها حسب الوكيل، أو نتيجة المكالمة، أو اليوم، أو الساعة — وتصدّرها CSV أو PDF. والتقييم هذا تقييم فريقك للمكالمة، مو استبيان نرسله لعميلك. واللي ما تلقاه عندنا: أرقام ننشرها عن أنفسنا — لا نسبة دقة ولا نسبة توفير.",
      },
      {
        title: "أعرف تاريخ العميل اللي يتصل الحين؟",
        body:
          "تعرفه. كل رقم يصير له ملف يجمع خطه الزمني: مكالماته السابقة بملخصاتها، وحجوزاته، والوسوم اللي انحطت عليه — والوكيل نفسه ينادي المتكرر باسمه. وإذا عندك قاعدة عملاء من قبل ترفعها من ملف CSV، والنظام يدمج المكرر مع تتبع حالة الموافقة لكل عميل.",
      },
      {
        title: "وين ألقى الحجوزات اللي سواها الوكيل؟",
        body:
          "في تقويم الحجوزات داخل نفس اللوحة: العميل، والوقت، والخدمة، والمكالمة اللي جاء منها — تقدر ترجع من الحجز للمكالمة وتسمعها. ومن مدير الأوقات المتاحة تضبط أيامك وفتراتك والمواعيد المقفلة وسعة كل فترة، فالوكيل ما يحجز موعداً ما تقدر تخدمه. وأي تعديل على حجز يتسجل بوقته ومصدره.",
      },
      {
        title: "مين يشوف وش؟ وكيف أعرف مين فتح وش ومتى؟",
        body:
          "لكل موظف دور وصلاحيات: مين يسمع التسجيلات، ومين يعدّل الوكيل، ومين يشوف بيانات العملاء. وبيانات منشأتك معزولة على مستوى قاعدة البيانات نفسها. وكل إجراء حساس — حتى اطلاع فريق الدعم عندنا أو تصدير ملف — يُكتب في سجل تدقيق ملحق فقط ما يقدر أحد يعدّله ولا يحذفه. هذي هي الإجابة على «مين شاف بيانات عملائي»: مو وعد، سجل.",
      },
      {
        title: "واللوحة نفسها — تنفع لفريق يشتغل بالعربي؟",
        body:
          "عربية من أساسها مو ترجمة متأخرة: الاتجاه من اليمين لليسار صح في كل شاشة، والمصطلحات بلغة موظف الاستقبال مو المهندس، والأرقام لاتينية زي فواتيرك. ومين يفضّل الإنجليزي يبدّل من حسابه هو. وإذا عندك أكثر من فرع، كل فرع بوكيله وقاعدة معرفته وحجوزاته وأنت تشوفهم من مكان واحد.",
      },
    ],
    // Live listen / whisper / take-over belongs to /product/human-handoff —
    // one pointer sentence inside the call-log row, no section, no FAQ.
    handoff: {
      lead: "وأثناء المكالمة نفسها يقدر فريقك يسمعها ويهمس للوكيل ويستلمها — التفاصيل في ",
      text: "صفحة التصعيد للموظف البشري",
      path: "product/human-handoff",
    },
    faqHeading: "أسئلة عن لوحة التحكم",
  },
  en: {
    h1: "Every call in front of you: who called, what they said, what happened",
    intro:
      "The hard part was never answering — it's knowing what happened afterwards. Who called yesterday? What did we promise them? The Saut Najdi dashboard makes every call openable, readable and measurable, in Arabic.",
    cta: "Book a demo",
    answer: {
      heading: "What do I see in the dashboard after each call?",
      capsule:
        "Seconds after a call ends: the recording, the full transcript, an Arabic summary of why the customer called and what's still open, and a read on the caller's mood — plus star ratings and tags so you can find it again. All of it attaches to the customer's own record. Beyond that: a bookings calendar, your own activity numbers computed from your calls, permissions deciding who sees what, and an unalterable log of every sensitive view.",
    },
    sections: [
      {
        title: "What exactly is in the call log?",
        body:
          "Every call is a row you can open: the recording, playable in place; the full transcript, caller and agent in order; an Arabic summary that compresses the call into seconds of reading; and a sentiment read. You can rate it with stars and tag it — complaint, pricing question, cancelled booking. Transcripts are searchable, so “I told you this a month ago” becomes something you can read rather than argue about. Recordings open only through short-lived signed links. Recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise.",
      },
      {
        title: "Do I get performance numbers for my own operation?",
        body:
          "Yes — your numbers, computed from your calls: total calls, the share the AI handled end to end, average call length, per-call sentiment, and your team's own star ratings and tags. Break them down by agent, outcome, day or hour, and export to CSV or PDF. The rating is your team's assessment of the call, not a survey we send to your customers. What you won't find is numbers we publish about ourselves — no accuracy percentage, no cost-saving percentage.",
      },
      {
        title: "Do I get the history of the customer calling right now?",
        body:
          "You do. Every number gets a customer record holding an ordered timeline: previous calls with their summaries, bookings, ratings and tags — and the agent greets regulars by name. If you already have a customer base, import it from CSV: duplicates are merged and consent status is tracked per contact.",
      },
      {
        title: "Where do the bookings the agent made show up?",
        body:
          "In the reservations calendar inside the same dashboard, with the customer, time, service and the call it came from — so you can jump from a booking straight to the recording. The availability manager sets your days, shifts, blocked dates and slot capacity, so the agent never books something you can't serve. Every change to a booking is recorded with its time and its source.",
      },
      {
        title: "Who can see what — and how do I know who opened what?",
        body:
          "Every employee has a defined role: who plays recordings, who edits the agent, who sees customer data. Your organisation's data is isolated at the database level, not in the interface. And every sensitive action — including a view by our own support staff, or an export — is written to an append-only audit log that nobody can edit or delete. That is the real answer to “who has seen my customers' data”: not a promise, a log.",
      },
      {
        title: "And the dashboard itself — does it work for an Arabic-speaking team?",
        body:
          "It's Arabic-first, not an English interface translated late: right-to-left is correct on every screen, the terminology is written for a receptionist rather than an engineer, and numerals appear in Latin digits like your invoices. Anyone who prefers English switches it on their own account. Multiple branches each run their own agent, knowledge base and bookings, visible to you from one place.",
      },
    ],
    handoff: {
      lead: "And while a call is running, your team can listen in, whisper to the agent, or take it over — the detail is on ",
      text: "the human handoff page",
      path: "product/human-handoff",
    },
    faqHeading: "Dashboard questions",
  },
} as const;

export function DashboardPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      {/* Bottom room so the button doesn't sit on the trust strip's rule. */}
      <PageHero title={s.h1} lead={s.intro} className="pb-12 sm:pb-16">
        <DemoLink locale={locale}>{s.cta}</DemoLink>
      </PageHero>

      <TrustStrip locale={locale} />

      <Section>
        <div className="border-t border-line">
          <Row title={s.answer.heading}>
            <p>{s.answer.capsule}</p>
          </Row>
          {s.sections.map((sec, i) => (
            <Row key={sec.title} title={sec.title} delay={i * 0.06}>
              <p>{sec.body}</p>
              {/* Single pointer to the escalation page — the live-supervisor
                  query is owned by /product/human-handoff, not this page. */}
              {i === 0 && (
                <p>
                  {s.handoff.lead}
                  <Link
                    href={localePath(locale, s.handoff.path)}
                    className="font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red"
                  >
                    {s.handoff.text}
                  </Link>
                  {"."}
                </p>
              )}
            </Row>
          ))}
        </div>
      </Section>

      <Section title={s.faqHeading} layout="split">
        <FaqAccordion items={dashboardFaq[locale]} />
      </Section>

      <OmniChannels locale={locale} />

      <DemoCta locale={locale} />
    </>
  );
}
