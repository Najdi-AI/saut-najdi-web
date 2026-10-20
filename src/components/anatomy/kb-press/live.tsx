"use client";

import * as React from "react";
import { useLazyArt } from "../lazy/useLazyArt";
import type { Locale } from "./model";
import type { LiveData } from "./motion";

/**
 * The only client code of the figure: a focusable stage around the lazy art
 * slot. When the stage nears the viewport the drawing is fetched and
 * inserted (useLazyArt), and then the framework-free controller in motion.ts
 * (its own chunk, the same one the verification page runs) is loaded and
 * mounted on it.
 */
export function KbPressLive({
  data,
  locale,
  label,
  art,
  src,
  width,
  height,
}: {
  data: LiveData;
  locale: Locale;
  label: string;
  art: string;
  src: string;
  width: number;
  height: number;
}) {
  const stage = React.useRef<HTMLDivElement>(null);
  const slot = useLazyArt(src, async () => {
    const { mountKbPress } = await import("./motion");
    return stage.current ? mountKbPress(stage.current, data, { locale }) : undefined;
  });
  return (
    <div ref={stage} className="kbp-stage" tabIndex={0} role="group" aria-label={label}>
      <div ref={slot} className="anx-art" role="img" aria-label={art} style={{ aspectRatio: `${width} / ${height}` }} />
    </div>
  );
}
