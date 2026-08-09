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

// One icon per capability section, positional — keep this array the same
// length as `sections` or a new card renders with an undefined icon name.
const sectionIcons: IconName[] = ["wave", "headset", "check", "mic", "badge", "database", "doc"];

/**
 * /product/voice-agent (spec P2-22 row 3) — the capability page behind the
 * home page's first card. Everything here traces to research §3.1 "Voice
 * core": the realtime pipeline, dialect engineering, barge-in, digit-by-digit
 * readback, the shipped voice catalogue, and cloning with consent + verified
 * deletion. The «وش ما يسويه» block is deliberate: outbound calling does not
 * exist (§2.2), and no performance number is ever published.
 */

const t = {
  ar: {
    h1: "كيف يفهم الوكيل الصوتي اللهجة السعودية؟",
    intro:
      "مو كل نظام يقول «يدعم العربية» يصلح لمكالمة سعودية حقيقية. عميلك ما يقول «أرغب في حجز موعد» — يقول «أبي أحجز بكره». والجواب مو في شعار، الجواب في المسار نفسه: كيف يتحول صوت عميلك إلى نص وهو يتكلم، وكيف تنفهم الصيغ الدارجة على قصدها، وكيف يطلع الرد صوتاً طبيعياً بنفس اللهجة والعميل على الخط. وهذي الصفحة تشرح لك بالضبط وش يصير جوّا المكالمة — وش شغّال اليوم، ووش ما نوعدك فيه.",
    cta: "احجز عرضاً",
    answer: {
      heading: "كيف يشتغل الوكيل الصوتي داخل المكالمة؟",
      capsule:
        "باختصار: صوت عميلك يتحول إلى نص لحظة بلحظة وهو يتكلم، والذكاء الاصطناعي يفهم قصده من الكلام ومن معلومات نشاطك، ويطلع الرد صوتاً طبيعياً بنفس اللهجة — كل هذا والعميل على الخط. وإذا قاطعه العميل يسكت على طول ويسمع، وإذا عطاه رقم حجز يقرأه رقم رقم، وإذا احتاج الموضوع إنساناً يحوّله لموظفك بكامل السياق. وإذا كان السؤال ما له جواب واضح، ما يخترع — يصعّد أو يسجل طلب اتصال. وبعد ما تسكر المكالمة تلقاها مكتوبة وملخّصة في لوحتك. تحت، كل جزئية بالتفصيل.",
    },
    sections: [
      {
        title: "وش المضبوط في المسار عشان يفهم الكلام السعودي؟",
        body:
          "الفرق مو في إن النظام «يدعم العربية» — كل الأنظمة تكتب هالجملة. الفرق إن المسار كله مضبوط على الكلام السعودي. أول شي، صوت عميلك يتحول إلى نص وهو يتكلم، مو بعد ما يخلص جملته. بعدين يمر النص على تطبيع نجدي: «أبي» و«أبغى» و«بغيت» كلها توصل لنفس القصد، و«بكره» تصير بكرة، و«الحين» تصير الآن، و«وش» ما تنقرأ غلط. وعندنا قاموس مفردات حجز مبني من أخطاء تفريغ حقيقية رصدناها بأنفسنا في مكالمات: أسماء الأيام، وأوقات زي «العصر» و«بعد المغرب»، وأسماء الخدمات اللي دايماً تنكتب غلط — نعطيها وزناً أعلى عشان تنسمع صح من أول مرة. والأرقام اللي ينطقها العميل كلاماً — «ثلاثة وعشرين» — تتحول أرقاماً قبل ما تدخل في أي حجز. وتحت هذا كله، كل طبقة في المسار — التفريغ، والفهم، وتوليد الصوت — لها بديل يشتغل تلقائياً إذا تعثّر المزوّد الأساسي، عشان المكالمة ما تقف في نص الكلام.",
      },
      {
        title: "إذا قاطعته وهو يتكلم — يسكت؟",
        body:
          "إي، ويسكت في نفس اللحظة. وهذي وحدة من أهم التفاصيل اللي تفرّق بين مكالمة طبيعية ومكالمة مع روبوت: أول ما يبدأ العميل يتكلم، الوكيل يقطع صوته ويسمع، ما يكمل جملته لين يخلصها. وإذا بدأ العميل وسكت فجأة، الوكيل ما يعيد كلامه من أوله — يقول «نعم؟» ويستنى، بالضبط زي ما يسوي موظف استقبال شاطر. ونبرته تتغير حسب اللحظة: ترحيب دافئ في البداية، وتأكيد هادئ وواضح وقت الحجز، ونبرة معتذرة إذا راح الموضوع لموظف بشري. وفي اللحظات اللي يحتاج فيها يتأكد من شي، يعبّي الفراغ بكلمة قصيرة زي «لحظة أشوف لك» بدل الصمت المحرج. وإذا كان العميل اتصل عليكم قبل، الوكيل يعرفه ويناديه باسمه ويتذكر تفضيلاته من مكالماته السابقة. وما نعطيك رقماً لزمن الاستجابة، لأننا ما قسناه بطريقة نقدر ننشرها وندافع عنها.",
      },
      {
        title: "ليش يقرأ رقم الحجز رقم رقم؟",
        body:
          "لأن العميل غالباً يكتبه وهو ماسك مفتاح سيارته أو واقف عند الباب. لو قال له الوكيل «رقم حجزك أربعة وسبعين ثلاثمية واثنين»، بيطلب منه يعيده مرتين. عشان كذا الأكواد والأرقام تنقرأ رقم رقم بالعربي — «سبعة… أربعة… ثلاثة… اثنين» — بوقفة بينها، وبعدها يتأكد إن العميل كتبه. والعكس صحيح: لما ينطق العميل تاريخاً أو رقم جوال أو عدد أشخاص كلاماً، النظام يحوّله أرقاماً قبل ما يبني عليه أي إجراء. والحجز نفسه ما يعتمد على وعد كلامي من الوكيل: عنده أدوات حقيقية يشيك فيها على الأوقات الفاضية، ويثبت الحجز، ويسجل تفاصيل الطلب، ويجدول طلب اتصال إذا كان الوقت برا الدوام — كل هذا يصير أثناء المكالمة، ويظهر في لوحتك بعدها مباشرة.",
      },
      {
        title: "وش اللهجات والأصوات الجاهزة اليوم؟",
        body:
          "المتوفر اليوم: أصوات رجالية ونسائية بثلاث لهجات سعودية — نجدي وحجازي وخليجي — بالإضافة إلى العربية والإنجليزية. تختار الصوت واللهجة لكل وكيل من اللوحة، وتسمع عينة قبل ما تعتمد، وتقدر تغيّرها بعدين بدون ما تبني الوكيل من جديد. وإذا كلّمك عميل بالإنجليزي، الوكيل يرد عليه بالإنجليزي. وما نقول لك «كل اللهجات العربية» — هذي جملة تنكتب بسهولة وتنكشف من أول مكالمة. اللي فوق هو المتوفر فعلاً، وأي شي غيره نتكلم عنه كإمكانية نقدر نبنيها، مو كوعد جاهز.",
      },
      {
        title: "أقدر أخلي الوكيل يتكلم بصوت علامتي التجارية؟",
        body:
          "تقدر — وبشروط واضحة نكتبها لك هنا قبل ما تسألنا عنها. تعطينا عينة صوتية قصيرة من الشخص اللي تبي صوته يكون صوت علامتك، والمنصة تبني منها صوتاً يستخدمه وكيلك في المكالمات. وقبل ما يشتغل الاستنساخ، لازم يتسجل إقرار موافقة من صاحب الصوت نفسه — ما نستنسخ صوت أي أحد بدون موافقته، وهذا شرط ما نتنازل عنه مهما كان الحساب. وفي حد أعلى لعدد الأصوات المستنسخة في حسابك عشان الموضوع ما ينفلت. والأهم: الموافقة قابلة للسحب بأي وقت، وعند السحب يوقف استخدام الصوت فوراً ويُحذف حذفاً موثّقاً خلال 30 يوماً — وتقدر تطلب تأكيد الحذف. ولاحظ إننا نتكلم عن استنساخ سريع من عينة قصيرة، ما نتكلم عن أصوات احترافية مسجلة في استوديو — هذي ما نقدمها، وقلناها عشان ما تبني عليها توقعاً.",
      },
      {
        title: "من وين ياخذ الوكيل معلومات نشاطي؟",
        body:
          "من قاعدة معرفتك أنت، مو من الإنترنت. ترفع ملفاتك — قائمة الأسعار، وسياسة الإلغاء، ودليل الخدمات، حتى لو كانت ملفات ممسوحة ضوئياً — وتضيف أسئلة وأجوبة بصياغتك، وأوقات دوامك، ومقتطفات قصيرة زي «الموقف مجاني». المحتوى هذا يُقرأ ويتقسّم ويتفهرس بطريقة تخلي البحث فيه بالمعنى مو بالكلمة الحرفية — يعني عميلك ما يحتاج يستخدم نفس كلمات ملفك. وقاعدة المعرفة هي اللي يرد منها وكيلك على قنوات المحادثة النصية، وتقدر تختبرها بنفسك في الشات التجريبي وتشوف الجواب ومن أي ملف جا قبل ما تنشره. وإذا كان السؤال ما له جواب واضح، الوكيل ما يخترع رقماً ولا سياسة من راسه: يقول للعميل بصراحة إنه بيوصله لأحد من الفريق، ويصعّد أو يسجل طلب اتصال. وهذا الجزء بالذات هو اللي يخلي الوكيل «موظفك» مو «روبوت يعرف كلام عام عن قطاعك».",
      },
      {
        title: "وش يصير بعد ما تسكر المكالمة؟",
        body:
          "المكالمة ما تختفي. خلال ثواني تلقاها في لوحتك: التسجيل الصوتي، والنص الكامل مكتوباً، وملخص عربي يقول لك ليش اتصل العميل ووش صار ووش باقي، ومؤشر على مزاج المكالمة. وتقدر تقيّمها بالنجوم وتحط عليها وسماً تلقاها فيه بعدين. وكل هذا ينضاف لملف العميل نفسه، فالمرة الجاية اللي يتصل فيها — سواء رد عليه الوكيل أو موظفك — السياق جاهز من أول ثانية. وأثناء المكالمة نفسها، فريقك يقدر يفتحها ويسمعها مباشرة ويستلمها إذا احتاج. التسجيلات تُفتح بروابط موقّعة قصيرة الصلاحية وتُحذف تلقائياً بعد 90 يوماً.",
      },
    ],
    limits: {
      heading: "وش ما يسويه الوكيل — نقولها بصراحة",
      lead: "الحدود جزء من العرض، لأن اللي يوعدك بكل شي بيخذلك في أول أسبوع. هذي أربعة أشياء ما تلقاها عندنا، ونفضل تعرفها من الموقع مو من التجربة.",
      items: [
        {
          title: "ما يتصل هو على أحد",
          body: "صوت نجدي للمكالمات الواردة. ما في اتصال صادر، ولا حملات اتصال، ولا اتصال آلي على قوائم أرقام — ببساطة لأن هالجزء غير موجود عندنا. اللي يقدر يسويه إذا اتصل عميل برا الدوام هو إنه يسجل طلب اتصال بتفاصيله ووقته المفضل، ويرجع له موظفك.",
        },
        {
          title: "ما يجتهد بجواب ما يعرفه",
          body: "إذا كان السؤال خارج معرفته أو حساس — طبي أو قانوني أو شكوى — يصعّد لموظفك بدل ما يخترع جواباً. الاختراع أخطر من «ما أعرف».",
        },
        {
          title: "ما نعطيك أرقام أداء",
          body: "ما بتلقى عندنا «نسبة دقة 98%» ولا «يوفر 70% من التكاليف»، لأننا ما قسنا هالأرقام بطريقة نقدر ننشرها. تسمع الوكيل في العرض وتحكم بنفسك.",
        },
        {
          title: "ما نوعدك بلهجة ما أطلقناها",
          body: "الجاهز اليوم نجدي وحجازي وخليجي، مع العربية والإنجليزية. أي لهجة ثانية نتكلم عنها كعمل نقدر نسويه، مو كخانة موجودة في اللوحة.",
        },
      ],
    },
    link: {
      lead: "ولما تحتاج المكالمة إنساناً، موظفك يستلمها بكامل سياقها — ",
      text: "اقرأ كيف يشتغل التصعيد",
      path: "product/human-handoff",
    },
    faqHeading: "أسئلة عن الوكيل الصوتي",
    faq: [
      {
        q: "الوكيل يفهم اللهجة النجدية، ولا لازم عميلي يتكلم فصحى؟",
        a: "يفهم اللهجة زي ما تنقال. النظام مبني على اللهجات السعودية من أساسه — «أبي أحجز بكره العصر» تنفهم صح، وفيه تطبيع للصيغ الدارجة وقاموس مفردات حجز مبني من أخطاء تفريغ حقيقية. وعميلك ما يحتاج يتكلم فصحى ولا يبطئ كلامه.",
      },
      {
        q: "إذا قاطعت الوكيل وهو يتكلم، وش يصير؟",
        a: "يسكت في نفس اللحظة ويسمعك. وإذا بدأت الكلام وسكتّ فجأة، ما يعيد جملته من أولها — يقول «نعم؟» وينتظرك، عشان المكالمة تمشي زي أي مكالمة طبيعية.",
      },
      {
        q: "أقدر أستخدم صوتي أو صوت موظفي للوكيل؟",
        a: "تقدر، بعينة صوتية قصيرة وإقرار موافقة موثّق من صاحب الصوت. والموافقة قابلة للسحب بأي وقت — وعند السحب يوقف استخدام الصوت فوراً ويُحذف حذفاً موثّقاً خلال 30 يوماً.",
      },
      {
        q: "هل الوكيل يتصل على عملائي؟",
        a: "لا. صوت نجدي يرد على المكالمات الواردة فقط — ما عندنا اتصال صادر ولا حملات اتصال آلي. اللي نقدر نسويه برا المكالمة هو تسجيل طلب اتصال يرجع له موظفك.",
      },
    ] as FaqItem[],
  },
  en: {
    h1: "How does the voice agent understand Saudi dialect?",
    intro:
      "Plenty of platforms say they “support Arabic.” Far fewer survive a real Saudi phone call, where the caller doesn't speak textbook Arabic — they speak the way people actually speak. The answer isn't a slogan, it's the pipeline: how speech becomes text while the caller is still talking, how colloquial phrasings resolve to one intent, and how the reply comes back as a natural voice in the same dialect while the caller is still on the line. This page walks through exactly what happens inside a call — what works today, and what we won't promise you.",
    cta: "Book a demo",
    answer: {
      heading: "How does the voice agent work during a call?",
      capsule:
        "In short: your caller's speech becomes text word by word as they talk, the AI works out what they want from both the speech and your business information, and the reply comes back as a natural voice in the same dialect — all while the caller is on the line. If they interrupt, the agent stops instantly and listens. If it gives them a booking code, it reads it digit by digit. If the matter needs a person, it hands the call to your employee with the full context. If there's no clear answer, it doesn't invent one — it escalates or logs a callback. And when the call ends you find it written up and summarised in your dashboard. Below, each part in detail.",
    },
    sections: [
      {
        title: "What in the pipeline is tuned for Saudi speech?",
        body:
          "The difference isn't that the system “supports Arabic” — every vendor writes that line. The difference is that the whole pipeline is tuned for Saudi speech. Speech becomes text while the caller is still talking, not after they finish. That text then passes through a Najdi normaliser, so the many colloquial ways of saying “I want to book” all resolve to one intent, and everyday words for “tomorrow” and “right now” aren't misread. On top of that sits a booking vocabulary built from real mistranscription forensics we collected ourselves: day names, prayer-anchored times like “after Maghrib,” and service names that were consistently getting mangled — all weighted so they land correctly the first time. Numbers spoken as words are converted to digits before they ever reach a booking. And underneath everything, each layer of the pipeline — transcription, understanding, voice generation — has an automatic fallback if the primary provider stumbles, so a call never dies mid-sentence.",
      },
      {
        title: "If the caller interrupts, does the agent stop?",
        body:
          "Yes — instantly. This is one of the details that separates a natural call from a call with a robot. The moment the caller starts speaking, the agent cuts its own audio and listens; it doesn't push through to the end of its sentence. And if the caller starts and then trails off, the agent doesn't restart its whole speech — it says a short “yes?” and waits, exactly like a good receptionist. Its delivery shifts with the moment too: a warm greeting at the start, a calm, clear tone when confirming a booking, an apologetic tone when a matter is being handed to a human. When it needs a second to check something, it fills the gap with a short natural phrase instead of dead air. And if the caller has reached you before, the agent recognises them, greets them by name, and remembers their preferences from previous calls. What you won't get from us is a latency number — we haven't measured one in a way we could publish and defend.",
      },
      {
        title: "Why does it read booking codes digit by digit?",
        body:
          "Because the caller is usually writing it down one-handed, at a door or in a car. Read a code as a compound number and they will ask for it twice. So codes and reference numbers are spoken digit by digit in Arabic, with a beat between them, and the agent then confirms the caller has it. The reverse holds as well: when a caller says a date, a mobile number or a party size out loud, the system converts it to digits before anything is built on it. The booking itself doesn't rest on the agent's word, either — it has real tools to check open slots, commit the reservation, record order details, and schedule a callback when the call lands outside working hours. All of that happens during the call, and shows up in your dashboard immediately afterwards.",
      },
      {
        title: "Which dialects and voices are available today?",
        body:
          "What is shipped today: male and female voices across three Saudi dialects — Najdi, Hijazi and Khaleeji — plus Arabic and English. You pick the voice and dialect per agent from the dashboard, hear a sample before committing, and can change it later without rebuilding the agent. If a caller speaks English, the agent answers in English. What we won't tell you is that we cover “every Arabic dialect” — that sentence is easy to write and falls apart on the first call. The list above is what actually exists; anything beyond it we discuss as work we can do, not as a box already in the product.",
      },
      {
        title: "Can the agent speak in my brand's own voice?",
        body:
          "It can — under conditions we'd rather state before you ask. You give us a short voice sample from the person whose voice should represent your brand, and the platform builds a voice your agent uses on calls. Before cloning runs, a consent attestation from the voice owner has to be recorded — we do not clone anyone's voice without their consent, and that condition doesn't bend for any account. There's a cap on how many cloned voices an account can hold, so it stays controlled. Most importantly, consent is revocable at any time: on revocation the voice stops being used immediately and is purged in a verified deletion within 30 days — and you can ask for confirmation of that deletion. Note the scope: this is instant cloning from a short sample, not studio-recorded professional voice production — we don't offer that, and we'd rather say so than let you build an expectation on it.",
      },
      {
        title: "Where does the agent get information about my business?",
        body:
          "From your knowledge base, not from the internet. You upload your own material — the price list, the cancellation policy, the service guide, even scanned documents — and add Q&A pairs in your own wording, your working hours, and short snippets like “parking is free for customers.” That material is read, split and indexed so search works by meaning rather than by literal keyword, so your customer never has to use your document's vocabulary. The knowledge base is what your agent answers from on your text chat channels, and you can test it yourself in the test chat — see the answer and which file it came from before you publish it. If there's no clear answer, the agent doesn't invent a price or a policy: it tells the caller plainly that it will get them to someone, then escalates or logs a callback. That grounding is what makes it your employee rather than a robot with generic knowledge of your sector.",
      },
      {
        title: "What happens after the call ends?",
        body:
          "The call doesn't disappear. Within seconds it's in your dashboard: the recording, the full written transcript, an Arabic summary saying why the customer called, what happened and what's still open, and a read on the caller's mood. You can rate it with stars and tag it so you can find it again. All of it attaches to the customer's own record, so the next time they call — whether the agent or your employee answers — the context is already there. And while a call is still running, your team can open it, listen live, and take it over if needed. Recordings open only through short-lived signed links and are deleted automatically after 90 days.",
      },
    ],
    limits: {
      heading: "What the agent does not do — plainly",
      lead: "The limits are part of the pitch, because a vendor who promises everything disappoints you in week one. Here are four things you won't get here — better learned from the website than from the trial.",
      items: [
        {
          title: "It doesn't call anyone",
          body: "Saut Najdi answers inbound calls. There is no outbound dialling, no calling campaigns, no auto-dialer working through a list — simply because that part does not exist here. What it can do when someone calls after hours is log a callback request with the details and their preferred time, for your employee to return.",
        },
        {
          title: "It doesn't improvise answers it doesn't have",
          body: "If a question falls outside its knowledge or is sensitive — medical, legal, a complaint — it escalates to your employee instead of inventing something. Invention is far more dangerous than “I'll get you someone.”",
        },
        {
          title: "We publish no performance numbers",
          body: "You won't find “98% accuracy” or “cuts costs by 70%” here, because we haven't measured those in a way we could stand behind. Hear the agent in the demo and judge it yourself.",
        },
        {
          title: "We don't promise a dialect we haven't shipped",
          body: "Najdi, Hijazi and Khaleeji, plus Arabic and English, is what exists today. Any other dialect is a conversation about work we could do, not a setting waiting in the dashboard.",
        },
      ],
    },
    link: {
      lead: "And when a call needs a person, your employee inherits it with the full context — ",
      text: "read how handoff works",
      path: "product/human-handoff",
    },
    faqHeading: "Voice agent questions",
    faq: [
      {
        q: "Does the agent understand Najdi dialect, or does my customer have to speak formal Arabic?",
        a: "It understands the dialect as spoken. The system is built on Saudi dialects from the ground up, with normalisation of colloquial forms and a booking vocabulary derived from real mistranscription forensics. Your customer doesn't have to switch registers or slow down.",
      },
      {
        q: "What happens if I interrupt the agent mid-sentence?",
        a: "It stops instantly and listens. If you start talking and then trail off, it won't replay its whole sentence — it says a short “yes?” and waits, so the call flows like a normal conversation.",
      },
      {
        q: "Can I use my own voice, or an employee's, for the agent?",
        a: "Yes, with a short voice sample and a recorded consent attestation from the voice owner. Consent is revocable at any time — on revocation the voice stops being used immediately and is purged in a verified deletion within 30 days.",
      },
      {
        q: "Does the agent call my customers?",
        a: "No. Saut Najdi answers inbound calls only — there is no outbound dialling and no calling campaigns. What it can do outside a call is log a callback request for your employee to return.",
      },
    ] as FaqItem[],
  },
} as const;

