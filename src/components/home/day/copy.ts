import type { Locale } from "@/lib/i18n";

/**
 * One day on the board (Try 3 `#day`, mockups/try-3/index.html). Sample
 * copy: the names and times are examples, and the section says so. `t` is
 * the moment's time in minutes from midnight on the clock's working day
 * (2:00 after midnight is 1560), so the clock can run between moments.
 * `ui` names the product fragment a moment shows; its text sits beside it.
 */
export const dayCopy = {
  ar: {
    title: "يوم كامل مع وكيلك",
    lead: "انزل والساعة تمشي. هذا يوم من أيام وكيلك، من الصبح لين آخر الليل.",
    strip: "مواقف من يوم واحد",
    // The clock's word for each part of the day, up to 12:00, 15:00, 17:30, 19:00, midnight, then after.
    parts: ["الصبح", "الظهر", "العصر", "المغرب", "الليل", "بعد نص الليل"],
    meter: ["8 الصبح", "2 بعد نص الليل"],
    agent: "وكيل صوت نجدي",
    moments: [
      { t: 480, time: "8:00", part: "الصبح", say: "يبدأ الدوام، ووكيلك شغّال على كل قنواتك." },
      { t: 545, time: "9:05", part: "الصبح", say: "يرد بلهجة عميلك، ويثبّت الحجز داخل نفس المكالمة." },
      { t: 810, time: "1:30", part: "الظهر", say: "ويكمل مع عملائك على واتساب ودردشة موقعك." },
      { t: 1090, time: "6:10", part: "المغرب", say: "وإذا احتاج الموضوع إنسان، يحوّل لموظفك ومعه الملخص." },
      { t: 1320, time: "10:00", part: "الليل", say: "انتهى الدوام، وراح فريقك." },
      { t: 1422, time: "11:42", part: "الليل", say: "وبعد الدوام؟ يرد بعد، ويترك لك ملخص تقراه الصبح." },
      { t: 1560, time: "2:00", part: "بعد نص الليل", say: "وكل محادثة تنحفظ في السجل بنصها وتسجيلها وملخصها." },
    ],
    status: {
      title: "حالة الوكيل",
      live: "شغّال",
      rows: [
        ["الخط الرئيسي", "جاهز"],
        ["واتساب", "جاهز"],
        ["دردشة الموقع", "جاهز"],
        ["صوت الوكيل", "ماجد · نجدي"],
      ],
    },
    call: {
      title: "مكالمة · عيادة الأسنان",
      caller: "أبغى أحجز تنظيف أسنان بكرة.",
      agent: ["أبشر، بكرة ", "4:30", " العصر يناسبك؟"],
      booked: "تم الحجز",
      items: [["تنظيف أسنان"], ["بكرة · ", "4:30", " العصر"]],
    },
    chat: {
      title: "واتساب · نورة",
      tag: "واتساب",
      caller: "بخصوص موعدي بكرة، أجي قبله بكم دقيقة؟",
      agent: ["تعالي قبله بـ ", "10", " دقايق، عشان نجهز ملفك."],
      sent: "انرد عليها خلال المحادثة",
    },
    handoff: {
      title: "تحويل لموظف",
      tag: "سؤال طبي",
      initial: "أ",
      name: "أحمد",
      role: "الاستقبال · متاح الحين",
      rows: [
        ["الملخص", "ألم بعد حشوة، ويبي يكلم أحد من العيادة"],
        ["المرفق", "النص الكامل للمكالمة"],
      ],
      take: "استلم المكالمة",
    },
    night: {
      title: "مكالمة واردة",
      tag: "خارج الدوام",
      live: "الوكيل رد",
      summary: "الملخص",
      text: ["يسأل عن مواعيد السبت. انحجز له ", "10:00", " الصبح، والتأكيد انرسل على واتساب."],
    },
    log: {
      title: "سجل اليوم",
      count: 5,
      unit: " محادثات",
      rows: [
        ["9:05", " ص", "مكالمة", "تم الحجز"],
        ["1:30", " م", "واتساب", "انحلت"],
        ["4:20", " م", "دردشة الموقع", "سؤال سعر"],
        ["6:10", " م", "مكالمة", "تحويل لأحمد"],
        ["11:42", " م", "مكالمة", "تم الحجز"],
      ],
    },
    foot: "وموظفك يقدر يدخل على أي محادثة بأي لحظة، والقواعد قواعدك.",
    note: "يوم توضيحي، والأسماء والمواعيد أمثلة.",
  },
  en: {
    title: "A full day with your agent",
    lead: "Scroll and the clock runs through one day with your agent.",
    strip: "Moments from one day",
    parts: ["morning", "midday", "afternoon", "evening", "night", "after midnight"],
    meter: ["8 am", "2 am"],
    agent: "Saut Najdi agent",
    moments: [
      { t: 480, time: "8:00", part: "am", say: "Your workday starts, and your agent is live on every channel." },
      { t: 545, time: "9:05", part: "am", say: "It answers in your customer's dialect and books them on the call." },
      { t: 810, time: "1:30", part: "pm", say: "It carries on with your customers on WhatsApp and your website chat." },
      { t: 1090, time: "6:10", part: "pm", say: "When a person is needed, it hands over to your staff with a summary." },
      { t: 1320, time: "10:00", part: "pm", say: "The workday is over, and your team has gone home." },
      { t: 1422, time: "11:42", part: "pm", say: "After hours it still answers, and leaves you a summary for the morning." },
      { t: 1560, time: "2:00", part: "am", say: "Every conversation is saved to the log: transcript, recording and summary." },
    ],
    status: {
      title: "Agent status",
      live: "Live",
      rows: [
        ["Main line", "Ready"],
        ["WhatsApp", "Ready"],
        ["Website chat", "Ready"],
        ["Agent voice", "Majed · Najdi"],
      ],
    },
    call: {
      title: "Call · Dental clinic",
      caller: "I'd like a cleaning tomorrow.",
      agent: ["Sure. Tomorrow at ", "4:30", " pm?"],
      booked: "Booked",
      items: [["Teeth cleaning"], ["Tomorrow · ", "4:30", " pm"]],
    },
    chat: {
      title: "WhatsApp · Noura",
      tag: "WhatsApp",
      caller: "About my appointment tomorrow, how early should I come?",
      agent: ["Come ", "10", " minutes early so we can get your file ready."],
      sent: "Answered in the conversation",
    },
    handoff: {
      title: "Hand off to staff",
      tag: "Medical question",
      initial: "A",
      name: "Ahmed",
      role: "Reception · available now",
      rows: [
        ["Summary", "Pain after a filling, wants to talk to someone at the clinic"],
        ["Attached", "The full call transcript"],
      ],
      take: "Take the call",
    },
    night: {
      title: "Incoming call",
      tag: "After hours",
      live: "Agent answered",
      summary: "Summary",
      text: ["Asked about Saturday appointments. Booked for ", "10:00", " am, confirmation sent on WhatsApp."],
    },
    log: {
      title: "Today's log",
      count: 5,
      unit: " conversations",
      rows: [
        ["9:05", " am", "Call", "Booked"],
        ["1:30", " pm", "WhatsApp", "Resolved"],
        ["4:20", " pm", "Website chat", "Price question"],
        ["6:10", " pm", "Call", "Handed to Ahmed"],
        ["11:42", " pm", "Call", "Booked"],
      ],
    },
    foot: "And your staff can step into any conversation at any moment. Your rules apply.",
    note: "An illustrative day; names and times are examples.",
  },
} satisfies Record<Locale, unknown>;

export type DayCopy = (typeof dayCopy)[Locale];
