import { SOCIAL } from "@/content/social";
import s from "./Footer.module.css";

/**
 * The footer's social row. Data comes from content/social.ts, which is the
 * same array lib/schema.ts turns into Organization `sameAs` — so what a
 * visitor can click and what the knowledge graph claims are the same set by
 * construction.
 *
 * Each link is a 44×44 Silver Gray tile around an 18px mark (Try 3). That is
 * also the floor from the responsiveness pass, and icon-only controls are
 * exactly where it gets missed — the glyph looks like the target, so the tile
 * is what has to carry it. On a phone the row becomes a 4-column grid.
 *
 * `rel="me"` is the half of the identity handshake this side of the link can
 * assert: it declares the profile as another endpoint of the same entity, and
 * it is what `sameAs` echoes in the structured data. `noopener` because every
 * one of these opens a new tab.
 */
export function SocialLinks({ heading }: { heading: string }) {
  return (
    <div className={s.follow}>
      <p className={s.label}>{heading}</p>
      <ul className={s.social}>
        {SOCIAL.map((p) => (
          <li key={p.key}>
            <a
              href={p.url}
              target="_blank"
              rel="me noopener noreferrer"
              aria-label={p.label}
              title={p.label}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d={p.path} />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
