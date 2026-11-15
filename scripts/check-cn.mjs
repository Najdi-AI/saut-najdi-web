/**
 * Asserts that cn() (src/lib/utils.ts) keeps this site's custom @theme
 * utilities instead of merging them away as colours.
 *
 * Run: node scripts/check-cn.mjs
 * Node 22.18+ / 23.6+ strips the TypeScript types from utils.ts on import
 * (its MODULE_TYPELESS_PACKAGE_JSON warning about utils.ts is harmless).
 */
import assert from "node:assert/strict";
import { cn } from "../src/lib/utils.ts";

const cases = [
  // custom size + colour: both stay
  [["text-body-lg", "text-ink"], "text-body-lg text-ink"],
  [["text-h1", "text-ink/70"], "text-h1 text-ink/70"],
  [["text-body-sm", "text-brand-purple"], "text-body-sm text-brand-purple"],
  // two sizes or two colours still merge to the last one
  [["text-h1", "text-body"], "text-body"],
  [["text-ink", "text-surface"], "text-surface"],
  [["sm:text-body", "sm:text-h2"], "sm:text-h2"],
  // custom shadows are sizes, not shadow colours
  [["shadow-card", "shadow-card-hover"], "shadow-card-hover"],
  [["shadow-card", "shadow-black/10"], "shadow-card shadow-black/10"],
  // the brand gradients are background images, not background colours
  [["bg-brand-gradient", "bg-surface"], "bg-brand-gradient bg-surface"],
  // @utility text-gradient is not a text colour
  [["text-gradient", "text-ink"], "text-gradient text-ink"],
  [["animate-wave-bar", "animate-none"], "animate-none"],
  [["px-2", false, "px-4"], "px-4"],
];

for (const [input, expected] of cases) {
  assert.equal(cn(...input), expected, `cn(${JSON.stringify(input)})`);
}
console.log(`cn(): ${cases.length} cases pass`);
