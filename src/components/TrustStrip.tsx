import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { AnimatedIcon, type IconName } from "./icons";

/**
 * Blueprint §4.3 trust strip — the PDPL item uses the approved short
 * variant (§2.5 exception). Animated line icons + short labels, no numbers.
 */
const items: Record<
  Locale,
  { label: string; href: string | null; icon: IconName }[]
> = {
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
};

export function TrustStrip({ locale }: { locale: Locale }) {
  return (
    <div className="border-y border-line">
      <ul className="container flex flex-wrap items-center justify-center gap-x-8 gap-y-1 py-3">
        {items[locale].map((item, i) => {
          const inner = (
            <span className="flex min-h-11 items-center gap-2 text-[0.9375rem] text-muted-foreground">
              <span className="shrink-0 text-ink">
                <AnimatedIcon name={item.icon} size={20} delay={i * 0.1} />
              </span>
              {item.label}
            </span>
          );
          return (
            <li key={item.label}>
              {item.href ? (
                <Link href={localePath(locale, item.href)} className="block underline-offset-4 hover:underline">
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
