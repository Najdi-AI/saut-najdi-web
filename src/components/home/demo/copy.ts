import type { Locale } from "@/lib/i18n";

export type Activity = "clinic" | "restaurant" | "hotel";
export type Scenario = "book" | "price" | "urgent";
export type Setting = "handoff" | "autobook" | "whatsapp";
export type ReplyDialect = "sa" | "ar" | "en";

/** A step shows only while every setting it names has that value. */
type When = { when?: Partial<Record<Setting, boolean>> };
export type Line = When & { who: "caller" | "agent" | "staff"; text: string };
export type Outcome = When & { card: "done" | "pending" | "answer" | "handoff"; title: string; items: string[] };

/** The agent's greeting in each reply dialect, with its own language (Try 1 site.js). */
type Greeting = Record<ReplyDialect, string>;

const caller = (text: string): Line => ({ who: "caller", text });
const agent = (text: string, when?: When["when"]): Line => ({ who: "agent", text, when });
const staff = (text: string): Line => ({ who: "staff", text, when: { handoff: true } });
const card = (c: Outcome["card"], title: string, items: string[], when?: When["when"]): Outcome => ({ card: c, title, items, when });

const greetings: Record<Activity, Greeting> = {
  clinic: {
    sa: "هلا والله، معك عيادة الأسنان… وش أقدر أخدمك؟",
    ar: "أهلاً بك في عيادة الأسنان، كيف يمكنني مساعدتك؟",
    en: "Hello, you've reached the dental clinic. How can I help?",
  },
  restaurant: {
    sa: "هلا والله، معك المطعم… وش أقدر أخدمك؟",
    ar: "أهلاً بك في المطعم، كيف يمكنني مساعدتك؟",
    en: "Hello, you've reached the restaurant. How can I help?",
  },
  hotel: {
    sa: "هلا والله، معك الفندق… وش أقدر أخدمك؟",
    ar: "أهلاً بك في الفندق، كيف يمكنني مساعدتك؟",
    en: "Hello, you've reached the hotel. How can I help?",
  },
};

/**
 * Try the call (Try 1 showcase, mockups/index.html #demo and site.js). The
 * scripted calls are illustrative: the prices (250, 120, 480 SAR) and times
 * are labelled examples (decisions 184 and 186). Each locale's block goes to
 * the panel as props, so the copy stays out of the page's JavaScript.
 */
