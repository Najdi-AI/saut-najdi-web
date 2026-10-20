"use client";

import * as React from "react";
import type { Locale } from "./model";
import { mountKbPress, type LiveData } from "./motion";

/**
 * The only client code of the figure: a focusable stage around the
 * server-rendered SVG, and one effect that hands it to the framework-free
 * controller in motion.ts (the same one the verification page runs).
 */
export function KbPressLive({ data, locale, label, children }: { data: LiveData; locale: Locale; label: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;
    return mountKbPress(node, data, { locale });
  }, [data, locale]);
  return (
    <div ref={ref} className="kbp-stage" tabIndex={0} role="group" aria-label={label}>
      {children}
    </div>
  );
}
