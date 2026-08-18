import { SOCIAL } from "@/content/social";

/**
 * The footer's social row. Data comes from content/social.ts, which is the
 * same array lib/schema.ts turns into Organization `sameAs` — so what a
 * visitor can click and what the knowledge graph claims are the same set by
 * construction.
 *
 * Each link is a 44×44 hit area around a 20px mark. That is the floor from the
 * responsiveness pass, and icon-only controls are exactly where it gets missed
 * — the glyph looks like the target, so the padding is what has to carry it.
 *
 * `rel="me"` is the half of the identity handshake this side of the link can
 * assert: it declares the profile as another endpoint of the same entity, and
 * it is what `sameAs` echoes in the structured data. `noopener` because every
 * one of these opens a new tab.
 */
export function SocialLinks({ heading }: { heading: string }) {
  return (
    <div>
      <p className="text-h5 text-ink">{heading}</p>
      {/* -ms-2.5 pulls the first icon's padding back so the row optically
          aligns with the column heading above it instead of sitting indented
          by its own hit area. Logical property — correct in RTL and LTR. */}
      <ul className="-ms-2.5 mt-2 flex flex-wrap items-center">
        {SOCIAL.map((s) => (
          <li key={s.key}>
            <a
              href={s.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={s.label}
              title={s.label}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-ink/60 transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d={s.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
