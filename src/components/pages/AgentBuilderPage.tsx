import type { ReactNode } from "react";
import { OmniChannels } from "@/components/OmniChannels";
import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";
import { agentBuilderFaq } from "@/content/pageFaq";

/**
 * /product/agent-builder (spec P2-22 row 9). Brief-per-step: a heading plus
 * one or two sentences, never a deep explanation.
 *
 * Claim boundaries: the shipped voice catalogue is Najdi / Hijazi / Levantine
 * / English (male and female) — there is NO Khaleeji voice, do not reintroduce
 * it. Brand-voice cloning is plan-dependent and clones a VOICE, not a new
 * conversational dialect; the full terms live on /product/voice-agent. The
 * page describes authoring, testing and publishing — it never claims the
 * builder replaces the team onboarding step (no self-signup, blueprint §2.2).
 *
 * On the inner-page kit (About is the pilot): PageHero, every question with
 * its answer as a ruled row, and the five steps as rows under their own H2.
 * Its FAQ lives in content/pageFaq.ts.
 */

/** About's ruled row: the heading on the start side, its text beside it. */
function Row({
  title,
  delay = 0,
  level = 2,
  children,
}: {
  title: string;
  delay?: number;
  level?: 2 | 3;
  children: ReactNode;
}) {
  const H = level === 3 ? "h3" : "h2";
  return (
    <Reveal delay={delay} className="grid gap-4 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-6">
      <H className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium text-balance lg:col-span-5">
        {title}
      </H>
      <div className="max-w-[60ch] space-y-4 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:col-span-7">
        {children}
      </div>
    </Reveal>
  );
}