export function VoiceAgentPage({ locale }: { locale: Locale }) {
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

      {/* Answer-first: the H2 is the query, the paragraph is a liftable answer. */}
      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.answer.heading}</h2>
          <p className="mt-4 text-body-lg leading-relaxed text-ink/75">{s.answer.capsule}</p>
        </Reveal>
      </section>

      <section className="bg-white py-16">
        <div className="container">
          <div className="mx-auto max-w-3xl space-y-6">
            {s.sections.map((sec, i) => (
              <Reveal key={sec.title} delay={i * 0.04}>
                <article className="card card-hover group">
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
        </div>
      </section>

      <section className="container py-16">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="text-h2">{s.limits.heading}</h2>
          <p className="mt-3 text-body-lg leading-relaxed text-ink/70">{s.limits.lead}</p>
        </Reveal>
        <div className="mx-auto mt-10 grid max-w-4xl gap-6 md:grid-cols-2">
          {s.limits.items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.06}>
              <article className="card h-full border-s-4 border-s-brand-purple">
                <h3 className="text-h4">{item.title}</h3>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/75">{item.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-body-lg leading-relaxed text-ink/70">
            {s.link.lead}
            <Link
              href={localePath(locale, s.link.path)}
              className="text-brand-blue underline-offset-4 hover:underline"
            >
              {s.link.text}
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

export const voiceAgentFaq = { ar: t.ar.faq, en: t.en.faq };
