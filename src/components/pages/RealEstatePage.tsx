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
 * /solutions/real-estate — sector page (blueprint §6.3, spec P2-22 row 4).
 * Short-brief copy: one idea per block, outcome first, no mechanism essays.
 *
 * Outbound boundary (owner-confirmed, code-verified): a team member CAN
 * place an outbound call from the dashboard with a published agent holding
 * the conversation — logged, transcribed, summarised. What does NOT exist is
 * automatic dialling of a list: every outbound call is started by a person.
 * Campaign audiences are deliberately NOT mentioned in either language — the
 * clause added nothing and was the page's one legally sensitive claim. No
 * quiet-hours, opt-out or consent-gated dialling is claimed either, because
 * none is enforced in code.
 *
 * Dialogues are rendered locally: SampleConversation plays one fixed clinic
 * script and takes no `script` prop, and that file isn't this page's to
 * change — same bubble language, server rendered, Reveal for the entrance.
 */

// Positional — keep each array the same length as the section it feeds.
const handleIcons: IconName[] = ["phone", "estate", "calendar", "doc", "chat", "clock"];
const kbIcons: IconName[] = ["estate", "badge", "doc", "calendar", "globe", "chat"];
const afterIcons: IconName[] = ["chart", "calendar", "people"];

type Dialogue = { tag: string; caller: string; agent: string; note: string };

