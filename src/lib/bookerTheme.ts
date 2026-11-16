/**
 * The skin for the inline Cal.com booker on /demo: the rebrand's dark band
 * tokens, so the booker reads as part of the .on-dark BookingDesk card.
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

/** Card surface: Charcoal, the rebrand's dark ground (.on-dark). */
export const BOOKER_SURFACE = "#0D1326";

/**
 * Rebrand tokens mapped onto Cal's palette (names and roles are Cal's, see
 * cal.com/docs → customize embed CSS variables; values are ours): Charcoal
 * ground, Soft Navy raised, Off-White text, #3A4566 hairlines, and cyan for
 * the selection. Cal paints the selected date and its Confirm button from
 * the same brand token, so Najdi Red cannot be given to the confirm alone.
 */
export const BOOKER_VARS: Record<string, string> = {
  // Brand: the selected date, the Confirm button (Charcoal on cyan, 8.9:1)
  "cal-brand": "#2EC4E6",
  "cal-brand-emphasis": "#63D4EE",
  "cal-brand-text": "#0D1326",
  "cal-brand-subtle": "#1C2C5C",
  "cal-brand-accent": "#0D1326",

  // Text
  "cal-text": "#D5D9E2",
  "cal-text-emphasis": "#F7F8FA",
  "cal-text-subtle": "#A3ABBD",
  "cal-text-muted": "#737D99",
  "cal-text-inverted": "#0D1326",
  "cal-text-success": "#2EC4E6", // the availability dot beside each slot

  // Surfaces
  "cal-bg": BOOKER_SURFACE,
  "cal-bg-emphasis": "#1C2C5C",
  "cal-bg-subtle": "#112046",
  "cal-bg-muted": "#112046",
  "cal-bg-inverted": "#F7F8FA",

  // Borders. The booker's own outer border is switched off — our card
  // already draws one, and two concentric borders read as a rendering bug.
  "cal-border": "#3A4566",
  "cal-border-emphasis": "#737D99",
  "cal-border-subtle": "#3A4566",
  "cal-border-muted": "#2A3352",
  "cal-border-booker": "transparent",
  "cal-border-booker-width": "0px",
};
