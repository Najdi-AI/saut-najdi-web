import type { Locale } from "@/lib/i18n";

/**
 * Hero dialect chips (blueprint §6.1): the shipped catalog and nothing
 * else (§1 honesty rule). No open «+ أي لهجة» promise — /product/voice-agent
 * explicitly retracts it — and no «العربية» chip beside نجدي/حجازي/شامي,
 * which are themselves Arabic. Every chip is a shipped voice, so they all
 * carry the same style; there is no odd-one-out chip to accent.
 */
const chips = {
  ar: ["نجدي", "حجازي", "شامي", "English"],
  en: ["Najdi", "Hijazi", "Levantine", "English"],
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
