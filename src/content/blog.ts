/**
 * Blog content, both locales, as typed data rather than MDX.
 *
 * MDX would mean a new toolchain, a second content pipeline and arbitrary JSX
 * inside prose. Every other page on this site stores copy as a TS object
 * (content/meta.ts, content/faq.ts, content/chrome.ts) and renders it through
 * a component, so posts follow the same shape: the compiler catches a missing
 * translation, and nothing in a post can break layout.
 *
 * Slugs are Latin and IDENTICAL across locales. That is what lets /blog/<slug>
 * and /en/blog/<slug> be a clean hreflang pair; an Arabic slug would ship
 * percent-encoded and give the two locales unrelated URLs.
 *
 * EVERY factual claim below traces to something the site already says
 * (content/meta.ts, the FAQ set, SecurityPage, lib/schema.ts featureList).
 * No invented benchmarks, no customer counts, no accuracy percentages — a
 * blog post is not the place to start making claims the product pages do not.
 */

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "note"; text: string };

export interface BlogContent {
  title: string;
  /** SERP + OG description. Kept in the 70–160 char band the audit checks. */
  description: string;
  /** Listing-card summary. May repeat the description's idea, not its words. */
  excerpt: string;
  body: Block[];
}

export interface BlogPost {
  slug: string;
  /** ISO date, first publication. Drives sitemap lastmod and datePublished. */
  date: string;
  /** Topic labels. Display only — deliberately NOT routable tag pages, which
   *  would mint dozens of near-empty URLs and read as thin content. */
  tags: { ar: string[]; en: string[] };
  ar: BlogContent;
  en: BlogContent;
  /** Cover image path. Absent = the convention, /blog/<slug>.png. Pipeline-
   *  published posts set this to the shared weekly cover, because nothing can
   *  write into public/ after the build. */
  cover?: string;
}

