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
 * /product/agent-builder (spec P2-22 row 9). Traces to research §3.1: the
 * 5-step builder, sector templates truly authored for hotel / clinic /
 * restaurant / real-estate / retail (+ generic) with auto-provisioning and
 * KB skeleton seeding, personality controls, AI prompt generation in Najdi
 * Arabic, test chat, saved scenario regression tests, and draft→publish
 * versioning with a diff. The page describes authoring, testing and
 * publishing — it never claims the builder replaces the team onboarding
 * step (there is no self-signup, blueprint §2.2).
 */

const t = {
  ar: {
    h1: "سوّ وكيلك بنفسك — بدون سطر كود",
    intro:
      "أغلب أنظمة الذكاء الاصطناعي تعطيك خانة فاضية وتقول لك «اكتب تعليمات الوكيل». وهذا أسوأ مكان تبدأ منه. وبناء الوكيل في صوت نجدي يبدأ من قالب جاهز لقطاعك، وينتهي بنسخة جرّبتها بنفسك قبل ما تنشرها — وكل خطوة بينهما شاشة عربية تفهمها بدون مبرمج، وتشوف أثر أي تعديل على طول.",
    cta: "احجز عرضاً",
    answer: {
      heading: "كيف أسوي وكيلاً صوتياً لنشاطي بدون برمجة؟",
      capsule:
        "خمس خطوات في اللوحة: تختار قالب قطاعك — فندق، عيادة، مطعم، عقار، تجزئة، أو قالب عام — وتضبط شخصية الوكيل وصوته ولهجته، وتخلي المنصة تكتب لك وصف الشخصية باللهجة النجدية وتعدّل عليه، وتجرّبه في شات تجريبي وسيناريوهات محفوظة تعيد تشغيلها مع كل تعديل، وبعدها تنشر. والنشر ما هو نهائي: عندك مسودة ونسخة منشورة وسجل نسخ يوريك وش تغيّر بالضبط بين نسخة ونسخة، وترجع لأي نسخة سابقة بضغطة. وتقدر تسوي أكثر من وكيل — لفروعك أو لأقسامك — وكل وكيل بشخصيته وقاعدة معرفته وصلاحيات مين يعدّل عليه.",
    },
    stepsHeading: "الخطوات الخمس",
    stepsLead: "كل خطوة شاشة وحدة، وتقدر ترجع لأي خطوة بعدين بدون ما تبني الوكيل من جديد. وما في خطوة تحتاج فيها أحد تقني — كلها اختيارات وتحكمات ونص تقراه وتعدّله.",
    steps: [
      {
        title: "1 · ابدأ من قالب قطاعك، مو من صفحة بيضا",
        body:
          "عندنا قوالب مكتوبة فعلاً لخمسة قطاعات: الفنادق، والعيادات، والمطاعم، والعقار، والتجزئة — وقالب عام لأي نشاط ثاني. والقالب مو مجرد اسم: يجي معه أسلوب الرد المناسب للقطاع، والأسئلة المتوقعة فيه، وهيكل مبدئي لقاعدة المعرفة يوريك وش المعلومات اللي لازم تعبّيها — قائمة الأسعار للمطعم، وجدول الأطباء للعيادة، وسياسة الإلغاء للفندق. يعني تبدأ من وكيل يعرف شغلك تقريباً، وتقضي وقتك في تعديل التفاصيل بدل ما تخترع كل شي من الصفر. وأول ما تختار القالب، الوكيل ينشأ لك جاهزاً بإعداداته الأساسية. وإذا كان نشاطك مختلطاً — مثلاً عيادة فيها قسم تجميل وقسم أسنان، أو مطعم يقدم توصيل وقاعات مناسبات — تقدر تسوي أكثر من وكيل، كل واحد بقالبه وقاعدة معرفته، بدل ما تحشر كل شي في وكيل واحد يضيع بين المواضيع.",
      },
      {
        title: "2 · اضبط شخصيته: نبرته، وصوته، وحدوده",
        body:
          "الشخصية مو نص طويل تكتبه — هي مجموعة تحكمات تحركها وتشوف أثرها. تختار مستوى الرسمية: وكيل عيادة يميل للهدوء والاحترام، ووكيل مطعم يميل للود والسرعة. وتختار طول الرد: مختصر يمشي المكالمة بسرعة، أو مفصّل يشرح للعميل الجديد. وتختار الصوت واللهجة — نجدي أو حجازي أو خليجي، رجالي أو نسائي — وتسمع عينة قبل ما تعتمد. وتكتب جملة الافتتاح اللي تبيه يقولها في أول المكالمة، وتقدر تضمّنها إشعاراً بالتسجيل إذا كانت سياستك تتطلبه. وفوق هذا كله تحط الحدود: وش الأشياء اللي ما يتكلم فيها أبداً، وأي موضوع يصعّده لموظفك على طول. الحدود هذي مهمة أكثر مما تتوقع: عيادة تمنع وكيلها من أي كلام تشخيصي، ومكتب عقار يمنعه من التفاوض على السعر، ومطعم يمنعه من الوعد بطلب خاص خارج القائمة. وكل ما ضبطته هنا تشوف أثره في التجربة على طول، فتقدر تعدّل وتسمع الفرق بدل ما تخمّن.",
      },
      {
        title: "3 · ما تعرف تكتب تعليمات لذكاء اصطناعي؟ خله يكتبها",
        body:
          "هذي الخطوة اللي يعلق فيها أغلب الناس. الحل عندنا إنك تكتب نشاطك بلغتك العادية — «مطعم مندي في حي النرجس، الحجز للعوائل، الذروة يوم الجمعة» — والمنصة تصيغ لك منها وصف شخصية كامل باللهجة النجدية: كيف يسلّم، وكيف يرد على سؤال السعر، وكيف يتصرف إذا كان المطعم كامل. النص يطلع لك مكتوباً قدامك — مو صندوقاً أسود — تقراه وتعدّل عليه أي جملة ما عجبتك، وتعيد التوليد إذا ما ناسبك الأسلوب. النتيجة إنك تبدأ من مسودة محترمة بدل صفحة فاضية، وتظل أنت صاحب القرار في كل كلمة. والنص يطلع بلهجة سعودية طبيعية مو بعربية مترجمة، لأن هذا هو الكلام اللي بيسمعه عميلك فعلاً. ونصيحة من التجربة: بدل ما تحاول تكتب كل الاحتمالات، اكتب اللي يميّز نشاطك — وش تسوونه أفضل من غيركم، ووش الأسئلة اللي تجيكم كل يوم، ووش الشي اللي ما تسمحون فيه أبداً. والباقي تبنيه في قاعدة المعرفة وفي قواعد التصعيد.",
      },
      {
        title: "4 · جرّبه قبل ما يوصل لعميلك",
        body:
          "قبل النشر، تتكلم مع وكيلك في شات تجريبي داخل اللوحة: تسأله زي ما بيسأله عميلك، وتشوف ردوده كاملة، وتشوف إذا كان يرد من قاعدة معرفتك صح. واللي أهم من التجربة الوحدة: تقدر تحفظ سيناريوهات اختبار — «عميل يبغى يلغي حجزه»، «عميل يسأل عن سعر ما هو مكتوب»، «عميل منزعج» — وتعيد تشغيلها كلها دفعة وحدة بعد كل تعديل، والمنصة تحكم على الردود وتوريك وش تغيّر. يعني تعديل بسيط في الشخصية ما يكسر شيئاً كان شغالاً وأنت ما تدري. هذي طريقة المبرمجين في الاختبار، بس بشاشة عربية بدون كود. وفيه لوحة ثانية تختبر فيها قاعدة المعرفة لحالها: تكتب سؤالاً وتشوف أي مقطع من ملفاتك رجع ومن أي ملف — فتعرف إن كان الخلل في المحتوى ولا في شخصية الوكيل. تفريق بسيط بس يختصر عليك ساعات تخمين.",
      },
      {
        title: "5 · انشر — وارجع إذا احتجت",
        body:
          "الوكيل عنده نسختان دايماً: مسودة تعدّل عليها براحتك، ونسخة منشورة هي اللي ترد على عملائك. تعدل وتجرب على المسودة بدون ما تلمس المنشور، ولما تجهز تضغط نشر. وهذا يعني إنك تقدر تجرب فكرة جديدة — نبرة أقصر، أو جملة افتتاح ثانية، أو حد جديد — وأنت مرتاح إن عملاءك ما يسمعونها لين تعتمدها. وقبل النشر توريك المنصة مقارنة واضحة بين النسختين: وش الجمل اللي تغيّرت، وش الإعدادات اللي تعدّلت، وش الحدود اللي انضافت أو انشالت. وسجل النسخ محفوظ، فإذا طلع تعديل ما عجبك بعد يومين، ترجع لنسخة سابقة بدون ما تعيد بناء أي شي. التعديل يصير قراراً تقدر تتراجع عنه — وهذي الطمأنينة اللي تخليك فعلاً تعدّل بدل ما تخاف. وكل نشر يتسجل: مين نشر، ومتى، ووش كان في النسخة — فإذا اشتغل معك أكثر من شخص على الوكيل، ما تحتاج تسأل «مين غيّر هذا؟».",
      },
    ],
    who: {
      heading: "مين من فريقي يقدر يعدّل الوكيل؟",
      body:
        "أنت تحدد. الصلاحيات في اللوحة تتضبط لكل موظف: واحد يقدر يعدّل وينشر، وواحد يعدّل على المسودة بس وينتظر اعتمادك، وواحد يشوف بدون ما يلمس. وبيانات منشأتك معزولة عن أي منشأة ثانية عزلاً مفروضاً على مستوى قاعدة البيانات، والإجراءات الحساسة تُكتب في سجل تدقيق ملحق فقط ما يقدر أحد يعدّله أو يحذفه. يعني تقدر تعطي فريقك حرية يعدّلون فيها بدون ما تفقد القدرة تعرف مين سوى وش ومتى — وهذا الشي اللي يخلي الفرق فعلاً تستخدم بناء الوكيل بدل ما تجمد الوكيل من أول شهر خوفاً من الخربطة.",
    },
    note: {
      heading: "وأول وكيل؟ ما نتركك تتصرف",
      body:
        "ما في تسجيل ذاتي في صوت نجدي، وهذا مقصود — الوكيل اللي يرد على عملائك ما ينفع ينطلق من نموذج تسجيل بثلاث خانات. فريقنا يجهّز لك الحساب ويبني معك أول وكيل — القالب، وقاعدة المعرفة الأولى، وقواعد التصعيد — ويمشي معك في أول أسبوع. بعدها اللوحة بيدك: تعدّل، وتجرب، وتنشر متى ما تبي، بدون ما تحتاج تفتح تذكرة دعم عشان تغيّر جملة. وإذا احتجتنا في تعديل كبير — قالب جديد، أو توسعة لفرع ثاني — نرجع نشتغل معك، بس القرارات اليومية تبقى عندك أنت مو عندنا.",
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
        a: "ما تحتاج. كل الخطوات شاشات عربية: تختار القالب، وتحرّك تحكمات الشخصية، وتختار الصوت واللهجة، وتجرب، وتنشر. أصعب شي بتسويه هو إنك تقرأ وصف الشخصية وتعدّل جملة ما عجبتك. وأول وكيل نبنيه معك على أي حال، فما تبدأ لحالك.",
      },
      {
        q: "عندكم قالب لقطاعي؟",
        a: "عندنا قوالب مكتوبة فعلاً للفنادق والعيادات والمطاعم والعقار والتجزئة، وقالب عام لأي نشاط غيرها. والقالب يجي معه هيكل مبدئي لقاعدة المعرفة يوريك وش المعلومات اللي تحتاج تعبّيها.",
      },
      {
        q: "إذا عدّلت الوكيل، كيف أتأكد إني ما كسرت شيئاً شغالاً؟",
        a: "بسيناريوهات الاختبار المحفوظة: تحفظ الحالات المهمة عندك مرة وحدة — الإلغاء، والسؤال عن سعر ما هو مكتوب، والعميل المنزعج — وتعيد تشغيلها كلها بعد كل تعديل، وتشوف وش تغيّر في الردود قبل ما تنشر. وإذا ما عجبك اللي شفته، ما نشرت شي أصلاً.",
      },
      {
        q: "أقدر أرجع لنسخة قديمة بعد النشر؟",
        a: "تقدر. عندك مسودة ونسخة منشورة وسجل نسخ كامل، ومقارنة توريك وش تغيّر بالضبط بين نسخة ونسخة — والرجوع لنسخة سابقة ما يحتاج إعادة بناء ولا تدخل من فريقنا، ضغطة وحدة وترجع للي كان شغال.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Build your own agent — without a line of code",
    intro:
      "Most AI platforms hand you an empty box and tell you to “write the agent's instructions.” That is the worst possible place to start. The Saut Najdi agent builder starts from a template written for your sector and ends with a version you have tested yourself before publishing — and every step in between is a screen you can read without a developer.",
    cta: "Book a demo",
    answer: {
      heading: "How do I build a voice agent for my business without coding?",
      capsule:
        "Five steps in the dashboard: pick your sector template — hotel, clinic, restaurant, real estate, retail, or a generic one — set the agent's personality, voice and dialect, let the platform draft its persona in Najdi Arabic and edit that draft, test it in a test chat and in saved scenarios you replay after every change, then publish. Publishing isn't final: you always have a draft, a published version, and a version history that shows exactly what changed between them.",
    },
    stepsHeading: "The five steps",
    stepsLead: "One screen per step, and you can come back to any of them later without rebuilding the agent.",
    steps: [
      {
        title: "1 · Start from your sector's template, not a blank page",
        body:
          "We have templates genuinely authored for five sectors — hotels, clinics, restaurants, real estate and retail — plus a generic one for anything else. A template is more than a label: it brings the tone that suits the sector, the questions that sector actually gets, and a starter knowledge-base structure showing you which information to fill in — the price list for a restaurant, the doctors' schedule for a clinic, the cancellation policy for a hotel. You begin with an agent that roughly understands your business and spend your time adjusting details instead of inventing everything. Choosing the template provisions the agent for you with its baseline settings in place. And if your business has distinct sides to it — a clinic with both cosmetic and dental departments, a restaurant that does delivery and event halls — you can run more than one agent, each with its own template and knowledge base, instead of cramming everything into one agent that loses the thread.",
      },
      {
        title: "2 · Set its personality: tone, voice, and limits",
        body:
          "Personality here isn't a wall of text you write — it's a set of controls you move and immediately hear the effect of. You choose the level of formality: a clinic agent leans calm and respectful, a restaurant agent warm and quick. You choose reply length: concise to keep calls moving, or fuller for first-time callers. You choose the voice and dialect — Najdi, Hijazi or Khaleeji, male or female — and hear a sample before committing. You write the opening line it says at the start of a call, and can include a recording notice there if your policy requires one. And on top of all that you set the guardrails: the subjects it never discusses, and the topics it escalates to your employee immediately. Those limits matter more than people expect: a clinic bars its agent from anything diagnostic, an estate agency bars it from negotiating price, a restaurant bars it from promising an off-menu request. Whatever you set here you can hear in the test chat straight away, so you adjust by listening rather than guessing.",
      },
      {
        title: "3 · Don't know how to write AI instructions? Let it write them",
        body:
          "This is the step where most people stall. Our answer is that you describe your business in plain language — what you do, who your customers are, when you're busiest — and the platform drafts a full persona description in Najdi Arabic: how it greets, how it answers a pricing question, what it does when you're fully booked. The text appears in front of you, not inside a black box: you read it, edit any sentence you don't like, and regenerate if the style is off. You start from a credible draft instead of an empty page, and you still own every word. The draft comes out in natural Saudi dialect rather than translated Arabic, because that is what your customer will actually hear. One piece of advice from experience: don't try to write every eventuality. Write what makes your business distinctive — what you do better than the place down the road, the questions you get daily, and the things you never allow. The rest you build into the knowledge base and the escalation rules.",
      },
      {
        title: "4 · Test it before it ever reaches a customer",
        body:
          "Before publishing, you talk to your agent in a test chat inside the dashboard: ask what your customers ask, read the full replies, and confirm it is answering correctly from your knowledge base. More valuable than a single try: you can save test scenarios — a customer cancelling a booking, a customer asking about a price that isn't documented, an upset customer — and replay all of them in one go after any change, with the platform judging the replies and showing you what moved. So a small personality tweak can't quietly break something that used to work. It's how engineers test, delivered as an Arabic screen with no code. A separate panel tests the knowledge base on its own: type a question and see which passage came back and from which file, so you can tell whether a bad answer is a content problem or a personality problem. A small distinction that saves hours of guessing.",
      },
      {
        title: "5 · Publish — and roll back if you need to",
        body:
          "The agent always has two versions: a draft you edit freely, and a published version that answers your customers. You edit and test on the draft without touching what's live, and press publish when you're satisfied. That means you can try an idea — a shorter tone, a different opening line, a new guardrail — knowing no customer hears it until you approve it. Before publishing, the platform shows you a clear comparison between the two: which sentences changed, which settings moved, which guardrails were added or removed. The version history is kept, so if a change turns out badly two days later you return to an earlier version without rebuilding anything. Editing becomes a decision you can undo — which is what actually makes people willing to edit at all. Every publish is recorded with who did it and when, so when more than one person works on the agent, nobody has to ask who changed what.",
      },
    ],
    who: {
      heading: "Who on my team is allowed to edit the agent?",
      body:
        "You decide. Permissions are set per employee: one person can edit and publish, another can only edit the draft and wait for your approval, another can look without touching. Your organisation's data is isolated from every other organisation's at the database level, and sensitive actions are written to an append-only audit log that nobody can edit or delete. So you can give your team room to improve the agent without losing the ability to see who did what and when — which is the thing that decides whether a team actually uses the builder or freezes the agent in month one out of fear of breaking it.",
    },
    note: {
      heading: "And the first agent? You're not left to figure it out",
      body:
        "There is no self-signup at Saut Najdi, and that is deliberate — the agent that answers your customers shouldn't be launched from a three-field signup form. Our team sets up the account and builds the first agent with you — the template, the initial knowledge base, the escalation rules — and stays with you through the first week. After that the dashboard is yours: edit, test and publish whenever you want, without raising a support ticket to change a sentence. When you want us for something bigger — a new template, an expansion to another branch — we're back at the table, but the day-to-day decisions stay with you, not with us.",
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
        a: "No. Every step is a screen: pick the template, move the personality controls, choose the voice and dialect, test, publish. The hardest thing you'll do is read the persona description and reword a sentence you don't like. And the first agent is built with you by our team, so you never start alone.",
      },
      {
        q: "Do you have a template for my sector?",
        a: "We have templates genuinely written for hotels, clinics, restaurants, real estate and retail, plus a generic one for anything else. Each comes with a starter knowledge-base structure showing which information to fill in.",
      },
      {
        q: "If I edit the agent, how do I know I haven't broken something?",
        a: "Saved test scenarios. You capture the cases that matter to you once — a cancellation, a price that isn't documented, an upset customer — replay all of them after every change, and see what moved in the replies before you publish. If you don't like what you see, nothing has gone live.",
      },
      {
        q: "Can I go back to an older version after publishing?",
        a: "Yes. You have a draft, a published version, a full version history, and a comparison showing exactly what changed — and rolling back doesn't require rebuilding anything.",
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
