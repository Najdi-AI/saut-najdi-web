"use client";

import * as React from "react";
import { useLazyArt } from "../lazy/useLazyArt";
import type { LiveData } from "./geometry";
import type { Locale, VaultText } from "./model";

type Ground = "page" | "navy";

/**
 * The only client code of the figure: it mirrors the site theme onto the kit
 * wrapper, inserts the lazy drawing when the stage nears the viewport, and
 * then loads and mounts the DOM controller (its own chunk). React never
 * re-renders the drawing.
 */
export function VaultLive({
  locale,
  ground,
  data,
  text,
  words,
  src,
  width,
  height,
}: {
  locale: Locale;
  ground: Ground;
  data: LiveData;
  text: VaultText;
  words: { stage: string; label: string; rest: string };
  src: string;
  width: number;
  height: number;
}) {
  const root = React.useRef<HTMLDivElement>(null);
  const [theme, setTheme] = React.useState<"light" | "dark">(ground === "navy" ? "dark" : "light");

  React.useEffect(() => {
    if (ground === "navy") {
      setTheme("dark");
      return;
    }
    const page = document.documentElement;
    const read = () => setTheme(page.getAttribute("data-theme") === "dark" ? "dark" : "light");
    read();
    const watch = new MutationObserver(read);
    watch.observe(page, { attributes: true, attributeFilter: ["data-theme"] });
    return () => watch.disconnect();
  }, [ground]);

  const slot = useLazyArt(src, async () => {
    const { mountVault } = await import("./controller");
    return root.current ? mountVault(root.current, data, text) : undefined;
  });

  return (
    <div ref={root} className="iso vlt anx" dir={locale === "ar" ? "rtl" : "ltr"} lang={locale} data-theme={theme} data-ground={ground}>
      <figure className="iso-figure vlt-figure">
        <div className="iso-plate">
          <div className="iso-stage vlt-stage" tabIndex={0} role="group" aria-label={words.stage}>
            <div ref={slot} className="anx-art" role="img" aria-label={words.label} style={{ aspectRatio: `${width} / ${height}` }} />
            <span className="vlt-sr" role="status" aria-live="polite" data-status="" />
          </div>
          <span className="anx-sr" data-readout="">
            {words.rest}
          </span>
        </div>
      </figure>
    </div>
  );
}
