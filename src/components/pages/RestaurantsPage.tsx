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

// Positional — keep each array the same length as the list it decorates or a
// card renders with an undefined icon name.
const handledIcons: IconName[] = ["calendar", "repeat", "restaurant", "phone", "clock", "people"];
const kbIcons: IconName[] = ["restaurant", "doc", "people", "clock", "globe", "calendar"];

/**
 * /solutions/restaurants (blueprint §6.3 sector template). The restaurant
 * template is genuinely shipped (research §3.1), so «قالب جاهز» is allowed.
 *
 * Two honesty guards on this page: the agent records order and enquiry
 * details — it does not take payment and is not plugged into delivery apps
 * (said out loud in the FAQ); and the peak-hour claim is capability only,
 * never a number, because no concurrency figure has been published.
 *
 * Short-brief copy: one idea per block, outcome first, no mechanism essays —
 * the density of the hotels and retail pages.
 */

const t = {
  ar: {
    h1: "مطعمك يرد على كل مكالمة — حتى وقت الذروة",
    intro:
      "زبونك يتصل الساعة ثمان ونص والصالة مليانة وما أحد فاضي يرد — والمكالمة الفايتة تروح للمطعم اللي بعدك. وكيلك يرد بلهجة زبونك، ويحجز الطاولة فعلاً، ويحوّل الشكاوى لموظفك.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "قالب جاهز للمطاعم والكافيهات",
      heading: "المكالمات اللي تفوتك وقت الذروة",
      body: "هذي شكل المكالمات اللي تجي أي مطعم بين السابعة والعاشرة. كم وحدة راحت عليك أمس؟",
      note: "حوارات توضيحية — مو تسجيلات حقيقية.",
      items: [
        {
          tag: "حجز طاولة",
          caller: "مساء الخير، عندكم طاولة لأربعة الليلة؟",
          agent: "مساء النور! عندنا فاضي 8:30 و 9:15 — وش يناسبك؟",
        },
        {
          tag: "تعديل حجز",
          caller: "حاجز الساعة 9 لأربعة، بس صرنا ستة.",
          agent: "عدّلتها لستة ونقلتك لقسم العوائل بنفس الوقت. نفس الرقم: 7 — 3 — 5 — 2.",
        },
        {
          tag: "القائمة والحساسية",
          caller: "عندكم أطباق بدون لحم؟ وأخوي عنده حساسية من المكسرات.",
          agent: "عندنا أطباق نباتية أقولك إياها. والحساسية أسجلها وأحوّلك لموظف يأكد من المطبخ.",
        },
        {
          tag: "الدوام والموقع والمواقف",
          caller: "لين كم مفتوحين اليوم؟ وفيه مواقف؟",
          agent: "لين 1 بعد منتصف الليل، والمواقف خلف المبنى — أرسل لك الموقع؟",
        },
        {
          tag: "مناسبة أو مجموعة كبيرة",
          caller: "أبغى أحجز لعشرين شخص الخميس، عندكم قسم مغلق؟",
          agent: "عندنا قسم يستوعب العدد. أسجل التفاصيل وأحوّلك لمسؤول المناسبات.",
        },
        {
          tag: "شكوى — تصعيد فوري",
          caller: "طلبت أمس توصيل ووصل ناقص صنف.",
          agent: "أعتذر منك. أحوّلك لمسؤول الفرع على طول ومعه تفاصيل طلبك.",
          human: "معك فهد مدير الفرع — قدامي طلبك والصنف الناقص، خلني أعوضك.",
        },
      ],
    },
    why: {
      heading: "ليش الذروة بالذات هي المشكلة؟",
      paras: [
        "المشكلة مو في عدد المكالمات، في توقيتها: كلها تجي في نفس الساعتين، والصالة مليانة، واللي المفروض يرد واقف على الباب.",
        "والزبون اللي ما لقى رد ما يعيد — يفتح الخريطة ويتصل على اللي بعدك. وغلط صغير يكلفك طاولة كاملة: يحجز لأربعة ويجي ستة.",
      ],
    },
    handled: {
      eyebrow: "مربوط بالحوارات اللي فوق",
      heading: "وش ينهيه الوكيل بنفسه على الخط؟",
      capsule:
        "ينهي المكالمة بنفسه: يثبت الحجز، ويعدّله أو يلغيه، ويجاوب من قائمتك ودوامك — ما ياخذ اسم ويقول «بنكلمك»، لأن الزبون اللي ينتظر رد يحجز عند غيرك.",
      items: [
        {
          title: "يحجز الطاولة فعلاً — مو ياخذ اسم ورقم",
          body:
            "يشوف تقويم حجوزاتك وهو على الخط — العدد والوقت والقسم — ويثبت الحجز ويظهر لفريقك في نفس اللحظة.",
        },
        {
          title: "تعديل وإلغاء بدون مكالمة ثانية",
          body:
            "يلقى حجز الزبون من رقمه، يزيد العدد أو يقدم الوقت أو يلغي بسياستك. والطاولة الملغاة ترجع متاحة.",
        },
        {
          title: "القائمة والأسعار",
          body: "«عندكم نباتي؟» «كم المندي؟» — يجاوب من قائمتك، ما يخترع صنف. والحساسية يسجلها ويحوّل لموظفك.",
        },
        {
          title: "الذروة: ما فيه خط مشغول",
          body: "يرد على أكثر من مكالمة في نفس اللحظة، فاللي يتصل 9 مساءً يلقى نفس الرد.",
        },
        {
          title: "الدوام والفروع والتوصيل",
          body: "دوام كل فرع، ورمضان والإجازات، وأقرب علامة، ومناطق التوصيل.",
        },
        {
          title: "الزبون الدايم… يعرفه",
          body: "يحييه باسمه ويعرف فرعه المفضل وعدده المعتاد — ونفس المعلومات قدام موظفك.",
        },
      ],
    },
    voice: {
      heading: "مكالمة المطعم تجي من مكان مزعج",
      paras: [
        "زبونك يتصل من سيارته ويغيّر كلامه وهو يتكلم: «خلها 9 بدل 8:30، وصرنا ستة». الوكيل يسمع ويعدّل الاثنين في نفس المكالمة.",
        "والأصوات اليوم: نجدي، حجازي، شامي، وإنجليزي — رجالي ونسائي. وصوت علامتك تضيفه باستنساخ صوت شخص بموافقته، حسب باقتك.",
      ],
      linkLead: "التفاصيل كاملة في ",
      linkText: "صفحة وكيل الصوت",
    },
    human: {
      heading: "وش يروح لموظفك؟",
      capsule:
        "الوكيل يشتغل في اللي محسوم ومكتوب: حجوزات وقائمة ودوام. وكل شي فيه اجتهاد أو فلوس يروح لموظفك.",
      items: [
        "الشكاوى: صنف ناقص، طلب متأخر، خدمة ما عجبته — تحويل فوري.",
        "نبرة الانزعاج: يلتقطها في صوت الزبون ويصعّد بدل ما يكمل نصه.",
        "أي شي فيه فلوس: استرجاع، تعويض، خصم، عربون — مكانها موظفك.",
        "المناسبات والمجموعات: يسجل العدد والتاريخ والقسم ويحوّلها لمسؤول المناسبات.",
        "طلب الزبون إنسان — قانون ثابت ما يتفاوض فيه.",
      ],
      complaintNote:
        "والشكوى في المطعم وقتها حساس — أغلبها في نفس الليلة والزبون أحياناً على الطاولة. عشان كذا يعتذر ويحوّل فوراً، لأن الشكوى اللي تنتظرها لبكرة ترجع تقييماً على الخريطة.",
      inheritLead: "وموظفك يستلم سبب التصعيد ونص المكالمة وملخصاً عربياً وتاريخ الزبون — ",
      inheritLink: "اقرأ كيف يشتغل التصعيد",
      afterHours:
        "وفريقك يتابع المكالمة وهي شغالة: يسمع، أو يهمس للوكيل بدون ما يسمعه الزبون، أو يستلمها بضغطة. وبرا الدوام يثبت حجز بكرة أو يسجل طلب اتصال.",
    },
    kb: {
      heading: "وش يدخل في قاعدة معرفة مطعمك؟",
      intro: "الوكيل ما يخترع صنف ولا يفتي في سعر — كل جواب لازم يكون مكتوباً عندك:",
      items: [
        { title: "القائمة والأسعار", body: "الأصناف وأسعارها، والنباتي، والعروض الموسمية، ووش الصنف اللي وقف." },
        { title: "سياسة الحجز والإلغاء", body: "أقل وأكثر عدد، ومدة الجلسة، وكم تنتظرون الطاولة، والعربون." },
        { title: "الأقسام والطاولات", body: "عوائل، أفراد، خارجية، قسم مغلق — وكم يستوعب كل قسم." },
        { title: "الذروة وأوقات الدوام", body: "دوام كل يوم، والأوقات اللي ما تقبلون فيها حجز." },
        { title: "الفروع والمواقف والتوصيل", body: "عنوان كل فرع وأقرب علامة له، والمواقف، ومناطق التوصيل." },
        { title: "رمضان والمناسبات", body: "بوفيه الفطور والسحور وأوقاته، وسياسة الحجز في رمضان والأعياد." },
      ],
      mechanics:
        "والقائمة أكثر ملف ما يثبت: صنف يوقف وسعر يرتفع. ترفعها زي ما هي وتعدّل الصنف في مكان واحد.",
      testing:
        "وقبل النشر تجربه في المحادثة التجريبية وتشوف من وين جاب الجواب. والنشر: مسودة، ثم مراجعة، ثم نسخة ترجع لها.",
      channelsHeading: "ومو بس المكالمات",
      channels:
        "واتساب وتيليجرام ودردشة موقعك في نفس الصندوق وبنفس قاعدة المعرفة — تاريخ الزبون قدام موظفك.",
      kbLinkLead: "تفاصيل بنائها وتحديثها في ",
      kbLinkText: "صفحة قاعدة المعرفة",
      securityLead: "ووين تنحفظ بيانات زبائنك وتسجيلاتك — ",
      securityLink: "اقرأ صفحة الأمان والبيانات",
    },
    setup: {
      heading: "كيف نجهز مطعمك؟",
      paras: [
        "نبدأ من قالب المطاعم ونعبيه بمعلوماتك: القائمة والأسعار، والأقسام والطاولات، وسياسة الحجز والعربون. بعدين نتفق على خط الشكاوى: مين يستلمها وعلى أي رقم.",
        "وأطول شي ياخذ وقت مو التقنية — خريطة أقسامك وطاولاتك. فريقنا يضبطها معك، ونتفق معك على المدة في العرض التعريفي.",
      ],
      linkLead: "وتعدّل القائمة بنفسك بعد التشغيل — ",
      linkText: "صفحة بناء الوكيل",
    },
    faqHeading: "أسئلة أصحاب المطاعم",
    faq: [
      {
        q: "الوكيل يحجز الطاولة فعلاً ولا بس ياخذ الاسم؟",
        a: "يحجز فعلاً — العدد والوقت والقسم — ويثبته قبل ما تنتهي المكالمة ويقرأ رقمه رقم رقم. ويظهر لفريقك في نفس اللحظة.",
      },
      {
        q: "وقت الذروة إذا اتصل أكثر من زبون؟",
        a: "يرد على أكثر من مكالمة في نفس الوقت، فما فيه خط مشغول ولا نغمة انتظار. وحجم مكالماتك نقيسه معك في العرض التعريفي.",
      },
      {
        q: "ياخذ طلبات الأكل والتوصيل؟",
        a: "يجاوب على أسئلة التوصيل ويسجل تفاصيل الطلب لفريقك. لكن ما فيه دفع داخل المكالمة ولا ربط مع تطبيقات التوصيل.",
      },
      {
        q: "وإذا كان الزبون معصب؟",
        a: "يروح لموظفك على طول — الشكاوى وأي استرجاع مو من صلاحياته أصلاً. وموظفك يستلم ومعه النص والملخص.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Your restaurant answers every call — even at peak service",
    intro:
      "Your guests ring at half past eight with a full room and nobody free to pick up — and the call you miss goes to the next restaurant on the list. The agent answers in your guest's dialect, books the table for real, and hands complaints to your staff.",
    cta: "Book a demo",
    calls: {
      eyebrow: "A ready-made restaurant template",
      heading: "The calls you miss at peak service",
      body: "This is what calls to a Saudi restaurant sound like between seven and ten. How many went unanswered yesterday?",
      note: "Illustrative dialogues — not real recordings.",
      items: [
        {
          tag: "Booking a table",
          caller: "Good evening — do you have a table for four tonight?",
          agent: "Good evening! We have 8:30 and 9:15 free — which suits you?",
        },
        {
          tag: "Changing a booking",
          caller: "I've booked at 9 for four, but we're six now.",
          agent: "Updated to six and moved to the family section, same time. Same reference: 7 — 3 — 5 — 2.",
        },
        {
          tag: "Menu and allergies",
          caller: "Do you have anything without meat? And my brother has a nut allergy.",
          agent: "We do have vegetarian dishes — I'll run through them. I'll note the allergy and put you through to confirm with the kitchen.",
        },
        {
          tag: "Hours, location, parking",
          caller: "How late are you open today? And is there parking?",
          agent: "Until 1 AM, with parking behind the building — shall I send you the location?",
        },
        {
          tag: "A group or an occasion",
          caller: "I'd like to book for twenty on Thursday — do you have a private area?",
          agent: "We have a section that takes that. I'll take the details and put you through to our events lead.",
        },
        {
          tag: "A complaint — instant escalation",
          caller: "I ordered delivery yesterday and an item was missing.",
          agent: "I'm sorry about that. Let me put you through to the branch manager with your order details.",
          human: "This is Fahad, the branch manager — I have your order and the missing item. Let me make it right.",
        },
      ],
    },
    why: {
      heading: "Why peak service is the whole problem",
      paras: [
        "The problem isn't the number of calls, it's their timing: they all arrive in the same two hours, the room is full, and whoever should answer is at the door seating guests.",
        "A guest who didn't get through rarely tries again — they open the map and ring the next place. And one small mistake costs a whole table: a party of four arrives as six.",
      ],
    },
    handled: {
      eyebrow: "Mapped to the dialogues above",
      heading: "What the agent finishes on the line itself",
      capsule:
        "It finishes the call itself: it confirms the booking, changes or cancels it, and answers from your menu and your hours — it doesn't take a name and say “we'll call you back”, because a guest left waiting books somewhere else.",
      items: [
        {
          title: "It books the table — it doesn't take a name",
          body:
            "It checks your reservations calendar on the line — covers, time and area — confirms the booking, and it appears in your team's calendar in the same moment.",
        },
        {
          title: "Changes and cancellations without a second call",
          body:
            "It finds the reservation from the number the guest is calling from, adds covers, moves the time, or cancels on your policy. A cancelled table goes back into availability.",
        },
        {
          title: "Menu and prices",
          body: "“Do you do vegetarian?”, “How much is the mandi?” — answered from your menu, with no dish invented. Allergies are noted and passed on.",
        },
        {
          title: "Peak service: no engaged tone",
          body: "It answers more than one call at the same time, so a guest calling at 9 PM gets the same answer as one calling at 4.",
        },
        {
          title: "Hours, branches and delivery",
          body: "Each branch's hours, Ramadan and holidays, the nearest landmark, and your delivery coverage.",
        },
        {
          title: "It recognises your regulars",
          body: "It greets them by name and knows their usual branch and party size — the same details your employee sees.",
        },
      ],
    },
    voice: {
      heading: "A restaurant call comes from a noisy place",
      paras: [
        "Your guest rings from the car and changes their mind mid-sentence: “make it 9 instead of 8:30, and we're six now.” The agent listens and amends both in the same call.",
        "The voices available today are Najdi, Hijazi, Levantine and English, male and female. You can add your own brand voice by cloning a named person with their consent, depending on your plan.",
      ],
      linkLead: "The full detail is on the ",
      linkText: "voice agent page",
    },
    human: {
      heading: "What goes to your staff",
      capsule:
        "The agent works on what is settled and written down: reservations, the menu, hours. Judgement and money go to your employee.",
      items: [
        "Complaints: a missing item, a late order, service that disappointed — an immediate transfer.",
        "Audible frustration: the agent hears it in the caller's voice and escalates rather than pushing on.",
        "Anything involving money: refunds, compensation, discounts, deposits — your employee's call.",
        "Occasions and large groups: it captures numbers, date and area and passes them to your events lead.",
        "An explicit request for a human — an iron law it never negotiates.",
      ],
      complaintNote:
        "A restaurant complaint is time-critical: most arrive the same night, sometimes while the guest is still at the table. So the agent apologises once and transfers immediately, because a complaint left until tomorrow comes back as a review on the map.",
      inheritLead: "Your employee inherits the escalation reason, the transcript, an Arabic summary and the guest's history — ",
      inheritLink: "read how the handoff works",
      afterHours:
        "Your team can follow a call live: listen in, whisper to the agent unheard by the guest, or take over in one click. After hours it still confirms tomorrow's table or logs a callback.",
    },
    kb: {
      heading: "What goes into your restaurant's knowledge base",
      intro: "The agent invents no dish and rules on no price — every answer has to be written down by you first:",
      items: [
        { title: "Menu and prices", body: "Dishes and prices, vegetarian options, seasonal offers, and anything off the list." },
        { title: "Booking and cancellation policy", body: "Minimum and maximum party sizes, sitting length, how long a table is held, and deposits." },
        { title: "Areas and tables", body: "Family, singles, outdoor, the private room — and how many each takes." },
        { title: "Peak times and opening hours", body: "Hours for each day, and the slots you don't take bookings for." },
        { title: "Branches, parking and delivery", body: "Each branch's address and nearest landmark, parking, and delivery coverage." },
        { title: "Ramadan and occasions", body: "Iftar and suhoor service and timings, and how booking works through Ramadan and Eid." },
      ],
      mechanics:
        "A menu is the least stable document a business owns: a dish runs out, a price moves. Upload it as it is and change a dish in one place.",
      testing:
        "Before publishing you check it yourself in the test chat and see where each answer came from. Publishing is deliberate: a draft, a review, then a version you can roll back to.",
      channelsHeading: "And not only calls",
      channels:
        "WhatsApp Business, Telegram and your website chat drop into the same inbox and answer from the same knowledge base — the guest's history in front of your employee.",
      kbLinkLead: "How it is assembled and updated is on the ",
      kbLinkText: "knowledge base page",
      securityLead: "Exactly where your guests' data and recordings are stored — ",
      securityLink: "read the security and data page",
    },
    setup: {
      heading: "How we set your restaurant up",
      paras: [
        "We start from the ready-made restaurant template and fill it with your information: menu and prices, areas and tables, the booking and deposit policy. Then we settle the complaints line — who receives one, and on which number.",
        "The part that takes longest isn't the technology — it's the map of your areas and tables. Our team sets that with you, and we agree the timeline with you in the demo.",
      ],
      linkLead: "You change the menu yourself once you're live — ",
      linkText: "the agent builder page",
    },
    faqHeading: "Questions restaurant owners ask",
    faq: [
      {
        q: "Does the agent actually book the table, or just take a name?",
        a: "It actually books — covers, time and area — confirming before the call ends and reading the reference back digit by digit. It appears in your team's calendar in the same moment.",
      },
      {
        q: "What happens at peak time when several guests ring at once?",
        a: "The agent answers more than one call at the same time, so there's no engaged tone and no hold music. Your call volume is sized with you in the intro demo.",
      },
      {
        q: "Can it take food orders and delivery?",
        a: "It answers delivery questions and records order details for your team. But there is no payment inside the call and no integration with delivery apps.",
      },
      {
        q: "What if the guest is upset?",
        a: "It goes to your employee immediately — complaints and refunds are outside its remit by design. Your employee takes over with the transcript and the summary.",
      },
    ] as FaqItem[],
  },
} as const;

type Dialogue = { tag: string; caller: string; agent: string; human?: string };

/**
 * The mini-dialogue card. Same bubble language as SampleConversation but
 * static and server-rendered: six of these animating in sequence would read
 * as noise, and the copy is the point. The optional `human` turn is the
 * escalation bubble, in the same purple SampleConversation uses.
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
          <div className="max-w-[92%] rounded-2xl rounded-ee-md bg-ink px-4 py-2.5 text-body leading-relaxed text-white">
            <span className="mb-1 block text-body-sm font-medium text-white/60">
              {locale === "ar" ? "وكيل صوت نجدي" : "Saut Najdi agent"}
            </span>
            {d.agent}
          </div>
        </div>
        {d.human && (
          <div className="flex justify-end">
            <div className="max-w-[92%] rounded-2xl rounded-ee-md bg-brand-purple px-4 py-2.5 text-body leading-relaxed text-white">
              <span className="mb-1 block text-body-sm font-medium text-white/75">
                {locale === "ar" ? "موظفك" : "Your employee"}
              </span>
              {d.human}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function RestaurantsPage({ locale }: { locale: Locale }) {
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

      <section className="bg-white py-16">
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

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-h2">{s.voice.heading}</h2>
            {s.voice.paras.map((p) => (
              <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
            ))}
            {/* The dialect/voice mechanics live on /product/voice-agent — this
                page only carries the restaurant-specific half. */}
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
        {/* One Reveal around the whole list — a <li> may not be wrapped in the
            <div> that Reveal renders. */}
        <Reveal className="mx-auto mt-8 max-w-3xl">
          <ul className="space-y-3">
            {s.human.items.map((x) => (
              <li
                key={x}
                className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-body-lg leading-relaxed text-ink/80 shadow-card"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden />
                {x}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="rounded-2xl border-s-4 border-s-brand-purple bg-white p-5 text-body-lg leading-relaxed text-ink/80 shadow-card">
            {s.human.complaintNote}
          </p>
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
      </section>

      <section className="bg-white py-16">
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

export const restaurantsFaq = { ar: t.ar.faq, en: t.en.faq };
