import type { Locale, Words } from "./model";

/**
 * Every word on the card, in Najdi Arabic and in English, written for each
 * language rather than translated. Claims stay inside what the site already
 * says (OmniChannels.tsx): six channels in one inbox, the same agent answers
 * them all from the business's own information, and staff can step into any
 * conversation. No numbers, no names, no speeds.
 *
 * The Arabic readout agrees with each channel's noun: مكالمة, رسالة نصية and
 * دردشة الموقع are feminine (وصلت، انرد عليها), واتساب, تيليجرام and بريد are
 * masculine (وصل، انرد عليه). The words that need no agreement (بالطريق،
 * الرد رجع) are plain strings.
 */
export interface Copy {
  fig: string;
  title: string;
  hint: string;
  label: string;
  group: string;
  keys: { mark: "lit" | "raised" | "edge"; label: string }[];
  caption: string;
  /** Long channel names for the buttons, short ones for the readout. */
  channels: readonly string[];
  words: Words;
}

const AR: Copy = {
  fig: "شكل",
  title: "مكتب واحد",
  hint: "اختار قناة",
  label:
    "مكتب فرز عليه ستة أنابيب هوائية، كل أنبوب لقناة: المكالمات وواتساب وتيليجرام والرسائل النصية والبريد ودردشة الموقع. تنزل كبسولة من أنبوبها، تاخذها عربة على سكة إلى ختم واحد يختمها، وترجعها لنفس الأنبوب اللي جت منه. على المكتب صندوق بطاقات فيه معلومات المنشأة، وكبسولات احتياط على حامل ورا السكة.",
  group: "قنوات المكتب: اختار قناة وتنزل كبسولتها على المكتب",
  keys: [
    { mark: "lit", label: "الكبسولة: رسالة عميل، تنزل وترجع بالرد" },
    { mark: "raised", label: "ستة أنابيب، لكل قناة أنبوبها" },
    { mark: "edge", label: "سكة واحدة وختم واحد: نفس الوكيل يرد على الكل" },
    { mark: "raised", label: "صندوق البطاقات: معلومات منشأتك اللي يرد منها" },
  ],
  caption:
    "كل قنوات عملائك توصل لنفس المكتب: المكالمات وواتساب وتيليجرام والرسائل النصية والبريد ودردشة موقعك. نفس الوكيل يرد عليها كلها من معلومات منشأتك، والرد يرجع من نفس القناة اللي جا منها العميل. الحركة للتوضيح بس، وسرعتها مو سرعة الرد الفعلية.",
  channels: ["المكالمات", "واتساب", "تيليجرام", "الرسائل النصية", "البريد", "دردشة الموقع"],
  words: {
    names: ["مكالمة", "واتساب", "تيليجرام", "رسالة نصية", "بريد", "دردشة الموقع"],
    genders: ["f", "m", "m", "f", "m", "f"],
    steps: {
      coming: ["بالطريق"],
      in: [{ m: "وصل", f: "وصلت" }],
      answered: [{ m: "وصل", f: "وصلت" }, { m: "انرد عليه", f: "انرد عليها" }],
      sent: ["الرد رجع من نفس القناة"],
    },
  },
};

const EN: Copy = {
  fig: "Fig",
  title: "One desk",
  hint: "Pick a channel",
  label:
    "A sorting desk with six pneumatic tubes, one for each channel: phone calls, WhatsApp, Telegram, SMS, email and website chat. A capsule comes down its own tube, a carriage on one rail takes it to the one stamp, and it goes back up the tube it came from. On the desk sit a card index of the business's information and a rack of spare capsules behind the rail.",
  group: "Desk channels: pick one to bring its capsule down to the desk",
  keys: [
    { mark: "lit", label: "The capsule: one customer message, down and back with its answer" },
    { mark: "raised", label: "Six tubes, one for each channel" },
    { mark: "edge", label: "One rail and one stamp: the same agent answers them all" },
    { mark: "raised", label: "The card index: your business's own information, where every answer comes from" },
  ],
  caption:
    "Every customer channel reaches the same desk: phone calls, WhatsApp, Telegram, SMS, email and your website chat. The same agent answers them all from your business's own information, and each answer goes back the way the customer came. The motion is illustrative; its speed is not the real response time.",
  channels: ["Phone calls", "WhatsApp", "Telegram", "SMS", "Email", "Website chat"],
  words: {
    names: ["Call", "WhatsApp", "Telegram", "SMS", "Email", "Web chat"],
    genders: ["m", "m", "m", "m", "m", "m"],
    steps: {
      coming: ["on its way"],
      in: ["in"],
      answered: ["in", "answered"],
      sent: ["replied the same way"],
    },
  },
};

export const COPY: Record<Locale, Copy> = { ar: AR, en: EN };
