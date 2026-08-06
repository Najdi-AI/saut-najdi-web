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
 */
export const thmanyah = localFont({
  src: [
    { path: "../fonts/thmanyahsans-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/thmanyahsans-Medium.otf", weight: "500", style: "normal" },
    // globals.css asks for 600 in a few places and there is no 600 file.
    // Declaring Bold across 600–700 pins those to the real Bold outlines
    // instead of leaving the choice to per-browser font matching.
    { path: "../fonts/thmanyahsans-Bold.otf", weight: "600 700", style: "normal" },
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
