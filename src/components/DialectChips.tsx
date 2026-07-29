import type { Locale } from "@/lib/i18n";

/**
 * Hero dialect chips (blueprint §6.1): the shipped catalog is NAMED;
 * the last chip is the capability framing — never a named list of
 * unshipped dialects (§1 honesty rule).
 */
const chips = {
  ar: ["نجدي", "حجازي", "خليجي", "العربية", "English", "+ أي لهجة يحتاجها عملاؤك"],
  en: ["Najdi", "Hijazi", "Khaleeji", "Arabic", "English", "+ any dialect your customers need"],
} as const;

export function DialectChips({
  locale,
  className = "justify-center",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      {chips[locale].map((chip, i) => (
        <li
          key={chip}
          className={`rounded-full px-4 py-1.5 text-body font-medium ${
            i === chips[locale].length - 1
              ? "border border-dashed border-brand-blue/50 text-brand-blue"
              : "border border-line bg-white text-ink/75 shadow-card"
          }`}
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}
