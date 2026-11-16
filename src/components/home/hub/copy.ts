import type { Locale } from "@/lib/i18n";

/** The six channel tiles, by key. Phone systems: Grandstream and any SIP PBX (decision 183). */
export type Channel = "phone" | "whatsapp" | "telegram" | "web" | "grandstream" | "sip";

/** Text, or [before, island, after] where the island (a figure, a Latin name) is set LTR. */
export type Text = string | readonly string[];

/**
 * Channels around one inbox (Try 3 `#hub`, mockups/try-3/index.html). The
 * tiles come in the mockup's two columns. Inbox rows are sample messages,
 * newest first; `dup` marks the second phone row, which a phone hides so
 * every channel keeps one row on a short screen. The SIP row is the
 * mockup's own SIP sample (try.js), so that tile has a row to light up.
 */
export const hubCopy = {
  ar: {
    title: "يشتغل مع قنواتك وسنترالك",
    lead: "كل المحادثات توصل لصندوق واحد عند فريقك. مرّر على أي قناة أو اضغطها، وشوف رسالتها وين توصل.",
    groups: ["القنوات", "قنوات وسنترالات"],
    channel: "قناة",
    pbx: "سنترال",
    tiles: {
      phone: "الهاتف",
      whatsapp: "واتساب",
      telegram: "تيليجرام",
      web: "دردشة الموقع",
      grandstream: ["", "Grandstream"],
      sip: ["وأي سنترال يدعم ", "SIP"],
    },
    inbox: "صندوق واحد لفريقك",
    all: "كل القنوات",
    labels: {
      phone: "الهاتف",
      whatsapp: "واتساب",
      telegram: "تيليجرام",
      web: "دردشة الموقع",
      grandstream: ["", "Grandstream"],
      sip: ["سنترال ", "SIP"],
    },
    rows: [
      { ch: "telegram", who: "خالد", msg: "وصلني التأكيد، مشكورين", time: "8:15", half: "م" },
      { ch: "phone", who: "تحويل لأحمد", msg: "سؤال طبي، ومعه الملخص", time: "6:10", half: "م" },
      { ch: "web", who: "زائر الموقع", msg: "تفتحون يوم الجمعة؟", time: "4:20", half: "م" },
      { ch: "whatsapp", who: "نورة", msg: "أجي قبل الموعد بكم دقيقة؟", time: "1:30", half: "م" },
      { ch: "sip", who: "الفرع الثاني", msg: ["مكالمة عبر ", "SIP", " · يبي يأكد حجز"], time: "10:15", half: "ص" },
      { ch: "phone", who: "عميل جديد", msg: ["انحجز له تنظيف بكرة ", "4:30", " العصر"], time: "9:05", half: "ص", dup: true },
      { ch: "grandstream", who: ["تحويلة ", "112"], msg: "مكالمة من سنترالك · انحلت بدون تحويل", time: "8:40", half: "ص" },
    ],
  },
  en: {
    title: "Works with your channels and your phone system",
    lead: "Every conversation lands in one inbox for your team. Hover over or tap any channel to see where its messages land.",
    groups: ["Channels", "Channels and phone systems"],
    channel: "Channel",
    pbx: "Phone system",
    tiles: {
      phone: "Phone",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      web: "Website chat",
      grandstream: "Grandstream",
      sip: ["Any ", "SIP", " phone system"],
    },
    inbox: "One inbox for your team",
    all: "All channels",
    labels: {
      phone: "Phone",
      whatsapp: "WhatsApp",
      telegram: "Telegram",
      web: "Website chat",
      grandstream: "Grandstream",
      sip: "SIP phone system",
    },
    rows: [
      { ch: "telegram", who: "Khalid", msg: "Got the confirmation, thank you", time: "8:15", half: "pm" },
      { ch: "phone", who: "Handed to Ahmed", msg: "Medical question, with the summary", time: "6:10", half: "pm" },
      { ch: "web", who: "Website visitor", msg: "Are you open on Friday?", time: "4:20", half: "pm" },
      { ch: "whatsapp", who: "Noura", msg: "How early should I come for my appointment?", time: "1:30", half: "pm" },
      { ch: "sip", who: "Second branch", msg: "Call over SIP · wants to confirm a booking", time: "10:15", half: "am" },
      { ch: "phone", who: "New customer", msg: ["Booked a cleaning for tomorrow at ", "4:30", " pm"], time: "9:05", half: "am", dup: true },
      { ch: "grandstream", who: ["Extension ", "112"], msg: "Call from your phone system · resolved without a handoff", time: "8:40", half: "am" },
    ],
  },
} satisfies Record<Locale, unknown>;
