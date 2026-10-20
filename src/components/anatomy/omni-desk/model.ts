/**
 * The one desk: the true numbers and the timeline, with no DOM and no kit.
 *
 * Six pneumatic tubes, one per channel the site lists (OmniChannels.tsx:
 * calls, WhatsApp, Telegram, SMS, email, website chat), come down to one
 * desk. A capsule arrives down its own tube, a carriage takes it to the one
 * stamp (the same agent answers every channel), and it goes back up the tube
 * it came from (the answer leaves on the channel the customer used).
 *
 * Every timing here is illustrative motion for the drawing, not a measured
 * response time: the site publishes no performance numbers (blueprint §2.2).
 *
 * The geometry module, the server art, the client controller and the
 * standalone verification build all read this one file.
 */

export type Locale = "ar" | "en";

/** The site's own channel order (OmniChannels.tsx). */
export const CHANNELS = ["calls", "whatsapp", "telegram", "sms", "email", "web"] as const;
export type Channel = (typeof CHANNELS)[number];
export const COUNT = CHANNELS.length;

/** World layout shared with the client: x along the desk, y across it, z up; desk top at z = 0. */
/** Three tubes each side of the stamp, with room in the middle for the press. */
export const TUBE_X = [-140, -90, -40, 40, 90, 140];
export const PRESS_X = 0;
export const LANE_Y = -50;

export const RAIL_TOP = 4;
export const SLED_TOP = 9;
export const CUP_TOP = 13;
export const CAPSULE_LEN = 18;
export const CAPSULE_R = 4.4;
/** Bottom of each receiver: a capsule standing in the cup clears its lip by 10, so it reads as let go. */
export const MOUTH_Z = 41;
/** The sight glass above each receiver (receiver 12, lower collar 4, glass 22): the capsule shows only below its top. */
export const GLASS_SPAN: [number, number] = [MOUTH_Z + 16, MOUTH_Z + 38];
/** Capsule base while it is up inside the opaque tube, out of sight. */
export const HIDDEN_Z = 100;
/** Bottom face of the stamp pad at rest, and how far it travels to meet the capsule's cap. */
export const PAD_REST = 37;
export const STROKE = PAD_REST - (CUP_TOP + CAPSULE_LEN);

/**
 * Which tube carries a channel. Arabic reads right to left, so on the Arabic
 * page the first channel sits on the right-hand tube (+x is screen right).
 * The mapping is its own inverse.
 */
export const tubeOf = (channel: number, locale: Locale) => (locale === "ar" ? COUNT - 1 - channel : channel);
export const channelOf = tubeOf;

export type Phase = "travel" | "arrive" | "carry" | "stamp" | "back" | "send" | "rest";
export type Step = "in" | "answered" | "sent";
export const STEPS: readonly Step[] = ["in", "answered", "sent"];

export interface Job {
  tube: number;
  /** Carriage x when the job starts (where the last one left it). */
  from: number;
}

export interface Pose {
  carriage: number;
  capsuleX: number;
  capsuleZ: number;
  /** Stamp travel, 0 at rest to 1 on the cap. */
  press: number;
  /** The answered mark on the cap, 0 to 1. */
  seal: number;
  /** Tube whose arrival lamp is on, or -1. */
  lamp: number;
  phase: Phase;
  step: Step;
  done: boolean;
}

const ARRIVE_GLIDE = 0.82;
const ARRIVE_HANG = 0.08;
/** The drop from the mouth to the cup: 22 units under gravity, taken as cm (981 cm/s²). */
const DROP = MOUTH_Z - CUP_TOP;
const ARRIVE_FALL = Math.sqrt((2 * DROP) / 981);
const ARRIVE_BOUNCE = 0.2;
const ARRIVE = ARRIVE_GLIDE + ARRIVE_HANG + ARRIVE_FALL + ARRIVE_BOUNCE;
const PRESS_DOWN = 0.24;
const PRESS_HOLD = 0.2;
const PRESS_UP = 0.42;
const STAMP = PRESS_DOWN + PRESS_HOLD + PRESS_UP;
const SEND = 0.95;
const REST = 0.7;
const SEAL_IN = 0.14;

const clamp = (value: number, low = 0, high = 1) => Math.min(high, Math.max(low, value));
/** Smootherstep: zero velocity and acceleration at both ends. */
const ease = (t: number) => {
  const u = clamp(t);
  return u * u * u * (u * (u * 6 - 15) + 10);
};
const easeOut = (t: number) => 1 - Math.pow(1 - clamp(t), 3);
const easeIn = (t: number) => Math.pow(clamp(t), 2.2);

const travel = (dx: number) => (Math.abs(dx) < 0.01 ? 0 : 0.45 + Math.abs(dx) / 170);

export interface Schedule {
  x: number;
  /** Phase start times, then the end. */
  at: Record<Phase | "end", number>;
  /** When the stamp meets the cap. */
  contact: number;
}

