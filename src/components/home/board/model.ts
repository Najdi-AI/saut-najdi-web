/*
 * The missed-calls board's arithmetic (Try 3 try.js, section 5), kept free
 * of imports so scripts/check-board-model.mjs can load it straight into Node
 * and assert the defaults. All figures are estimates from the visitor's own
 * numbers; nothing here is a promise.
 */

export type Knob = "calls" | "miss" | "book" | "value";
export type Inputs = Record<Knob, number>;

/** The brief's defaults: 12 after-hours calls a day, 35% unanswered, 40% would book, a 250 SAR booking. */
export const DEFAULTS: Inputs = { calls: 12, miss: 35, book: 40, value: 250 };

/** Each knob's range (percentages in steps of 5, the booking value in steps of 50 SAR). */
export const RANGES: Record<Knob, { min: number; max: number; step: number }> = {
  calls: { min: 1, max: 60, step: 1 },
  miss: { min: 0, max: 100, step: 5 },
  book: { min: 0, max: 100, step: 5 },
  value: { min: 50, max: 2000, step: 50 },
};

/** The month is the day times this. */
export const DAYS = 30;

export type Board = Inputs & { missed: number; per: number; day: number; month: number };

/**
 * missed: calls a day that ring out, on average; per: what one missed call
 * costs on average (a booking's value times the share that would book);
 * day: their product, on an integer path (12 x 35 x 40 x 250 / 10^4 = 420)
 * so the defaults come out exact.
 */
export function boardOf(i: Inputs): Board {
  const day = (i.calls * i.miss * i.book * i.value) / 10000;
  return { ...i, missed: (i.calls * i.miss) / 100, per: (i.value * i.book) / 100, day, month: day * DAYS };
}

/**
 * Which calls ring out, as a weight per call (0 answered, 1 missed): the
 * missed calls spread evenly over the day, and a fraction of a call (4.2 a
 * day) becomes one part-filled tile.
 */
export function weights(b: Board): number[] {
  const k = Math.ceil(b.missed - 1e-9);
  const frac = b.missed - Math.floor(b.missed + 1e-9);
  const w: number[] = new Array(b.calls).fill(0);
  for (let j = 0; j < k; j++) w[Math.min(b.calls - 1, Math.floor(((j + 0.5) * b.calls) / k))] = j === k - 1 && frac > 1e-9 ? frac : 1;
  return w;
}

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });

/**
 * A figure with its sign (U+2212 minus), as the board shows it: the magnitude is rounded first, so a
 * loss and the same gain show the same digits (Math.round(-367.5) is -367 but Math.round(367.5) is
 * 368), and anything that rounds to 0 is a bare "0", never "−0" or "+0".
 */
export function signed(v: number): string {
  const n = Math.round(Math.abs(v));
  return n === 0 ? "0" : (v > 0 ? "+" : "−") + whole.format(n);
}

/** Call i of n, spread over the after-hours window from 10 pm to 8 am: "h:mm" and whether it is pm. */
export function clockOf(i: number, n: number): { hm: string; pm: boolean } {
  const m = 1320 + Math.round(((i + 0.5) * 600) / n / 5) * 5;
  const h = Math.floor(m / 60) % 24;
  return { hm: `${h % 12 || 12}:${String(m % 60).padStart(2, "0")}`, pm: h >= 12 };
}
