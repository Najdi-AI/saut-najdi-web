import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// Positional icons — one per `kinds` card and one per `sections` card.
const kindIcons: IconName[] = ["chat", "doc", "globe", "check", "clock"];
const sectionIcons: IconName[] = ["doc", "database", "chat", "check", "shield", "repeat"];

/**
 * /product/knowledge-base (spec P2-22 row 7). Everything here traces to
 * research §3.1 "Knowledge base": six item kinds, true Arabic OCR via
 * Document AI (letter shaping on scans — never a diacritics claim),
 * Arabic-aware chunking → embeddings → semantic retrieval, per-agent
 * scoping and test panels. Live-call grounding is NOT claimable: the
 * blueprint §10.8 gate is not passed. Production inbound voice is served by
 * the orchestrator, which has no KB wiring at all — the `VOICE_KB_RETRIEVAL`
 * flag lives on the api service, which is not the production voice path.
 * Grounding copy on this page therefore stays scoped to the chat/text
 * channels and the test chat, and no roadmap promise is made either. Live-call
 * grounding copy stays out until the flag is verified in the production VOICE
 * path (the orchestrator), not the api service.
 * The OCR processing location is disclosed here, not hidden.
 */

const t = {
  ar: {
    h1: "حط ملفاتك… ووكيلك يجاوب منها",
    intro:
      "وكيل بدون معرفة نشاطك يرد ردود عامة تضيّع وقت عميلك. قاعدة المعرفة هي المكان اللي تحط فيه اللي يعرفه موظفك الشاطر: الأسعار، والسياسات، وأوقات الدوام، وأسئلة العملاء المتكررة — بملفاتك أنت، مو بنموذج تعبّيه من الصفر. والفكرة كلها إن وكيلك يرد على محادثات عملائك من محتواك، ولما ما يعرف — يقولها ويحوّل، بدل ما يخترع.",
    cta: "احجز عرضاً",
    answer: {
      heading: "كيف يجاوب الوكيل من ملفات نشاطي؟",
      capsule:
        "ترفع ملفاتك — PDF أو Word، حتى لو كانت صوراً ممسوحة — والمنصة تقرأها وتقسّمها تقسيماً يفهم العربي، وتفهرسها بحيث يصير البحث فيها بالمعنى مو بالكلمة الحرفية. ووقت ما يسأل عميلك في قنوات المحادثة النصية، الوكيل يدور على المقطع اللي يجاوب على سؤاله ويرد منه؛ وإذا ما لقى جواباً واضحاً، ما يخترع — يصعّد لموظفك أو يسجل طلب اتصال. وتقدر قبل هذا كله تجرب أي سؤال في اللوحة وتشوف من وين جاء الجواب بالضبط — من أي ملف ومن أي مقطع فيه. وكل تعديل ترفعه يظهر أثره على طول، بدون أي انتظار.",
    },
    kindsHeading: "وش تقدر تحط في قاعدة المعرفة؟",
    kindsLead: "خمسة أنواع من المحتوى، تخلطها زي ما تبي، وكل وكيل عندك تحدد له وش يقرأ منها.",
    kinds: [
      {
        title: "أسئلة وأجوبة",
        body: "السؤال بصيغة عميلك، والجواب بالصيغة اللي تبي وكيلك يقولها بالضبط — كلمة بكلمة. أسرع طريقة تضبط فيها رداً حساساً زي سياسة الإلغاء أو الاسترجاع أو الضمان، وأقلها احتمالاً للاجتهاد.",
      },
      {
        title: "ملفات",
        body: "PDF وWord (.docx) وملفات نصية (.txt / .md). قائمة الأسعار، ودليل الخدمات، وكتيّب الموظفين — ارفعها زي ما هي بدون ما تعيد كتابتها.",
      },
      {
        title: "روابط",
        body: "صفحة من موقعك تضيفها كمصدر بدل ما تنسخ محتواها — وتحدّثها بإعادة السحب أول ما يتغير محتواها.",
      },
      {
        title: "مقتطفات",
        body: "معلومة قصيرة ما تستاهل ملفاً: «الموقف مجاني للعملاء»، «الدفع كاش أو شبكة»، «الفرع الجديد يفتح بعد صلاة العصر».",
      },
      {
        title: "أوقات الدوام",
        body: "دوامك بالتفصيل — أيام، وفترات، وإجازات، وأوقات الذروة اللي تفضل ما تحجز فيها. الوكيل يبني عليه ردوده وقراره متى يسجل طلب اتصال بدل ما يوعد بموعد وأنتم مقفلين.",
      },
    ],
    sections: [
      {
        title: "وملفاتي ممسوحة ضوئياً — يقرأها؟",
        body:
          "يقرأها، وهذي وحدة من أكثر النقاط اللي تسقط فيها الأنظمة الأجنبية على المحتوى السعودي. وهذي نقطة تفرق كثير في العربي: أغلب أنظمة التعرّف الضوئي تطلع النص العربي بحروف متقطعة أو مقلوبة الترتيب، فيصير الملف موجوداً لكن غير قابل للاستخدام. عندنا التعرّف الضوئي مبني على محرّك يتعامل مع العربية كنص متصل: الحروف تطلع موصولة صح، وترتيب الكلمات في السطر صحيح، والجداول ما تنهرس. يعني تقدر ترفع قائمة أسعار مصوّرة، أو عقد ممسوح، أو منشوراً قديماً ما عندك ملفه الأصلي — ويصير محتوى يقدر وكيلك يرد منه. وننبهك لشي: نحن نتكلم عن قراءة الحروف الموصولة، مو عن التشكيل — الملف ما يحتاج يكون مشكّلاً أصلاً. ورفع الملف ما يوقفك عن شغلك: المعالجة تصير في الخلفية، وتشوف حالة كل ملف في اللوحة لين يصير جاهزاً. ونصيحة عملية: الملف الممسوح كل ما كان أوضح كان الاستخراج أدق — صورة مستقيمة وإضاءة معقولة تفرق كثير عن صورة مايلة ومظللة، وهذا شي بيدك تضبطه في دقيقة.",
      },
      {
        title: "كيف يلقى الوكيل الجواب الصحيح وسط كل هالمحتوى؟",
        body:
          "بعد ما يُقرأ الملف، ينقسم إلى مقاطع بطريقة تراعي العربية — بحيث ما تنقطع الجملة في نصها ولا يضيع سياق الفقرة — وكل مقطع ينفهرس بتمثيل رقمي يعبّر عن معناه. والنتيجة إن البحث يصير بالمعنى مو بالكلمة الحرفية: عميلك يسأل «كم تاخذ جلسة التبييض؟» وملفك مكتوب فيه «مدة جلسة تبييض الأسنان: 45 دقيقة» — بدون ما تتطابق الكلمات حرفياً، النظام يعرف إنه نفس الموضوع. وهذي أهم نقطة عملياً، لأن عميلك ما يسأل بنفس كلمات ملفك أبداً. وتقدر تحدد لكل وكيل نطاق قراءته: وكيل الفرع الشمالي يقرأ من ملفات فرعه بس، ووكيل الحجوزات ما يشوف ملفات الموارد البشرية. وكل جواب يرجع معه مصدره، يعني تقدر ترجع للملف الأصلي وتشوف من وين طلع الكلام بالضبط — وهذي أهم من الجواب نفسه لما تكون المعلومة حساسة زي سعر أو التزام تعاقدي، لأنك تقدر تصححها من مصدرها بدل ما تجادل الوكيل.",
      },
      {
        title: "هل يجاوب من ملفاتي في محادثات عملائي؟",
        body:
          "إي — على قنوات المحادثة النصية. وقت ما يسأل عميلك سؤالاً يخص نشاطك، الوكيل يدور في قاعدة معرفتك على المقطع اللي يجاوب، ويصيغ الرد منه بلهجته الطبيعية — يعني الجواب مربوط بمحتواك أنت، مو بمعلومات عامة من الإنترنت. والأهم من إنه «يعرف» هو إنه «ما يخترع»: إذا كان السؤال ما له جواب واضح في قاعدة معرفتك، ما يجتهد ويطلّع رقماً من راسه — يقول للعميل بصراحة إنه بيوصله لأحد من الفريق، ويصعّد لموظفك أو يسجل طلب اتصال إذا كان الوقت برا الدوام. وكل محادثة تشوف نصها وملخصها في لوحتك بعدين، فتقدر تعرف وين قاعدة معرفتك كانت ناقصة وتكمّلها.",
      },
      {
        title: "كيف أتأكد إن الجواب صح قبل ما أشغّله على عملائي؟",
        body:
          "ما نطلب منك تثق وتنتظر أول عميل حقيقي. في اللوحة لوحة اختبار للاسترجاع: تكتب السؤال زي ما بيقوله عميلك، وتشوف أي مقاطع من قاعدة معرفتك رجعت، ومن أي ملف جات — فتعرف إن كان النقص في المحتوى ولا في صياغة السؤال. وفوقها الشات التجريبي: تتكلم مع الوكيل نفسه بنفس معرفته وتشوف الرد كامل قبل ما تنشره. وأي تعديل — سعر تغيّر، سياسة تحدّثت، فرع جديد — ترفعه وتعيد الاختبار في نفس الجلسة. قاعدة المعرفة مو مشروع تسويه مرة وتنساه؛ هي أقرب شي لملف الموظف الجديد اللي تحدّثه كل ما تغيّر في نشاطك. وأفضل مصدر للتحديث عندك موجود أصلاً: نصوص المكالمات والمحادثات وملخصاتها في لوحتك توريك الأسئلة اللي تتكرر على عملائك — كل سؤال منها هو سطر ناقص في قاعدة معرفتك.",
      },
      {
        title: "يعني تدرّبون الذكاء الاصطناعي على ملفاتي؟",
        body:
          "لا، وهذا فرق مهم يستاهل توضيح. ملفاتك ما تروح تتدرب عليها نماذج عامة ولا تنخلط مع بيانات أحد ثاني. اللي يصير إن ملفاتك تتخزن لك أنت، وتنفهرس بطريقة تخلي البحث فيها سريعاً، ووقت السؤال يُسحب منها المقطع المناسب ويُعطى للوكيل عشان يصيغ منه رده. يعني الجواب مبني على نص موجود عندك تقدر ترجع له وتشوفه، مو على «شي حفظه النموذج». وفيه نتيجتين عمليتين لهالفرق: أولاً، لما تعدّل ملفاً أو تحذفه، الأثر يظهر مباشرة بدون ما تنتظر أي إعادة تدريب. ثانياً، بيانات منشأتك معزولة عن أي منشأة ثانية، والعزل مفروض على مستوى قاعدة البيانات نفسها.",
      },
      {
        title: "كل كم أحدّثها؟ ومين يقدر يعدّل فيها؟",
        body:
          "حدّثها كل ما تغيّر شي يقوله موظفك للعميل: سعر، أو دوام، أو خدمة جديدة، أو عرض انتهى. التحديث نفسه دقايق — ترفع الملف الجديد أو تعدّل السطر، وتعيد الاختبار وتشوف الفرق. ومين يقدر يعدّل؟ أنت تحدد: الصلاحيات في اللوحة تنضبط لكل موظف على حدة، فتخلي مسؤول العمليات يعدّل الأسعار بينما موظف الاستقبال يشوف بس. والتعديلات على المحتوى الحساس تمشي مع سجل التدقيق غير القابل للتعديل، فتقدر تعرف مين غيّر وش ومتى. ونصيحة عملية: خذ أكثر عشرة أسئلة تتكرر عليك في الهاتف وحطها أسئلة وأجوبة بصياغتك — هذي وحدها تغطي الجزء الأكبر من الأسئلة اللي تجيك كل يوم.",
      },
    ],
    disclosure: {
      heading: "وين تُعالَج ملفاتي؟",
      body:
        "نقولها بوضوح لأن هذا سؤال امتثال حقيقي: التخزين الدائم لبياناتك في منطقة الخليج (الدوحة) على Google Cloud، بينما تمر معالجة التعرّف الضوئي على مستندات قاعدة المعرفة عبر نقطة معالجة أوروبية. ما نقول لك إن كل شي داخل السعودية، لأن هذا غير دقيق اليوم — والإفصاح عن النقل عبر الحدود هو نفسه الموقف الصحيح أمام نظام حماية البيانات الشخصية.",
      link: { lead: "التفاصيل الكاملة في ", text: "صفحة الأمان والبيانات", path: "security" },
    },
    faqHeading: "أسئلة عن قاعدة المعرفة",
    faq: [
      {
        q: "وش صيغ الملفات اللي تقبلونها؟",
        a: "PDF وWord (.docx) وملفات نصية (.txt / .md)، بالإضافة إلى أسئلة وأجوبة وروابط ومقتطفات وأوقات الدوام. والملفات الممسوحة ضوئياً تنقرأ بتعرّف ضوئي عربي يطلع الحروف موصولة صح.",
      },
      {
        q: "هل الوكيل يجاوب من ملفاتي في الشات؟",
        a: "إي، على قنوات المحادثة النصية: الوكيل يدور في قاعدة معرفتك ويرد من محتواك أنت. وإذا ما لقى جواباً واضحاً ما يخترع — يصعّد لموظفك أو يسجل طلب اتصال. وتقدر تجرب أي سؤال في الشات التجريبي وتشوف الرد قبل ما تنشره.",
      },
      {
        q: "لازم أعيد كتابة ملفاتي بصيغة معينة؟",
        a: "لا. ارفعها زي ما هي، والمنصة تقرأها وتقسّمها وتفهرسها. اللي ينفع تكتبه يدوياً هو الردود الحساسة اللي تبي صياغتها بالحرف — وهذي تحطها كأسئلة وأجوبة.",
      },
      {
        q: "أقدر أخلي كل فرع يقرأ من ملفاته فقط؟",
        a: "تقدر. نطاق قاعدة المعرفة يتحدد لكل وكيل على حدة، فتخلي وكيل كل فرع يقرأ من محتوى فرعه، والوكلاء ما يتداخلون في ملفات بعض.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Upload your documents — your agent answers from them",
    intro:
      "An agent with no knowledge of your business gives generic answers that waste your customer's time. The knowledge base is where you put what a well-trained employee knows: prices, policies, opening hours, and the questions customers keep asking — built from your own documents, not from a blank form you have to fill in. The whole point is that your agent answers your customers' conversations from your content — and when it doesn't know, it says so and hands over instead of inventing.",
    cta: "Book a demo",
    answer: {
      heading: "How does the agent answer from my business documents?",
      capsule:
        "You upload your files — PDF or Word, including scans — and the platform reads them, splits them in a way that respects Arabic text, and indexes them so search works by meaning rather than by literal keyword. When your customer asks on your text chat channels, the agent finds the passage that answers the question and replies from it. If there is no clear answer, it does not invent one — it escalates to your employee or logs a callback. And before any of that, you can test any question in the dashboard and see exactly which file and which passage the answer came from. Every update you upload takes effect immediately, with nothing to wait for.",
    },
    kindsHeading: "What can go into the knowledge base?",
    kindsLead: "Five content types, mixed however you like — and you decide which of them each agent is allowed to read.",
    kinds: [
      {
        title: "Q&A pairs",
        body: "The question in your customer's words, the answer in exactly the wording you want your agent to use. The fastest way to lock down a sensitive reply like a cancellation or refund policy.",
      },
      {
        title: "Files",
        body: "PDF, Word (.docx), and plain text (.txt / .md). Price lists, service guides, staff handbooks — uploaded as they are, with no rewriting.",
      },
      {
        title: "Links",
        body: "A page on your own site you add as a source instead of copying its content across — re-ingest it whenever the page changes.",
      },
      {
        title: "Snippets",
        body: "A short fact that doesn't deserve a document: parking is free for customers, card and cash accepted, the new branch opens in the late afternoon.",
      },
      {
        title: "Working hours",
        body: "Your schedule in detail — days, shifts, holidays. The agent builds its answers on it, and decides when to log a callback instead of promising a slot while you're closed.",
      },
    ],
    sections: [
      {
        title: "My documents are scans — can it read those?",
        body:
          "It can, and in Arabic that is a real differentiator. Most OCR engines return Arabic as disconnected letters or with the word order reversed, which leaves you with a file that technically uploaded and is practically useless. Our OCR runs on an engine that treats Arabic as connected script: letters come out correctly joined, word order within the line is preserved, and tables aren't flattened into noise. So you can upload a photographed price list, a scanned contract, or an old brochure whose source file is long gone, and it becomes content your agent can answer from. One clarification worth making: this is about correctly reading joined letters, not about diacritics — your documents don't need to be vocalised. And uploading doesn't block your day: processing runs in the background and you watch each file's status in the dashboard until it's ready. One practical note: the cleaner the scan, the better the extraction — a straight page with reasonable lighting beats a tilted, shadowed photo by a wide margin, and that's a minute of your time.",
      },
      {
        title: "How does the agent find the right answer in all that content?",
        body:
          "Once a document is read, it is split into passages in a way that respects Arabic — so sentences aren't cut in half and paragraph context isn't lost — and each passage is indexed by a numeric representation of its meaning. The result is retrieval by meaning rather than by literal words: a customer asks how long a whitening session takes, your document says “teeth whitening session duration: 45 minutes,” and even though the wording never matches, the system knows it's the same subject. Practically, this is the whole game, because customers never phrase a question in your document's vocabulary. You also scope what each agent may read: the north-branch agent sees only its branch's material, and the bookings agent never sees HR files. Every answer carries its source, so you can open the original document and see exactly where the wording came from — which matters more than the answer itself when the fact is sensitive, like a price or a contractual commitment, because you can then fix it at the source instead of arguing with the agent.",
      },
      {
        title: "Does it answer from my documents in my customers' conversations?",
        body:
          "Yes — on the text chat channels. When your customer asks something specific to your business, the agent searches your knowledge base for the passage that answers it and phrases the reply naturally from that passage, so the answer is grounded in your content rather than in general information from the internet. More important than what it knows is what it refuses to do: if there is no clear answer in your knowledge base, it does not improvise a number — it tells the customer plainly that it will get them to someone, and escalates to your employee or logs a callback if you're closed. Every conversation's transcript and summary land in your dashboard afterwards, so you can see exactly where your knowledge base was thin and fill the gap.",
      },
      {
        title: "How do I check the answers before customers hear them?",
        body:
          "We don't ask you to trust it and wait for the first real customer. The dashboard has a retrieval test panel: you type the question the way your customer would ask it and see which passages came back and which file they came from — so you know whether the gap is in your content or in how the question was phrased. Above that sits the test chat, where you talk to the agent itself, with its actual knowledge, and read the full reply before publishing. Any change — a price moved, a policy updated, a branch added — you upload and re-test in the same sitting. A knowledge base isn't a one-off project; it's closer to the onboarding folder you keep updating as the business changes. And the best source for those updates is already in your hands: the call and conversation transcripts and summaries in your dashboard show you which questions your customers keep asking — each one is a missing line in your knowledge base.",
      },
      {
        title: "So you train an AI model on my documents?",
        body:
          "No — and the distinction matters. Your files are not used to train general models and are never mixed with anyone else's data. What happens is that your documents are stored for you, indexed so they can be searched quickly, and at question time the relevant passage is retrieved and handed to the agent to phrase its reply from. The answer is grounded in text that exists in your account and that you can go and read, not in something a model memorised. Two practical consequences follow: first, when you edit or delete a document the effect is immediate, with no retraining to wait for; second, your organisation's data is isolated from every other organisation's, and that isolation is enforced at the database level.",
      },
      {
        title: "How often should I update it, and who's allowed to?",
        body:
          "Update it whenever something changes that an employee would say to a customer: a price, your hours, a new service, an expired offer. The update itself takes minutes — upload the new file or edit the line, re-test, and see the difference. As for who may do it, that's yours to decide: permissions are set per employee in the dashboard, so an operations lead can edit pricing while a receptionist has read-only access. Changes to sensitive content sit alongside the append-only audit log, so you can see who changed what and when. One practical suggestion: take the ten questions you get most often on the phone and write them as Q&A pairs in your own wording — that alone covers a large share of the questions you get every day.",
      },
    ],
    disclosure: {
      heading: "Where are my documents processed?",
      body:
        "We state this plainly, because it is a genuine compliance question: permanent storage of your data is in the Gulf region (Doha) on Google Cloud, while OCR processing of knowledge-base documents runs through a European processing endpoint. We do not claim everything sits inside Saudi Arabia, because that isn't accurate today — and disclosing cross-border transfer is itself the correct posture under the PDPL.",
      link: { lead: "The full detail is on ", text: "the security and data page", path: "security" },
    },
    faqHeading: "Knowledge base questions",
    faq: [
      {
        q: "Which file formats do you accept?",
        a: "PDF, Word (.docx) and plain text (.txt / .md), alongside Q&A pairs, links, snippets and working hours. Scanned documents are read with Arabic OCR that returns correctly joined letters.",
      },
      {
        q: "Does the agent answer from my documents in chat?",
        a: "Yes, on the text chat channels: the agent searches your knowledge base and answers from your own content. If it finds no clear answer it doesn't invent one — it escalates to your employee or logs a callback. You can try any question in the test chat and see the reply before you publish it.",
      },
      {
        q: "Do I have to rewrite my documents in a particular format?",
        a: "No. Upload them as they are and the platform reads, splits and indexes them. The only thing worth writing by hand is a sensitive reply you want worded exactly — and that belongs in a Q&A pair.",
      },
      {
        q: "Can each branch read only its own material?",
        a: "Yes. Knowledge-base scope is set per agent, so each branch's agent reads only its branch's content and agents never cross into each other's files.",
      },
    ] as FaqItem[],
  },
} as const;

export function KnowledgeBasePage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="bg-gradient-to-b from-white to-canvas">
        <div className="container py-14 text-center">
          <h1 className="mx-auto max-w-3xl text-h2 sm:text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/70">{s.intro}</p>
          <div className="mt-7">
            <CalButton calLink={CAL_LINK_DEMO} locale={locale}>{s.cta}</CalButton>
          </div>
        </div>
      </section>

      {/* Answer-first paragraph: the whole pipeline in one liftable capsule. */}
      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.answer.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.answer.capsule}</p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-h2">{s.kindsHeading}</h2>
            <p className="mt-3 text-body-lg leading-relaxed text-ink/70">{s.kindsLead}</p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.kinds.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.06}>
                <article className="card card-hover group h-full">
                  <IconChip name={kindIcons[i]} delay={i * 0.08} />
                  <h3 className="mt-3 text-h4">{k.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{k.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl space-y-6">
          {s.sections.map((sec, i) => (
            <Reveal key={sec.title} delay={i * 0.04}>
              <article className="card group border-s-4 border-s-brand-cyan">
                <div className="flex items-start gap-4">
                  <IconChip name={sectionIcons[i]} className="shrink-0" delay={i * 0.1} />
                  <div>
                    <h2 className="text-h4">{sec.title}</h2>
                    <p className="mt-3 text-body-lg leading-relaxed text-ink/80">{sec.body}</p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* The processing-location disclosure belongs on this page, not only
            on /security — OCR is the one step that leaves the region. */}
        <Reveal className="mx-auto mt-10 max-w-3xl text-center">
          <h2 className="text-h3">{s.disclosure.heading}</h2>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.disclosure.body}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">
            {s.disclosure.link.lead}
            <Link
              href={localePath(locale, s.disclosure.link.path)}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.disclosure.link.text}
            </Link>
            {"."}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-2xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const knowledgeBaseFaq = { ar: t.ar.faq, en: t.en.faq };