const t = {
  ar: {
    h1: "سوّ وكيلك بنفسك — بدون سطر كود",
    intro:
      "أغلب الأنظمة تعطيك خانة فاضية وتقول «اكتب تعليمات الوكيل». عندنا تبدأ من قالب جاهز لقطاعك، وتنتهي بنسخة جرّبتها بنفسك قبل ما تنشرها.",
    cta: "احجز عرضاً",
    answer: {
      heading: "كيف أسوي وكيلاً صوتياً لنشاطي بدون برمجة؟",
      capsule:
        "خمس خطوات في اللوحة: تختار قالب قطاعك، وتضبط شخصية الوكيل وصوته، وتخلي المنصة تكتب لك وصف الشخصية باللهجة النجدية وتعدّل عليه، وتجرّبه في المحادثة التجريبية وسيناريوهات محفوظة، وبعدها تنشر. والنشر ما هو نهائي: عندك مسودة ونسخة منشورة وسجل نسخ يوريك وش تغيّر — وترجع لأي نسخة بضغطة.",
    },
    stepsHeading: "الخطوات الخمس",
    stepsLead: "كل خطوة شاشة وحدة، وترجع لأي وحدة منها بعدين بدون ما تبني الوكيل من جديد.",
    steps: [
      {
        title: "1 · ابدأ من قالب قطاعك، مو من صفحة بيضا",
        body:
          "قوالب مكتوبة فعلاً للفنادق والعيادات والمطاعم والعقار والتجزئة، وقالب عام لأي نشاط ثاني. والقالب يجي معه أسلوب الرد المناسب وهيكل مبدئي لقاعدة المعرفة يوريك وش تعبّي: قائمة الأسعار للمطعم، وجدول الأطباء للعيادة. وإذا كان نشاطك مختلطاً، سوِّ أكثر من وكيل بدل ما تحشر كل شي في واحد.",
      },
      {
        title: "2 · اضبط شخصيته: نبرته، وصوته، وحدوده",
        body:
          "تحكمات تحركها وتشوف أثرها على طول: مستوى الرسمية، وطول الرد، وجملة الافتتاح. والصوت تختاره من نجدي أو حجازي أو شامي أو إنجليزي، رجالي أو نسائي، وتسمع عينة قبل ما تعتمد — وتقدر تستخدم صوت علامتك المستنسخ حسب باقتك. وفوقها الحدود: وش ما يتكلم فيه أبداً، وأي موضوع يصعّده على طول — زي عيادة تمنع أي كلام تشخيصي.",
      },
      {
        title: "3 · ما تعرف تكتب تعليمات لذكاء اصطناعي؟ خله يكتبها",
        body:
          "تكتب نشاطك بلغتك العادية — «مطعم مندي في حي النرجس، الحجز للعوائل، الذروة يوم الجمعة» — والمنصة تصيغ منها وصف شخصية كامل باللهجة النجدية. النص يطلع قدامك مكتوباً، مو صندوقاً أسود: تقرأه، وتعدّل أي جملة، وتعيد التوليد إذا ما ناسبك الأسلوب.",
      },
      {
        title: "4 · جرّبه قبل ما يوصل لعميلك",
        body:
          "المحادثة التجريبية داخل اللوحة تسأله فيها زي ما بيسأله عميلك. والأهم: تحفظ سيناريوهات اختبار — «عميل يبغى يلغي حجزه»، «عميل منزعج» — وتعيد تشغيلها كلها بعد كل تعديل عشان ما ينكسر شي كان شغالاً. وفيه أداة ثانية تختبر قاعدة المعرفة لحالها، فتعرف إن كان الخلل في المحتوى ولا في الشخصية.",
      },
      {
        title: "5 · انشر — وارجع إذا احتجت",
        body:
          "عندك مسودة تعدّل عليها براحتك، ونسخة منشورة هي اللي ترد على عملائك. وقبل النشر توريك المنصة وش تغيّر بالضبط بين النسختين. وسجل النسخ محفوظ، فإذا ما عجبك تعديل بعد يومين ترجع لنسخة سابقة بضغطة. وكل نشر يتسجل: مين نشر ومتى.",
      },
    ],
    who: {
      heading: "مين من فريقي يقدر يعدّل الوكيل؟",
      body:
        "أنت تحدد. الصلاحيات تتضبط لكل موظف: واحد يعدّل وينشر، وواحد يعدّل على المسودة وينتظر اعتمادك، وواحد يشوف بدون ما يلمس. والإجراءات الحساسة تُكتب في سجل تدقيق ملحق فقط ما يقدر أحد يعدّله — فتعطي فريقك حرية بدون ما تفقد القدرة تعرف مين سوى وش ومتى.",
    },
    note: {
      heading: "وأول وكيل؟ ما نتركك تتصرف",
      body:
        "ما في تسجيل ذاتي في صوت نجدي، وهذا مقصود. فريقنا يجهّز حسابك ويبني معك أول وكيل — القالب، وقاعدة المعرفة الأولى، وقواعد التصعيد — ويمشي معك في أول أسبوع. بعدها اللوحة بيدك: تعدّل وتجرب وتنشر بدون ما تفتح تذكرة دعم عشان تغيّر جملة.",
      link: {
        lead: "والمحتوى اللي تغذّي فيه وكيلك تبنيه في ",
        text: "قاعدة المعرفة من ملفاتك",
        path: "product/knowledge-base",
      },
    },
    faqHeading: "أسئلة عن بناء الوكيل",
  },
  en: {
    h1: "Build your own agent — without a line of code",
    intro:
      "Most platforms hand you an empty box and tell you to write the agent's instructions. Here you start from a template written for your sector and finish with a version you have tested yourself before publishing.",
    cta: "Book a demo",
    answer: {
      heading: "How do I build a voice agent for my business without coding?",
      capsule:
        "Five steps in the dashboard: pick your sector template, set the agent's personality and voice, let the platform draft its persona in Najdi Arabic and edit that draft, test it in a test chat and in saved scenarios, then publish. Publishing isn't final: you always have a draft, a published version, and a history showing exactly what changed between them.",
    },
    stepsHeading: "The five steps",
    stepsLead: "One screen per step, and you can return to any of them later without rebuilding the agent.",
    steps: [
      {
        title: "1 · Start from your sector's template, not a blank page",
        body:
          "Templates genuinely authored for hotels, clinics, restaurants, real estate and retail, plus a generic one for anything else. Each brings the tone that suits the sector and a starter knowledge-base structure showing what to fill in — the price list for a restaurant, the doctors' schedule for a clinic. If your business has distinct sides to it, run more than one agent rather than cramming everything into one.",
      },
      {
        title: "2 · Set its personality: tone, voice, and limits",
        body:
          "Controls you move and hear the effect of straight away: formality, reply length, the opening line. Voices are Najdi, Hijazi, Levantine or English, male or female, with a sample before you commit — and your own cloned brand voice is available depending on your plan. Then the guardrails: what it never discusses, and what it escalates immediately — a clinic bars anything diagnostic, an estate agency bars negotiating on price.",
      },
      {
        title: "3 · Don't know how to write AI instructions? Let it write them",
        body:
          "Describe your business in plain language and the platform drafts a full persona in Najdi Arabic: how it greets, how it handles a pricing question, what it does when you're fully booked. The text appears in front of you, not inside a black box — read it, edit any sentence, regenerate if the style is off.",
      },
      {
        title: "4 · Test it before it ever reaches a customer",
        body:
          "A test chat inside the dashboard lets you ask what your customers ask. More valuable: save test scenarios — a cancellation, an undocumented price, an upset caller — and replay all of them after every change so a small tweak can't quietly break something. A separate panel tests the knowledge base on its own, so you can tell a content problem from a personality problem.",
      },
      {
        title: "5 · Publish — and roll back if you need to",
        body:
          "A draft you edit freely, a published version that answers your customers. Before publishing you see a clear comparison of what changed between the two. The version history is kept, so a change that turns out badly two days later is one click to undo — and every publish records who did it and when.",
      },
    ],
    who: {
      heading: "Who on my team is allowed to edit the agent?",
      body:
        "You decide. Permissions are set per employee: one person edits and publishes, another edits the draft and waits for approval, another can look without touching. Sensitive actions are written to an append-only audit log nobody can edit — so you can give your team room to improve the agent without losing the record of who did what.",
    },
    note: {
      heading: "And the first agent? You're not left to figure it out",
      body:
        "There is no self-signup at Saut Najdi, and that is deliberate. Our team sets up the account and builds the first agent with you — the template, the initial knowledge base, the escalation rules — and stays with you through the first week. After that the dashboard is yours: edit, test and publish without raising a ticket to change a sentence.",
      link: {
        lead: "The content that feeds your agent is built in ",
        text: "the knowledge base from your files",
        path: "product/knowledge-base",
      },
    },
    faqHeading: "Agent builder questions",
  },
} as const;

