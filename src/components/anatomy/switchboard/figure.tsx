import type { Locale } from "@/lib/i18n";
import "../../iso/iso.css";
import "../lazy/frameless.css";
import "./switchboard.css";
import { artOf, liveData } from "./geometry.mjs";
import { SwitchboardLive } from "./live";

/**
 * The hero figure: the Najdi switchboard (NAJ-897), drawn with the anatomy kit.
 *
 * Server component, and the one figure that ships inline (the section figures
 * load lazily, lazy/useLazyArt.ts): it is the first thing on the page. Every
 * static path is computed here, once per server process (at build time for
 * the static homepage), thinned and compacted (geometry.mjs artOf), and handed
 * to the client as one finished SVG string: no geometry code ships. The
 * client part (live.tsx) moves the plugs, cord, dial, stamp, ticket and
 * lamps, and plays the hero voice clip from the speaker's hub.
 */
const ART = artOf();
const DATA = liveData();

export function SwitchboardFigure({ locale }: { locale: Locale }) {
  return <SwitchboardLive locale={locale} art={ART} data={DATA} />;
}
