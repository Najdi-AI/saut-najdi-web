/**
 * The credit meter's model: every number the figure shows comes from
 * src/content/pricing.ts, the same module the homepage plans strip and the
 * pricing page read, so the figure cannot drift from them.
 *
 * One plan = one monthly credit pool. A call minute draws CREDIT_COST.voiceMinute
 * credits and a text conversation CREDIT_COST.textConversation, so the same pool
 * reads as voiceMinutes(credits) minutes OR textConversations(credits)
 * conversations (each figure assumes the whole pool goes to one kind, as the
 * pricing page says).
 *
 * Pure: no DOM, no React. Imported by the server art and by the verification
 * build (scripts/anatomy/credit-meter/build.mjs).
 */
import { CREDIT_COST, plans, textConversations, voiceMinutes } from "../../../content/pricing";

export type Locale = "ar" | "en";
export type Outlet = "calls" | "text";
export type PlanKey = (typeof plans)[number]["key"];

export interface PlanReading {
  key: PlanKey;
  name: { ar: string; en: string };
  monthlySar: number;
  credits: number;
  minutes: number;
  conversations: number;
}

export const READINGS: PlanReading[] = plans.map((plan) => ({
  key: plan.key,
  name: { ar: plan.ar, en: plan.en },
  monthlySar: plan.monthlySar,
  credits: plan.credits,
  minutes: voiceMinutes(plan.credits),
  conversations: textConversations(plan.credits),
}));

export const PER_MINUTE = CREDIT_COST.voiceMinute;
export const PER_CONVERSATION = CREDIT_COST.textConversation;

/**
 * The instrument's range. Not a product number: it is the gauge's full scale,
 * chosen as the next round 10,000 above the largest plan so every plan reads
 * on the scale. Both rings are the same credits divided by the two unit costs.
 */
const LARGEST = Math.max(...READINGS.map((reading) => reading.credits));
export const FULL_SCALE = Math.ceil(LARGEST / 10_000) * 10_000;
export const FULL_MINUTES = FULL_SCALE / PER_MINUTE;
export const FULL_CONVERSATIONS = FULL_SCALE / PER_CONVERSATION;

/** Share of full scale, 0..1. Drives the needle and the tank level. */
export const shareOf = (credits: number) => credits / FULL_SCALE;

export const counterOf = (reading: PlanReading, outlet: Outlet) => (outlet === "calls" ? reading.minutes : reading.conversations);

const grouped = (value: number) => new Intl.NumberFormat("en-US").format(value);

/** The card's live readout, in the plan strip's own words. */
export function readoutOf(reading: PlanReading, outlet: Outlet, locale: Locale) {
  const minutes = grouped(reading.minutes);
  const conversations = grouped(reading.conversations);
  if (locale === "ar") {
    const first = outlet === "calls" ? `${minutes} دقيقة` : `${conversations} محادثة`;
    const second = outlet === "calls" ? `${conversations} محادثة` : `${minutes} دقيقة`;
    return `${reading.name.ar} · تكفي لحد ${first} أو ${second}`;
  }
  const first = outlet === "calls" ? `${minutes} call minutes` : `${conversations} conversations`;
  const second = outlet === "calls" ? `${conversations} conversations` : `${minutes} call minutes`;
  return `${reading.name.en} · up to ${first} or ${second}`;
}

/** What a screen reader hears after a change: the readout plus the price. */
export function spokenOf(reading: PlanReading, outlet: Outlet, locale: Locale) {
  const price = grouped(reading.monthlySar);
  const credits = grouped(reading.credits);
  if (locale === "ar") {
    const open = outlet === "calls" ? "الصمام على المكالمات" : "الصمام على المحادثات النصية";
    return `باقة ${reading.name.ar}، من ${price} ريال شهرياً، حصتها ${credits} نقطة. ${open}: ${readoutOf(reading, outlet, locale).split(" · ")[1]}.`;
  }
  const open = outlet === "calls" ? "Valve on calls" : "Valve on text";
  return `${reading.name.en} plan, from SAR ${price} a month, a pool of ${credits} credits. ${open}: ${readoutOf(reading, outlet, locale).split(" · ")[1]}.`;
}

export { grouped };
