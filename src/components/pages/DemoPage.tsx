import type { ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { BookingDesk } from "@/components/BookingDesk";
import { Reveal } from "@/components/Reveal";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import type { FaqItem } from "@/lib/schema";

/**
 * /demo (blueprint §2.4): server-rendered copy on top, the booking desk
 * below. Public plan prices live on /pricing; setup is scoped here.
 *
 * THE BOOKING DESK is one dark card holding three columns: our panel, then
 * Cal's calendar and slot columns. Cal's own event panel is switched off
 * (`hideEventTypeDetails`, see lib/cal.ts) and ours takes its place, because
 * the upstream event is titled "demo" with an empty description and a single
 * Cal description cannot serve both locales. Ours is bilingual, RTL-correct,
 * and — unlike anything inside the iframe — server-rendered.
 *
 * Everything under the desk exists for the same reason: CalInline renders
 * only a loading <p> on the server, so without it this — the site's only
 * conversion page — would ship ~80 indexable words. The four question-shaped
 * H2s answer what a visitor hesitates over before booking (price, who to
 * bring, why they can't just call in), and the FAQ below feeds the page's
 * FAQPage node via the `demoFaq` export.
 *
 * On the inner-page kit (About is the pilot): PageHero, the desk, each
 * question with its answer as a ruled row, the FAQ in the split layout.
 * pageFactory imports this module for `demoFaq`, so imports here stay
 * server-only or already ship everywhere.
 */

/** About's ruled row (PR 11's local Row): the question on the start side, its answer beside it. */
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
    h1: "احجز",
    h1Tail: "عرضاً تعريفياً",
    lead: "عرض 30 دقيقة: نوريك المنصة حية، تسمع الوكيل بلهجتك، ونجاوب أسئلتك.",
    pricingNote: "بعد العرض نرسل لك سعراً مكتوباً يوضح رسوم الباقة والتجهيز حسب احتياج منشأتك.",
    sections: [
      {
        h: "كيف تُحسب رسوم التجهيز؟",
        p: "أسعار الباقات الشهرية ورصيدها معلنة في صفحة الباقات. في العرض نعرف احتياج منشأتك ونرسل لك عرضاً مكتوباً يوضح رسوم التجهيز وأي تكاليف إضافية قبل الدفع.",
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
        p: "تفهم كيف تشتغل المنصة وتلقى إجابات على أسئلة البيانات. وبعد العرض نرسل لك سعراً مكتوباً وخطة تجهيز تبين الرسوم حسب احتياج منشأتك. وفريقنا يجهز لك الوكيل وقاعدة المعرفة وقواعد التصعيد — ما في تسجيل ذاتي.",
      },
    ],
    related: [
      { path: "how-it-works", label: "رحلة المكالمة كاملة" },
      { path: "product/human-handoff", label: "كيف يستلم موظفك المكالمة" },
      { path: "security", label: "أسئلة البيانات وPDPL" },
      { path: "pricing", label: "الباقات والأسعار" },
      { path: "refund-policy", label: "سياسة الاسترداد والإلغاء" },
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
    h1: "Book",
    h1Tail: "an intro demo",
    lead: "30 minutes: the platform live, the agent speaking your customers' dialect, and your questions answered.",
    pricingNote: "After the demo, we send a written quote covering your plan and setup needs.",
    sections: [
      {
        h: "How is the setup fee calculated?",
        p: "Monthly plan prices and credits are on the pricing page. In the demo we learn your business needs, then send a written offer showing setup fees and any additional costs before payment.",
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
        p: "You see how the platform works and get answers on data and security. After the demo, we send a written quote and setup plan showing the fees for your needs. If you go ahead, our team builds the agent, the knowledge base and the escalation rules — there's no self-signup.",
      },
    ],
    related: [
      { path: "how-it-works", label: "A full call's journey" },
      { path: "product/human-handoff", label: "How your employee takes a call over" },
      { path: "security", label: "Data and PDPL questions" },
      { path: "pricing", label: "Plans & pricing" },
      { path: "refund-policy", label: "Refund & Cancellation Policy" },
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
      <PageHero
        title={
          <>
            {s.h1} <span className="text-muted-foreground">{s.h1Tail}</span>
          </>
        }
        lead={s.lead}
      >
        <p className="max-w-[52ch] text-body-lg font-bold">{s.pricingNote}</p>
      </PageHero>

      {/* The booking desk, shared with the old homepage: its own Charcoal
          .on-dark card (BookingDesk), so it sits on the page's ground with no
          band of its own. */}
      <section className="pt-12 sm:pt-16">
        <div className="container">
          <BookingDesk locale={locale} />
        </div>
      </section>

      <Section>
        <div className="border-t border-line">
          {s.sections.map((sec, i) => (
            <Row key={sec.h} title={sec.h} delay={i * 0.04}>
              <p>{sec.p}</p>
            </Row>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-1">
          {s.related.map((r) => (
            <Link
              key={r.path}
              href={localePath(locale, r.path)}
              className="inline-flex min-h-12 items-center text-body-lg font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red"
            >
              {r.label}
            </Link>
          ))}
        </div>
      </Section>

      {/* No DemoCta here — the booking desk above already is the CTA, so the
          page ends on the FAQ with its own bottom room. */}
      <Section title={s.faqHeading} layout="split" className="pb-[clamp(96px,11.2vw,168px)]">
        <FaqAccordion items={s.faq} />
      </Section>
    </>
  );
}

export const demoFaq = { ar: t.ar.faq, en: t.en.faq };