export function AgentBuilderPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <PageHero title={s.h1} lead={s.intro}>
        <DemoLink locale={locale}>{s.cta}</DemoLink>
      </PageHero>

      <Section>
        <div className="border-t border-line">
          <Row title={s.answer.heading}>
            <p>{s.answer.capsule}</p>
          </Row>
        </div>
      </Section>

      {/* The steps' label is their section's H2 now, so each step is an H3. */}
      <Section title={s.stepsHeading} lead={s.stepsLead}>
        <div className="border-t border-line">
          {s.steps.map((step, i) => (
            <Row key={step.title} title={step.title} level={3} delay={i * 0.04}>
              <p>{step.body}</p>
            </Row>
          ))}
        </div>
      </Section>

      <Section>
        <div className="border-t border-line">
          {/* Honesty beat: the builder is real, but onboarding is done by the
              team — there is no self-signup anywhere on this site. */}
          <Row title={s.note.heading}>
            <p>{s.note.body}</p>
            <p>
              {s.note.link.lead}
              <Link
                href={localePath(locale, s.note.link.path)}
                className="font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red"
              >
                {s.note.link.text}
              </Link>
              {"."}
            </p>
          </Row>
          <Row title={s.who.heading}>
            <p>{s.who.body}</p>
          </Row>
        </div>
      </Section>

      <Section title={s.faqHeading} layout="split">
        <FaqAccordion items={agentBuilderFaq[locale]} />
      </Section>

      <OmniChannels locale={locale} />

      <DemoCta locale={locale} />
    </>
  );
}
