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
  home: "2026-08-06",
  "how-it-works": "2026-08-06",
  "product/human-handoff": "2026-08-06",
  security: "2026-08-06",
  demo: "2026-08-06",
  contact: "2026-08-06",
  about: "2026-08-06",
  faq: "2026-08-06",
  privacy: "2026-07-28",
  terms: "2026-07-28",
  dpa: "2026-07-28",
};

/** Fallback keeps a new page from emitting an `Invalid Date` before its entry lands. */
export function updatedFor(key: string): string {
  return updated[key] ?? updated.home;
}
