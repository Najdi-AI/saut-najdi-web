import Link from "next/link";
import { DemoLink } from "./DemoLink";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { APP_URL } from "@/lib/site";
import { chrome } from "@/content/chrome";
import { megaMenus } from "@/content/nav";
import { HeaderScroll } from "./nav/HeaderScroll";
import { ScrollProgress } from "./nav/ScrollProgress";
import { NavMenu } from "./nav/NavMenu";
import { MobileNav, SyncedThemeToggle } from "./nav/MobileNav";
import { LangSwitch } from "./nav/LangSwitch";

/**
 * Header ported from the haroon911 reference: a resting full-width bar
 * that contracts into a floating glass capsule on scroll, with a reading
 * progress bar, two mega menus, and the mobile sheet.
 */
/**
 * The top-row destinations. «القطاعات»/"Industries" rather than
 * «الحلول»/"Solutions": that menu holds industry pages and only industry
 * pages, so the label should say so. "Security & data" matches the page's
 * own h1 and the footer link, which previously disagreed with each other.
 */
const labels = {
  ar: { product: "المنتج", solutions: "القطاعات", how: "كيف يشتغل", pricing: "الأسعار", security: "الأمان والبيانات" },
  en: { product: "Product", solutions: "Industries", how: "How it works", pricing: "Pricing", security: "Security & data" },
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
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[110] focus:rounded-lg focus:bg-surface focus:px-4 focus:py-2"
      >
        {t.skipToContent}
      </a>
      <div className="hdr-in">
        <Link
          href={localePath(locale, "")}
          className="hdr-logo"
          aria-label={locale === "ar" ? "صوت نجدي — الرئيسية" : "Saut Najdi — home"}
        >
          {/* Two cuts, CSS-swapped on [data-theme="dark"]. The wordmark inside
              the SVG is live <text> with a baked dark fill, so it cannot
              follow currentColor and a filter would wreck the gradient mark.
              Only one is ever displayed; the second carries no alt text so
              screen readers hear the logo once.
              The artboard is mostly empty canvas above and below the mark, so
              .hdr-logo crops that canvas (object-fit) rather than shrinking
              the mark: 136px boxes show the artwork at ~121px wide, the brand
              guide's 120px digital minimum. The file itself is untouched. */}
          <Image
            src="/brand/logo-full.svg"
            alt={locale === "ar" ? "شعار صوت نجدي" : "Saut Najdi logo"}
            width={136}
            height={52}
            priority
            className="logo-default"
          />
          <Image
            src="/brand/logo-full-inverse.svg"
            alt=""
            aria-hidden
            width={136}
            height={52}
            className="logo-inverse"
          />
        </Link>

        <nav className="hdr-nav" aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main navigation"}>
          <NavMenu locale={locale} label={l.product} menu={mega.products} />
          <NavMenu locale={locale} label={l.solutions} menu={mega.sectors} />
          <Link href={localePath(locale, "how-it-works")} className="hdr-link">
            {l.how}
          </Link>
          <Link href={localePath(locale, "pricing")} className="hdr-link">
            {l.pricing}
          </Link>
          <Link href={localePath(locale, "security")} className="hdr-link">
            {l.security}
          </Link>
        </nav>

        {/* Below 640px the bar keeps logo, the booking pill, language and
            the burger; the theme switch and login move into the sheet. The
            pill is never hidden — it is the page's one conversion action. */}
        <div className="hdr-actions">
          <SyncedThemeToggle locale={locale} hiddenWhen="(max-width: 639.98px)" />
          <span className="hdr-lang">
            <LangSwitch locale={locale} />
          </span>
          <a href={APP_URL} className="hdr-link hdr-login">
            {t.login}
          </a>
          <DemoLink locale={locale} variant="spectrum" className="hdr-cta">
            {t.cta}
          </DemoLink>
          <MobileNav locale={locale} />
        </div>
      </div>
    </header>
  );
}
