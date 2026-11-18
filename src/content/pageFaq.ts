import type { FaqItem } from "@/lib/schema";
import type { Locale } from "@/lib/i18n";

/**
 * The inner pages' own FAQs. Each page's accordion and its FAQPage JSON-LD
 * (pageFactory) read the same list. They live here, not in the page modules,
 * because pageFactory runs on every route: importing a page module for its
 * FAQ put that page's client components in every route's bundle. The claim
 * rules for each list stay in its page module's header comment.
 */

/** /product/voice-agent */
export const voiceAgentFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "الوكيل يفهم اللهجة النجدية، ولا لازم عميلي يتكلم فصحى؟",
      a: "يفهم اللهجة زي ما تنقال — «أبي أحجز بكره العصر» تنفهم صح. عميلك ما يحتاج يتكلم فصحى ولا يبطئ كلامه.",
    },
    {
      q: "إذا قاطعت الوكيل وهو يتكلم، وش يصير؟",
      a: "يسكت في نفس اللحظة ويسمعك. وإذا سكتّ فجأة، ما يعيد جملته من أولها — يقول «نعم؟» وينتظرك.",
    },
    {
      q: "أقدر أستخدم صوتي أو صوت موظفي للوكيل؟",
      a: "تقدر: عينة 60 ثانية على الأقل مع إقرار موافقة مسجّل باسم صاحب الصوت، وبعدها تعيّنه لوكيلك. والموافقة تنسحب بأي وقت، فيتوقف استخدام الصوت فوراً. اسأل فريقنا عن مدة الاحتفاظ بالعينة وإجراءات حذفها قبل رفعها. والاستنساخ ينسخ الصوت مو لهجة محادثة جديدة، والميزة حسب باقتك.",
    },
    {
      q: "هل الوكيل يتصل على عملائي؟",
      a: "إي. فريقك يبدأ المكالمة من اللوحة — يختار عميلاً أو يكتب رقماً — والوكيل يمسك الحوار، وتنسجّل وتتفرّغ وتتلخّص زي أي مكالمة. وما في اتصال آلي على قائمة أرقام.",
    },
  ],
  en: [
    {
      q: "Does the agent understand Najdi dialect, or does my customer have to speak formal Arabic?",
      a: "It understands the dialect as spoken, with normalisation of colloquial forms and a booking vocabulary built from real mistranscription forensics. Your customer doesn't have to switch registers or slow down.",
    },
    {
      q: "What happens if I interrupt the agent mid-sentence?",
      a: "It stops instantly and listens. If you trail off, it doesn't replay its sentence — it says a short “yes?” and waits.",
    },
    {
      q: "Can I use my own voice, or an employee's, for the agent?",
      a: "Yes: a sample of at least 60 seconds plus a recorded consent attestation naming the speaker, then you assign the voice to your agent. You can withdraw consent at any time, which stops further use immediately. Ask our team about sample retention and deletion before uploading. Cloning reproduces a voice, not a new conversational dialect, and availability depends on your plan.",
    },
    {
      q: "Does the agent call my customers?",
      a: "Yes. Your team starts the call from the dashboard — pick a customer or type a number — and the agent handles the conversation, logged, transcribed and summarised like any other call. There is no automatic dialling of a list.",
    },
  ],
};

/** /product/knowledge-base */
export const knowledgeBaseFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "وش صيغ الملفات اللي تقبلونها؟",
      a: "PDF وWord (.docx) وملفات نصية (.txt / .md)، مع أسئلة وأجوبة وروابط ومقتطفات وأوقات الدوام. والملفات الممسوحة ضوئياً تنقرأ بتعرّف ضوئي عربي يطلع الحروف موصولة صح.",
    },
    {
      q: "هل الوكيل يجاوب من ملفاتي في الشات؟",
      a: "إي، على قنوات المحادثة النصية: يرد من محتواك أنت، وإذا ما لقى جواباً واضحاً يصعّد أو يسجل طلب اتصال. وتقدر تجرب أي سؤال في المحادثة التجريبية قبل ما تنشر.",
    },
    {
      q: "لازم أعيد كتابة ملفاتي بصيغة معينة؟",
      a: "لا، ارفعها زي ما هي. اللي ينفع تكتبه يدوياً هو الردود الحساسة اللي تبي صياغتها بالحرف — وهذي تحطها كأسئلة وأجوبة.",
    },
    {
      q: "أقدر أخلي كل فرع يقرأ من ملفاته فقط؟",
      a: "تقدر. نطاق قاعدة المعرفة يتحدد لكل وكيل على حدة، فالوكلاء ما يتداخلون في ملفات بعض.",
    },
  ],
  en: [
    {
      q: "Which file formats do you accept?",
      a: "PDF, Word (.docx) and plain text (.txt / .md), alongside Q&A pairs, links, snippets and working hours. Scans are read with Arabic OCR that returns correctly joined letters.",
    },
    {
      q: "Does the agent answer from my documents in chat?",
      a: "Yes, on the text chat channels — from your own content, and it escalates or logs a callback when there's no clear answer. You can try any question in the test chat before publishing.",
    },
    {
      q: "Do I have to rewrite my documents in a particular format?",
      a: "No, upload them as they are. The only thing worth writing by hand is a sensitive reply you want worded exactly — and that belongs in a Q&A pair.",
    },
    {
      q: "Can each branch read only its own material?",
      a: "Yes. Knowledge-base scope is set per agent, so agents never cross into each other's files.",
    },
  ],
};

