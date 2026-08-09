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
 * /solutions/hotels — sector page (blueprint §6.3, spec P2-22 row 5).
 * Hero → the calls you miss, as mini-dialogues → what the agent handles →
 * what goes to a human → what goes in the knowledge base → sector FAQ →
 * demo CTA. The hotel template is genuinely shipped (research §3.1), so
 * «قالب جاهز لقطاعك» is said here honestly. No payment capture is claimed,
 * no numbers, no customer names.
 *
 * The dialogues are rendered locally rather than through SampleConversation:
 * that module plays one fixed clinic script and exposes no `script` prop,
 * and it is not this page's file to change. Same bubble language, server
 * rendered, Reveal doing the entrance.
 */

// Positional — keep each array the same length as the section it feeds.
const handleIcons: IconName[] = ["phone", "calendar", "doc", "wave", "clock", "people"];
const kbIcons: IconName[] = ["hotel", "cost", "repeat", "clock", "check", "globe"];
const afterIcons: IconName[] = ["chart", "calendar", "people"];

type Dialogue = { tag: string; caller: string; agent: string; note: string };

const t = {
  ar: {
    h1: "عندكم غرفة فاضية؟ — استقبال يرد 24 ساعة",
    intro:
      "هذا السؤال يوصلك عشرات المرات في اليوم، وأكثره يجي في أوقات ما فيها أحد فاضي عند الاستقبال: وقت تسجيل الدخول، ولا بعد منتصف الليل، ولا وأنت واقف مع نزيل قدامك. وكيل صوت نجدي يرد على كل مكالمة بلهجة النزيل، يشوف المتاح ويثبت الحجز، ويجاوب على أنواع الغرف والسياسات بالصياغة اللي جهزناها معك من معلومات فندقك — وأي شي يحتاج إنسان يوصل موظفك بكامل سياقه.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "المكالمات اللي تفوتك",
      heading: "المكالمات اللي تفوتك وأنت مشغول عند الاستقبال",
      body: "ما نتكلم عن مكالمات نظرية. هذي ست مكالمات تتكرر في أي فندق أو شقق مفروشة كل يوم — وكل وحدة منها إما حجز يدخل عندك، أو نزيل يسكّر ويحجز عند غيرك لأن ما أحد رد عليه. واللي يوجع مو المكالمة اللي تشوفها تدق وأنت مشغول، اللي يوجع المكالمة اللي ما تدري إنها جتك أصلاً.",
      note: "حوارات توضيحية — هذا شكل المكالمة، مو تسجيلات حقيقية.",
      items: [
        {
          tag: "توفر غرفة الليلة",
          caller: "مساء الخير، عندكم غرفة فاضية الليلة لشخصين؟",
          agent: "مساك الله بالخير. إي عندنا — غرفة مزدوجة متاحة الليلة والفطور داخل فيها. أثبتها لك باسمك؟",
          note: "الوكيل يتأكد من المتاح ويثبت الحجز داخل المكالمة نفسها، ما ينتظر أحد يرجع للنزيل بعدين.",
        },
        {
          tag: "أنواع الغرف والأسعار",
          caller: "وش الفرق بين الجناح والغرفة العائلية؟ وكم يطلع سعر ليلتين؟",
          agent: "الجناح فيه صالة منفصلة وغرفة نوم، والعائلية غرفة وحدة بسريرين كبار ودورة مياه. وأقدر أعطيك سعر الليلتين للاثنتين على طول — بأي وحدة أبدأ؟",
          note: "الفروق والأسعار تنكتب مرة وحدة عندك بالصياغة اللي ترضيك، ومنها نجهز رد وكيلك — يعطي نفس السعر ونفس الفرق لكل نزيل، بدون اجتهاد من موظف.",
        },
        {
          tag: "تعديل أو إلغاء حجز",
          caller: "حجزي يوم الخميس وأبي أأجله للجمعة، وإذا ما ينفع أبي ألغيه.",
          agent: "أبشر، خلني أشوف الجمعة… متاحة. أحوّل حجزك للجمعة وأعطيك رقم الحجز الجديد. وسياسة الإلغاء عندنا: مجاني قبل 24 ساعة من الوصول.",
          note: "التعديل والإلغاء من أكثر المكالمات اللي تاخذ وقت موظف الاستقبال — والوكيل يخلصها ويسجلها في تقويم الحجوزات.",
        },
        {
          tag: "الوصول المتأخر وتسجيل الخروج",
          caller: "راح أوصل الساعة 2 بالليل، يمديني أسجل دخول بهذا الوقت؟",
          agent: "إي، الاستقبال عندنا 24 ساعة وتقدر تسجل دخولك بأي وقت. وأذكّرك إن تسجيل الخروج الساعة 12 الظهر — أسجل ملاحظة وصول متأخر على حجزك؟",
          note: "سؤال بسيط، بس إذا ما رد عليه أحد الساعة 11 بالليل، النزيل يفتح تطبيق حجوزات ويحجز عند غيرك.",
        },
        {
          tag: "المرافق والموقع",
          caller: "فيه مواقف؟ والفطور داخل بالسعر ولا منفصل؟",
          agent: "فيه مواقف مجانية تحت المبنى، والفطور داخل في أسعار الغرف العائلية وبإضافة بسيطة على المفردة. وموقعنا على الطريق الرئيسي قريب من المخرج — أعطيك أقرب علامة توصلك؟",
          note: "معلومات ثابتة تكتبها مرة وحدة، ومنها نجهز ردود وكيلك — ما يخطئ فيها ولا ينساها ولا يعطي نزيلين جوابين مختلفين.",
        },
        {
          tag: "شكوى نزيل — تروح لموظفك",
          caller: "أنا نازل عندكم وغرفتي ما انظفت من أمس، أبي أكلم المسؤول.",
          agent: "أعتذر منك، هذا ما يصير. أحوّلك الحين لمسؤول النزلاء مباشرة — ومعه رقم غرفتك وكل اللي قلته لي.",
          note: "طلب النزيل للإنسان تحويل فوري ما يتفاوض فيه الوكيل — وموظفك يستلم المكالمة وهو قاري القصة كاملة.",
        },
      ] as Dialogue[],
    },
    handles: {
      eyebrow: "وش يتكفل فيه الوكيل",
      heading: "وش يتكفل فيه الوكيل بنفسه؟",
      capsule:
        "وكيل صوت نجدي في الفندق يرد على المكالمة من أول رنة بلهجة النزيل، يشوف الغرف المتاحة ويثبت الحجز ويعطي رقمه، ويجاوب على أنواع الغرف والأسعار وسياسة الإلغاء وأوقات تسجيل الدخول والخروج والمرافق والموقع بالصياغة اللي جهزناها معك من معلومات فندقك، ويسجل طلبات الاتصال برا الدوام، ويحوّل لموظفك أي شكوى أو حالة تحتاج إنسان — بكامل سياقها.",
      items: [
        {
          title: "يرد على كل مكالمة، 24 ساعة",
          body: "ما في مكالمة تروح على البريد الصوتي ولا نزيل يعلق على الخط لين يفضى الاستقبال. الوكيل يرد من أول رنة بأي وقت: وقت تسجيل الدخول والخروج، وليالي نهاية الأسبوع، وبعد منتصف الليل، وفي المواسم اللي يصير فيها الاستقبال أشغل ما يكون.",
        },
        {
          title: "يشوف المتاح ويثبت الحجز",
          body: "الوكيل يتأكد من الغرف المتاحة في التاريخ اللي يبيه النزيل، ويثبت الحجز باسمه وتفاصيله، ويعطيه رقم الحجز يقرأه رقم رقم عشان يقدر يكتبه ورا الجوال. والحجز يظهر في تقويم الحجوزات عندك في اللوحة مع تفاصيله ونص المكالمة اللي جاء منها.",
        },
        {
          title: "يرد بمعلوماتك أنت — مو من عنده",
          body: "أنواع الغرف، الأسعار، سياسة الإلغاء، سياسة الأطفال والسرير الإضافي، الفطور، المواقف، أوقات المسبح — كلها تجمعها في قاعدة معرفة فندقك، ومنها نجهز ردود وكيلك بصياغتك أنت. وإذا كان السؤال ما له جواب معتمد عندك، يقولها بصراحة ويسجل طلب اتصال بدل ما يخترع جواب يورطك.",
        },
        {
          title: "بلهجة نزيلك — عربي أو إنجليزي",
          body: "الفندق يجيه نزيل من داخل السعودية ونزيل من برا. الوكيل يرد بالنجدي أو الحجازي أو الخليجي أو بالعربية العامة، وبالإنجليزية للنزيل الأجنبي، وينتقل بين اللغتين حسب اللي يسمعه. وتختار صوت الوكيل — رجل أو امرأة — على شخصية فندقك.",
        },
        {
          title: "برا الدوام؟ ما في طريق مسدود",
          body: "إذا اتصل النزيل بوقت ما فيه أحد من فريقك وطلب شي يحتاج إنسان، الوكيل ما يقول له «كلمنا بكرة». يسجل طلب اتصال بتفاصيله والوقت اللي يناسبه، ويوعده إن أحد من الفندق يرجع له — والطلب يكون قدام فريقك في اللوحة أول ما يفتحونها.",
        },
        {
          title: "يعرف النزيل اللي رجع لك",
          body: "إذا اتصل نزيل سبق ونزل عندكم، الوكيل يعرفه ويحييه باسمه ويتذكر تفضيلاته: دور عالي، بعيد عن المصعد، سريرين منفصلين، وصول متأخر. هذي التفاصيل الصغيرة هي اللي تخلي النزيل يحس إنه راجع لمكان يعرفه — وهي اللي ترجعه.",
        },
      ],
    },
    human: {
      eyebrow: "وش يروح لموظفك",
      heading: "وش يروح لموظفك؟",
      capsule:
        "الوكيل ما يحاول يحل كل شي. أربع حالات في الفندق تروح لموظفك على طول: النزيل يطلب إنسان، أو شكوى واضحة، أو كلام عن مبالغ واسترجاع، أو حجز مجموعة وفعالية أكبر من صلاحيات الوكيل. والقواعد أنت اللي تحددها من اللوحة، وتعدلها متى ما تبي.",
      items: [
        {
          title: "طلب الإنسان — تحويل فوري",
          body: "إذا قال النزيل «أبي أكلم أحد» أو «حوّلني للمسؤول»، الوكيل ما يجادل ولا يحاول يقنعه إنه يقدر يساعده. يحوّل على طول. هذا قانون ثابت في المنصة كلها، مو إعداد ينسى أحد يشغله.",
        },
        {
          title: "شكوى نزيل داخل الفندق",
          body: "الغرفة ما انظفت، التكييف واقف، ضجة من الغرفة اللي جنب، طلب ما وصل. هذي مواقف تحتاج حل بشري وسرعة. الوكيل يعتذر، ياخذ رقم الغرفة والمشكلة، ويحوّل لموظفك ومعه النص كامل — عشان الموظف يبدأ بالحل مو بالأسئلة.",
        },
        {
          title: "مبالغ واسترجاع ونزاع على فاتورة",
          body: "أي كلام عن مبلغ أو استرجاع أو خصم أو خطأ في الفاتورة يروح لموظفك. والوكيل ما ياخذ بيانات بطاقة ولا يستوفي مبلغ في المكالمة — القرار المالي يبقى قرار موظفك.",
        },
        {
          title: "مجموعات وفعاليات وعقود شركات",
          body: "حجز عشرين غرفة لشركة، أو قاعة لمناسبة، أو سعر عقد سنوي — هذي مفاوضة مو استفسار. الوكيل ياخذ الأساسيات: الجهة، عدد الغرف، التواريخ، وطريقة التواصل، ويوصلها لفريق المبيعات عندك جاهزة يبدأون منها.",
        },
        {
          title: "طلبات استثنائية تحتاج موافقتك",
          body: "تسجيل دخول مبكر بدون رسوم، ترقية غرفة، تمديد إقامة بسعر خاص، أو استثناء من سياسة الإلغاء. هذي قرارات إدارية مو معلومات. الوكيل يشرح السياسة زي ما هي مكتوبة، وإذا أصر النزيل على استثناء يحوّل لموظفك — بدل ما يوعد بشي ما تقدر توفيه بعدين.",
        },
      ],
      outroLead: "وأياً كان السبب، موظفك يستلم ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ النزيل معكم — ",
      outroLink: "اقرأ كيف يشتغل التصعيد بالتفصيل",
      outroPath: "product/human-handoff",
      outroTail: " وفريقك يقدر بعد يتابع المكالمات وهي شغالة من اللوحة، يسمع، ويستلم المكالمة بنفسه بضغطة وحدة.",
    },
    kb: {
      eyebrow: "قاعدة المعرفة",
      heading: "وش تحط في قاعدة معرفة فندقك؟",
      body: "قاعدة المعرفة هي اللي تفرق بين وكيل يرد ردود عامة وبين وكيل يعرف فندقك. ترفع ملفاتك — Word أو نص أو مستندات ممسوحة ضوئياً، عندنا قراءة عربية للنص المصور — أو تكتبها أسئلة وأجوبة ومقتطفات قصيرة، أو تحط رابط صفحة موجودة عندك. منها نبني وكيلك، ومنها يرد على نزلائك في قنوات المحادثة النصية — واتساب وتليجرام ومحادثة موقعك — وتتأكد من كل جواب بنفسك في المحادثة التجريبية قبل النشر. وهذي أهم ستة أشياء في أي فندق:",
      items: [
        {
          title: "أنواع الغرف والأسرّة",
          body: "كل فئة غرفة: كم شخص تشيل، نوع الأسرّة وعددها، المساحة، وش فيها (شرفة، مطبخ صغير، إطلالة)، والفرق بينها وبين الفئة اللي فوقها. هذا ثاني أكثر سؤال بعد التوفر، وأكثر سؤال يتلخبط فيه موظف جديد.",
        },
        {
          title: "الأسعار والعروض الموسمية",
          body: "قائمة الأسعار حسب الفئة والموسم، والباقات: إقامة طويلة، عرض نهاية الأسبوع، سعر الإقامة مع الفطور. ووش داخل في السعر ووش خارج عنه. حدّثها في مكان واحد بدل ما تدور على كل موظف تخبره بالعرض، وجرب الرد الجديد في المحادثة التجريبية قبل النشر.",
        },
        {
          title: "سياسة الإلغاء والتعديل",
          body: "متى الإلغاء مجاني، ووش يصير بعد المدة، وسياسة عدم الحضور، وشروط الحجز غير القابل للاسترجاع، والفرق بين التعديل والإلغاء. هذي بالذات لازم تكون مكتوبة بدقة — لأن أي غموض فيها يرجع لك مكالمة شكوى بعد أسبوع.",
        },
        {
          title: "أوقات تسجيل الدخول والخروج",
          body: "الوقت الرسمي للدخول والخروج، وسياسة الوصول المتأخر، والخروج المتأخر وإذا كان عليه رسوم، وحفظ الشنط قبل الدخول وبعد الخروج. معلومة تنكتب في خمس دقايق وتوفر على استقبالك عشرات المكالمات في الشهر.",
        },
        {
          title: "المرافق والخدمات",
          body: "الفطور وأوقاته ووين يقدَّم، المسبح والنادي وأوقات الرجال والنساء، المواقف، الواي فاي، خدمة الغرف، الغسيل، قاعات الاجتماعات، وسياسة الأطفال والسرير الإضافي. وكل مرفق: شغال ولا مغلق للصيانة الحين.",
        },
        {
          title: "الموقع والاتجاهات",
          body: "العنوان بالضبط، المسافة من المطار ومن أشهر المعالم في المدينة، أقرب علامة يعرفها الناس، وإذا كان فيه توصيل من المطار وكم يكلف. النزيل اللي يسأل «وين بالضبط؟» يبي جواب يوصله، مو اسم شارع.",
        },
      ],
      outro:
        "والقاعدة البسيطة: أي سؤال تكرر عليك ثلاث مرات هالأسبوع — مكانه قاعدة المعرفة. كل ما زادت دقة اللي تكتبه، قلّت المكالمات اللي تحتاج موظف، وصار التصعيد للحالات اللي فعلاً تستاهل موظف. وما تحتاج تكتبها كلها من أول يوم: ابدأ بأنواع الغرف والأسعار وسياسة الإلغاء، وزد عليها كل أسبوع من الأسئلة اللي تشوفها في سجل مكالماتك.",
    },
    after: {
      eyebrow: "بعد المكالمة",
      heading: "وبعد ما تسكر المكالمة؟",
      body: "المكالمة ما تنتهي عند سماعة الاستقبال. كل مكالمة تجي لفندقك تنحفظ في لوحتك: التسجيل، والنص كامل، وملخص عربي واضح — مين اتصل، وش طلب، وش صار، ووش باقي عليك. وتقدر تدور في المكالمات، وتقيّمها، وتحط عليها وسوم زي «شكوى نظافة» أو «حجز مجموعة» — وبعد شهر تعرف وش أكثر شي يسأل عنه نزلاؤك، وتضيفه لقاعدة المعرفة عشان الوكيل يجاوب عليه بنفسه المرة الجاية.",
      items: [
        {
          title: "سجل مكالمات كامل",
          body: "كل مكالمة بتاريخها ووقتها ومدتها، مع التسجيل والنص والملخص. تسمع أي مكالمة، وتشوف وين بالضبط قرر الوكيل يحوّل ولا يجاوب، وتراجع كلامه كلمة كلمة قبل لا تعدل عليه.",
        },
        {
          title: "تقويم الحجوزات",
          body: "الحجوزات اللي سواها الوكيل تنزل في نفس التقويم مع اللي يسجله فريقك، ومعها اسم النزيل والتواريخ والملاحظات — عشان استقبالك يبدأ يومه على صورة وحدة واضحة، مو على ورقتين وثلاثة دفاتر.",
        },
        {
          title: "ملف كل نزيل",
          body: "كل مكالمة تنضاف لملف صاحبها: مكالماته السابقة وحجوزاته وتفضيلاته. النزيل ما يعيد قصته كل مرة، وأنت تعرف مين نزل عندك كم مرة قبل لا ترد عليه.",
        },
      ],
    },
    template: {
      heading: "تبدأ من صفر؟ لا — قالب الفنادق جاهز",
      body: "عندنا قالب مكتوب لقطاع الفنادق: شخصية وكيل مصممة لاستقبال فندقي، وسيناريوهات التوفر والحجز والتعديل والإلغاء والوصول المتأخر، وقواعد تصعيد جاهزة للشكاوى والمبالغ وحجوزات المجموعات، وهيكل قاعدة معرفة فيه خانات أنواع الغرف والأسعار والسياسات والمرافق تعبيها بمعلومات فندقك.",
      body2:
        "وإذا كان عندك أكثر من فندق أو أكثر من فرع، تسوي وكيل لكل فرع مربوط بقاعدة معرفة خاصة فيه — أسعاره وغرفه وسياساته — وصلاحيات فريقك تتقسم على الفروع: مدير الفرع يشوف مكالمات فرعه، والإدارة تشوف الكل. وما تعيد الإعداد من الصفر لكل فرع.",
      linkLead: "والإعداد نفسه — مين يجهز القالب معك، وكيف تعدل عليه بنفسك بعدين بدون كود، ووين تجربه قبل النشر — ",
      linkText: "مشروح خطوة خطوة في صفحة بناء الوكيل",
      linkPath: "product/agent-builder",
    },
    faqHeading: "أسئلة أصحاب الفنادق",
    faq: [
      {
        q: "الوكيل يحجز الغرفة داخل المكالمة ولا بس يسجل الطلب؟",
        a: "يحجز فعلياً. يتأكد من المتاح في التاريخ اللي يبيه النزيل، يثبت الحجز باسمه، ويعطيه رقم الحجز يقرأه رقم رقم عشان يكتبه — والحجز يظهر في تقويم الحجوزات في لوحتك مع نص المكالمة.",
      },
      {
        q: "وش يصير إذا اتصل نزيل يتكلم إنجليزي؟",
        a: "يرد عليه بالإنجليزية. الوكيل يشتغل بالعربية — نجدي وحجازي وخليجي — وبالإنجليزية، وينتقل حسب لغة المتصل بدون ما تسوي أي شي.",
      },
      {
        q: "يقدر ياخذ بيانات البطاقة أو يستوفي مبلغ الحجز؟",
        a: "لا. الوكيل ما ياخذ بيانات بطاقات ولا يستوفي مبالغ في المكالمة. أي شي يخص الدفع أو الاسترجاع يتحول لموظفك، وإذا كان برا الدوام يتسجل طلب اتصال يرجع له فريقك.",
      },
      {
        q: "وش تحتاجون منا عشان نبدأ؟",
        a: "معلومات فندقك: أنواع الغرف، الأسعار، سياسة الإلغاء، أوقات الدخول والخروج، والمرافق. وفريقنا يجهز الوكيل وقاعدة المعرفة وقواعد التصعيد معك — كل عميل نجهزه بأنفسنا، ما في تسجيل ذاتي.",
      },
      {
        q: "وين تنحفظ تسجيلات مكالمات نزلائنا؟",
        a: "اللي نحفظه عن نزيلك هو اسمه ورقمه وتفاصيل حجزه ونص مكالمته — وما فيه بيانات بطاقات أصلاً، لأن الوكيل ما ياخذ بيانات بطاقة في المكالمة أبداً. التخزين الدائم في منطقة الخليج (الدوحة) على Google Cloud، والتسجيلات تنحذف تلقائياً بعد 90 يوماً. والمعالجة اللحظية للصوت تمر عبر مزودين عالميين — نفصح عن هذا كله بالتفصيل في صفحة الأمان والبيانات.",
      },
      {
        q: "إذا انزعج النزيل، وش يسوي الوكيل؟",
        a: "يعتذر ويحوّل على طول لموظفك، ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ النزيل معكم. وطلب النزيل الصريح لإنسان تحويل فوري ما يتفاوض فيه الوكيل أبداً.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "“Do you have a room tonight?” — a front desk that answers 24/7",
    intro:
      "That question reaches your hotel dozens of times a day, and most of it lands when nobody at the desk is free: during check-in, after midnight, or while a guest is standing right in front of you. The Saut Najdi agent answers every call in the caller's own dialect, checks availability and confirms the booking, and answers room-type and policy questions in the wording we set up with you from your own information — and passes anything that needs a person to your employee with the full context attached.",
    cta: "Book a demo",
    calls: {
      eyebrow: "The calls you're missing",
      heading: "The calls you miss while the desk is busy",
      body: "These are not hypothetical calls. Six of them repeat in every hotel and serviced-apartment building, every single day — and each one is either a booking that lands with you, or a guest who hangs up and books somewhere else because nobody picked up. And the expensive one isn't the call you watch ring while you're busy; it's the call you never knew came in.",
      note: "Illustrative dialogue — this is what a call looks like, not a real recording.",
      items: [
        {
          tag: "A room tonight",
          caller: "Good evening — do you have a room free tonight for two people?",
          agent: "Good evening! Yes we do — a double room is available tonight, breakfast included. Shall I hold it in your name?",
          note: "The agent checks live availability and confirms the booking inside the call itself, instead of promising that someone will ring back.",
        },
        {
          tag: "Room types and rates",
          caller: "What's the difference between the suite and the family room? And what would two nights cost?",
          agent: "The suite has a separate living room and bedroom; the family room is one room with two large beds and its own bathroom. I can give you the two-night rate for either one right now — which shall I start with?",
          note: "The differences and the rates are written once, in the wording you approve, and the agent's answers are built from them — every guest hears the same rate, with no employee improvising.",
        },
        {
          tag: "Changing or cancelling",
          caller: "My booking is for Thursday — I'd like to move it to Friday, and cancel it if that isn't possible.",
          agent: "Of course. Let me check Friday… it's available. I'll move your booking to Friday and give you the new reference. Our cancellation policy is free of charge up to 24 hours before arrival.",
          note: "Changes and cancellations eat more front-desk minutes than anything else — the agent completes them and records them in your reservations calendar.",
        },
        {
          tag: "Late arrival and check-out",
          caller: "I'll get there at 2 in the morning — can I still check in at that hour?",
          agent: "Yes, our reception is staffed 24 hours and you can check in at any time. Just a reminder that check-out is at 12 noon — shall I add a late-arrival note to your booking?",
          note: "A small question — but if nobody answers it at 11 at night, that guest opens a booking app and stays somewhere else.",
        },
        {
          tag: "Facilities and location",
          caller: "Is there parking? And is breakfast included or extra?",
          agent: "There's free parking under the building, breakfast is included in the family-room rate and a small supplement on the single. We're on the main road right by the exit — shall I give you the nearest landmark?",
          note: "Fixed information you write once, and your agent's answers are built from it. It never gets it wrong, never forgets it, and never gives two guests two different answers.",
        },
        {
          tag: "A guest complaint — straight to your team",
          caller: "I'm staying with you and my room wasn't cleaned yesterday. I want to speak to the manager.",
          agent: "I'm sorry, that shouldn't have happened. I'm putting you through to the guest relations manager right now — with your room number and everything you've told me.",
          note: "A request for a human is an immediate transfer the agent never negotiates — and your employee picks up already knowing the whole story.",
        },
      ] as Dialogue[],
    },
    handles: {
      eyebrow: "What the agent handles",
      heading: "What does the agent handle on its own?",
      capsule:
        "In a hotel, the Saut Najdi agent answers on the first ring in the caller's dialect, checks available rooms, confirms the booking and reads back its reference, answers room types, rates, cancellation policy, check-in and check-out times, facilities and directions in the wording we set up with you from your hotel's information, logs callback requests outside working hours, and hands your employee any complaint or situation that needs a person — in full context.",
      items: [
        {
          title: "Every call answered, around the clock",
          body: "No call drops into voicemail and no guest waits on hold until the desk is free. The agent answers on the first ring at any hour: through check-in and check-out, on weekend nights, after midnight, and in the seasons when reception is at its busiest.",
        },
        {
          title: "Checks availability and confirms the booking",
          body: "The agent checks which rooms are free on the date the guest wants, confirms the booking in their name with the details, and reads the reference back digit by digit so it can actually be written down. The booking appears in your reservations calendar together with the transcript of the call it came from.",
        },
        {
          title: "It answers with your information — not from imagination",
          body: "Room types, rates, cancellation policy, children and extra-bed policy, breakfast, parking, pool hours — you collect all of it in your hotel's knowledge base, and your agent's answers are built from it in your own wording. When a question has no approved answer, it says so plainly and logs a callback rather than inventing something you'll have to honour later.",
        },
        {
          title: "In your guest's dialect — Arabic or English",
          body: "A hotel takes calls from Saudi guests and from abroad. The agent replies in Najdi, Hijazi or Khaleeji Arabic, in standard Arabic, or in English for an international guest, switching by what it hears. You choose the voice — male or female — to fit your property's character.",
        },
        {
          title: "Closed? Still no dead end",
          body: "If a guest calls when nobody from your team is available and needs something only a person can do, the agent doesn't say “try tomorrow.” It logs a callback request with the details and their preferred time and promises someone from the hotel will get back to them — waiting in your team's dashboard the moment they open it.",
        },
        {
          title: "It recognises the guest who came back",
          body: "When a returning guest calls, the agent greets them by name and remembers their preferences: a high floor, away from the lift, twin beds, a late arrival. Those small details are what make a returning guest feel they've come back somewhere that knows them — and what brings them back again.",
        },
      ],
    },
    human: {
      eyebrow: "What goes to a human",
      heading: "What goes to your employee?",
      capsule:
        "The agent doesn't try to solve everything. Four situations in a hotel go straight to your employee: the guest asks for a person, there's a clear complaint, money or refunds come up, or a group or event booking exceeds what the agent is allowed to do. You set those rules from the dashboard and change them whenever you like.",
      items: [
        {
          title: "A request for a human — immediate",
          body: "If the guest says “put me through to someone,” the agent doesn't argue and doesn't try to convince them it can help. It transfers immediately. That's an iron law across the platform, not a setting somebody might forget to switch on.",
        },
        {
          title: "A complaint from a guest in-house",
          body: "The room wasn't cleaned, the air conditioning is out, there's noise next door, an order never arrived. These need a human and they need speed. The agent apologises, captures the room number and the problem, and transfers to your employee with the full transcript — so they start with the fix, not with questions.",
        },
        {
          title: "Money, refunds and billing disputes",
          body: "Anything about an amount, a refund, a discount or a billing error goes to your employee. The agent never takes card details and never collects payment on a call — the financial decision stays your employee's decision.",
        },
        {
          title: "Groups, events and corporate rates",
          body: "Twenty rooms for a company, a hall for an occasion, an annual contract rate — that's a negotiation, not an enquiry. The agent captures the essentials — the organisation, the number of rooms, the dates, how to reach them — and passes a ready brief to your sales team.",
        },
        {
          title: "Exceptions that need your approval",
          body: "Free early check-in, a room upgrade, an extended stay at a special rate, a waiver of the cancellation policy. Those are management decisions, not information. The agent states the policy exactly as written, and if the guest presses for an exception it hands over — instead of promising something you'd have to honour later.",
        },
      ],
      outroLead: "Whatever the reason, your employee inherits the escalation reason, the full transcript, an Arabic summary and the guest's history with you — ",
      outroLink: "read how escalation works in detail",
      outroPath: "product/human-handoff",
      outroTail: " Your team can also follow calls live from the dashboard, listen in, and take a call over in one click.",
    },
    kb: {
      eyebrow: "Your knowledge base",
      heading: "What belongs in your hotel's knowledge base?",
      body: "The knowledge base is the difference between an agent that gives generic answers and one that knows your hotel. Upload your files — Word, plain text, or scanned documents, since Arabic OCR reads scans correctly — or write them as question-and-answer pairs and short snippets, or point at a page you already publish. It is what your agent is built from, it is what answers your guests on the text channels — WhatsApp, Telegram and your website chat — and you check every answer yourself in the test chat before publishing. These are the six that matter most in any hotel:",
      items: [
        {
          title: "Room types and beds",
          body: "Each category: how many people it sleeps, the beds and how many, the size, what's in it (balcony, kitchenette, view), and how it differs from the tier above. This is the second most common question after availability, and the one a new employee most often gets wrong.",
        },
        {
          title: "Rates and seasonal offers",
          body: "The rate list by category and season, and the packages: long stay, weekend offer, room-and-breakfast. What is included in the price and what isn't. Update it in one place instead of chasing every employee to tell them about the offer, and try the new answer in the test chat before you publish it.",
        },
        {
          title: "Cancellation and change policy",
          body: "When cancellation is free, what happens after that window, the no-show policy, the conditions on non-refundable bookings, and how a change differs from a cancellation. Write this one precisely — every ambiguity in it comes back as a complaint call a week later.",
        },
        {
          title: "Check-in and check-out times",
          body: "The official times, the late-arrival policy, late check-out and whether it carries a fee, and luggage storage before check-in and after check-out. Five minutes of writing that saves your desk dozens of calls a month.",
        },
        {
          title: "Facilities and services",
          body: "Breakfast, its hours and where it's served; pool and gym with men's and women's hours; parking; Wi-Fi; room service; laundry; meeting rooms; and the policy on children and extra beds. And for each: whether it's currently open or closed for maintenance.",
        },
        {
          title: "Location and directions",
          body: "The exact address, the distance from the airport and from the city's landmarks, the nearest point people actually recognise, and whether you run an airport transfer and what it costs. A guest asking “where exactly?” wants an answer that gets them there, not a street name.",
        },
      ],
      outro:
        "The simple rule: any question that has come up three times this week belongs in the knowledge base. The more precise what you write, the fewer calls need a person at all — and escalation is left for the cases that genuinely deserve one. You don't have to write all of it on day one either: start with room types, rates and the cancellation policy, then add to it each week from the questions you see in your call log.",
    },
    after: {
      eyebrow: "After the call",
      heading: "And once the call ends?",
      body: "A call doesn't end at the reception handset. Every call to your hotel is kept in your dashboard: the recording, the full transcript, and a clear summary — who called, what they wanted, what happened, and what's still open on you. You can search the calls, rate them, and tag them “housekeeping complaint” or “group booking” — so a month later you know what your guests actually ask about, and you add it to the knowledge base so the agent answers it itself next time.",
      items: [
        {
          title: "A complete call log",
          body: "Every call with its date, time and duration, alongside the recording, transcript and summary. Listen to any call, see exactly where the agent decided to hand over rather than answer, and review its wording line by line before you change it.",
        },
        {
          title: "The reservations calendar",
          body: "Bookings the agent made land in the same calendar as the ones your team enters, with the guest's name, the dates and the notes — so your desk starts the day on one clear picture instead of two notebooks and a sticky note.",
        },
        {
          title: "A profile for every guest",
          body: "Each call joins its caller's profile: previous calls, bookings and preferences. The guest never retells their story, and you know how many times they've stayed with you before you even pick up.",
        },
      ],
    },
    template: {
      heading: "Starting from nothing? No — the hotel template is ready",
      body: "There's a written template for the hotel sector: an agent persona built for hotel reception, scenarios for availability, booking, changes, cancellations and late arrivals, ready escalation rules for complaints, money and group bookings, and a knowledge-base skeleton with slots for room types, rates, policies and facilities that you fill with your own information.",
      body2:
        "If you run more than one property or more than one branch, you can give each branch its own agent tied to its own knowledge base — its rates, its rooms, its policies — and split your team's permissions across branches: a branch manager sees their branch's calls, head office sees everything. No rebuilding the setup from scratch for each one.",
      linkLead: "The setup itself — who builds the template with you, how you edit it yourself afterwards without code, and where you try it before publishing — ",
      linkText: "is explained step by step on the agent builder page",
      linkPath: "product/agent-builder",
    },
    faqHeading: "Questions from hotel operators",
    faq: [
      {
        q: "Does the agent actually book the room during the call, or just log the request?",
        a: "It books. It checks availability for the date the guest wants, confirms the booking in their name, and reads the reference back digit by digit — and the booking appears in your reservations calendar alongside the call transcript.",
      },
      {
        q: "What happens when an English-speaking guest calls?",
        a: "It answers in English. The agent works in Arabic — Najdi, Hijazi and Khaleeji — and in English, switching to the caller's language without you doing anything.",
      },
      {
        q: "Can it take card details or collect a deposit?",
        a: "No. The agent never takes card details and never collects payment on a call. Anything to do with payment or refunds is transferred to your employee, or logged as a callback if you're closed.",
      },
      {
        q: "What do you need from us to start?",
        a: "Your hotel's information: room types, rates, cancellation policy, check-in and check-out times, and facilities. Our team builds the agent, the knowledge base and the escalation rules with you — every customer is onboarded by us, there's no self-signup.",
      },
      {
        q: "Where are recordings of our guests' calls stored?",
        a: "What we hold about a guest is their name and number, their booking details and the transcript of their call — never card data, because the agent never takes card details on a call at all. Permanent storage is in the Gulf region (Doha) on Google Cloud, and recordings are automatically deleted after 90 days. Realtime speech processing transits global providers — all of it disclosed in detail on our security page.",
      },
      {
        q: "What does the agent do with an upset guest?",
        a: "It apologises and transfers immediately to your employee, carrying the escalation reason, the full transcript, an Arabic summary and the guest's history with you. And an explicit request for a human is always an immediate transfer the agent never negotiates.",
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

export function HotelsPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <span className="mx-auto mb-4 flex justify-center">
            <IconChip name="hotel" />
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

      <section className="bg-white py-16">
        <div className="container">
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
        </div>
      </section>

      <section className="container py-16">
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
      </section>

      <section className="bg-white py-16">
        <div className="container">
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
        </div>
      </section>

      <section className="container py-16">
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
      </section>

      <section className="bg-white py-16">
        <div className="container">
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
        </div>
      </section>

      <section className="container py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="mb-5 text-center text-h3">{s.faqHeading}</h2>
          <FaqAccordion items={s.faq} />
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}

export const hotelsFaq = { ar: t.ar.faq, en: t.en.faq };
