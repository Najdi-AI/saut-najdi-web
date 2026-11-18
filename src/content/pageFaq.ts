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
