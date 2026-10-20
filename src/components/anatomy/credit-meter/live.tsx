"use client";

/**
 * The one client piece of the credit meter: a wrapper that mounts the
 * framework-free controller on the server-rendered stage. The drawing, the two
 * hit areas and the status line all arrive as server-rendered children; the
 * controller only writes attributes on them (no React re-render per frame).
 */
import * as React from "react";
import { mountMeter, type MeterLive } from "./controller";

interface Props {
  data: MeterLive;
  label: string;
  children: React.ReactNode;
}

export function CreditMeterLive({ data, label, children }: Props) {
  const stage = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const node = stage.current;
    if (!node) return;
    return mountMeter(node, data);
  }, [data]);
  return (
    <div ref={stage} className="iso-stage cm-stage" role="group" aria-label={label} data-outlet={data.start.outlet} data-plan={data.start.plan}>
      {children}
    </div>
  );
}
