import type { Locale, Words } from "./model";

/**
 * Every word on the card, in Najdi Arabic and in English, written for each
 * language rather than translated. Claims stay inside what the site already
 * says (OmniChannels.tsx): six channels in one inbox, the same agent answers
 * them all, and staff can step into any conversation. No numbers, no names.
 */
export interface Copy {
  fig: string;
  title: string;
  hint: string;
  label: string;
  group: string;
  pick: string;
  keys: { mark: "lit" | "raised" | "edge"; label: string }[];
  caption: string;
  /** Long channel names for the buttons, short ones for the readout. */
  channels: readonly string[];
  words: Words;
}

const AR: Copy = {
  fig: "شكل",
  title: "مكتب واحد",
  hint: "اختر قناة",
  label:
    "مكتب فرز عليه ست أنابيب هوائية، كل أنبوب لقناة: المكالمات وواتساب وتيليجرام والرسائل النصية والبريد ودردشة الموقع. تنزل كبسولة من أنبوبها، تاخذها عربة على سكة إلى ختم واحد يختمها، وترجعها لنفس الأنبوب اللي جت منه.",
  group: "قنوات المكتب: اختر قناة وتنزل كبسولتها على المكتب",
  pick: "أرسل من",
  keys: [
    { mark: "lit", label: "الكبسولة: رسالة عميل، تنزل وترجع بالرد" },
    { mark: "raised", label: "ست أنابيب، لكل قناة أنبوبها" },
    { mark: "edge", label: "سكة واحدة وختم واحد: نفس الوكيل يرد على الكل" },
  ],
  caption:
    "كل قنوات عملائك توصل لنفس المكتب: المكالمات وواتساب وتيليجرام والرسائل النصية والبريد ودردشة موقعك. نفس الوكيل يرد عليها كلها من معلومات منشأتك، والرد يرجع من نفس القناة اللي جا منها العميل. الحركة توضيحية، مو أرقام فعلية.",
  channels: ["المكالمات", "واتساب", "تيليجرام", "الرسائل النصية", "البريد", "دردشة الموقع"],
  words: {
    names: ["مكالمة", "واتساب", "تيليجرام", "رسالة نصية", "بريد", "دردشة الموقع"],
    in: "وصل",
    answered: "انرد عليه",
    sent: "رجع بنفس القناة",
  },
};

const EN: Copy = {
  fig: "Fig",
  title: "One desk",
  hint: "Pick a channel",
  label:
    "A sorting desk with six pneumatic tubes, one for each channel: phone calls, WhatsApp, Telegram, SMS, email and website chat. A capsule comes down its own tube, a carriage on one rail takes it to the one stamp, and it goes back up the tube it came from.",
  group: "Desk channels: pick one to bring its capsule down to the desk",
  pick: "Send from",
  keys: [
    { mark: "lit", label: "The capsule: one customer message, down and back with its answer" },
    { mark: "raised", label: "Six tubes, one for each channel" },
    { mark: "edge", label: "One rail and one stamp: the same agent answers them all" },
  ],
  caption:
    "Every customer channel reaches the same desk: phone calls, WhatsApp, Telegram, SMS, email and your website chat. The same agent answers them all from your business's own information, and each answer goes back the way the customer came. The motion is illustrative, not measured traffic.",
  channels: ["Phone calls", "WhatsApp", "Telegram", "SMS", "Email", "Website chat"],
  words: {
    names: ["Call", "WhatsApp", "Telegram", "SMS", "Email", "Web chat"],
    in: "in",
    answered: "answered",
    sent: "sent back",
  },
};

export const COPY: Record<Locale, Copy> = { ar: AR, en: EN };
