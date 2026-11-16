/**
 * Asserts the home missed-calls board's arithmetic
 * (src/components/home/board/model.ts) against the brief: the defaults
 * (12 calls, 35% missed, 40% would book, 250 SAR) make 420 SAR a day and
 * 12,600 a month, and 0% missed makes 0.
 *
 * Run: node scripts/check-board-model.mjs
 * Node 22.18+ / 23.6+ strips the TypeScript types from model.ts on import
 * (its MODULE_TYPELESS_PACKAGE_JSON warning about model.ts is harmless).
 */
import assert from "node:assert/strict";
import { DEFAULTS, DAYS, RANGES, boardOf, clockOf, weights } from "../src/components/home/board/model.ts";

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

console.log(`board model: ${n} checks pass (defaults 420/day, 12,600/month; 0% missed = 0)`);
