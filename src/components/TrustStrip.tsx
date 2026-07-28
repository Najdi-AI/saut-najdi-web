import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Blueprint §4.3 trust strip — the PDPL item uses the approved short
 * variant (§2.5 exception). Icons + short labels, no numbers.
 */
const items = {
  ar: [
    { label: "مصمّم بما يتوافق مع نظام حماية البيانات الشخصية السعودي (PDPL)", href: "security", icon: "shield" },
    { label: "تخزين في منطقة الخليج — بإفصاح كامل عن أماكن المعالجة", href: "security", icon: "database" },
    { label: "سجل تدقيق غير قابل للتعديل", href: null, icon: "lock" },
    { label: "تصعيد فوري لموظف بشري", href: "product/human-handoff", icon: "people" },
    { label: "لهجات سعودية أصيلة", href: null, icon: "wave" },
  ],
  en: [
    { label: "Designed to comply with the Saudi PDPL", href: "security", icon: "shield" },
    { label: "Gulf-region storage, processing fully disclosed", href: "security", icon: "database" },
    { label: "Append-only audit log", href: null, icon: "lock" },
    { label: "Instant escalation to a human", href: "product/human-handoff", icon: "people" },
    { label: "Authentic Saudi dialects", href: null, icon: "wave" },
  ],
} as const;

const icons: Record<string, React.ReactNode> = {
  shield: (
    <path d="M10 2l6 2.5V9c0 4-2.5 6.8-6 8-3.5-1.2-6-4-6-8V4.5L10 2z" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
  ),
  database: (
    <>
      <ellipse cx="10" cy="5" rx="6" ry="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M4 5v10c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V5" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="9" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  people: (
    <>
      <circle cx="7" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="14" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M3 16c0-2.2 1.8-4 4-4s4 1.8 4 4M12 15.5c.4-1.7 1.7-2.5 3-2.5 1.6 0 2.8 1.2 3 3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </>
  ),
  wave: (
    <path d="M3 10v1M6 7v7M9 5v10M12 8v5M15 6v8M17.5 9v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  ),
};

export function TrustStrip({ locale }: { locale: Locale }) {
  return (
    <div className="border-y border-line bg-white">
      <ul className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-3 py-4">
        {items[locale].map((item) => {
          const inner = (
            <span className="flex items-center gap-2 text-body text-ink/70">
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden className="shrink-0 text-brand-blue">
                {icons[item.icon]}
              </svg>
              {item.label}
            </span>
          );
          return (
            <li key={item.label}>
              {item.href ? (
                <Link href={localePath(locale, item.href)} className="transition-opacity hover:opacity-70">
                  {inner}
                </Link>
              ) : (
                inner
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
