import type { Locale } from "@/lib/i18n";

/**
 * Hero language chips (owner decision 2026-08-10): three broad labels
 * rather than a dialect list. Naming individual dialects in the hero
 * invited both an overclaim («خليجي», which is not in the catalog) and a
 * category error (listing «العربية» beside dialects that are themselves
 * Arabic). The specific shipped voices are enumerated where a buyer can
 * read them in context, on /product/voice-agent.
 */
const chips = {
  ar: ["سعودي", "عربي", "إنجليزي"],
  en: ["Saudi", "Arabic", "English"],
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
      {chips[locale].map((chip) => (
        <li
          key={chip}
          className="rounded-full border border-line bg-white px-4 py-1.5 text-body font-medium text-ink/75 shadow-card"
        >
          {chip}
        </li>
      ))}
    </ul>
  );
}
