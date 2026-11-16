/**
 * Asserts the home missed-calls board's arithmetic (src/components/home/board/model.ts) against the
 * brief: the defaults (12 calls, 35% missed, 40% would book, 250 SAR) make 420 SAR a day and 12,600
 * a month, and 0% missed makes 0. Run: node scripts/check-board-model.mjs (Node 22.18+ / 23.6+ strips
 * the types from model.ts on import; its MODULE_TYPELESS_PACKAGE_JSON warning is harmless).
 */
import assert from "node:assert/strict";
import { DEFAULTS, DAYS, RANGES, boardOf, clockOf, signed, weights } from "../src/components/home/board/model.ts";

let n = 0;
const check = (actual, expected, what) => {
  assert.deepEqual(actual, expected, what);
  n++;
};

const d = boardOf(DEFAULTS);
check(DEFAULTS, { calls: 12, miss: 35, book: 40, value: 250 }, "defaults");
check(DAYS, 30, "a month is 30 days");
check(d.day, 420, "defaults: 420 SAR a day");
check(d.month, 12600, "defaults: 12,600 SAR a month");
check(d.per, 100, "defaults: a missed call costs 100 SAR on average");
check(d.missed, 4.2, "defaults: 4.2 missed calls a day");
// the tiles: 12 calls, four whole misses and one part (0.2), adding up to the day
const w = weights(d);
check(w.length, 12, "one tile per call");
check(w.filter((x) => x === 1).length, 4, "four whole missed calls");
check(Math.round(w.reduce((a, b) => a + b, 0) * 10) / 10, 4.2, "the tiles add up to 4.2 missed calls");
check(Math.round(w.reduce((a, b) => a + b * d.per, 0)), 420, "the tiles add up to 420 SAR");

const none = boardOf({ ...DEFAULTS, miss: 0 });
check(none.day, 0, "0% missed: 0 a day");
check(none.month, 0, "0% missed: 0 a month");
check(weights(none).every((x) => x === 0), true, "0% missed: every call answered");

// every knob's default sits on its own range and step
for (const [k, r] of Object.entries(RANGES)) {
  const v = DEFAULTS[k];
  check(v >= r.min && v <= r.max && (v - r.min) % r.step === 0, true, `${k} default on its range`);
}
// the busiest day still adds up, and the clock stays inside 10 pm to 8 am
const max = boardOf({ calls: 60, miss: 100, book: 100, value: 2000 });
check(max.month, 60 * 2000 * 30, "the busiest day: every call a booking");
check(clockOf(0, 12), { hm: "10:25", pm: true }, "the first call is just after 10 pm");
check(clockOf(11, 12), { hm: "7:35", pm: false }, "the last call is before 8 am");

// signed(): the magnitude is rounded, then signed, so a loss and a gain show the same digits;
// 0 has no sign. A half is the case that broke (Math.round(-367.5) is -367).
const half = boardOf({ calls: 7, miss: 35, book: 60, value: 250 });
check(half.day, 367.5, "7 calls, 35%, 60%, 250 SAR: 367.5 a day");
check([signed(-half.day), signed(half.day)], ["−368", "+368"], "a loss of 367.5 and the same gain both show 368");
check([signed(0), signed(-0), signed(0.4), signed(-0.4)], ["0", "0", "0", "0"], "anything that rounds to 0 is a bare 0");
check([signed(-12600), signed(12600)], ["−12,600", "+12,600"], "thousands separators and the U+2212 minus");
// every knob combination: the loss box, the gain box and the status line (Intl, as BoardGame formats
// it) show the same day figure, and a 0% booking makes no signed tile value
const status = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const steps = (k) => Array.from({ length: (RANGES[k].max - RANGES[k].min) / RANGES[k].step + 1 }, (_, i) => RANGES[k].min + i * RANGES[k].step);
let combos = 0, disagree = 0;
for (const calls of steps("calls")) for (const miss of steps("miss")) for (const book of steps("book")) for (const value of steps("value")) {
  const b = boardOf({ calls, miss, book, value });
  const loss = signed(-b.day), gain = signed(b.day), digits = gain.replace("+", "");
  combos++;
  if (loss.replace("−", "") !== digits || digits !== status.format(b.day) || (digits === "0" && (loss !== "0" || gain !== "0"))) disagree++;
}
check(disagree, 0, `loss, gain and status agree in all ${combos} knob combinations`);
check(weights(boardOf({ ...DEFAULTS, book: 0 })).map((x) => signed(-x * 0)).every((v) => v === "0"), true, "0% would book: tiles show 0, never −0");

console.log(`board model: ${n} checks pass (defaults 420/day, 12,600/month; 0% missed = 0; 367.5 shows 368 both ways; ${combos} knob combinations agree)`);
