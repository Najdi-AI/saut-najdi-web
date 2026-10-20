/**
 * Preload for the take-over check (takeover.json), run with drive.mjs:
 *
 *   node <anatomy>/scripts/drive.mjs <page>.html --actions scripts/anatomy/omni-desk/takeover.json --preload scripts/anatomy/omni-desk/takeover.js --height 1300
 *
 * Logs, from each real press (pointer or Enter), when the chosen button turns
 * pressed, when the readout and the live region change, and when lamps go on
 * and off. window.__verdict(label) sums one press up: the response (button,
 * readout and live region all naming the choice) must come within 100 ms,
 * and the desk must hand over (the running capsule's lamp off, the chosen
 * capsule called down) within 1000 ms.
 */
window.__lat = [];
window.__down = null;
addEventListener("pointerdown", () => ((window.__down = performance.now()), (window.__lat = [])), true);
addEventListener("keydown", (event) => (event.key === "Enter" || event.key === " ") && ((window.__down = performance.now()), (window.__lat = [])), true);
document.addEventListener("DOMContentLoaded", () => {
  const mark = (kind, what) => window.__down !== null && window.__lat.push({ ms: Math.round(performance.now() - window.__down), kind, what });
  const readout = document.querySelector("[data-readout]");
  new MutationObserver(() => mark("readout", readout.textContent)).observe(readout, { childList: true, characterData: true, subtree: true });
  const live = document.querySelector("[data-od-status]");
  new MutationObserver(() => mark("live", live.textContent)).observe(live, { childList: true, characterData: true, subtree: true });
  document.querySelectorAll("[data-od-pick]").forEach((button) => new MutationObserver(() => button.getAttribute("aria-pressed") === "true" && mark("pressed", button.textContent)).observe(button, { attributes: true, attributeFilter: ["aria-pressed"] }));
  document.querySelectorAll("[data-od-lamp]").forEach((lamp) => new MutationObserver(() => mark(lamp.hasAttribute("data-on") ? "lamp on" : "lamp off", lamp.getAttribute("data-od-lamp"))).observe(lamp, { attributes: true, attributeFilter: ["data-on"] }));
});
window.__verdict = (label) => {
  const first = (kind) => window.__lat.find((entry) => entry.kind === kind);
  const pressed = first("pressed"), readout = first("readout"), live = first("live"), off = first("lamp off");
  const response = pressed && readout && live ? Math.max(pressed.ms, readout.ms, live.ms) : Infinity;
  const handover = off ? off.ms : 0;
  const ok = response <= 100 && handover <= 1000;
  return `${ok ? "PASS" : "FAIL"} ${label}: pressed «${pressed?.what}», readout «${readout?.what}» and live region within ${response} ms; desk handed over at ${handover} ms`;
};
