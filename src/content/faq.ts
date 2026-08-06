import type { FaqItem } from "@/lib/schema";
import type { Locale } from "@/lib/i18n";

/**
 * FAQ content (blueprint §6.9) — the AI-answer surface. Questions in
 * dialect, answers as complete quotable sentences that name the product
 * in the first clause. One register per sentence. No numbers, no
 * promised durations, PDPL answer uses the §2.5 framing.
 *
 * Grouped rather than flat: twenty questions in one undifferentiated
 * list reads worse to a human and gives /faq no heading outline for a
 * crawler to anchor an answer to. `fullFaq` below flattens the groups so
 * schema and every other consumer sees the same list they always did.
 *
 * Two answers here are legal-sensitive and must not be "improved":
 * the Saudization answer names MHRSD as the authority and stops — it
 * never summarises the regulation or hints at how to satisfy it — and
 * the trial-number answer must never acquire a date, because number
 * activation is not ours to promise.
 */

export interface FaqGroup {
  /** Stable, locale-independent anchor so /faq and /en/faq share hrefs. */
  id: string;
  group: string;
  items: FaqItem[];
}

export const faqGroups: Record<Locale, FaqGroup[]> = {
  ar: [
    {
      id: "basics",
      group: "الأساسيات",
      items: [
        {
          q: "وش هو صوت نجدي؟",
          a: "صوت نجدي وكيل صوتي سعودي بالذكاء الاصطناعي يرد على مكالمات عملائك باللهجة اللي يفهمونها، ينفذ طلباتهم — يحجز ويجاوب ويسجل — ويحوّل المكالمة لموظفك البشري بكامل سياقها متى ما احتاج الموضوع إنسان.",
        },
        {
          q: "وش الفرق بين الرد الآلي (IVR) والوكيل الصوتي الذكي؟",
          a: "صوت نجدي وكيل صوتي يتكلم مع عميلك بلغته الطبيعية، مو قائمة «اضغط 1»: العميل يقول «أبغى أحجز بكرة العصر» بلهجته، والوكيل يفهم قصده ويحجز له مباشرة، ويقدر العميل يقاطعه بنص الجملة زي ما يقاطع أي موظف — بينما نظام IVR التقليدي يعطيك خيارات ثابتة ولازم تمشي عليها.",
        },
        {
          q: "يناسب نشاطي؟",
          a: "صوت نجدي يجهز بقوالب جاهزة للعيادات والمستشفيات والمطاعم والفنادق والعقارات والتجزئة — وإذا نشاطك شي ثاني، نجهز لك وكيلك على مقاس شغلك.",
        },
      ],
    },
    {
      id: "voice",
      group: "اللهجة والصوت",
      items: [
        {
          q: "يفهم اللهجة السعودية فعلاً؟",
          a: "صوت نجدي مبني من أساسه على اللهجات السعودية: يسمع «أبغى» و«وش» و«بكرة» ويفهمها صح، ويرد بأصوات رجالية ونسائية بلهجات نجدية وحجازية وخليجية — وبالعربية الفصحى والإنجليزية بعد.",
        },
        {
          q: "الأصوات رجالية ولا نسائية؟ وأقدر أستخدم صوت علامتي؟",
          a: "صوت نجدي عنده أصوات رجالية ونسائية بثلاث لهجات سعودية — نجدية وحجازية وخليجية — وبالعربية الفصحى والإنجليزية. وتقدر تستنسخ صوت علامتك من عيّنة صوتية قصيرة، بإقرار موافقة من صاحب الصوت، مع إمكانية السحب والحذف المؤكد.",
        },
        {
          q: "الوكيل يسكت إذا قاطعه العميل؟",
          a: "وكيل صوت نجدي يسكت على طول إذا قاطعه العميل بنص الجملة ويسمع له — مثل أي موظف. ولما يعطي العميل رقم حجز أو كود، يقرأه رقم رقم بالعربي عشان العميل يقدر يكتبه بدون ما يطلب الإعادة.",
        },
        {
          q: "يتذكر العميل إذا اتصل مرة ثانية؟",
          a: "صوت نجدي يحتفظ بذاكرة عبر المكالمات لكل منشأة: العميل الراجع يُحيّى باسمه، وتفضيلاته وحجوزاته السابقة تكون حاضرة قدام الوكيل — وقدام موظفك بعد لو استلم المكالمة.",
        },
      ],
    },
    {
      id: "handoff",
      group: "التصعيد وموظفك",
      items: [
        {
          q: "متى تروح المكالمة لموظف بشري؟",
          a: "المكالمة في صوت نجدي تروح لموظفك فوراً إذا طلب العميل إنسان، أو إذا كان منزعج، أو إذا تكرر سؤال ما انحل — وقواعد التصعيد أنت اللي تحددها. وموظفك يستلم ومعه النص الكامل والملخص وتاريخ العميل.",
        },
        {
          q: "أقدر أسمع المكالمات وأقرا نصوصها؟",
          a: "في لوحة تحكم صوت نجدي تلقى كل مكالمة: تسمع التسجيل، وتقرا النص كاملاً، وتشوف الملخص وتاريخ العميل — وتقدر تتابع المكالمات الحية وتستلمها بنفسك.",
        },
        {
          q: "هل الوكيل الصوتي يعوّض عن توطين مهن خدمة العملاء؟",
          a: "صوت نجدي ما يعوّض عن أي التزام نظامي بتوطين مهن خدمة العملاء — مرجع متطلبات التوطين هو وزارة الموارد البشرية والتنمية الاجتماعية، مو نحن. اللي يسويه صوت نجدي إنه يرد على المكالمات الروتينية المتكررة ويخلي فريقك متفرغ للمكالمات اللي تحتاج إنسان — والموظف اللي يستلم موظفك أنت، والقواعد قواعدك.",
        },
      ],
    },
    {
      id: "channels",
      group: "القنوات والحدود",
      items: [
        {
          q: "يشتغل على واتساب والرسائل؟",
          a: "صوت نجدي مو بس مكالمات — يغطي القنوات النصية بعد: واتساب وتيليجرام ودردشة موقعك، كلها تجتمع في صندوق واحد لفريقك، وموظفك يقدر يدخل على أي محادثة بأي لحظة.",
        },
        {
          q: "أقدر أجمع المكالمات والواتساب والتيليجرام في مكان واحد؟",
          a: "صوت نجدي يجمع المكالمات وواتساب وتيليجرام ودردشة موقعك في صندوق وارد واحد لفريقك، فالموظف يشوف كل محادثات العميل في مكان واحد بدل ما يتنقل بين أربعة تطبيقات — ويقدر يدخل على أي محادثة بأي لحظة.",
        },
        {
          q: "من وين يجيب الوكيل الإجابات؟",
          a: "وكيل صوت نجدي يجيب إجاباته من قاعدة معرفة تبنيها أنت من ملفات نشاطك — PDF وWord حتى الممسوح ضوئياً — ومن أسعارك وأوقاتك وسياساتك، فيطلع نفس الجواب الصحيح لكل عميل.",
        },
        {
          q: "تسوون مكالمات صادرة أو حملات اتصال؟",
          a: "صوت نجدي اليوم للمكالمات الواردة فقط — ما فيه اتصال صادر ولا حملات اتصال آلية، ونقولها بصراحة بدل ما نلمّح لها. اللي يصير برا الدوام إن الوكيل يسجل طلب اتصال بتفاصيله ووقت العميل المفضل، ويرجع له فريقك أنت.",
        },
      ],
    },
    {
      id: "data",
      group: "البيانات والامتثال",
      items: [
        {
          q: "وين تنحفظ بيانات مكالماتي؟",
          a: "بياناتك في صوت نجدي تنحفظ في منطقة الخليج (الدوحة) على Google Cloud، والتسجيلات تنحذف تلقائياً بعد 90 يوماً، مع إفصاح كامل عن أماكن معالجة الصوت والذكاء الاصطناعي في سياسة الخصوصية.",
        },
        {
          q: "متوافقين مع نظام حماية البيانات الشخصية (PDPL)؟",
          a: "صوت نجدي مصمّم بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL) — بياناتك مخزّنة في منطقة الخليج، مع إفصاح كامل عن أماكن المعالجة. ويدعم ذلك سجل تدقيق غير قابل للتعديل وصلاحيات محددة لكل موظف.",
        },
      ],
    },
    {
      id: "pricing",
      group: "الأسعار والبداية",
      items: [
        {
          q: "كم تكلفة الوكيل الصوتي في السعودية؟",
          a: "أسعار صوت نجدي على قد حجم مكالماتك وقنواتك — ما نعلن جدول أسعار عام لأنه ما ينطبق على الكل بإنصاف؛ بعد العرض التعريفي نقيّم نشاطك ونرسل لك عرض سعر مكتوب وواضح.",
        },
        {
          q: "كيف أبدأ؟",
          a: "تبدأ مع صوت نجدي بحجز عرض تعريفي — فريقنا يجهز لك كل شي: الوكيل، وقاعدة المعرفة، وقواعد التصعيد، وما في تسجيل ذاتي.",
        },
        {
          q: "التجهيز كم ياخذ وقت؟",
          a: "تجهيز صوت نجدي يمر بخطوات واضحة: نبني وكيلك، نغذي قاعدة معرفتك، تجربه بنفسك، وبعدها نرتب معك تفعيل الرقم — وفريقنا معك في كل خطوة، ونعطيك الجدول الزمني بالتفصيل في العرض.",
        },
        {
          q: "عندكم رقم سعودي أتصل عليه وأجرب؟",
          a: "صوت نجدي ما ينشر رقماً سعودياً للتجربة اليوم، لأن تفعيل الأرقام يمر بإجراءات الجهات التنظيمية للاتصالات وما نعطي وعداً بتاريخ ما نتحكم فيه. التجربة تصير في العرض التعريفي: نشغّل الوكيل حي، تسمعه بلهجتك، وتسأله اللي تبغى.",
        },
      ],
    },
  ],
  en: [
    {
      id: "basics",
      group: "The basics",
      items: [
        {
          q: "What is Saut Najdi?",
          a: "Saut Najdi is a Saudi AI voice agent that answers your customers' calls in the dialect they understand, acts on what they need — books, answers, records — and hands the call to your human employee with full context whenever a human should take it.",
        },
        {
          q: "What's the difference between an IVR and an AI voice agent?",
          a: "Saut Najdi is a voice agent that talks to your customer in ordinary language rather than a “press 1” menu: the caller simply says what they want, the agent works out the intent and books it there and then, and the caller can interrupt mid-sentence the way they would with a person — where a traditional IVR gives fixed options the caller has to navigate.",
        },
        {
          q: "Does it fit my business?",
          a: "Saut Najdi ships ready-made templates for clinics and hospitals, restaurants, hotels, real estate and retail — and if your business is something else, we configure your agent around how you work.",
        },
      ],
    },
    {
      id: "voice",
      group: "Dialect & voice",
      items: [
        {
          q: "Does it really understand Saudi dialects?",
          a: "Saut Najdi is built on Saudi dialects from the ground up: it hears everyday Saudi phrasing correctly and answers in male and female voices across Najdi, Hijazi and Khaleeji — plus standard Arabic and English.",
        },
        {
          q: "Are the voices male or female — and can I use my brand's voice?",
          a: "Saut Najdi ships male and female voices across three Saudi dialects — Najdi, Hijazi and Khaleeji — plus standard Arabic and English. You can also clone your brand's voice from a short sample, with a consent attestation from the voice owner, revocation, and verified deletion.",
        },
        {
          q: "Can the caller interrupt the agent?",
          a: "The Saut Najdi agent stops instantly and listens when a caller talks over it mid-sentence, exactly as a person would. And when it reads out a booking code, it reads it digit by digit so the caller can write it down without asking for a repeat.",
        },
        {
          q: "Does it remember a caller who rings again?",
          a: "Saut Najdi keeps cross-call memory per business: a returning caller is greeted by name, and their previous bookings and preferences are in front of the agent — and in front of your employee if the call is handed over.",
        },
      ],
    },
    {
      id: "handoff",
      group: "Handoff & your team",
      items: [
        {
          q: "When does a call go to a human?",
          a: "A Saut Najdi call goes to your employee immediately when the customer asks for a human, sounds upset, or repeats a question that isn't getting resolved — and you set the escalation rules. Your employee takes over with the full transcript, a summary, and the customer's history.",
        },
        {
          q: "Can I listen to calls and read their transcripts?",
          a: "In the Saut Najdi dashboard you'll find every call: play the recording, read the full transcript, see the summary and the customer's history — and you can watch live calls and take one over yourself.",
        },
        {
          q: "Does an AI voice agent satisfy Saudization requirements for customer-service roles?",
          a: "Saut Najdi does not replace any legal Saudization obligation for customer-service occupations — the authority on those requirements is the Ministry of Human Resources and Social Development, not us. What Saut Najdi does is absorb the repetitive routine calls so your own team is free for the conversations that need a person; the employee who takes over is your employee, under your rules.",
        },
      ],
    },
    {
      id: "channels",
      group: "Channels & limits",
      items: [
        {
          q: "Does it work on WhatsApp and messages?",
          a: "Saut Najdi covers text channels alongside calls: WhatsApp, Telegram and your website chat — all landing in one inbox for your team, where an employee can step into any conversation at any moment.",
        },
        {
          q: "Can I bring calls, WhatsApp and Telegram into one place?",
          a: "Saut Najdi brings calls, WhatsApp, Telegram and your website chat into a single team inbox, so an employee sees all of a customer's conversations in one place instead of switching between four apps — and can step into any of them at any moment.",
        },
        {
          q: "Where does the agent get its answers?",
          a: "The Saut Najdi agent answers from a knowledge base you build out of your own files — PDF and Word, even scans — plus your prices, hours and policies, so every customer gets the same correct answer.",
        },
        {
          q: "Do you do outbound calls or calling campaigns?",
          a: "Saut Najdi is inbound-only today — there is no outbound dialling and no automated calling campaigns, and we'd rather say so plainly than imply otherwise. What happens outside your hours is that the agent logs a callback request with the details and the caller's preferred time, and your team calls back.",
        },
      ],
    },
    {
      id: "data",
      group: "Data & compliance",
      items: [
        {
          q: "Where is my call data stored?",
          a: "Saut Najdi stores your data in the Gulf region (Doha) on Google Cloud, call recordings are automatically deleted after 90 days, and the privacy policy fully discloses where speech and AI processing happen.",
        },
        {
          q: "Are you compliant with the Saudi PDPL?",
          a: "Saut Najdi is designed to comply with Saudi Arabia's Personal Data Protection Law (PDPL) — your data stored in the Gulf region with full disclosure of where processing happens, an append-only audit log, and defined roles for every employee.",
        },
      ],
    },
    {
      id: "pricing",
      group: "Pricing & getting started",
      items: [
        {
          q: "How much does an AI voice agent cost in Saudi Arabia?",
          a: "Saut Najdi pricing scales with your call volume and channels — we don't publish a single public price list because it can't fairly fit everyone; after the intro demo we assess your business and send a written, itemised offer.",
        },
        {
          q: "How do I start?",
          a: "You start with Saut Najdi by booking an intro demo — our team sets everything up for you: the agent, the knowledge base, and the escalation rules. There is no self-signup.",
        },
        {
          q: "How long does setup take?",
          a: "Saut Najdi setup follows clear steps: we build your agent, load your knowledge base, you test it yourself, then we work with you on taking the number live — our team is with you at every step, and we give you the detailed timeline in the demo.",
        },
        {
          q: "Is there a Saudi number I can call to try it?",
          a: "Saut Najdi doesn't publish a Saudi trial number today, because number activation runs through Saudi telecom regulatory steps and we won't promise a date we don't control. The trial happens in the intro demo instead: we run the agent live, you hear it in your dialect, and you ask it whatever you want.",
        },
      ],
    },
  ],
};