export const demoCopy = {
  ar: {
    title: "شوفه وهو يرد",
    lead: "غيّر النشاط والإعدادات، والمكالمة تتغير قدامك.",
    hint: "ابدأ من «جرّب سيناريو»: اختر حالة طارئة وشوف كيف يحوّل لموظفك.",
    note: "حوار توضيحي، والأسعار والمواعيد أمثلة. مو تسجيل حقيقي.",
    controls: "إعدادات المكالمة",
    avatar: "ص",
    call: "مكالمة",
    live: "مباشر",
    agent: "وكيل صوت نجدي",
    staff: "موظفك · أحمد",
    activity: "النشاط",
    activities: { clinic: "عيادة", restaurant: "مطعم", hotel: "فندق" },
    places: { clinic: "عيادة الأسنان", restaurant: "المطعم", hotel: "الفندق" },
    voice: "صوت الوكيل",
    voiceName: "ماجد",
    voiceAccent: "نجدي",
    dialect: "اللهجة",
    dialects: { sa: "سعودي", ar: "عربي", en: "English" },
    settings: { handoff: "التحويل لموظف", autobook: "حجز تلقائي", whatsapp: "ملخص على واتساب" },
    scenario: "جرّب سيناريو",
    scenarios: { book: "حجز", price: "سؤال سعر", urgent: "حالة طارئة" },
    more: "كل الإعدادات",
    less: "إعدادات أقل",
    sent: {
      book: "التأكيد انرسل للعميل على واتساب",
      staff: "الملخص انرسل لأحمد على واتساب",
      team: "الملخص انرسل لفريقك على واتساب",
    },
    calls: {
      clinic: {
        book: { time: "00:42", steps: [
          caller("السلام عليكم، أبغى أحجز موعد أسنان بكرة."),
          agent("أبشر. بكرة عندنا فاضي الساعة 4:30 العصر، يناسبك؟"),
          caller("يناسبني."),
          agent("تم، حجزتك بكرة 4:30 العصر.", { autobook: true }),
          agent("تمام، سجّلت طلبك وبيأكد لك الموظف الموعد.", { autobook: false }),
          card("done", "تم الحجز", ["موعد أسنان", "بكرة · 4:30 العصر"], { autobook: true }),
          card("pending", "طلب حجز · ينتظر تأكيد الموظف", ["موعد أسنان", "بكرة · 4:30 العصر"], { autobook: false }),
        ] },
        price: { time: "00:31", steps: [
          caller("كم سعر تنظيف الأسنان عندكم؟"),
          agent("تنظيف الأسنان بـ 250 ريال، وتقدر تحجز من الحين. تبي موعد؟"),
          caller("لا، بس حبيت أعرف. مشكور."),
          agent("العفو، حياك أي وقت."),
          card("answer", "سؤال سعر · انحل في المكالمة", ["تنظيف الأسنان: 250 ريال", "بدون تحويل لموظف"]),
        ] },
        urgent: { time: "00:27", steps: [
          caller("عندي ألم قوي بعد حشوة سويتها عندكم…"),
          agent("سلامتك. بحوّلك الحين لموظف من العيادة، ومعه ملخص كلامك.", { handoff: true }),
          agent("سلامتك. سجّلت طلبك، وبيتواصل معك فريق العيادة بأقرب وقت.", { handoff: false }),
          card("handoff", "سؤال طبي — تصعيد فوري لموظف بشري", ["النص الكامل للمكالمة", "ملخص: ألم بعد حشوة", "تاريخ العميل عندكم"], { handoff: true }),
          card("pending", "طلب متابعة · أولوية عالية", ["ملخص: ألم بعد حشوة", "ينتظر اتصال من العيادة"], { handoff: false }),
          staff("معك أحمد من العيادة، قريت ملخص كلامك. خلني أطمنك على موضوع الحشوة…"),
        ] },
      },
      restaurant: {
        book: { time: "00:36", steps: [
          caller("أبي أحجز طاولة لأربعة الليلة."),
          agent("أبشر! الليلة عندنا طاولة الساعة 9، تناسبكم؟"),
          caller("تمام."),
          agent("تم الحجز، طاولة لأربعة الساعة 9 الليلة.", { autobook: true }),
          agent("تمام، سجّلت طلبك وبيأكد لك الموظف الحجز.", { autobook: false }),
          card("done", "تم الحجز", ["طاولة لأربعة", "الليلة · 9:00 م"], { autobook: true }),
          card("pending", "طلب حجز · ينتظر تأكيد الموظف", ["طاولة لأربعة", "الليلة · 9:00 م"], { autobook: false }),
        ] },
        price: { time: "00:24", steps: [
          caller("كم سعر البوفيه عندكم؟"),
          agent("البوفيه بـ 120 ريال للشخص، والأطفال تحت 10 سنين بنص السعر."),
          caller("زين، مشكور."),
          agent("حياك الله، ننتظرك."),
          card("answer", "سؤال سعر · انحل في المكالمة", ["البوفيه: 120 ريال للشخص", "بدون تحويل لموظف"]),
        ] },
        urgent: { time: "00:22", steps: [
          caller("طلبي وصل وفيه شي عندي حساسية منه!"),
          agent("حقك علينا. بحوّلك الحين لموظف، ومعه تفاصيل طلبك.", { handoff: true }),
          agent("حقك علينا. سجّلت الشكوى، وبيتواصل معك المدير بأقرب وقت.", { handoff: false }),
          card("handoff", "شكوى حساسية — تصعيد فوري لموظف بشري", ["النص الكامل للمكالمة", "ملخص: الطلب فيه شي يتحسس منه", "تفاصيل الطلب"], { handoff: true }),
          card("pending", "شكوى · أولوية عالية", ["ملخص: الطلب فيه شي يتحسس منه", "ينتظر اتصال من المدير"], { handoff: false }),
          staff("معك أحمد من المطعم، شفت تفاصيل طلبك. خلني أحل الموضوع معك الحين."),
        ] },
      },
      hotel: {
        book: { time: "00:40", steps: [
          caller("عندكم غرفة فاضية الخميس؟"),
          agent("إي نعم، عندنا غرفة مزدوجة ليلة الخميس. أحجزها لك؟"),
          caller("احجزها."),
          agent("تم الحجز، غرفة مزدوجة ليلة الخميس.", { autobook: true }),
          agent("تمام، سجّلت طلبك وبيأكد لك موظف الاستقبال.", { autobook: false }),
          card("done", "تم الحجز", ["غرفة مزدوجة", "ليلة الخميس"], { autobook: true }),
          card("pending", "طلب حجز · ينتظر تأكيد الموظف", ["غرفة مزدوجة", "ليلة الخميس"], { autobook: false }),
        ] },
        price: { time: "00:26", steps: [
          caller("كم سعر الليلة للغرفة المزدوجة؟"),
          agent("الليلة بـ 480 ريال، شامل الفطور."),
          caller("ممتاز، مشكور."),
          agent("العفو، حياك الله."),
          card("answer", "سؤال سعر · انحل في المكالمة", ["الغرفة المزدوجة: 480 ريال", "بدون تحويل لموظف"]),
        ] },
        urgent: { time: "00:25", steps: [
          caller("المكيف خربان بالغرفة، والجو حر مرة."),
          agent("حقك علينا. بحوّلك الحين لموظف الاستقبال، ومعه رقم غرفتك.", { handoff: true }),
          agent("حقك علينا. سجّلت البلاغ، وبيوصلك فني الصيانة بأقرب وقت.", { handoff: false }),
          card("handoff", "بلاغ عطل — تحويل فوري لموظف", ["النص الكامل للمكالمة", "ملخص: المكيف خربان", "رقم الغرفة وتفاصيل الحجز"], { handoff: true }),
          card("pending", "بلاغ صيانة · أولوية عالية", ["ملخص: المكيف خربان", "ينتظر فني الصيانة"], { handoff: false }),
          staff("معك أحمد من الاستقبال، وصلني بلاغك. بنرسل لك الفني الحين."),
        ] },
      },
    },
  },
  en: {
    title: "Watch it answer",
    lead: "Change the business and the settings, and the call changes in front of you.",
    hint: "Start with “Try a scenario”: pick Emergency and see how it hands the call to your staff.",
    note: "An illustrative conversation; the prices and times are examples. Not a real recording.",
    controls: "Call settings",
    avatar: "S",
    call: "Call",
    live: "Live",
    agent: "Saut Najdi agent",
    staff: "Your staff · Ahmed",
    activity: "Business",
    activities: { clinic: "Clinic", restaurant: "Restaurant", hotel: "Hotel" },
    places: { clinic: "Dental clinic", restaurant: "Restaurant", hotel: "Hotel" },
    voice: "Agent voice",
    voiceName: "Majed",
    voiceAccent: "Najdi",
    dialect: "Dialect",
    dialects: { sa: "Saudi", ar: "Arabic", en: "English" },
    settings: { handoff: "Hand off to staff", autobook: "Auto-booking", whatsapp: "Summary on WhatsApp" },
    scenario: "Try a scenario",
    scenarios: { book: "Booking", price: "Price query", urgent: "Emergency" },
    more: "All settings",
    less: "Fewer settings",
    sent: {
      book: "Confirmation sent to the customer on WhatsApp",
      staff: "Summary sent to Ahmed on WhatsApp",
      team: "Summary sent to your team on WhatsApp",
    },
    calls: {
      clinic: {
        book: { time: "00:42", steps: [
          caller("Hi, I'd like to book a dental appointment for tomorrow."),
          agent("Of course. We have 4:30 pm free tomorrow. Does that suit you?"),
          caller("That works."),
          agent("Done, you're booked for 4:30 pm tomorrow.", { autobook: true }),
          agent("All right, I've logged your request and our staff will confirm the time.", { autobook: false }),
          card("done", "Booked", ["Dental appointment", "Tomorrow · 4:30 pm"], { autobook: true }),
          card("pending", "Booking request · awaiting staff confirmation", ["Dental appointment", "Tomorrow · 4:30 pm"], { autobook: false }),
        ] },
        price: { time: "00:31", steps: [
          caller("How much is a teeth cleaning?"),
          agent("A cleaning is 250 riyals, and you can book now. Would you like an appointment?"),
          caller("No, I just wanted to know. Thanks."),
          agent("You're welcome, call us any time."),
          card("answer", "Price query · answered on the call", ["Teeth cleaning: 250 riyals", "No handoff needed"]),
        ] },
        urgent: { time: "00:27", steps: [
          caller("I've got bad pain after a filling I had done with you…"),
          agent("Sorry to hear that. I'm putting you through to the clinic staff now, with a summary of what you said.", { handoff: true }),
          agent("Sorry to hear that. I've logged your request, and the clinic team will call you back as soon as they can.", { handoff: false }),
          card("handoff", "Medical question — straight to a person", ["Full call transcript", "Summary: pain after a filling", "The caller's history with you"], { handoff: true }),
          card("pending", "Follow-up request · high priority", ["Summary: pain after a filling", "Waiting for a call from the clinic"], { handoff: false }),
          staff("Ahmed here from the clinic, I've read your summary. Let me put your mind at rest about the filling…"),
        ] },
      },
      restaurant: {
        book: { time: "00:36", steps: [
          caller("I'd like a table for four tonight."),
          agent("Sure! We have a table at 9 tonight. Does that work for you?"),
          caller("Great."),
          agent("Booked: a table for four at 9 tonight.", { autobook: true }),
          agent("All right, I've logged your request and our staff will confirm the booking.", { autobook: false }),
          card("done", "Booked", ["Table for four", "Tonight · 9:00 pm"], { autobook: true }),
          card("pending", "Booking request · awaiting staff confirmation", ["Table for four", "Tonight · 9:00 pm"], { autobook: false }),
        ] },
        price: { time: "00:24", steps: [
          caller("How much is the buffet?"),
          agent("The buffet is 120 riyals per person, and children under 10 pay half."),
          caller("Good, thanks."),
          agent("Our pleasure, see you soon."),
          card("answer", "Price query · answered on the call", ["Buffet: 120 riyals per person", "No handoff needed"]),
        ] },
        urgent: { time: "00:22", steps: [
          caller("My order came with something I'm allergic to!"),
          agent("We're so sorry. I'm putting you through to a staff member now, with your order details.", { handoff: true }),
          agent("We're so sorry. I've logged your complaint, and the manager will call you as soon as possible.", { handoff: false }),
          card("handoff", "Allergy complaint — straight to a person", ["Full call transcript", "Summary: the order has an allergen", "Order details"], { handoff: true }),
          card("pending", "Complaint · high priority", ["Summary: the order has an allergen", "Waiting for a call from the manager"], { handoff: false }),
          staff("Ahmed here from the restaurant, I've seen your order. Let's sort this out right now."),
        ] },
      },
      hotel: {
        book: { time: "00:40", steps: [
          caller("Do you have a room free on Thursday?"),
          agent("Yes, we have a double room on Thursday night. Shall I book it for you?"),
          caller("Book it."),
          agent("Booked: a double room on Thursday night.", { autobook: true }),
          agent("All right, I've logged your request and reception will confirm it.", { autobook: false }),
          card("done", "Booked", ["Double room", "Thursday night"], { autobook: true }),
          card("pending", "Booking request · awaiting staff confirmation", ["Double room", "Thursday night"], { autobook: false }),
        ] },
        price: { time: "00:26", steps: [
          caller("How much is a night in a double room?"),
          agent("It's 480 riyals a night, breakfast included."),
          caller("Perfect, thanks."),
          agent("You're welcome, see you soon."),
          card("answer", "Price query · answered on the call", ["Double room: 480 riyals", "No handoff needed"]),
        ] },
        urgent: { time: "00:25", steps: [
          caller("The air conditioning in my room is broken, and it's really hot."),
          agent("We're so sorry. I'm putting you through to reception now, with your room number.", { handoff: true }),
          agent("We're so sorry. I've logged the fault, and a maintenance technician will be with you as soon as possible.", { handoff: false }),
          card("handoff", "Fault report — straight to a person", ["Full call transcript", "Summary: the air conditioning is broken", "Room number and booking details"], { handoff: true }),
          card("pending", "Maintenance report · high priority", ["Summary: the air conditioning is broken", "Waiting for the technician"], { handoff: false }),
          staff("Ahmed here from reception, I've got your report. We're sending the technician now."),
        ] },
      },
    },
  },
} satisfies Record<Locale, unknown>;

export type DemoCopy = (typeof demoCopy)[Locale] & { greetings: Record<Activity, Greeting> };

/** One locale's copy for the panel, greetings included (they are the same on both pages). */
export const demoCopyFor = (locale: Locale): DemoCopy => ({ ...demoCopy[locale], greetings });
