import type { FaqItem } from "@/lib/schema";
import type { Locale } from "@/lib/i18n";

/**
 * FAQ content (blueprint §6.9) — the AI-answer surface. Questions in
 * dialect, answers as complete quotable sentences that name the product
 * in the first clause. One register per sentence. No numbers, no
 * promised durations, PDPL answer uses the §2.5 framing.
 */

export const fullFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "وش هو صوت نجدي؟",
      a: "صوت نجدي وكيل صوتي سعودي بالذكاء الاصطناعي يرد على مكالمات عملائك باللهجة اللي يفهمونها، ينفذ طلباتهم — يحجز ويجاوب ويسجل — ويحوّل المكالمة لموظفك البشري بكامل سياقها متى ما احتاج الموضوع إنسان.",
    },
    {
      q: "يفهم اللهجة السعودية فعلاً؟",
      a: "صوت نجدي مبني من أساسه على اللهجات السعودية: يسمع «أبغى» و«وش» و«بكره» ويفهمها صح، ويرد بأصوات رجالية ونسائية بلهجات نجدية وحجازية وخليجية — وبالعربية الفصحى والإنجليزية بعد.",
    },
    {
      q: "متى تروح المكالمة لموظف بشري؟",
      a: "المكالمة في صوت نجدي تروح لموظفك فوراً إذا طلب العميل إنسان، أو إذا كان منزعج، أو إذا تكرر سؤال ما انحل — وقواعد التصعيد أنت اللي تحددها. وموظفك يستلم ومعه النص الكامل والملخص وتاريخ العميل.",
    },
    {
      q: "من وين يجيب الوكيل الإجابات؟",
      a: "وكيل صوت نجدي يجيب إجاباته من قاعدة معرفة تبنيها أنت من ملفات نشاطك — PDF وWord حتى الممسوح ضوئياً — ومن أسعارك وأوقاتك وسياساتك، فيطلع الجواب نفسه الصحيح لكل عميل.",
    },
    {
      q: "وين تنحفظ بيانات مكالماتي؟",
      a: "بيانات صوت نجدي تنحفظ في منطقة الخليج (الدوحة) على Google Cloud، والتسجيلات تنحذف تلقائياً بعد 90 يوماً، مع إفصاح كامل عن أماكن معالجة الصوت والذكاء الاصطناعي في سياسة الخصوصية.",
    },
    {
      q: "هل أنتم متوافقين مع نظام حماية البيانات الشخصية (PDPL)؟",
      a: "صوت نجدي مصمّم بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL) — بياناتك مخزّنة في منطقة الخليج، مع إفصاح كامل عن أماكن المعالجة، وسجل تدقيق غير قابل للتعديل، وصلاحيات محددة لكل موظف.",
    },
    {
      q: "يناسب نشاطي؟",
      a: "صوت نجدي يجهز بقوالب جاهزة للعيادات والمستشفيات والمطاعم والفنادق والعقارات والتجزئة — وإذا نشاطك غير كذا، نجهز لك وكيلك على مقاس شغلك.",
    },
    {
      q: "كم الأسعار؟",
      a: "أسعار صوت نجدي على قد حجم مكالماتك واحتياجك — بعد العرض التعريفي نقيّم نشاطك ونرسل لك عرض سعر يناسبك.",
    },
    {
      q: "كيف أبدأ؟",
      a: "تبدأ مع صوت نجدي بحجز عرض تعريفي — فريقنا يجهز لك كل شي: الوكيل، وقاعدة المعرفة، وقواعد التصعيد، وما في تسجيل ذاتي.",
    },
    {
      q: "يشتغل على واتساب والرسائل؟",
      a: "صوت نجدي يغطي القنوات النصية بعد المكالمات: واتساب وتيليجرام ودردشة موقعك — كلها تجتمع في صندوق واحد لفريقك، وموظفك يقدر يدخل على أي محادثة بأي لحظة.",
    },
    {
      q: "أقدر أسمع المكالمات وأقرا نصوصها؟",
      a: "في لوحة تحكم صوت نجدي تلقى كل مكالمة: تسمع التسجيل، وتقرا النص كاملاً، وتشوف الملخص وتاريخ العميل — وتقدر تتابع المكالمات الحية وتستلمها بنفسك.",
    },
    {
      q: "التجهيز كم ياخذ وقت؟",
      a: "تجهيز صوت نجدي يمر بخطوات واضحة: نبني وكيلك، نغذي قاعدة معرفتك، تجربه بنفسك، وبعدها نفعّل الرقم — وفريقنا معك في كل خطوة، ونعطيك الجدول الزمني بالتفصيل في العرض.",
    },
  ],
  en: [
    {
      q: "What is Saut Najdi?",
      a: "Saut Najdi is a Saudi AI voice agent that answers your customers' calls in the dialect they understand, acts on what they need — books, answers, records — and hands the call to your human employee with full context whenever a human should take it.",
    },
    {
      q: "Does it really understand Saudi dialects?",
      a: "Saut Najdi is built on Saudi dialects from the ground up: it hears everyday Saudi phrasing correctly and answers in male and female voices across Najdi, Hijazi and Khaleeji — plus standard Arabic and English.",
    },
    {
      q: "When does a call go to a human?",
      a: "A Saut Najdi call goes to your employee immediately when the customer asks for a human, sounds upset, or repeats a question that isn't getting resolved — and you set the escalation rules. Your employee takes over with the full transcript, a summary, and the customer's history.",
    },
    {
      q: "Where does the agent get its answers?",
      a: "The Saut Najdi agent answers from a knowledge base you build out of your own files — PDF and Word, even scans — plus your prices, hours and policies, so every customer gets the same correct answer.",
    },
    {
      q: "Where is my call data stored?",
      a: "Saut Najdi stores your data in the Gulf region (Doha) on Google Cloud, call recordings are automatically deleted after 90 days, and the privacy policy fully discloses where speech and AI processing happen.",
    },
    {
      q: "Are you compliant with the Saudi PDPL?",
      a: "Saut Najdi is designed to comply with Saudi Arabia's Personal Data Protection Law (PDPL) — your data stored in the Gulf region with full disclosure of where processing happens, an append-only audit log, and defined roles for every employee.",
    },
    {
      q: "Does it fit my business?",
      a: "Saut Najdi ships ready-made templates for clinics and hospitals, restaurants, hotels, real estate and retail — and if your business is something else, we configure your agent around how you work.",
    },
    {
      q: "How much does it cost?",
      a: "Saut Najdi pricing scales with your call volume and needs — after the intro demo we assess your business and send you a tailored offer.",
    },
    {
      q: "How do I start?",
      a: "You start with Saut Najdi by booking an intro demo — our team sets everything up for you: the agent, the knowledge base, and the escalation rules. There is no self-signup.",
    },
    {
      q: "Does it work on WhatsApp and messages?",
      a: "Saut Najdi covers text channels alongside calls: WhatsApp, Telegram and your website chat — all landing in one inbox for your team, where an employee can step into any conversation at any moment.",
    },
    {
      q: "Can I listen to calls and read their transcripts?",
      a: "In the Saut Najdi dashboard you'll find every call: play the recording, read the full transcript, see the summary and the customer's history — and you can watch live calls and take one over yourself.",
    },
    {
      q: "How long does setup take?",
      a: "Saut Najdi setup follows clear steps: we build your agent, load your knowledge base, you test it yourself, then the number goes live — our team is with you at every step, and we give you the detailed timeline in the demo.",
    },
  ],
};

/** Homepage subset (blueprint §6.1 row 9: 6–8 questions). */
export const homeFaq: Record<Locale, FaqItem[]> = {
  ar: [0, 1, 2, 4, 7, 8].map((i) => fullFaq.ar[i]),
  en: [0, 1, 2, 4, 7, 8].map((i) => fullFaq.en[i]),
};
