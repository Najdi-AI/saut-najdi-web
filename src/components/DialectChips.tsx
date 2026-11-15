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

/**
 * Plain text, not pills (2026-10-20 critique): bordered, shadowed pills read
 * as buttons that did nothing when pressed. The words are unchanged; a small
 * dot separates them, so the line reads as a list rather than a control.
 */
export function DialectChips({
  locale,
  className = "justify-center",
}: {
  locale: Locale;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <ul className={`flex flex-wrap items-center gap-x-3 gap-y-1 ${className}`}>
        {chips[locale].map((chip, i) => (
          <li key={chip} className="flex items-center gap-3 text-body-lg font-medium text-ink/80">
            {i > 0 && <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-brand-blue/70" />}
            {chip}
          </li>
        ))}
      </ul>
      <p
        className={`text-body-sm text-ink/60 ${className.includes("center") ? "text-center" : ""}`}
      >
        {cloneLine[locale]}
      </p>
    </div>
  );
}