/** /product/dashboard */
export const dashboardFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "الملخص والنص بالعربي ولا بالإنجليزي؟",
      a: "النص يطلع بلغة المكالمة، والملخص يُكتب بالعربي بلغة واضحة. واللوحة عربية من اليمين لليسار، مع تبديل للإنجليزي لأي عضو يفضّله.",
    },
    {
      q: "وش الأرقام اللي أقدر أقيسها على مكالماتي؟",
      a: "إجمالي المكالمات، ونسبة اللي أنهاها الوكيل لحاله، ومتوسط المدة، ومزاج كل مكالمة، وتقييمات فريقك ووسومه — مقسّمة حسب الوكيل والنتيجة واليوم والساعة، وتصدّرها CSV أو PDF. أرقامك أنت، ما ننشر أرقاماً عن أنفسنا.",
    },
    {
      q: "كم تبقى تسجيلات المكالمات محفوظة؟",
      a: "مدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات، وتُحذف تلقائياً عند انتهاء المدة المتفق عليها. وأي تشغيل يتم عبر رابط موقّع قصير الصلاحية.",
    },
    {
      q: "أقدر أطلع بياناتي من المنصة؟",
      a: "تقدر تصدّرها CSV أو PDF من اللوحة، وكل تصدير يُسجَّل باسم اللي سواه ووقته. بياناتك بياناتك — ما نحتجزها.",
    },
  ],
  en: [
    {
      q: "Are transcripts and summaries in Arabic or English?",
      a: "The transcript follows the language of the call and the summary is written in clear Arabic. The interface is Arabic-first, with an English switch per team member.",
    },
    {
      q: "What can I actually measure about my calls?",
      a: "Total calls, the share the AI handled end to end, average call length, per-call sentiment, and your team's ratings and tags — broken down by agent, outcome, day and hour, exportable as CSV or PDF. Those are your numbers; we publish none about ourselves.",
    },
    {
      q: "How long are call recordings kept?",
      a: "Recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise. Recordings are automatically deleted at the end of the agreed period. Playback happens through a short-lived signed link.",
    },
    {
      q: "Can I get my data out of the platform?",
      a: "You can export to CSV or PDF, and every export is written to the audit log with who did it and when. Your data is yours — we don't hold it hostage.",
    },
  ],
};

/** /product/agent-builder */
export const agentBuilderFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "أحتاج مبرمج عشان أبني الوكيل؟",
      a: "ما تحتاج. كلها شاشات عربية: قالب، وتحكمات شخصية، وصوت، وتجربة، ونشر. وأول وكيل نبنيه معك على أي حال.",
    },
    {
      q: "عندكم قالب لقطاعي؟",
      a: "عندنا قوالب مكتوبة فعلاً للفنادق والعيادات والمطاعم والعقار والتجزئة، وقالب عام لأي نشاط غيرها — وكل قالب يجي معه هيكل مبدئي لقاعدة المعرفة.",
    },
    {
      q: "إذا عدّلت الوكيل، كيف أتأكد إني ما كسرت شيئاً شغالاً؟",
      a: "بسيناريوهات الاختبار المحفوظة: تحفظ حالاتك المهمة مرة وحدة وتعيد تشغيلها بعد كل تعديل، وتشوف وش تغيّر في الردود قبل ما تنشر.",
    },
    {
      q: "أقدر أرجع لنسخة قديمة بعد النشر؟",
      a: "تقدر. مسودة ونسخة منشورة وسجل نسخ كامل مع مقارنة توريك وش تغيّر — والرجوع ضغطة وحدة بدون إعادة بناء.",
    },
  ],
  en: [
    {
      q: "Do I need a developer to build the agent?",
      a: "No. Every step is a screen: template, personality controls, voice, test, publish. And the first agent is built with you by our team.",
    },
    {
      q: "Do you have a template for my sector?",
      a: "Templates written for hotels, clinics, restaurants, real estate and retail, plus a generic one — each with a starter knowledge-base structure showing what to fill in.",
    },
    {
      q: "If I edit the agent, how do I know I haven't broken something?",
      a: "Saved test scenarios: capture the cases that matter once, replay them after every change, and see what moved in the replies before you publish.",
    },
    {
      q: "Can I go back to an older version after publishing?",
      a: "Yes. A draft, a published version, a full history and a comparison of what changed — rolling back takes one click and rebuilds nothing.",
    },
  ],
};

