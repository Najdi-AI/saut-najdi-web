import type { Locale } from "@/lib/i18n";

/**
 * How it works (Try 1, mockups/index.html .how and states.html): three
 * statements, each with the product fragment it describes. The first
 * statement is decision 183's «يرد من أول رنة». The fragments are
 * illustrations: the caller, the times and Ahmed are examples.
 */
export const howCopy = {
  ar: {
    title: "كيف يشتغل؟",
    steps: [
      { title: "أول شي، يرد من أول رنة.", body: "يرد على رقمك بأي وقت، بالليل والنهار، وبلهجة عميلك." },
      { title: "بعدين يفهم ويحجز.", body: "يفهم وش يبي العميل، يجاوبه، ويحجز له داخل نفس المكالمة." },
      { title: "وإذا احتاج إنسان، يحوّل لموظفك.", body: "موظفك يستلم ومعه النص والملخص، والعميل ما يعيد قصته." },
    ],
    ring: {
      title: "مكالمة واردة",
      tag: "خارج الدوام",
      avatar: "ع",
      caller: "عميل جديد",
      time: "11:42",
      meridiem: "م",
      line: "الخط الرئيسي",
      answered: "الوكيل رد",
      elapsed: "00:01",
      dialect: "سعودي",
      voice: "صوت ماجد · نجدي",
    },
    book: {
      title: "المكالمة",
      elapsed: "00:38",
      agent: "وكيل صوت نجدي",
      caller1: "أبغى أحجز موعد أسنان بكرة.",
      reply: "أبشر. بكرة 4:30 العصر، يناسبك؟",
      caller2: "يناسبني.",
      done: "تم الحجز",
      items: ["موعد أسنان", "بكرة · 4:30 العصر"],
    },
    handoff: {
      title: "تحويل لموظف",
      tag: "سؤال طبي",
      avatar: "أ",
      name: "أحمد",
      role: "الاستقبال · متاح الحين",
      rows: [
        ["الملخص", "حجز بكرة 4:30 العصر، وسؤال عن ألم بعد حشوة"],
        ["المرفق", "النص الكامل للمكالمة"],
        ["العميل", "تاريخه عندكم وحجوزاته السابقة"],
      ],
      take: "استلم المكالمة",
      listen: "اسمع التسجيل",
    },
  },
  en: {
    title: "How does it work?",
    steps: [
      { title: "First, it answers on the first ring.", body: "It answers your number at any hour, day or night, in your customer's dialect." },
      { title: "Then it understands and books.", body: "It works out what the customer wants, answers them, and books them in on the same call." },
      { title: "And when a person is needed, it hands over to your staff.", body: "Your staff member takes over with the transcript and the summary, so the customer never repeats their story." },
    ],
    ring: {
      title: "Incoming call",
      tag: "After hours",
      avatar: "N",
      caller: "New customer",
      time: "11:42",
      meridiem: "pm",
      line: "Main line",
      answered: "Agent answered",
      elapsed: "00:01",
      dialect: "Saudi",
      voice: "Majed's voice · Najdi",
    },
    book: {
      title: "The call",
      elapsed: "00:38",
      agent: "Saut Najdi agent",
      caller1: "I'd like to book a dental appointment tomorrow.",
      reply: "Of course. Tomorrow at 4:30 pm, does that suit you?",
      caller2: "That works.",
      done: "Booked",
      items: ["Dental appointment", "Tomorrow · 4:30 pm"],
    },
    handoff: {
      title: "Hand off to staff",
      tag: "Medical question",
      avatar: "A",
      name: "Ahmed",
      role: "Reception · available now",
      rows: [
        ["Summary", "Booked for 4:30 pm tomorrow, and a question about pain after a filling"],
        ["Attached", "The full call transcript"],
        ["Customer", "Their history and past bookings with you"],
      ],
      take: "Take the call",
      listen: "Hear the recording",
    },
  },
} satisfies Record<Locale, unknown>;

export type HowCopy = (typeof howCopy)[Locale];
