import "../../iso/iso.css";
import "../lazy/frameless.css";
import "./vault.css";
import { FIGURE_ART } from "../lazy/assets";
import { LIVE } from "./geometry";
import { HEIGHT, WIDTH, shellWords } from "./markup";
import { textFor, type Locale } from "./model";
import { VaultLive } from "./VaultLive";

/**
 * Fig: the Gulf vault (NAJ-897). A safe-deposit vault whose audit-log printer
 * only rolls forward: a ratchet and pawl stop any turn back. One key per
 * staff role; the drawn keys and the crank are the controls (click, or the
 * arrows, Enter and Backspace on the focused stage).
 *
 * Frameless (no card, corners or legend) and lazy: the server sends only the
 * stage, an empty art slot with the drawing's aspect ratio and its label, and
 * the off-screen readout. The drawing itself is public/figures/vault.<hash>.svg
 * (scripts/anatomy/export.mjs), fetched near the viewport, and the controller
 * loads after it (VaultLive).
 *
 * ground="page" follows the site theme; ground="navy" is always dark, on the
 * navy band of the homepage PDPL section and the /security hero. `fig` is
 * kept for the mount points' API; the frameless figure prints no number.
 */
export function VaultFigure({ locale, ground = "page" }: { locale: Locale; fig?: number; ground?: "page" | "navy" }) {
  return <VaultLive locale={locale} ground={ground} data={LIVE} text={textFor(locale)} words={shellWords(locale)} src={FIGURE_ART.vault[locale]} width={WIDTH} height={HEIGHT} />;
}
