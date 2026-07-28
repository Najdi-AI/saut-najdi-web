"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import { APP_URL, CAL_LINK_DEMO } from "@/lib/site";
import { chrome } from "@/content/chrome";
import { CalButton } from "./CalButton";

/** Same page in the other language — blueprint §4.1 language switch rule. */
function altHref(pathname: string, locale: Locale): string {
  if (locale === "ar") {
    return pathname === "/" ? "/en" : `/en${pathname}`;
  }
  const stripped = pathname.replace(/^\/en(?=\/|$)/, "");
  return stripped === "" ? "/" : stripped;
}

export function Header({ locale }: { locale: Locale }) {
  const t = chrome[locale];
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-white/75 backdrop-blur-lg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        {t.skipToContent}
      </a>
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          href={localePath(locale, "")}
          className="flex shrink-0 items-center"
          aria-label={locale === "ar" ? "صوت نجدي — الرئيسية" : "Saut Najdi — home"}
        >
          <Image
            src="/brand/logo-full.svg"
            alt={locale === "ar" ? "شعار صوت نجدي" : "Saut Najdi logo"}
            width={132}
            height={44}
            priority
          />
        </Link>

        <nav
          className="hidden items-center gap-6 lg:flex"
          aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}
        >
          {t.nav.map((item) => (
            <Link
              key={item.path}
              href={localePath(locale, item.path)}
              className={`text-body-lg transition-colors hover:text-brand-blue ${
                pathname === localePath(locale, item.path)
                  ? "font-bold text-brand-blue"
                  : "text-ink/80"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={altHref(pathname, locale)}
            className="rounded-full border border-line px-3 py-1.5 text-body font-medium text-ink/70 transition-colors hover:border-brand-blue hover:text-brand-blue"
            lang={locale === "ar" ? "en" : "ar"}
            aria-label={t.langSwitchLabel}
          >
            {t.langSwitch}
          </Link>
          <a
            href={APP_URL}
            className="hidden text-body-lg text-ink/70 transition-colors hover:text-brand-blue md:block"
          >
            {t.login}
          </a>
          <CalButton
            calLink={CAL_LINK_DEMO}
            locale={locale}
            className="hidden !px-5 !py-2.5 md:inline-flex"
          >
            {t.cta}
          </CalButton>
          <button
            type="button"
            className="rounded-lg border border-line p-2 lg:hidden"
            aria-expanded={open}
            aria-label={locale === "ar" ? "القائمة" : "Menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden fill="none">
              {open ? (
                <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="border-t border-line bg-white lg:hidden"
          aria-label={locale === "ar" ? "قائمة الجوال" : "Mobile navigation"}
        >
          <div className="container flex flex-col gap-1 py-4">
            {t.nav.map((item) => (
              <Link
                key={item.path}
                href={localePath(locale, item.path)}
                className="rounded-lg px-3 py-2.5 text-body-lg text-ink/85 hover:bg-canvas"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={APP_URL}
              className="rounded-lg px-3 py-2.5 text-body-lg text-ink/70 hover:bg-canvas"
            >
              {t.login}
            </a>
            <div className="px-3 pt-2">
              <CalButton calLink={CAL_LINK_DEMO} locale={locale} className="w-full">
                {t.cta}
              </CalButton>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
