import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { CAL_LINK_DEMO } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { Reveal } from "@/components/Reveal";
import { DemoCta } from "@/components/DemoCta";
import { TrustStrip } from "@/components/TrustStrip";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SampleConversation } from "@/components/SampleConversation";
import { IconChip, type IconName } from "@/components/icons";
import type { FaqItem } from "@/lib/schema";

// Positional — keep each array the same length as the list it decorates or a
// card renders with an undefined icon name.
const handledIcons: IconName[] = ["calendar", "repeat", "cost", "clock", "clinic", "people"];
const kbIcons: IconName[] = ["clinic", "cost", "badge", "doc", "clock", "chat"];

/**
 * /solutions/clinics (blueprint §6.3 sector template). The clinic template
 * is genuinely shipped (research §3.1), so «قالب جاهز» is allowed here.
 *
 * Honesty guard specific to this page: the agent is a booking and enquiry
 * receptionist. Nothing on this page may imply medical advice, diagnosis,
 * interpreting a report, or handling clinical patient data — that boundary
 * is stated out loud in the escalation section, because saying it is a
 * stronger trust signal than staying quiet about it.
 */

const t = {
  ar: {
    h1: "الرد الآلي على مكالمات العيادات — مواعيد محجوزة بدون موظف مشغول",
    intro:
      "موظف الاستقبال عندك ما يقدر يسوي شيئين في نفس اللحظة: يستقبل المريض اللي واقف قدامه، ويرد على جوال ما يهدأ. وأغلب المكالمات اللي تفوتك مو حالات معقدة — حجز موعد، تأجيل، سؤال عن سعر الكشف أو الدوام. وكيل صوت نجدي يرد على هذي المكالمات بلهجة مريضك، ويحجز فعلاً في تقويم عيادتك، ويسلّم لموظفك أي شي يحتاج إنسان.",
    cta: "احجز عرضاً",
    calls: {
      eyebrow: "قالب جاهز للعيادات والمستشفيات",
      heading: "المكالمات اللي تفوتك كل يوم",
      body:
        "هذي مو أمثلة نظرية — هذي شكل المكالمات اللي تجي أي عيادة في السعودية. اقرأها وشوف كم وحدة منها راحت عليك أمس لأن الخط كان مشغول، أو لأن الاتصال جا بعد ما خلص الدوام. كل حوار تحت مربوط بنقطة في القسم اللي بعده.",
      note: "حوارات توضيحية — هذا شكل المكالمة، مو تسجيل حقيقي.",
      items: [
        {
          tag: "حجز موعد جديد",
          caller: "السلام عليكم، أبغى أحجز موعد مع الدكتور.",
          agent: "هلا وغلا. أي قسم تبي — أسنان ولا جلدية؟ … تمام، عندنا فاضي بكرة 4:30 العصر، أثبته لك؟",
        },
        {
          tag: "تأجيل موعد",
          caller: "عندي موعد الخميس الصبح وما أقدر أجي، أبغى أأجله.",
          agent: "أبشر. موعدك الخميس 10:15 مع الدكتورة سارة — أقرب بديل عندها الأحد 11:00، يمشي؟",
        },
        {
          tag: "سعر الكشف والتأمين",
          caller: "كم الكشف عند الجلدية؟ وتقبلون تأمين شركتي؟",
          agent: "الكشف عند الجلدية 250 ريال، وتأمين شركتك مقبول عندنا — بس جيب معك البطاقة والهوية يوم الموعد.",
        },
        {
          tag: "الدوام والموقع",
          caller: "دوامكم لين كم اليوم؟ ووينكم بالضبط؟",
          agent: "اليوم دوامنا لين 10 بالليل، وإحنا في فرع الملقا على طريق أنس بن مالك — أرسل لك الموقع؟",
        },
        {
          tag: "سؤال عن طبيب بالاسم",
          caller: "الدكتورة سارة تداوم يوم الأحد؟",
          agent: "الدكتورة سارة تداوم الأحد والثلاثاء من 4 العصر لين 9. أحجز لك عندها الأحد؟",
        },
        {
          tag: "تأكيد موعد ورقم الحجز",
          caller: "حجزت أمس بس نسيت وقت الموعد ورقمه.",
          agent: "موعدك اليوم 6:45 مع الدكتور خالد في فرع النرجس، ورقم حجزك: 4 — 8 — 2 — 1، أقرأه لك رقم رقم مرة ثانية؟",
        },
      ],
    },
    why: {
      heading: "ليش المكالمة الفايتة في العيادة أغلى من غيرها؟",
      paras: [
        "في أغلب الأنشطة، المكالمة اللي ما تُرد عليها تعني فرصة راحت. في العيادة تعني شيئين مع بعض: فتحة موعد فاضية في جدول طبيب دوامه محسوب بالساعة، ومريض راح لعيادة ثانية. والمريض ما يزعل ويكلمك مرة ثانية — يقفل ويتصل على اللي بعدك في نتائج البحث، وغالباً ما ترجع تسمع عنه.",
        "والوقت اللي تجيك فيه أكثر المكالمات هو نفس الوقت اللي فريقك فيه أقل قدرة على الرد: أول ساعة من الدوام، ووقت الفتح بعد الظهر، وآخر نصف ساعة قبل الإغلاق. موظف الاستقبال في هذي الأوقات يستقبل مرضى، ويجهز أوراق تأمين، ويرد على جوال — والمكالمة أول شي يضحّي فيه، لأن اللي واقف قدامه أهم. وهذا قرار صحيح منه، بس نتيجته إن مكالمات تضيع كل يوم.",
        "وفيه خسارة ثانية أثقل من المكالمة الفايتة نفسها: عدم الحضور. مريض حجز قبل عشرة أيام ونسي، أو تغيّر ظرفه ودوّر أحد يرد عليه الساعة تسع بالليل عشان يلغي وما لقى — فالفتحة تقعد فاضية والطبيب ينتظر، وما أحد على قائمة الانتظار يعرف إنها فضت. أغلب حالات عدم الحضور هذي كانت بتصير إلغاءً مرتّباً لو كان فيه أحد يرد.",
        "وجدول الأطباء نفسه مصدر تعب دايم في العيادة: طبيب يعتذر عن يوم، وطبيبة ترجع من إجازة، وقسم يفتح بعد الظهر بس، والجلدية يتغيّر دوامها في رمضان. أي تعديل في الجدول لازم يوصل لثلاث جهات في نفس اللحظة — الاستقبال، والتقويم، واللي يرد على الجوال — وأكثر حجز غلط في العيادة سببه إن الطرف الثالث ما وصله التعديل. ولما يكون اللي يرد على الجوال يقرأ من نفس التقويم اللي عدّلته، تسقط حلقة كاملة من هالسلسلة.",
        "والمكالمات المتكررة — «متى موعدي؟» و«دوامكم لين كم؟» و«الدكتور موجود اليوم؟» — تاكل من وقته أكثر من الحجوزات الجديدة نفسها، وهي بالضبط النوع اللي يقدر الوكيل يخلّصه من أوله لآخره. النتيجة مو إن موظفك يشتغل أقل، النتيجة إنه يشتغل على اللي يحتاج إنسان فعلاً.",
      ],
    },
    handled: {
      eyebrow: "مربوط بالحوارات اللي فوق",
      heading: "وش يتكفل فيه الوكيل بالضبط؟",
      capsule:
        "الفرق بين وكيل يشتغل وبين رد آلي يضيّع وقت مريضك هو وش يقدر يخلّصه لآخره. الوكيل يكمل كل مكالمة من اللي فوق بنفسه — ما يسجل رسالة ويوعد المريض إن أحد يرجع له. وكل نقطة تحت مربوطة بحوار قريته قبل شوي.",
      items: [
        {
          title: "يحجز الموعد فعلاً — مو يسجل طلب",
          body:
            "الوكيل يفتح تقويم عيادتك وهو على الخط، يشوف المتاح عند الطبيب اللي طلبه المريض، ويثبت الموعد قبل ما تنتهي المكالمة. وإذا الوقت اللي طلبه مو فاضي، يعرض عليه أقرب بديلين بدل ما يقول له «كلّمنا بعدين». وبعد ما يخلص يقرأ له رقم الحجز رقم رقم بالعربي، عشان يكتبه من أول مرة بدون ما يطلب الإعادة. والموعد يظهر لفريقك في التقويم في نفس اللحظة، فما يصير حجزين على نفس الفتحة.",
        },
        {
          title: "التأجيل والإلغاء وسياسة عيادتك",
          body:
            "أكثر مكالمة تاكل وقت الاستقبال هي تعديل موعد، وهي بالضبط أسهل مكالمة يتكفل فيها الوكيل. يلقى موعد المريض من رقمه اللي يتصل منه، يأجله أو يلغيه، ويقول له سياسة الإلغاء زي ما كتبتها أنت: كم ساعة قبل الموعد، ووش يصير لو تأخر، ووش حكم عدم الحضور. الفتحة اللي تنلغي ترجع متاحة على طول لمريض ثاني بدل ما تضيع.",
        },
        {
          title: "أسئلة الأسعار والتأمين",
          body:
            "أسعار الكشف والمتابعة، وشركات التأمين المقبولة، ووش يحتاج المريض يجيبه معه — كلها إجابات محسومة عندك مسبقاً، والوكيل يعطيها زي ما هي. ما يجتهد من راسه، وما يوعد المريض بشي ما قلته أنت. وإذا كان السؤال عن حالة تأمينية خاصة أو موافقة مسبقة تحتاج مراجعة، يحوّلها لموظفك بدل ما يخمّن.",
        },
        {
          title: "الدوام والفروع والوصول",
          body:
            "«دوامكم لين كم؟» و«وينكم بالضبط؟» و«فيه مواقف؟» — مكالمات صغيرة، بس عددها في اليوم أكبر من أي شي ثاني. الوكيل يعرف دوام كل فرع، والإجازات الرسمية، ودوام رمضان اللي يتغير كل سنة، وعنوان كل فرع وأقرب علامة مميزة له. ويوجّه المريض للفرع الأقرب له إذا كان عندك أكثر من فرع.",
        },
        {
          title: "جدول الأطباء",
          body:
            "المريض غالباً يسأل عن طبيب بالاسم، مو عن قسم. الوكيل يعرف مين يداوم وأي يوم وأي ساعة، وتخصص كل طبيب، وفي أي فرع — فيوجّه المريض للطبيب الصح من أول مكالمة، بدل ما يجي في يوم الطبيب فيه إجازة ويرجع زعلان. وإذا كان الطبيب مشغول لأسبوعين، يقول له بصراحة ويعرض عليه زميله في نفس التخصص.",
        },
        {
          title: "المريض الراجع… يعرفه",
          body:
            "المريض اللي كلّمكم قبل ما يبدأ من الصفر كل مرة: الوكيل يحييه باسمه، ويعرف آخر موعد له وتفضيلاته — فرع معين، أو طبيبة بدل طبيب، أو وقت مسائي عشان دوامه. ونفس هذي المعلومات تكون قدام موظفك لحظة ما يستلم المكالمة، فما يسمع أبداً جملة «أنا قلت هذا الكلام للي قبلك».",
        },
      ],
    },
    voice: {
      heading: "مكالمة العيادة كلها أسماء وأرقام",
      paras: [
        "اسم طبيبة، وتاريخ موعد، ورقم حجز — هذي مكالمة العيادة. والمريض يقول «الساعة أربعة ونص» ويغيّر رأيه بنص الجملة، فالوكيل يسكت ويسمع ويعدّل، ويقرأ رقم الحجز رقم رقم بالعربي عشان يكتبه من أول مرة بدل ما يتصل ثاني يوم يسأل عنه.",
        "ونبرته تفرق في العيادة أكثر من أي مكان ثاني: هدوء وهو يأكد موعد، واعتذار وهو يحوّل مريض متضايق لموظفك. وإذا كان مرضاك يتكلمون لهجة أو لغة ثانية، نجهزها لك على طلبك — وما نعلن لهجات ما أطلقناها فعلاً.",
      ],
      linkLead: "واللهجات والأصوات المتاحة، وكيف يتعامل الوكيل مع المقاطعة والأرقام المنطوقة، مشروحة بالتفصيل في ",
      linkText: "صفحة وكيل الصوت",
    },
    human: {
      heading: "وش يروح لموظفك؟",
      capsule:
        "الحد فاصل وواضح من أول يوم: الوكيل يشتغل في اللوجستيات — حجز وتأجيل وأسعار ودوام وفروع. وأي شي يخص صحة المريض نفسه يروح لموظفك على طول، ومعه كل الكلام اللي صار في المكالمة.",
      honesty:
        "ونقولها بصراحة عشان ما يستنتجها أحد من السكوت: وكيل صوت نجدي ما يعطي استشارة طبية، ولا يشخّص، ولا يفسر تحليل أو تقرير، ولا يناقش حالة مريض. هذي مو حدود تقنية نعتذر عنها — هذي قاعدة مقصودة في إعداد الوكيل، لأن السؤال الطبي مكانه عند مختص في عيادتك، وانتهى.",
      honestyMore:
        "والسؤال الطبي في العيادة نادراً يجي واضح ومعنون. غالباً يجي مغلّف داخل سؤال إداري: «أحجز عند الجلدية ولا الباطنية؟ عندي حبوب طالعة من أسبوع» — ظاهرها سؤال عن قسم، وباطنها طلب رأي. هنا الوكيل ما يختار القسم عن المريض ولا يعلّق على الأعراض؛ يقول له إن اللي يحدد هذا مختص، ويحوّله لموظفك، أو يحجز له في القسم اللي كتبته أنت في سياستك لهذي الحالة. وهذا بالضبط الفرق بين وكيل مضبوط على عيادة وبين رد آلي عام: مو إنه يعرف أكثر، إنه يعرف وين يوقف.",
      items: [
        "أي سؤال طبي — أعراض، دواء، ألم بعد إجراء، تفسير نتيجة — تحويل فوري لموظفك، والوكيل ما يحاول يجاوب ولو كان الجواب «واضح».",
        "الشكاوى ونبرة الانزعاج: تأخير، خطأ في موعد، مريض تعبان من الانتظار — الوكيل يلتقط الانزعاج في صوت المتصل ويصعّد بدل ما يكمل نص محفوظ.",
        "طلب المريض إنسان — قانون ثابت ما يتفاوض فيه الوكيل ولا يحاول يقنعه إنه يقدر يساعده.",
        "الحالات المستعجلة — الوكيل ما يتصرف فيها أبداً. وإذا كانت العيادة مقفلة، يقول للمريض بصراحة إنها مقفلة ويسجل طلب اتصال، وما يعطيه ولا لحظة انطباع إنه بديل عن الطوارئ.",
      ],
      inheritLead: "ولحظة التحويل، موظفك يستلم سبب التصعيد والنص الكامل للمكالمة وملخصاً عربياً واضحاً وتاريخ المريض معكم — ",
      inheritLink: "اقرأ كيف يشتغل التصعيد بالتفصيل",
      afterHours:
        "وبرا الدوام ما فيه طريق مسدود: الوكيل يعرف أوقات عيادتك، فيخدم المريض في اللي يقدر عليه — يحجز له موعد بكرة مثلاً — وإذا احتاج الموضوع إنسان يسجل طلب اتصال بتفاصيله ووقته المفضل، ويظهر لفريقك أول ما يفتح الدوام.",
      sceneHeading: "شكل التصعيد وهو يصير",
      sceneBody:
        "مريض يحجز موعد أسنان عادي، وبعدها يسأل سؤال عن ألم بعد حشوة. هنا بالضبط ينتهي شغل الوكيل ويبدأ شغل موظفك:",
    },
    kb: {
      heading: "وش يدخل في قاعدة معرفة عيادتك؟",
      intro:
        "وكيلك ما يعرف عن عيادتك إلا اللي تعطيه إياه — وهذي ميزة مو نقص، لأنها تقفل باب الاجتهاد من راسه. عشان كذا أول شي نسويه معك هو بناء قاعدة معرفة عيادتك من ملفاتك أنت، مو من كلام عام عن العيادات:",
      items: [
        { title: "جدول الأطباء", body: "مين يداوم أي يوم وأي ساعة، وتخصص كل واحد، وفي أي فرع، ومين البديل إذا كان مشغول." },
        { title: "قائمة الأسعار", body: "سعر الكشف والمتابعة والإجراءات، والفرق بين الكشف الأول والمراجعة، ووش الأسعار اللي تتغير بالتأمين." },
        { title: "شركات التأمين", body: "المقبول والمرفوض، ووش يحتاج موافقة مسبقة، ووش يجيبه المريض معه يوم الموعد." },
        { title: "سياسة الإلغاء والتأخير", body: "كم ساعة قبل يقدر يلغي، ووش يصير لو تأخر ربع ساعة، وسياستكم في عدم الحضور." },
        { title: "الدوام والفروع", body: "دوام كل فرع، والإجازات الرسمية، ودوام رمضان، وعنوان كل فرع والمواقف وأقرب علامة مميزة." },
        { title: "الأسئلة اللي تتكرر كل يوم", body: "«فيه قسم نسائي؟» «أحتاج موعد ولا أجي مباشرة؟» «تستقبلون أطفال؟» — الأسئلة اللي يكررها موظفك عشر مرات في اليوم." },
      ],
      mechanics:
        "وأصعب ملف في العيادة هو اللي ما يثبت: جدول الأطباء يتعدّل كل أسبوع، وقائمة شركات التأمين تنقص وتزيد بعقد ينتهي، ودوام رمضان يختلف عن باقي السنة كلها. تحط ملفاتك زي ما هي — PDF أو Word، وحتى لو كان الجدول ورقة ممسوحة بالسكانر، لأن التعرّف الضوئي عندنا عربي حقيقي ويطلع الحروف موصولة صح — وتعدّل المعلومة في مكان واحد بدل ما تلاحقها في أربع أوراق ملزوقة على الاستقبال.",
      testing:
        "وقبل ما تنشر، تجرب بنفسك في المحادثة التجريبية: تكتب سؤال مريضك زي ما بيقوله — «كم كشف الجلدية بتأميني؟» — وتشوف الجواب اللي يطلع ومن وين جابه بالضبط. وهذي الخطوة مو شكلية في عيادة: سعر غلط ينقال لمريض قبل بأسبوع يتحول لخلاف على الكاونتر يوم يجي. والنشر متعمد: مسودة، ثم مراجعة تبيّن لك وش تغيّر، ثم نشر بنسخة محفوظة تقدر ترجع لها.",
      channelsHeading: "ومو بس المكالمات",
      channels:
        "مرضى كثير يفضلون يكتبون بدل ما يتصلون، خصوصاً في السؤال اللي يستحون يقولونه بصوت عالي وأحد جالس جنبهم. واتساب للأعمال وتيليجرام ودردشة موقعك تنزل كلها في نفس صندوق الوارد اللي فيه المكالمات، والرد الآلي على هذي القنوات النصية يرجع لقاعدة معرفة عيادتك ويجاوب منها — فموظفك يشوف تاريخ المريض كامل في مكان واحد بدل ما يتنقل بين أربعة تطبيقات ويسأله يعيد كلامه.",
      kbLinkLead: "وطريقة بناء قاعدة المعرفة وتنظيمها وتحديثها مشروحة كاملة في ",
      kbLinkText: "صفحة قاعدة المعرفة",
      securityLead: "وبيانات مرضاك لها صفحة كاملة تشرح وين تنحفظ ووين تُعالَج بالضبط — ",
      securityLink: "اقرأ صفحة الأمان والبيانات",
    },
    setup: {
      heading: "كيف نجهز عيادتك؟",
      paras: [
        "نبدأ من القالب الجاهز للعيادات والمستشفيات، ونعبيه بمعلومات عيادتك أنت: جدول الأطباء، والأسعار، وشركات التأمين، وسياسة الإلغاء، ودوام الفروع. بعدها نضبط معك قواعد التصعيد — وش يروح لموظفك، ومتى، ولمين — وتجرب الوكيل بنفسك في محادثة تجريبية وتسمع صوته قبل ما يرد على أي مريض. وآخر خطوة نرتب معك تفعيل الرقم.",
        "والشي اللي ياخذ وقت أكثر من غيره في العيادة مو التقنية — هو جدول الأطباء وحدود السؤال الطبي: مين يغطي مكان مين لما يعتذر، ووش السؤال اللي ما ينجاوب عليه أبداً مهما كان جوابه واضح. وما فيه تسجيل ذاتي في صوت نجدي: فريقنا يضبط هذي معك، لأن الخطأ فيها ما يكتشفه مريضك بعد شهر — يكتشفه في أول مكالمة. والجدول الزمني بالتفصيل نعطيك إياه في العرض التعريفي، على قد حجم مكالماتك وعدد فروعك.",
      ],
      linkLead: "وكيف يتبني الوكيل ويتعدّل بعدين بدون ما ترجع لنا في كل تغيير — ",
      linkText: "صفحة بناء الوكيل",
    },
    faqHeading: "أسئلة أصحاب العيادات",
    faq: [
      {
        q: "الوكيل يحجز الموعد فعلاً ولا بس يسجل الطلب؟",
        a: "يحجز فعلاً. الوكيل يشوف المتاح في تقويم عيادتك وهو على الخط، يثبت الموعد قبل ما تنتهي المكالمة، ويقرأ رقم الحجز للمريض رقم رقم بالعربي — والموعد يظهر لفريقك في التقويم في نفس اللحظة.",
      },
      {
        q: "وش يسوي إذا سأل المريض سؤال طبي؟",
        a: "يحوّل على طول. وكيل صوت نجدي ما يعطي استشارة طبية ولا يشخّص ولا يفسر تقرير — أي سؤال يخص صحة المريض يروح لموظفك ومعه نص المكالمة وملخصها وتاريخ المريض عندكم.",
      },
      {
        q: "عندنا أكثر من فرع وأكثر من طبيب — يفرق؟",
        a: "ما يفرق. جدول الأطباء وأيام دوامهم وفروعهم كلها مجهزة في إعداد وكيلك، والوكيل يوجّه المريض للفرع والطبيب الصح ويحجز في تقويم نفس الفرع اللي اختاره.",
      },
      {
        q: "وين تنحفظ بيانات مرضانا؟",
        a: "التخزين الدائم في منطقة الخليج (الدوحة) على Google Cloud، وتسجيلات المكالمات تنحذف تلقائياً بعد 90 يوماً، وكل اطلاع يتسجل في سجل تدقيق ما ينعدل ولا ينحذف. وأماكن المعالجة بالضبط مذكورة بالتفصيل في صفحة الأمان والبيانات.",
      },
      {
        q: "وإذا اتصل مريض بعد الدوام؟",
        a: "الوكيل يعرف دوام عيادتك: يخدم المريض في اللي يقدر عليه — يحجز له موعد بكرة مثلاً — وإذا احتاج الموضوع إنسان يسجل طلب اتصال بوقته المفضل ويظهر لفريقك أول الدوام. وما يوهم المريض إن العيادة مفتوحة، ولا يقدم نفسه كبديل عن الطوارئ.",
      },
      {
        q: "فيه قالب جاهز للعيادات ولا نبدأ من الصفر؟",
        a: "فيه قالب جاهز للعيادات والمستشفيات: سيناريوهات الحجز والتأجيل وأسئلة الدوام والأسعار، وهيكل قاعدة معرفة تعبيه بمعلوماتك. وفريقنا يجهزه معك ويعدله على طريقة عيادتك — ما في تسجيل ذاتي ولا نتركك تركّب النظام بنفسك.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "AI call answering for clinics — appointments booked while your front desk is busy",
    intro:
      "Your receptionist cannot do two things at once: look after the patient standing in front of them and answer a phone that never stops. Most of the calls you miss aren't complicated — a booking, a reschedule, a question about the consultation fee or your opening hours. The Saut Najdi agent answers those in your patient's own dialect, books the slot in your clinic's calendar, and hands anything that needs a person to your staff.",
    cta: "Book a demo",
    calls: {
      eyebrow: "A ready-made clinic and hospital template",
      heading: "The calls you're missing every day",
      body:
        "These aren't hypotheticals — this is what calls to a Saudi clinic actually sound like. Read them and count how many went unanswered yesterday because the line was engaged, or because the call came in after closing. Every dialogue below maps to a point in the section that follows.",
      note: "Illustrative dialogues — this is what a call looks like, not a real recording.",
      items: [
        {
          tag: "A new appointment",
          caller: "Hi, I'd like to book an appointment with the doctor.",
          agent: "Of course — which department, dental or dermatology? … We have tomorrow at 4:30 PM free, shall I confirm it for you?",
        },
        {
          tag: "Rescheduling",
          caller: "I have an appointment on Thursday morning and I can't make it.",
          agent: "No problem. That's Thursday 10:15 with Dr. Sarah — her nearest alternative is Sunday at 11:00. Does that work?",
        },
        {
          tag: "Fees and insurance",
          caller: "How much is a dermatology consultation? And do you take my insurer?",
          agent: "A dermatology consultation is SAR 250, and yes, your insurer is accepted — just bring your card and ID on the day.",
        },
        {
          tag: "Hours and location",
          caller: "How late are you open today, and where exactly are you?",
          agent: "We're open until 10 PM today, and we're in the Malqa branch on Anas bin Malik Road — shall I send you the location?",
        },
        {
          tag: "Asking for a doctor by name",
          caller: "Is Dr. Sarah in on Sunday?",
          agent: "Dr. Sarah works Sundays and Tuesdays, 4 PM to 9. Shall I book you with her on Sunday?",
        },
        {
          tag: "Confirming a booking",
          caller: "I booked yesterday but I've forgotten the time and the reference.",
          agent: "You're booked today at 6:45 with Dr. Khalid at the Narjis branch, reference 4 — 8 — 2 — 1. Would you like me to read it back once more?",
        },
      ],
    },
    why: {
      heading: "Why a missed call costs a clinic more than most businesses",
      paras: [
        "In most businesses an unanswered call is a lost opportunity. In a clinic it is two losses at once: an empty slot in the diary of a doctor whose time is costed by the hour, and a patient who went elsewhere. Patients rarely complain about it — they hang up and call whoever is next in the search results, and you never hear about it.",
        "The hours that generate the most calls are exactly the hours your team is least able to answer them: the first hour after opening, the afternoon reopening, and the last half hour before you close. At those moments your receptionist is checking patients in, handling insurance paperwork and holding a ringing phone — and the phone is the first thing to be sacrificed, because the person standing in front of them matters more. That's the right call to make, and its consequence is calls lost every single day.",
        "There is a second loss that weighs more than the missed call itself: the no-show. A patient booked ten days ago and forgot, or their plans changed and at nine in the evening they found nobody to cancel with — so the slot sits empty, the doctor waits, and nobody on the waiting list ever learns it came free. Most of those no-shows would have been orderly cancellations if somebody had answered.",
        "The rota is its own standing problem. A doctor drops a day, a colleague comes back from leave, a department opens afternoons only, dermatology shifts its hours for Ramadan. Every change has to reach three places at once — the front desk, the calendar, and whoever is answering the phone — and most wrong bookings in a clinic happen because the third one never got the update. When the thing answering the phone is reading the calendar you just edited, that link comes out of the chain.",
        "The repetitive ones — “when is my appointment?”, “how late are you open?”, “is the doctor in today?” — take more of that time than new bookings do, and they are precisely the calls the agent can finish end to end. The point isn't that your receptionist works less; it's that they spend their time on the patients who need a person.",
      ],
    },
    handled: {
      eyebrow: "Mapped to the dialogues above",
      heading: "What the agent handles, precisely",
      capsule:
        "The difference between an agent that works and an auto-attendant that wastes your patient's time is how much it can finish on its own. Each of the calls above is completed on the line — not logged as a message with a promise that somebody will call back. Every point below maps to a dialogue you just read.",
      items: [
        {
          title: "It actually books — it doesn't take a request",
          body:
            "The agent opens your clinic's calendar while still on the line, checks what's free with the doctor the patient asked for, and confirms the slot before the call ends. If the requested time isn't available it offers the two nearest alternatives rather than saying “call us back later.” It then reads the booking reference back digit by digit in Arabic so the patient can write it down first time. The appointment appears in your team's calendar in the same moment, so two patients never land on one slot.",
        },
        {
          title: "Reschedules, cancellations and your policy",
          body:
            "Changing an appointment is the call that eats the most front-desk time, and it's the easiest one for the agent to take off your hands. It finds the patient's booking from the number they're calling from, moves or cancels it, and states your cancellation policy exactly as you wrote it: how many hours' notice, what happens on a late arrival, how a no-show is treated. A cancelled slot goes straight back into availability instead of being lost.",
        },
        {
          title: "Fees and insurance questions",
          body:
            "Consultation and follow-up fees, which insurers you accept, and what the patient needs to bring — these are answers you've already settled, and the agent gives them as written. It doesn't improvise, and it doesn't promise the patient something you never said. Where the question involves a specific approval or an unusual policy case, it escalates instead of guessing.",
        },
        {
          title: "Hours, branches and getting there",
          body:
            "“How late are you open?”, “Where exactly are you?”, “Is there parking?” — small calls, but the highest-volume ones you get. The agent knows each branch's hours, public holidays, the Ramadan schedule that changes every year, and each branch's address and nearest landmark. With multiple branches, it points the patient at the one closest to them.",
        },
        {
          title: "The doctors' rota",
          body:
            "Patients usually ask for a doctor by name, not for a department. The agent knows who works which days and hours, each doctor's specialty, and which branch they're in — so the patient is routed correctly on the first call instead of arriving on the doctor's day off. If that doctor is booked out for a fortnight, it says so plainly and offers a colleague in the same specialty.",
        },
        {
          title: "It recognises returning patients",
          body:
            "A patient who has called before doesn't start from zero: the agent greets them by name and knows their last appointment and their preferences — a particular branch, a female doctor, an evening slot that fits their work. The same details are in front of your employee the instant a call is handed over, so nobody ever hears “I already told the last person.”",
        },
      ],
    },
    voice: {
      heading: "A clinic call is names and numbers, spoken quickly",
      paras: [
        "A doctor's name, a date, a booking reference — that is the whole call. The patient says “half four”, then changes their mind mid-sentence, so the agent stops, listens and amends, and reads the reference back digit by digit in Arabic so it is written down first time instead of prompting another call the next morning.",
        "Tone carries more weight in a clinic than almost anywhere: calm while confirming an appointment, apologetic while handing an unhappy patient to your staff. If your patients speak a dialect or language beyond the ones we run, we prepare it on request — and we don't advertise dialects we haven't actually released.",
      ],
      linkLead: "The dialects and voices available, and how the agent deals with interruption and spoken numbers, are set out in detail on the ",
      linkText: "voice agent page",
    },
    human: {
      heading: "What goes to your staff",
      capsule:
        "The boundary is drawn on day one: the agent handles logistics — bookings, reschedules, fees, hours, branches. Anything touching the patient's health itself goes to your staff immediately, with the whole conversation attached.",
      honesty:
        "We'd rather say this out loud than let anyone infer it from silence: the Saut Najdi agent does not give medical advice, does not diagnose, does not interpret a test result or a report, and does not discuss a patient's condition. That isn't a technical limitation we're apologising for — it's a deliberate rule in how the agent is configured, because a clinical question belongs with a clinician in your practice.",
      honestyMore:
        "A medical question rarely arrives labelled as one. It usually comes wrapped inside an administrative one: “should I book dermatology or internal medicine? I've had a rash for a week” — a question about a department on the surface, a request for an opinion underneath. The agent does not pick the department on the patient's behalf and does not comment on the symptom; it says that a clinician decides that, and either transfers to your staff or books into whichever department your own written policy names for that case. That is the difference between an agent configured for a clinic and a generic auto-attendant: not that it knows more, but that it knows where to stop.",
      items: [
        "Any medical question — symptoms, medication, pain after a procedure, a result to interpret — transfers immediately, and the agent does not attempt an answer even when the answer looks obvious.",
        "Complaints and audible frustration: a delay, a mistaken appointment, a patient worn out by waiting — the agent hears the frustration in the caller's voice and escalates rather than reciting a script.",
        "An explicit request for a human — an iron law the agent never negotiates and never talks the patient out of.",
        "Urgent situations — the agent never improvises around one. If the clinic is closed it says so plainly and logs a callback, and at no point presents itself as a substitute for emergency care.",
      ],
      inheritLead: "At the moment of transfer your employee inherits the escalation reason, the full transcript, a clear Arabic summary and the patient's history with you — ",
      inheritLink: "read how the handoff works in detail",
      afterHours:
        "Outside hours there are no dead ends either: the agent knows your schedule, serves the patient with what it can — booking them in for tomorrow, for instance — and where a person is needed it logs a callback request with the details and the patient's preferred time, waiting for your team when the doors open.",
      sceneHeading: "What an escalation looks like",
      sceneBody:
        "A patient books a routine dental appointment, then asks about pain after a filling. That is exactly where the agent's job ends and your employee's begins:",
    },
    kb: {
      heading: "What goes into your clinic's knowledge base",
      intro:
        "Your agent knows nothing about your clinic beyond what you give it — which is a feature, not a gap, because it closes the door on improvisation. So the first thing we build with you is your clinic's knowledge base, from your own documents rather than generic clinic content:",
      items: [
        { title: "The doctors' rota", body: "Who works which days and hours, each one's specialty and branch, and who covers when they're away." },
        { title: "The price list", body: "Consultation, follow-up and procedure fees, the difference between a first visit and a review, and which prices change under insurance." },
        { title: "Insurers", body: "Which are accepted and which aren't, what needs pre-approval, and what the patient must bring on the day." },
        { title: "Cancellation and lateness policy", body: "How much notice is required, what happens on a fifteen-minute delay, and how you treat a no-show." },
        { title: "Hours and branches", body: "Each branch's hours, public holidays, the Ramadan schedule, addresses, parking and the nearest landmark." },
        { title: "The questions asked every single day", body: "“Is there a women's section?” “Do I need an appointment or can I walk in?” “Do you see children?” — the ones your receptionist answers ten times a day." },
      ],
      mechanics:
        "The hardest documents in a clinic are the ones that never sit still: the rota is redrawn weekly, the insurer list gains and loses a name every time a contract turns over, and Ramadan hours differ from the rest of the year entirely. You upload them as they are — PDF or Word, and a rota you only have as a scan is fine, because the Arabic OCR here is genuinely Arabic and letters come out correctly joined — and you edit a fact in one place instead of chasing it across four sheets taped to the front desk.",
      testing:
        "Before you publish, you check it yourself in the test chat: type your patient's question the way they'd actually ask it — “how much is a dermatology consultation on my insurance?” — and see the answer and exactly which source it came from. In a clinic that step is not a formality: a price quoted wrongly a week ago turns into an argument at the counter on the day. Publishing is deliberate too — draft, then a review that shows you what changed, then a published version you can roll back to.",
      channelsHeading: "And not only calls",
      channels:
        "Many patients would rather type than dial, particularly for the question they'd be embarrassed to say out loud with someone sitting next to them. WhatsApp Business, Telegram and your website chat all land in the same team inbox as the calls, and the automatic replies on those written channels answer from your clinic's knowledge base — so your employee sees the patient's full history in one place instead of switching between four apps and asking them to repeat themselves.",
      kbLinkLead: "How the knowledge base is built, organised and kept current is covered in full on the ",
      kbLinkText: "knowledge base page",
      securityLead: "Your patients' data has a page of its own explaining exactly where it is stored and where it is processed — ",
      securityLink: "read the security and data page",
    },
    setup: {
      heading: "How we set your clinic up",
      paras: [
        "We start from the ready-made clinic and hospital template and fill it with your clinic's own information: the doctors' rota, fees, insurers, the cancellation policy, branch hours. Then we set your escalation rules with you — what goes to your staff, when, and to whom — and you try the agent yourself in a test conversation and hear its voice before a single patient does. Arranging your number is the last step.",
        "The part that takes longest in a clinic isn't the technology — it's the rota and the boundary around the medical question: who covers for whom when a doctor drops a day, and which question is never answered no matter how obvious the answer looks. There is no self-signup at Saut Najdi: our team settles those with you, because a mistake there isn't discovered a month later, it's discovered on the first call. The detailed timeline comes in the intro demo, sized to your call volume and the number of branches you run.",
      ],
      linkLead: "How the agent is built, and how you change it afterwards without coming back to us for every edit — ",
      linkText: "the agent builder page",
    },
    faqHeading: "Questions clinic owners ask",
    faq: [
      {
        q: "Does the agent actually book, or just take a request?",
        a: "It actually books. The agent checks availability in your clinic's calendar while on the line, confirms the appointment before the call ends, and reads the reference back to the patient digit by digit — and the booking appears in your team's calendar in the same moment.",
      },
      {
        q: "What happens if a patient asks a medical question?",
        a: "It transfers immediately. The Saut Najdi agent gives no medical advice, makes no diagnosis and interprets no report — anything touching the patient's health goes to your employee with the transcript, the summary and the patient's history attached.",
      },
      {
        q: "We have several branches and several doctors — is that a problem?",
        a: "No. The rota, the working days and the branches are all configured into your agent, and it routes the patient to the right branch and doctor, then books into that branch's calendar.",
      },
      {
        q: "Where is our patients' data stored?",
        a: "Permanent storage is in the Gulf region (Doha) on Google Cloud, call recordings are deleted automatically after 90 days, and every access is written to an append-only audit log. Exactly where processing happens is set out in detail on the security page.",
      },
      {
        q: "What if a patient calls after hours?",
        a: "The agent knows your schedule: it helps with what it can — booking tomorrow's slot, for example — and where a person is needed it logs a callback request with the patient's preferred time, ready for your team in the morning. It never implies the clinic is open, and never presents itself as an alternative to emergency care.",
      },
      {
        q: "Is there a ready-made clinic template, or do we start from scratch?",
        a: "There is a ready-made template for clinics and hospitals: booking and rescheduling scenarios, hours and fee questions, and a knowledge-base skeleton you fill with your own information. Our team configures it with you and adapts it to how your clinic works — there's no self-signup and no leaving you to assemble it alone.",
      },
    ] as FaqItem[],
  },
} as const;

type Dialogue = { tag: string; caller: string; agent: string };

/**
 * The mini-dialogue card. Same bubble language as SampleConversation but
 * static and server-rendered: six of these animating in sequence would read
 * as noise, and the copy is the point.
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
      </div>
    </article>
  );
}

export function ClinicsPage({ locale }: { locale: Locale }) {
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
                page only carries the clinic-specific half. */}
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
        {/* The medical boundary is stated out loud — a clinic buyer is asking
            it silently anyway, and saying it first is the trust signal. */}
        <Reveal className="mx-auto mt-6 max-w-3xl">
          <p className="rounded-2xl border-s-4 border-s-brand-purple bg-white p-5 text-body-lg leading-relaxed text-ink/80 shadow-card">
            {s.human.honesty}
          </p>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.human.honestyMore}</p>
        </Reveal>
        {/* One Reveal around the whole list — a <li> may not be wrapped in the
            <div> that Reveal renders. */}
        <Reveal className="mx-auto mt-6 max-w-3xl">
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

        <Reveal className="mx-auto mt-14 max-w-2xl text-center">
          <h3 className="text-h3">{s.human.sceneHeading}</h3>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">{s.human.sceneBody}</p>
        </Reveal>
        <div className="mt-8">
          <SampleConversation locale={locale} />
        </div>
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

export const clinicsFaq = { ar: t.ar.faq, en: t.en.faq };
