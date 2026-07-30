"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import { APP_URL, CAL_LINK_DEMO } from "@/lib/site";
import { chrome } from "@/content/chrome";
import { CalButton } from "@/components/CalButton";

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

      {open && (
        <div
          id="mobile-nav"
          className="mobile-nav"
          style={{ position: "absolute", insetInline: 0, top: "100%" }}
        >
          <h3>{sections.pages}</h3>
          {t.nav.map((item) => (
            <Link key={item.path} href={localePath(locale, item.path)} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          <h3>{sections.more}</h3>
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
      )}
    </>
  );
}
