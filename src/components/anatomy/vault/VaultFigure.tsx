import "../../iso/iso.css";
import "./vault.css";
import { LIVE } from "./geometry";
import { figureHtml } from "./markup";
import { textFor, type Locale } from "./model";
import { VaultLive } from "./VaultLive";

/**
 * Fig: the Gulf vault (NAJ-897). A safe-deposit vault whose audit-log printer
 * only rolls forward: a ratchet and pawl stop any turn back. One key per
 * staff role. Server component: the art, corners, legend and caption are
 * static HTML; only the small controller in VaultLive ships to the client.
 *
 * ground="page" follows the site theme (light card or night card);
 * ground="navy" is always dark and takes the navy band as its paper, for
 * the homepage PDPL band and the /security hero.
 */
export function VaultFigure({ locale, fig = 1, ground = "page" }: { locale: Locale; fig?: number; ground?: "page" | "navy" }) {
  return <VaultLive locale={locale} ground={ground} data={LIVE} text={textFor(locale)} html={figureHtml(locale, fig, { uid: `${fig}${ground === "navy" ? "n" : "p"}` })} />;
}
