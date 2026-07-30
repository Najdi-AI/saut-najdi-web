"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { chrome } from "@/content/chrome";

/** Swaps to the SAME page in the other language (blueprint §4.1). */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const t = chrome[locale];
  const target =
    locale === "ar"
      ? pathname === "/"
        ? "/en"
        : `/en${pathname}`
      : pathname.replace(/^\/en(?=\/|$)/, "") || "/";

  return (
    <Link
      href={target}
      className="hdr-link"
      hrefLang={locale === "ar" ? "en" : "ar"}
      lang={locale === "ar" ? "en" : "ar"}
      aria-label={t.langSwitchLabel}
    >
      {t.langSwitch}
    </Link>
  );
}
