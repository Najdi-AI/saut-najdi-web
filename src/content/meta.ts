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
    // Wave 2 — product deep dives (spec P2-22, titles from its table).
    // Re-angled toward the mechanism: the AR home page owns «يرد بلهجة عملائك»
    // in its title, H1 and description (and sitemap priority 1.0), so this page
    // targets «كيف يفهم … اللهجة السعودية» instead of competing for it.
    "product/voice-agent": {
      title: "كيف يفهم الوكيل الصوتي اللهجة السعودية؟",
      description:
        "كيف يفهم الوكيل الصوتي اللهجة السعودية ويتعامل معها: نجدي وحجازي وخليجي، يسكت إذا قاطعته، يقرأ رقم الحجز رقم رقم، وينفذ الطلب. مكالمات داخلة فقط.",
    },
    // Blueprint §10.8: knowledge-base grounding is NOT shipped on live phone
    // calls (production inbound voice runs through the orchestrator, which has
    // no KB). Describe the KB only as: built from your files, feeds your agent,
    // verified by you in the test chat. Never assert the call case.
    "product/knowledge-base": {
      title: "قاعدة المعرفة العربية من ملفاتك",
      description:
        "ارفع ملفاتك — PDF و Word حتى الممسوحة ضوئياً بتعرّف عربي صحيح — تصير قاعدة معرفة تغذّي وكيلك، وتتأكد من إجاباته بنفسك في الشات التجريبي قبل النشر.",
    },
    "product/dashboard": {
      title: "لوحة التحكم — سجل المكالمات والملخصات",
      description:
        "كل مكالمة قدامك: تسجيل ونص وملخص عربي ومزاج المكالمة وتقييم، وتاريخ العميل، وتقويم الحجوزات، ومتابعة حية تستلم فيها المكالمة، وسجل تدقيق.",
    },
    "product/agent-builder": {
      title: "بناء الوكيل بدون كود",
      description:
        "سوّ وكيلك بنفسك: قالب جاهز لقطاعك، تحكم بالشخصية والصوت، وصف باللهجة النجدية يكتبه لك، شات تجريبي وسيناريوهات، ونشر مع سجل نسخ ومقارنة.",
    },
    // Wave 2 — sector pages. These carry the long-tail: the query is typed by
    // sector («رد آلي مطاعم»), never by product name.
    "solutions/clinics": {
      title: "الرد الآلي على مكالمات العيادات والمستشفيات",
      description:
        "وكيل صوتي يرد على مكالمات عيادتك بلهجة مريضك: يحجز المواعيد ويأجلها، ويجاوب عن الأسعار والدوام وجدول الأطباء — وأي سؤال طبي يروح لموظفك على طول.",
    },
    "solutions/restaurants": {
      title: "رد آلي على مكالمات المطاعم والحجوزات",
      description:
        "وكيل صوتي يرد على مكالمات مطعمك حتى وقت الذروة: يحجز الطاولات ويعدل الحجوزات، ويجاوب عن القائمة والدوام والمواقف — والشكاوى تروح لموظفك فوراً.",
    },
    "solutions/hotels": {
      title: "رد آلي على مكالمات الفنادق والحجوزات",
      description:
        "وكيل صوتي يرد على مكالمات فندقك 24 ساعة بلهجة نزيلك: يشوف الغرف المتاحة ويثبت الحجز، ويجاوب على الأسعار وسياسة الإلغاء وأوقات الدخول والخروج.",
    },
    "solutions/real-estate": {
      title: "رد آلي على مكالمات المكاتب العقارية",
      description:
        "وكيل صوتي يرد على مستفسري إعلاناتك: الوحدة متاحة ولا لا، السعر والشروط، ويحجز معاينة — مكالمات داخلة فقط، بدون أي اتصال صادر.",
    },
    "solutions/retail": {
      title: "رد آلي على استفسارات متجرك",
      description:
        "وكيل صوتي يرد على مكالمات متجرك بلهجة عميلك: سياسة الإرجاع والشحن وأوقات الفروع والعروض، ويسجل استفسار حالة الطلب كامل لفريقك.",
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
    // Wave 2 — product deep dives (spec P2-22, titles from its table).
    "product/voice-agent": {
      title: "The voice agent — your customers' dialect",
      description:
        "How the Saut Najdi voice agent works on a real call: Saudi dialect understanding, instant barge-in, digit-by-digit codes, voices, cloning with consent.",
    },
    // See the AR note above: no live-call KB claim (blueprint §10.8 gate).
    "product/knowledge-base": {
      title: "Arabic knowledge base from your files",
      description:
        "Upload PDFs and Word files, including scans read by true Arabic OCR. They become the knowledge base behind your agent — verify answers in the test chat.",
    },
    "product/dashboard": {
      title: "Dashboard — call log, transcripts, summaries",
      description:
        "Every call in one place: recording, transcript, Arabic summary, sentiment, tags, customer timeline, bookings calendar, live take-over, audit log.",
    },
    "product/agent-builder": {
      title: "Build your agent, no code",
      description:
        "Sector templates, personality controls, an AI-drafted Najdi persona, a test chat with saved scenario tests, and draft-to-publish versioning with a diff.",
    },
    // Wave 2 — sector pages. English here is its own writing, not a
    // translation of the Arabic: the EN buyer searches the sector in English.
    "solutions/clinics": {
      title: "AI call answering for clinics",
      description:
        "An AI voice agent answering clinic calls in your patient's dialect: bookings, reschedules, fees, hours and the rota — medical questions go to your staff.",
    },
    "solutions/restaurants": {
      title: "AI phone answering for restaurants",
      description:
        "An AI voice agent answering every restaurant call, even at peak: tables booked and amended, menu, hours and branches — complaints escalated to your staff.",
    },
    "solutions/hotels": {
      title: "AI answering for hotels",
      description:
        "An AI voice agent answering your hotel's calls 24/7: checks availability, confirms bookings, and answers rates, cancellation policy and check-in times.",
    },
    "solutions/real-estate": {
      title: "AI call answering for real estate",
      description:
        "An AI voice agent answering enquiries on your listings — availability, price, terms — and booking viewings. Inbound calls only: it never cold-calls.",
    },
    "solutions/retail": {
      title: "AI answering for retail",
      description:
        "An AI voice agent answering your store's calls: returns, shipping, branch hours and offers — with every order enquiry captured in full for your team.",
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
