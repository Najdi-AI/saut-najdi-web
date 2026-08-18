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
  // 2026-08-11: the closing booking section was replaced with the BookingDesk
  // panel — a new visible section with its own copy, not a restyle.
  home: "2026-08-11",
  "how-it-works": "2026-08-06",
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
  contact: "2026-08-06",
  about: "2026-08-06",
  // The blog INDEX only. Individual posts date themselves from their own
  // `date` field in content/blog.ts — see the note in app/sitemap.ts.
  blog: "2026-08-16",
  faq: "2026-08-10",
  privacy: "2026-08-10",
  terms: "2026-08-10",
  dpa: "2026-08-10",
};

/** Fallback keeps a new page from emitting an `Invalid Date` before its entry lands. */
export function updatedFor(key: string): string {
  return updated[key] ?? updated.home;
}
