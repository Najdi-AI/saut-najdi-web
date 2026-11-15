"use client";

import * as React from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";

type Direction = "ltr" | "rtl";

// (ar) and (en) are separate root layouts, so the page direction only
// changes with a full navigation; there is nothing to subscribe to.
const subscribe = () => () => {};
const readPageDir = (): Direction => (document.documentElement.dir === "rtl" ? "rtl" : "ltr");

/**
 * Base UI reads text direction from React context only, never from the DOM.
 * Under <html dir="rtl"> with no provider, a Slider still maps the pointer
 * and the arrow keys left-to-right (ArrowRight raises the value while the
 * thumb moves left) and a ToggleGroup's arrow keys move focus the wrong way.
 *
 * An explicit `dir` is the snapshot on the server and the client alike, so
 * the server HTML is already direction-correct. Without one this falls back
 * to the page's own dir: the server can only say "ltr", and React re-renders
 * with the real value straight after hydration.
 */
function PageDirection({ dir, children }: { dir?: string; children: React.ReactNode }) {
  const explicit: Direction | undefined = dir === "rtl" || dir === "ltr" ? dir : undefined;
  const direction = React.useSyncExternalStore(
    subscribe,
    () => explicit ?? readPageDir(),
    () => explicit ?? "ltr",
  );
  return <DirectionProvider direction={direction}>{children}</DirectionProvider>;
}

export { PageDirection };
