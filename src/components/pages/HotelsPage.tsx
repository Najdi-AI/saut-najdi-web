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

/**
 * /solutions/hotels — sector page (blueprint §6.3, spec P2-22 row 5).
 * Hero → the calls you miss, as mini-dialogues → what the agent handles →
 * what goes to a human → what goes in the knowledge base → sector FAQ →
 * demo CTA. Short-brief copy: one idea per block, outcome first, no
 * mechanism essays. The hotel template is genuinely shipped (research §3.1).
 * No payment capture is claimed, no numbers about us, no customer names.
 *
 * Voice catalog is Najdi / Hijazi / Levantine / English — there is no
 * Khaleeji voice, so it is never listed. Brand-voice cloning is plan
 * dependent and is mentioned unquantified.
 *
 * The dialogues are rendered locally rather than through SampleConversation:
 * that module plays one fixed clinic script and exposes no `script` prop,
 * and it is not this page's file to change.
 */

// Positional — keep each array the same length as the section it feeds.
const handleIcons: IconName[] = ["phone", "calendar", "doc", "wave", "clock", "people"];
const kbIcons: IconName[] = ["hotel", "cost", "repeat", "clock", "check", "globe"];
const afterIcons: IconName[] = ["chart", "calendar", "people"];

type Dialogue = { tag: string; caller: string; agent: string; note: string };

