import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// Positional — one per step in `steps`.
const stepIcons: IconName[] = ["badge", "sliders", "chat", "check", "repeat"];

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
 */

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
    faq: [
      {
        q: "أحتاج مبرمج عشان أبني الوكيل؟",
        a: "ما تحتاج. كلها شاشات عربية: قالب، وتحكمات شخصية، وصوت، وتجربة، ونشر. وأول وكيل نبنيه معك على أي حال.",
      },
      {
        q: "عندكم قالب لقطاعي؟",
        a: "عندنا قوالب مكتوبة فعلاً للفنادق والعيادات والمطاعم والعقار والتجزئة، وقالب عام لأي نشاط غيرها — وكل قالب يجي معه هيكل مبدئي لقاعدة المعرفة.",
      },
      {
        q: "إذا عدّلت الوكيل، كيف أتأكد إني ما كسرت شيئاً شغالاً؟",
        a: "بسيناريوهات الاختبار المحفوظة: تحفظ حالاتك المهمة مرة وحدة وتعيد تشغيلها بعد كل تعديل، وتشوف وش تغيّر في الردود قبل ما تنشر.",
      },
      {
        q: "أقدر أرجع لنسخة قديمة بعد النشر؟",
        a: "تقدر. مسودة ونسخة منشورة وسجل نسخ كامل مع مقارنة توريك وش تغيّر — والرجوع ضغطة وحدة بدون إعادة بناء.",
      },
    ] as FaqItem[],
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
    faq: [
      {
        q: "Do I need a developer to build the agent?",
        a: "No. Every step is a screen: template, personality controls, voice, test, publish. And the first agent is built with you by our team.",
      },
      {
        q: "Do you have a template for my sector?",
        a: "Templates written for hotels, clinics, restaurants, real estate and retail, plus a generic one — each with a starter knowledge-base structure showing what to fill in.",
      },
      {
        q: "If I edit the agent, how do I know I haven't broken something?",
        a: "Saved test scenarios: capture the cases that matter once, replay them after every change, and see what moved in the replies before you publish.",
      },
      {
        q: "Can I go back to an older version after publishing?",
        a: "Yes. A draft, a published version, a full history and a comparison of what changed — rolling back takes one click and rebuilds nothing.",
      },
    ] as FaqItem[],
  },
} as const;

export function AgentBuilderPage({ locale }: { locale: Locale }) {
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

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.answer.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.answer.capsule}</p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{s.stepsHeading}</p>
            <p className="mt-2 text-body-lg leading-relaxed text-ink/70">{s.stepsLead}</p>
          </Reveal>
          <div className="mx-auto mt-10 max-w-3xl space-y-6">
            {s.steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.04}>
                <article className="card card-hover group border-s-4 border-s-brand-blue">
                  <div className="flex items-start gap-4">
                    <IconChip name={stepIcons[i]} className="shrink-0" delay={i * 0.1} />
                    <div>
                      <h2 className="text-h4">{step.title}</h2>
                      <p className="mt-3 text-body-lg leading-relaxed text-ink/80">{step.body}</p>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        {/* Honesty beat: the builder is real, but onboarding is done by the
            team — there is no self-signup anywhere on this site. */}
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h3">{s.note.heading}</h2>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.note.body}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">
            {s.note.link.lead}
            <Link
              href={localePath(locale, s.note.link.path)}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.note.link.text}
            </Link>
            {"."}
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-12 max-w-3xl text-center">
          <h2 className="text-h3">{s.who.heading}</h2>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.who.body}</p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const agentBuilderFaq = { ar: t.ar.faq, en: t.en.faq };
