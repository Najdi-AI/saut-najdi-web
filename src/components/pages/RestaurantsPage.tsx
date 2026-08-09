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

// Positional — keep each array the same length as the list it decorates or a
// card renders with an undefined icon name.
const handledIcons: IconName[] = ["calendar", "repeat", "restaurant", "phone", "clock", "people"];
const kbIcons: IconName[] = ["restaurant", "doc", "people", "clock", "globe", "calendar"];

/**
 * /solutions/restaurants (blueprint §6.3 sector template). The restaurant
 * template is genuinely shipped (research §3.1), so «قالب جاهز» is allowed.
 *
 * Two honesty guards on this page: the agent records order and enquiry
 * details — it does not take payment and is not plugged into delivery apps
 * (said out loud in the FAQ); and the peak-hour claim is capability only,
 * never a number, because no concurrency figure has been published.
 */

const t = {
  ar: {
    h1: "مطعمك يرد على كل مكالمة — حتى وقت الذروة",
    intro:
      "أكثر وقت يتصل فيه زبونك هو نفس الوقت اللي ما فيه أحد فاضي يرد فيه: الثامنة والنص مساءً، الصالة مليانة، والكاشير عنده طابور. والمكالمة اللي ما ترد عليها ما تنتظرك — تروح للمطعم اللي بعدك في القائمة. وكيل صوت نجدي يرد على كل مكالمة بلهجة زبونك، ويحجز الطاولة فعلاً، ويسلّم لموظفك أي شكوى أو طلب خاص ومعه كل تفاصيل المكالمة.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "قالب جاهز للمطاعم والكافيهات",
      heading: "المكالمات اللي تفوتك وقت الذروة",
      body:
        "هذي شكل المكالمات اللي تجي أي مطعم في السعودية بين السابعة والعاشرة مساءً. اقرأها وشوف كم وحدة منها راحت عليك أمس لأن الخط كان مشغول، أو لأن أحد رد وهو يمسك ثلاثة أشياء بيده. وكل حوار تحت مربوط بنقطة في القسم اللي بعده.",
      note: "حوارات توضيحية — هذا شكل المكالمة، مو تسجيل حقيقي.",
      items: [
        {
          tag: "حجز طاولة",
          caller: "مساء الخير، عندكم طاولة لأربعة الليلة؟",
          agent: "مساء النور! الليلة عندنا فاضي 8:30 و 9:15 — أي وقت يناسبك؟",
        },
        {
          tag: "تعديل حجز",
          caller: "حاجز الساعة 9 لأربعة، بس صرنا ستة.",
          agent: "أبشر. عدّلتها لستة، ونقلتك لطاولة في قسم العوائل بنفس الوقت — رقم حجزك نفسه: 7 — 3 — 5 — 2.",
        },
        {
          tag: "القائمة والحساسية",
          caller: "عندكم أطباق بدون لحم؟ وأخوي عنده حساسية من المكسرات.",
          agent: "عندنا أطباق نباتية أقولك إياها من القائمة. وموضوع الحساسية أسجله على حجزك وأحوّلك لموظف يأكد لك من المطبخ.",
        },
        {
          tag: "الدوام والموقع والمواقف",
          caller: "لين كم مفتوحين اليوم؟ وفيه مواقف؟",
          agent: "مفتوحين لين 1 بعد منتصف الليل، وفيه مواقف خاصة خلف المبنى — أرسل لك موقع الفرع؟",
        },
        {
          tag: "مناسبة أو مجموعة كبيرة",
          caller: "أبغى أحجز لعشرين شخص يوم الخميس، عندكم قسم مغلق؟",
          agent: "عندنا قسم خاص يستوعب العدد. أسجل لك التفاصيل وأحوّلك لمسؤول المناسبات يأكد لك الترتيب والعربون.",
        },
        {
          tag: "شكوى — تصعيد فوري",
          caller: "طلبت أمس توصيل ووصل ناقص صنف.",
          agent: "أعتذر منك على هالشي. خلني أحوّلك لمسؤول الفرع على طول ومعه كل تفاصيل طلبك.",
          human: "معك فهد مدير الفرع — قدامي طلبك والصنف الناقص، خلني أعوضك عنه.",
        },
      ],
    },
    why: {
      heading: "ليش الذروة بالذات هي المشكلة؟",
      paras: [
        "مشكلة مكالمات المطاعم مو في عددها، مشكلتها في توقيتها. كل المكالمات تجي في نفس الساعتين اللي فيهم الصالة مليانة والمطبخ في أعلى ضغط والموظف اللي المفروض يرد على الجوال واقف يستقبل زباين على الباب. النتيجة: الجوال يرن ثلاث مرات ويسكت، أو أحد يرد وهو مستعجل ويقول «كلمنا بعدين».",
        "والزبون اللي ما لقى رد ما يعيد الاتصال غالباً — يفتح الخريطة ويتصل على المطعم اللي بعدك في نفس الشارع. وهذا كله يصير بدون ما تشوفه في أي تقرير، لأن المكالمة اللي ما تُرد ما تخلّف أثر في دفترك.",
        "وأكثر هذي المكالمات أصلاً بسيطة: حجز طاولة، تعديل عدد، سؤال عن الدوام أو المواقف أو القائمة. الوكيل ياخذ هذا النوع كله عن فريقك في نفس اللحظة اللي هم فيها مشغولين، ويخلي موظفك للزبون اللي داخل من الباب وللمكالمات اللي فعلاً تحتاج إنسان.",
        "وفيه غلط صغير في الذروة يكلفك طاولة كاملة: العدد. زبون يحجز لأربعة ويجي ستة، أو يحجز لعشرة والقسم الوحيد اللي يستوعبهم محجوز من قبل يومين. واللي يرد على الجوال وهو مستعجل يكتب «٤» وخلاص، وباقي التفاصيل اللي تحدد الطاولة الصح — عوائل ولا أفراد، كرسي أطفال، جلسة خارجية في ليلة حارة — تضيع بين المكالمة والاستقبال. الوكيل يسأل هذي الأسئلة كل مرة بنفس الترتيب، لأنه ما هو واقف على الباب وهو يسأل، وما فيه أحد ينتظره يخلص.",
        "وفيه خسارة ثانية ما تنحسب: الحجوزات اللي تضيع بالغلط. دفتر على الاستقبال، ورسالة واتساب في جوال موظف، وورقة مكتوبة على عجل — كلها تنتهي بحجزين على نفس الطاولة، أو بزبون يجي ويلقى إن حجزه ما أحد سجله. الوكيل يحجز في تقويم واحد يشوفه كل الفريق لحظة بلحظة، فما فيه دفتر جانبي ولا رسالة راحت في الزحمة.",
      ],
    },
    handled: {
      eyebrow: "مربوط بالحوارات اللي فوق",
      heading: "وش ينهيه الوكيل بنفسه على الخط؟",
      capsule:
        "الرد الآلي العادي ياخذ اسم ورقم ويقول «بنكلمك»؛ وفي مطعم يعني إن الزبون حجز عند غيرك قبل ما ترجع له. كل مكالمة من اللي فوق ينهيها الوكيل بنفسه قبل ما يقفل الخط، وكل نقطة تحت مربوطة بحوار قريته قبل شوي.",
      items: [
        {
          title: "يحجز الطاولة فعلاً — مو ياخذ اسم ورقم",
          body:
            "الوكيل يشوف المتاح في تقويم حجوزاتك وهو على الخط: كم شخص، أي وقت، وأي قسم — عوائل ولا أفراد ولا جلسة خارجية. ويثبت الحجز قبل ما تنتهي المكالمة، ويقرأ رقم الحجز للزبون رقم رقم بالعربي عشان يكتبه من أول مرة. والحجز يظهر لفريقك في التقويم في نفس اللحظة، فما يصير حجزين على نفس الطاولة.",
        },
        {
          title: "التعديل والإلغاء بدون مكالمة ثانية",
          body:
            "أكثر شي يتغير في حجوزات المطاعم هو العدد والوقت. الوكيل يلقى حجز الزبون من رقمه اللي يتصل منه، يزيد العدد أو ينقصه، يقدم الوقت أو يأخره، أو يلغي — ويقول له سياستك زي ما كتبتها: كم قبل يقدر يلغي، وكم دقيقة تنتظرون الطاولة قبل ما تُعطى لغيره. والطاولة اللي تنلغي ترجع متاحة على طول بدل ما تقعد فاضية.",
        },
        {
          title: "القائمة والأسعار والأصناف",
          body:
            "«عندكم أطباق نباتية؟» «كم سعر المندي؟» «فيه بوفيه فطور؟» — إجابات محسومة عندك، والوكيل يعطيها زي ما هي من قائمتك، ما يجتهد ولا يخترع صنف. أما الطلبات اللي تخص الحساسية أو المكوّنات بالتفصيل، فيسجلها على الحجز ويحوّل الزبون لموظفك يأكد له من المطبخ — لأن هذا النوع من التأكيد مكانه عند إنسان.",
        },
        {
          title: "الذروة: ما فيه خط مشغول",
          body:
            "الوكيل يرد على أكثر من مكالمة في نفس اللحظة، فالزبون اللي يتصل 9 مساءً يلقى نفس الرد اللي يلقاه اللي يتصل 4 العصر — بدون نغمة انتظار وبدون «الخط مشغول». وما يفرق عنده إذا كانت المكالمة الأولى ولا العاشرة في نفس الدقيقة؛ اللي يفرق إن كل وحدة منها تنتهي بحجز مثبت في نفس التقويم، فما تنحجز طاولة مرتين لأن اثنين اتصلوا في نفس اللحظة. وحجم المكالمات اللي يحتاجه مطعمك نقيسه معك في العرض التعريفي ونجهز الوكيل عليه، بدل ما نعطيك رقماً عاماً ما يناسب الكل.",
        },
        {
          title: "الدوام والفروع والمواقف والتوصيل",
          body:
            "«لين كم مفتوحين؟» و«وينكم بالضبط؟» و«فيه مواقف؟» و«توصلون لحينا؟» — مكالمات قصيرة بس عددها أكبر من الحجوزات نفسها. الوكيل يعرف دوام كل فرع، ودوام رمضان والإجازات اللي يتغير، وعنوان كل فرع وأقرب علامة مميزة، وسياسة التوصيل عندك ومناطق التغطية — ويوجّه الزبون للفرع الأقرب له.",
        },
        {
          title: "الزبون الدايم… يعرفه",
          body:
            "الزبون اللي يحجز عندك كل خميس ما يبدأ من الصفر كل مرة: الوكيل يحييه باسمه، ويعرف فرعه المفضل وعدد الأشخاص المعتاد وقسمه — عوائل ولا خارجية. وهذي نفس المعلومات تكون قدام موظفك لحظة ما يستلم المكالمة، فالزبون ما يسمع أبداً «ممكن تعيد لي الطلب من الأول؟».",
        },
      ],
    },
    voice: {
      heading: "مكالمة المطعم تجي من مكان مزعج",
      paras: [
        "زبونك يتصل وهو في سيارته، أو واقف في الشارع، أو حوله ناس يتكلمون — ويغيّر كلامه وهو يتكلم: «لا لا، خلها 9 بدل 8:30، وصرنا ستة مو أربعة». الوكيل يسكت ويسمع ويعدّل العدد والوقت في نفس المكالمة، ويقرأ رقم الحجز رقم رقم عشان ما يجي الخميس ويطلع الحجز باسم غيره.",
        "ويرد بلهجة زبونك — نجدية أو حجازية أو خليجية، بصوت رجالي أو نسائي، وبالإنجليزية إذا كان يفضلها. وإذا كان زبائنك يتكلمون لهجة أو لغة ثانية، نجهزها لك على طلبك — وما نعلن لهجات ما أطلقناها فعلاً.",
      ],
      linkLead: "وتفاصيل الأصوات واللهجات، وطريقة تعامل الوكيل مع الضجيج والمقاطعة، تلقاها في ",
      linkText: "صفحة وكيل الصوت",
    },
    human: {
      heading: "وش يروح لموظفك؟",
      capsule:
        "الوكيل يشتغل في اللي محسوم ومكتوب: حجوزات، وتعديلات، وقائمة، ودوام، وفروع. وكل شي فيه اجتهاد أو مزاج زبون أو فلوس يروح لموظفك على طول — ومعه كل الكلام اللي صار في المكالمة.",
      items: [
        "الشكاوى: صنف ناقص، طلب متأخر، خدمة ما عجبته — تحويل فوري لموظفك، لأن الشكوى اللي يجاوب عليها روبوت تصير شكويين.",
        "نبرة الانزعاج: الوكيل يلتقط انزعاج الزبون في صوته ويصعّد بدل ما يكمل نص محفوظ ويزيد الطين بلة.",
        "أي شي فيه فلوس: استرجاع، تعويض، خصم، عربون مناسبة — قرارات مالية مكانها موظفك، مو الوكيل.",
        "المناسبات والمجموعات الكبيرة: الوكيل يسجل التفاصيل — العدد والتاريخ والقسم والطلبات الخاصة — ويحوّلها لمسؤول المناسبات عندك يأكد الترتيب.",
        "طلب الزبون إنسان — قانون ثابت ما يتفاوض فيه الوكيل ولا يحاول يقنعه إنه يقدر يساعده.",
      ],
      complaintNote:
        "والشكوى في المطعم لها وقت حساس ما يشبه أي قطاع ثاني: أغلبها يجي في نفس الليلة، وأحياناً والزبون قاعد على الطاولة والأكل قدامه. عشان كذا الوكيل ما يحاول يعالجها ولا يعتذر نيابة عنك ويقفل الخط — يعتذر جملة وحدة ويحوّل على مسؤول الفرع فوراً ومعه تفاصيل الطلب أو الحجز، لأن الشكوى اللي تنتظر لبكرة ما ترجع لك مكالمة، ترجع لك تقييم على الخريطة يقراه كل واحد يبحث عن مطعمك.",
      inheritLead: "ولحظة التحويل، موظفك يستلم سبب التصعيد والنص الكامل للمكالمة وملخصاً عربياً واضحاً وتاريخ الزبون معكم — ",
      inheritLink: "اقرأ كيف يشتغل التصعيد بالتفصيل",
      afterHours:
        "وفريقك يقدر يتابع المكالمات وهي شغالة من لوحة التحكم: يسمع أي مكالمة مباشرة، أو يوجّه الوكيل بهمسة ما يسمعها الزبون، أو يستلم المكالمة بنفسه بضغطة وحدة. وبرا الدوام ما فيه طريق مسدود: الوكيل يعرف أوقات مطعمك، يخدم الزبون في اللي يقدر عليه — يثبت له حجز بكرة مثلاً — وإذا احتاج الموضوع إنسان، يسجل طلب اتصال ويحط فيه الوقت اللي يناسب الزبون، ويكون قدام فريقك أول ما يفتحون.",
    },
    kb: {
      heading: "وش يدخل في قاعدة معرفة مطعمك؟",
      intro:
        "الوكيل ما يخترع صنف ولا يفتي في سعر: كل جواب يعطيه لازم يكون مكتوباً عندك أصلاً. عشان كذا نبني معك قاعدة معرفة مطعمك من ملفاتك أنت — قائمتك، وخريطة أقسامك، وسياسة الحجز عندك — مو من كلام عام عن المطاعم:",
      items: [
        { title: "القائمة والأسعار", body: "الأصناف وأسعارها، والأطباق النباتية، وقائمة الفطور، والعروض الموسمية، ووش الصنف اللي وقف عندك." },
        { title: "سياسة الحجز والإلغاء", body: "كم شخص أقل عدد وأكثر عدد، ومدة الجلسة، وكم دقيقة تنتظرون الطاولة، وسياسة الإلغاء والعربون للمجموعات." },
        { title: "الأقسام والطاولات", body: "عوائل، أفراد، جلسات خارجية، قسم مغلق للمناسبات — وكم يستوعب كل قسم وأي منها يحتاج حجز مسبق." },
        { title: "الذروة وأوقات الدوام", body: "دوام كل يوم، والأوقات اللي ما تقبلون فيها حجز، وساعات الضغط اللي تحتاج ترتيب مسبق." },
        { title: "الفروع والمواقف والتوصيل", body: "عنوان كل فرع وأقرب علامة مميزة، والمواقف، ومناطق التوصيل وطريقة الطلب عندك." },
        { title: "رمضان والمناسبات", body: "بوفيه الفطور والسحور، وأوقاته، وسياسة الحجز في رمضان والأعياد والمواسم." },
      ],
      mechanics:
        "وقائمة المطعم أكثر ملف ما يثبت على حال: صنف يوقف بعد نص الليل، وسعر يرتفع مع المورّد، وعرض موسمي يبدأ وينتهي في أسبوعين. تحط قائمتك زي ما هي — PDF أو Word، وحتى لو ما عندك منها إلا صورة مصوّرة بالسكانر — التعرّف الضوئي عندنا عربي أصلاً، فالكلمات تطلع سليمة مو حروف مبعثرة — وتعدّل الصنف في مكان واحد بدل ما تبلّغ كل موظف على حدة وتتمنى إنهم كلهم قروا الرسالة.",
      testing:
        "وقبل ما تنشر، تجرب بنفسك في المحادثة التجريبية: تكتب سؤال زبونك زي ما بيقوله — «فيه طاولة لعشرة يوم الخميس في قسم مغلق؟» — وتشوف الجواب ومن وين جابه بالضبط. وهذي مو خطوة شكلية في مطعم: جواب غلط عن حجم الطاولة أو عن صنف موقوف يوصل الزبون لين الباب وهو متوقع شي ثاني، ويرجع منك على أعصابه. والنشر ما يصير بالغلط: تعدّل على مسودة، وتشوف مقارنة تبيّن لك وش تغيّر بالضبط، وبعدها تنشر — وكل نسخة محفوظة تقدر ترجع لها لو طلع التعديل ناقص.",
      channelsHeading: "ومو بس المكالمات",
      channels:
        "زباين كثير يحجزون بالكتابة مو بالاتصال، خصوصاً بعد منتصف الليل وهم يخططون لليلة الخميس. واتساب للأعمال وتيليجرام ودردشة موقعك تنزل في الصندوق الموحد نفسه مع المكالمات، والرد الآلي على القنوات النصية هذي يجاوب من قاعدة معرفة مطعمك — فموظفك يشوف كل تعامل سابق مع الزبون قدامه على طول، وما يخليه يعيد طلبه من الأول.",
      kbLinkLead: "وتفاصيل بنائها وتحديثها ونسخها المحفوظة تلقاها في ",
      kbLinkText: "صفحة قاعدة المعرفة",
      securityLead: "وبيانات زبائنك وتسجيلات المكالمات لها صفحة كاملة تشرح وين تنحفظ ووين تُعالَج بالضبط — ",
      securityLink: "اقرأ صفحة الأمان والبيانات",
    },
    setup: {
      heading: "كيف نجهز مطعمك؟",
      paras: [
        "نبدأ من القالب الجاهز للمطاعم، ونعبيه بمعلومات مطعمك أنت: القائمة والأسعار، والأقسام والطاولات، وسياسة الحجز والعربون، ودوام كل فرع. بعدين نتفق على خط الشكاوى تحديداً: مين يستلمها، وعلى أي رقم، ووش الكلمات اللي إذا سمعها الوكيل صعّد على طول بدون نقاش. وتسمع صوته وتجربه بنفسك قبل ما يرد على أول زبون، وآخر خطوة نرتب معك تفعيل الرقم.",
        "والشي اللي ياخذ وقت أكثر من غيره في المطعم مو التقنية — هي خريطة أقسامك وطاولاتك: كم يستوعب كل قسم، وأي حجم مجموعة يحتاج موافقة مسبقة أو عربون، ووش الأوقات اللي تقفل فيها الحجز أصلاً عشان ما تخنق المطبخ. وما نخليك تسجل بنفسك وتركّبها: فريقنا يضبطها معك، لأن الغلط فيها ما يظهر إلا ليلة الخميس الساعة تسع — وهو آخر وقت تقدر تصلحه فيه. والمدة نحددها لك في العرض التعريفي، على قد عدد فروعك وأقسامك وضغط الذروة عندك.",
      ],
      linkLead: "وتقدر تعدّل القائمة والأقسام بنفسك بعد التشغيل — ",
      linkText: "صفحة بناء الوكيل",
    },
    faqHeading: "أسئلة أصحاب المطاعم",
    faq: [
      {
        q: "الوكيل يحجز الطاولة فعلاً ولا بس ياخذ الاسم والرقم؟",
        a: "يحجز فعلاً. الوكيل يشوف المتاح في تقويم حجوزاتك وهو على الخط — العدد والوقت والقسم — ويثبت الحجز قبل ما تنتهي المكالمة، ويقرأ رقم الحجز للزبون رقم رقم. والحجز يظهر لفريقك في التقويم في نفس اللحظة.",
      },
      {
        q: "وقت الذروة إذا اتصل أكثر من زبون في نفس اللحظة؟",
        a: "الوكيل يرد على أكثر من مكالمة في نفس الوقت، فما فيه خط مشغول ولا نغمة انتظار في أزحم ساعة عندك. وحجم المكالمات اللي يحتاجه مطعمك نقيسه معك في العرض التعريفي ونجهز الوكيل عليه.",
      },
      {
        q: "ياخذ طلبات الأكل والتوصيل؟",
        a: "الوكيل يجاوب على أسئلة التوصيل — مناطق التغطية وطريقة الطلب عندك — ويسجل تفاصيل الطلب ويوصلها لفريقك. لكن ما فيه دفع داخل المكالمة، وما فيه ربط جاهز مع تطبيقات التوصيل اليوم؛ إذا كان هذا اللي تحتاجه، قوله لنا في العرض ونقولك بصراحة وش ممكن ووش لا.",
      },
      {
        q: "عندنا أكثر من فرع — كل فرع يحتاج وكيل؟",
        a: "تقدر تسوي وكيل لكل فرع بمعلوماته ودوامه، أو وكيل واحد يعرف كل الفروع ويوجّه الزبون للأقرب ويحجز في تقويم نفس الفرع. أغلب المطاعم تبدأ بوكيل واحد وتتوسع بعدين — ونرتبها معك في التجهيز.",
      },
      {
        q: "وإذا كان الزبون يشتكي أو معصب؟",
        a: "يروح لموظفك على طول. الوكيل يلتقط الانزعاج في نبرة الصوت ويصعّد، والشكاوى وأي طلب فيه استرجاع أو تعويض مو من صلاحياته أصلاً — وموظفك يستلم ومعه نص المكالمة كامل وملخصها وتاريخ الزبون.",
      },
      {
        q: "فيه قالب جاهز للمطاعم ولا نبدأ من الصفر؟",
        a: "فيه قالب جاهز للمطاعم: سيناريوهات الحجز والتعديل وأسئلة القائمة والدوام والمواقف، وهيكل قاعدة معرفة تعبيه بمعلوماتك. وفريقنا يجهزه معك ويعدله على طريقة مطعمك — ما في تسجيل ذاتي ولا نتركك تركّب النظام بنفسك.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "Your restaurant answers every call — even at peak service",
    intro:
      "Your customers ring at exactly the moment nobody is free to pick up: half past eight, a full dining room, a queue at the till. And a call you don't answer doesn't wait — it goes to the next restaurant on the list. The Saut Najdi agent answers every one of them in your customer's dialect, books the table for real, and hands any complaint or special request to your staff with the whole conversation attached.",
    cta: "Book a demo",
    calls: {
      eyebrow: "A ready-made restaurant template",
      heading: "The calls you miss at peak service",
      body:
        "This is what calls to a Saudi restaurant sound like between seven and ten in the evening. Read them and count how many went unanswered yesterday because the line was engaged, or because somebody picked up while holding three other things. Each dialogue maps to a point in the section that follows.",
      note: "Illustrative dialogues — this is what a call looks like, not a real recording.",
      items: [
        {
          tag: "Booking a table",
          caller: "Good evening — do you have a table for four tonight?",
          agent: "Good evening! Tonight we have 8:30 and 9:15 free — which suits you better?",
        },
        {
          tag: "Changing a booking",
          caller: "I've booked at 9 for four, but we're six now.",
          agent: "Done — updated to six and moved you to a table in the family section at the same time. Same reference: 7 — 3 — 5 — 2.",
        },
        {
          tag: "Menu and allergies",
          caller: "Do you have anything without meat? And my brother has a nut allergy.",
          agent: "We do have vegetarian dishes — I'll run through them. I'll note the allergy on your booking and put you through to a colleague who'll confirm it with the kitchen.",
        },
        {
          tag: "Hours, location, parking",
          caller: "How late are you open today? And is there parking?",
          agent: "We're open until 1 AM, and there's dedicated parking behind the building — shall I send you the branch location?",
        },
        {
          tag: "A group or an occasion",
          caller: "I'd like to book for twenty people on Thursday — do you have a private area?",
          agent: "We have a private section that takes that number. I'll take the details and put you through to our events lead to confirm the arrangements and the deposit.",
        },
        {
          tag: "A complaint — instant escalation",
          caller: "I ordered delivery yesterday and an item was missing.",
          agent: "I'm sorry about that. Let me put you straight through to the branch manager with all your order details.",
          human: "This is Fahad, the branch manager — I have your order and the missing item in front of me. Let me make it right.",
        },
      ],
    },
    why: {
      heading: "Why peak service is the whole problem",
      paras: [
        "The problem with restaurant calls isn't their number, it's their timing. They all arrive in the same two hours: the room is full, the kitchen is at maximum pressure, and the person who is supposed to answer the phone is standing at the door seating guests. So the phone rings three times and stops, or somebody picks up in a hurry and says “call us back later.”",
        "A customer who didn't get through usually doesn't try again — they open the map and ring the restaurant further down the same street. None of this shows up in a report, because an unanswered call leaves no trace in your books.",
        "And most of those calls are simple: a table, a change of party size, a question about hours, parking or the menu. The agent absorbs that entire category at precisely the moment your team is busiest, leaving your staff for the guest walking through the door and the calls that genuinely need a person.",
        "One small mistake at peak costs a whole table: the covers. A guest books for four and arrives as six, or books for ten when the only area that seats ten went two days ago. Whoever answers in a hurry writes “4” and moves on, and the details that decide which table it actually is — family or singles, a high chair, outdoor seating on a warm night — evaporate between the call and the host stand. The agent asks those questions every time in the same order, because it isn't standing at the door while it asks and nobody is waiting for it to finish.",
        "There's a second loss nobody counts: bookings lost to the process itself. A book on the host stand, a WhatsApp message on one employee's phone, a note scribbled mid-rush — that ends in two parties on one table, or a guest arriving to find their reservation was never written down. The agent books into a single calendar the whole team sees in real time: no side ledger, no message swallowed by the rush.",
      ],
    },
    handled: {
      eyebrow: "Mapped to the dialogues above",
      heading: "What the agent finishes on the line itself",
      capsule:
        "An ordinary auto-attendant takes a name and a number and says “we'll call you back” — which in a restaurant means the guest has booked somewhere else before you do. Every call above is finished by the agent before it hangs up, and each point below maps to a dialogue you just read.",
      items: [
        {
          title: "It books the table — it doesn't take a name and number",
          body:
            "The agent checks your reservations calendar on the line: party size, time, and which area — family, singles, or outdoor seating. It confirms the booking before the call ends and reads the reference back digit by digit so the guest can write it down first time. The reservation appears in your team's calendar in the same moment, so two parties never land on one table.",
        },
        {
          title: "Changes and cancellations without a second call",
          body:
            "Party size and timing are what change most in restaurant bookings. The agent finds the reservation from the number the guest is calling from, adds or removes covers, moves the time earlier or later, or cancels — and states your policy as you wrote it: how much notice you require, and how long you hold a table before releasing it. A cancelled table goes straight back into availability instead of sitting empty.",
        },
        {
          title: "Menu, prices and dishes",
          body:
            "“Do you do vegetarian?”, “How much is the mandi?”, “Is there a breakfast buffet?” — settled answers, given exactly as they appear on your menu, with nothing improvised and no dish invented. Anything touching allergies or detailed ingredients is noted on the booking and passed to your staff to confirm with the kitchen, because that kind of confirmation belongs with a person.",
        },
        {
          title: "Peak service: no engaged tone",
          body:
            "The agent answers more than one call at the same time, so a guest calling at 9 PM gets the same answer as one calling at 4 in the afternoon — no hold music, no engaged tone. Whether it's the first call or the tenth in the same minute makes no difference to it; what matters is that each one ends in a confirmed booking in the same calendar, so a table isn't taken twice because two people rang at once. The call volume your restaurant needs is sized with you during the intro demo and the agent is provisioned for it, rather than us quoting a generic number that fits nobody.",
        },
        {
          title: "Hours, branches, parking and delivery",
          body:
            "“How late are you open?”, “Where exactly are you?”, “Is there parking?”, “Do you deliver to my area?” — short calls, but more numerous than the bookings themselves. The agent knows each branch's hours, the Ramadan and holiday schedule that shifts every year, each address and its nearest landmark, and your delivery policy and coverage — and points the guest at the nearest branch.",
        },
        {
          title: "It recognises your regulars",
          body:
            "The guest who books every Thursday doesn't start from scratch: the agent greets them by name and knows their usual branch, their usual party size and the area they prefer. The same details sit in front of your employee the instant a call is handed over, so a regular never hears “could you go through that again from the beginning?”",
        },
      ],
    },
    voice: {
      heading: "A restaurant call comes from a noisy place",
      paras: [
        "Your guest rings from the car, or standing in the street, or with people talking around them — and changes their mind while they're speaking: “no, make it 9 instead of 8:30, and we're six now, not four.” The agent stops, listens, and amends both the covers and the time inside the same call, then reads the reference back digit by digit so Thursday doesn't arrive with the booking under somebody else's name.",
        "It answers in your guest's dialect — Najdi, Hijazi or Khaleeji, in a male or female voice, or in English if that's what they prefer. If your guests speak a dialect or language beyond those, we prepare it on request — and we don't advertise dialects we haven't actually released.",
      ],
      linkLead: "The voices and dialects, and how the agent copes with background noise and interruption, are covered on the ",
      linkText: "voice agent page",
    },
    human: {
      heading: "What goes to your staff",
      capsule:
        "The agent works on what is settled and written down: reservations, changes, the menu, hours, branches. Anything involving judgement, a guest's mood or money goes to your employee immediately — with everything that was said attached.",
      items: [
        "Complaints: a missing item, a late order, service that disappointed — an immediate transfer, because a complaint answered by a robot becomes two complaints.",
        "Audible frustration: the agent hears it in the caller's voice and escalates rather than pushing on with a script and making it worse.",
        "Anything involving money: refunds, compensation, discounts, event deposits — financial decisions belong with your employee, not the agent.",
        "Occasions and large groups: the agent captures the details — numbers, date, area, special requests — and passes them to your events lead to confirm.",
        "An explicit request for a human — an iron law the agent never negotiates and never talks the guest out of.",
      ],
      complaintNote:
        "A complaint in a restaurant is time-critical in a way it isn't in other sectors: most of them arrive the same night, sometimes while the guest is still at the table with the food in front of them. So the agent doesn't attempt to resolve one, and doesn't apologise on your behalf and end the call — it apologises once and puts the guest through to the branch manager immediately, with the order or booking details attached. A complaint left until tomorrow doesn't come back to you as a phone call; it comes back as a review on the map that every person searching for your restaurant reads.",
      inheritLead: "At the moment of transfer your employee inherits the escalation reason, the full transcript, a clear Arabic summary and the guest's history with you — ",
      inheritLink: "read how the handoff works in detail",
      afterHours:
        "Your team can also follow calls as they happen from the dashboard: listen in on any call, coach the agent with a whisper the guest never hears, or take the call over in one click. And outside hours there are no dead ends: the agent knows your schedule, helps with what it can — confirming a table for tomorrow, for instance — and where a person is needed it logs a callback with the time that suits the guest, sitting in front of your team the moment they open up.",
    },
    kb: {
      heading: "What goes into your restaurant's knowledge base",
      intro:
        "The agent invents no dish and rules on no price: every answer it gives has to be written down by you first. So we build your restaurant's knowledge base with you out of your own documents — your menu, the map of your areas, your booking policy — rather than generic restaurant content:",
      items: [
        { title: "Menu and prices", body: "Dishes and prices, vegetarian options, the breakfast menu, seasonal offers, and anything currently off the list." },
        { title: "Booking and cancellation policy", body: "Minimum and maximum party sizes, sitting length, how long a table is held, and cancellation and deposit rules for groups." },
        { title: "Areas and tables", body: "Family, singles, outdoor seating, the private room for occasions — how many each takes and which need booking ahead." },
        { title: "Peak times and opening hours", body: "Hours for each day, the slots you don't accept bookings for, and the pressure hours that need arranging in advance." },
        { title: "Branches, parking and delivery", body: "Each branch's address and nearest landmark, parking, delivery coverage and how ordering works with you." },
        { title: "Ramadan and occasions", body: "Iftar and suhoor service and their timings, and how booking works through Ramadan, Eid and the seasons." },
      ],
      mechanics:
        "A menu is the least stable document a business owns: a dish runs out after midnight, a supplier moves a price, a seasonal offer starts and finishes inside a fortnight. You upload yours as it is — PDF or Word, and a menu that exists only as a scan is fine too — the OCR here was built for Arabic, so words come out intact rather than scattered into loose letters — and you change a dish in one place instead of telling every member of staff separately and hoping they all read the message.",
      testing:
        "Before you publish, you check it yourself in the test chat: type your guest's question the way they'd actually ask it — “do you have a table for ten on Thursday in the private room?” — and see the answer and exactly which source it came from. In a restaurant that isn't a formality: a wrong answer about table size or an unavailable dish gets the guest all the way to your door expecting something else, and they leave irritated. Nothing goes live by accident either: you edit a draft, read a comparison showing exactly what moved, and only then publish — with every version kept, so a bad edit is one click from being undone.",
      channelsHeading: "And not only calls",
      channels:
        "Plenty of guests would rather type than dial, especially after midnight while they're planning Thursday night. WhatsApp Business, Telegram and your website chat drop into the same shared inbox as the calls, and the automatic replies on those written channels answer out of your restaurant's knowledge base — so every previous dealing with that guest is in front of your employee straight away, and nobody is asked to go through their order again.",
      kbLinkLead: "How it is assembled, updated and versioned is covered on the ",
      kbLinkText: "knowledge base page",
      securityLead: "Your guests' data and your call recordings have a page of their own explaining exactly where they are stored and processed — ",
      securityLink: "read the security and data page",
    },
    setup: {
      heading: "How we set your restaurant up",
      paras: [
        "We start from the ready-made restaurant template and fill it with your own information: menu and prices, areas and tables, the booking and deposit policy, each branch's hours. Then we settle the complaints line specifically: who receives one, on which number, and which words make the agent escalate on the spot without argument. You hear its voice and try it yourself before it answers a single guest, and arranging your number is the last step.",
        "The part that takes longest in a restaurant isn't the technology — it's the map of your areas and tables: how many each one seats, which group size needs prior approval or a deposit, and the slots you close to bookings altogether so the kitchen isn't buried. We don't hand you a signup form and let you assemble that yourself — our team sets it with you, because a mistake there only surfaces at nine o'clock on a Thursday — the last moment you can do anything about it. We put a duration on it in the intro demo, sized to your branches, your areas and how hard your peak hits.",
      ],
      linkLead: "You can change the menu and the areas yourself once you're live — ",
      linkText: "the agent builder page",
    },
    faqHeading: "Questions restaurant owners ask",
    faq: [
      {
        q: "Does the agent actually book the table, or just take a name?",
        a: "It actually books. The agent checks your reservations calendar on the line — covers, time and area — confirms before the call ends, and reads the reference back to the guest digit by digit. The booking appears in your team's calendar in the same moment.",
      },
      {
        q: "What happens at peak time when several guests ring at once?",
        a: "The agent answers more than one call at the same time, so there's no engaged tone and no hold music in your busiest hour. The call volume your restaurant needs is sized with you in the intro demo and the agent is provisioned for it.",
      },
      {
        q: "Can it take food orders and delivery?",
        a: "The agent answers delivery questions — coverage and how ordering works with you — and records the order details for your team. But there is no payment inside the call, and no ready-made integration with delivery apps today; if that's what you need, say so in the demo and we'll tell you plainly what is and isn't possible.",
      },
      {
        q: "We have several branches — does each need its own agent?",
        a: "You can run an agent per branch with its own information and hours, or one agent that knows every branch, points the guest at the nearest and books into that branch's calendar. Most restaurants start with one and expand — we plan it with you during setup.",
      },
      {
        q: "What if the guest is complaining or upset?",
        a: "It goes to your employee immediately. The agent hears frustration in the caller's tone and escalates, and complaints — or anything involving a refund or compensation — are outside its remit by design. Your employee takes over with the full transcript, the summary and the guest's history.",
      },
      {
        q: "Is there a ready-made restaurant template, or do we start from scratch?",
        a: "There is a ready-made restaurant template: booking and amendment scenarios, menu, hours and parking questions, and a knowledge-base skeleton you fill with your own information. Our team configures it with you and adapts it to how your restaurant runs — there's no self-signup and no leaving you to assemble it alone.",
      },
    ] as FaqItem[],
  },
} as const;

type Dialogue = { tag: string; caller: string; agent: string; human?: string };

/**
 * The mini-dialogue card. Same bubble language as SampleConversation but
 * static and server-rendered: six of these animating in sequence would read
 * as noise, and the copy is the point. The optional `human` turn is the
 * escalation bubble, in the same purple SampleConversation uses.
 */
function DialogueCard({ d, locale }: { d: Dialogue; locale: Locale }) {
  return (
    <article className="card card-hover h-full">
      <p className="eyebrow">{d.tag}</p>
      <div className="mt-4 space-y-2">
        <div className="flex justify-start">
          <p className="max-w-[92%] rounded-2xl rounded-es-md border border-line bg-canvas px-4 py-2.5 text-body leading-relaxed text-ink">
            {d.caller}
          </p>
        </div>
        <div className="flex justify-end">
          <div className="max-w-[92%] rounded-2xl rounded-ee-md bg-ink px-4 py-2.5 text-body leading-relaxed text-white">
            <span className="mb-1 block text-body-sm font-medium text-white/60">
              {locale === "ar" ? "وكيل صوت نجدي" : "Saut Najdi agent"}
            </span>
            {d.agent}
          </div>
        </div>
        {d.human && (
          <div className="flex justify-end">
            <div className="max-w-[92%] rounded-2xl rounded-ee-md bg-brand-purple px-4 py-2.5 text-body leading-relaxed text-white">
              <span className="mb-1 block text-body-sm font-medium text-white/75">
                {locale === "ar" ? "موظفك" : "Your employee"}
              </span>
              {d.human}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function RestaurantsPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-gradient-soft" aria-hidden />
        <div className="container relative py-14 text-center">
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
          {s.calls.items.map((d, i) => (
            <Reveal key={d.tag} delay={i * 0.05}>
              <DialogueCard d={d} locale={locale} />
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-center text-body-sm text-ink/60">{s.calls.note}</p>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-h2">{s.why.heading}</h2>
            {s.why.paras.map((p) => (
              <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{s.handled.eyebrow}</p>
          <h2 className="mt-2 text-h2">{s.handled.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.handled.capsule}</p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {s.handled.items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="card card-hover group h-full border-s-4 border-s-brand-blue">
                <IconChip name={handledIcons[i]} delay={i * 0.08} />
                <h3 className="mt-3 text-h4">{p.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{p.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl">
            <h2 className="text-h2">{s.voice.heading}</h2>
            {s.voice.paras.map((p) => (
              <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
            ))}
            {/* The dialect/voice mechanics live on /product/voice-agent — this
                page only carries the restaurant-specific half. */}
            <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
              {s.voice.linkLead}
              <Link
                href={localePath(locale, "product/voice-agent")}
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                {s.voice.linkText}
              </Link>
              {"."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.human.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.capsule}</p>
        </Reveal>
        {/* One Reveal around the whole list — a <li> may not be wrapped in the
            <div> that Reveal renders. */}
        <Reveal className="mx-auto mt-8 max-w-3xl">
          <ul className="space-y-3">
            {s.human.items.map((x) => (
              <li
                key={x}
                className="flex items-start gap-3 rounded-xl border border-line bg-white p-4 text-body-lg leading-relaxed text-ink/80 shadow-card"
              >
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden />
                {x}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="rounded-2xl border-s-4 border-s-brand-purple bg-white p-5 text-body-lg leading-relaxed text-ink/80 shadow-card">
            {s.human.complaintNote}
          </p>
        </Reveal>
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="text-body-lg leading-relaxed text-ink/75">
            {s.human.inheritLead}
            <Link
              href={localePath(locale, "product/human-handoff")}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.human.inheritLink}
            </Link>
            {"."}
          </p>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.afterHours}</p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-h2">{s.kb.heading}</h2>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.kb.intro}</p>
          </Reveal>
          <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3">
            {s.kb.items.map((k, i) => (
              <Reveal key={k.title} delay={i * 0.05}>
                <article className="card group h-full">
                  <IconChip name={kbIcons[i]} delay={i * 0.08} />
                  <h3 className="mt-3 text-h5">{k.title}</h3>
                  <p className="mt-2 text-body leading-relaxed text-ink/75">{k.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal className="mx-auto mt-8 max-w-3xl">
            <p className="text-body-lg leading-relaxed text-ink/75">{s.kb.mechanics}</p>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.kb.testing}</p>
          </Reveal>
          <Reveal className="mx-auto mt-10 max-w-3xl">
            <h3 className="text-h4">{s.kb.channelsHeading}</h3>
            <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{s.kb.channels}</p>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
              {s.kb.kbLinkLead}
              <Link
                href={localePath(locale, "product/knowledge-base")}
                className="text-brand-blue underline-offset-4 hover:underline"
              >
                {s.kb.kbLinkText}
              </Link>
              {"."}
            </p>
            <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
              {s.kb.securityLead}
              <Link href={localePath(locale, "security")} className="text-brand-blue underline-offset-4 hover:underline">
                {s.kb.securityLink}
              </Link>
              {"."}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl">
          <h2 className="text-h2">{s.setup.heading}</h2>
          {s.setup.paras.map((p) => (
            <p key={p} className="mt-4 text-body-lg leading-relaxed text-ink/75">{p}</p>
          ))}
          <p className="mt-4 text-body-lg leading-relaxed text-ink/70">
            {s.setup.linkLead}
            <Link
              href={localePath(locale, "product/agent-builder")}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.setup.linkText}
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

export const restaurantsFaq = { ar: t.ar.faq, en: t.en.faq };