const t = {
  ar: {
    h1: "عندكم غرفة فاضية؟ — استقبال يرد 24 ساعة",
    intro:
      "السؤال هذا يجيك عشرات المرات في اليوم، وأكثره وقت ما أحد فاضي عند الاستقبال. وكيلك يرد على كل مكالمة، يشوف المتاح ويثبت الحجز، ويجاوب من معلومات فندقك.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "المكالمات اللي تفوتك",
      heading: "وش المكالمات اللي تفوتك وأنت مشغول؟",
      body: "نفس الست مكالمات تتكرر في كل فندق كل يوم، وكل وحدة تفوتك حجز راح لغيرك.",
      note: "حوارات توضيحية — مو تسجيلات حقيقية.",
      items: [
        {
          tag: "توفر غرفة الليلة",
          caller: "عندكم غرفة فاضية الليلة لشخصين؟",
          agent: "إي، غرفة مزدوجة متاحة والفطور داخل فيها. أثبتها باسمك؟",
          note: "يتأكد من المتاح ويثبت الحجز داخل المكالمة نفسها.",
        },
        {
          tag: "أنواع الغرف والأسعار",
          caller: "وش الفرق بين الجناح والغرفة العائلية؟",
          agent: "الجناح فيه صالة منفصلة وغرفة نوم، والعائلية غرفة وحدة بسريرين. أعطيك سعر الليلتين؟",
          note: "مكتوبة عندك مرة وحدة، وكل نزيل يسمع نفس الجواب.",
        },
        {
          tag: "تعديل أو إلغاء",
          caller: "حجزي الخميس وأبي أأجله للجمعة.",
          agent: "الجمعة متاحة. أحوّل حجزك وأعطيك رقم جديد — والإلغاء مجاني قبل 24 ساعة من الوصول.",
          note: "أكثر مكالمة تاكل وقت الاستقبال، ويخلصها الوكيل ويسجلها في التقويم.",
        },
        {
          tag: "وصول متأخر",
          caller: "بوصل الساعة 2 بالليل، يمديني أسجل دخول؟",
          agent: "إي، الاستقبال 24 ساعة. وتسجيل الخروج 12 الظهر — أسجل ملاحظة وصول متأخر؟",
          note: "إذا ما أحد رد الساعة 11 بالليل، النزيل يحجز عند غيرك.",
        },
        {
          tag: "المرافق والموقع",
          caller: "فيه مواقف؟ والفطور داخل بالسعر؟",
          agent: "مواقف مجانية تحت المبنى، والفطور داخل في الغرف العائلية. أعطيك أقرب علامة توصلك؟",
          note: "معلومات ثابتة تكتبها مرة، وما يعطي نزيلين جوابين مختلفين.",
        },
        {
          tag: "شكوى نزيل",
          caller: "غرفتي ما انظفت من أمس، أبي المسؤول.",
          agent: "أعتذر منك. أحوّلك الحين لمسؤول النزلاء — ومعه رقم غرفتك وكل اللي قلته.",
          note: "طلب الإنسان تحويل فوري، وموظفك يستلم وهو قاري القصة.",
        },
      ] as Dialogue[],
    },
    handles: {
      eyebrow: "وش يتكفل فيه الوكيل",
      heading: "وش يتكفل فيه الوكيل بنفسه؟",
      capsule:
        "يرد من أول رنة، يثبت الحجوزات، يجاوب من معلومات فندقك، ويحوّل لموظفك أي شي يحتاج إنسان.",
      items: [
        {
          title: "يرد على كل مكالمة، 24 ساعة",
          body: "ما في بريد صوتي ولا نزيل يعلق على الخط — حتى وقت الذروة وبعد منتصف الليل.",
        },
        {
          title: "يشوف المتاح ويثبت الحجز",
          body: "يثبت الحجز باسم النزيل ويقرأ رقمه رقم رقم. والحجز يظهر في تقويمك مع نص المكالمة.",
        },
        {
          title: "يرد بمعلوماتك أنت",
          body: "الغرف والأسعار والسياسات والمرافق من قاعدة معرفتك. وإذا ما عنده جواب معتمد يقول ما عنده، ويسجل طلب اتصال.",
        },
        {
          title: "بلهجة نزيلك — عربي أو إنجليزي",
          body: "نجدي، حجازي، شامي، وإنجليزي للنزيل الأجنبي، وينتقل حسب اللي يسمعه. وتختار الصوت رجل أو امرأة — أو صوت علامتك أنت، حسب باقتك.",
        },
        {
          title: "برا الدوام؟ ما في طريق مسدود",
          body: "يسجل طلب اتصال بوقت النزيل المفضل، ويكون قدام فريقك أول ما يفتحون اللوحة.",
        },
        {
          title: "يعرف النزيل اللي رجع لك",
          body: "يحييه باسمه ويتذكر تفضيلاته: دور عالي، بعيد عن المصعد، وصول متأخر.",
        },
      ],
    },
    human: {
      eyebrow: "وش يروح لموظفك",
      heading: "وش يروح لموظفك؟",
      capsule:
        "أربع حالات تروح لموظفك على طول، والقواعد تحددها أنت من اللوحة.",
      items: [
        {
          title: "طلب الإنسان — تحويل فوري",
          body: "«أبي أكلم أحد» ما فيها نقاش. يحوّل على طول — قانون ثابت في المنصة كلها.",
        },
        {
          title: "شكوى نزيل داخل الفندق",
          body: "غرفة ما انظفت، تكييف واقف، ضجة. يعتذر، ياخذ رقم الغرفة، ويحوّل بالنص كامل.",
        },
        {
          title: "مبالغ واسترجاع وفواتير",
          body: "أي كلام عن مبلغ أو استرجاع يروح لموظفك. والوكيل ما ياخذ بيانات بطاقة ولا يستوفي مبلغ في المكالمة.",
        },
        {
          title: "مجموعات وفعاليات واستثناءات",
          body: "عشرين غرفة لشركة، قاعة مناسبة، أو استثناء من سياسة الإلغاء — ياخذ الأساسيات ويوصلها لفريقك.",
        },
      ],
      outroLead: "وموظفك يستلم ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ النزيل — ",
      outroLink: "اقرأ تفاصيل التصعيد",
      outroPath: "product/human-handoff",
      outroTail: " وفريقك يقدر يتابع المكالمة وهي شغالة ويستلمها بضغطة.",
    },
    kb: {
      eyebrow: "قاعدة المعرفة",
      heading: "وش تحط في قاعدة معرفة فندقك؟",
      body: "هي اللي تفرق بين وكيل عام ووكيل يعرف فندقك. ترفع ملفاتك أو تكتبها أسئلة وأجوبة، وتجربها في المحادثة التجريبية قبل النشر:",
      items: [
        {
          title: "أنواع الغرف والأسرّة",
          body: "كم شخص تشيل، الأسرّة، المساحة، وش فيها، والفرق عن الفئة اللي فوقها.",
        },
        {
          title: "الأسعار والعروض",
          body: "الأسعار حسب الفئة والموسم، والباقات، ووش داخل في السعر ووش خارج عنه.",
        },
        {
          title: "سياسة الإلغاء والتعديل",
          body: "متى الإلغاء مجاني، وسياسة عدم الحضور، والحجز غير القابل للاسترجاع. اكتبها بدقة.",
        },
        {
          title: "الدخول والخروج",
          body: "الأوقات الرسمية، الوصول المتأخر، الخروج المتأخر ورسومه، وحفظ الشنط.",
        },
        {
          title: "المرافق والخدمات",
          body: "الفطور وأوقاته، المسبح وأوقات الرجال والنساء، المواقف، الواي فاي، وسياسة الأطفال.",
        },
        {
          title: "الموقع والاتجاهات",
          body: "العنوان، المسافة من المطار، أقرب علامة يعرفها الناس، والتوصيل إذا فيه.",
        },
      ],
      outro:
        "أي سؤال تكرر عليك ثلاث مرات هالأسبوع مكانه هنا. ابدأ بالغرف والأسعار وسياسة الإلغاء، وزد من سجل مكالماتك.",
    },
    after: {
      eyebrow: "بعد المكالمة",
      heading: "وبعد ما تسكر المكالمة؟",
      body: "كل مكالمة تنحفظ عندك: التسجيل، والنص، وملخص عربي. واللوحة تعطيك أرقام مكالماتك — العدد، ونصيب الوكيل منها، ومعدل المدة — مع تصدير CSV أو PDF.",
      items: [
        {
          title: "سجل مكالمات كامل",
          body: "تسمع أي مكالمة، وتشوف وين قرر الوكيل يحوّل، وتعدل صياغته.",
        },
        {
          title: "تقويم الحجوزات",
          body: "حجوزات الوكيل تنزل في نفس تقويم فريقك باسم النزيل وتواريخه — صورة وحدة لاستقبالك.",
        },
        {
          title: "ملف كل نزيل",
          body: "مكالماته وحجوزاته وتفضيلاته في مكان واحد. ما يعيد قصته كل مرة.",
        },
      ],
    },
    template: {
      heading: "تبدأ من صفر؟ لا — قالب الفنادق جاهز",
      body: "شخصية وكيل لاستقبال فندقي، وسيناريوهات التوفر والحجز والتعديل، وقواعد تصعيد جاهزة، وهيكل قاعدة معرفة تعبيه بمعلومات فندقك.",
      body2:
        "وعندك أكثر من فرع؟ وكيل لكل فرع بقاعدة معرفته وأسعاره، وصلاحيات فريقك تتقسم على الفروع.",
      linkLead: "ومين يجهزه معك وكيف تعدّل عليه بدون كود — كل هذا ",
      linkText: "مشروح في صفحة بناء الوكيل",
      linkPath: "product/agent-builder",
    },
    faqHeading: "أسئلة أصحاب الفنادق",
    faq: [
      {
        q: "الوكيل يحجز الغرفة داخل المكالمة؟",
        a: "إي. يتأكد من المتاح، يثبت الحجز باسم النزيل، ويقرأ رقمه رقم رقم — ويظهر في تقويم لوحتك مع نص المكالمة.",
      },
      {
        q: "وش يصير إذا اتصل نزيل يتكلم إنجليزي؟",
        a: "يرد عليه بالإنجليزية. الوكيل يشتغل بالعربية — نجدي وحجازي وشامي — وبالإنجليزية، وينتقل حسب لغة المتصل.",
      },
      {
        q: "يقدر ياخذ بيانات البطاقة أو يستوفي مبلغ الحجز؟",
        a: "لا. أي شي يخص الدفع أو الاسترجاع يتحول لموظفك، وبرا الدوام يتسجل طلب اتصال.",
      },
      {
        q: "وش تحتاجون منا عشان نبدأ؟",
        a: "معلومات فندقك: الغرف والأسعار وسياسة الإلغاء وأوقات الدخول والخروج. وفريقنا يجهز الوكيل معك — ما في تسجيل ذاتي.",
      },
      {
        q: "وين تنحفظ تسجيلات مكالمات نزلائنا؟",
        a: "التخزين الدائم في منطقة الخليج (الدوحة) على Google Cloud، والتسجيلات تنحذف بعد 90 يوماً. والمعالجة اللحظية للصوت تمر عبر مزودين عالميين — مفصّلة في صفحة الأمان.",
      },
      {
        q: "إذا انزعج النزيل، وش يسوي الوكيل؟",
        a: "يعتذر ويحوّل على طول لموظفك ومعه النص والملخص وتاريخ النزيل. وطلب الإنسان تحويل فوري.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "“Do you have a room tonight?” — a front desk that answers 24/7",
    intro:
      "That question arrives dozens of times a day, mostly when nobody at the desk is free. The Saut Najdi agent answers every call, checks availability and confirms the booking, and answers from your own hotel information — passing anything that needs a person to your team with the full context.",
    cta: "Book a demo",
    calls: {
      eyebrow: "The calls you're missing",
      heading: "Which calls are you missing while the desk is busy?",
      body: "The same six calls repeat in every hotel, every day. Each one you don't answer is a booking that went elsewhere.",
      note: "Illustrative dialogue — not a real recording.",
      items: [
        {
          tag: "A room tonight",
          caller: "Do you have a room free tonight for two?",
          agent: "Yes — a double is available, breakfast included. Shall I hold it in your name?",
          note: "Availability checked and the booking confirmed inside the call itself.",
        },
        {
          tag: "Room types and rates",
          caller: "What's the difference between the suite and the family room?",
          agent: "The suite has a separate living room; the family room is one room with two large beds. Shall I quote you two nights?",
          note: "Differences and rates are written once, so every guest hears the same answer.",
        },
        {
          tag: "Changing or cancelling",
          caller: "My booking is Thursday — can I move it to Friday?",
          agent: "Friday is available. I'll move it and give you a new reference — cancellation is free up to 24 hours before arrival.",
          note: "The call that eats the most desk time, completed and logged in your calendar.",
        },
        {
          tag: "Late arrival",
          caller: "I land at 2 in the morning — can I still check in?",
          agent: "Yes, reception is staffed 24 hours. Check-out is 12 noon — shall I add a late-arrival note?",
          note: "If nobody answers at 11 at night, that guest books somewhere else.",
        },
        {
          tag: "Facilities and location",
          caller: "Is there parking? And is breakfast included?",
          agent: "Free parking under the building, and breakfast is included in the family rate. Shall I give you the nearest landmark?",
          note: "Fixed facts written once — never two guests, two different answers.",
        },
        {
          tag: "A guest complaint",
          caller: "My room wasn't cleaned yesterday. I want the manager.",
          agent: "I'm sorry about that. I'm putting you through to guest relations now — with your room number and everything you've told me.",
          note: "A request for a human is transferred immediately, with the story attached.",
        },
      ] as Dialogue[],
    },
    handles: {
      eyebrow: "What the agent handles",
      heading: "What does the agent handle on its own?",
      capsule:
        "It answers on the first ring, confirms bookings, replies from your hotel's own information, and hands your team anything that needs a person.",
      items: [
        {
          title: "Every call answered, around the clock",
          body: "No voicemail and no hold queue — including peak check-in hours and after midnight.",
        },
        {
          title: "Checks availability, confirms the booking",
          body: "Books in the guest's name and reads the reference back digit by digit. It lands in your calendar with the transcript.",
        },
        {
          title: "It answers with your information",
          body: "Rooms, rates, policies and facilities come from your knowledge base. With no approved answer, it says so and logs a callback.",
        },
        {
          title: "In your guest's language",
          body: "Najdi, Hijazi and Levantine Arabic plus English, switching by what it hears. Choose a male or female voice — or your own brand voice, depending on your plan.",
        },
        {
          title: "Closed? Still no dead end",
          body: "It logs a callback with the details and the guest's preferred time, waiting in your dashboard when the team opens it.",
        },
        {
          title: "It recognises returning guests",
          body: "Greets them by name and remembers preferences: high floor, away from the lift, late arrival.",
        },
      ],
    },
    human: {
      eyebrow: "What goes to a human",
      heading: "What goes to your employee?",
      capsule:
        "Four situations transfer straight away: a request for a person, a complaint, money and refunds, and group bookings. You set the rules from the dashboard.",
      items: [
        {
          title: "A request for a human — immediate",
          body: "“Put me through to someone” is never argued with. It transfers at once — an iron law across the platform.",
        },
        {
          title: "A complaint from a guest in-house",
          body: "Housekeeping, air conditioning, noise next door. It apologises, captures the room number, and transfers with the full transcript.",
        },
        {
          title: "Money, refunds and billing",
          body: "Anything about an amount or a refund goes to your employee. The agent never takes card details or collects payment on a call.",
        },
        {
          title: "Groups, events and exceptions",
          body: "Twenty rooms for a company, a hall, a waiver of the cancellation policy — negotiation, not enquiry. It captures the essentials and passes them on.",
        },
      ],
      outroLead: "Your employee inherits the escalation reason, the full transcript, an Arabic summary and the guest's history — ",
      outroLink: "read how escalation works",
      outroPath: "product/human-handoff",
      outroTail: " Your team can also follow a live call, listen in, and take it over in one click.",
    },
    kb: {
      eyebrow: "Your knowledge base",
      heading: "What belongs in your hotel's knowledge base?",
      body: "It is the difference between a generic agent and one that knows your hotel. Upload files or write question-and-answer pairs, and check every answer in the test chat before publishing. These matter most:",
      items: [
        {
          title: "Room types and beds",
          body: "How many it sleeps, the beds, the size, what's in it, and how it differs from the tier above.",
        },
        {
          title: "Rates and offers",
          body: "Rates by category and season, the packages, and what the price includes and excludes.",
        },
        {
          title: "Cancellation and changes",
          body: "When cancellation is free, the no-show policy, and non-refundable terms. Write this one precisely.",
        },
        {
          title: "Check-in and check-out",
          body: "Official times, late arrival, late check-out and any fee, and luggage storage.",
        },
        {
          title: "Facilities and services",
          body: "Breakfast hours, pool and gym with men's and women's hours, parking, Wi-Fi, and the children and extra-bed policy.",
        },
        {
          title: "Location and directions",
          body: "The address, distance from the airport, the landmark people actually know, and any airport transfer.",
        },
      ],
      outro:
        "Any question you've answered three times this week belongs here. Start with rooms, rates and cancellation, then add weekly from your call log.",
    },
    after: {
      eyebrow: "After the call",
      heading: "And once the call ends?",
      body: "Every call is kept in your dashboard with its recording, transcript and Arabic summary. The dashboard also shows your own numbers — call volume, the share the agent handled end to end, average duration — with CSV and PDF export.",
      items: [
        {
          title: "A complete call log",
          body: "Listen to any call, see where the agent chose to hand over, and adjust its wording.",
        },
        {
          title: "The reservations calendar",
          body: "Agent bookings land in the same calendar as your team's, with guest name and dates — one picture for the desk.",
        },
        {
          title: "A profile for every guest",
          body: "Calls, bookings and preferences in one place. Nobody retells their story.",
        },
      ],
    },
    template: {
      heading: "Starting from nothing? No — the hotel template is ready",
      body: "An agent persona built for hotel reception, scenarios for availability, booking, changes and late arrivals, ready escalation rules, and a knowledge-base skeleton you fill with your own information.",
      body2:
        "More than one property? Each branch gets its own agent, its own knowledge base and rates, with team permissions split across branches.",
      linkLead: "Who builds it with you, and how you edit it without code, ",
      linkText: "is on the agent builder page",
      linkPath: "product/agent-builder",
    },
    faqHeading: "Questions from hotel operators",
    faq: [
      {
        q: "Does the agent actually book the room during the call?",
        a: "Yes. It checks availability, confirms in the guest's name, and reads the reference back digit by digit — and the booking appears in your calendar with the transcript.",
      },
      {
        q: "What happens when an English-speaking guest calls?",
        a: "It answers in English. The agent works in Arabic — Najdi, Hijazi and Levantine — and in English, switching to the caller's language.",
      },
      {
        q: "Can it take card details or collect a deposit?",
        a: "No. Anything to do with payment or refunds is transferred to your employee, or logged as a callback when you're closed.",
      },
      {
        q: "What do you need from us to start?",
        a: "Your room types, rates, cancellation policy, check-in and check-out times, and facilities. Our team builds the agent with you — there's no self-signup.",
      },
      {
        q: "Where are recordings of our guests' calls stored?",
        a: "Permanent storage is in the Gulf region (Doha) on Google Cloud, and recordings are deleted automatically after 90 days. Realtime speech processing transits global providers — detailed on our security page.",
      },
      {
        q: "What does the agent do with an upset guest?",
        a: "It apologises and transfers immediately, carrying the transcript, the summary and the guest's history. A request for a human is never negotiated.",
      },
    ] as FaqItem[],
  },
} as const;

/** One mini-dialogue card — the SampleConversation bubble language, static. */
function DialogueCard({ item, delay }: { item: Dialogue; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="card h-full">
        <p className="eyebrow">{item.tag}</p>
        <div className="mt-4 space-y-3">
          <div className="flex justify-start">
            <p className="max-w-[90%] rounded-2xl rounded-es-md bg-canvas px-4 py-3 text-body-lg leading-relaxed text-ink">
              {item.caller}
            </p>
          </div>
          <div className="flex justify-end">
            <p className="max-w-[90%] rounded-2xl rounded-ee-md bg-ink px-4 py-3 text-body-lg leading-relaxed text-white">
              {item.agent}
            </p>
          </div>
        </div>
        <p className="mt-4 text-body leading-relaxed text-ink/65">{item.note}</p>
      </article>
    </Reveal>
  );
}

export function HotelsPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <span className="mx-auto mb-4 flex justify-center">
            <IconChip name="hotel" />
          </span>
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
          <p className="eyebrow">{s.calls.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.calls.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.calls.body}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {s.calls.items.map((item, i) => (
            <DialogueCard key={item.tag} item={item} delay={(i % 2) * 0.08} />
          ))}
        </div>
        <p className="mt-6 text-center text-body-sm text-ink/60">{s.calls.note}</p>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{s.handles.eyebrow}</p>
            <h2 className="mt-2 text-h2">{s.handles.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.handles.capsule}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.handles.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <article className="card card-hover group h-full">
                  <IconChip name={handleIcons[i]} delay={i * 0.1} />
                  <h3 className="mt-3 text-h4">{item.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.human.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.human.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.capsule}</p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {s.human.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 2) * 0.08}>
              <article className="card h-full border-s-4 border-s-brand-blue">
                <h3 className="text-h4">{item.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-body-lg leading-relaxed text-ink/70">
            {s.human.outroLead}
            <Link
              href={localePath(locale, s.human.outroPath)}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.human.outroLink}
            </Link>
            {"."}
            {s.human.outroTail}
          </p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{s.kb.eyebrow}</p>
            <h2 className="mt-2 text-h2">{s.kb.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.kb.body}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.kb.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 3) * 0.08}>
                <article className="card card-hover group h-full">
                  <IconChip name={kbIcons[i]} delay={i * 0.1} />
                  <h3 className="mt-3 text-h4">{item.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-body-lg leading-relaxed text-ink/70">{s.kb.outro}</p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.after.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.after.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.after.body}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {s.after.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.08}>
              <article className="card card-hover group h-full">
                <IconChip name={afterIcons[i]} delay={i * 0.1} />
                <h3 className="mt-3 text-h4">{item.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-h3">{s.template.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.template.body}</p>
            <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.template.body2}</p>
            <p className="mt-3 text-body-lg leading-relaxed text-ink/70">
              {s.template.linkLead}
              <Link
                href={localePath(locale, s.template.linkPath)}
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                {s.template.linkText}
              </Link>
              {"."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const hotelsFaq = { ar: t.ar.faq, en: t.en.faq };