/** /product/human-handoff */
export const handoffFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "مين يحدد قواعد التصعيد؟",
      a: "أنت. تجيك قواعد افتراضية منطقية، وتعدل عليها: وش يتحول، لمين، ومتى.",
    },
    {
      q: "وش يشوف موظفي لما يستلم المكالمة؟",
      a: "سبب التصعيد، ونص المحادثة كامل، وملخص عربي، وتاريخ العميل معكم — كله قدامه لحظة الاستلام.",
    },
    {
      q: "أقدر أراقب مكالمات الوكيل؟",
      a: "تقدر. من اللوحة تتابع المكالمات الحية، تسمع، تهمس للوكيل، أو تستلم بضغطة وحدة.",
    },
    {
      q: "وإذا كان الاتصال برا الدوام؟",
      a: "يخدم العميل في اللي يقدر عليه، وإذا احتاج إنسان يسجل طلب اتصال ويوعده إن أحد من فريقك يرجع له.",
    },
  ],
  en: [
    {
      q: "Who defines the escalation rules?",
      a: "You do. Sensible defaults ship with the platform, and you tune what transfers, to whom, and when.",
    },
    {
      q: "What does my employee see when they take over?",
      a: "The escalation reason, the full transcript, a summary, and the caller's history — all on screen at the moment of takeover.",
    },
    {
      q: "Can I monitor the agent's calls?",
      a: "Yes. Watch live calls from the dashboard, listen in, whisper to the agent, or take over in one click.",
    },
    {
      q: "What about calls outside working hours?",
      a: "The agent handles what it can, then logs a callback request with the caller's preferred time for your team the next morning.",
    },
  ],
};

/** /security */
export const securityFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "أين تُخزَّن بيانات مكالماتي تحديداً؟",
      a: "التخزين الدائم في منطقة الخليج (الدوحة) عبر شبكة خاصة، ومدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات.",
    },
    {
      q: "هل تُعالَج البيانات داخل السعودية؟",
      a: "التخزين الدائم في منطقة الخليج، والمعالجة اللحظية للصوت والذكاء الاصطناعي عبر مزوّدين عالميين — ونفصح عن ذلك لأن النظام يتطلب الإفصاح عن النقل عبر الحدود.",
    },
    {
      q: "من يستطيع الاطلاع على مكالمات منشأتي؟",
      a: "موظفوك حسب الصلاحيات التي تحددها، وفريق الدعم عند الحاجة فقط — وكل اطلاع يُسجَّل في سجل تدقيق غير قابل للتعديل.",
    },
    {
      q: "هل توجد اتفاقية معالجة بيانات؟",
      a: "نعم. الملخص منشور في صفحة مستقلة، وتُوقَّع النسخة الكاملة ضمن التعاقد.",
    },
  ],
  en: [
    {
      q: "Where exactly is my call data stored?",
      a: "Permanent storage is in the Gulf region (Doha) over private networking, and recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise.",
    },
    {
      q: "Is data processed inside Saudi Arabia?",
      a: "Permanent storage is in the Gulf region, while realtime speech and AI processing transits global providers. We disclose that fully, because disclosing cross-border transfer is what the PDPL requires.",
    },
    {
      q: "Who can see my organisation's calls?",
      a: "Your employees under the permissions you define, and platform support only when needed — every support view is written to an append-only audit log.",
    },
    {
      q: "Is there a data processing agreement?",
      a: "Yes. A summary DPA is published on its own page, and the full version is signed as part of contracting.",
    },
  ],
};

/** /demo */
export const demoFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "العرض مجاني؟",
      a: "العرض التعريفي في صوت نجدي مجاني وبدون التزام — 30 دقيقة نوريك فيها المنصة حية ونجاوب أسئلتك.",
    },
    {
      q: "العرض بالعربي ولا بالإنجليزي؟",
      a: "عرض صوت نجدي بالعربي افتراضياً، وإنجليزي إذا فريقك يفضله. وتقدر تسمع الوكيل باللغتين في نفس الجلسة.",
    },
    {
      q: "ألزم أجهز شي قبل العرض؟",
      a: "ما يلزمك تجهيز. جيب معك أكثر خمسة أسئلة يسألها عملاؤك، ونبني عليها المثال الحي في العرض.",
    },
    {
      q: "إذا ما ناسبني الوقت المتاح في التقويم؟",
      a: "راسلنا على الإيميل وبنرتب لك وقتاً ثانياً، أو احجز المكالمة السريعة 15 دقيقة.",
    },
  ],
  en: [
    {
      q: "Is the demo free?",
      a: "The Saut Najdi intro demo is free and carries no obligation — 30 minutes of the platform live and your questions answered.",
    },
    {
      q: "Is the demo in Arabic or English?",
      a: "The Saut Najdi demo runs in Arabic by default and switches to English if your team prefers. You can hear the agent in both languages in the same session.",
    },
    {
      q: "Do I need to prepare anything?",
      a: "Nothing needs preparing. Bring the five questions your customers ask most and we'll build the live example around them.",
    },
    {
      q: "What if none of the calendar slots work for me?",
      a: "Email us and we'll arrange another time, or book the 15-minute quick call instead.",
    },
  ],
};

