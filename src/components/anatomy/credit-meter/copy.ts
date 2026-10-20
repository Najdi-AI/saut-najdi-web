/**
 * Every word on the credit-meter card, in Najdi Arabic and in English. Each
 * number is computed from content/pricing.ts through the model, never typed.
 */
import { PER_CONVERSATION, PER_MINUTE, READINGS, grouped, readoutOf, type Locale } from "./model";

const [ESSENTIAL, GROWTH, EXPANSION] = READINGS as [(typeof READINGS)[number], (typeof READINGS)[number], (typeof READINGS)[number]];

export interface MeterCopy {
  fig: (n: number) => string;
  title: string;
  hint: string;
  readout: string;
  label: string;
  engraved: string;
  group: string;
  planButton: (plan: string) => string;
  valveButton: (open: string) => string;
  calls: string;
  text: string;
  keys: { mark: "lit" | "raised" | "edge"; label: string }[];
  caption: string;
}

const g = grouped;

export const COPY: Record<Locale, MeterCopy> = {
  ar: {
    fig: (n) => `شكل ${n}`,
    title: "عدّاد النقاط",
    hint: "لفّ المفتاح · حرّك الذراع",
    readout: readoutOf(GROWTH, "calls", "ar"),
    label:
      "رسم لعدّاد نقاط على طاولة: خزان فيه حصة نقاط الباقة الشهرية، ومفتاح من ثلاث درجات يختار الباقة فيعبّي الخزان لحدها، وعدّاد بعقرب واحد يقرأ نفس الحصة على حلقتين: الخارجية بالدقائق والداخلية بالمحادثات، وتحته عدّاد أرقام. من الخزان يطلع خط واحد لصمام بمخرجين: خط عريض للمكالمات وخط أنحف للمحادثات النصية، والذراع يحدد أي مخرج مفتوح.",
    engraved: "حصة شهرية",
    group: "عدّاد النقاط: زر يبدّل الباقة وزر يبدّل الصمام بين المكالمات والمحادثات",
    planButton: (plan) => `الباقة: ${plan}. اضغط للباقة اللي بعدها، أو استخدم الأسهم`,
    valveButton: (open) => `الصمام مفتوح على ${open}. اضغط للتبديل`,
    calls: "المكالمات",
    text: "المحادثات النصية",
    keys: [
      { mark: "lit", label: "العقرب: حصة الباقة الشهرية، تقراها بالدقائق على الحلقة الخارجية وبالمحادثات على الداخلية" },
      { mark: "raised", label: "الخزان: حصة نقاط وحدة مشتركة، تتعبّى لحد باقتك كل شهر" },
      { mark: "edge", label: "الصمام: يوجّه نفس الحصة للمكالمات أو للمحادثات النصية" },
    ],
    caption: `كل باقة لها حصة نقاط شهرية وحدة: دقيقة المكالمة تاخذ ${PER_MINUTE} نقاط والمحادثة النصية ${PER_CONVERSATION} نقاط، عشان كذا خط المكالمات أعرض. ${ESSENTIAL.name.ar} من ${g(ESSENTIAL.monthlySar)} ر.س شهرياً بحصة ${g(ESSENTIAL.credits)} نقطة، و${GROWTH.name.ar} من ${g(GROWTH.monthlySar)} ر.س بحصة ${g(GROWTH.credits)}، و${EXPANSION.name.ar} من ${g(EXPANSION.monthlySar)} ر.س بحصة ${g(EXPANSION.credits)}، والأسعار قبل الضريبة. كل رقم يفترض إنك تصرف الحصة كلها على نوع واحد، ولو خلطت بينهم ينحسب حسب النقاط اللي صرفتها فعلاً.`,
  },
  en: {
    fig: (n) => `Fig ${n}`,
    title: "The credit meter",
    hint: "Turn the knob · flip the lever",
    readout: readoutOf(GROWTH, "calls", "en"),
    label:
      "A credit meter on a bench: a tank holding the plan's monthly credit pool, a three-position switch that picks the plan and fills the tank to it, and a gauge whose one needle reads the same pool on two rings, minutes outside and conversations inside, over a drum counter. One line leaves the tank for a two-way valve: a wide outlet for calls and a narrower one for text conversations, and the lever sets which one is open.",
    engraved: "MONTHLY POOL",
    group: "Credit meter: one button changes the plan, one switches the valve between calls and text",
    planButton: (plan) => `Plan: ${plan}. Press for the next plan, or use the arrow keys`,
    valveButton: (open) => `Valve open to ${open}. Press to switch`,
    calls: "calls",
    text: "text conversations",
    keys: [
      { mark: "lit", label: "The needle: the plan's monthly pool, read in minutes on the outer ring and in conversations on the inner" },
      { mark: "raised", label: "The tank: one shared credit pool, filled to your plan each month" },
      { mark: "edge", label: "The valve: sends the same pool to calls or to text" },
    ],
    caption: `Each plan has one monthly credit pool. A call minute draws ${PER_MINUTE} credits and a text conversation ${PER_CONVERSATION}, which is why the call line is the wider one. ${ESSENTIAL.name.en} is from SAR ${g(ESSENTIAL.monthlySar)} a month with ${g(ESSENTIAL.credits)} credits, ${GROWTH.name.en} from SAR ${g(GROWTH.monthlySar)} with ${g(GROWTH.credits)}, and ${EXPANSION.name.en} from SAR ${g(EXPANSION.monthlySar)} with ${g(EXPANSION.credits)}, before VAT. Each figure assumes the whole pool goes to one kind; mix them and it counts the credits you actually use.`,
  },
};
