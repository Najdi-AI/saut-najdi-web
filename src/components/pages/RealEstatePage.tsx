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
 * /solutions/real-estate — sector page (blueprint §6.3, spec P2-22 row 4).
 * Same template as the other sector pages, plus one section this sector
 * needs by itself: the agent answers INBOUND enquiries and books viewings —
 * it never dials out. There is no dial worker (research §3.3), and real
 * estate is the sector most likely to assume otherwise, so the boundary is
 * stated outright instead of being left implied.
 *
 * Dialogues are rendered locally: SampleConversation plays one fixed clinic
 * script and takes no `script` prop, and that file isn't this page's to
 * change — same bubble language, server rendered, Reveal for the entrance.
 */

// Positional — keep each array the same length as the section it feeds.
const handleIcons: IconName[] = ["phone", "estate", "calendar", "doc", "chat", "clock"];
const kbIcons: IconName[] = ["estate", "badge", "doc", "calendar", "globe", "chat"];
const afterIcons: IconName[] = ["chart", "calendar", "people"];

type Dialogue = { tag: string; caller: string; agent: string; note: string };

const t = {
  ar: {
    h1: "الشقة للحين متاحة؟ — وكيلك يرد على كل مستفسر",
    intro:
      "المستفسر اللي شاف إعلانك ما ينتظر. يدق، وإذا ما رد أحد يدق على الإعلان اللي تحته. وكيل صوت نجدي يرد على كل مكالمة تجيك على إعلاناتك: يقول له إذا الوحدة متاحة، يعطيه المساحة والسعر والشروط زي ما جهزناها معك من بياناتك أنت، ويحجز له معاينة في وقت يناسب مندوبك — واللي يحتاج مختص يوصل موظفك بكامل تفاصيله.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "المكالمات اللي تفوتك",
      heading: "المكالمات اللي تفوتك وأنت في معاينة",
      body: "مكتب العقار كله مكالمات: إعلان واحد على منصة عقارية يجيب عشرات الاتصالات، وأغلبها يجي بعد الدوام وفي الإجازة. هذي ست مكالمات تتكرر عليك كل يوم — وكل مكالمة ما ترد عليها هي عميل راح لمكتب ثاني، مو بس رقم فايت.",
      note: "حوارات توضيحية — هذا شكل المكالمة، مو تسجيلات حقيقية.",
      items: [
        {
          tag: "توفر الوحدة",
          caller: "شفت إعلان الشقة في حي النرجس — للحين متاحة؟",
          agent: "هلا فيك. إي للحين متاحة — ثلاث غرف، دور ثاني، ومعها موقف خاص. تبيني أحجز لك معاينة؟",
          note: "أهم سؤال في القطاع كله، وأكثر سؤال يضيع لأن أحد ما رد. الوكيل يرد عليه من أول رنة وينقل المستفسر لخطوة الحجز على طول.",
        },
        {
          tag: "السعر والشروط",
          caller: "كم إيجارها سنوي؟ والدفع كم دفعة؟",
          agent: "الإيجار السنوي 55,000 ريال، والدفع عندنا دفعتين أو أربع دفعات حسب العقد. والتأمين شهر واحد يرجع لك بعد إخلاء الوحدة سليمة. تبي تفاصيل العقد السنوي؟",
          note: "السعر والدفعات والتأمين تنكتب مرة وحدة عندك بالصياغة اللي ترضيك، ومنها نجهز رد وكيلك — يقولها بنفس الصياغة لكل مستفسر، ما فيه اجتهاد ولا وعد زايد من مندوب.",
        },
        {
          tag: "حجز معاينة",
          caller: "أبي أشوفها بكرة العصر إذا ينفع.",
          agent: "بكرة العصر عندنا فاضي الساعة 5. أثبت لك معاينة الساعة 5، والمندوب اللي بيستقبلك اسمه فهد — أعطيك موقع الوحدة الحين؟",
          note: "المعاينة تنثبت في تقويمك باسم المستفسر ورقمه والوحدة — عشان مندوبك يطلع لموعد مؤكد، مو لـ«إن شاء الله أمر عليكم».",
        },
        {
          tag: "بدائل ومقارنة",
          caller: "هذي صغيرة علينا — عندكم شي أكبر في نفس الحي؟",
          agent: "عندنا في نفس الحي شقة أربع غرف بمساحة أكبر ودورها أول. أعطيك تفاصيلها، وإذا تبي أحجز لك معاينة للاثنتين بنفس اليوم عشان تقارن؟",
          note: "الوكيل يعرض البدائل اللي عندك في نفس الحي — فالمستفسر اللي ما ناسبته وحدة ما يطلع من عندك بيدين فاضيتين.",
        },
        {
          tag: "الموقع والخدمات حواليها",
          caller: "وين موقعها بالضبط؟ وقريبة من مدارس؟",
          agent: "على شارع الأمير سعود، مدخلها من الجهة الشمالية. أقرب مدرسة ابتدائية على بعد دقايق مشي، وفيه مسجد وبقالة في نفس الحي. أعطيك أقرب علامة توصلك؟",
          note: "«وين بالضبط؟» يتكرر في كل مكالمة تقريباً. اكتب العنوان وأقرب المعالم مرة وحدة، ومنها نجهز رد وكيلك وخلاص.",
        },
        {
          tag: "تمويل وتفاوض — يروح لموظفك",
          caller: "أبي أشتري بس أحتاج تمويل عقاري، وودي أفاوض على السعر.",
          agent: "هذا يبيله مختص عندنا. أحوّلك الحين لمستشار المبيعات — ومعه الوحدة اللي تسأل عنها وكل اللي قلته لي.",
          note: "التمويل والتفاوض والإجراءات النظامية ما يجتهد فيها الوكيل أبداً. يوصل المستفسر لمختص وهو محتفظ بكل تفاصيل المكالمة.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "حد واضح",
      heading: "الوكيل يرد على المكالمات الداخلة — ما يسوّق بالاتصال",
      body: "كثير من المكاتب أول ما تسمع «وكيل صوتي» تتخيل روبوت يدق على قوائم أرقام. هذا مو اللي نسويه، ولا ننوي نبيعك إياه: صوت نجدي وكيل رد على المكالمات الداخلة. المستفسر هو اللي يتصل عليك بعد ما يشوف إعلانك، والوكيل يرد عليه. ما فيه اتصال صادر، ولا حملات اتصال، ولا طلب تلقائي على أرقام عملاء محتملين — ببساطة لأن هذي القدرة مو موجودة عندنا اليوم، وما نبي نبيعك شي ما تستلمه.",
      body2:
        "وإذا اتصل مستفسر برا الدوام وطلب أحد يكلمه، الوكيل يسجل طلب اتصال بتفاصيله ووقته المفضل — وموظفك أنت هو اللي يرجع له. الفرق مهم: الوكيل يجهز لك المكالمة، ما يسويها بدالك.",
    },
    handles: {
      eyebrow: "وش يتكفل فيه الوكيل",
      heading: "وش يتكفل فيه الوكيل بنفسه؟",
      capsule:
        "وكيل صوت نجدي في المكتب العقاري يرد على كل مكالمة داخلة بلهجة المستفسر، يقول له إذا الوحدة متاحة ويعطيه مواصفاتها وسعرها وشروط عقدها زي ما اعتمدتها في بياناتك، ويحجز المعاينة في وقت متاح ويسجل بيانات المستفسر كاملة، ويسجل طلبات الاتصال برا الدوام، ويحوّل لموظفك التمويل والتفاوض وكل ما يحتاج مختص — بكامل سياقه.",
      items: [
        {
          title: "يرد على كل مستفسر — حتى وقت الذروة",
          body: "الإعلان ما يعرف أوقات دوامك. المستفسر يتصل بعد العشاء، ويوم الجمعة، وأنت داخل معاينة مع عميل ثاني. الوكيل يرد على كل مكالمة من أول رنة، وما فيه مستفسر يعلق على الخط ولا يسمع بريد صوتي ويسكّر.",
        },
        {
          title: "يعرف كل وحدة عندك وحالتها",
          body: "الحي، المساحة، عدد الغرف والدورات، الدور، الاتجاه، مفروشة ولا لا، السعر، وحالتها: متاحة ولا محجوزة ولا مؤجرة. سجل الوحدات اللي تعبيه هو أساس كلام وكيلك — تحدّث حالة الوحدة فيه أول بأول، وتتأكد من الرد الجديد في المحادثة التجريبية قبل النشر، وما يوعد أحد بشقة انحجزت أمس.",
        },
        {
          title: "يحجز معاينة في وقت يناسب مندوبك",
          body: "الوكيل يشوف أوقات المعاينة المتاحة ويثبت الموعد باسم المستفسر ورقمه والوحدة اللي يبي يشوفها، والموعد يظهر في تقويم الحجوزات عندك. ومندوبك يطلع لمعاينة مؤكدة مكتوبة، مو لموعد اتفق عليه أحد بالجوال ونساه.",
        },
        {
          title: "شروطك بصياغتك أنت",
          body: "الدفعات، مدة العقد، مبلغ التأمين ومتى يرجع، العمولة، رسوم الخدمات، الصيانة على مين، وش داخل في الإيجار ووش لا. كلها تنكتب مرة وحدة بالصياغة اللي ترضيك، ومنها نجهز رد وكيلك — يقولها حرفياً بدل ما يجتهد كل مندوب باجتهاده.",
        },
        {
          title: "يسجل بيانات المستفسر كاملة",
          body: "اسم المستفسر ورقمه ووش يدور عليه بالضبط: كم غرفة، أي حي، الميزانية، إيجار ولا تملك، ومتى يبي ينتقل. كل هذا يوصل فريقك مرتب في اللوحة مع نص المكالمة — بدل ورقة عند الاستقبال ورقم مكتوب على طرف دفتر.",
        },
        {
          title: "برا الدوام يسجل طلب اتصال",
          body: "إذا كان المستفسر يحتاج مختص وما فيه أحد من فريقك، الوكيل يسجل طلب اتصال بتفاصيله والوقت اللي يناسبه، ويوعده إن أحد من المكتب يرجع له. والطلبات تكون قدام فريقك أول الدوام مرتبة — يبدأون فيها بدل ما يبدأون بمكالمات فايتة ما يعرفون أصحابها.",
        },
      ],
    },
    human: {
      eyebrow: "وش يروح لموظفك",
      heading: "وش يروح لموظفك؟",
      capsule:
        "الوكيل يعرف حدوده، وهذا أهم شي في قطاع كل مكالمة فيه ممكن تصير عقد. أربع حالات تروح لموظفك على طول: المستفسر يطلب إنسان، أو صار في الكلام تفاوض على سعر، أو دخل الموضوع في تمويل وإجراءات نظامية، أو كانت المكالمة شكوى من مستأجر. والقواعد أنت تحددها وتعدلها من اللوحة.",
      items: [
        {
          title: "طلب الإنسان — تحويل فوري",
          body: "إذا قال المستفسر «أبي أكلم أحد» أو «حوّلني لمندوب»، الوكيل ما يجادل ولا يحاول يقنعه إنه يقدر يخدمه. يحوّل على طول — قانون ثابت في المنصة كلها مو إعداد ينسى أحد يشغله.",
        },
        {
          title: "التفاوض على السعر",
          body: "أي مفاوضة على سعر أو خصم أو شروط دفع تروح لموظفك. الوكيل يعطي السعر المعلن زي ما هو مكتوب عندك، وما يوافق على تخفيض بدالك ولا يفتح باب مساومة على وحدة ما تملك قرارها.",
        },
        {
          title: "التمويل والإجراءات النظامية",
          body: "تمويل عقاري، إفراغ، صك، نقل ملكية، ضريبة تصرفات عقارية، أسئلة نظامية. هذي ما يجتهد فيها الوكيل ولا يحاول يقربها. يحوّل لمختص عندك ومعه سؤال العميل كامل بنصه، عشان المختص يرد رد دقيق من أول مرة.",
        },
        {
          title: "شكوى مستأجر أو نزاع",
          body: "تأخر صيانة، خلاف على مبلغ التأمين، مشكلة بين جيران، طلب إنهاء عقد. مواقف تحتاج إنسان يفهم السياق ويقدر يقرر. الوكيل يعتذر، ياخذ رقم الوحدة والتفاصيل، ويصعّد لموظفك ومعه كل الكلام.",
        },
      ],
      outroLead: "وأياً كان السبب، موظفك يستلم ومعه سبب التحويل والنص الكامل وملخص عربي وتاريخ المستفسر معكم — ",
      outroLink: "اقرأ كيف يشتغل التصعيد بالتفصيل",
      outroPath: "product/human-handoff",
      outroTail: " وفريقك يقدر يتابع المكالمات وهي شغالة من اللوحة، ويسمع، ويستلم المكالمة بنفسه بضغطة وحدة.",
    },
    kb: {
      eyebrow: "قاعدة المعرفة",
      heading: "وش تحط في قاعدة معرفة مكتبك؟",
      body: "قاعدة المعرفة هي مخزون الوكيل: منها يعرف وحداتك ومشاريعك وشروطك. ترفع ملفاتك — Word أو نص أو مستندات ممسوحة ضوئياً، عندنا قراءة عربية للنص المصور — أو تكتبها أسئلة وأجوبة ومقتطفات قصيرة، أو تحط رابط صفحة موجودة عندك. منها نبني وكيلك، ومنها يرد على مستفسريك في قنوات المحادثة النصية — واتساب وتليجرام ومحادثة موقعك — وتتأكد من كل جواب بنفسك في المحادثة التجريبية قبل النشر. وهذي أهم ستة أشياء في مكتب عقاري:",
      items: [
        {
          title: "بيانات الوحدات",
          body: "لكل وحدة: كودها، نوعها (شقة، فيلا، دور، مكتب، محل)، الحي والموقع، المساحة، عدد الغرف والدورات، الدور، مفروشة ولا لا، السعر، وحالتها. هذا أهم ملف عندك وأكثر ملف يحتاج تحديث — ودقته هي اللي تحدد جودة كل مكالمة.",
        },
        {
          title: "المشاريع والمخططات",
          body: "كل مشروع: اسمه، موقعه، عدد وحداته، مراحل التسليم، والمرافق المشتركة — مصعد، مواقف، حراسة، ملحق، مسبح. كثير من المستفسرين يسألون عن المشروع قبل ما يسألون عن وحدة بعينها، خصوصاً في المشاريع تحت الإنشاء.",
        },
        {
          title: "شروط العقد والدفعات",
          body: "عدد الدفعات ومواعيدها، مدة العقد وشروط تجديده، مبلغ التأمين ومتى يرجع، العمولة على مين، رسوم الخدمات والكهرباء والماء، وسياسة السكن للعائلات والعزاب. أوضح ما تكتبه هنا يوفر عليك أطول مكالمة عندك.",
        },
        {
          title: "أوقات المعاينة والمندوبين",
          body: "مين المسؤول عن كل مشروع أو حي، وأوقات المعاينة المتاحة لكل مندوب، وكم تاخذ المعاينة من وقت، وهل تحتاج موعد مسبق ولا فيه وحدات معروضة يومياً. هذي اللي تخلي الموعد يطلع صحيح من أول مرة.",
        },
        {
          title: "الاتجاهات وأقرب المعالم",
          body: "العنوان، أقرب طريق رئيسي ومخرج، المسافة من وسط المدينة، والخدمات حوالين الوحدة: مدارس، مساجد، أسواق، مستشفيات. المستفسر يقرر من الموقع قبل ما يقرر من السعر.",
        },
        {
          title: "الأسئلة اللي تتكرر عليك",
          body: "هل يقبل حيوانات؟ فيه مصعد؟ الكهرباء مستقلة ولا مشتركة؟ ينفع سكن عزاب؟ ينفع مكتب داخل شقة؟ اكتبها سؤال وجواب قصير. أي سؤال جاوبته مرتين هذا الشهر مكانه هنا — لا في راس مندوبك.",
        },
      ],
      outro:
        "وما تحتاج تكتبها كلها من أول يوم. ابدأ بجدول الوحدات وشروط العقد، وزد عليها كل أسبوع من الأسئلة اللي تشوفها في سجل مكالماتك. وكل ما دقّت قاعدة معرفتك، قلّت المكالمات اللي تحتاج مندوب، وصار وقت مندوبك للمعاينات والإغلاق مو للرد على «متاحة ولا لا؟».",
    },
    after: {
      eyebrow: "بعد المكالمة",
      heading: "وبعد ما تسكر المكالمة؟",
      body: "كل مكالمة تجي مكتبك تنحفظ في لوحتك: التسجيل، والنص كامل، وملخص عربي — مين اتصل، وش الوحدة اللي يسأل عنها، وش صار، ووش الخطوة الجاية. وهذا وحده يغيّر طريقة إدارتك للمكتب: تعرف أي إعلان يجيب مكالمات فعلاً، وأي حي يتكرر السؤال عنه، ووين تضيع الفرص.",
      items: [
        {
          title: "سجل مكالمات كامل",
          body: "كل مكالمة بوقتها ومدتها، مع التسجيل والنص والملخص. تسمع أي مكالمة، وتشوف وين قرر الوكيل يحوّل، وتراجع صياغته وتعدلها إذا ما عجبتك.",
        },
        {
          title: "المعاينات في تقويم واحد",
          body: "المعاينات اللي حجزها الوكيل تنزل مع اللي سجله فريقك في نفس التقويم، ومعها الوحدة واسم المستفسر ورقمه — عشان مندوبك يشوف يومه كامل من مكان واحد.",
        },
        {
          title: "ملف كل مستفسر",
          body: "كل مكالمة تنضاف لملف صاحبها: مكالماته السابقة، الوحدات اللي سأل عنها، ومعايناته. المستفسر اللي رجع بعد شهر ما يعيد كلامه من الأول.",
        },
      ],
    },
    template: {
      heading: "تبدأ من صفر؟ لا — قالب العقار جاهز",
      body: "عندنا قالب مكتوب لقطاع العقار: شخصية وكيل مصممة للرد على مستفسري الإعلانات، وسيناريوهات التوفر والمواصفات وحجز المعاينة والبدائل في نفس الحي، وقواعد تصعيد جاهزة للتفاوض والتمويل والإجراءات النظامية، وهيكل قاعدة معرفة فيه خانات الوحدات والمشاريع وشروط العقد وأوقات المعاينة تعبيها ببياناتك.",
      body2:
        "وإذا كان مكتبك يشتغل على أكثر من نشاط — إيجار سكني، ومشاريع تجارية، وإدارة أملاك — تقدر تسوي وكيل لكل نشاط، وكل وكيل مربوط بقاعدة معرفة خاصة فيه وله قواعد تصعيده وصوته. وصلاحيات فريقك تتقسم على النشاطات.",
      linkLead: "ورحلة الإعداد — فريقنا يجهز القالب معك، وبعدها تعدل عليه بنفسك بدون كود وتجربه قبل النشر — ",
      linkText: "تلقاها بالتفصيل في صفحة بناء الوكيل",
      linkPath: "product/agent-builder",
    },
    faqHeading: "أسئلة المكاتب العقارية",
    faq: [
      {
        q: "الوكيل يتصل على العملاء المحتملين؟",
        a: "لا. صوت نجدي يرد على المكالمات الداخلة فقط — ما فيه اتصال صادر ولا حملات اتصال. اللي يصير برا الدوام إن الوكيل يسجل طلب اتصال بتفاصيله، وموظفك هو اللي يرجع للعميل.",
      },
      {
        q: "كيف يعرف الوكيل إن الوحدة انحجزت؟",
        a: "من سجل الوحدات في قاعدة معرفتك. تغيّر حالة الوحدة إلى «محجوزة»، وتتأكد من الرد الجديد في المحادثة التجريبية قبل النشر — وبعدها الوكيل ما يعرضها ويقدر يطرح البدائل الموجودة عندك في نفس الحي أو نفس النطاق السعري. دقة السجل مسؤوليتك، والوكيل يلتزم فيه حرفياً.",
      },
      {
        q: "يقدر يحجز معاينة في تقويمنا؟",
        a: "إي. يشوف أوقات المعاينة المتاحة ويثبت الموعد باسم المستفسر ورقمه والوحدة اللي بيشوفها، والموعد يظهر في تقويم الحجوزات في اللوحة مع نص المكالمة اللي جاء منها.",
      },
      {
        q: "وش يصير إذا سأل عن التمويل أو الإفراغ؟",
        a: "يحوّل لموظفك على طول. التمويل والإجراءات النظامية ما يجتهد فيها الوكيل — ياخذ سؤال العميل بنصه ويوصله لمختص عندك مع كل سياق المكالمة.",
      },
      {
        q: "نقدر نغيّر كلام الوكيل وردوده؟",
        a: "إي — من بناء الوكيل تعدل شخصيته وأسلوبه والحدود اللي ما يتجاوزها، وتجرب التعديل في المحادثة التجريبية قبل النشر. وفريقنا يجهز لك القالب في الأول عشان ما تبدأ من ورقة بيضاء.",
      },
      {
        q: "وين تنحفظ بيانات مستفسرينا؟",
        a: "اللي نحفظه عن المستفسر هو رقمه واسمه والوحدة اللي سأل عنها ونص مكالمته — يعني بيانات اهتمام بإعلاناتك، ما فيها أي شي مالي. التخزين الدائم في منطقة الخليج (الدوحة) على Google Cloud، والتسجيلات تنحذف تلقائياً بعد 90 يوماً. والمعالجة اللحظية للصوت تمر عبر مزودين عالميين — كل هذا مفصّل في صفحة الأمان والبيانات.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "“Is the apartment still available?” — an agent that answers every enquiry",
    intro:
      "Someone who has just seen your listing will not wait. They call, and if nobody answers they call the listing below yours. The Saut Najdi agent answers every call your listings generate: whether the unit is still available, its size, price and contract terms exactly as we set them up with you from your own data, and a viewing booked into a slot that suits your rep — with anything that needs a specialist passed to your employee in full detail.",
    cta: "Book a demo",
    calls: {
      eyebrow: "The calls you're missing",
      heading: "The calls you miss while you're out at a viewing",
      body: "A property office runs on calls: one listing on a portal produces dozens of them, and most arrive after hours or at the weekend. Six of them repeat every day — and each unanswered one is a buyer or tenant who went to another office, not just a missed number in a log.",
      note: "Illustrative dialogue — this is what a call looks like, not a real recording.",
      items: [
        {
          tag: "Is it still available",
          caller: "I saw your listing for the apartment in Al Narjis — is it still available?",
          agent: "Hello! Yes, it is — three bedrooms, second floor, with its own parking space. Would you like me to book you a viewing?",
          note: "The single most important question in the sector, and the one most often lost to a ringing phone. The agent answers it on the first ring and moves straight to booking.",
        },
        {
          tag: "Price and terms",
          caller: "What's the annual rent? And how many instalments?",
          agent: "The annual rent is SAR 55,000, payable in two or four instalments depending on the contract. The deposit is one month, returned once the unit is handed back in good condition. Would you like the full contract terms?",
          note: "Price, instalments and deposit are written once in the wording you approve, and your agent's answers are built from them — every caller hears the same thing, with no improvising and no over-promising by whoever picked up.",
        },
        {
          tag: "Booking a viewing",
          caller: "I'd like to see it tomorrow afternoon if that's possible.",
          agent: "Tomorrow afternoon we have 5 o'clock free. I'll book you a viewing at 5, and Fahad will meet you there — shall I give you the location now?",
          note: "The viewing is booked into your calendar with the caller's name and number and the unit — so your rep drives to a confirmed appointment, not to a maybe.",
        },
        {
          tag: "Alternatives and comparison",
          caller: "That one's too small for us — do you have anything bigger in the same district?",
          agent: "In the same district we have a four-bedroom apartment with more space, on the first floor. I can give you the details, and book both viewings on the same day if you'd like to compare.",
          note: "The agent offers the alternatives you actually hold in the same district — so a caller the first unit didn't suit doesn't leave your office empty-handed.",
        },
        {
          tag: "Location and what's nearby",
          caller: "Where exactly is it? And is it near schools?",
          agent: "It's on Prince Saud street, entrance from the north side. The nearest primary school is a few minutes' walk, and there's a mosque and a grocery in the same district. Shall I give you the closest landmark?",
          note: "“Where exactly?” comes up in nearly every call. Write the address and the landmarks once, and your agent's answer is built from them for good.",
        },
        {
          tag: "Finance and negotiation — to your team",
          caller: "I want to buy, but I need a mortgage, and I'd like to negotiate on the price.",
          agent: "That needs one of our specialists. I'm putting you through to a sales adviser now — with the unit you're asking about and everything you've told me.",
          note: "Finance, negotiation and legal procedure are never improvised. The agent gets the caller to a specialist while keeping every detail of the call intact.",
        },
      ] as Dialogue[],
    },
    boundary: {
      eyebrow: "A clear boundary",
      heading: "The agent answers inbound calls — it does not cold-call",
      body: "Plenty of agencies hear “voice agent” and picture a robot dialling a list of numbers. That is not what we do, and it is not what we intend to sell you: Saut Najdi answers inbound calls. The enquirer calls you after seeing your listing, and the agent answers. There is no outbound dialling, no calling campaigns, no automated dialling of prospect lists — simply because that capability does not exist here today, and we won't sell you something you won't receive.",
      body2:
        "And if an enquirer calls outside working hours and asks to speak to someone, the agent logs a callback request with the details and their preferred time — and your employee is the one who calls back. The distinction matters: the agent prepares the call for you, it does not make it for you.",
    },
    handles: {
      eyebrow: "What the agent handles",
      heading: "What does the agent handle on its own?",
      capsule:
        "In a property office, the Saut Najdi agent answers every inbound call in the caller's dialect, tells them whether the unit is available and gives its specification, price and contract terms exactly as you approved them in your own data, books a viewing into an open slot and captures the enquirer's details in full, logs callback requests outside working hours, and hands your employee anything involving finance, negotiation or a specialist — in full context.",
      items: [
        {
          title: "Every enquirer answered — even at peak",
          body: "Your listing doesn't know your office hours. People call after dinner, on Fridays, and while you're inside a viewing with someone else. The agent answers every call on the first ring — nobody waits on hold and nobody hears voicemail and hangs up.",
        },
        {
          title: "It knows every unit and its status",
          body: "District, size, bedrooms and bathrooms, floor, aspect, furnished or not, price, and status: available, reserved or let. The unit register you fill in is what your agent's answers are built on — keep a unit's status current in it, check the new answer in the test chat before publishing, and nobody gets promised an apartment that was taken yesterday.",
        },
        {
          title: "It books viewings into your rep's slots",
          body: "The agent checks which viewing slots are open, books the appointment with the enquirer's name and number and the unit they want to see, and the appointment shows up in your reservations calendar. Your rep drives to a written, confirmed viewing — not one agreed on a phone and forgotten.",
        },
        {
          title: "Your terms, in your wording",
          body: "Instalments, contract length, the deposit and when it's returned, commission, service charges, who handles maintenance, what the rent includes and what it doesn't. Written once in the wording you approve, your agent is built from it and repeats it exactly — rather than every rep improvising their own version.",
        },
        {
          title: "It captures the enquirer in full",
          body: "Name, number, and what they're actually looking for: how many bedrooms, which district, the budget, rent or purchase, and when they want to move. All of it reaches your team organised in the dashboard alongside the transcript — instead of a name on a desk pad and a number in the margin.",
        },
        {
          title: "Out of hours, it logs a callback",
          body: "When the caller needs a specialist and nobody from your team is available, the agent logs a callback request with the details and their preferred time, and promises someone from the office will come back to them. Your team starts the day working through those, not guessing who the missed numbers belonged to.",
        },
      ],
    },
    human: {
      eyebrow: "What goes to a human",
      heading: "What goes to your employee?",
      capsule:
        "The agent knows its limits — which matters most in a sector where any call can turn into a contract. Four situations go straight to your employee: the caller asks for a person, the conversation turns into a price negotiation, finance or legal procedure comes up, or the call is a tenant complaint. You set and change those rules from the dashboard.",
      items: [
        {
          title: "A request for a human — immediate",
          body: "If the caller says “put me through to an agent,” the agent doesn't argue and doesn't try to convince them it can help. It transfers immediately — an iron law across the platform, not a setting somebody might forget to switch on.",
        },
        {
          title: "Price negotiation",
          body: "Any negotiation over price, discount or payment terms goes to your employee. The agent quotes the listed price exactly as you wrote it, and never agrees to a reduction on your behalf or opens bargaining on a unit whose terms aren't its to decide.",
        },
        {
          title: "Finance and legal procedure",
          body: "Mortgages, title deeds, transfer of ownership, real-estate transaction tax, legal questions. The agent doesn't go near these. It passes the caller's question verbatim to your specialist along with the whole call, so the specialist can answer precisely the first time.",
        },
        {
          title: "Tenant complaints and disputes",
          body: "Delayed maintenance, an argument over the deposit, a problem with neighbours, a request to terminate a contract. These need a person who understands the context and can decide. The agent apologises, captures the unit number and the details, and escalates with everything said.",
        },
      ],
      outroLead: "Whatever the reason, your employee inherits the escalation reason, the full transcript, an Arabic summary and the caller's history with you — ",
      outroLink: "read how escalation works in detail",
      outroPath: "product/human-handoff",
      outroTail: " Your team can also follow calls live from the dashboard, listen in, and take a call over in one click.",
    },
    kb: {
      eyebrow: "Your knowledge base",
      heading: "What belongs in your office's knowledge base?",
      body: "The knowledge base is the agent's stock: it's where it learns your units, your projects and your terms. Upload your files — Word, plain text, or scanned documents, since Arabic OCR reads scans correctly — or write them as question-and-answer pairs and short snippets, or point at a page you already publish. It is what your agent is built from, it is what answers your enquirers on the text channels — WhatsApp, Telegram and your website chat — and you check every answer yourself in the test chat before publishing. Six things matter most in a property office:",
      items: [
        {
          title: "The unit register",
          body: "For each unit: its code, type (apartment, villa, floor, office, shop), district and location, size, bedrooms and bathrooms, floor, furnished or not, price, and status. This is your most important file and the one that needs updating most — its accuracy sets the quality of every call.",
        },
        {
          title: "Projects and plans",
          body: "Each project: its name, location, number of units, handover phases, and the shared facilities — lift, parking, security, annexe, pool. Many enquirers ask about the project before they ask about a specific unit, especially with anything under construction.",
        },
        {
          title: "Contract terms and payments",
          body: "How many instalments and when, contract length and renewal terms, the deposit and when it's returned, who pays commission, service and utility charges, and the policy on families and single occupants. The clearest thing you write here saves you your longest call.",
        },
        {
          title: "Viewing slots and reps",
          body: "Who covers each project or district, which viewing slots each rep has open, how long a viewing takes, and whether an appointment is required or some units are shown daily. This is what makes the booked appointment correct the first time.",
        },
        {
          title: "Directions and landmarks",
          body: "The address, the nearest main road and exit, the distance from the city centre, and what surrounds the unit: schools, mosques, shops, hospitals. Enquirers decide on location before they decide on price.",
        },
        {
          title: "The questions you keep answering",
          body: "Are pets allowed? Is there a lift? Is the electricity metered separately? Are single tenants accepted? Can it be used as a home office? Write them as short question-and-answer pairs. Anything you've answered twice this month belongs here — not in your rep's head.",
        },
      ],
      outro:
        "You don't have to write it all on day one. Start with the unit register and the contract terms, then add each week from the questions you see in your call log. The sharper the knowledge base, the fewer calls need a rep — and your reps' hours go to viewings and closings instead of “is it still available?”.",
    },
    after: {
      eyebrow: "After the call",
      heading: "And once the call ends?",
      body: "Every call to your office is kept in your dashboard: the recording, the full transcript, and an Arabic summary — who called, which unit they asked about, what happened, and what comes next. That alone changes how you run the office: you can see which listings actually generate calls, which districts keep coming up, and where opportunities are being lost.",
      items: [
        {
          title: "A complete call log",
          body: "Every call with its time and duration, alongside the recording, transcript and summary. Listen to any call, see where the agent chose to hand over, and adjust its wording if it isn't what you'd say.",
        },
        {
          title: "Viewings in one calendar",
          body: "Viewings the agent booked land in the same calendar as the ones your team enters, with the unit and the caller's name and number — so your rep sees the whole day in one place.",
        },
        {
          title: "A profile for every enquirer",
          body: "Each call joins its caller's profile: previous calls, the units they asked about, and their viewings. Someone who comes back a month later doesn't start from the beginning.",
        },
      ],
    },
    template: {
      heading: "Starting from nothing? No — the real-estate template is ready",
      body: "There's a written template for the real-estate sector: an agent persona built for answering listing enquiries, scenarios for availability, specification, viewing bookings and alternatives in the same district, ready escalation rules for negotiation, finance and legal procedure, and a knowledge-base skeleton with slots for units, projects, contract terms and viewing slots that you fill with your own data.",
      body2:
        "If your office runs several lines of business — residential lettings, commercial projects, property management — you can give each one its own agent, tied to its own knowledge base, with its own escalation rules and voice. Your team's permissions split the same way.",
      linkLead: "The setup journey itself — our team builds the template with you, then you edit it yourself without code and try it before publishing — ",
      linkText: "is laid out in detail on the agent builder page",
      linkPath: "product/agent-builder",
    },
    faqHeading: "Questions from property offices",
    faq: [
      {
        q: "Does the agent call prospects?",
        a: "No. Saut Najdi answers inbound calls only — there is no outbound dialling and no calling campaigns. Out of hours, the agent logs a callback request with the details, and your employee is the one who calls the customer back.",
      },
      {
        q: "How does the agent know a unit has been reserved?",
        a: "From the unit register in your knowledge base. You change the unit's status to reserved, check the new answer in the test chat, and publish — after that the agent stops offering it and can suggest the alternatives you hold in the same district or price range. Keeping the register accurate is your job — the agent follows it literally.",
      },
      {
        q: "Can it book a viewing in our calendar?",
        a: "Yes. It checks the open viewing slots and books the appointment with the enquirer's name and number and the unit they'll see, and the appointment appears in your reservations calendar next to the transcript of the call it came from.",
      },
      {
        q: "What happens if someone asks about mortgages or title transfer?",
        a: "It transfers to your employee immediately. Finance and legal procedure are never improvised — the agent passes the question verbatim to your specialist with the full context of the call.",
      },
      {
        q: "Can we change how the agent speaks?",
        a: "Yes — in the agent builder you edit its persona, its tone and the boundaries it won't cross, and try the change in the test chat before publishing. Our team builds the template with you first, so you never start from a blank page.",
      },
      {
        q: "Where is our enquirers' data stored?",
        a: "What we hold about an enquirer is their name and phone number, the listing they asked about and the transcript of the call — interest in your listings, with nothing financial in it. Permanent storage is in the Gulf region (Doha) on Google Cloud, and recordings are automatically deleted after 90 days. Realtime speech processing transits global providers — all of it detailed on our security page.",
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

export function RealEstatePage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
          <span className="mx-auto mb-4 flex justify-center">
            <IconChip name="estate" />
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

      {/* The sector's one non-negotiable disclosure: inbound only. Stated as
          its own section, not buried in a card — research §3.3 item 2. */}
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

export const realEstateFaq = { ar: t.ar.faq, en: t.en.faq };
