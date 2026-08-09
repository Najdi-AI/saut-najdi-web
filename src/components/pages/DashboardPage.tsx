import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// Positional — keep the same length as `sections`.
const sectionIcons: IconName[] = ["doc", "chart", "people", "calendar", "lock", "globe"];

/**
 * /product/dashboard (spec P2-22 row 8). Traces to research §3.1
 * "Dashboard": call log with transcripts/recordings/summaries/sentiment,
 * star ratings + tags, customer CRM timeline, reservations calendar, roles
 * and permissions, and the DB-enforced append-only audit log. The live
 * supervisor surface (listen / whisper / take over) is deliberately NOT
 * given a section or an FAQ here — /product/human-handoff owns that query
 * and this page carries a single pointer sentence instead. Analytics
 * deep-dive, reports and billing screens are deliberately NOT named —
 * their production flags are unverified (§3.2).
 */

const t = {
  ar: {
    h1: "كل مكالمة قدامك: مين اتصل، وش قال، ووش صار",
    intro:
      "أكبر مشكلة في الرد على المكالمات مو الرد نفسه — المشكلة إنك ما تعرف وش صار فيها. مين اتصل أمس؟ وش وعدناه؟ ليش زعل؟ في أغلب المنشآت الجواب موجود في راس موظف، أو ضايع في تسجيل محد سمعه. لوحة صوت نجدي تخلي كل مكالمة قابلة للفتح والقراءة والسماع والقياس، بالعربي، من أول رنة.",
    cta: "احجز عرضاً",
    answer: {
      heading: "وش أشوف في لوحة التحكم بعد كل مكالمة؟",
      capsule:
        "بعد ما تسكر المكالمة بثواني، تلقى في سجل المكالمات: التسجيل الصوتي، والنص الكامل مكتوباً، وملخصاً عربياً يقول لك ليش اتصل العميل ووش صار ووش باقي، ومؤشراً على مزاج المكالمة، مع إمكانية تقييمها بالنجوم ووسمها بوسم تلقى فيه مكالماتك بعدين. وكل هذا مربوط بملف العميل نفسه، فتشوف تاريخه معك كامل بضغطة وحدة. وفوق هذا، الحجوزات تظهر في تقويم، والصلاحيات تحدد مين يشوف وش، وكل اطلاع حساس يُكتب في سجل ما يتعدل.",
    },
    sections: [
      {
        title: "وش يطلع لي في سجل المكالمات بالضبط؟",
        body:
          "كل مكالمة تصير سطراً تقدر تفتحه. جواه: التسجيل الصوتي تشغّله من مكانك، والنص الكامل للمحادثة مكتوباً — كلام العميل وكلام الوكيل بالترتيب — وملخص عربي مكتوب بلغة واضحة يختصر لك المكالمة في ثوانٍ: ليش اتصل، وش انطلب، وش تم، ووش باقي على أحد. ومعه مؤشر مزاج المكالمة، عشان تعرف من نظرة إذا كان العميل مرتاحاً أو منزعجاً بدون ما تسمع خمس دقائق. وتقدر تقيّم المكالمة بالنجوم، وتحط عليها وسوماً — «شكوى»، «سؤال سعر»، «حجز ملغى» — والوسوم تصير طريقتك في تجميع الأنماط: وش أكثر شي يسألون عنه عملاؤك؟ وين وكيلك يحتاج معرفة أكثر؟ والنص مو بس للقراءة: تقدر تدور فيه، فلو اتصل عميل وقال «قلت لكم قبل شهر»، تلقى المكالمة نفسها وتقرأ اللي انقال بالحرف بدل الجدال. والمكالمة اللي راحت لموظف بشري تبين لك ليش راحت ومين استلمها ووش صار بعدها، فتعرف إن كان التصعيد في محله ولا تحتاج تعدّل قواعدك. التسجيلات نفسها ما تُفتح إلا عبر روابط موقّعة قصيرة الصلاحية، وتُحذف تلقائياً بعد 90 يوماً.",
      },
      {
        title: "كيف أعرف وش صار اليوم بدون ما أقرأ كل مكالمة؟",
        body:
          "أول شاشة تفتحها تعطيك الصورة الكاملة بدون قراءة: المكالمات الجارية الحين، ومؤشرات نشاطك لليوم — كم مكالمة دخلت، كم حجز انعمل، كم مكالمة راحت لموظف بشري، وكم طلب اتصال مسجّل ينتظر أحد يرجع له. هذي أرقامك أنت، محسوبة من مكالماتك، مو أرقام نشرناها عن أدائنا. وتحتها الوسوم والتقييمات: لما تعوّد فريقك يوسم المكالمات، تصير تشوف الأنماط بسرعة — «سؤال سعر» يتكرر يعني أسعارك مو واضحة لعملائك، و«شكوى توصيل» يتكرر يعني عندك مشكلة تشغيلية مو مشكلة رد. وتقدر تخلي المتصفح ينبهك بإشعار لما يصير شي يحتاج انتباهك بدل ما تفتح اللوحة كل شوي، وفيه لوحة أوامر سريعة تفتحها من الكيبورد وتوصل لأي شاشة أو أي مكالمة بالكتابة. والمقصود من هالشاشة مو إنك تراقب أرقاماً طول اليوم — المقصود إنك تعرف في دقيقة وحدة إذا كان فيه شي يحتاج تدخلك اليوم ولا لا، وترجع لشغلك.",
      },
      {
        title: "أعرف تاريخ العميل اللي يتصل الحين؟",
        body:
          "تعرفه. كل رقم يتصل يصير له ملف عميل، والملف يجمع تاريخه معك كخط زمني مرتب: مكالماته السابقة بملخصاتها، وحجوزاته، وتقييماته، والوسوم اللي انحطت عليه. يعني لما يتصل عميل مكرر، موظفك ما يبدأ من الصفر ولا يسأله «كنت متصل قبل؟». والوكيل نفسه يستفيد من نفس الذاكرة: ينادي العميل المتكرر باسمه ويتذكر تفضيلاته. وإذا كان عندك قاعدة عملاء من قبل، تقدر ترفعها من ملف CSV، والنظام يدمج المكرر بدل ما يصير عندك نفس العميل مرتين — مع تتبع حالة الموافقة لكل عميل. والفايدة الحقيقية تبين في الحالات المزعجة: عميل يشتكي إن أحد وعده بخصم، أو عميل يقول إنه اتصل ثلاث مرات ومحد رد عليه — تفتح ملفه وتشوف مكالماته وتواريخها وملخصاتها، وتحكم على أساس معلومة مو على أساس ذاكرة أحد. وهذا الملف يظهر لموظفك لحظة ما يستلم مكالمة مصعّدة، فيبدأ الكلام وهو فاهم.",
      },
      {
        title: "وين ألقى الحجوزات اللي سواها الوكيل؟",
        body:
          "في تقويم الحجوزات داخل نفس اللوحة. كل حجز يسويه الوكيل أثناء المكالمة يظهر في التقويم فوراً بتفاصيله: العميل، والوقت، والخدمة، والمكالمة اللي جاء منها — تقدر ترجع للمكالمة نفسها وتسمعها من الحجز. ومن مدير الأوقات المتاحة تضبط وش هي المواعيد اللي يقدر الوكيل يحجزها: أيامك، وفتراتك، والمواعيد المقفلة، وسعة كل فترة. يعني الوكيل ما يحجز موعداً ما تقدر تخدمه، والتقويم يبقى مصدراً واحداً لك ولفريقك بدل دفتر على الاستقبال وواتساب المدير. وأي تعديل على حجز — تأجيل، أو إلغاء، أو تغيير عدد الأشخاص — يتسجل مع وقته ومصدره، فتعرف إن كان الوكيل هو اللي عدّله في مكالمة ولا موظفك عدّله من اللوحة.",
      },
      {
        title: "مين يشوف وش؟ وكيف أعرف مين فتح وش ومتى؟",
        body:
          "لكل موظف في حسابك دور وصلاحيات محددة — تحدد مين يسمع التسجيلات، ومين يعدّل الوكيل، ومين يشوف بيانات العملاء. وبيانات منشأتك معزولة عزلاً تاماً عن أي منشأة ثانية، والعزل مفروض على مستوى قاعدة البيانات نفسها مو على مستوى الواجهة. وفوق هذا، كل إجراء حساس يُكتب في سجل تدقيق ملحق فقط تفرضه قاعدة البيانات: ما يقدر أحد يعدّل سطراً فيه أو يحذفه — ولا حتى مسؤول النظام. وأي اطلاع من فريق الدعم عندنا على مكالمة يُسجَّل فيه تلقائياً. والتصدير نفسه — لما تسحب بياناتك ملفاً — يترك سطره في السجل. هذي هي الإجابة الحقيقية على «مين شاف بيانات عملائي»: مو وعد، سجل. وإذا كنت تبي تسحب بياناتك برا المنصة، تقدر تصدّرها ملفات CSV أو PDF — وحتى التصدير نفسه يترك أثره في السجل، عشان يبقى عندك دفتر واحد تقدر تراجعه إذا سألك مسؤول الامتثال عندك.",
      },
      {
        title: "واللوحة نفسها — تنفع لفريق يشتغل بالعربي؟",
        body:
          "اللوحة عربية من أساسها، مو ترجمة متأخرة لواجهة إنجليزية: الاتجاه من اليمين لليسار صح في كل شاشة، والخط عربي مصمم للقراءة الطويلة، والمصطلحات مكتوبة بلغة يفهمها موظف الاستقبال مو مهندس. والأرقام تظهر بالأرقام اللاتينية زي ما تكتبها فواتيرك. وإذا عندك في الفريق أحد يفضّل الإنجليزي، يبدّل اللغة من حسابه هو بدون ما يغيّر شي على البقية. وإذا عندك أكثر من فرع، كل فرع يشتغل بوكيله وقاعدة معرفته وحجوزاته، وأنت تشوفهم كلهم من مكان واحد. الهدف بسيط: موظفك يفتح اللوحة الصبح ويعرف وش يسوي بدون تدريب طويل ولا دليل استخدام. وأول أسبوع نمشي معك خطوة خطوة: نضبط الأدوار، ونوريك كيف تقرأ الملخصات، وكيف تستلم مكالمة حية، وكيف تحوّل اللي تشوفه في المكالمات إلى تحسين في وكيلك.",
      },
    ],
    // Live listen / whisper / take-over belongs to /product/human-handoff —
    // one pointer sentence inside the call-log card, no section, no FAQ.
    handoff: {
      lead: "وأثناء المكالمة نفسها يقدر فريقك يسمعها، ويهمس للوكيل، ويستلمها بنفسه — والتفاصيل كاملة في ",
      text: "صفحة التصعيد للموظف البشري",
      path: "product/human-handoff",
    },
    faqHeading: "أسئلة عن لوحة التحكم",
    faq: [
      {
        q: "الملخص والنص بالعربي ولا بالإنجليزي؟",
        a: "النص يطلع بلغة المكالمة، والملخص يُكتب بالعربي بلغة واضحة يفهمها أي موظف عندك بدون شرح. وواجهة اللوحة نفسها عربية بالكامل من اليمين لليسار، مع إمكانية التبديل للإنجليزي لأي عضو في فريقك يفضّله بدون ما يتغير شي على الباقين.",
      },
      {
        q: "كم تبقى تسجيلات المكالمات محفوظة؟",
        a: "90 يوماً، وبعدها تُحذف تلقائياً — وهذا سلوك مقصود يطبّق مبدأ حدود الاحتفاظ في نظام حماية البيانات الشخصية. وأي تشغيل لتسجيل يتم عبر رابط موقّع قصير الصلاحية.",
      },
      {
        q: "أقدر أطلع بياناتي من المنصة؟",
        a: "تقدر تصدّر بياناتك ملفات CSV أو PDF من اللوحة، وكل عملية تصدير تُسجَّل في سجل التدقيق باسم اللي سواها ووقتها. بياناتك بياناتك — ما نحتجزها عندنا ولا نخليك تتفاوض عشان تطلعها.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Every call in front of you: who called, what they said, what happened",
    intro:
      "The hard part of phone coverage was never answering — it's knowing what happened afterwards. Who called yesterday? What did we promise them? Why were they upset? In most businesses the answer lives in one employee's head, or in a recording nobody ever played. The Saut Najdi dashboard makes every call openable, readable, listenable and measurable, in Arabic, from the first ring.",
    cta: "Book a demo",
    answer: {
      heading: "What do I see in the dashboard after each call?",
      capsule:
        "Seconds after a call ends, the call log holds the recording, the full written transcript, an Arabic summary telling you why the customer called, what happened and what's still open, and a read on the caller's mood — plus star ratings and tags so you can find the call again later. All of it is attached to the customer's own record, so their whole history with you is one click away. Beyond that: bookings land in a calendar, permissions decide who sees what, and every sensitive view is written to a log nobody can edit.",
    },
    sections: [
      {
        title: "What exactly is in the call log?",
        body:
          "Every call becomes a row you can open. Inside: the recording, playable in place; the full transcript of the conversation — caller and agent, in order; and a clearly written Arabic summary that compresses the call into seconds of reading: why they called, what was asked, what was done, and what is still owed to someone. Alongside it sits a sentiment read, so you can tell at a glance whether the caller left satisfied or annoyed without listening to five minutes of audio. You can rate calls with stars and attach tags — complaint, pricing question, cancelled booking — and those tags become how you see patterns: what customers ask most, and where your agent's knowledge is thin. The transcript isn't only for reading, either: it's searchable, so when a customer says “I told you this a month ago,” you can find that call and read what was actually said instead of arguing about it. A call that went to a human shows why it escalated, who took it, and what happened next — so you can tell whether the rule fired correctly or needs tuning. Recordings themselves open only through short-lived signed links, and are deleted automatically after 90 days.",
      },
      {
        title: "How do I know what happened today without reading every call?",
        body:
          "The first screen gives you the picture without reading anything: calls in progress right now, and the day's activity — how many calls came in, how many bookings were made, how many went to a human, and how many callback requests are still waiting for someone. Those are your numbers, computed from your calls, not numbers we publish about ourselves. Below them sit tags and ratings: once your team is in the habit of tagging, patterns surface fast — repeated pricing questions mean your prices aren't clear to customers, while repeated delivery complaints mean you have an operational problem, not an answering problem. You can let the browser notify you when something needs attention instead of refreshing all day, and a keyboard command palette jumps you to any screen or call by typing. The point of this screen isn't to watch numbers all day — it's to know within a minute whether anything needs you today, and then get back to your actual job.",
      },
      {
        title: "Do I get the history of the customer calling right now?",
        body:
          "You do. Every number that calls gets a customer record, and that record collects their history with you as an ordered timeline: previous calls with their summaries, bookings, ratings, and the tags applied along the way. So when a repeat customer calls, your employee doesn't start from zero or ask whether they've called before. The agent draws on the same memory: it greets regulars by name and remembers their preferences. If you already have a customer base, you can import it from CSV — the system merges duplicates rather than leaving you with the same person twice, and tracks consent status per contact. The value shows up in the awkward moments: a customer insists someone promised them a discount, or says they called three times and nobody answered. You open their record, read the calls and their dates, and decide on the basis of a record rather than someone's memory. That same record is in front of your employee the instant they take over an escalated call.",
      },
      {
        title: "Where do the bookings the agent made show up?",
        body:
          "In the reservations calendar inside the same dashboard. Every booking the agent makes during a call appears immediately with its detail: customer, time, service, and the call it came from — so you can jump from a booking straight to the recording. The availability manager is where you set what the agent is allowed to book: your days, your shifts, blocked dates, and the capacity of each slot. The agent never books something you can't serve, and the calendar stays a single source of truth for you and your team instead of a notebook at reception plus the manager's WhatsApp. Any change to a booking — moved, cancelled, party size adjusted — is recorded with its time and its source, so you know whether the agent changed it during a call or a colleague changed it from the dashboard.",
      },
      {
        title: "Who can see what — and how do I know who opened what?",
        body:
          "Every employee in your account has a defined role and permissions: who can play recordings, who can edit the agent, who can see customer data. Your organisation's data is fully isolated from every other organisation's, and that isolation is enforced at the database level, not in the interface. On top of that, every sensitive action is written to an append-only audit log enforced by the database itself: no row can be edited or deleted — not even by an administrator. Any view of a call by our support staff is automatically written to it. So is an export, the moment you pull your data out as a file. That is the real answer to “who has seen my customers' data”: not a promise, a log. And if you want your data out of the platform, you can export it as CSV or PDF — with the export itself leaving a row in the log, so there is one ledger to review when your compliance officer asks.",
      },
      {
        title: "And the dashboard itself — does it work for an Arabic-speaking team?",
        body:
          "It's Arabic-first, not an English interface translated late: right-to-left is correct on every screen, the typeface is an Arabic face built for sustained reading, and the terminology is written for a receptionist rather than an engineer. Numerals appear in Latin digits, the way your invoices already write them. Anyone on the team who prefers English switches the language on their own account without changing anything for the others. And if you run more than one branch, each branch works with its own agent, knowledge base and bookings, while you see all of them from one place. The goal is simple: your employee opens the dashboard in the morning and knows what to do, without a training course or a manual. We walk your team through the first week ourselves: setting the roles, reading the summaries, taking over a live call, and turning what you see in calls into improvements to the agent.",
      },
    ],
    handoff: {
      lead: "And while a call is still running, your team can listen in, whisper to the agent, or take it over — the full detail is on ",
      text: "the human handoff page",
      path: "product/human-handoff",
    },
    faqHeading: "Dashboard questions",
    faq: [
      {
        q: "Are transcripts and summaries in Arabic or English?",
        a: "The transcript follows the language of the call, and the summary is written in clear Arabic. The dashboard interface itself is Arabic-first, with an English switch for team members who prefer it.",
      },
      {
        q: "How long are call recordings kept?",
        a: "90 days, then they are deleted automatically — a deliberate behaviour implementing the PDPL's retention-limit principle. Any playback happens through a short-lived signed link.",
      },
      {
        q: "Can I get my data out of the platform?",
        a: "You can export to CSV or PDF from the dashboard, and every export is written to the audit log. Your data is yours — we don't hold it hostage.",
      },
    ] as FaqItem[],
  },
} as const;

export function DashboardPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <h1 className="mx-auto max-w-3xl text-h2 sm:text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/75">{s.intro}</p>
          <div className="mt-7">
            <CalButton calLink={CAL_LINK_DEMO} locale={locale}>{s.cta}</CalButton>
          </div>
        </div>
      </section>

      <TrustStrip locale={locale} />

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.answer.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.answer.capsule}</p>
        </Reveal>
      </section>

      <section className="container pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          {s.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={i * 0.06}>
              <article className="card card-hover group h-full border-s-4 border-s-brand-blue">
                <IconChip name={sectionIcons[i]} delay={i * 0.1} />
                <h2 className="mt-3 text-h4">{sec.title}</h2>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{sec.body}</p>
                {/* Single pointer to the escalation page — the live-supervisor
                    query is owned by /product/human-handoff, not this page. */}
                {i === 0 && (
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">
                    {s.handoff.lead}
                    <Link
                      href={localePath(locale, s.handoff.path)}
                      className="text-brand-blue underline-offset-4 hover:underline"
                    >
                      {s.handoff.text}
                    </Link>
                    {"."}
                  </p>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mx-auto mt-14 max-w-2xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const dashboardFaq = { ar: t.ar.faq, en: t.en.faq };
