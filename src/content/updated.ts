/**
 * Hand-maintained "content last changed" dates, ISO yyyy-mm-dd.
 *
 * Deliberately NOT build time: a lastmod/dateModified that always equals the
 * last deploy teaches crawlers the field is noise, and a small site only gets
 * one crawl-scheduling signal. Bump a date here ONLY when that page's visible
 * copy actually changes — a dependency bump or a styling tweak is not a
 * content change.
 *
 * Keys are the sitemap's path keys ("" → "home").
 */
export const updated: Record<string, string> = {
  // 2026-11-18: rebrand (decision 185), new visible copy on three pages.
  // The home page was rebuilt section by section with new copy (hero, try the
  // call, how it works, a day with your agent, the missed-calls board, the
  // channels hub, the plan walk, the FAQ as a conversation, the closing line).
  // /how-it-works gained the IVR comparison table that moved off the home.
  // /pricing became the four-tier plan walk with the full comparison table.
  // Every other page was restyled only (its text is identical), so its date
  // stands.
  home: "2026-11-18",
  "how-it-works": "2026-11-18",
  "product/human-handoff": "2026-08-06",
  // Wave 2 — first publication date of the nine pages in spec P2-22.
  "product/voice-agent": "2026-08-09",
  "product/knowledge-base": "2026-08-09",
  "product/dashboard": "2026-08-09",
  "product/agent-builder": "2026-08-09",
  // 2026-08-11 vendor-name scrub: these three carry the processor-category
  // phrasing that replaced named platforms. Restaurants and Retail were
  // edited the same day but only for the dark theme and tap-target fixes —
  // styling is explicitly not a content change, so their dates stand.
  "solutions/clinics": "2026-08-11",
  "solutions/restaurants": "2026-08-09",
  "solutions/hotels": "2026-08-11",
  "solutions/real-estate": "2026-08-11",
  "solutions/retail": "2026-08-09",
  // 2026-08-10 vendor-name scrub across legal.ts, faq.ts and SecurityPage —
  // named platforms became processor categories plus list-on-request, which
  // rewrote visible disclosure copy on every one of these.
  security: "2026-08-10",
  // 2026-08-11: /demo was rebuilt around the three-panel BookingDesk, whose
  // panel copy is ours rather than Cal's.
  demo: "2026-08-11",
  // Not in the sitemap (noindex), but its JSON-LD dateModified reads this map;
  // without a key it fell back to home's date, so it is pinned at the value it
  // already showed rather than moving with the home page.
  "demo/thank-you": "2026-10-13",
  contact: "2026-08-06",
  about: "2026-08-06",
  // The blog INDEX only. Individual posts date themselves from their own
  // `date` field in content/blog.ts — see the note in app/sitemap.ts.
  blog: "2026-08-16",
  faq: "2026-10-13",
  pricing: "2026-11-18",
  "refund-policy": "2026-10-13",
  privacy: "2026-08-10",
  terms: "2026-09-27",
  dpa: "2026-08-10",
};

/** Fallback keeps a new page from emitting an `Invalid Date` before its entry lands. */
export function updatedFor(key: string): string {
  return updated[key] ?? updated.home;
}
