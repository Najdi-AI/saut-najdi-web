import Link from "next/link";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { APP_URL, CAL_LINK_DEMO } from "@/lib/site";
import { chrome } from "@/content/chrome";
import { megaMenus } from "@/content/nav";
import { CalButton } from "./CalButton";
import { HeaderScroll } from "./nav/HeaderScroll";
import { ScrollProgress } from "./nav/ScrollProgress";
import { NavMenu } from "./nav/NavMenu";
import { MobileNav } from "./nav/MobileNav";
import { LangSwitch } from "./nav/LangSwitch";

/**
 * Header ported from the haroon911 reference: a resting full-width bar
 * that contracts into a floating glass capsule on scroll, with a reading
 * progress bar, two mega menus, and the mobile sheet.
 */
/**
 * The four top-row slots. «القطاعات»/"Industries" rather than
 * «الحلول»/"Solutions": that menu holds industry pages and only industry
 * pages, so the label should say so. "Security & data" matches the page's
 * own h1 and the footer link, which previously disagreed with each other.
 */
const labels = {
  ar: { product: "المنتج", solutions: "القطاعات", how: "كيف يشتغل", security: "الأمان والبيانات" },
  en: { product: "Product", solutions: "Industries", how: "How it works", security: "Security & data" },
} as const;

export function Header({ locale }: { locale: Locale }) {
  const t = chrome[locale];
  const l = labels[locale];
  const mega = megaMenus(locale);

  return (
    <header className="hdr">
      <HeaderScroll />
      <ScrollProgress />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2"
      >
        {t.skipToContent}
      </a>
      <div className="hdr-in">
        <Link
          href={localePath(locale, "")}
          className="hdr-logo"
          aria-label={locale === "ar" ? "صوت نجدي — الرئيسية" : "Saut Najdi — home"}
        >
          <Image
            src="/brand/logo-full.svg"
            alt={locale === "ar" ? "شعار صوت نجدي" : "Saut Najdi logo"}
            width={120}
            height={40}
            priority
          />
        </Link>

        <nav className="hdr-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          <NavMenu locale={locale} label={l.product} menu={mega.products} />
          <NavMenu locale={locale} label={l.solutions} menu={mega.sectors} />
          <Link href={localePath(locale, "how-it-works")} className="hdr-link">
            {l.how}
          </Link>
          <Link href={localePath(locale, "security")} className="hdr-link">
            {l.security}
          </Link>
        </nav>

        <div className="hdr-actions">
          <LangSwitch locale={locale} />
          <a href={APP_URL} className="hdr-link hdr-cta">
            {t.login}
          </a>
          <CalButton calLink={CAL_LINK_DEMO} locale={locale} variant="spectrum" className="hdr-cta">
            {t.cta}
          </CalButton>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
