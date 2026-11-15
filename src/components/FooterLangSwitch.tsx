"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import s from "./Footer.module.css";

/** Each language's own name: the same in both locales. */
const LANG_NAME: Record<Locale, string> = { ar: "العربية", en: "English" };

/**
 * The footer's language switch: both languages, the current one marked; each
 * links to the SAME page in that language (blueprint §4.1), like the header
 * switch. The one client island in the footer: the layouts render the footer
 * without knowing the path, so only this part reads it.
 */
export function FooterLangSwitch({
  locale,
  label,
}: {
  locale: Locale;
  label: string;
}) {
  const pathname = usePathname() ?? "/";
  const arPath =
    locale === "ar" ? pathname : pathname.replace(/^\/en(?=\/|$)/, "") || "/";
  const href: Record<Locale, string> = {
    ar: arPath,
    en: arPath === "/" ? "/en" : `/en${arPath}`,
  };

  return (
    <div className={s.langsw} role="group" aria-label={label}>
      {(["ar", "en"] as const).map((l) => (
        <Link
          key={l}
          href={href[l]}
          lang={l}
          hrefLang={l}
          aria-current={l === locale ? "page" : undefined}
        >
          {LANG_NAME[l]}
        </Link>
      ))}
    </div>
  );
}
