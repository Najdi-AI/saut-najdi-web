import localFont from "next/font/local";

/**
 * Thmanyah Sans — the brand typeface for BOTH Arabic and English
 * (guideline p9). Files reused from the dashboard app's licensed bundle.
 */
export const thmanyah = localFont({
  src: [
    { path: "../fonts/thmanyahsans-Light.otf", weight: "300", style: "normal" },
    { path: "../fonts/thmanyahsans-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/thmanyahsans-Medium.otf", weight: "500", style: "normal" },
    { path: "../fonts/thmanyahsans-Bold.otf", weight: "700", style: "normal" },
    { path: "../fonts/thmanyahsans-Black.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-thmanyah",
  display: "swap",
  preload: true,
});
