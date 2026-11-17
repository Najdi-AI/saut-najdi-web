import type { ReactNode } from "react";
import { OmniChannels } from "@/components/OmniChannels";
import type { Locale } from "@/lib/i18n";
import { DemoLink } from "@/components/DemoLink";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SampleConversation } from "@/components/SampleConversation";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import type { FaqItem } from "@/lib/schema";

/**
 * /product/human-handoff — the moat page (blueprint §6.2 ★). Scene first,
 * then four short pillars: escalation rules, live supervision, inherited
 * context, after-hours callbacks. Copy is deliberately brief — one idea per
 * block, outcome first. Warm mid-call phone transfer is still NOT promised
 * as GA (research §3.2); everything here is shipped.
 *
 * On the inner-page kit (About is the pilot): PageHero, the scene beside its
 * conversation, the pillars as flat tiles, and the remaining questions as
 * ruled rows. pageFactory imports this module for its FAQ, so imports here
 * stay server-only or already ship everywhere.
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
    h1: "إذا احتاجت المكالمة إنسان… موظفك يستلمها وهو فاهم كل شي",
    intro:
      "كل المنصات تقول «نحوّل للبشر». الفرق عندنا: موظفك يستلم المحادثة كاملة — نصها وملخصها وتاريخ صاحبها — مو مكالمة باردة من الصفر.",
    cta: "احجز عرضاً",
    scene: {
      heading: "كيف يصير التحويل على أرض الواقع؟",
      body: "عميل يحجز موعد أسنان مع الوكيل، وبعدها يسأل عن ألم بعد حشوة. الوكيل ما يجتهد بجواب طبي — يحوّل فوراً:",
    },
    pillars: {
      // The old statement heading survives as the label over the pillars:
      // the H2 slot carries the question a buyer actually types.
      label: "أربع ركائز — كلها شغالة اليوم",
      heading: "متى تتحول المكالمة من الذكاء الاصطناعي لموظف بشري؟",
      capsule:
        "في أربع حالات: طلب العميل إنسان، أو بان انزعاجه، أو تكرر سؤال ما انحل، أو صار الموضوع أكبر من صلاحيات الوكيل. والقواعد أنت تحددها.",
      items: [
        {
          title: "1 · قواعد تصعيد تحددها أنت",
          body: "طلب العميل إنسان؟ التحويل فوري وما يتفاوض فيه الوكيل. باقي الحالات تضبطها على نشاطك.",
        },
        {
          title: "2 · فريقك يسمع المكالمة الحية ويتدخل",
          body: "من اللوحة: تسمع مباشرة، تهمس للوكيل بدون ما يسمعك العميل، أو تستلم المكالمة بضغطة.",
        },
        {
          title: "3 · الموظف يستلم ومعه كل شي",
          body: "سبب التحويل، نص المحادثة، ملخص عربي، وتاريخ العميل معكم. ما يحتاج العميل يعيد كلامه.",
        },
        {
          title: "4 · برا الدوام ما في طريق مسدود",
          body: "الوكيل يعرف أوقات دوامك. يسجل طلب اتصال بوقت العميل المفضل، ويظهر لفريقك في اللوحة.",
        },
      ],
    },
    live: {
      heading: "أقدر أسمع مكالمة وهي شغالة وأستلمها؟",
      capsule:
        "إي. تسمع أي مكالمة لحظة بلحظة، وتوجّه الوكيل بهمسة ما يسمعها العميل، أو توقفه وتكمل أنت مع العميل.",
    },
    after: {
      heading: "وش يصير بعد المكالمة؟",
      body: "كل تصعيد يتسجل: متى وليش ومين استلم. تراجع النص والتسجيل، وتعدل قواعد التصعيد على ضوئه.",
    },
    faq: [
      {
        q: "مين يحدد قواعد التصعيد؟",
        a: "أنت. تجيك قواعد افتراضية منطقية، وتعدل عليها: وش يتحول، لمين، ومتى.",
      },
      {
        q: "وش يشوف موظفي لما يستلم المكالمة؟",
        a: "سبب التصعيد، ونص المحادثة كامل، وملخص عربي، وتاريخ العميل معكم — كله قدامه لحظة الاستلام.",
      },
      {
        q: "أقدر أراقب مكالمات الوكيل؟",
        a: "تقدر. من اللوحة تتابع المكالمات الحية، تسمع، تهمس للوكيل، أو تستلم بضغطة وحدة.",
      },
      {
        q: "وإذا كان الاتصال برا الدوام؟",
        a: "يخدم العميل في اللي يقدر عليه، وإذا احتاج إنسان يسجل طلب اتصال ويوعده إن أحد من فريقك يرجع له.",
      },
    ] as FaqItem[],
    faqHeading: "أسئلة عن التصعيد",
  },
  en: {
    h1: "When a call needs a human, your employee takes over already briefed",
    intro:
      "Every platform says it transfers to a human. What matters is what the human receives: not a cold start — the whole conversation, its summary, and the caller's history.",
    cta: "Book a demo",
    scene: {
      heading: "What does a handoff actually look like?",
      body: "A customer books a dental appointment with the agent, then asks about pain after a filling. The agent doesn't improvise a medical answer — it hands over:",
    },
    pillars: {
      label: "Four pillars — all live today",
      heading: "When does an AI call get handed to a human agent?",
      capsule:
        "Four triggers: the caller asks for a human, the caller sounds upset, a question stays unresolved, or the matter goes beyond the agent's remit. You set the rules.",
      items: [
        {
          title: "1 · Escalation rules you control",
          body: "Ask for a human and the transfer is immediate — the agent never negotiates it. Every other trigger is yours to tune.",
        },
        {
          title: "2 · Your team listens in — and steps in",
          body: "From the dashboard: listen live, whisper coaching the caller never hears, or take the call over in one click.",
        },
        {
          title: "3 · The employee inherits everything",
          body: "Handoff reason, full transcript, a clear summary, and the caller's history with you. Nobody has to repeat themselves.",
        },
        {
          title: "4 · After hours, no dead ends",
          body: "The agent knows your opening hours. It logs a callback request with the caller's preferred time, waiting in your dashboard.",
        },
      ],
    },
    live: {
      heading: "Can I listen to a live call and take it over?",
      capsule:
        "Yes. Listen to any call as it happens, whisper to the agent unheard by the caller, or pause the AI and carry on with the customer yourself.",
    },
    after: {
      heading: "What happens after the call?",
      body: "Every escalation is logged — when, why, and who took it. Review the transcript and recording, then tune the rules on what you see.",
    },
    faq: [
      {
        q: "Who defines the escalation rules?",
        a: "You do. Sensible defaults ship with the platform, and you tune what transfers, to whom, and when.",
      },
      {
        q: "What does my employee see when they take over?",
        a: "The escalation reason, the full transcript, a summary, and the caller's history — all on screen at the moment of takeover.",
      },
      {
        q: "Can I monitor the agent's calls?",
        a: "Yes. Watch live calls from the dashboard, listen in, whisper to the agent, or take over in one click.",
      },
      {
        q: "What about calls outside working hours?",
        a: "The agent handles what it can, then logs a callback request with the caller's preferred time for your team the next morning.",
      },
    ] as FaqItem[],
    faqHeading: "Handoff questions",
  },
} as const;

export function HumanHandoffPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      {/* Bottom room so the button doesn't sit on the trust strip's rule. */}
      <PageHero title={s.h1} lead={s.intro} className="pb-12 sm:pb-16">
        <DemoLink locale={locale}>{s.cta}</DemoLink>
      </PageHero>

      <TrustStrip locale={locale} />

      <Section title={s.scene.heading} lead={s.scene.body} layout="split">
        <SampleConversation locale={locale} />
      </Section>

      <Section title={s.pillars.heading} lead={s.pillars.capsule}>
        <p className="mb-6 text-[1.25rem] font-bold">{s.pillars.label}</p>
        <div className="grid gap-2 md:grid-cols-2">
          {s.pillars.items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08} className="h-full">
              <div className="h-full bg-silver-gray p-6">
                <h3 className="text-[1.25rem] leading-[1.3] font-bold">{p.title}</h3>
                <p className="mt-2 text-body-lg leading-relaxed text-muted-foreground">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <div className="border-t border-line">
          {/* Live listen/whisper/take-over is the page's strongest claim but it
              was buried inside pillar 2 — it gets its own question heading so
              the query «أقدر أسمع مكالمة وهي شغالة» lands on an answer. */}
          <Row title={s.live.heading}>
            <p>{s.live.capsule}</p>
          </Row>
          <Row title={s.after.heading}>
            <p>{s.after.body}</p>
          </Row>
        </div>
      </Section>

      <Section title={s.faqHeading} layout="split">
        <FaqAccordion items={s.faq} />
      </Section>

      <OmniChannels locale={locale} />

      <DemoCta locale={locale} />
    </>
  );
}

export const handoffFaq = { ar: t.ar.faq, en: t.en.faq };