const t = {
  ar: {
    h1: "الشقة للحين متاحة؟ — وكيلك يرد على كل مستفسر",
    intro:
      "اللي شاف إعلانك ما ينتظر — إذا ما رد أحد يدق على الإعلان اللي تحته. وكيلك يرد على كل مكالمة: متاحة ولا لا، السعر والشروط، ومعاينة محجوزة.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "المكالمات اللي تفوتك",
      heading: "وش المكالمات اللي تفوتك وأنت في معاينة؟",
      body: "إعلان واحد يجيب عشرات الاتصالات، أكثرها بعد الدوام. وكل مكالمة تفوتك عميل راح لمكتب ثاني.",
      note: "حوارات توضيحية — مو تسجيلات حقيقية.",
      items: [
        {
          tag: "توفر الوحدة",
          caller: "شفت إعلان الشقة في النرجس — للحين متاحة؟",
          agent: "إي متاحة — ثلاث غرف، دور ثاني، ومعها موقف خاص. أحجز لك معاينة؟",
          note: "أهم سؤال في القطاع، ويرد عليه من أول رنة.",
        },
        {
          tag: "السعر والشروط",
          caller: "كم إيجارها سنوي؟ والدفع كم دفعة؟",
          agent: "الإيجار 55,000 سنوي، دفعتين أو أربع حسب العقد، والتأمين شهر يرجع بعد الإخلاء.",
          note: "مكتوبة مرة وحدة — ما فيه وعد زايد من مندوب.",
        },
        {
          tag: "حجز معاينة",
          caller: "أبي أشوفها بكرة العصر إذا ينفع.",
          agent: "بكرة الساعة 5 فاضية. أثبتها لك، والمندوب فهد بيستقبلك — أعطيك الموقع؟",
          note: "تنثبت في تقويمك باسم المستفسر والوحدة.",
        },
        {
          tag: "بدائل ومقارنة",
          caller: "هذي صغيرة علينا — عندكم أكبر في نفس الحي؟",
          agent: "عندنا أربع غرف بمساحة أكبر، دور أول. أحجز لك معاينة للثنتين بنفس اليوم تقارن؟",
          note: "اللي ما ناسبته وحدة ما يطلع بيدين فاضيتين.",
        },
        {
          tag: "الموقع والخدمات",
          caller: "وين موقعها بالضبط؟ وقريبة من مدارس؟",
          agent: "على شارع الأمير سعود. أقرب مدرسة دقايق مشي، وفيه مسجد وبقالة بنفس الحي.",
          note: "«وين بالضبط؟» يتكرر في كل مكالمة — اكتبه مرة وحدة.",
        },
        {
          tag: "تمويل وتفاوض",
          caller: "أبي أشتري بس أحتاج تمويل، وودي أفاوض على السعر.",
          agent: "هذا يبيله مختص. أحوّلك الحين لمستشار المبيعات — ومعه الوحدة وكل اللي قلته.",
          note: "التمويل والتفاوض ما يجتهد فيها الوكيل أبداً.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "الاتصال الصادر",
      heading: "وكيلك يقدر يتصل على المستفسر؟",
      body: "إي — من اللوحة. تختار العميل أو تكتب رقمه وتختار وكيلك، والمنصة تطلع المكالمة والوكيل يمسك الحوار. وتنسجل وتتلخص زي أي مكالمة. تحتاج بس تحدد خط الاتصال الصادر.",
      body2:
        "واللي ما يصير: اتصال آلي على قائمة أرقام. كل مكالمة صادرة يبدأها موظف من فريقك.",
    },
    handles: {
      eyebrow: "وش يتكفل فيه الوكيل",
      heading: "وش يتكفل فيه الوكيل بنفسه؟",
      capsule:
        "يرد على كل مكالمة، يقول إذا الوحدة متاحة ويعطي سعرها وشروطها، ويحجز المعاينة.",
      items: [
        {
          title: "يرد على كل مستفسر — حتى وقت الذروة",
          body: "الإعلان ما يعرف أوقات دوامك. يرد من أول رنة بعد العشاء ويوم الجمعة.",
        },
        {
          title: "يعرف كل وحدة وحالتها",
          body: "الحي والمساحة والغرف والدور والسعر وحالتها. حدّث السجل، وما يوعد أحد بشقة انحجزت أمس.",
        },
        {
          title: "يحجز معاينة في وقت يناسب مندوبك",
          body: "يثبت الموعد باسم المستفسر والوحدة، ويظهر في تقويم الحجوزات. مندوبك يطلع لموعد مؤكد.",
        },
        {
          title: "شروطك بصياغتك أنت",
          body: "الدفعات ومدة العقد والتأمين والعمولة — مكتوبة مرة وحدة، ويقولها حرفياً.",
        },
        {
          title: "يسجل بيانات المستفسر كاملة",
          body: "اسمه ورقمه وكم غرفة وأي حي والميزانية — يوصل فريقك مع نص المكالمة.",
        },
        {
          title: "برا الدوام يسجل طلب اتصال",
          body: "الطلب يكون قدام فريقك أول الدوام بوقته المفضل، ويقدرون يرجعون له بالوكيل من اللوحة.",
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
          body: "«حوّلني لمندوب» ما فيها نقاش — قانون ثابت في المنصة كلها.",
        },
        {
          title: "التفاوض على السعر",
          body: "يعطي السعر المعلن زي ما هو مكتوب، وما يوافق على تخفيض بدالك.",
        },
        {
          title: "التمويل والإجراءات النظامية",
          body: "تمويل عقاري، إفراغ، صك، ضريبة تصرفات. ياخذ السؤال بنصه لمختص عندك.",
        },
        {
          title: "شكوى مستأجر أو نزاع",
          body: "تأخر صيانة، خلاف على التأمين، طلب إنهاء عقد. يعتذر، ياخذ التفاصيل، ويصعّد.",
        },
      ],
      outroLead: "وموظفك يستلم ومعه سبب التحويل والنص الكامل وملخص عربي — ",
      outroLink: "اقرأ تفاصيل التصعيد",
      outroPath: "product/human-handoff",
      outroTail: " وفريقك يقدر يتابع المكالمة وهي شغالة ويستلمها بضغطة.",
    },
    kb: {
      eyebrow: "قاعدة المعرفة",
      heading: "وش تحط في قاعدة معرفة مكتبك؟",
      body: "منها يعرف الوكيل وحداتك وشروطك. ترفع ملفاتك أو تكتبها أسئلة وأجوبة، وتجربها في المحادثة التجريبية قبل النشر:",
      items: [
        {
          title: "بيانات الوحدات",
          body: "الكود والنوع والحي والمساحة والغرف والدور والسعر والحالة. دقته تحدد جودة كل مكالمة.",
        },
        {
          title: "المشاريع والمخططات",
          body: "اسم المشروع وموقعه ومراحل التسليم والمرافق المشتركة: مصعد، مواقف، حراسة.",
        },
        {
          title: "شروط العقد والدفعات",
          body: "الدفعات ومواعيدها، مدة العقد والتجديد، التأمين، العمولة، ورسوم الخدمات.",
        },
        {
          title: "أوقات المعاينة والمندوبين",
          body: "مين المسؤول عن كل حي، وأوقات المعاينة المتاحة ومدتها.",
        },
        {
          title: "الاتجاهات وأقرب المعالم",
          body: "العنوان وأقرب مخرج، والخدمات حوالين الوحدة: مدارس، مساجد، أسواق.",
        },
        {
          title: "الأسئلة اللي تتكرر عليك",
          body: "يقبل حيوانات؟ فيه مصعد؟ ينفع سكن عزاب؟ اكتبها سؤال وجواب قصير.",
        },
      ],
      outro:
        "ابدأ بجدول الوحدات وشروط العقد، وزد كل أسبوع من سجل مكالماتك.",
    },
    after: {
      eyebrow: "بعد المكالمة",
      heading: "وبعد ما تسكر المكالمة؟",
      body: "كل مكالمة عندك بتسجيلها ونصها وملخصها العربي. واللوحة تعطيك أرقام مكالماتك — العدد، ونصيب الوكيل منها، ومعدل المدة — مع تصدير CSV أو PDF.",
      items: [
        {
          title: "سجل مكالمات كامل",
          body: "تسمع أي مكالمة، وتشوف وين قرر الوكيل يحوّل، وتعدل صياغته.",
        },
        {
          title: "المعاينات في تقويم واحد",
          body: "معاينات الوكيل تنزل مع اللي سجله فريقك، ومعها الوحدة واسم المستفسر.",
        },
        {
          title: "ملف كل مستفسر",
          body: "مكالماته والوحدات اللي سأل عنها ومعايناته — ما يعيد كلامه من الأول.",
        },
      ],
    },
    template: {
      heading: "تبدأ من صفر؟ لا — قالب العقار جاهز",
      body: "شخصية وكيل لمستفسري الإعلانات، وسيناريوهات التوفر وحجز المعاينة، وقواعد تصعيد جاهزة، وهيكل قاعدة معرفة تعبيه ببياناتك.",
      body2:
        "ومكتبك يشتغل على أكثر من نشاط؟ وكيل لكل نشاط بقاعدة معرفته وصوته وصلاحياته.",
      linkLead: "ورحلة الإعداد والتعديل بدون كود ",
      linkText: "تلقاها في صفحة بناء الوكيل",
      linkPath: "product/agent-builder",
    },
    faqHeading: "أسئلة المكاتب العقارية",
    faq: [
      {
        q: "الوكيل يقدر يتصل على العميل؟",
        a: "إي، بس بيد فريقك: من اللوحة تختار العميل أو تكتب رقمه وتطلق المكالمة، والوكيل يمسك الحوار. ما فيه اتصال آلي على قوائم أرقام.",
      },
      {
        q: "كيف يعرف الوكيل إن الوحدة انحجزت؟",
        a: "من سجل الوحدات في قاعدة معرفتك: تغيّر حالتها إلى «محجوزة» وتنشر، وبعدها ما يعرضها ويطرح البدائل.",
      },
      {
        q: "يقدر يحجز معاينة في تقويمنا؟",
        a: "إي. يثبت الموعد باسم المستفسر ورقمه والوحدة، ويظهر في تقويم الحجوزات مع نص المكالمة.",
      },
      {
        q: "وش يصير إذا سأل عن التمويل أو الإفراغ؟",
        a: "يحوّل لموظفك على طول، وياخذ سؤال العميل بنصه لمختص عندك مع سياق المكالمة.",
      },
      {
        q: "نقدر نغيّر كلام الوكيل وردوده؟",
        a: "إي — من بناء الوكيل تعدل شخصيته وحدوده وتجرب قبل النشر. وفريقنا يجهز القالب أول شي.",
      },
      {
        q: "وين تنحفظ بيانات مستفسرينا؟",
        a: "التخزين الدائم في منطقة الخليج (الدوحة)، والتسجيلات تنحذف بعد 90 يوماً. والمعالجة اللحظية للصوت تمر عبر مزودين عالميين — مفصّلة في صفحة الأمان.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "“Is the apartment still available?” — an agent that answers every enquiry",
    intro:
      "Someone who has just seen your listing will not wait. They call, and if nobody answers they call the listing below yours. The Saut Najdi agent answers every one: whether the unit is available, its price and terms from your own data, and a viewing booked into a slot that suits your rep.",
    cta: "Book a demo",
    calls: {
      eyebrow: "The calls you're missing",
      heading: "Which calls are you missing while you're out at a viewing?",
      body: "One listing produces dozens of calls, most of them after hours or at the weekend. Each unanswered one is a buyer who went to another office.",
      note: "Illustrative dialogue — not a real recording.",
      items: [
        {
          tag: "Is it still available",
          caller: "I saw your listing in Al Narjis — is it still available?",
          agent: "Yes, it is — three bedrooms, second floor, with its own parking. Shall I book you a viewing?",
          note: "The sector's most important question, answered on the first ring and moved straight to booking.",
        },
        {
          tag: "Price and terms",
          caller: "What's the annual rent? And how many instalments?",
          agent: "SAR 55,000 a year, payable in two or four instalments, with a one-month deposit returned after handover.",
          note: "Price and instalments are written once — no rep over-promising a different figure.",
        },
        {
          tag: "Booking a viewing",
          caller: "I'd like to see it tomorrow afternoon if possible.",
          agent: "Tomorrow at 5 is free. I'll book the viewing, and Fahad will meet you there — shall I send the location?",
          note: "Booked into your calendar with the caller's name and number and the unit.",
        },
        {
          tag: "Alternatives",
          caller: "That's too small for us — anything bigger in the same district?",
          agent: "We have a four-bedroom on the first floor. Shall I book both viewings the same day so you can compare?",
          note: "A caller the first unit didn't suit doesn't leave your office empty-handed.",
        },
        {
          tag: "Location and what's nearby",
          caller: "Where exactly is it? Is it near schools?",
          agent: "On Prince Saud street, entrance from the north. The nearest school is a few minutes' walk, with a mosque and a grocery in the district.",
          note: "“Where exactly?” comes up in nearly every call — write it once.",
        },
        {
          tag: "Finance and negotiation",
          caller: "I want to buy, but I need a mortgage and I'd like to negotiate.",
          agent: "That needs a specialist. I'm putting you through to a sales adviser — with the unit and everything you've told me.",
          note: "Finance and negotiation are never improvised.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "Outbound calling",
      heading: "Can the agent call an enquirer back?",
      body: "Yes — from the dashboard. Pick a customer or type a number, choose a published agent, and the platform places a real call with the agent holding the conversation. It is recorded, transcribed and summarised like any other call. You only need a default outbound line set on your account.",
      body2:
        "What it does not do is dial a list by itself. Every outbound call is started by someone on your team.",
    },
    handles: {
      eyebrow: "What the agent handles",
      heading: "What does the agent handle on its own?",
      capsule:
        "It answers every inbound call, says whether a unit is available and gives its price and terms, and books the viewing — with anything else passed to your employee in context.",
      items: [
        {
          title: "Every enquirer answered — even at peak",
          body: "Your listing doesn't know your office hours. It answers on the first ring after dinner, on Fridays, and while you're inside another viewing.",
        },
        {
          title: "It knows every unit and its status",
          body: "District, size, bedrooms, floor, price, and whether it's available, reserved or let. Keep the register current and nobody is promised a unit taken yesterday.",
        },
        {
          title: "It books into your rep's slots",
          body: "The appointment is made with the enquirer's name and number and the unit, and appears in your reservations calendar. Your rep drives to a confirmed viewing.",
        },
        {
          title: "Your terms, in your wording",
          body: "Instalments, contract length, deposit, commission, who handles maintenance. Written once and repeated exactly to every caller.",
        },
        {
          title: "It captures the enquirer in full",
          body: "Name, number, bedrooms, district, budget, rent or purchase. It reaches your team organised, with the transcript attached.",
        },
        {
          title: "Out of hours, it logs a callback",
          body: "The request waits in the dashboard with the caller's preferred time — and your team can return the call with the agent from the dashboard.",
        },
      ],
    },
    human: {
      eyebrow: "What goes to a human",
      heading: "What goes to your employee?",
      capsule:
        "Four situations transfer straight away: a request for a person, price negotiation, finance and legal procedure, and tenant complaints. You set the rules from the dashboard.",
      items: [
        {
          title: "A request for a human — immediate",
          body: "“Put me through to an agent” is never argued with. It transfers at once — an iron law across the platform.",
        },
        {
          title: "Price negotiation",
          body: "It quotes the listed price exactly as written, and never agrees a reduction on your behalf or opens bargaining.",
        },
        {
          title: "Finance and legal procedure",
          body: "Mortgages, title deeds, transfer of ownership, transaction tax. It passes the question verbatim to your specialist.",
        },
        {
          title: "Tenant complaints and disputes",
          body: "Delayed maintenance, an argument over the deposit, a request to terminate. It apologises, captures the unit and details, and escalates.",
        },
      ],
      outroLead: "Your employee inherits the escalation reason, the full transcript, an Arabic summary and the caller's history — ",
      outroLink: "read how escalation works",
      outroPath: "product/human-handoff",
      outroTail: " Your team can also follow a live call, listen in, and take it over in one click.",
    },
    kb: {
      eyebrow: "Your knowledge base",
      heading: "What belongs in your office's knowledge base?",
      body: "It's where the agent learns your units, projects and terms. Upload files or write question-and-answer pairs, and check every answer in the test chat before publishing. These matter most:",
      items: [
        {
          title: "The unit register",
          body: "Code, type, district, size, bedrooms, floor, price and status. Your most important file — its accuracy sets the quality of every call.",
        },
        {
          title: "Projects and plans",
          body: "Project name and location, handover phases, and the shared facilities: lift, parking, security, pool.",
        },
        {
          title: "Contract terms and payments",
          body: "Instalments and dates, contract length and renewal, the deposit, who pays commission, and service charges.",
        },
        {
          title: "Viewing slots and reps",
          body: "Who covers each district, which slots are open, and how long a viewing takes.",
        },
        {
          title: "Directions and landmarks",
          body: "Address and nearest exit, plus what surrounds the unit: schools, mosques, shops. Enquirers decide on location before price.",
        },
        {
          title: "The questions you keep answering",
          body: "Pets? A lift? Separately metered electricity? Single tenants accepted? Write them as short question-and-answer pairs.",
        },
      ],
      outro:
        "Start with the unit register and the contract terms, then add each week from your call log. The sharper it is, the more of your reps' hours go to viewings and closings.",
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
          title: "Viewings in one calendar",
          body: "Agent-booked viewings land alongside your team's, with the unit and the caller's name and number.",
        },
        {
          title: "A profile for every enquirer",
          body: "Previous calls, the units they asked about, and their viewings. Nobody starts from the beginning again.",
        },
      ],
    },
    template: {
      heading: "Starting from nothing? No — the real-estate template is ready",
      body: "An agent persona built for listing enquiries, scenarios for availability, viewing bookings and alternatives, ready escalation rules for negotiation and finance, and a knowledge-base skeleton you fill with your own data.",
      body2:
        "Several lines of business? Each gets its own agent, knowledge base, escalation rules and voice, with team permissions split the same way.",
      linkLead: "How setup and code-free editing work ",
      linkText: "is on the agent builder page",
      linkPath: "product/agent-builder",
    },
    faqHeading: "Questions from property offices",
    faq: [
      {
        q: "Can the agent call a customer?",
        a: "Yes, when your team starts the call: from the dashboard you pick a customer or type a number and place it, and the agent holds the conversation — recorded, transcribed and summarised. There is no automatic dialling of a list.",
      },
      {
        q: "How does the agent know a unit has been reserved?",
        a: "From the unit register in your knowledge base. Set the status to reserved and publish, and it stops offering the unit and suggests alternatives you hold in the same district.",
      },
      {
        q: "Can it book a viewing in our calendar?",
        a: "Yes. It checks the open slots and books with the enquirer's name and number and the unit, and the appointment appears in your reservations calendar with the transcript.",
      },
      {
        q: "What happens if someone asks about mortgages or title transfer?",
        a: "It transfers to your employee immediately, passing the question verbatim to your specialist with the full context of the call.",
      },
      {
        q: "Can we change how the agent speaks?",
        a: "Yes — in the agent builder you edit its persona and its boundaries, and try the change in the test chat before publishing. Our team builds the template with you first.",
      },
      {
        q: "Where is our enquirers' data stored?",
        a: "Permanent storage is in the Gulf region (Doha), and recordings are deleted automatically after 90 days. Realtime speech processing transits global providers — detailed on our security page.",
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
            <p className="max-w-[90%] rounded-2xl rounded-ee-md bg-ink px-4 py-3 text-body-lg leading-relaxed text-canvas">
              {item.agent}
            </p>
          </div>
        </div>
        <p className="mt-4 text-body leading-relaxed text-ink/65">{item.note}</p>
      </article>
    </Reveal>
  );
}

export function RealEstatePage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <span className="mx-auto mb-4 flex justify-center">
            <IconChip name="estate" />
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

      {/* The sector's one boundary worth stating outright: outbound calls are
          placed by a person from the dashboard; nothing auto-dials a list. */}
      <section className="bg-navy py-14 text-white">
        <Reveal className="container mx-auto max-w-3xl text-center">
          <p className="eyebrow !text-brand-cyan">{s.boundary.eyebrow}</p>
          <h2 className="mt-2 text-h3">{s.boundary.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-white/80">{s.boundary.body}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-white/80">{s.boundary.body2}</p>
        </Reveal>
      </section>

      <section className="container py-16">
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
      </section>

      <section className="bg-surface py-16">
        <div className="container">
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
        </div>
      </section>

      <section className="container py-16">
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
      </section>

      <section className="bg-surface py-16">
        <div className="container">
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
        </div>
      </section>

      <section className="container py-16">
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

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const realEstateFaq = { ar: t.ar.faq, en: t.en.faq };
