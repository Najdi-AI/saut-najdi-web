import type { Locale } from "@/lib/i18n";

/**
 * Hand-written per-page titles (≤60 chars **including the template suffix**)
 * and descriptions (≤155) — blueprint §8.2: never auto-generated, never
 * identical, per language.
 *
 * Titles here are RAW: the root layout appends « — صوت نجدي» (11) / " — Saut
 * Najdi" (13), so the brand is never repeated by hand. `home` is the one
 * absolute title (the template is suppressed for it) and therefore carries the
 * brand itself.
 *
 * Register (blueprint §3): natural spoken Saudi everywhere — يشتغل، وش، وين،
 * تنحفظ — because that is how the query is actually typed. The four legal /
 * security pages (security, privacy, terms, dpa) are the deliberate exception
 * and stay precise فصحى.
 */
export const meta: Record<
  Locale,
  Record<string, { title: string; description: string }>
> = {
  ar: {
    home: {
      title: "وكيل صوتي بالذكاء الاصطناعي يرد بلهجة عملائك — صوت نجدي",
      description:
        "صوت نجدي وكيل صوتي سعودي يرد على مكالمات عملائك بلهجتهم — نجدي وحجازي وخليجي — يحجز وينفذ، وموظفك يستلم المكالمة بكامل سياقها متى ما احتاجت إنسان.",
    },
    "how-it-works": {
      title: "كيف يشتغل الرد الآلي بالذكاء الاصطناعي؟",
      description:
        "من أول رنة إلى آخر سطر في السجل: كيف يرد وكيل صوت نجدي بلهجة عميلك، ويفهم قصده، وينفذ طلبه، ومتى يحوّل المكالمة لموظفك بكامل سياقها.",
    },
    "product/human-handoff": {
      title: "متى تتحول المكالمة لموظف بشري؟ التصعيد بالسياق",
      description:
        "التصعيد في صوت نجدي: متى تروح المكالمة لموظفك، ووش يستلم معها — النص الكامل والملخص وتاريخ العميل — وكيف يسمع فريقك المكالمات الحية ويستلمها.",
    },
    security: {
      title: "الأمان والبيانات والتوافق مع نظام PDPL السعودي",
      description:
        "أين تُخزَّن بيانات مكالماتك وأين تُعالَج بالضبط: تخزين في منطقة الخليج (الدوحة)، إفصاح كامل عن أماكن المعالجة، وحذف تلقائي للتسجيلات بعد 90 يوماً.",
    },
    demo: {
      title: "احجز عرضاً تعريفياً مدته 30 دقيقة وعرض سعر",
      description:
        "احجز عرض صوت نجدي التعريفي — 30 دقيقة تشوف فيها المنصة حية وتسمع الوكيل بلهجتك، ونقيّم حجم مكالماتك ونعطيك عرض سعر واضح يناسب نشاطك.",
    },
    "demo/thank-you": {
      title: "تم حجز عرضك",
      description: "تأكيد حجز العرض التعريفي مع صوت نجدي.",
    },
    contact: {
      title: "تواصل معنا أو احجز مكالمة سريعة 15 دقيقة",
      description:
        "كلّم فريق صوت نجدي: راسلنا على الإيميل أو احجز مكالمة 15 دقيقة. ما في تسجيل ذاتي — فريقنا يجهز لك الوكيل وقاعدة المعرفة وقواعد التصعيد.",
    },
    about: {
      title: "من نحن — فريق سعودي بنى وكيلاً يفهم عميلك",
      description:
        "صوت نجدي منتج من Najdi AI — فريق سعودي في الرياض بنى وكيلاً صوتياً على اللهجات السعودية، وهجيناً بالتصميم: الذكاء يرد، وموظفك موجود دايماً.",
    },
    faq: {
      title: "أسئلة شائعة عن الوكيل الصوتي بالذكاء الاصطناعي",
      description:
        "إجابات صريحة: وش هو صوت نجدي، كيف يفهم اللهجة السعودية، متى يحوّل المكالمة لموظف، وين تنحفظ البيانات، PDPL، كم الأسعار، وكيف تبدأ.",
    },
    privacy: {
      title: "سياسة الخصوصية",
      description:
        "كيف نجمع البيانات ونعالجها ونخزنها بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL) — بإفصاح كامل عن المعالجين ومدد الاحتفاظ.",
    },
    terms: {
      title: "شروط الخدمة",
      description:
        "الشروط التي تحكم استخدام موقع صوت نجدي وخدماته وحجوزات العروض التعريفية: نطاق الخدمة، ومسؤوليات الطرفين، والملكية الفكرية، وحدود المسؤولية.",
    },
    dpa: {
      title: "اتفاقية معالجة البيانات (DPA)",
      description:
        "ملخص اتفاقية معالجة البيانات بين صوت نجدي والمنشأة: الأدوار، والتزامات المعالجة، والمعالجون من الباطن، والتدابير التقنية والتنظيمية.",
    },
  },
  en: {
    home: {
      title: "Arabic AI voice agent for Saudi businesses — Saut Najdi",
      description:
        "A Saudi AI voice agent answering calls in Najdi, Hijazi and Khaleeji Arabic or English — with your employee able to take over any call in full context.",
    },
    "how-it-works": {
      title: "How AI call answering works, step by step",
      description:
        "From first ring to final log entry: how the Saut Najdi agent answers in your customer's dialect, understands, acts, and hands the call to your team.",
    },
    "product/human-handoff": {
      title: "When does an AI call go to a human agent?",
      description:
        "Saut Najdi escalation: when a call reaches your employee, what they inherit — transcript, summary, customer history — plus live listen, whisper, take-over.",
    },
    security: {
      title: "Security, data residency and PDPL alignment",
      description:
        "Where Saut Najdi stores and processes your data: Gulf-region storage (Doha), full processing disclosure, an append-only audit log, 90-day recording deletion.",
    },
    demo: {
      title: "Book a 30-minute intro demo and get a quote",
      description:
        "Book the Saut Najdi intro demo: 30 minutes, the platform live, the agent in your dialect, your PDPL questions answered, and a clear tailored offer.",
    },
    "demo/thank-you": {
      title: "Demo booked",
      description: "Your Saut Najdi intro demo is confirmed.",
    },
    contact: {
      title: "Contact us or book a 15-minute call",
      description:
        "Reach the Saut Najdi team by email or book a 15-minute call. There's no self-signup — we set up the agent, knowledge base and escalation rules for you.",
    },
    about: {
      title: "About us — the Saudi team behind the agent",
      description:
        "Saut Najdi is a product of Najdi AI — a Saudi team in Riyadh that built a voice agent on Saudi dialects, hybrid by design: AI answers, your employee is there.",
    },
    faq: {
      title: "AI voice agent FAQ for Saudi businesses",
      description:
        "Straight answers: what Saut Najdi is, how it handles Saudi dialects, when calls go to a human, where data is stored, PDPL, pricing, and how to start.",
    },
    privacy: {
      title: "Privacy policy",
      description:
        "How we collect, process and store data in line with Saudi Arabia's PDPL — with full disclosure of processors and retention periods.",
    },
    terms: {
      title: "Terms of service",
      description:
        "The terms governing use of the Saut Najdi website, its services and demo bookings: scope, responsibilities of both parties, IP, and limits of liability.",
    },
    dpa: {
      title: "Data processing agreement (DPA)",
      description:
        "A summary of the DPA between Saut Najdi and your organisation: roles, processing commitments, sub-processors, and technical and organisational measures.",
    },
  },
};