/** Flat list for FAQPage JSON-LD and any consumer that wants all 20. */
export const fullFaq: Record<Locale, FaqItem[]> = {
  ar: faqGroups.ar.flatMap((g) => g.items),
  en: faqGroups.en.flatMap((g) => g.items),
};

/**
 * The six questions the homepage shows (blueprint §6.1 row 9). Selected
 * by question text, not by index: the list is grouped now, so a slice
 * like [0,1,2,4,7,8] would silently reshuffle the homepage the moment
 * anyone adds a question to an earlier group. A missing key throws at
 * build time rather than rendering an undefined card.
 */
const homeKeys: Record<Locale, readonly string[]> = {
  ar: [
    "وش هو صوت نجدي؟",
    "يفهم اللهجة السعودية فعلاً؟",
    "متى تروح المكالمة لموظف بشري؟",
    "وين تنحفظ بيانات مكالماتي؟",
    "كم تكلفة الوكيل الصوتي في السعودية؟",
    "كيف أبدأ؟",
  ],
  en: [
    "What is Saut Najdi?",
    "Does it really understand Saudi dialects?",
    "When does a call go to a human?",
    "Where is my call data stored?",
    "How much does an AI voice agent cost in Saudi Arabia?",
    "How do I start?",
  ],
};

function selectFaq(locale: Locale): FaqItem[] {
  return homeKeys[locale].map((q) => {
    const item = fullFaq[locale].find((i) => i.q === q);
    if (!item) throw new Error(`homeFaq: no ${locale} FAQ entry matching "${q}"`);
    return item;
  });
}

export const homeFaq: Record<Locale, FaqItem[]> = {
  ar: selectFaq("ar"),
  en: selectFaq("en"),
};
