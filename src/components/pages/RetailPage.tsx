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
 * /solutions/retail — sector page (blueprint §6.3, spec P2-22 row 6).
 * Short-brief copy: one idea per block, outcome first, no mechanism essays.
 * The honest limit this sector needs said out loud stays: the agent does not
 * read your store or courier system, so "where is my order" is captured and
 * routed, not looked up.
 *
 * Voice catalog is Najdi / Hijazi / Levantine / English — there is no
 * Khaleeji voice, so it is never listed. Brand-voice cloning is plan
 * dependent and is mentioned unquantified.
 *
 * Dialogues are rendered locally: SampleConversation plays one fixed clinic
 * script and takes no `script` prop, and that file isn't this page's to
 * change — same bubble language, server rendered, Reveal for the entrance.
 */

// Positional — keep each array the same length as the section it feeds.
const handleIcons: IconName[] = ["phone", "doc", "clock", "chat", "wave", "people"];
const kbIcons: IconName[] = ["repeat", "globe", "chat", "clock", "retail", "cost"];
const afterIcons: IconName[] = ["chart", "people", "check"];

type Dialogue = { tag: string; caller: string; agent: string; note: string };

const t = {
  ar: {
    h1: "وصل طلبي؟ — رد على استفسارات عملائك بدون فريق",
    intro:
      "وين طلبي؟ ينفع أرجّع؟ عندكم المقاس في الرياض؟ وكيلك يرد على كل مكالمة من سياساتك وبيانات فروعك، واللي يحتاج متابعة يوصله لفريقك.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "المكالمات اللي تفوتك",
      heading: "وش المكالمات اللي تفوتك وأنت تشحن وتخدم؟",
      body: "نفس الأسئلة الستة تتكرر عشرات المرات في اليوم، وأكثرها يحتاج رد سريع بس — مو موظف.",
      note: "حوارات توضيحية — مو تسجيلات حقيقية.",
      items: [
        {
          tag: "وين طلبي؟",
          caller: "طلبت قبل ثلاثة أيام، وين وصل طلبي؟",
          agent: "عطني رقم الطلب… تمام. الشحن عادةً من يومين إلى خمسة أيام، وخدمة العملاء يرجعون لك اليوم.",
          note: "يرد فوراً، وياخذ رقم الطلب ويوصله لفريقك.",
        },
        {
          tag: "الإرجاع والاستبدال",
          caller: "المقاس ما ضبط، ينفع أرجع الجزمة؟",
          agent: "إي. الإرجاع خلال 14 يوماً والقطعة بكرتونها، والمبلغ يرجع لنفس وسيلة الدفع.",
          note: "بنفس صياغة سياستك — ما يزيد ولا ينقص.",
        },
        {
          tag: "توفر منتج في فرع",
          caller: "عندكم القميص الأزرق مقاس L في العليا؟",
          agent: "الفرع مفتوح لين 11 بالليل. توفر المقاس يبيله أحد يتأكد من الرف — أسجل استفسارك ويرد عليك الفرع؟",
          note: "ما يدّعي إنه يشوف مخزونك.",
        },
        {
          tag: "أوقات الفروع",
          caller: "فرع الخبر مفتوح اليوم؟ ولين كم؟",
          agent: "من 10 الصبح إلى 11 بالليل، والجمعة بعد الصلاة. أعطيك أقرب علامة؟",
          note: "يتكرر مئات المرات في الشهر وياكل وقت موظفك.",
        },
        {
          tag: "العروض وشروطها",
          caller: "العرض على الشنط بعده شغال؟",
          agent: "شغال لين نهاية الشهر، وعلى الموديلات الكلاسيك بس — الإصدار المحدود ما يشمله.",
          note: "شرط عرض ما انقال صح يتحول لخلاف عند الكاشير.",
        },
        {
          tag: "منتج تالف",
          caller: "وصلني المنتج مكسور وأبي أكلم مسؤول.",
          agent: "أعتذر منك. أحوّلك الحين لخدمة العملاء — ومعه رقم طلبك وكل اللي وصفته.",
          note: "طلب الإنسان تحويل فوري، والموظف يستلم وهو عارف القصة.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "حد واضح",
      heading: "الوكيل يفتح نظام متجرك؟",
      body: "لا. ما يدخل على نظام متجرك ولا الشحن، فما يجيب حالة شحنة لحظة بلحظة. لكنه يرد من أول رنة على السياسات والفروع والعروض بصياغتك.",
      body2:
        "واللي يحتاج فتح النظام — «وين شحنتي؟» — يسجله طلب متابعة برقم الطلب وبيانات العميل، ويوصل فريقك مع نص المكالمة. فتردون مرة وحدة.",
    },
    handles: {
      eyebrow: "وش يتكفل فيه الوكيل",
      heading: "وش يتكفل فيه الوكيل بنفسه؟",
      capsule:
        "يرد من أول رنة على الإرجاع والشحن وأوقات الفروع والعروض والدفع — من سياساتك أنت.",
      items: [
        {
          title: "يرد على كل مكالمة بدون كول سنتر",
          body: "المكالمات كلها تجي في نفس الساعات ومع أول عرض تتضاعف. ما فيه بريد صوتي ولا انتظار.",
        },
        {
          title: "يعرف سياساتك حرف بحرف",
          body: "الإرجاع والضمان والشحن وطرق الدفع والفاتورة الضريبية بصياغتك أنت — بدون وعود زايدة.",
        },
        {
          title: "أوقات ومواقع كل فرع",
          body: "أوقات كل فرع وخدماته، وأوقات الجمعة ورمضان. «مفتوح الحين؟» له جواب صحيح بأي ساعة.",
        },
        {
          title: "ياخذ تفاصيل الاستفسار كاملة",
          body: "رقم الطلب واسم العميل ووش المشكلة — يوصل فريقك مرتب مع نص المكالمة.",
        },
        {
          title: "بلهجة عميلك — عربي أو إنجليزي",
          body: "نجدي، حجازي، شامي، وإنجليزي، وينتقل حسب اللي يسمعه. وتختار الصوت رجل أو امرأة — أو صوت علامتك، حسب باقتك.",
        },
        {
          title: "يتذكر عميلك",
          body: "يحيي العميل اللي سبق وكلمكم باسمه ويعرف تفاعلاته السابقة.",
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
          body: "«أبي أكلم موظف» ما فيها نقاش — قانون ثابت في المنصة كلها.",
        },
        {
          title: "شكوى أو منتج تالف",
          body: "وصل مكسور، ناقص قطعة، أو تأخر أسبوع. يعتذر ويحوّل بالنص كامل عشان الموظف يبدأ بالحل.",
        },
        {
          title: "استرجاع مبلغ أو تعديل طلب",
          body: "أي مبلغ مسترجع أو خطأ فاتورة، وأي إلغاء أو تعديل قبل الشحن. والوكيل ما ياخذ بيانات بطاقات.",
        },
        {
          title: "طلبات الجملة والشركات",
          body: "كمية كبيرة أو فاتورة منشأة — مبيعات مو خدمة عملاء. ياخذ الأساسيات ويوصلها للمبيعات.",
        },
      ],
      outroLead: "وموظفك يستلم ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ العميل — ",
      outroLink: "اقرأ تفاصيل التصعيد",
      outroPath: "product/human-handoff",
      outroTail: " وفريقك يقدر يتابع المكالمة وهي شغالة ويستلمها بضغطة.",
    },
    kb: {
      eyebrow: "قاعدة المعرفة",
      heading: "وش تحط في قاعدة معرفة متجرك؟",
      body: "كلما وضحت سياساتك، قلّت المكالمات اللي تحتاج موظف. ترفع ملفاتك أو تكتبها أسئلة وأجوبة، وتجربها في المحادثة التجريبية قبل النشر:",
      items: [
        {
          title: "الإرجاع والاستبدال",
          body: "المدة والشروط والاستثناءات: المخفضات، الإصدارات المحدودة، المنتجات المخصصة.",
        },
        {
          title: "الشحن والتوصيل",
          body: "شركات الشحن، المدد داخل المدينة وخارجها، الرسوم، والاستلام من الفرع.",
        },
        {
          title: "سيناريو «وين طلبي؟»",
          body: "وش يقوله الوكيل بالضبط، ووش يجمعه قبل ما يوصل الاستفسار لفريقك.",
        },
        {
          title: "الفروع وأوقاتها",
          body: "العناوين والأوقات وأوقات رمضان، وخدمات كل فرع، وأي فروع تستقبل الإرجاع.",
        },
        {
          title: "المنتجات والعروض",
          body: "الفئات والمقاسات، والعروض الحالية بشروطها وتاريخ انتهائها، وبرنامج الولاء.",
        },
        {
          title: "الدفع والفواتير",
          body: "طرق الدفع، التقسيط ومع مين، والفاتورة الضريبية وكيف يطلبها العميل.",
        },
      ],
      outro:
        "ابدأ بالإرجاع والشحن وأوقات الفروع — تغطي أغلب مكالماتك — وزد كل أسبوع من سجل مكالماتك.",
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
          title: "ملف كل عميل",
          body: "موظفك يعرف قبل ما يرد إذا كان العميل اتصل ثلاث مرات على نفس المشكلة.",
        },
        {
          title: "وسوم وتقييم فريقك",
          body: "وسوم زي «إرجاع» أو «تأخر شحن»، وتقييم فريقك للمكالمة بالنجوم.",
        },
      ],
    },
    template: {
      heading: "تبدأ من صفر؟ لا — قالب التجزئة جاهز",
      body: "شخصية وكيل لخدمة عملاء متجر، وسيناريوهات الإرجاع والشحن وحالة الطلب، وقواعد تصعيد، وهيكل قاعدة معرفة تعبيه بمعلومات متجرك.",
      body2:
        "وعندك أكثر من علامة؟ وكيل لكل وحدة بقاعدة معرفتها وقواعد تصعيدها، وصلاحيات فريقك تتقسم عليها.",
      linkLead: "وطريقة الإعداد والتجربة قبل النشر ",
      linkText: "موضحة في صفحة بناء الوكيل",
      linkPath: "product/agent-builder",
    },
    faqHeading: "أسئلة أصحاب المتاجر",
    faq: [
      {
        q: "الوكيل يقدر يشوف حالة طلب العميل في نظامنا؟",
        a: "لا. يرد فوراً بالمدة المعتادة، وياخذ رقم الطلب والتفاصيل ويوصلها لفريقك مع نص المكالمة.",
      },
      {
        q: "يرد على واتساب وتيليجرام بعد؟",
        a: "واتساب وتيليجرام ومحادثة الموقع تجي في صندوق فريقك الموحد، والرد الآلي يجاوب من قاعدة معرفتك حسب إعداد حسابك.",
      },
      {
        q: "عندنا كذا فرع — الوكيل يفرق بينها؟",
        a: "إي. كل فرع بأوقاته وخدماته في قاعدة معرفتك، ويسأل العميل عن الفرع اللي يقصده قبل ما يجاوب.",
      },
      {
        q: "وش يسوي مع العميل المعصب؟",
        a: "يعتذر ويصعّد لموظفك على طول ومعه النص والملخص وتاريخ العميل. وطلب الإنسان تحويل فوري.",
      },
      {
        q: "نقدر نسمع المكالمات ونتأكد من الردود؟",
        a: "إي. كل مكالمة بتسجيلها ونصها وملخصها، وفريقك يقيّمها ويحط عليها وسوم، ويقدر يستلمها وهي شغالة.",
      },
      {
        q: "كيف نبدأ؟",
        a: "احجز عرضاً تعريفياً — ونجهز لك القالب وقاعدة المعرفة وقواعد التصعيد بأنفسنا. ما في تسجيل ذاتي.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "“Has my order arrived?” — answer every customer without a call centre",
    intro:
      "Your store is selling and the calls stack up: where's my order, can I return this, do you have this size in Riyadh? The Saut Najdi agent answers every one from your own policies and branch information, and captures anything that needs following up — delivered to your team with the transcript attached.",
    cta: "Book a demo",
    calls: {
      eyebrow: "The calls you're missing",
      heading: "Which calls are you missing while you're shipping and serving?",
      body: "The same six questions repeat dozens of times a day. Most don't need an employee — they need a fast, correct answer.",
      note: "Illustrative dialogue — not a real recording.",
      items: [
        {
          tag: "Where is my order?",
          caller: "I ordered three days ago — where has it got to?",
          agent: "Could I have the order number… noted. Shipping normally takes two to five working days, and customer service will come back to you today with an exact update.",
          note: "It doesn't open your store system — it answers instantly and routes the order number to your team.",
        },
        {
          tag: "Returns and exchanges",
          caller: "The shoes I bought don't fit — can I return them?",
          agent: "Yes. Returns are accepted within 14 days with the item in its box, refunded to the same payment method. Shall I log a return request?",
          note: "Retail's most common question, answered in your policy's exact wording.",
        },
        {
          tag: "Is it in stock at a branch",
          caller: "Do you have the blue shirt in size L at Olaya?",
          agent: "Olaya is open until 11 tonight. Whether that size is on the shelf needs someone to check — shall I log it so the branch calls you back?",
          note: "It never pretends to see your stock. It says so, and routes the enquiry with enough detail.",
        },
        {
          tag: "Branch hours",
          caller: "Is the Khobar branch open today? Until when?",
          agent: "Open from 10 in the morning until 11 at night, and after prayers on Friday. Shall I give you the nearest landmark?",
          note: "A simple question asked hundreds of times a month that eats your team's hours.",
        },
        {
          tag: "Offers and conditions",
          caller: "Is the bag offer still running? Does it cover all models?",
          agent: "It runs to the end of the month and applies to the classic models only — the limited edition isn't included.",
          note: "A half-explained offer becomes an argument at the till.",
        },
        {
          tag: "A damaged item",
          caller: "It arrived broken and I want to speak to someone in charge.",
          agent: "I'm sorry about that. I'm putting you through to customer service — with your order number and everything you've described.",
          note: "A request for a human transfers immediately, with the story attached.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "A clear boundary",
      heading: "Does the agent open your store system?",
      body: "No. It doesn't log into your store platform or your courier's, so it can't fetch a live shipment status. What it does: answer on the first ring, and answer every policy, branch and offer question in the wording you approved.",
      body2:
        "When a question genuinely needs the system open — “where exactly is my shipment?” — it takes the order number and the customer's details and logs a follow-up for your team with the transcript. Your employee replies once, from complete information.",
    },
    handles: {
      eyebrow: "What the agent handles",
      heading: "What does the agent handle on its own?",
      capsule:
        "It answers on the first ring on returns, shipping, warranty, branch hours, offers and payment — from your own policies. Anything needing follow-up it captures for your team.",
      items: [
        {
          title: "Every call answered, without a call centre",
          body: "Calls all arrive in the same hours, and any promotion doubles them. It answers on the first ring — no voicemail, no hold.",
        },
        {
          title: "It knows your policies word for word",
          body: "Returns, exchanges, warranty, shipping fees and timeframes, payment methods, tax invoices. In your wording, with nothing promised you can't honour.",
        },
        {
          title: "Hours and locations for every branch",
          body: "Each branch's hours and location, its Friday, Ramadan and holiday hours, and the services it offers. “Are you open now?” gets a correct answer at any hour.",
        },
        {
          title: "It captures the enquiry in full",
          body: "Order number, name and number, exactly what the problem is. It reaches your team organised, with transcript and summary.",
        },
        {
          title: "In your customer's language",
          body: "Najdi, Hijazi and Levantine Arabic plus English, switching by what it hears. Choose a male or female voice — or your own brand voice, depending on your plan.",
        },
        {
          title: "It remembers your customer",
          body: "A returning caller is recognised and greeted by name, with their previous interactions known. Nobody explains themselves twice.",
        },
      ],
    },
    human: {
      eyebrow: "What goes to a human",
      heading: "What goes to your employee?",
      capsule:
        "Four situations transfer straight away: a request for a person, a complaint or damaged item, refunds, and wholesale requests. You set the rules from the dashboard.",
      items: [
        {
          title: "A request for a human — immediate",
          body: "“I want to speak to someone” is never argued with. It transfers at once — an iron law across the platform.",
        },
        {
          title: "Complaints and damaged goods",
          body: "Broken, missing a part, or a week late. It apologises, captures the order number, and transfers with the full transcript so your employee starts with the fix.",
        },
        {
          title: "Refunds and order changes",
          body: "Refunds, billing errors, and any cancellation or change before dispatch go to your employee immediately. The agent never takes card details and never says the change is done.",
        },
        {
          title: "Wholesale and corporate requests",
          body: "A large quantity or an invoice in a company's name is sales, not service. It captures the essentials and passes them to your sales team.",
        },
      ],
      outroLead: "Your employee inherits the escalation reason, the full transcript, an Arabic summary and the customer's history — ",
      outroLink: "read how escalation works",
      outroPath: "product/human-handoff",
      outroTail: " Your team can also follow a live call, listen in, and take it over in one click.",
    },
    kb: {
      eyebrow: "Your knowledge base",
      heading: "What belongs in your store's knowledge base?",
      body: "The more clearly your policies are written, the fewer calls need an employee. Upload files or write question-and-answer pairs, and check every answer in the test chat before publishing. These matter most:",
      items: [
        {
          title: "Returns and exchanges",
          body: "The window, the conditions, and the exclusions: discounted items, limited editions, personalised goods. How the refund is returned and how long it takes.",
        },
        {
          title: "Shipping and delivery",
          body: "Your couriers, timeframes inside and outside the city, fees, the free-shipping threshold, and in-branch pickup.",
        },
        {
          title: "The “where's my order?” script",
          body: "Exactly what the agent should say: the normal timeframe, what each tracking status means, and what it must collect before the enquiry reaches your team.",
        },
        {
          title: "Branches and hours",
          body: "Addresses and hours, exceptional Ramadan and holiday hours, services at each branch, and which branches accept returns.",
        },
        {
          title: "Products and offers",
          body: "Categories and the sizes you normally carry, current offers with their conditions and end dates, and your loyalty programme if you have one.",
        },
        {
          title: "Payment and invoices",
          body: "Payment methods, instalment options and with whom, how a tax invoice is requested, and your policy when a wrong price is displayed.",
        },
      ],
      outro:
        "Start with returns, shipping and branch hours — those three alone cover most of your calls — then add each week from your own call log.",
    },
    after: {
      eyebrow: "After the call",
      heading: "And once the call ends?",
      body: "Every call is kept in your dashboard with its recording, transcript and Arabic summary. The dashboard also shows your own numbers — call volume, the share the agent handled end to end, average duration — with CSV and PDF export.",
      items: [
        {
          title: "A complete call log",
          body: "Listen to any call, see where the agent chose to hand over, and adjust its wording if it doesn't sound like your brand.",
        },
        {
          title: "A profile for every customer",
          body: "Their history with you in one place. Your employee knows before answering whether this person has called three times about the same thing.",
        },
        {
          title: "Tags and your team's ratings",
          body: "Tag calls “return” or “late shipment”, and let your team star-rate them. A month later you know what to fix in your policies.",
        },
      ],
    },
    template: {
      heading: "Starting from nothing? No — the retail template is ready",
      body: "An agent persona built for store customer service, scenarios for returns, shipping, order status and branch availability, ready escalation rules, and a knowledge-base skeleton you fill with your own information.",
      body2:
        "More than one brand? Each gets its own agent with its own knowledge base and escalation rules, and your team's permissions split the same way.",
      linkLead: "How setup and the test-chat check before publishing work ",
      linkText: "is on the agent builder page",
      linkPath: "product/agent-builder",
    },
    faqHeading: "Questions from store owners",
    faq: [
      {
        q: "Can the agent see a customer's order status in our system?",
        a: "No — it doesn't log into your store platform or your courier's. It answers instantly with the normal timeframe, and captures the order number and full enquiry for your team with the transcript.",
      },
      {
        q: "Does it answer WhatsApp and Telegram too?",
        a: "The text channels — WhatsApp, Telegram and website chat — land in one shared team inbox, and automatic replies answer from your knowledge base depending on your account's configuration.",
      },
      {
        q: "We have several branches — does the agent distinguish between them?",
        a: "Yes. Each branch has its location, hours and services in your knowledge base, and the agent asks which branch the customer means before answering.",
      },
      {
        q: "What does it do with an angry customer?",
        a: "It apologises and escalates immediately, carrying the transcript, the summary and the customer's history. An explicit request for a person is never negotiated.",
      },
      {
        q: "Can we listen to calls and check the answers?",
        a: "Yes. Every call has its recording, transcript and summary, your team can rate and tag it, and they can follow a live call and take it over when it needs them.",
      },
      {
        q: "How do we start?",
        a: "Book an intro demo — we look at your call volume and your most common questions, and we build the template, knowledge base and escalation rules for you. There's no self-signup.",
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

export function RetailPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <span className="mx-auto mb-4 flex justify-center">
            <IconChip name="retail" />
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

      {/* The honest limit, said before the capability list rather than after:
          no store or courier integration exists, so no live order lookup. */}
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

      <section className="bg-white py-16">
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

      <section className="bg-white py-16">
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

export const retailFaq = { ar: t.ar.faq, en: t.en.faq };
