import type { Locale } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SampleConversation } from "@/components/SampleConversation";
import type { FaqItem } from "@/lib/schema";

/**
 * /product/human-handoff — the moat page (blueprint §6.2 ★). Told as a
 * scene, then the four pillars: escalation rules, live supervision,
 * inherited context, after-hours callbacks. Warm mid-call phone transfer
 * is deliberately NOT promised as GA (research §3.2) — everything on this
 * page is shipped.
 */

const t = {
  ar: {
    h1: "إذا احتاجت المكالمة إنسان… موظفك يستلمها وهو فاهم كل شي",
    intro:
      "كل منصات الرد الآلي تقول «نحوّل المكالمة للبشر». الفرق عندنا هو وش يستلم الموظف: مو مكالمة باردة يبدأها من الصفر — يستلم المحادثة كاملة، بنصها وملخصها وتاريخ صاحبها. هذي الصفحة تشرح لك بالضبط كيف.",
    cta: "احجز عرضاً",
    scene: {
      heading: "خلنا نبدأ بمشهد حقيقي",
      body: "عميل يتصل على عيادة، يحجز موعد أسنان مع الوكيل، وبعدها يسأل عن ألم بعد حشوة. هنا الوكيل ما يجتهد بجواب طبي — يحوّل فوراً. شوف وش يصير:",
    },
    pillars: {
      heading: "أربع ركائز — كلها شغالة اليوم",
      items: [
        {
          title: "1 · قواعد تصعيد واضحة — مو مزاج",
          body: "المكالمة تروح لموظفك بقواعد صريحة أنت تتحكم فيها: إذا طلب العميل إنسان، التحويل فوري — قانون ثابت ما يتفاوض فيه الوكيل. وإذا بان انزعاج العميل، أو تكرر سؤال ما انحل، أو صار الموضوع أعقد من صلاحيات الوكيل — يصعّد. النتيجة: العميل المحبط ما يعلق مع روبوت، والموضوع الحساس ما يجاوب عليه ذكاء اصطناعي.",
        },
        {
          title: "2 · فريقك يشوف المكالمات الحية — ويقدر يتدخل",
          body: "من لوحة التحكم، فريقك يتابع المكالمات لحظة بلحظة: يسمع مباشرة، يوجّه الوكيل بهمسة ما يسمعها العميل، أو يستلم المكالمة بنفسه بأي لحظة. المدير يقدر يوقف الوكيل ويكمل المكالمة بنفسه. هذي مو ميزة شائعة — أغلب المنصات ما تعطيك إياها أصلاً.",
        },
        {
          title: "3 · الموظف يستلم ومعه كل شي",
          body: "لحظة التصعيد، يوصل لموظفك: سبب التحويل، النص الكامل للمحادثة، ملخص عربي واضح — ليش اتصل العميل ووش صار — وتاريخ العميل معكم: مكالماته السابقة وحجوزاته وتفضيلاته. العميل ما يقول «قلت للي قبلك» أبداً.",
        },
        {
          title: "4 · وإذا ما في أحد؟ ما في طريق مسدود",
          body: "الوكيل يعرف أوقات دوامك. إذا اتصل العميل برا الدوام والموضوع يحتاج إنسان، ما يقول له «حاول بكرة» — يسجل طلب اتصال بتفاصيله ووقته المفضل، ويوعده إن أحد من فريقك يرجع له. الطلب يظهر لفريقك في اللوحة ثاني يوم.",
        },
      ],
    },
    after: {
      heading: "وبعد ما تخلص المكالمة؟",
      body: "كل تصعيد يتسجل: متى صار، وليش، ومين استلم. تقدر تراجع النصوص والتسجيلات، وتقيّم المكالمات، وتعدل قواعد التصعيد بناء على اللي تشوفه — عشان وكيلك يتحسن مع الوقت على شغلك أنت بالذات.",
    },
    faq: [
      {
        q: "مين يحدد قواعد التصعيد؟",
        a: "أنت. صوت نجدي يجي بقواعد افتراضية منطقية — طلب الإنسان تحويل فوري، والانزعاج يصعّد — وأنت تعدلها على نشاطك: وش يتحول، لمين، ومتى.",
      },
      {
        q: "وش يشوف موظفي لما يستلم المكالمة؟",
        a: "موظفك يشوف سبب التصعيد، والنص الكامل للمحادثة، وملخص عربي واضح، وتاريخ العميل معكم — كل هذا قدامه لحظة الاستلام، فما يحتاج يسأل العميل «ممكن تعيد؟».",
      },
      {
        q: "أقدر أراقب مكالمات الوكيل وأنا مرتاح؟",
        a: "تقدر — من لوحة صوت نجدي تتابع المكالمات الحية، تسمع أي مكالمة، توجّه الوكيل بهمسة، أو تستلم المكالمة بنفسك بضغطة وحدة.",
      },
      {
        q: "وإذا كان الاتصال برا الدوام؟",
        a: "الوكيل يعرف أوقات دوامك: يخدم العميل في اللي يقدر عليه، وإذا احتاج الموضوع إنسان يسجل طلب اتصال ويوعد العميل برجعة من فريقك — وما يضيع عليك ولا عميل.",
      },
    ] as FaqItem[],
    faqHeading: "أسئلة عن التصعيد",
  },
  en: {
    h1: "When a call needs a human… your employee takes it over already knowing everything",
    intro:
      "Every AI answering platform says it “transfers to humans.” The difference is what the human receives: not a cold call started from zero — they inherit the whole conversation, with its transcript, its summary, and the customer's history. This page shows you exactly how.",
    cta: "Book a demo",
    scene: {
      heading: "Let's start with a real scene",
      body: "A customer calls a clinic, books a dental appointment with the agent, then asks about pain after a filling. The agent doesn't improvise a medical answer — it hands over immediately. Watch what happens:",
    },
    pillars: {
      heading: "Four pillars — all working today",
      items: [
        {
          title: "1 · Explicit escalation rules — not vibes",
          body: "Calls reach your employee by rules you control: if the customer asks for a human, the transfer is immediate — an iron law the agent never negotiates. If the customer sounds upset, if a question keeps going unresolved, or if the matter is beyond what you've allowed the agent to handle — it escalates. The result: frustrated customers never get stuck with a robot, and sensitive topics are never answered by an AI.",
        },
        {
          title: "2 · Your team watches live calls — and can step in",
          body: "From the dashboard, your team follows calls as they happen: listen in live, coach the agent with a whisper the customer never hears, or take the call over at any moment. A manager can pause the AI and continue the call personally. Most platforms simply don't offer this.",
        },
        {
          title: "3 · The employee inherits everything",
          body: "At the moment of escalation, your employee receives: the reason for the handoff, the full conversation transcript, a clear Arabic summary — why the customer called and what has happened — and the customer's history with you: previous calls, bookings, preferences. The customer never says “I already told the last person.”",
        },
        {
          title: "4 · Nobody available? No dead ends",
          body: "The agent knows your working hours. If a customer calls while you're closed and the matter needs a human, it doesn't say “try tomorrow” — it logs a callback request with the details and the customer's preferred time, and promises someone from your team will call back. The request is waiting in your team's dashboard the next morning.",
        },
      ],
    },
    after: {
      heading: "And after the call ends?",
      body: "Every escalation is recorded: when it happened, why, and who took it. You can review transcripts and recordings, rate calls, and tune your escalation rules based on what you see — so your agent keeps improving on your business specifically.",
    },
    faq: [
      {
        q: "Who defines the escalation rules?",
        a: "You do. Saut Najdi ships with sensible defaults — a human request transfers immediately, frustration escalates — and you tune them to your business: what transfers, to whom, and when.",
      },
      {
        q: "What does my employee see when they take over?",
        a: "Your employee sees the escalation reason, the full conversation transcript, a clear summary, and the customer's history with you — all in front of them at the moment of takeover, so they never have to ask the customer to repeat anything.",
      },
      {
        q: "Can I monitor the agent's calls?",
        a: "Yes — from the Saut Najdi dashboard you can watch live calls, listen to any of them, coach the agent with a whisper, or take the call over yourself in one click.",
      },
      {
        q: "What about calls outside working hours?",
        a: "The agent knows your hours: it serves the customer where it can, and when the matter needs a human it logs a callback request and promises a follow-up from your team — no customer falls through the cracks.",
      },
    ] as FaqItem[],
    faqHeading: "Handoff questions",
  },
} as const;

export function HumanHandoffPage({ locale }: { locale: Locale }) {
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
        <Reveal className="text-center">
          <h2 className="text-h2">{s.scene.heading}</h2>
          <p className="mx-auto mt-3 max-w-2xl text-body-lg leading-relaxed text-ink/70">{s.scene.body}</p>
        </Reveal>
        <div className="mt-10">
          <SampleConversation locale={locale} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal>
            <h2 className="text-center text-h2">{s.pillars.heading}</h2>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {s.pillars.items.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <article className="card card-hover h-full border-s-4 border-s-brand-blue">
                  <h3 className="text-h4">{p.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{p.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-h3">{s.after.heading}</h2>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.after.body}</p>
        </Reveal>
        <div className="mx-auto mt-12 max-w-2xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const handoffFaq = { ar: t.ar.faq, en: t.en.faq };
