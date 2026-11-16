import type { Locale } from "@/lib/i18n";
import { Hero } from "./hero";
import { Demo } from "./demo";
import { How } from "./how";
import { Day } from "./day";
import { Board } from "./board";
import { Hub } from "./hub";
import { Pricing } from "./pricing";
import { Faq } from "./faq";
import { Flip } from "./flip";

/**
 * The home page (rebrand decisions 183-185): the Try 1 hero, then the
 * sections in the Try 3 order. Each section lives in its own folder and owns
 * its markup, copy and id (demo, day, board, hub, pricing, book); this file
 * only fixes the order, so the section missions never edit it. The footer
 * is the layout's.
 *
 * A fragment, not a wrapper: the hero must stay main's first element after
 * the route's JSON-LD scripts, because the header reads its data-hero="dark"
 * from there (globals.css, HeaderScroll).
 */
export function Home({ locale }: { locale: Locale }) {
  return (
    <>
      <Hero locale={locale} />
      <Demo locale={locale} />
      <How locale={locale} />
      <Day locale={locale} />
      <Board locale={locale} />
      <Hub locale={locale} />
      <Pricing locale={locale} />
      <Faq locale={locale} />
      <Flip locale={locale} />
    </>
  );
}
