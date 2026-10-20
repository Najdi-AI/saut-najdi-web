"use client";

import * as React from "react";
import { useLazyArt } from "../lazy/useLazyArt";
import type { DeskData } from "./controller";

/**
 * The one client piece: a stage around the lazy art slot. When the stage
 * nears the viewport the drawing is fetched and inserted (useLazyArt), and
 * then the framework-free controller (its own chunk) is loaded and mounted.
 * It never re-renders per frame; the controller writes attributes on the
 * SVG groups.
 */
export function OmniDeskLive({ data, src, label, width, height }: { data: DeskData; src: string; label: string; width: number; height: number }) {
  const stage = React.useRef<HTMLDivElement>(null);
  const slot = useLazyArt(src, async () => {
    const { mountDesk } = await import("./controller");
    return stage.current ? mountDesk(stage.current, data) : undefined;
  });
  return (
    <div ref={stage} className="od-stage">
      <div ref={slot} className="anx-art od-art" role="img" aria-label={label} style={{ aspectRatio: `${width} / ${height}` }} />
    </div>
  );
}
