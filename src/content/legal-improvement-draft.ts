import type { Locale } from "@/lib/i18n";
import type { LegalDoc } from "@/content/legal";

/**
 * DRAFT for counsel — not published.
 * مسودة للمستشار القانوني — غير منشورة.
 *
 * NAJ-949 (decision 110 plan v2, block 12; decisions 110 and 111, Sultan,
 * 2026-10-21). Draft privacy and DPA copy for the AI-improvement store: call
 * transcripts and audio kept, on the basis of the notice played at the start
 * of each call, to improve the service and its AI.
 *
 * Nothing here is live, and nothing here may render. No page, component or
 * other content module imports this file. A merge to main publishes the site
 * on Vercel, so importing it would publish legal text that counsel has not
 * reviewed, for a store that is not active. Importer check: under src/, the
 * name legal-improvement-draft must match only this line.
 *
 * Contents:
 * - `improvementNoticeDraft`: the notice, LegalDoc-shaped, in Arabic and
 *   English with matching sections. A Saudi lawyer reviews and edits it before
 *   the first clinic contract.
 * - `legalLineReplacementsDraft`: the sentences in src/content/legal.ts (line
 *   numbers checked on origin/main cc254c9) that stop being true once the store
 *   is active, each with its replacement text.
 *
 * Swap (plan v2 §6, activation step 3, after counsel's edits): replace each
 * `current` literal with its `replacement` in src/content/legal.ts, asserting
 * exactly one hit each; add the notice to the privacy policy; then drop the
 * draft markers. The "(Doha)" platform clause is kept as it reads today: if the
 * Dammam platform cutover lands first, its own copy change updates that clause,
 * and the sentence added here for the improvement store stays.
 *
 * Drafting rules: the basis is the notice at the start of each call, never the
 * caller's agreement; the clinic's part is its opt-in under its contract
 * («اشتراك المنشأة بموجب العقد»), which is not given for the caller;
 * de-identified («إزالة المعرّفات») is not a claim that data is anonymous; no
 * statute numbers; Latin digits, as in legal.ts.
 *
 * Open points for counsel (not public copy): whether a notice basis suffices
 * for health data; whether the spoken notice must say more (AI improvement,
 * transcription, retention, the controller, rights); holding audio with no
 * current use; withdrawal by email only; when each retention period starts;
 * controller registration and a data protection officer.
 */

export const IMPROVEMENT_DRAFT_MARKER: Record<Locale, string> = {
  ar: "مسودة للمستشار القانوني — غير منشورة",
  en: "DRAFT for counsel — not published",
};

