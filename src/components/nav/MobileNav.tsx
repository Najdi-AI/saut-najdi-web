"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import { APP_URL, CAL_LINK_DEMO } from "@/lib/site";
import { chrome } from "@/content/chrome";
import { CalButton } from "@/components/CalButton";

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

/** Mobile sheet (ported): burger chip + full-width sheet under the bar. */
export function MobileNav({ locale }: { locale: Locale }) {
  const [open, setOpen] = useState(false);
  const t = chrome[locale];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const sections = {
    ar: { pages: "الصفحات", more: "صوت نجدي" },
    en: { pages: "Pages", more: "Saut Najdi" },
  }[locale];

  return (
    <>
      <button
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
          inert, never unmounting. */}
      <div
        id="mobile-nav"
        className="mobile-nav"
        data-open={open ? "true" : "false"}
        aria-hidden={!open}
        inert={!open}
        style={{ ...SHEET_BASE, ...(open ? SHEET_OPEN : SHEET_CLOSED) }}
      >
        {/* Group labels, not document headings — the sheet is chrome, and an
            <h3> here lands in the outline of every page before any <h2>. */}
        <p>{sections.pages}</p>
        {t.nav.map((item) => (
          <Link key={item.path} href={localePath(locale, item.path)} onClick={() => setOpen(false)}>
            {item.label}
          </Link>
        ))}
        <p>{sections.more}</p>
        <Link href={localePath(locale, "about")} onClick={() => setOpen(false)}>
          {locale === "ar" ? "من نحن" : "About us"}
        </Link>
        <Link href={localePath(locale, "contact")} onClick={() => setOpen(false)}>
          {locale === "ar" ? "تواصل معنا" : "Contact us"}
        </Link>
        <a href={APP_URL}>{t.login}</a>
        <div className="pt-4">
          <CalButton calLink={CAL_LINK_DEMO} locale={locale} variant="spectrum" className="w-full">
            {t.cta}
          </CalButton>
        </div>
      </div>
    </>
  );
}
