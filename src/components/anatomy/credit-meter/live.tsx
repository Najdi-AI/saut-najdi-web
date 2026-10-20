"use client";

/**
 * The one client piece of the credit meter: the stage with the lazy art slot
 * and the two hit areas (plan knob and valve lever). When the stage nears the
 * viewport the drawing is fetched and inserted (useLazyArt); then the
 * framework-free controller (its own chunk, with lever.ts) is loaded and
 * mounted. It only writes attributes (no React re-render per frame).
 */
import * as React from "react";
import { useLazyArt } from "../lazy/useLazyArt";
import type { MeterLive } from "./controller";

type Spot = { left: string; top: string; width: string };

interface Props {
  data: MeterLive;
  label: string;
  art: string;
  src: string;
  width: number;
  height: number;
  hits: { plan: Spot; valve: Spot };
  buttons: { plan: string; valve: string };
}

export function CreditMeterLive({ data, label, art, src, width, height, hits, buttons }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  const slot = useLazyArt(src, async () => {
    const { mountMeter } = await import("./controller");
    return stage.current ? mountMeter(stage.current, data) : undefined;
  });
  return (
    <div ref={stage} className="iso-stage cm-stage" role="group" aria-label={label} data-outlet={data.start.outlet} data-plan={data.start.plan}>
      <div className="cm-box">
        <div ref={slot} className="anx-art" role="img" aria-label={art} style={{ aspectRatio: `${width} / ${height}` }} />
        <button type="button" className="cm-hit" data-control="plan" style={hits.plan} aria-label={buttons.plan} />
        <button type="button" className="cm-hit" data-control="valve" style={hits.valve} aria-label={buttons.valve} />
      </div>
      <span className="cm-sr" role="status" aria-live="polite" data-status="" />
    </div>
  );
}
