import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

/**
 * /solutions/retail — sector page (blueprint §6.3, spec P2-22 row 6).
 * Same template as the other sector pages, plus the honest limit this
 * sector needs said out loud: the agent does not read your store or
 * courier system, so "where is my order" is captured and routed, not
 * looked up. Claiming a live lookup would be an integration we don't have.
 *
 * Dialogues are rendered locally: SampleConversation plays one fixed clinic
 * script and takes no `script` prop, and that file isn't this page's to
 * change — same bubble language, server rendered, Reveal for the entrance.
 */

// Positional — keep each array the same length as the section it feeds.
const handleIcons: IconName[] = ["phone", "doc", "clock", "chat", "wave", "people"];
const kbIcons: IconName[] = ["repeat", "globe", "chat", "clock", "retail", "cost"];
const afterIcons: IconName[] = ["chart", "people", "check"];

type Dialogue = { tag: string; caller: string; agent: string; note: string };

const t = {
  ar: {
    h1: "وصل طلبي؟ — رد على استفسارات عملائك بدون فريق",
    intro:
      "متجرك يبيع، والمكالمات تجي ورا بعض: وين طلبي؟ ينفع أرجّع؟ عندكم هذا المقاس في فرع الرياض؟ فريقك يرد على اللي يقدر عليه، والباقي يروح بريد صوتي ويرجع لك شكوى. وكيل صوت نجدي يرد على كل مكالمة بلهجة عميلك، يجاوب من سياساتك وبيانات فروعك، ويسجل تفاصيل أي استفسار يحتاج متابعة ويوصله لفريقك مرتب مع نص المكالمة.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "المكالمات اللي تفوتك",
      heading: "المكالمات اللي تفوتك — وأنت تشحن وتخدم في نفس الوقت",
      body: "مكالمات التجزئة كلها تتكرر: نفس الأسئلة الستة، بنفس الصياغة، عشرات المرات في اليوم. وأكثرها ما يحتاج موظف — يحتاج أحد يرد بسرعة وبمعلومة صحيحة. وهذي الست مكالمات اللي تشيل أغلب مكالماتك:",
      note: "حوارات توضيحية — هذا شكل المكالمة، مو تسجيلات حقيقية.",
      items: [
        {
          tag: "وين طلبي؟",
          caller: "طلبت من عندكم قبل ثلاثة أيام، وين وصل طلبي؟",
          agent: "أبشر. عطني رقم الطلب من الرسالة اللي وصلتك… تمام، سجلته. الشحن عادةً يوصل من يومين إلى خمسة أيام عمل — وسجلت استفسارك لخدمة العملاء ويرجعون لك اليوم بتحديث دقيق.",
          note: "الوكيل ما يفتح نظام متجرك — لكنه يرد فوراً، يشرح المدة المعتادة بالصياغة اللي اعتمدتها أنت، وياخذ رقم الطلب وتفاصيل الاستفسار ويوصلها لفريقك مرتبة.",
        },
        {
          tag: "الإرجاع والاستبدال",
          caller: "اشتريت جزمة والمقاس ما ضبط، ينفع أرجعها؟",
          agent: "إي ينفع. الإرجاع خلال 14 يوم من الاستلام والقطعة بحالتها وبكرتونها، والمبلغ يرجع لنفس وسيلة الدفع. تبيني أسجل لك طلب إرجاع بالتفاصيل؟",
          note: "أكثر سؤال في التجزئة، وأكثر سؤال ينحل بجواب واضح. الوكيل يقوله بنفس صياغة سياستك — ما يزيد ولا ينقص.",
        },
        {
          tag: "توفر منتج في فرع",
          caller: "عندكم القميص الأزرق مقاس L في فرع العليا؟",
          agent: "فرع العليا مفتوح لين 11 بالليل. توفر المقاس بالذات يحتاج أحد يتأكد من الرف — أسجل استفسارك برقم المنتج والمقاس وأحد من الفرع يرد عليك؟",
          note: "الوكيل ما يدّعي إنه يشوف مخزونك. يرد بالصدق، ويحوّل الاستفسار للفرع بتفاصيل تكفي عشان يردون من أول مرة.",
        },
        {
          tag: "أوقات ومواقع الفروع",
          caller: "فرع الخبر مفتوح اليوم؟ ولين كم؟",
          agent: "إي مفتوح اليوم من 10 الصبح إلى 11 بالليل، ويوم الجمعة يفتح بعد صلاة الجمعة. وموقعه في الشارع الرئيسي جنب المجمع — أعطيك أقرب علامة؟",
          note: "سؤال بسيط يتكرر مئات المرات في الشهر، وياخذ من وقت موظفك أكثر من أي سؤال ثاني.",
        },
        {
          tag: "العروض وشروطها",
          caller: "العرض اللي عندكم على الشنط بعده شغال؟ وينطبق على كل الموديلات؟",
          agent: "العرض شغال لين نهاية الشهر، وينطبق على الموديلات الكلاسيك بس — ما يشمل الإصدار المحدود. تبيني أعدد لك الموديلات الداخلة فيه؟",
          note: "شروط العرض إذا ما انقالت صح تتحول لخلاف عند الكاشير. الوكيل يقولها كاملة، بشروطها واستثناءاتها، لكل من يسأل.",
        },
        {
          tag: "منتج تالف — يروح لموظفك",
          caller: "وصلني المنتج مكسور وأبي أكلم مسؤول.",
          agent: "أعتذر منك، هذا ما يصير. أحوّلك الحين لموظف خدمة العملاء — ومعه رقم طلبك وكل اللي وصفته لي، ما تحتاج تعيد الكلام.",
          note: "طلب الإنسان تحويل فوري ما يتفاوض فيه الوكيل — والموظف يستلم وهو عارف القصة، فيبدأ بالحل مو بالأسئلة.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "حد واضح",
      heading: "الوكيل ما يفتح نظام متجرك — بس ما يضيّع الاستفسار",
      body: "نقولها بصراحة عشان ما تشتري توقع غلط: وكيل صوت نجدي ما يدخل على نظام متجرك ولا على نظام شركة الشحن عشان يجيب حالة الشحنة لحظة بلحظة. اللي يسويه أهم من كذا في أغلب المكالمات: يرد من أول رنة، ويجاوب على كل سؤال سياسة أو فرع أو عرض جواب دقيق بالصياغة اللي جهزناها معك من سياساتك، وما يخلي عميلك يسمع رنة فاضية.",
      body2:
        "وإذا كان السؤال يحتاج فتح النظام — «وين شحنتي بالضبط» — ياخذ رقم الطلب واسم العميل ورقمه ووش يبي بالضبط، ويسجلها طلب متابعة يوصل فريقك مع نص المكالمة والملخص. النتيجة العملية: العميل ما يتصل ثلاث مرات، وموظفك يرد مرة وحدة على معلومة كاملة بدل ما يبدأ بالسؤال «ممكن رقم الطلب؟».",
    },
    handles: {
      eyebrow: "وش يتكفل فيه الوكيل",
      heading: "وش يتكفل فيه الوكيل بنفسه؟",
      capsule:
        "وكيل صوت نجدي في التجزئة يرد على كل مكالمة من أول رنة بلهجة عميلك، ويجاوب على سياسة الإرجاع والاستبدال والضمان والشحن ورسومه، وأوقات الفروع ومواقعها، والعروض وشروطها، وطرق الدفع والفاتورة الضريبية — بالصياغة اللي جهزناها معك من سياساتك أنت. وأي استفسار يحتاج متابعة — حالة طلب، توفر مقاس في فرع — يسجله بتفاصيله كاملة لفريقك، ويحوّل الشكاوى والمبالغ لموظفك على طول.",
      items: [
        {
          title: "يرد على كل مكالمة بدون فريق كول سنتر",
          body: "متجر واحد أو علامة عندها عشرة فروع — نفس المشكلة: المكالمات كلها تجي في نفس الساعات، ومع أول عرض أو موسم تتضاعف. الوكيل يرد من أول رنة، ما فيه بريد صوتي ولا انتظار ولا «الرجاء المحاولة لاحقاً» يخلي عميلك يشتري من غيرك.",
        },
        {
          title: "يعرف سياساتك حرف بحرف",
          body: "الإرجاع، الاستبدال، الضمان، الشحن ورسومه ومدده، طرق الدفع، الفاتورة الضريبية. الوكيل يرد بالصياغة اللي كتبتها أنت، ما يجتهد ولا يوعد العميل بشي ما تقدر توفيه — وهذا وحده يقطع أكثر خلاف يصير عند الاستلام.",
        },
        {
          title: "أوقات ومواقع كل فرع",
          body: "كل فرع بموقعه وأوقاته، وأوقاته المختلفة يوم الجمعة وفي رمضان والأعياد، والخدمات اللي فيه: تجربة، تعديل، استلام أونلاين، إرجاع. العميل يسأل «مفتوح الحين؟» ويلقى جواب صحيح بأي ساعة يتصل فيها.",
        },
        {
          title: "ياخذ تفاصيل الاستفسار كاملة",
          body: "رقم الطلب، اسم العميل ورقمه، وش المشكلة بالضبط، ووش يتوقع يصير. يوصل فريقك مرتب مع نص المكالمة والملخص — بدل «واحد اتصل يسأل عن طلبه» مكتوبة على ورقة لاصقة على الشاشة.",
        },
        {
          title: "بلهجة عميلك — عربي أو إنجليزي",
          body: "الوكيل يرد بالنجدي أو الحجازي أو الخليجي أو بالعربية العامة، وبالإنجليزية للعميل اللي يفضلها، وينتقل بين اللغتين حسب اللي يسمعه. وتختار صوت الوكيل — رجل أو امرأة — على شخصية علامتك التجارية.",
        },
        {
          title: "يتذكر عميلك",
          body: "إذا اتصل عميل سبق وكلمكم، الوكيل يعرفه ويحييه باسمه ويعرف تفاعلاته السابقة معكم. العميل ما يشرح قصته من الأول كل مرة — وهذي بالذات الشي اللي يحس فيه العميل إنه يتعامل مع علامة محترمة.",
        },
      ],
    },
    human: {
      eyebrow: "وش يروح لموظفك",
      heading: "وش يروح لموظفك؟",
      capsule:
        "الوكيل ما يحاول يحل كل شي — وهذا مقصود. أربع حالات في التجزئة تروح لموظفك على طول: العميل يطلب إنسان، أو فيه شكوى ومنتج تالف، أو الموضوع فلوس واسترجاع، أو طلب جملة وفاتورة منشأة. والقواعد أنت اللي تحددها من اللوحة وتعدلها متى ما تبي.",
      items: [
        {
          title: "طلب الإنسان — تحويل فوري",
          body: "إذا قال العميل «أبي أكلم موظف»، الوكيل ما يجادل ولا يحاول يقنعه إنه يقدر يساعده. يحوّل على طول — قانون ثابت في المنصة كلها، مو إعداد ينسى أحد يشغله.",
        },
        {
          title: "شكوى أو منتج تالف",
          body: "وصل مكسور، ناقص قطعة، مختلف عن الصورة، أو تأخر أسبوع عن الموعد. هذي مواقف عميل فيها زعلان وله حق. الوكيل يعتذر، ياخذ رقم الطلب والتفاصيل، ويحوّل لموظفك ومعه النص كامل — عشان الموظف يبدأ بالحل.",
        },
        {
          title: "استرجاع مبلغ أو نزاع على فاتورة",
          body: "أي كلام عن مبلغ مسترجع، خصم، خطأ في الفاتورة، أو خصم انسحب مرتين من البطاقة — يروح لموظفك. والوكيل ما ياخذ بيانات بطاقات ولا يستوفي مبالغ في المكالمة أبداً.",
        },
        {
          title: "إلغاء أو تعديل طلب قبل الشحن",
          body: "العميل يبي يلغي طلبه، أو يغيّر عنوانه أو المقاس، قبل ما ينشحن. هذا يحتاج أحد يفتح النظام قبل لا يطلع الطلب من المستودع — والوقت فيه ضيق. الوكيل ياخذ رقم الطلب والتعديل المطلوب ويصعّدها لفريقك على طول، وما يوعد العميل إن التعديل تم.",
        },
        {
          title: "طلبات الجملة والشركات",
          body: "كمية كبيرة، فاتورة باسم منشأة، عرض سعر لجهة، أو طلب هدايا لموظفين. هذي مبيعات مو خدمة عملاء. الوكيل ياخذ الأساسيات — الجهة، الكمية، الموعد المطلوب — ويوصلها لفريق المبيعات جاهزة.",
        },
      ],
      outroLead: "وأياً كان السبب، موظفك يستلم ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ العميل معكم — ",
      outroLink: "اقرأ كيف يشتغل التصعيد بالتفصيل",
      outroPath: "product/human-handoff",
      outroTail: " وفريقك يقدر يتابع المكالمات وهي شغالة من اللوحة، ويسمع، ويستلم المكالمة بنفسه بضغطة وحدة.",
    },
    kb: {
      eyebrow: "قاعدة المعرفة",
      heading: "وش تحط في قاعدة معرفة متجرك؟",
      body: "كل ما كانت سياساتك مكتوبة بوضوح، قلّت المكالمات اللي تحتاج موظف. ترفع ملفاتك — Word أو نص أو مستندات ممسوحة ضوئياً، عندنا قراءة عربية للنص المصور — أو تكتبها أسئلة وأجوبة ومقتطفات قصيرة، أو تحط رابط صفحة السياسات عندك. منها نبني وكيلك، ومنها يرد على عملائك في قنوات المحادثة النصية — واتساب وتليجرام ومحادثة موقعك — وتتأكد من كل جواب بنفسك في المحادثة التجريبية قبل النشر. وهذي أهم ستة أشياء في متجر تجزئة:",
      items: [
        {
          title: "سياسة الإرجاع والاستبدال",
          body: "المدة، والشروط (الكرتون، البطاقة، الفاتورة)، والاستثناءات: الملابس الداخلية، المنتجات المخفضة، الإصدارات المحدودة، المنتجات المخصصة. وكيف يرجع المبلغ وكم ياخذ وقت. اكتبها بالتفصيل — لأن كل غموض فيها يرجع لك مكالمة زعل.",
        },
        {
          title: "الشحن والتوصيل",
          body: "شركات الشحن اللي تتعامل معها، المدد داخل المدينة وخارجها، الرسوم، حد الشحن المجاني، التوصيل السريع في نفس اليوم إذا متوفر، والاستلام من الفرع. وهذي بالذات تحدّثها في المواسم لأن المدد تتغير.",
        },
        {
          title: "سيناريو «وين طلبي؟»",
          body: "اكتب بالضبط وش يقوله الوكيل لما يسأل العميل عن طلبه: المدة المعتادة، وش تعني كل حالة في رسائل التتبع، ومتى يتصل العميل بشركة الشحن مباشرة. وحدد المعلومات اللي يجمعها قبل ما يوصل الاستفسار لفريقك.",
        },
        {
          title: "الفروع وأوقاتها",
          body: "عناوين الفروع وأوقاتها والأوقات الاستثنائية في رمضان والأعياد، والخدمات المتوفرة في كل فرع، وإذا كان فيه فروع تستقبل الإرجاع وفروع لا. العميل ما يفرق بين فروعك — يبي جواب عن الفرع اللي جنبه.",
        },
        {
          title: "المنتجات والعروض",
          body: "الفئات الرئيسية، المقاسات والألوان المتوفرة عادةً، العروض الحالية وشروطها وتاريخ انتهائها، وبرنامج الولاء إذا عندك واحد وكيف يستخدمه العميل. حدّث العروض أول بأول وجرب الرد في المحادثة التجريبية قبل النشر، عشان الوكيل ما يبيع عرضاً منتهي.",
        },
        {
          title: "الدفع والفواتير",
          body: "طرق الدفع المقبولة في المتجر وفي الفروع، التقسيط إذا متوفر ومع مين، الفاتورة الضريبية وكيف يطلبها العميل ومتى توصله، وسياستك لو انعرض سعر خاطئ على المنتج.",
        },
      ],
      outro:
        "وما تحتاج تكتبها كلها من أول يوم. ابدأ بسياسة الإرجاع والشحن وأوقات الفروع — هذي وحدها تغطي أغلب مكالماتك — وزد عليها كل أسبوع من الأسئلة اللي تشوفها في سجل مكالماتك.",
    },
    after: {
      eyebrow: "بعد المكالمة",
      heading: "وبعد ما تسكر المكالمة؟",
      body: "كل مكالمة تنحفظ في لوحتك: التسجيل، والنص كامل، وملخص عربي — مين اتصل، وش طلب، وش صار، ووش باقي. وفي التجزئة هذا مو بس أرشيف: هذا أوضح صورة تشوفها عن منتجاتك وسياساتك. لأن المكالمات تقول لك وش المنتج اللي يرجع كثير، وأي فرع يتكرر السؤال عنه، وأي سياسة ما أحد فاهمها.",
      items: [
        {
          title: "سجل مكالمات كامل",
          body: "كل مكالمة بوقتها ومدتها، مع التسجيل والنص والملخص. تسمع أي مكالمة، وتشوف وين قرر الوكيل يحوّل، وتراجع صياغته وتعدلها إذا ما مثّلت علامتك.",
        },
        {
          title: "ملف كل عميل",
          body: "كل مكالمة تنضاف لملف صاحبها مع تاريخ تعامله معكم. العميل ما يعيد قصته، وموظفك يعرف قبل ما يرد إذا كان هذا العميل اتصل ثلاث مرات على نفس المشكلة.",
        },
        {
          title: "وسوم وتقييم",
          body: "حط على المكالمات وسوم زي «إرجاع» أو «تأخر شحن» أو «سؤال عن عرض»، وقيّم ردود الوكيل. بعد شهر تكون عندك صورة واضحة: وش تعدله في سياساتك، ووش تضيفه لقاعدة المعرفة.",
        },
      ],
    },
    template: {
      heading: "تبدأ من صفر؟ لا — قالب التجزئة جاهز",
      body: "عندنا قالب مكتوب لقطاع التجزئة: شخصية وكيل مصممة لخدمة عملاء متجر، وسيناريوهات الإرجاع والشحن وحالة الطلب وتوفر المنتج في الفرع، وقواعد تصعيد جاهزة للشكاوى والمنتج التالف واسترجاع المبالغ وطلبات الجملة، وهيكل قاعدة معرفة فيه خانات السياسات والفروع والعروض تعبيها بمعلومات متجرك.",
      body2:
        "وإذا عندك أكثر من علامة أو أكثر من نوع نشاط تحت نفس الشركة، تسوي وكيل لكل وحدة بقاعدة معرفة خاصة فيها وقواعد تصعيد خاصة — وصلاحيات فريقك تتقسم عليها، فكل فريق يشوف مكالماته هو.",
      linkLead: "وطريقة الإعداد والتعديل والتجربة قبل النشر ",
      linkText: "موضحة خطوة خطوة في صفحة بناء الوكيل",
      linkPath: "product/agent-builder",
    },
    faqHeading: "أسئلة أصحاب المتاجر",
    faq: [
      {
        q: "الوكيل يقدر يشوف حالة طلب العميل في نظامنا؟",
        a: "لا. الوكيل ما يدخل على نظام متجرك ولا نظام الشحن. اللي يسويه: يرد فوراً، يشرح المدة المعتادة بالصياغة اللي اعتمدتها أنت، وياخذ رقم الطلب وتفاصيل الاستفسار كاملة ويوصلها لفريقك مع نص المكالمة — فتردون مرة وحدة على معلومة كاملة.",
      },
      {
        q: "يرد على واتساب وتليجرام بعد؟",
        a: "القنوات النصية — واتساب وتليجرام ومحادثة الموقع — تجي في نفس صندوق فريقك الموحد، والرد الآلي على الرسائل يرد من قاعدة معرفتك حسب إعداد حسابك. والمكالمات الصوتية يردها الوكيل تلقائياً.",
      },
      {
        q: "عندنا كذا فرع — الوكيل يفرق بينها؟",
        a: "إي. كل فرع بموقعه وأوقاته وخدماته في قاعدة معرفتك، ومنها نجهز ردود وكيلك — ويسأل العميل عن الفرع اللي يقصده قبل ما يجاوب — عشان ما يعطي عميل في الخبر أوقات فرع الرياض.",
      },
      {
        q: "وش يسوي مع العميل المعصب؟",
        a: "يعتذر ويصعّد لموظفك على طول، ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ العميل معكم. وطلب العميل الصريح لموظف بشري تحويل فوري ما يتفاوض فيه الوكيل.",
      },
      {
        q: "نقدر نسمع المكالمات ونتأكد من الردود؟",
        a: "إي. كل مكالمة عندك بتسجيلها ونصها وملخصها، وتقدر تقيّمها وتحط عليها وسوم. وفريقك يقدر يتابع المكالمات وهي شغالة من اللوحة، ويسمع، ويستلم المكالمة بنفسه إذا حس إنها تحتاج تدخل.",
      },
      {
        q: "كيف نبدأ؟",
        a: "احجز عرضاً تعريفياً — نشوف حجم مكالماتك وأكثر الأسئلة اللي تجيك، ونجهز لك القالب وقاعدة المعرفة وقواعد التصعيد بأنفسنا. ما في تسجيل ذاتي: كل عميل نجهزه معه خطوة خطوة.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "“Has my order arrived?” — answer every customer without a call centre",
    intro:
      "Your store is selling, and the calls stack up: where's my order, can I return this, do you have this size in the Riyadh branch? Your team answers what it can, and the rest goes to voicemail and comes back as a complaint. The Saut Najdi agent answers every call in your customer's dialect, in the wording we set up with you from your own policies and branch information, and captures the details of anything that needs following up — delivered to your team organised, with the transcript attached.",
    cta: "Book a demo",
    calls: {
      eyebrow: "The calls you're missing",
      heading: "The calls you miss while you're shipping and serving at once",
      body: "Retail calls repeat: the same six questions, in the same words, dozens of times a day. Most of them don't need an employee — they need someone to answer quickly with the right information. These six carry the bulk of your call volume:",
      note: "Illustrative dialogue — this is what a call looks like, not a real recording.",
      items: [
        {
          tag: "Where is my order?",
          caller: "I ordered three days ago — where has my order got to?",
          agent: "Of course. Could you give me the order number from the message you received… got it, noted. Shipping normally takes two to five working days — and I've logged your enquiry with customer service, who'll come back to you today with an exact update.",
          note: "The agent doesn't open your store system — but it answers instantly, explains the normal timeframe in the wording you approved, and captures the order number and the enquiry for your team.",
        },
        {
          tag: "Returns and exchanges",
          caller: "I bought a pair of shoes and the size doesn't fit — can I return them?",
          agent: "Yes you can. Returns are accepted within 14 days of delivery, with the item in its condition and its box, and the amount goes back to the same payment method. Shall I log a return request with the details?",
          note: "The most common question in retail, and the one most easily settled by a clear answer. The agent gives it in your policy's exact wording — nothing added, nothing dropped.",
        },
        {
          tag: "Is it in stock at a branch",
          caller: "Do you have the blue shirt in size L at the Olaya branch?",
          agent: "The Olaya branch is open until 11 tonight. Whether that exact size is on the shelf needs someone to check — shall I log your enquiry with the product code and size so someone at the branch calls you back?",
          note: "The agent never pretends to see your stock. It says so honestly, and routes the enquiry to the branch with enough detail for them to answer the first time.",
        },
        {
          tag: "Branch hours and locations",
          caller: "Is the Khobar branch open today? And until when?",
          agent: "Yes, it's open today from 10 in the morning until 11 at night, and on Friday it opens after Friday prayers. It's on the main street next to the mall — shall I give you the nearest landmark?",
          note: "A simple question asked hundreds of times a month — and one that takes more of your team's time than any other.",
        },
        {
          tag: "Offers and their conditions",
          caller: "Is the bag offer still running? And does it cover all the models?",
          agent: "The offer runs to the end of the month, and it applies to the classic models only — the limited edition isn't included. Would you like me to list the models it covers?",
          note: "An offer's conditions, half-explained, become an argument at the till. The agent states them in full — conditions and exclusions — to everyone who asks.",
        },
        {
          tag: "A damaged item — to your team",
          caller: "It arrived broken and I want to speak to someone in charge.",
          agent: "I'm sorry about that, it shouldn't have happened. I'm putting you through to customer service now — with your order number and everything you've described, so you won't have to repeat it.",
          note: "A request for a human is an immediate transfer the agent never negotiates — and the employee picks up already knowing the story, so they start with the fix.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "A clear boundary",
      heading: "The agent doesn't open your store system — but no enquiry is lost",
      body: "We'd rather you buy with the right expectation: the Saut Najdi agent does not log into your store platform or your courier's system to fetch a shipment status live. What it does matters more on most calls: it answers on the first ring, and it answers every policy, branch and offer question precisely, in the wording we set up with you from your own policies, so your customer never listens to a phone ringing out.",
      body2:
        "And when a question genuinely needs the system open — “where exactly is my shipment?” — it takes the order number, the customer's name and number, and precisely what they want, and logs a follow-up for your team with the transcript and summary. The practical result: the customer doesn't call three times, and your employee replies once, from complete information, instead of opening with “could I have your order number?”.",
    },
    handles: {
      eyebrow: "What the agent handles",
      heading: "What does the agent handle on its own?",
      capsule:
        "In retail, the Saut Najdi agent answers every call on the first ring in your customer's dialect, and covers returns, exchanges, warranty, shipping and its fees, branch hours and locations, offers and their conditions, payment methods and tax invoices — in the wording we set up with you from your own policies. Anything needing follow-up — an order status, a size at a branch — it captures in full for your team, and complaints or money questions go straight to your employee.",
      items: [
        {
          title: "Every call answered, without a call centre",
          body: "One store or a brand with ten branches — the same problem: the calls all arrive in the same hours, and any promotion or season doubles them. The agent answers on the first ring. No voicemail, no hold, no “please try again later” that sends your customer to buy somewhere else.",
        },
        {
          title: "It knows your policies word for word",
          body: "Returns, exchanges, warranty, shipping and its fees and timeframes, payment methods, tax invoices. The agent replies in the wording you wrote — it doesn't improvise and doesn't promise what you can't honour, which alone removes the argument that usually happens at handover.",
        },
        {
          title: "Hours and locations for every branch",
          body: "Each branch with its location and hours, its different hours on Fridays and in Ramadan and holidays, and the services it offers: fitting, alterations, online pickup, returns. A customer asking “are you open now?” gets a correct answer at any hour they call.",
        },
        {
          title: "It captures the enquiry in full",
          body: "The order number, the customer's name and number, exactly what the problem is and what they expect to happen. It reaches your team organised, with the transcript and the summary — instead of “someone called about their order” on a sticky note on a monitor.",
        },
        {
          title: "In your customer's dialect — Arabic or English",
          body: "The agent replies in Najdi, Hijazi or Khaleeji Arabic, in standard Arabic, or in English for customers who prefer it, switching by what it hears. You choose the voice — male or female — to match your brand's character.",
        },
        {
          title: "It remembers your customer",
          body: "When a customer who has called before rings again, the agent recognises them, greets them by name, and knows their previous interactions with you. They don't explain themselves from scratch every time — which is exactly what makes a brand feel like a serious one.",
        },
      ],
    },
    human: {
      eyebrow: "What goes to a human",
      heading: "What goes to your employee?",
      capsule:
        "The agent doesn't try to solve everything, and that's deliberate. Four retail situations go straight to your employee: the customer asks for a person, there's a complaint or a damaged item, money and refunds are involved, or it's a wholesale or corporate-invoice request. You set those rules from the dashboard and change them whenever you like.",
      items: [
        {
          title: "A request for a human — immediate",
          body: "If the customer says “I want to speak to someone,” the agent doesn't argue and doesn't try to convince them it can help. It transfers immediately — an iron law across the platform, not a setting somebody might forget to switch on.",
        },
        {
          title: "Complaints and damaged goods",
          body: "It arrived broken, a piece is missing, it doesn't match the photo, or it's a week late. These are customers who are upset and entitled to be. The agent apologises, captures the order number and the details, and transfers to your employee with the full transcript — so they start with the fix.",
        },
        {
          title: "Refunds and billing disputes",
          body: "Anything about a refunded amount, a discount, a billing error, or a card charged twice goes to your employee. And the agent never takes card details or collects payment on a call.",
        },
        {
          title: "Cancelling or changing an order before dispatch",
          body: "The customer wants to cancel, or change the address or the size, before the order ships. That needs someone in the system before it leaves the warehouse — and the window is short. The agent captures the order number and the change requested and escalates immediately, without promising the customer it's done.",
        },
        {
          title: "Wholesale and corporate requests",
          body: "A large quantity, an invoice in a company's name, a quotation for an organisation, or a staff gifting order. That's sales, not customer service. The agent captures the essentials — the organisation, the quantity, the date needed — and passes them to your sales team ready to act on.",
        },
      ],
      outroLead: "Whatever the reason, your employee inherits the escalation reason, the full transcript, an Arabic summary and the customer's history with you — ",
      outroLink: "read how escalation works in detail",
      outroPath: "product/human-handoff",
      outroTail: " Your team can also follow calls live from the dashboard, listen in, and take a call over in one click.",
    },
    kb: {
      eyebrow: "Your knowledge base",
      heading: "What belongs in your store's knowledge base?",
      body: "The more clearly your policies are written, the fewer calls need an employee at all. Upload your files — Word, plain text, or scanned documents, since Arabic OCR reads scans correctly — or write them as question-and-answer pairs and short snippets, or point at the policy page you already publish. It is what your agent is built from, it is what answers your customers on the text channels — WhatsApp, Telegram and your website chat — and you check every answer yourself in the test chat before publishing. Six things matter most in retail:",
      items: [
        {
          title: "Returns and exchange policy",
          body: "The window, the conditions (box, tags, receipt), and the exclusions: underwear, discounted items, limited editions, personalised goods. How the refund is returned and how long it takes. Write it in detail — every ambiguity comes back as an angry call.",
        },
        {
          title: "Shipping and delivery",
          body: "The couriers you use, timeframes inside and outside the city, fees, the free-shipping threshold, same-day delivery if you offer it, and in-branch pickup. Keep this one current in peak seasons, because the timeframes change.",
        },
        {
          title: "The “where's my order?” script",
          body: "Write out exactly what the agent should say when a customer asks about an order: the normal timeframe, what each tracking status means, and when the customer should contact the courier directly. And define what it must collect before the enquiry reaches your team.",
        },
        {
          title: "Branches and hours",
          body: "Branch addresses and hours, the exceptional hours in Ramadan and holidays, the services available at each, and whether some branches accept returns and others don't. Customers don't distinguish between your branches — they want an answer about the one near them.",
        },
        {
          title: "Products and offers",
          body: "Main categories, the sizes and colours you normally carry, current offers with their conditions and end dates, and your loyalty programme if you have one and how customers use it. Keep offers current and try the answer in the test chat before publishing, so the agent never sells an expired one.",
        },
        {
          title: "Payment and invoices",
          body: "Payment methods accepted online and in branch, instalment options and with whom, tax invoices — how a customer requests one and when it reaches them — and your policy when a wrong price is displayed on a product.",
        },
      ],
      outro:
        "You don't have to write it all on day one. Start with the returns policy, shipping and branch hours — those three alone cover most of your calls — then add each week from the questions you see in your own call log.",
    },
    after: {
      eyebrow: "After the call",
      heading: "And once the call ends?",
      body: "Every call is kept in your dashboard: the recording, the full transcript, and an Arabic summary — who called, what they wanted, what happened, what's still open. In retail that's not just an archive: it's the clearest picture you'll get of your products and your policies. The calls tell you which product comes back most, which branch keeps being asked about, and which policy nobody understands.",
      items: [
        {
          title: "A complete call log",
          body: "Every call with its time and duration, alongside the recording, transcript and summary. Listen to any call, see where the agent chose to hand over, and adjust its wording if it doesn't sound like your brand.",
        },
        {
          title: "A profile for every customer",
          body: "Each call joins its caller's profile with their history with you. The customer doesn't retell their story, and your employee knows before answering whether this person has called three times about the same thing.",
        },
        {
          title: "Tags and ratings",
          body: "Tag calls “return”, “late shipment” or “offer question”, and rate the agent's answers. A month later you have a clear picture: what to fix in your policies, and what to add to the knowledge base.",
        },
      ],
    },
    template: {
      heading: "Starting from nothing? No — the retail template is ready",
      body: "There's a written template for the retail sector: an agent persona built for store customer service, scenarios for returns, shipping, order status and availability at a branch, ready escalation rules for complaints, damaged goods, refunds and wholesale requests, and a knowledge-base skeleton with slots for policies, branches and offers that you fill with your own information.",
      body2:
        "If you run more than one brand or more than one line of business under the same company, each can have its own agent with its own knowledge base and escalation rules — and your team's permissions split the same way, so each team sees only its own calls.",
      linkLead: "How the setup, the editing and the test-chat check before publishing actually work ",
      linkText: "is shown step by step on the agent builder page",
      linkPath: "product/agent-builder",
    },
    faqHeading: "Questions from store owners",
    faq: [
      {
        q: "Can the agent see a customer's order status in our system?",
        a: "No. The agent doesn't log into your store platform or your courier's system. What it does: answer instantly, explain the normal timeframe in the wording you approved, and capture the order number and the full enquiry for your team along with the transcript — so you reply once, from complete information.",
      },
      {
        q: "Does it answer WhatsApp and Telegram too?",
        a: "The text channels — WhatsApp, Telegram and the website chat — all land in one shared team inbox, and automatic replies to messages answer from your knowledge base, depending on your account's configuration. Voice calls the agent answers automatically.",
      },
      {
        q: "We have several branches — does the agent distinguish between them?",
        a: "Yes. Each branch has its location, hours and services in your knowledge base, your agent is built from it, and it asks which branch the customer means before answering — so a customer in Khobar never gets the Riyadh branch's hours.",
      },
      {
        q: "What does it do with an angry customer?",
        a: "It apologises and escalates to your employee immediately, carrying the escalation reason, the full transcript, an Arabic summary and the customer's history with you. An explicit request for a person is always an immediate transfer.",
      },
      {
        q: "Can we listen to calls and check the answers?",
        a: "Yes. Every call is there with its recording, transcript and summary, and you can rate and tag it. Your team can also follow live calls from the dashboard, listen in, and take a call over when they feel it needs them.",
      },
      {
        q: "How do we start?",
        a: "Book an intro demo — we look at your call volume and the questions you get most, and we build the template, the knowledge base and the escalation rules for you. There's no self-signup: every customer is set up with us, step by step.",
      },
    ] as FaqItem[],
  },
} as const;

/** One mini-dialogue card — the SampleConversation bubble language, static. */
function DialogueCard({ item, delay }: { item: Dialogue; delay: number }) {
  return (
    <Reveal delay={delay}>
      <article className="card h-full">
        <p className="eyebrow">{item.tag}</p>
        <div className="mt-4 space-y-3">
          <div className="flex justify-start">
            <p className="max-w-[90%] rounded-2xl rounded-es-md bg-canvas px-4 py-3 text-body-lg leading-relaxed text-ink">
              {item.caller}
            </p>
          </div>
          <div className="flex justify-end">
            <p className="max-w-[90%] rounded-2xl rounded-ee-md bg-ink px-4 py-3 text-body-lg leading-relaxed text-white">
              {item.agent}
            </p>
          </div>
        </div>
        <p className="mt-4 text-body leading-relaxed text-ink/65">{item.note}</p>
      </article>
    </Reveal>
  );
}

export function RetailPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <span className="mx-auto mb-4 flex justify-center">
            <IconChip name="retail" />
          </span>
          <h1 className="mx-auto max-w-3xl text-h2 sm:text-h1">{s.h1}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-body-lg leading-relaxed text-ink/75">{s.intro}</p>
          <div className="mt-7">
            <CalButton calLink={CAL_LINK_DEMO} locale={locale}>{s.cta}</CalButton>
          </div>
        </div>
      </section>

      <TrustStrip locale={locale} />

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.calls.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.calls.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.calls.body}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {s.calls.items.map((item, i) => (
            <DialogueCard key={item.tag} item={item} delay={(i % 2) * 0.08} />
          ))}
        </div>
        <p className="mt-6 text-center text-body-sm text-ink/60">{s.calls.note}</p>
      </section>

      {/* The honest limit, said before the capability list rather than after:
          no store or courier integration exists, so no live order lookup. */}
      <section className="bg-navy py-14 text-white">
        <Reveal className="container mx-auto max-w-3xl text-center">
          <p className="eyebrow !text-brand-cyan">{s.boundary.eyebrow}</p>
          <h2 className="mt-2 text-h3">{s.boundary.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-white/80">{s.boundary.body}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-white/80">{s.boundary.body2}</p>
        </Reveal>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.handles.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.handles.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.handles.capsule}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {s.handles.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <article className="card card-hover group h-full">
                <IconChip name={handleIcons[i]} delay={i * 0.1} />
                <h3 className="mt-3 text-h4">{item.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{s.human.eyebrow}</p>
            <h2 className="mt-2 text-h2">{s.human.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.capsule}</p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
            {s.human.items.map((item, i) => (
              <Reveal key={item.title} delay={(i % 2) * 0.08}>
                <article className="card h-full border-s-4 border-s-brand-blue">
                  <h3 className="text-h4">{item.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 max-w-3xl text-center">
            <p className="text-body-lg leading-relaxed text-ink/70">
              {s.human.outroLead}
              <Link
                href={localePath(locale, s.human.outroPath)}
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                {s.human.outroLink}
              </Link>
              {"."}
              {s.human.outroTail}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.kb.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.kb.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.kb.body}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {s.kb.items.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <article className="card card-hover group h-full">
                <IconChip name={kbIcons[i]} delay={i * 0.1} />
                <h3 className="mt-3 text-h4">{item.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-body-lg leading-relaxed text-ink/70">{s.kb.outro}</p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="eyebrow">{s.after.eyebrow}</p>
            <h2 className="mt-2 text-h2">{s.after.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.after.body}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {s.after.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <article className="card card-hover group h-full">
                  <IconChip name={afterIcons[i]} delay={i * 0.1} />
                  <h3 className="mt-3 text-h4">{item.title}</h3>
                  <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h3">{s.template.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.template.body}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.template.body2}</p>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">
            {s.template.linkLead}
            <Link
              href={localePath(locale, s.template.linkPath)}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.template.linkText}
            </Link>
            {"."}
          </p>
        </Reveal>

        <div className="mx-auto mt-14 max-w-3xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const retailFaq = { ar: t.ar.faq, en: t.en.faq };
