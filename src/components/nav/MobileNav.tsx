"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import { APP_URL } from "@/lib/site";
import { DemoLink } from "@/components/DemoLink";
import { chrome } from "@/content/chrome";
import { LangSwitch } from "./LangSwitch";
import { ThemeToggle } from "./ThemeToggle";

/* Logical inset only — insetInline covers both RTL and LTR, and
   insetBlockStart is the block-axis equivalent of `top`. */
const SHEET_BASE: React.CSSProperties = {
  position: "absolute",
  insetInline: 0,
  insetBlockStart: "100%",
};
const SHEET_OPEN: React.CSSProperties = {
  visibility: "visible",
  opacity: 1,
  pointerEvents: "auto",
};
const SHEET_CLOSED: React.CSSProperties = {
  visibility: "hidden",
  opacity: 0,
  pointerEvents: "none",
};

/* Group labels match the desktop row («المنتج», «القطاعات») and the footer
   column («الشركة»), so a visitor meets one information architecture. */
const groupLabels = {
  ar: { product: "المنتج", sectors: "القطاعات", company: "الشركة", menu: "القائمة" },
  en: { product: "Product", sectors: "Industries", company: "Company", menu: "Menu" },
} as const;

type GroupKey = "product" | "sectors" | "company";

/* chrome.nav is one flat list because it also feeds the
   SiteNavigationElement JSON-LD; the sheet groups it by destination instead
   of reshaping the shared content. Same split as the footer columns. */
function groupOf(path: string): GroupKey {
  if (path.startsWith("solutions/")) return "sectors";
  if (path.startsWith("product/") || path === "how-it-works" || path === "pricing") return "product";
  return "company";
}

/**
 * ThemeToggle reads the theme once, on mount. There are two of them now — the
 * header's (640px and up) and the sheet's (below 640px) — so whichever copy is
 * off screen re-mounts on every theme change and is current when it next
 * shows. The visible copy never re-mounts, so it keeps keyboard focus.
 */
export function SyncedThemeToggle({ locale, hiddenWhen }: { locale: Locale; hiddenWhen: string }) {
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia(hiddenWhen);
    const onTheme = () => {
      if (mq.matches) setEpoch((n) => n + 1);
    };
    root.addEventListener("themechange", onTheme);
    return () => root.removeEventListener("themechange", onTheme);
  }, [hiddenWhen]);
  return <ThemeToggle key={epoch} locale={locale} />;
}

/**
 * Mobile sheet (ported): burger chip + full-width sheet under the bar.
 * The booking CTA leads the sheet, then three short labelled groups; the
 * theme switch and language sit at the foot (they leave the header below
 * 640px to make room for the CTA pill).
 */
export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const sheet = useRef<HTMLElement>(null);
  const idBase = useId();
  const t = chrome[locale];
  const g = groupLabels[locale];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // The sheet goes inert on close, so focus inside it would be dropped
      // on <body>; hand it back to the burger that opened it.
      const within = sheet.current?.contains(document.activeElement);
      setOpen(false);
      if (within) burger.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const groups: Record<GroupKey, { label: string; path: string }[]> = {
    product: [],
    sectors: [],
    company: [],
  };
  for (const item of t.nav) groups[groupOf(item.path)].push(item);
  groups.company.push(
    { label: locale === "ar" ? "من نحن" : "About us", path: "about" },
    { label: locale === "ar" ? "تواصل معنا" : "Contact us", path: "contact" },
  );

  return (
    <>
      <button
        ref={burger}
        type="button"
        className="burger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? (locale === "ar" ? "إغلاق" : "Close") : (locale === "ar" ? "القائمة" : "Menu")}
      >
        <svg width="18" height="12" viewBox="0 0 18 12" aria-hidden="true">
          {open ? (
            <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M2 1l14 10M16 1L2 11" />
            </g>
          ) : (
            <g stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M1 1h16M1 6h16M1 11h16" />
            </g>
          )}
        </svg>
      </button>

      {/* Always mounted, like the desktop mega panel: the sheet's links have to
          be in the server HTML, not behind a tap. Closed state is styling +
          inert, never unmounting. Any link tap closes it, including one that
          points at the page already on screen. */}
      <nav
        ref={sheet}
        id="mobile-nav"
        className="mobile-nav"
        aria-label={g.menu}
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        inert={!open}
        style={{ ...SHEET_BASE, ...(open ? SHEET_OPEN : SHEET_CLOSED) }}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
      >
        <div className="mnav-top">
          <DemoLink locale={locale} variant="spectrum" className="mnav-cta">
            {t.cta}
          </DemoLink>
          <a href={APP_URL} className="mnav-login">
            {t.login}
          </a>
        </div>

        {(["product", "sectors", "company"] as const).map((key) => (
          <div className="mnav-group" key={key}>
            {/* Group labels, not document headings — the sheet is chrome, and
                an <h3> here lands in the outline of every page before any
                <h2>. The list takes its name from the label instead. */}
            <p className="mnav-label" id={`${idBase}-${key}`}>
              {g[key]}
            </p>
            <ul className="mnav-links" aria-labelledby={`${idBase}-${key}`}>
              {groups[key].map((item) => (
                <li key={item.path}>
                  <Link href={localePath(locale, item.path)}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="mnav-utils">
          <SyncedThemeToggle locale={locale} hiddenWhen="(min-width: 640px)" />
          <LangSwitch locale={locale} />
        </div>
      </nav>
    </>
  );
}
