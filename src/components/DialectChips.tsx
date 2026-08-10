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

/**
 * The clone line. «دقيقة وحدة» rather than a seconds figure: the platform's
 * upload gate is MIN_SAMPLE_DURATION_SEC = 60 (voices-clone.ts), enforced
 * both server-side and in the wizard, and its own comment records that the
 * floor was RAISED from 30 for abuse defence. Promising 30 seconds here
 * would send customers into a rejection they cannot argue with.
 */
const cloneLine = {
  ar: "وتبي صوتك أنت؟ نستنسخه من عيّنة دقيقة وحدة — بموافقة صاحب الصوت.",
  en: "Want your own voice? We clone it from a one-minute sample, with the owner's consent.",
} as const;

export function DialectChips({
  locale,
  className = "justify-center",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
        {chips[locale].map((chip) => (
          <li
            key={chip}
            className="rounded-full border border-line bg-white px-4 py-1.5 text-body font-medium text-ink/75 shadow-card dark:border-white/15 dark:bg-white/[0.07] dark:text-white/85 dark:shadow-none"
          >
            {chip}
          </li>
        ))}
      </ul>
      <p
        className={`text-body-sm text-ink/60 dark:text-white/55 ${className.includes("center") ? "text-center" : ""}`}
      >
        {cloneLine[locale]}
      </p>
    </div>
  );
}