export const improvementNoticeDraft: Record<Locale, LegalDoc> = {
  ar: {
    title: "مسودة للمستشار القانوني — غير منشورة: إشعار استخدام المكالمات في تحسين الخدمة وأنظمة الذكاء الاصطناعي",
    updated: "مسودة بتاريخ 22 أكتوبر 2026 — غير نافذة",
    intro:
      "يبيّن هذا الإشعار كيف يحتفظ صوت نجدي بنصوص المكالمات وتسجيلاتها الصوتية، وكيف يستخدمها لتحسين الخدمة وأنظمة الذكاء الاصطناعي التي تقوم عليها، وذلك في المكالمات التي يردّ عليها وكيله الصوتي نيابةً عن المنشآت المشتركة، كالعيادات. وهو مكمّل لسياسة الخصوصية، ولا يسري إلا على مكالمات المنشآت التي اشتركت في هذا الاستخدام بموجب عقدها.",
    sections: [
      {
        h: "1. الغرض",
        blocks: [
          {
            kind: "paragraph",
            text: "يحتفظ صوت نجدي بنسخ من نصوص المكالمات المشمولة وتسجيلاتها الصوتية في مخزن مخصص لذلك («مخزن التحسين»)، لغرض واحد هو تحسين الخدمة وأنظمة الذكاء الاصطناعي التي تقوم عليها، كرفع دقة فهم طلبات المتصلين وجودة الردود عليها. وهذا الغرض مستقل عن تشغيل الخدمة لصالح المنشأة، ولا تُستخدم هذه النسخ في غيره.",
          },
        ],
      },
      {
        h: "2. الأساس: الإشعار في بداية كل مكالمة",
        blocks: [
          {
            kind: "paragraph",
            text: "تُستهَلّ كل مكالمة، قبل بدء المحادثة، بإشعار صوتي نصّه: «نودّ إحاطتكم بأنّ هذه المكالمة تُسجَّل لأغراض الجودة وتحسين الخدمة.» ويستند الاحتفاظ بالمكالمات لهذا الغرض إلى هذا الإشعار.",
          },
          {
            kind: "paragraph",
            text: "ولا يُحتفظ بالمكالمة لهذا الغرض إلا إذا تحقق الأمران الآتيان معاً:",
          },
          {
            kind: "unordered",
            items: [
              "أن تكون المكالمة واردةً إلى منشأة اشتركت في هذا الاستخدام بموجب عقدها مع صوت نجدي، وأن يكون اشتراكها سارياً وقت المكالمة.",
              "أن يكون الإشعار قد قُدِّم كاملاً؛ فإذا انتهت المكالمة قبل اكتماله، لم يُحتفظ بشيء منها لهذا الغرض.",
            ],
          },
          {
            kind: "paragraph",
            text: "ويقتصر أثر اشتراك المنشأة بموجب العقد على تحديد ما إذا كانت مكالماتها مشمولة بهذا الاستخدام، ولا يُعدّ صادراً عن المتصل ولا نيابةً عنه.",
          },
        ],
      },
      {
        h: "3. الجهة المسؤولة",
        blocks: [
          {
            kind: "paragraph",
            text: "يتولى صوت نجدي صفة المتحكم في مخزن التحسين؛ فهو الذي يحدّد كيفية الاحتفاظ بهذه البيانات واستخدامها لأغراض التحسين، ويتلقى الطلبات المتعلقة بها ويجيب عنها مباشرةً.",
          },
          {
            kind: "paragraph",
            text: "أما في خدمة الرد على المكالمات ذاتها، فتظل المنشأة المشتركة هي المتحكم بالبيانات، ويظل صوت نجدي معالجاً لها، على النحو المبيّن في سياسة الخصوصية واتفاقية معالجة البيانات.",
          },
          {
            kind: "paragraph",
            text: "ولا يشمل هذا الاستخدام مكالمات أي منشأة إلا باشتراكها فيه بموجب العقد، ولها أن تُنهي اشتراكها في أي وقت (انظر البند 8).",
          },
        ],
      },
      {
        h: "4. البيانات المحتفَظ بها",
        blocks: [
          {
            kind: "paragraph",
            text: "يحفظ مخزن التحسين الفئات الآتية من المكالمات المشمولة:",
          },
          {
            kind: "unordered",
            items: [
              "نصوص المكالمات: النص المكتوب للمكالمة بدءاً من الإشعار.",
              "التسجيلات الصوتية: تسجيل المكالمة بدءاً من الإشعار.",
              "سجلات مساندة: إصدار الإشعار الذي قُدِّم ووقت تقديمه، ومرجع اشتراك المنشأة، ومعرّف مرمَّز مشتق من رقم المتصل لا يُستخدم إلا للوصول إلى سجلاته عند تقديمه طلباً.",
            ],
          },
          {
            kind: "paragraph",
            text: "وقد تتضمن مكالمات العيادات معلومات صحية يذكرها المتصلون.",
          },
        ],
      },
      {
        h: "5. مكان التخزين",
        blocks: [
          {
            kind: "paragraph",
            text: "تُحفظ هذه البيانات داخل المملكة العربية السعودية (الدمام)، في مخزن التحسين المستقل عن البيانات المستخدمة في تشغيل الخدمة، ويقتصر الوصول إليها على الأنظمة المخصصة لذلك وعلى الموظفين المخوَّلين بمراجعتها.",
          },
        ],
      },
      {
        h: "6. الاستخدام والحماية",
        blocks: [
          {
            kind: "unordered",
            items: [
              "النصوص: تُزال المعرّفات الشخصية منها وفق قواعد محددة سلفاً، ثم يراجع موظف مخوَّل كل نص قبل أي استخدام له، ويُحذف النص الذي لا يجتاز المراجعة.",
              "قد يظل النص بعد إزالة المعرّفات منه بيانات شخصية، ولذا يبقى هذا الإشعار وما يتضمنه من حقوق سارياً عليه.",
              "التسجيلات الصوتية: لا تُستخدم في المرحلة الحالية لأي غرض؛ إذ تُحفظ معزولةً، فلا تُزال منها المعرّفات ولا تُراجَع ولا تُشارَك، وتُحذف بانتهاء مدة الاحتفاظ بها، أو قبل ذلك عند طلب المتصل استبعاد مكالماته أو إنهاء المنشأة اشتراكها.",
              "لا يُنقل شيء من هذه البيانات إلى مزوّدين خارجيين لتدريب نماذج الذكاء الاصطناعي أو تحسينها.",
            ],
          },
        ],
      },
      {
        h: "7. مدد الاحتفاظ",
        blocks: [
          {
            kind: "unordered",
            items: [
              "النصوص قبل إزالة المعرّفات منها، والتسجيلات الصوتية: 30 يوماً، ثم تُحذف.",
              "النصوص بعد إزالة المعرّفات منها: 12 شهراً، ثم تُحذف.",
            ],
          },
          {
            kind: "paragraph",
            text: "ويشمل الحذف جميع نسخ النصوص والتسجيلات المحفوظة في مخزن التحسين، ويُعجَّل به عند طلب المتصل استبعاد مكالماته أو إنهاء المنشأة اشتراكها (البند 8). ولا يغيّر ذلك مدد الاحتفاظ بتسجيلات المكالمات ونصوصها لتشغيل الخدمة، المبيّنة في سياسة الخصوصية.",
          },
        ],
      },
      {
        h: "8. حقوقك وطلب الاستبعاد",
        blocks: [
          {
            kind: "paragraph",
            text: "يحق لك بصفتك متصلاً أن تطلب الاطلاع على بياناتك المحفوظة في مخزن التحسين، أو الحصول على نسخة منها، أو تصحيحها، أو إتلافها، ولك أن تطلب في أي وقت استبعاد مكالماتك من هذا الاستخدام، دون أن يؤثر ذلك في الخدمة التي تتلقاها.",
          },
          {
            kind: "paragraph",
            text: "وعند الاستبعاد تُحذف سجلاتك من مخزن التحسين، ولا يُحتفظ لهذا الغرض بمكالماتك اللاحقة من الرقم ذاته.",
          },
          {
            kind: "paragraph",
            text: "لتقديم أي طلب، راسلنا على ai@sautnajdi.ai مع ذكر الرقم الذي اتصلت منه وتاريخ المكالمة التقريبي. وقد نتحقق من أن الطلب صادر عنك قبل تنفيذه، ونجيب عن الطلبات خلال 30 يوماً.",
          },
          {
            kind: "paragraph",
            text: "وللمنشأة المشتركة أن تُنهي اشتراكها في هذا الاستخدام في أي وقت بإشعار صوت نجدي وفق عقدها، فتُحذف سجلات مكالماتها من مخزن التحسين، ويُجاب عن طلبها خلال 30 يوماً.",
          },
          {
            kind: "paragraph",
            text: "وتُوجَّه الطلبات المتعلقة بمخزن التحسين إلى صوت نجدي مباشرةً، أما الطلبات المتعلقة بخدمة الرد على المكالمات ذاتها فتُوجَّه إلى المنشأة على النحو المبيّن في سياسة الخصوصية.",
          },
        ],
      },
    ],
  },
  en: {
    title: "DRAFT for counsel — not published: Notice on using calls to improve the service and its AI",
    updated: "Draft dated 22 October 2026 — not in effect",
    intro:
      "This notice explains how Saut Najdi keeps call transcripts and audio, and how it uses them to improve the service and its AI, for calls its AI voice agent answers on behalf of subscribed businesses such as clinics. It supplements the privacy policy and applies only to calls to businesses that have opted in to this use under their contract.",
    sections: [
      {
        h: "1. Purpose",
        blocks: [
          {
            kind: "paragraph",
            text: "Saut Najdi keeps copies of eligible call transcripts and audio in a dedicated store (“the improvement store”) for one purpose: improving the service and its AI, such as how accurately it understands callers' requests and how well it answers them. This purpose is separate from operating the service for the business, and these copies are not used for anything else.",
          },
        ],
      },
      {
        h: "2. Basis: the notice at the start of each call",
        blocks: [
          {
            kind: "paragraph",
            text: "Each call opens, before the conversation begins, with a spoken notice in Arabic that says: “We would like to inform you that this call is recorded for quality and service-improvement purposes.” Keeping calls for this purpose rests on that notice.",
          },
          {
            kind: "paragraph",
            text: "A call is kept for this purpose only if both of the following apply:",
          },
          {
            kind: "unordered",
            items: [
              "The call came in to a business that has opted in to this use under its contract with Saut Najdi, and that opt-in was in effect at the time of the call.",
              "The notice was played in full. If the call ends before the notice finishes, nothing from it is kept for this purpose.",
            ],
          },
          {
            kind: "paragraph",
            text: "The business's opt-in under its contract only decides whether its calls are covered by this use; it is not given by or on behalf of the caller.",
          },
        ],
      },
      {
        h: "3. Who is responsible",
        blocks: [
          {
            kind: "paragraph",
            text: "Saut Najdi is the controller of the improvement store: it decides how this data is kept and used for improvement, and it receives and answers requests about it directly.",
          },
          {
            kind: "paragraph",
            text: "For the call service itself, the subscribed business remains the data controller and Saut Najdi its processor, as set out in the privacy policy and the data processing agreement.",
          },
          {
            kind: "paragraph",
            text: "This use covers a business's calls only if the business opts in under its contract, and the business may end its opt-in at any time (see section 8).",
          },
        ],
      },
      {
        h: "4. What is kept",
        blocks: [
          {
            kind: "paragraph",
            text: "The improvement store holds these categories from eligible calls:",
          },
          {
            kind: "unordered",
            items: [
              "Call transcripts: the written text of the call, from the notice onwards.",
              "Call audio: the recording of the call, from the notice onwards.",
              "Supporting records: the version of the notice that was played and when, a reference to the business's opt-in, and a coded reference derived from the calling number, used only to find a caller's records when they make a request.",
            ],
          },
          {
            kind: "paragraph",
            text: "Calls to clinics may include health information that callers share.",
          },
        ],
      },
      {
        h: "5. Where it is stored",
        blocks: [
          {
            kind: "paragraph",
            text: "This data is stored in Saudi Arabia (Dammam), in the improvement store, kept apart from the data used to operate the service. Access is limited to the dedicated systems and to the authorised staff who review it.",
          },
        ],
      },
      {
        h: "6. How it is used and protected",
        blocks: [
          {
            kind: "unordered",
            items: [
              "Transcripts: identifying details are removed by set rules, then an authorised member of staff reviews each transcript before any use. A transcript that does not pass review is deleted.",
              "A de-identified transcript may still be personal data, so this notice and the rights in it continue to apply to it.",
              "Audio: in the current phase, audio is not used for any purpose. It is held in isolation; it is not de-identified, reviewed or shared, and it is deleted at the end of its retention period, or earlier if the caller withdraws their calls or the business ends its opt-in.",
              "None of this data is transferred to outside providers to train or improve AI models.",
            ],
          },
        ],
      },
      {
        h: "7. Retention",
        blocks: [
          {
            kind: "unordered",
            items: [
              "Transcripts before de-identification, and audio: 30 days, then deleted.",
              "De-identified transcripts: 12 months, then deleted.",
            ],
          },
          {
            kind: "paragraph",
            text: "Deletion covers every copy of the transcripts and audio held in the improvement store, and happens sooner if the caller withdraws their calls or the business ends its opt-in (section 8). This does not change how long call recordings and transcripts are kept to operate the service, as set out in the privacy policy.",
          },
        ],
      },
      {
        h: "8. Your rights and how to withdraw",
        blocks: [
          {
            kind: "paragraph",
            text: "As a caller, you can ask to access your data in the improvement store, to receive a copy, to have it corrected or to have it destroyed, and you can ask at any time for your calls to be withdrawn from this use, without any effect on the service you receive.",
          },
          {
            kind: "paragraph",
            text: "On withdrawal, your records are deleted from the improvement store, and later calls from the same number are not kept for this purpose.",
          },
          {
            kind: "paragraph",
            text: "To make any request, email ai@sautnajdi.ai with the number you called from and the approximate date of the call. We may check that the request comes from you before acting on it, and we answer requests within 30 days.",
          },
          {
            kind: "paragraph",
            text: "A subscribed business can end its opt-in to this use at any time by notifying Saut Najdi under its contract; the records of its calls are then deleted from the improvement store, and its request is answered within 30 days.",
          },
          {
            kind: "paragraph",
            text: "Requests about the improvement store go to Saut Najdi directly; requests about the call service itself go to the business, as set out in the privacy policy.",
          },
        ],
      },
    ],
  },
};