export function scheduleOf(job: Job): Schedule {
  const x = TUBE_X[job.tube]!;
  const travelAt = 0;
  const arriveAt = travelAt + travel(x - job.from);
  const carryAt = arriveAt + ARRIVE;
  const stampAt = carryAt + travel(PRESS_X - x);
  const backAt = stampAt + STAMP;
  const sendAt = backAt + travel(x - PRESS_X);
  const restAt = sendAt + SEND;
  const end = restAt + REST;
  return { x, at: { travel: travelAt, arrive: arriveAt, carry: carryAt, stamp: stampAt, back: backAt, send: sendAt, rest: restAt, end }, contact: stampAt + PRESS_DOWN };
}

/** Capsule base height while it arrives: a glide down the tube that brakes in the glass, a short hang at the mouth, a fall into the cup and one small bounce. */
function arriving(t: number) {
  if (t < ARRIVE_GLIDE) return HIDDEN_Z - (HIDDEN_Z - MOUTH_Z) * easeOut(t / ARRIVE_GLIDE);
  const hang = t - ARRIVE_GLIDE;
  if (hang < ARRIVE_HANG) return MOUTH_Z;
  const fall = hang - ARRIVE_HANG;
  if (fall < ARRIVE_FALL) return MOUTH_Z - 0.5 * 981 * fall * fall;
  const bounce = clamp((fall - ARRIVE_FALL) / ARRIVE_BOUNCE);
  return CUP_TOP + 0.9 * Math.sin(Math.PI * bounce) * (1 - bounce);
}

export function poseAt(job: Job, age: number): Pose {
  const s = scheduleOf(job);
  const { at, x } = s;
  const t = Math.max(0, age);
  const step: Step = t < s.contact ? "in" : t < at.back ? "answered" : "sent";
  const seal = clamp((t - s.contact) / SEAL_IN);
  const base = { press: 0, seal, lamp: job.tube, step, done: t >= at.end };
  if (t < at.arrive) {
    const u = at.arrive > 0 ? t / at.arrive : 1;
    return { ...base, carriage: job.from + (x - job.from) * ease(u), capsuleX: x, capsuleZ: HIDDEN_Z, phase: "travel" };
  }
  if (t < at.carry) return { ...base, carriage: x, capsuleX: x, capsuleZ: arriving(t - at.arrive), phase: "arrive" };
  if (t < at.stamp) {
    const carriage = x + (PRESS_X - x) * ease((t - at.carry) / (at.stamp - at.carry));
    return { ...base, carriage, capsuleX: carriage, capsuleZ: CUP_TOP, phase: "carry" };
  }
  if (t < at.back) {
    const local = t - at.stamp;
    const press = local < PRESS_DOWN ? easeIn(local / PRESS_DOWN) : local < PRESS_DOWN + PRESS_HOLD ? 1 : 1 - easeOut((local - PRESS_DOWN - PRESS_HOLD) / PRESS_UP);
    return { ...base, press, carriage: PRESS_X, capsuleX: PRESS_X, capsuleZ: CUP_TOP, phase: "stamp" };
  }
  if (t < at.send) {
    const carriage = PRESS_X + (x - PRESS_X) * ease((t - at.back) / (at.send - at.back));
    return { ...base, carriage, capsuleX: carriage, capsuleZ: CUP_TOP, phase: "back" };
  }
  if (t < at.rest) return { ...base, carriage: x, capsuleX: x, capsuleZ: CUP_TOP + (HIDDEN_Z - CUP_TOP) * easeIn((t - at.send) / SEND), phase: "send" };
  return { ...base, lamp: -1, carriage: x, capsuleX: x, capsuleZ: HIDDEN_Z, phase: "rest" };
}

/** The still the server renders and reduced motion shows: a capsule on the desk, just answered. */
export const STILL_CHANNEL = 1;
export function stillJob(locale: Locale): Job {
  return { tube: tubeOf(STILL_CHANNEL, locale), from: PRESS_X };
}
export function stillAge(job: Job) {
  const s = scheduleOf(job);
  return s.at.back - 0.001;
}

/** A step word that agrees with its channel's noun (Arabic), or one word for every channel. */
export type Agree = string | { m: string; f: string };
export type Gender = "m" | "f";

export interface Words {
  /** Short channel names in the site's order. */
  names: readonly string[];
  /** The grammatical gender of each short name, for step words that agree with it. */
  genders: readonly Gender[];
  /** What follows the name at each step. */
  steps: Record<Step, readonly Agree[]>;
}

const SEP = " · ";

export function readoutOf(channel: number, step: Step, words: Words) {
  const name = words.names[channel] ?? "";
  const gender = words.genders[channel] ?? "m";
  return [name, ...words.steps[step].map((word) => (typeof word === "string" ? word : word[gender]))].join(SEP);
}

/** The widest readout any channel can show, for sizing checks. */
export function widestReadout(words: Words) {
  let widest = "";
  for (let channel = 0; channel < COUNT; channel++)
    for (const step of STEPS) {
      const text = readoutOf(channel, step, words);
      if (text.length > widest.length) widest = text;
    }
  return widest;
}
