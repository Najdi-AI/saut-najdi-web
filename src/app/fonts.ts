import localFont from "next/font/local";

/**
 * Thmanyah Sans — the brand typeface for BOTH Arabic and English
 * (guideline p9). Files reused from the dashboard app's licensed bundle.
 *
 * Only the weights the site actually renders are registered here. An audit of
 * src/ found: `font-medium` (500) and `font-bold` (700) as the only weight
 * utilities, tailwind.config.ts type scale uses 500/700, globals.css uses
 * 500/600/700, and body copy inherits 400. Light (300) and Black (900) were
 * never referenced, so registering them only cost ~475 KB of preloaded,
 * never-painted glyphs. Dropping them is visually a no-op.
 *
 * NOTE: `preload` in next/font/local is per-family, not per-file — every file
 * in `src` gets a <link rel="preload">. The three that remain are all needed
 * for first paint (400 body, 500 buttons/lead copy, 700 headings), so preload
 * stays on for the family.
 *
 * WOFF2, not the licensed OTFs they were built from. OTF is the desktop
 * format: the three faces shipped 709 KB, which was 44% of the homepage's
 * total 1.6 MB — more than all the JavaScript. Recompressing to WOFF2 (the
 * format every browser this site supports has taken since 2016) costs 230 KB
 * for the same three faces, a 479 KB saving on FIRST PAINT since all three
 * are preloaded.
 *
 * Verified lossless before the swap, not assumed: round-tripping each WOFF2
 * back to sfnt reproduces 1518 glyphs, 411 cmap entries and the exact
 * original table size for all three weights. Rendering is byte-identical.
 *
 * The .otf originals stay in ../fonts as the licensed masters — they are no
 * longer referenced, so nothing bundles them. Regenerate with `wawoff2`.
 */
export const thmanyah = localFont({
  src: [
    { path: "../fonts/thmanyahsans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/thmanyahsans-Medium.woff2", weight: "500", style: "normal" },
    // globals.css asks for 600 in a few places and there is no 600 file.
    // Declaring Bold across 600–700 pins those to the real Bold outlines
    // instead of leaving the choice to per-browser font matching.
    { path: "../fonts/thmanyahsans-Bold.woff2", weight: "600 700", style: "normal" },
  ],
  variable: "--font-thmanyah",
  // Text paints immediately in the fallback and swaps in when the OTFs land —
  // never a blank screen (FOIT), which matters most on Arabic first paint.
  display: "swap",
  preload: true,
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
  // adjustFontFallback is left at its default ('Arial'), which makes Next emit
  // a metric-overridden fallback face ahead of the list above and keeps CLS
  // near zero during the swap. Do not set it to false.
});
