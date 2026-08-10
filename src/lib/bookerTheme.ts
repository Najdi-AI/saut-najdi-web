/**
 * The dark skin for the inline Cal.com booker on /demo.
 *
 * This lives in its own module — not in `cal.ts` — because `cal.ts` is a
 * "use client" module: every export of a client module reaches a Server
 * Component as a client *reference*, not as its value, so a plain string
 * imported from there would arrive as a proxy. DemoPage (server) needs the
 * surface colour to paint the card the iframe sits in, so the token has to
 * come from a module with no directive on it.
 *
 * The two values MUST agree: `BOOKER_SURFACE` paints our card, `cal-bg`
 * paints the booker inside the iframe. If they drift, the iframe shows as a
 * differently-shaded rectangle inside the card and the seam is obvious.
 */

/** Card surface. A step above ink (#0D1326) so the card lifts off the band. */
export const BOOKER_SURFACE = "#0F1730";

/**
 * Brand tokens mapped onto Cal's dark palette. Names and roles are Cal's
 * (see cal.com/docs → customize embed CSS variables); values are ours.
 */
export const BOOKER_DARK_VARS: Record<string, string> = {
  // Brand — the selected date, the Confirm button
  "cal-brand": "#5B6CE5",
  "cal-brand-emphasis": "#7C8AEF",
  "cal-brand-text": "#FFFFFF",
  "cal-brand-subtle": "#3A4694",
  "cal-brand-accent": "#FFFFFF",

  // Text
  "cal-text": "#D6DAE8",
  "cal-text-emphasis": "#FFFFFF",
  "cal-text-subtle": "#98A1B8",
  "cal-text-muted": "#5D6680",
  "cal-text-inverted": "#0D1326",
  "cal-text-success": "#34D399", // the availability dot beside each slot

  // Surfaces
  "cal-bg": BOOKER_SURFACE,
  "cal-bg-emphasis": "#1E2745",
  "cal-bg-subtle": "#151E38",
  "cal-bg-muted": "#121A32",
  "cal-bg-inverted": "#F7F8FA",

  // Borders. The booker's own outer border is switched off — our card
  // already draws one, and two concentric borders read as a rendering bug.
  "cal-border": "#232C49",
  "cal-border-emphasis": "#3A4568",
  "cal-border-subtle": "#1E2740",
  "cal-border-muted": "#182034",
  "cal-border-booker": "transparent",
  "cal-border-booker-width": "0px",
};