/** /solutions/clinics */
export const clinicsFaq: Record<Locale, FaqItem[]> = {
  ar: [
    {
      q: "الوكيل يحجز فعلاً ولا بس يسجل الطلب؟",
      a: "يحجز فعلاً في تقويمك وهو على الخط، ويقرأ رقم الحجز رقم رقم — ويظهر لفريقك في نفس اللحظة.",
    },
    {
      q: "وش يسوي إذا سأل المريض سؤال طبي؟",
      a: "يحوّل على طول — ما يعطي استشارة ولا يشخّص ولا يفسر تقرير. وموظفك يستلم ومعه النص والملخص.",
    },
    {
      q: "عندنا فروع وأطباء كثير — يفرق؟",
      a: "ما يفرق. جدول الأطباء وفروعهم في إعداد وكيلك، ويحجز في تقويم الفرع الصح.",
    },
    {
      q: "وين تنحفظ بيانات مرضانا؟",
      a: "التخزين الدائم في منطقة الخليج (الدوحة)، ومدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات، وكل اطلاع يتسجل في سجل تدقيق. والمعالجة في صفحة الأمان.",
    },
  ],
  en: [
    {
      q: "Does the agent actually book, or just take a request?",
      a: "It actually books, checking your calendar on the line and reading the reference back digit by digit — and it appears in your team's calendar in the same moment.",
    },
    {
      q: "What happens if a patient asks a medical question?",
      a: "It transfers immediately — no advice, no diagnosis, no interpreting a report. Your employee takes over with the transcript and the summary.",
    },
    {
      q: "We have several branches and doctors — is that a problem?",
      a: "No. The rota and branches are configured into your agent, and it books into the right branch's calendar.",
    },
    {
      q: "Where is our patients' data stored?",
      a: "Permanent storage is in the Gulf region (Doha), recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise. Every access is written to an audit log. Processing is set out on the security page.",
    },
  ],
};

/** /solutions/restaurants */
export const restaurantsFaq: Record<Locale, FaqItem[]> = {
  ar: [
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
  ],
  en: [
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
  ],
};

/** /solutions/hotels */
export const hotelsFaq: Record<Locale, FaqItem[]> = {
  ar: [
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
      a: "التخزين الدائم في منطقة الخليج (الدوحة)، ومدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات. والمعالجة اللحظية للصوت تمر عبر مزودين عالميين — مفصّلة في صفحة الأمان.",
    },
    {
      q: "إذا انزعج النزيل، وش يسوي الوكيل؟",
      a: "يعتذر ويحوّل على طول لموظفك ومعه النص والملخص وتاريخ النزيل. وطلب الإنسان تحويل فوري.",
    },
  ],
  en: [
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
      a: "Permanent storage is in the Gulf region (Doha), and recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise. Realtime speech processing transits global providers — detailed on our security page.",
    },
    {
      q: "What does the agent do with an upset guest?",
      a: "It apologises and transfers immediately, carrying the transcript, the summary and the guest's history. A request for a human is never negotiated.",
    },
  ],
};

/** /solutions/real-estate */
export const realEstateFaq: Record<Locale, FaqItem[]> = {
  ar: [
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
      a: "التخزين الدائم في منطقة الخليج (الدوحة)، ومدة حفظ التسجيلات حسب شروط الباقة المؤكدة عند التفعيل: 90 يوماً لأساسي، و180 لنمو، و365 لتوسّع، وبحسب العقد للمؤسسات. والمعالجة اللحظية للصوت تمر عبر مزودين عالميين — مفصّلة في صفحة الأمان.",
    },
  ],
  en: [
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
      a: "Permanent storage is in the Gulf region (Doha), and recording retention follows the plan terms confirmed at activation: 90 days for Essential, 180 for Growth, 365 for Expansion, and by contract for Enterprise. Realtime speech processing transits global providers — detailed on our security page.",
    },
  ],
};

/** /solutions/retail */
export const retailFaq: Record<Locale, FaqItem[]> = {
  ar: [
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
  ],
  en: [
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
  ],
};
