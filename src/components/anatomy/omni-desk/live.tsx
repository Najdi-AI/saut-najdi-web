"use client";

import * as React from "react";
import { mountDesk, type DeskData } from "./controller";

/**
 * The one client piece: a stage around the server-rendered drawing that
 * mounts the framework-free controller once it is in the page. It never
 * re-renders per frame; the controller writes attributes on the SVG groups.
 */
export function OmniDeskLive({ data, children }: { data: DeskData; children: React.ReactNode }) {
  const stage = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const node = stage.current;
    if (!node) return;
    return mountDesk(node, data);
  }, [data]);
  return (
    <div ref={stage} className="od-stage">
      {children}
    </div>
  );
}