/** One sentence in src/content/legal.ts and the text that replaces it at activation. */
export interface LegalLineReplacementDraft {
  locale: Locale;
  doc: "privacy" | "dpa";
  /** Section heading in src/content/legal.ts. */
  section: string;
  /** 1-based line in src/content/legal.ts on origin/main cc254c9. */
  line: number;
  /** Exact text on that line today; the swap expects exactly one hit. */
  current: string;
  replacement: string;
}

export const legalLineReplacementsDraft: readonly LegalLineReplacementDraft[] = [
  {
    locale: "ar",
    doc: "privacy",
    section: "2. أين تُخزَّن البيانات",
    line: 47,
    current:
      "التخزين الدائم لبيانات المنصة يتم في منطقة الخليج (الدوحة) لدى مزوّد سحابي عالمي، عبر شبكة خاصة، مع نسخ احتياطية واستعادة لنقطة زمنية محددة.",
    replacement:
      "التخزين الدائم لبيانات المنصة يتم في منطقة الخليج (الدوحة) لدى مزوّد سحابي عالمي، عبر شبكة خاصة، مع نسخ احتياطية واستعادة لنقطة زمنية محددة. أما نصوص المكالمات وتسجيلاتها الصوتية التي يُحتفظ بها لتحسين الخدمة وأنظمة الذكاء الاصطناعي التي تقوم عليها، لدى المنشآت التي اشتركت في ذلك بموجب عقدها، فتُودَع على حدة في مخزن مخصص داخل المملكة العربية السعودية (الدمام).",
  },
  {
    locale: "ar",
    doc: "dpa",
    section: "التزامات المعالجة",
    line: 140,
    current: "• المعالجة لأغراض تشغيل الخدمة حصراً، ووفق تعليمات المنشأة.",
    replacement:
      "• المعالجة لأغراض تشغيل الخدمة، ووفق تعليمات المنشأة. وإذا اشتركت المنشأة بموجب العقد في تحسين الخدمة وأنظمة الذكاء الاصطناعي التي تقوم عليها، احتفظ صوت نجدي لهذا الغرض بنسخ من نصوص مكالماتها وتسجيلاتها الصوتية في مخزن مستقل، وتولّى صفة المتحكم في ذلك المخزن، على النحو المبيّن في سياسة الخصوصية.",
  },
  {
    locale: "ar",
    doc: "dpa",
    section: "التزامات المعالجة",
    line: 141,
    current:
      "• التخزين الدائم في منطقة الخليج (الدوحة)، مع الإفصاح الكامل عن المعالجين الفرعيين وأماكنهم في قائمة تُسلَّم عند الطلب وتُلحق بالاتفاقية، وإشعار المنشأة قبل أي تغيير فيهم.",
    replacement:
      "• التخزين الدائم في منطقة الخليج (الدوحة)، مع الإفصاح الكامل عن المعالجين الفرعيين وأماكنهم في قائمة تُسلَّم عند الطلب وتُلحق بالاتفاقية، وإشعار المنشأة قبل أي تغيير فيهم. وإذا اشتركت المنشأة بموجب العقد في تحسين الخدمة، فإن النسخ التي يحتفظ بها صوت نجدي لهذا الغرض تُودَع في مخزن مستقل داخل المملكة العربية السعودية (الدمام).",
  },
  {
    locale: "en",
    doc: "privacy",
    section: "2. Where data is stored",
    line: 170,
    current:
      "Permanent platform storage is in the Gulf region (Doha) with a major global cloud provider, over private networking, with backups and point-in-time restore.",
    replacement:
      "Permanent platform storage is in the Gulf region (Doha) with a major global cloud provider, over private networking, with backups and point-in-time restore. Call transcripts and audio kept to improve the service and its AI, for businesses that opt in under their contract, are held separately in a dedicated store in Saudi Arabia (Dammam).",
  },
  {
    locale: "en",
    doc: "dpa",
    section: "Processing commitments",
    line: 263,
    current: "• Processing strictly to operate the service, per the business's instructions.",
    replacement:
      "• Processing to operate the service, per the business's instructions. Where the business opts in under its contract to improving the service and its AI, Saut Najdi keeps copies of its call transcripts and audio for that purpose in a separate store, and is the controller of that store, as set out in the privacy policy.",
  },
  {
    locale: "en",
    doc: "dpa",
    section: "Processing commitments",
    line: 264,
    current:
      "• Permanent storage in the Gulf region (Doha), with full disclosure of sub-processors and their locations in a list provided on request and attached to this agreement, and notice before any change to them.",
    replacement:
      "• Permanent storage in the Gulf region (Doha), with full disclosure of sub-processors and their locations in a list provided on request and attached to this agreement, and notice before any change to them. Where the business opts in under its contract to improving the service, the copies Saut Najdi keeps for that purpose are held in a separate store in Saudi Arabia (Dammam).",
  },
];
