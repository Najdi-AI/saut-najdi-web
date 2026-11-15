"use client";

import * as React from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";

type Direction = "ltr" | "rtl";

// (ar) and (en) are separate root layouts, so the page direction only
// changes with a full navigation; there is nothing to subscribe to.
const subscribe = () => () => {};
const getSnapshot = (): Direction => (document.documentElement.dir === "rtl" ? "rtl" : "ltr");
const getServerSnapshot = (): Direction => "ltr";

/**
 * Base UI reads text direction from React context only, never from the DOM.
 * Under <html dir="rtl"> with no provider, a Slider still maps the pointer
 * and the arrow keys left-to-right (ArrowRight raises the value while the
 * thumb moves left) and a ToggleGroup's arrow keys move focus the wrong way.
 * This hands Base UI the page's own `dir`. The server renders "ltr" and
 * React re-renders with the real value straight after hydration. An explicit
 * `dir` on the primitive wins.
 */
function PageDirection({ dir, children }: { dir?: string; children: React.ReactNode }) {
  const pageDir = React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const direction: Direction = dir === "rtl" || dir === "ltr" ? dir : pageDir;
  return <DirectionProvider direction={direction}>{children}</DirectionProvider>;
}

export { PageDirection };
