import Link from "next/link";
import { DemoLink } from "@/components/DemoLink";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SampleConversation } from "@/components/SampleConversation";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// Positional — keep each array the same length as the list it decorates or a
// card renders with an undefined icon name.
const handledIcons: IconName[] = ["calendar", "repeat", "cost", "clock", "clinic", "people"];
const kbIcons: IconName[] = ["clinic", "cost", "badge", "doc", "clock", "chat"];

/**
 * /solutions/clinics (blueprint §6.3 sector template). The clinic template
 * is genuinely shipped (research §3.1), so «قالب جاهز» is allowed here.
 *
 * Honesty guard specific to this page: the agent is a booking and enquiry
 * receptionist. Nothing on this page may imply medical advice, diagnosis,
 * interpreting a report, or handling clinical patient data — that boundary
 * is stated out loud in the escalation section, because saying it is a
 * stronger trust signal than staying quiet about it.
 *
 * Short-brief copy: one idea per block, outcome first, no mechanism essays —
 * the density of the hotels and retail pages.
 */

const t = {
  ar: {
    h1: "الرد الآلي على مكالمات العيادات — مواعيد محجوزة بدون موظف مشغول",
    intro:
      "موظف الاستقبال ما يقدر يستقبل المريض اللي قدامه ويرد على الجوال في نفس اللحظة. وكيلك يرد على كل مكالمة، ويحجز في تقويمك فعلاً، ويحوّل أي شي يحتاج إنسان.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "قالب جاهز للعيادات والمستشفيات",
      heading: "المكالمات اللي تفوتك كل يوم",
      body: "هذي شكل المكالمات اللي تجي أي عيادة. كم وحدة منها راحت عليك أمس؟",
      note: "حوارات توضيحية — مو تسجيلات حقيقية.",
      items: [
        {
          tag: "حجز موعد جديد",
          caller: "أبغى موعد مع الدكتور.",
          agent: "هلا وغلا. أسنان ولا جلدية؟ فاضي بكرة 4:30 العصر — أثبته لك؟",
        },
        {
          tag: "تأجيل موعد",
          caller: "عندي موعد الخميس وما أقدر أجي.",
          agent: "موعدك 10:15 مع الدكتورة سارة — أقرب بديل الأحد 11:00، يمشي؟",
        },
        {
          tag: "سعر الكشف والتأمين",
          caller: "كم الكشف عند الجلدية؟ وتقبلون تأميني؟",
          agent: "الكشف 250 ريال، وتأمينك مقبول — جيب البطاقة والهوية.",
        },
        {
          tag: "الدوام والموقع",
          caller: "دوامكم لين كم؟ ووينكم؟",
          agent: "لين 10 بالليل، في فرع الملقا — أرسل لك الموقع؟",
        },
        {
          tag: "سؤال عن طبيب بالاسم",
          caller: "الدكتورة سارة تداوم الأحد؟",
          agent: "الأحد والثلاثاء من 4 لين 9. أحجز لك عندها؟",
        },
        {
          tag: "تأكيد موعد ورقم الحجز",
          caller: "حجزت أمس ونسيت الوقت.",
          agent: "موعدك اليوم 6:45 مع الدكتور خالد، ورقمك: 4 — 8 — 2 — 1.",
        },
      ],
    },
    why: {
      heading: "ليش المكالمة الفايتة في العيادة أغلى؟",
      paras: [
        "خسارتين مع بعض: فتحة فاضية في جدول طبيب محسوب بالساعة، ومريض راح لعيادة ثانية وما يرجع.",
        "وأزحم ساعاتك هي اللي ما يقدر فريقك يرد فيها. وبرا الدوام تصير الخسارة عدم حضور: المريض يبي يلغي وما يلقى أحد يرد، فالفتحة تقعد فاضية.",
      ],
    },
    handled: {
      eyebrow: "مربوط بالحوارات اللي فوق",
      heading: "وش يتكفل فيه الوكيل بالضبط؟",
      capsule: "ينهي المكالمة بنفسه — ما يسجل رسالة ويوعد إن أحد يرجع للمريض.",
      items: [
        {
          title: "يحجز الموعد فعلاً — مو يسجل طلب",
          body:
            "يشوف تقويمك وهو على الخط ويثبت الموعد قبل ما تسكر المكالمة، ويظهر لفريقك في نفس اللحظة.",
        },
        {
          title: "تأجيل وإلغاء بسياسة عيادتك",
          body: "يلقى موعد المريض من رقمه، ويأجله أو يلغيه بسياستك. والفتحة الملغاة ترجع متاحة.",
        },
        {
          title: "الأسعار والتأمين",
          body: "أسعار الكشف والمتابعة والتأمينات المقبولة زي ما كتبتها. والموافقات المسبقة تروح لموظفك.",
        },
        {
          title: "الدوام والفروع والوصول",
          body: "دوام كل فرع، والإجازات، ودوام رمضان، وأقرب علامة للفرع.",
        },
        {
          title: "جدول الأطباء",
          body: "مين يداوم أي يوم وفي أي فرع. وإذا كان الطبيب محجوز لأسبوعين يعرض زميله.",
        },
        {
          title: "المريض الراجع… يعرفه",
          body: "يحييه باسمه ويعرف آخر موعد له — ونفس المعلومات قدام موظفك لحظة التحويل.",
        },
      ],
    },
    voice: {
      heading: "مكالمة العيادة كلها أسماء وأرقام",
      paras: [
        "اسم طبيبة، وتاريخ، ورقم حجز. والمريض يقول «أربعة ونص» ويغيّر رأيه بنص الجملة — الوكيل يسمع ويعدّل ويقرأ الرقم رقم رقم.",
        "والأصوات اليوم: نجدي، حجازي، شامي، وإنجليزي — رجالي ونسائي. وصوت علامتك تضيفه باستنساخ صوت شخص بموافقته، حسب باقتك.",
      ],
      linkLead: "التفاصيل كاملة في ",
      linkText: "صفحة وكيل الصوت",
    },
    human: {
      heading: "وش يروح لموظفك؟",
      capsule: "الوكيل يشتغل في اللوجستيات. وأي شي يخص صحة المريض يروح لموظفك على طول.",
      honesty:
        "الوكيل ما يعطي استشارة طبية، ولا يشخّص، ولا يفسر تقرير. قاعدة مقصودة، مو نقص نعتذر عنه.",
      honestyMore:
        "وحتى لو جا السؤال مغلّف — «أحجز جلدية ولا باطنية؟» — يحوّله بدل ما يختار عن المريض.",
      items: [
        "أي سؤال طبي — أعراض، دواء، ألم بعد إجراء، تفسير نتيجة — تحويل فوري.",
        "نبرة الانزعاج: يلتقطها في صوت المتصل ويصعّد بدل ما يكمل نصه.",
        "طلب المريض إنسان — قانون ثابت ما يتفاوض فيه.",
        "الحالات المستعجلة — ما يتصرف فيها أبداً ولا يقدم نفسه بديلاً عن الطوارئ.",
      ],
      inheritLead: "وموظفك يستلم سبب التصعيد ونص المكالمة وملخصاً عربياً وتاريخ المريض — ",
      inheritLink: "اقرأ كيف يشتغل التصعيد",
      afterHours:
        "وبرا الدوام يحجز موعد بكرة، أو يسجل طلب اتصال يرد عليه فريقك أول الدوام.",
      sceneHeading: "شكل التصعيد وهو يصير",
      sceneBody: "مريض يحجز موعد أسنان، ثم يسأل عن ألم بعد حشوة. هنا ينتهي شغل الوكيل:",
    },
    kb: {
      heading: "وش يدخل في قاعدة معرفة عيادتك؟",
      intro: "الوكيل ما يعرف عن عيادتك إلا اللي تعطيه إياه — وهذي ميزة تقفل باب الاجتهاد:",
      items: [
        { title: "جدول الأطباء", body: "مين يداوم أي يوم، وتخصصه وفرعه." },
        { title: "قائمة الأسعار", body: "الكشف والمتابعة والإجراءات، والفرق بين أول زيارة ومراجعة." },
        { title: "شركات التأمين", body: "المقبول والمرفوض، ووش يحتاج موافقة مسبقة." },
        { title: "سياسة الإلغاء والتأخير", body: "كم ساعة قبل، ووش يصير لو تأخر أو ما حضر." },
        { title: "الدوام والفروع", body: "دوام كل فرع، ورمضان والإجازات، والعناوين والمواقف." },
        { title: "الأسئلة اللي تتكرر", body: "«فيه قسم نسائي؟» «أجي مباشرة ولا أحجز؟» «تستقبلون أطفال؟»" },
      ],
      mechanics:
        "وأصعب ملف هو اللي ما يثبت: الجدول يتعدّل كل أسبوع. ترفعه زي ما هو وتعدّله في مكان واحد.",
      testing: "وقبل النشر تجربه في المحادثة التجريبية وتشوف من وين جاب الجواب.",
      channelsHeading: "ومو بس المكالمات",
      channels:
        "واتساب وتيليجرام ودردشة موقعك في نفس الصندوق وبنفس قاعدة المعرفة — تاريخ المريض في مكان واحد.",
      kbLinkLead: "طريقة بنائها وتحديثها في ",
      kbLinkText: "صفحة قاعدة المعرفة",
      securityLead: "ووين تنحفظ بيانات مرضاك وتُعالَج — ",
      securityLink: "اقرأ صفحة الأمان والبيانات",
    },
    setup: {
      heading: "كيف نجهز عيادتك؟",
      paras: [
        "نبدأ من قالب العيادات ونعبيه بمعلوماتك: الجدول والأسعار والتأمين وسياسة الإلغاء. بعدها نضبط قواعد التصعيد، وتسمع صوت الوكيل قبل ما يرد على أي مريض.",
        "وما فيه تسجيل ذاتي — فريقنا يضبط معك الجدول وحدود السؤال الطبي، ونتفق معك على المدة في العرض التعريفي.",
      ],
      linkLead: "وتعدّل عليه بنفسك بعدين — ",
      linkText: "صفحة بناء الوكيل",
    },
    faqHeading: "أسئلة أصحاب العيادات",
    faq: [
      {
        q: "الوكيل يحجز فعلاً ولا بس يسجل الطلب؟",
        a: "يحجز فعلاً في تقويمك وهو على الخط، ويقرأ رقم الحجز رقم رقم — ويظهر لفريقك في نفس اللحظة.",
      },
      {
        q: "وش يسوي إذا سأل المريض سؤال طبي؟",
        a: "يحوّل على طول — ما يعطي استشارة ولا يشخّص ولا يفسر تقرير. وموظفك يستلم ومعه النص والملخص.",
      },
      {
        q: "عندنا فروع وأطباء كثير — يفرق؟",
        a: "ما يفرق. جدول الأطباء وفروعهم في إعداد وكيلك، ويحجز في تقويم الفرع الصح.",
      },
      {
        q: "وين تنحفظ بيانات مرضانا؟",
        a: "التخزين الدائم في منطقة الخليج (الدوحة)، والتسجيلات تنحذف بعد 90 يوماً، وكل اطلاع يتسجل في سجل تدقيق. والمعالجة في صفحة الأمان.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "AI call answering for clinics — appointments booked while your front desk is busy",
    intro:
      "Your receptionist cannot look after the patient in front of them and answer a phone that never stops. The agent takes those calls, books the slot in your clinic's calendar, and hands anything that needs a person to your staff.",
    cta: "Book a demo",
    calls: {
      eyebrow: "A ready-made clinic and hospital template",
      heading: "The calls you're missing every day",
      body: "This is what calls to a Saudi clinic sound like. How many went unanswered yesterday?",
      note: "Illustrative dialogues — not real recordings.",
      items: [
        {
          tag: "A new appointment",
          caller: "I'd like an appointment with the doctor.",
          agent: "Of course — dental or dermatology? Tomorrow at 4:30 PM is free, shall I confirm it?",
        },
        {
          tag: "Rescheduling",
          caller: "I have an appointment Thursday and I can't make it.",
          agent: "That's Thursday 10:15 with Dr. Sarah — her nearest alternative is Sunday at 11:00. Does that work?",
        },
        {
          tag: "Fees and insurance",
          caller: "How much is a dermatology consultation, and do you take my insurer?",
          agent: "It's SAR 250, and your insurer is accepted — bring your card and ID.",
        },
        {
          tag: "Hours and location",
          caller: "How late are you open, and where are you?",
          agent: "Until 10 PM, at the Malqa branch — shall I send you the location?",
        },
        {
          tag: "Asking for a doctor by name",
          caller: "Is Dr. Sarah in on Sunday?",
          agent: "Sundays and Tuesdays, 4 PM to 9. Shall I book you with her?",
        },
        {
          tag: "Confirming a booking",
          caller: "I booked yesterday but forgot the time.",
          agent: "Today at 6:45 with Dr. Khalid, reference 4 — 8 — 2 — 1.",
        },
      ],
    },
    why: {
      heading: "Why a missed call costs a clinic more",
      paras: [
        "It is two losses at once: an empty slot in the diary of a doctor costed by the hour, and a patient who rang whoever was next in the search results.",
        "Your busiest hours are the ones nobody can pick up. And after hours the loss becomes a no-show: a patient wants to cancel at nine, finds nobody, and the slot sits empty.",
      ],
    },
    handled: {
      eyebrow: "Mapped to the dialogues above",
      heading: "What the agent handles, precisely",
      capsule: "It finishes the call itself — it doesn't log a message and promise a call back.",
      items: [
        {
          title: "It books — it doesn't take a request",
          body:
            "It checks your calendar on the line and confirms the slot before the call ends. The appointment appears in your team's calendar in the same moment.",
        },
        {
          title: "Reschedules and cancellations, on your policy",
          body: "It finds the booking from the number the patient is calling from, moves or cancels it, and puts the slot straight back into availability.",
        },
        {
          title: "Fees and insurance",
          body: "Consultation and follow-up fees and the insurers you accept, exactly as written. Pre-approvals go to your staff.",
        },
        {
          title: "Hours, branches and getting there",
          body: "Each branch's hours, public holidays, the Ramadan schedule, and the nearest landmark.",
        },
        {
          title: "The doctors' rota",
          body: "Who works which days and at which branch. If a doctor is booked out for a fortnight it offers a colleague.",
        },
        {
          title: "It recognises returning patients",
          body: "It greets them by name and knows their last appointment — the same details your employee sees at handover.",
        },
      ],
    },
    voice: {
      heading: "A clinic call is names and numbers",
      paras: [
        "A doctor's name, a date, a reference. The patient says “half four”, then changes their mind mid-sentence — the agent listens, amends, and reads the reference back digit by digit.",
        "The voices available today are Najdi, Hijazi, Levantine and English, male and female. You can add your own brand voice by cloning a named person with their consent, depending on your plan.",
      ],
      linkLead: "The full detail is on the ",
      linkText: "voice agent page",
    },
    human: {
      heading: "What goes to your staff",
      capsule: "The agent handles logistics. Anything touching the patient's health goes to your staff immediately.",
      honesty:
        "The agent gives no medical advice, makes no diagnosis, and interprets no report. A deliberate rule, not a limitation we're apologising for.",
      honestyMore:
        "Even wrapped in an administrative question — “dermatology or internal medicine?” — it transfers rather than choose for the patient.",
      items: [
        "Any medical question — symptoms, medication, pain after a procedure, a result to interpret — transfers immediately.",
        "Audible frustration: the agent hears it in the caller's voice and escalates rather than pushing on.",
        "An explicit request for a human — an iron law it never negotiates.",
        "Urgent situations — never improvised around, and never presented as a substitute for emergency care.",
      ],
      inheritLead: "Your employee inherits the escalation reason, the transcript, an Arabic summary and the patient's history — ",
      inheritLink: "read how the handoff works",
      afterHours:
        "After hours it still books tomorrow's slot, or logs a callback for your team to return when they open.",
      sceneHeading: "What an escalation looks like",
      sceneBody: "A patient books a dental appointment, then asks about pain after a filling. That is where the agent's job ends:",
    },
    kb: {
      heading: "What goes into your clinic's knowledge base",
      intro: "The agent knows nothing about your clinic beyond what you give it — a feature, not a gap, because it closes the door on improvisation:",
      items: [
        { title: "The doctors' rota", body: "Who works which days, their specialty and their branch." },
        { title: "The price list", body: "Consultation, follow-up and procedure fees, and first visit versus review." },
        { title: "Insurers", body: "Which are accepted, and what needs pre-approval." },
        { title: "Cancellation and lateness policy", body: "How much notice is required, and how you treat a late arrival or a no-show." },
        { title: "Hours and branches", body: "Each branch's hours, holidays and Ramadan, addresses and parking." },
        { title: "The questions asked every day", body: "“Is there a women's section?” “Can I walk in?” “Do you see children?”" },
      ],
      mechanics:
        "The hardest document in a clinic is the one that never sits still: the rota is redrawn weekly. Upload it as it is and edit it in one place.",
      testing: "Before publishing you check it yourself in the test chat and see where each answer came from.",
      channelsHeading: "And not only calls",
      channels:
        "WhatsApp Business, Telegram and your website chat land in the same inbox and answer from the same knowledge base — the patient's history in one place.",
      kbLinkLead: "How it is built and kept current is on the ",
      kbLinkText: "knowledge base page",
      securityLead: "Exactly where your patients' data is stored and processed — ",
      securityLink: "read the security and data page",
    },
    setup: {
      heading: "How we set your clinic up",
      paras: [
        "We start from the ready-made clinic template and fill it with your information: the rota, fees, insurers, the cancellation policy. Then we set your escalation rules, and you hear the agent before any patient does.",
        "There is no self-signup: our team settles the rota and the medical boundary with you, and we agree the timeline with you in the demo.",
      ],
      linkLead: "You change it yourself afterwards — ",
      linkText: "the agent builder page",
    },
    faqHeading: "Questions clinic owners ask",
    faq: [
      {
        q: "Does the agent actually book, or just take a request?",
        a: "It actually books, checking your calendar on the line and reading the reference back digit by digit — and it appears in your team's calendar in the same moment.",
      },
      {
        q: "What happens if a patient asks a medical question?",
        a: "It transfers immediately — no advice, no diagnosis, no interpreting a report. Your employee takes over with the transcript and the summary.",
      },
      {
        q: "We have several branches and doctors — is that a problem?",
        a: "No. The rota and branches are configured into your agent, and it books into the right branch's calendar.",
      },
      {
        q: "Where is our patients' data stored?",
        a: "Permanent storage is in the Gulf region (Doha), recordings are deleted after 90 days, and every access is written to an audit log. Processing is set out on the security page.",
      },
    ] as FaqItem[],
  },
} as const;

type Dialogue = { tag: string; caller: string; agent: string };

/**
 * The mini-dialogue card. Same bubble language as SampleConversation but
 * static and server-rendered: six of these animating in sequence would read
 * as noise, and the copy is the point.
 */
function DialogueCard({ d, locale }: { d: Dialogue; locale: Locale }) {
  return (
    <article className="card card-hover h-full">
      <p className="eyebrow">{d.tag}</p>
      <div className="mt-4 space-y-2">
        <div className="flex justify-start">
          <p className="max-w-[92%] rounded-2xl rounded-es-md border border-line bg-canvas px-4 py-2.5 text-body leading-relaxed text-ink">
            {d.caller}
          </p>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[92%] rounded-2xl rounded-ee-md bg-ink px-4 py-2.5 text-body leading-relaxed text-canvas">
            <span className="mb-1 block text-body-sm font-medium text-canvas/60">
              {locale === "ar" ? "وكيل صوت نجدي" : "Saut Najdi agent"}
            </span>
            {d.agent}
          </div>
        </div>
      </div>
    </article>
  );
}

export function ClinicsPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <h1 className="mx-auto max-w-3xl text-h2 sm:text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/75">{s.intro}</p>
          <div className="mt-7">
            <DemoLink locale={locale}>{s.cta}</DemoLink>
          </div>
        </div>
      </section>

      <TrustStrip locale={locale} />

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.calls.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.calls.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.calls.body}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {s.calls.items.map((d, i) => (
            <Reveal key={d.tag} delay={i * 0.05}>
              <DialogueCard d={d} locale={locale} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-body-sm text-ink/60">{s.calls.note}</p>
      </section>

      <section className="bg-surface py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-h2">{s.why.heading}</h2>
            {s.why.paras.map((p) => (
              <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.handled.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.handled.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.handled.capsule}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {s.handled.items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="card card-hover group h-full border-s-4 border-s-brand-blue">
                <IconChip name={handledIcons[i]} delay={i * 0.08} />
                <h3 className="mt-3 text-h4">{p.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-h2">{s.voice.heading}</h2>
            {s.voice.paras.map((p) => (
              <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
            ))}
            {/* The dialect/voice mechanics live on /product/voice-agent — this
                page only carries the clinic-specific half. */}
            <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
              {s.voice.linkLead}
              <Link
                href={localePath(locale, "product/voice-agent")}
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                {s.voice.linkText}
              </Link>
              {"."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.human.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.capsule}</p>
        </Reveal>
        {/* The medical boundary is stated out loud — a clinic buyer is asking
            it silently anyway, and saying it first is the trust signal. */}
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="rounded-2xl border-s-4 border-s-brand-purple bg-surface p-5 text-body-lg leading-relaxed text-ink/80 shadow-card">
            {s.human.honesty}
          </p>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.honestyMore}</p>
        </Reveal>
        {/* One Reveal around the whole list — a <li> may not be wrapped in the
            <div> that Reveal renders. */}
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <ul className="space-y-3">
            {s.human.items.map((x) => (
              <li
                key={x}
                className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4 text-body-lg leading-relaxed text-ink/80 shadow-card"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden />
                {x}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="text-body-lg leading-relaxed text-ink/75">
            {s.human.inheritLead}
            <Link
              href={localePath(locale, "product/human-handoff")}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.human.inheritLink}
            </Link>
            {"."}
          </p>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.afterHours}</p>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-2xl text-center">
          <h3 className="text-h3">{s.human.sceneHeading}</h3>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">{s.human.sceneBody}</p>
        </Reveal>
        <div className="mt-8">
          <SampleConversation locale={locale} />
        </div>
      </section>

      <section className="bg-surface py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-h2">{s.kb.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.kb.intro}</p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.kb.items.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.05}>
                <article className="card group h-full">
                  <IconChip name={kbIcons[i]} delay={i * 0.08} />
                  <h3 className="mt-3 text-h5">{k.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-ink/75">{k.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 max-w-3xl">
            <p className="text-body-lg leading-relaxed text-ink/75">{s.kb.mechanics}</p>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.kb.testing}</p>
          </Reveal>
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <h3 className="text-h4">{s.kb.channelsHeading}</h3>
            <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.kb.channels}</p>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
              {s.kb.kbLinkLead}
              <Link
                href={localePath(locale, "product/knowledge-base")}
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                {s.kb.kbLinkText}
              </Link>
              {"."}
            </p>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
              {s.kb.securityLead}
              <Link href={localePath(locale, "security")} className="text-brand-blue underline-offset-4 hover:underline">
                {s.kb.securityLink}
              </Link>
              {"."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-h2">{s.setup.heading}</h2>
          {s.setup.paras.map((p) => (
            <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
          ))}
          <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
            {s.setup.linkLead}
            <Link
              href={localePath(locale, "product/agent-builder")}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.setup.linkText}
            </Link>
            {"."}
          </p>
        </Reveal>
        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const clinicsFaq = { ar: t.ar.faq, en: t.en.faq };
