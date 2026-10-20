import type { FaqItem } from "@/lib/schema";

/**
 * FAQ accordion (blueprint §4.3) — native <details>/<summary>, so every
 * answer is in the server HTML and works with zero JavaScript. Feeds
 * FAQPage schema via the page's JSON-LD (built from the same items).
 *
 * The padding lives on the <summary>, not the <details>, so the whole row is
 * the tap target (56px tall for a one-line question) rather than the 24px
 * line of text inside it.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line rounded-2xl border border-line bg-surface shadow-card">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 text-body-lg font-bold text-ink [&::-webkit-details-marker]:hidden">
            {item.q}
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              aria-hidden
              className="shrink-0 text-brand-blue transition-transform duration-300 group-open:rotate-45"
            >
              <path d="M9 3v12M3 9h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </summary>
          <p className="-mt-1 px-6 pb-4 text-body-lg leading-relaxed text-ink/75">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
