"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";
import {
  BILLING_EMAIL,
  PDPL_LINE_AR,
  PDPL_LINE_EN,
  SELLER_CR,
  SELLER_NAME,
  SELLER_NAME_AR,
  SITE_NAME_AR,
  SITE_NAME_EN,
  SUPPORT_EMAIL,
  VAT_NUMBER,
} from "@/lib/site";
import { chrome } from "@/content/chrome";
import { SOCIAL_HEADING } from "@/content/social";
import { SocialLinks } from "./SocialLinks";
import s from "./Footer.module.css";

/** Each language's own name: the same in both locales. */
const LANG_NAME: Record<Locale, string> = { ar: "العربية", en: "English" };

/**
 * Both languages, the current one marked; each links to the SAME page in
 * that language (blueprint §4.1), like the header switch.
 */
function FooterLangSwitch({ locale, label }: { locale: Locale; label: string }) {
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

/**
 * The site footer: Try 3's colophon (decision 184). Brand and PDPL line,
 * three link columns and the support address, then the social row and the
 * language switch; the company's legal lines sit on a band of their own.
 * Every figure and address comes from lib/site.ts.
 */
export function Footer({ locale }: { locale: Locale }) {
  const t = chrome[locale].footer;
  const ar = locale === "ar";
  const columns = [t.product, t.company, t.legal];

  return (
    <footer className={s.colophon} aria-labelledby="footer-title">
      {/* The footer's one heading, for screen-reader outlines. The column
          names stay labels: as <h2>s they injected three site-wide siblings
          into every page's outline, competing with the real content
          headings crawlers rank on. */}
      <h2 id="footer-title" className="sr-only">
        {t.title}
      </h2>
      <div className={`${s.wrap} ${s.main}`}>
        <div className={s.brand}>
          {/* The light-ground cut only: the footer is light in every theme. */}
          <Link
            href={localePath(locale, "")}
            className={s.logo}
            aria-label={t.homeLabel}
          >
            <Image src="/brand/logo-full.svg" alt="" width={142} height={110} />
          </Link>
          <p className={s.pdpl}>{ar ? PDPL_LINE_AR : PDPL_LINE_EN}</p>
          <p className={s.parent}>
            {t.parent.lead}{" "}
            <a href={t.parent.url} rel="noopener">
              {t.parent.name}
            </a>
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} className={s.nav} aria-label={col.title}>
            <p className={s.label}>{col.title}</p>
            <ul>
              {col.links.map((l) => (
                <li key={l.path}>
                  <Link href={localePath(locale, l.path)}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <div className={s.reach}>
          <p className={s.label}>{t.contact}</p>
          <a className={s.mail} href={`mailto:${SUPPORT_EMAIL}`} dir="ltr">
            {SUPPORT_EMAIL}
          </a>
        </div>
        {/* Social profiles sit outside the three <nav>s: they are outbound
            identity endpoints, not site navigation. */}
        <div className={s.row}>
          <SocialLinks heading={SOCIAL_HEADING[locale]} />
          <FooterLangSwitch locale={locale} label={t.language} />
        </div>
      </div>
      <div className={s.legal}>
        <div className={`${s.wrap} ${s.legalIn}`}>
          <p className={s.seller}>
            <span>{ar ? SELLER_NAME_AR : SELLER_NAME}</span>
            <span>
              {t.crLabel}: <bdi dir="ltr">{SELLER_CR}</bdi>
            </span>
            <span>
              {t.vatLabel}: <bdi dir="ltr">{VAT_NUMBER}</bdi>
            </span>
            <a href={`mailto:${BILLING_EMAIL}`} dir="ltr">
              {BILLING_EMAIL}
            </a>
          </p>
          <p className={s.made}>
            {/* Text only. The 🇸🇦 emoji rendered as the letters "SA" on
                Windows, and a hand-drawn flag would have to redraw the
                Shahada, which is not ours to approximate. */}
            <span>{t.madeIn}</span>
            <span>
              <bdi dir="ltr">{t.copyright}</bdi> {ar ? SITE_NAME_AR : SITE_NAME_EN}
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