export const posts: BlogPost[] = [
  // ────────────────────────────────────────────────────────────────────────
  // Weekly news roundup, 2026-08-17. Produced by the draft pipeline
  // (research grounded in 18 retrieved pages, every citation verified live at
  // review time), human-reviewed and approved from /admin/drafts.
  {
    slug: "saudi-ai-voice-insights-august-2026",
    date: "2026-08-17",
    tags: {
      ar: ["ذكاء اصطناعي", "صوت", "خدمة العملاء", "السعودية", "تقنية"],
      en: ["Artificial Intelligence", "Voice AI", "Customer Service", "Saudi Arabia", "Technology"],
    },
    ar: {
      title: "تطورات الذكاء الاصطناعي الصوتي",
      description:
        "نشرة أسبوعية للرؤساء التنفيذيين في السعودية تقيم أحدث تطورات الذكاء الاصطناعي الصوتي والبنية التحتية والحلول المؤسسية.",
      excerpt:
        "استعراض لأبرز تحركات الذكاء الاصطناعي الصوتي والبنية التحتية في السعودية والعالم بين 10 و17 أغسطس 2026.",
      body: [
        { t: "h2", text: "استثمارات البنية التحتية في المملكة تدعم الحلول الصوتية" },
        {
          t: "p",
          text: "تستمر المملكة في تعزيز موقعها الإقليمي كمركز رئيسي للتقنية والذكاء الاصطناعي. أظهرت تقارير Alvarez & Marsal الصادرة في 16 أغسطس 2026 أن توسعات البنية التحتية للذكاء الاصطناعي والسحابية في السعودية تتطلب رأسمال مشروع يصل إلى 42 مليار دولار بحلول عام 2030، مع زيادة قدرة حمولة تقنية المعلومات بمراكز البيانات نحو 1 جيجاوات. يدعم هذا التوسع قرار مجلس الوزراء بتسمية عام 2026 عام الذكاء الاصطناعي. بالنسبة للمشتري المحلي، توفر هذه البنية التحتية السحابية ومراكز البيانات الموزعة في الرياض والمملكة زمن استجابة منخفض جداً وتقليل مخاطر نقل البيانات عبر الحدود، مما يسهل الالتزام بنظام حماية البيانات الشخصية PDPL.",
        },
        {
          t: "p",
          text: "وفي سياق إعداد البيئة الوطنية، أُعلن في 14 أغسطس 2026 عن استضافة الرياض للدورة الرابعة للمنتدى العالمي لليونسكو وأسبوع الذكاء الاصطناعي العالمي. كما أعلنت وزارة التعليم في 17 أغسطس 2026 عن تحديث 22 مادة دراسية وتضمين 50 وحدة تعليمية تركز على الذكاء الاصطناعي في مناهج التعليم العام للعام الدراسي الجديد، مما يضمن تدفق كفاءات محليّة مؤهلة مستقبلاً.",
        },
        { t: "h2", text: "تكامل الأنظمة والتطبيقات في القطاعات المنظمة" },
        {
          t: "p",
          text: "تشهد منصات الاتصال المؤسسي تطوراً ملحوظاً في ربط الأنظمة وتسهيل إدارة المكالمات. في 17 أغسطس 2026، أعلنت AudioCodes عن حصول منصة Voca CIC على اعتماد نموذج التكامل Microsoft Teams Unify، حيث تنشر وكلاء صوتيين ينفذون عمليات التحقق والتقاط هدف المتصل ثم تحويله بكامل سياق التفاعل إلى موظفي مراكز الاتصال عبر Teams. يساعد هذا التكامل الشركات السعودية التي تعتمد على بيئات Microsoft وAzure على تطبيق الذكاء الاصطناعي دون الحاجة لتغييرات معمارية معقدة.",
        },
        {
          t: "p",
          text: "وعلى صعيد القطاعات المنظمة مثل القطاع المالي والصحي والحكومي، أعلنت Five9 بين 13 و15 أغسطس 2026 عن شراكة مع Regal عبر برنامج Five9 AI Agent Connect لتوفير متابعة آلية للمكالمات وتزامن بيانات المكالمات في الوقت الفعلي بين الموظفين والوكلاء الآليين.",
        },
        { t: "h2", text: "تحول الذكاء الاصطناعي الصوتي إلى توليد الإيرادات" },
        {
          t: "p",
          text: "يتجاوز الذكاء الاصطناعي الصوتي أداء المهام التقليدية لخدمة العملاء ليدخل مجالات المبيعات وإدارة التفاعلات المعقدة:",
        },
        {
          t: "ul",
          items: [
            "أعلنت OCAL Financial في 13 أغسطس 2026 عن اتفاقية حصريّة لنشر وكلاء SalesCloser عبر مراحل تمويل السيارات لمباشرة البيع التفاعلي عبر الصوت والفيديو والمتصفح.",
            "أطلقت Wave Sales في 17 أغسطس 2026 منصة صوتية موجهة لشركات تركيب الطاقة الشمسية السكنية تعتمد على طبقات ذاكرة متخصصة لإدارة رحلات العملاء المتعددة الأشهر.",
          ],
        },
        { t: "h2", text: "تطور نماذج المعالجة وأهمية الحوكمة" },
        {
          t: "p",
          text: "أعلنت شركة Wispr Flow في 17 أغسطس 2026 عن إغلاق جولة تمويلية Series B بقيمة 280 مليون دولار بتقييم بلغ ملياري دولار بقيادة Menlo Ventures، واستعرضت نموذج Canto للتعامل مع الأوامر الصوتية في البيئات المزدحمة والأصوات الخلفية واللكنات المختلفة، مما يعالج عقبات دقة التعرف الصوتي في مراكز الاتصال والعمليات الميدانية.",
        },
        {
          t: "note",
          text: "شهد يوم 11 أغسطس 2026 تقارير غير مؤكدة عن إيقاف OpenAI مؤقتاً لتطوير نموذج Astra لأسباب تتعلق بالسلامة، بالتزامن مع نشر معهد أمن الذكاء الاصطناعي البريطاني تقريراً أشار لـ 19 مخالفة سلامة. تؤكد هذه التطورات أهمية الاعتماد على نماذج هجينة تُبقي على العنصر البشري في الإشراف على العمليات المعقدة.",
        },
      ],
    },
    en: {
      title: "Enterprise Voice AI Updates",
      description:
        "A summary for Saudi business leaders on voice AI infrastructure, enterprise integrations, revenue applications, and system safety.",
      excerpt:
        "Key updates in voice AI, Saudi infrastructure investments, and enterprise integrations from August 10 to August 17, 2026.",
      body: [
        { t: "h2", text: "Saudi Infrastructure Expansion Supports Real-Time Voice" },
        {
          t: "p",
          text: "Saudi Arabia continues to build out the foundational infrastructure needed for enterprise AI deployment. On August 16, 2026, industry reports from Alvarez & Marsal outlined that the Kingdom's planned AI and cloud infrastructure expansion will require up to $42 billion in project capital by 2030. This expansion aims to increase data center IT load capacity toward 1GW, supporting the Cabinet's official designation of 2026 as the 'Year of Artificial Intelligence'.",
        },
        {
          t: "p",
          text: "For enterprise buyers in Saudi Arabia, local hyperscale capacity across Riyadh and the Kingdom helps ensure low-latency real-time voice interactions while satisfying strict data residency rules under the Personal Data Protection Law (PDPL). Alongside physical infrastructure, the Kingdom announced on August 14, 2026, that Riyadh will host the 4th UNESCO Global Forum on the Ethics of AI. Furthermore, on August 17, 2026, the Ministry of Education announced updates to 22 academic subjects and the integration of 50 AI educational units across general education curricula, strengthening long-term local talent development.",
        },
        { t: "h2", text: "Integration into Enterprise Workflows and Regulated Sectors" },
        {
          t: "p",
          text: "Recent announcements highlight a trend toward embedding AI voice capabilities directly into established enterprise IT architectures:",
        },
        {
          t: "ul",
          items: [
            "On August 17, 2026, AudioCodes announced Microsoft Teams Unify integration model certification for its Voca CIC platform. The system deploys AI voice agents in front of Teams Phone environments to authenticate callers and capture intent before transferring context to live agents.",
            "Between August 13 and 15, 2026, Five9 announced an integration with Regal via the Five9 AI Agent Connect program, focusing on automated follow-ups and real-time call data synchronization tailored for regulated industries like finance, healthcare, and telecom.",
          ],
        },
        { t: "h2", text: "Moving Beyond Basic Support to Revenue and Complex Journeys" },
        {
          t: "p",
          text: "Voice AI technologies are expanding from customer support cost reduction into revenue-generating sales channels and multi-month customer workflows. On August 13, 2026, OCAL Financial signed an exclusive deal to deploy SalesCloser AI agents across its vehicle-finance business, utilizing conversational AI for lead qualification and sales demos across voice, video, and web channels. Additionally, on August 17, 2026, Wave Sales launched an agentic voice AI platform featuring domain-specific memory layers designed to manage multi-month customer onboarding and financing journeys for residential solar installers.",
        },
        { t: "h2", text: "Noise-Resilient Speech Models and Safety Considerations" },
        {
          t: "p",
          text: "To address acoustic challenges in real-world environments, Wispr Flow announced on August 17, 2026, a $280 million Series B round led by Menlo Ventures at a $2 billion valuation. The company previewed 'Canto,' a speech model built to maintain accuracy in noisy environments such as open offices and field operations.",
        },
        {
          t: "note",
          text: "On August 11, 2026, unconfirmed reports indicated OpenAI temporarily paused internal development on its 'Astra' frontier model due to safety evaluations, alongside a UK AI Safety Institute report citing 19 safety violations in autonomous agent tests. Enterprise buyers should prioritize hybrid architectures that keep human operators in the loop for complex interactions.",
        },
      ],
    },
  },
  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "ai-call-answering-guide",
    date: "2026-08-16",
    tags: {
      ar: ["الرد الآلي", "مراكز الاتصال", "دليل شراء"],
      en: ["Call answering", "Contact centres", "Buyer guide"],
    },
    ar: {
      title: "الرد الآلي على المكالمات: دليل عملي قبل ما تشتري",
      description:
        "وش الفرق بين الرد الآلي القديم والوكيل الصوتي بالذكاء الاصطناعي؟ وكيف تقيّم أي حل قبل ما تشتريه — بأسئلة تقدر تسألها في أول اجتماع.",
      excerpt:
        "الفرق بين نظام الرد الآلي التقليدي والوكيل الصوتي، وخمس نقاط تقيس عليها أي حل قبل التوقيع.",
      body: [
        {
          t: "p",
          text: "أغلب المنشآت السعودية ما تخسر عملاءها في المكالمة — تخسرهم قبلها. المكالمة اللي ما أحد رد عليها، والرسالة اللي وصلت بعد ساعتين، والعميل اللي انتظر في قائمة انتظار ثم سكّر. المشكلة مو في فريقك؛ المشكلة إن حجم المكالمات ما يتوزع بالتساوي على اليوم.",
        },
        { t: "h2", text: "الرد الآلي القديم وش كان يسوي بالضبط؟" },
        {
          t: "p",
          text: "أنظمة IVR التقليدية تشتغل على شجرة خيارات: «اضغط ١ للحجوزات، اضغط ٢ للاستفسارات». هذي الأنظمة ما تفهم العميل، هي فقط تنقله. ولذلك تنكسر بسرعة لما يكون طلب العميل خارج الشجرة، أو لما يتكلم بلهجته الطبيعية بدل ما يختار رقم.",
        },
        {
          t: "p",
          text: "النتيجة اللي يعرفها أي شخص اتصل على خدمة عملاء: العميل يضغط صفر ويطلب موظف بشري من أول ثانية. الشجرة ما وفّرت وقت أحد.",
        },
        { t: "h2", text: "الوكيل الصوتي بالذكاء الاصطناعي مختلف كيف؟" },
        {
          t: "p",
          text: "الوكيل الصوتي ما يعطي خيارات — يسمع ويفهم ويرد. العميل يتكلم طبيعي، والوكيل يجاوب من معلومات منشأتك نفسها، ويقدر يكمّل الإجراء: يحجز موعد، يعدّل حجز، يجاوب عن ساعات العمل أو الأسعار المنشورة عندك.",
        },
        {
          t: "p",
          text: "والأهم: لما يوصل لسؤال خارج نطاقه، ما يعلّق العميل — يحوّله لموظف بشري ومعه سياق المكالمة كامل، عشان الموظف ما يبدأ من الصفر ويطلب من العميل يعيد كلامه.",
        },
        { t: "h2", text: "خمس نقاط قيس عليها أي حل" },
        {
          t: "ol",
          items: [
            "اللهجة: جرّبه باللهجة اللي يتكلمها عملاؤك فعلاً، مو بالعربية الفصحى. الفرق كبير، وأغلب الأنظمة تنكسر هنا أول شي.",
            "التصعيد: كيف تنتقل المكالمة للموظف البشري؟ وهل ينتقل معها النص والملخص، ولا الموظف يبدأ من الصفر؟",
            "مصدر المعلومة: من وين يجيب الوكيل إجاباته؟ لازم يكون من مستنداتك أنت — لا من معرفة عامة تخمّن فيها على منشأتك.",
            "الإشراف: تقدر تسمع مكالمة جارية، أو تهمس لموظفك، أو تستلم المكالمة بنفسك من لوحة التحكم؟",
            "الامتثال: وين تُخزَّن التسجيلات، وكم تبقى، ومين يقدر يوصل لها؟ اسأل عن سجل التدقيق قبل التوقيع.",
          ],
        },
        { t: "h2", text: "الأسئلة اللي تكشف الحل الضعيف بسرعة" },
        {
          t: "ul",
          items: [
            "«ورّني مكالمة فيها العميل قاطع الوكيل في نص كلامه» — التعامل مع المقاطعة أصعب بكثير من قراءة نص جاهز.",
            "«وش يصير لما يسأل سؤال ما تعرفون إجابته؟» — الجواب الصحيح هو التصعيد، مو محاولة تخمين.",
            "«ورّني لوحة التحكم وقت مكالمة حقيقية» — العرض المسجّل شي، والمكالمة المباشرة شي ثاني.",
            "«وين تُعالَج بيانات المكالمة جغرافياً؟» — لازم يكون عندهم جواب واضح ومكتوب.",
          ],
        },
        {
          t: "note",
          text: "ملاحظة: أي مورّد يرفض يعرض عليك مكالمة مباشرة بلهجتك، أو يجاوبك عن مكان معالجة البيانات بكلام عام، هذي إشارة كافية.",
        },
        { t: "h2", text: "من وين تبدأ" },
        {
          t: "p",
          text: "ابدأ بأكثر ثلاثة أسئلة تتكرر على مركز الاتصال عندك. لو الوكيل جاوب عليها صح بلهجة عملائك، وصعّد الرابع للموظف بسياق كامل — هذا الحل يستاهل تجربة أوسع.",
        },
      ],
    },
    en: {
      title: "AI call answering: a practical buyer's guide",
      description:
        "How an AI voice agent differs from a traditional IVR, and five things to test in any solution before you sign — with questions you can ask in the first meeting.",
      excerpt:
        "The difference between a traditional IVR and a voice agent, plus five criteria to judge any solution against before signing.",
      body: [
        {
          t: "p",
          text: "Most Saudi businesses don't lose customers during the call — they lose them before it. The call nobody answered, the message returned two hours later, the caller who waited in a queue and hung up. The problem usually isn't your team; it's that call volume never arrives evenly across a day.",
        },
        { t: "h2", text: "What the old automated systems actually did" },
        {
          t: "p",
          text: "Traditional IVR runs on a menu tree: press 1 for bookings, press 2 for enquiries. These systems don't understand the caller, they only route them. That breaks quickly the moment a request falls outside the tree, or the caller simply speaks naturally instead of choosing a number.",
        },
        {
          t: "p",
          text: "The result is familiar to anyone who has phoned a support line: the caller presses zero and asks for a human in the first second. The tree saved nobody any time.",
        },
        { t: "h2", text: "How an AI voice agent is different" },
        {
          t: "p",
          text: "A voice agent doesn't offer options — it listens, understands, and answers. The caller speaks normally, the agent answers from your own business's information, and it can complete the task: book an appointment, change a booking, answer a question about your hours or your published prices.",
        },
        {
          t: "p",
          text: "More importantly, when a question falls outside what it should handle, it doesn't strand the caller — it escalates to a human employee carrying the full context of the call, so nobody has to ask the customer to repeat themselves.",
        },
        { t: "h2", text: "Five things to judge any solution on" },
        {
          t: "ol",
          items: [
            "Dialect: test it in the dialect your customers actually speak, not Modern Standard Arabic. The gap is wide, and most systems fail here first.",
            "Escalation: how does a call reach a human? Does the transcript and summary travel with it, or does your employee start from nothing?",
            "Grounding: where do the answers come from? They must come from your documents — not from general knowledge guessing about your business.",
            "Supervision: can you listen to a live call, whisper to your employee, or take the call over yourself from the dashboard?",
            "Compliance: where are recordings stored, how long do they stay, and who can reach them? Ask about the audit log before you sign.",
          ],
        },
        { t: "h2", text: "Questions that expose a weak system fast" },
        {
          t: "ul",
          items: [
            "\"Show me a call where the customer interrupts mid-sentence.\" Handling interruption is far harder than reading a prepared script.",
            "\"What happens when it's asked something you don't have an answer for?\" The right behaviour is escalation, not a guess.",
            "\"Show me the dashboard during a real call.\" A recorded demo and a live call are not the same thing.",
            "\"Where is call data processed, geographically?\" They should have a clear, written answer.",
          ],
        },
        {
          t: "note",
          text: "A vendor who won't demo a live call in your dialect, or who answers the data-processing question in generalities, has told you what you need to know.",
        },
        { t: "h2", text: "Where to start" },
        {
          t: "p",
          text: "Start with the three questions your call centre repeats most. If an agent answers those correctly in your customers' dialect and escalates the fourth with full context, it has earned a wider trial.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "pdpl-call-recording-compliance",
    date: "2026-08-16",
    tags: {
      ar: ["PDPL", "حماية البيانات", "الامتثال"],
      en: ["PDPL", "Data protection", "Compliance"],
    },
    ar: {
      title: "تسجيل المكالمات ونظام حماية البيانات (PDPL)",
      description:
        "وش يعني نظام حماية البيانات الشخصية السعودي لتسجيلات مكالماتك؟ الإشعار، ومكان التخزين، ومدة الاحتفاظ، والأسئلة اللي تسألها أي مورّد.",
      excerpt:
        "الإشعار ومكان المعالجة ومدة الاحتفاظ — وكيف تسأل مورّدك أسئلة تكشف جاهزيته الحقيقية.",
      body: [
        {
          t: "p",
          text: "تسجيل المكالمات ممارسة قديمة في مراكز الاتصال، لكن نظام حماية البيانات الشخصية السعودي (PDPL) غيّر السؤال: مو «هل نسجّل؟» بل «على أي أساس، ووين تُخزَّن، ولكم؟».",
        },
        {
          t: "note",
          text: "هذي المقالة توضيحية وليست استشارة قانونية. لأي التزام محدد على منشأتك، راجع مستشارك القانوني.",
        },
        { t: "h2", text: "التسجيل الصوتي بيانات شخصية" },
        {
          t: "p",
          text: "صوت المتصل، ورقم جواله، وأي شي يذكره في المكالمة عن نفسه — كلها بيانات شخصية. والتسجيل يجمعها كلها في ملف واحد، وأحياناً يشمل بيانات أكثر حساسية إذا كان نشاطك صحياً أو مالياً.",
        },
        { t: "h2", text: "الإشعار قبل التسجيل" },
        {
          t: "p",
          text: "المتصل لازم يعرف إنه مسجَّل، ووش الغرض. الجملة اللي تنقال في بداية المكالمة مو إجراء شكلي — هي جزء من الإفصاح. واللي يهم إنها تكون واضحة ومفهومة، وباللغة اللي يتكلمها المتصل.",
        },
        { t: "h2", text: "وين تُعالَج البيانات فعلاً" },
        {
          t: "p",
          text: "هذي النقطة اللي يتجاوزها أغلب المورّدين بسرعة. أي حل صوتي يمر على عدة معالجات: تحويل الكلام لنص، ونموذج لغوي، وتحويل النص لصوت، وتخزين. كل واحد من هذولا يمكن يكون في دولة مختلفة.",
        },
        {
          t: "p",
          text: "السؤال الصحيح مو «هل بياناتنا في السعودية؟» — السؤال هو: «اعطني قائمة بكل معالج تمر عليه بيانات المكالمة، ووين يعالجها جغرافياً». المورّد الجاد عنده هذي القائمة جاهزة ويقدر يعطيك إياها عند الطلب.",
        },
        { t: "h2", text: "مدة الاحتفاظ" },
        {
          t: "p",
          text: "الاحتفاظ بالتسجيلات «للأبد» مو سياسة — هو غياب سياسة. لازم يكون عندك مدة محددة، وحذف تلقائي بعدها، وقدرة تثبت إن الحذف صار فعلاً.",
        },
        {
          t: "p",
          text: "في صوت نجدي، التسجيلات تُحذف تلقائياً بعد ٩٠ يوماً، ويوجد سجل تدقيق غير قابل للتعديل يوثّق الوصول للبيانات.",
        },
        { t: "h2", text: "أسئلة اسألها المورّد" },
        {
          t: "ol",
          items: [
            "اعطوني قائمة المعالجين الفرعيين وأماكن المعالجة — مكتوبة.",
            "كم مدة الاحتفاظ الافتراضية؟ وهل أقدر أغيّرها؟ وهل الحذف تلقائي؟",
            "مين من موظفيكم يقدر يوصل لتسجيلات عملائي، وكيف يُسجَّل هذا الوصول؟",
            "إذا طلب عميل حذف بياناته، وش الإجراء وكم ياخذ؟",
            "هل سجل التدقيق قابل للتعديل من طرفكم؟",
          ],
        },
        {
          t: "p",
          text: "لو جاوب المورّد على هذي الخمسة بوضوح ومكتوب، أنت قدام شريك يفهم السوق السعودي. ولو جاوب بعموميات عن «أمان عالمي المستوى»، عندك إجابتك.",
        },
      ],
    },
    en: {
      title: "Call recording and Saudi PDPL compliance",
      description:
        "What Saudi Arabia's PDPL means for your call recordings: notice, where data is processed, retention periods, and the questions to put to any vendor.",
      excerpt:
        "Notice, processing location and retention — plus how to question a vendor in a way that reveals real readiness.",
      body: [
        {
          t: "p",
          text: "Recording calls is long-standing practice in contact centres, but Saudi Arabia's Personal Data Protection Law changed the question. It is no longer \"do we record?\" but \"on what basis, stored where, and for how long?\"",
        },
        {
          t: "note",
          text: "This article is explanatory and is not legal advice. For obligations specific to your business, consult your legal counsel.",
        },
        { t: "h2", text: "A voice recording is personal data" },
        {
          t: "p",
          text: "The caller's voice, their number, and anything they mention about themselves during the call are all personal data. A recording collects all of it into one file — and where you operate in healthcare or finance, it can capture considerably more sensitive material.",
        },
        { t: "h2", text: "Notice before recording" },
        {
          t: "p",
          text: "The caller needs to know they are being recorded and why. The line played at the start of a call is not a formality; it is part of the disclosure. What matters is that it is clear, understandable, and in the language the caller actually speaks.",
        },
        { t: "h2", text: "Where the data is really processed" },
        {
          t: "p",
          text: "This is the point most vendors move past quickly. Any voice solution passes through several processors: speech-to-text, a language model, text-to-speech, and storage. Each of those can sit in a different country.",
        },
        {
          t: "p",
          text: "The right question isn't \"is our data in Saudi Arabia?\" It's: \"give me the list of every processor call data passes through, and where each one processes it.\" A serious vendor already has that list and can hand it over on request.",
        },
        { t: "h2", text: "Retention" },
        {
          t: "p",
          text: "Keeping recordings \"indefinitely\" is not a policy — it is the absence of one. You need a defined period, automatic deletion at the end of it, and the ability to show the deletion actually happened.",
        },
        {
          t: "p",
          text: "In Saut Najdi, recordings are deleted automatically after 90 days, and an append-only audit log records access to the data.",
        },
        { t: "h2", text: "Questions to put to a vendor" },
        {
          t: "ol",
          items: [
            "Give me your sub-processor list and processing locations — in writing.",
            "What is the default retention period? Can I change it? Is deletion automatic?",
            "Which of your staff can access my customers' recordings, and how is that access logged?",
            "If a customer requests deletion of their data, what is the process and how long does it take?",
            "Can the audit log be edited from your side?",
          ],
        },
        {
          t: "p",
          text: "If a vendor answers those five clearly and in writing, you are dealing with a partner who understands this market. If the answer is generalities about \"world-class security\", you also have your answer.",
        },
      ],
    },
  },

  // ────────────────────────────────────────────────────────────────────────
  {
    slug: "saudi-dialects-voice-ai",
    date: "2026-08-16",
    tags: {
      ar: ["اللهجات السعودية", "التعرف على الكلام", "الوكيل الصوتي"],
      en: ["Saudi dialects", "Speech recognition", "Voice agents"],
    },
    ar: {
      title: "ليش أنظمة الصوت العالمية تفشل مع اللهجات السعودية",
      description:
        "الفرق بين العربية الفصحى واللهجة النجدية والحجازية في أنظمة الصوت، وليش التبديل بين العربي والإنجليزي يكسر أغلب الأنظمة — وكيف تختبرها.",
      excerpt:
        "الفصحى مو اللهجة، والتبديل بين العربي والإنجليزي يكسر أغلب الأنظمة. كيف تختبر أي وكيل صوتي بجدية.",
      body: [
        {
          t: "p",
          text: "جرّب أي مساعد صوتي عالمي بجملة سعودية عادية: «أبغى أغيّر موعدي اللي بكرة الصبح». أغلب الأنظمة إما تفهمها غلط، أو ترد بالفصحى بطريقة تحسّ فيها إنك تكلم كتاب مدرسي.",
        },
        { t: "h2", text: "الفصحى ليست اللهجة" },
        {
          t: "p",
          text: "أغلب نماذج الصوت العربية تدرّبت على العربية الفصحى: نشرات الأخبار، الكتب، المحتوى الرسمي. وهذي عربية حقيقية، لكن ما أحد يحجز فيها موعد عيادة. عميلك يتكلم لهجته، والمسافة بين الاثنين مو مسألة «لكنة» — هي مفردات وتراكيب مختلفة.",
        },
        {
          t: "p",
          text: "كلمة مثل «توّه» أو «يبغى» أو «وش» ما تجيك في نشرة أخبار. والنظام اللي ما سمعها في التدريب، ما راح يفهمها في المكالمة.",
        },
        { t: "h2", text: "والسعودية نفسها ليست لهجة واحدة" },
        {
          t: "p",
          text: "النجدي في الرياض والقصيم يختلف عن الحجازي في جدة ومكة، وكلاهما يختلف عن لهجات المنطقة الشرقية والجنوب. النظام اللي يشتغل مع عميل في الرياض ممكن يتلعثم مع عميل في جدة، وأنت ما تلاحظ إلا بعد ما تفوتك مكالمات.",
        },
        { t: "h2", text: "المشكلة الأصعب: التبديل بين اللغتين" },
        {
          t: "p",
          text: "السعوديون يخلطون العربي بالإنجليزي داخل الجملة الواحدة بشكل طبيعي: «الـ appointment حقي كان الساعة خمس، أبغى أأجله». هذا التبديل داخل الجملة (code-switching) هو اللي يكسر أغلب الأنظمة، لأنها تفترض إن المكالمة بلغة واحدة وتختارها من البداية.",
        },
        {
          t: "p",
          text: "والنتيجة تكون واحدة من ثنتين: إما يترجم الكلمة الإنجليزية غلط، أو يفقد نص الجملة.",
        },
        { t: "h2", text: "كيف تختبر أي وكيل صوتي بجدية" },
        {
          t: "ol",
          items: [
            "تكلم بلهجتك الطبيعية، لا تبطّئ ولا تفصّح. الاختبار الحقيقي هو كيف تتكلم مع الناس، مو كيف تتكلم مع جهاز.",
            "اخلط كلمات إنجليزية في نص جملة عربية — أسماء منتجات، مواعيد، مصطلحات تقنية.",
            "قاطعه في نص كلامه وغيّر طلبك. المكالمات الحقيقية فيها مقاطعة وتردد.",
            "اطلب شي خارج نطاقه، وشوف: يصعّد للموظف، ولا يخمّن؟",
            "جرّبه بلهجة ثانية غير لهجتك، لو عملاؤك من مناطق مختلفة.",
          ],
        },
        { t: "h2", text: "وش تتوقع من حل مبني للسوق السعودي" },
        {
          t: "p",
          text: "يرد بلهجات سعودية — نجدي وحجازي وشامي — وبالعربية والإنجليزية، ويجاوب من مستندات منشأتك نفسها بدل التخمين، ويصعّد للموظف البشري بكامل السياق لما يوصل لحدوده. هذي مو ميزات إضافية؛ هذي الحد الأدنى عشان المكالمة تنتهي بعميل راضٍ.",
        },
      ],
    },
    en: {
      title: "Why global voice systems fail on Saudi dialects",
      description:
        "Why Modern Standard Arabic is not the dialect, how Arabic-English code-switching breaks most voice systems, and how to test properly.",
      excerpt:
        "MSA is not the dialect, and mid-sentence Arabic-English switching breaks most systems. How to test a voice agent seriously.",
      body: [
        {
          t: "p",
          text: "Try any global voice assistant with an ordinary Saudi sentence — the equivalent of \"I want to move my appointment, the one tomorrow morning.\" Most systems either mishear it or reply in Modern Standard Arabic so formal it feels like talking to a textbook.",
        },
        { t: "h2", text: "Modern Standard Arabic is not the dialect" },
        {
          t: "p",
          text: "Most Arabic voice models were trained on MSA: news broadcasts, books, official content. That is real Arabic, but nobody books a clinic appointment in it. Your customer speaks their dialect, and the distance between the two is not a matter of accent — the vocabulary and sentence structures genuinely differ.",
        },
        {
          t: "p",
          text: "Everyday dialect words simply don't appear in a news bulletin. A system that never heard them in training will not understand them on a call.",
        },
        { t: "h2", text: "And Saudi Arabia is not one dialect" },
        {
          t: "p",
          text: "Najdi in Riyadh and Qassim differs from Hijazi in Jeddah and Makkah, and both differ again from the Eastern Province and the south. A system that works for a caller in Riyadh can stumble with one in Jeddah — and you won't notice until calls have already been lost.",
        },
        { t: "h2", text: "The harder problem: code-switching" },
        {
          t: "p",
          text: "Saudis mix English into Arabic mid-sentence as a matter of course — dropping words like \"appointment\" or \"booking\" into an otherwise Arabic sentence. That mid-sentence switching is what breaks most systems, because they assume a call happens in one language and lock that choice in at the start.",
        },
        {
          t: "p",
          text: "The outcome is one of two things: the English word is transcribed as something else entirely, or half the sentence is simply lost.",
        },
        { t: "h2", text: "How to test a voice agent seriously" },
        {
          t: "ol",
          items: [
            "Speak in your natural dialect. Don't slow down and don't shift into MSA — the real test is how you speak to people, not how you speak to a device.",
            "Mix English words into an Arabic sentence: product names, times, technical terms.",
            "Interrupt it mid-sentence and change your request. Real calls contain interruption and hesitation.",
            "Ask for something outside its scope and watch: does it escalate to a human, or guess?",
            "Test a second dialect if your customers come from different regions.",
          ],
        },
        { t: "h2", text: "What to expect from something built for this market" },
        {
          t: "p",
          text: "It answers in Saudi dialects — Najdi, Hijazi and Levantine — in both Arabic and English, answers from your own documents rather than guessing, and escalates to a human with full context when it reaches its limits. These aren't bonus features; they are the minimum for a call that ends with a satisfied customer.",
        },
      ],
    },
  },
];

/** Newest first — the order the listing renders and the sitemap emits. */
export const sortedPosts = [...posts].sort((a, b) => b.date.localeCompare(a.date));

export function postBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

/**
 * Reading time from the post's own words. Arabic and English are counted the
 * same way at 200 wpm — close enough for a "5 min read" badge, and honest
 * because it is derived rather than typed in and left to rot.
 */
export function readingMinutes(c: BlogContent): number {
  const words = c.body
    .map((b) => ("text" in b ? b.text : b.items.join(" ")))
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
