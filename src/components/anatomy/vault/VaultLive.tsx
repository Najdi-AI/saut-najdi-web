"use client";

import * as React from "react";
import { mountVault } from "./controller";
import type { LiveData } from "./geometry";
import type { Locale, VaultText } from "./model";

type Ground = "page" | "navy";

/**
 * The only client code of the figure: it mirrors the site theme onto the
 * kit wrapper and mounts the DOM controller. The drawing itself arrives as
 * server-rendered HTML and is never re-rendered by React.
 */
export function VaultLive({ locale, ground, data, text, html }: { locale: Locale; ground: Ground; data: LiveData; text: VaultText; html: string }) {
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

  React.useEffect(() => {
    const node = root.current;
    if (!node) return;
    return mountVault(node, data, text);
  }, [data, text]);

  return (
    <div
      ref={root}
      className="iso vlt"
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      data-theme={theme}
      data-ground={ground}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
