import Link from "next/link";
import Image from "next/image";
import { localePath, type Locale } from "@/lib/i18n";
import { PDPL_LINE_AR, PDPL_LINE_EN, SUPPORT_EMAIL } from "@/lib/site";
import { chrome } from "@/content/chrome";
import { Waveform } from "./Waveform";

export function Footer({ locale }: { locale: Locale }) {
  const t = chrome[locale].footer;
  const pdpl = locale === "ar" ? PDPL_LINE_AR : PDPL_LINE_EN;
  const columns = [t.product, t.company, t.legal];

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Image
              src="/brand/logo-full.svg"
              alt={locale === "ar" ? "شعار صوت نجدي" : "Saut Najdi logo"}
              width={140}
              height={47}
            />
            <p className="mt-4 max-w-xs text-body text-ink/60">{pdpl}</p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              {/* A column LABEL, not a section heading: as an <h2> it injected
                  three site-wide siblings into every page's outline, competing
                  with the real content headings crawlers rank on. */}
              <p className="text-h5 text-ink">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.path}>
                    <Link
                      href={localePath(locale, l.path)}
                      className="text-body-lg text-ink/65 transition-colors hover:text-brand-blue"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-6">
          {/* Animated, same as the hero. It used to be `animate={false}`; the
              bars are short here (20px against the hero's 30) so the motion
              reads as a slow idle pulse rather than a second hero. Safe to
              run: the global prefers-reduced-motion rule in globals.css stops
              every animation on the page, this one included. */}
          <Waveform bars={36} maxHeight={20} className="opacity-60" />
          <div className="mt-4 flex flex-col items-center justify-between gap-3 text-body text-ink/65 sm:flex-row">
            <span>{t.madeIn} 🇸🇦</span>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-block py-2.5 transition-colors hover:text-brand-blue"
              dir="ltr"
            >
              {SUPPORT_EMAIL}
            </a>
            <span dir="ltr">{t.rights}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
