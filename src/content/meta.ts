import type { Locale } from "@/lib/i18n";

/**
 * Hand-written per-page titles (≤60 chars) and descriptions (≤155) —
 * blueprint §8.2: never auto-generated, never identical, per language.
 */
export const meta: Record<
  Locale,
  Record<string, { title: string; description: string }>
> = {
  ar: {
    home: {
      title: "صوت نجدي — وكيل صوتي بالذكاء الاصطناعي يرد بلهجة عملائك",
      description:
        "وكيل صوتي سعودي يرد على مكالمات عملائك بلهجتهم — نجدي، حجازي، خليجي — يحجز وينفذ، وموظفك يستلم المكالمة بكامل سياقها متى ما احتاج الموضوع. احجز عرضاً.",
    },
    "how-it-works": {
      title: "كيف يشتغل صوت نجدي؟ رحلة المكالمة خطوة بخطوة",
      description:
        "من أول رنة إلى آخر سطر في السجل: كيف يرد الوكيل الصوتي بلهجة عميلك ويفهم قصده وينفذ طلبه، ومتى يحوّل المكالمة لموظفك بكامل سياقها.",
    },
    "product/human-handoff": {
      title: "التصعيد للموظف البشري — صوت نجدي",
      description:
        "متى تتحول المكالمة لإنسان؟ ووش يشوف موظفك لما يستلم؟ استماع وهمس واستلام مباشر للمكالمات الحية، وسياق كامل ينتقل مع كل تصعيد.",
    },
    security: {
      title: "الأمان والبيانات — التوافق مع PDPL | صوت نجدي",
      description:
        "أين تُخزَّن بياناتك وأين تُعالَج: تخزين في منطقة الخليج، إفصاح كامل عن أماكن المعالجة، سجل تدقيق غير قابل للتعديل، وحذف تلقائي للتسجيلات بعد 90 يوماً.",
    },
    demo: {
      title: "احجز عرضاً تعريفياً — صوت نجدي",
      description:
        "عرض 30 دقيقة تشوف فيه المنصة حية وتسمع الوكيل بلهجتك، ونقيّم فيه احتياجك ونعطيك عرض سعر يناسب نشاطك. احجز وقتك مباشرة من التقويم.",
    },
    "demo/thank-you": {
      title: "تم الحجز — صوت نجدي",
      description: "تأكيد حجز العرض التعريفي مع صوت نجدي.",
    },
    contact: {
      title: "تواصل معنا — صوت نجدي",
      description:
        "راسلنا على الإيميل أو احجز مكالمة سريعة 15 دقيقة مع الفريق. ما في تسجيل ذاتي — فريقنا يجهز لك كل شي من الوكيل إلى قاعدة المعرفة.",
    },
    about: {
      title: "من نحن — ليه سوّينا صوت نجدي؟",
      description:
        "فريق سعودي في الرياض بنى وكيلاً صوتياً يفهم العميل السعودي من أول كلمة — هجين: الذكاء يرد على الروتيني، وموظفك دايم موجود للحظات المهمة.",
    },
    faq: {
      title: "الأسئلة الشائعة — صوت نجدي",
      description:
        "إجابات واضحة وصريحة: وش هو صوت نجدي، كيف يفهم اللهجة، متى يحوّل المكالمة لموظف، وين تنحفظ البيانات، وكم الأسعار، وكيف تبدأ.",
    },
    privacy: {
      title: "سياسة الخصوصية — صوت نجدي",
      description:
        "كيف نجمع البيانات ونعالجها ونخزنها بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL) — بإفصاح كامل عن المعالجين ومدد الاحتفاظ.",
    },
    terms: {
      title: "شروط الخدمة — صوت نجدي",
      description: "الشروط التي تحكم استخدام موقع صوت نجدي وخدماته وحجوزات العروض.",
    },
    dpa: {
      title: "اتفاقية معالجة البيانات — صوت نجدي",
      description:
        "ملخص اتفاقية معالجة البيانات: الأدوار، والتزامات المعالجة، والتدابير التقنية والتنظيمية — والنسخة الكاملة تُوقَّع ضمن التعاقد.",
    },
  },
  en: {
    home: {
      title: "Saut Najdi — an AI voice agent in your customers' dialect",
      description:
        "A Saudi AI voice agent that answers customers in their dialect — Najdi, Hijazi, Khaleeji — with your team taking over any call with full context. Book a demo.",
    },
    "how-it-works": {
      title: "How Saut Najdi works — one call, step by step",
      description:
        "From first ring to final log: how the agent answers in your customer's dialect, understands, acts, and hands calls to your team with full context.",
    },
    "product/human-handoff": {
      title: "Human handoff — Saut Najdi",
      description:
        "When calls go to a human, what your employee inherits, and live listen, whisper and take-over on live calls — full context on every escalation.",
    },
    security: {
      title: "Security & data — PDPL alignment | Saut Najdi",
      description:
        "Where your data is stored and processed: Gulf-region storage, full processing disclosure, an append-only audit log, 90-day recording deletion.",
    },
    demo: {
      title: "Book an intro demo — Saut Najdi",
      description:
        "A 30-minute live demo: hear the agent in your dialect and get a clear tailored offer. Pick your slot straight from the calendar.",
    },
    "demo/thank-you": {
      title: "Booked — Saut Najdi",
      description: "Your Saut Najdi intro demo is confirmed.",
    },
    contact: {
      title: "Contact us — Saut Najdi",
      description:
        "Email us or book a quick 15-minute call with the team. There's no self-signup — our team sets everything up for you, from the agent to the knowledge base.",
    },
    about: {
      title: "About us — why we built Saut Najdi",
      description:
        "A Saudi team in Riyadh building a voice agent that understands Saudi customers from the first word — AI answers, your employee is always there.",
    },
    faq: {
      title: "FAQ — Saut Najdi",
      description:
        "Clear, straight answers: what Saut Najdi is, how it understands dialects, when calls go to a human, where data lives, pricing, and how to start.",
    },
    privacy: {
      title: "Privacy policy — Saut Najdi",
      description:
        "How we collect, process and store data in line with Saudi Arabia's PDPL — with full disclosure of processors and retention periods.",
    },
    terms: {
      title: "Terms of service — Saut Najdi",
      description: "The terms governing use of the Saut Najdi website, services and demo bookings.",
    },
    dpa: {
      title: "Data processing agreement — Saut Najdi",
      description:
        "A summary of the DPA: roles, processing commitments, and technical and organisational measures — the full version is signed during contracting.",
    },
  },
};
