import type { ReactNode } from "react";
import s from "./page.module.css";

/**
 * The opening of every inner page: a serif H1, an optional lead, and an
 * optional row of actions, start-aligned in the site container.
 *
 * Light by default, on the page's Off-White. `tone="dark"` makes it a
 * Charcoal `.on-dark` band and marks it `data-hero="dark"`, so the header
 * takes its on-dark tone too (globals.css .hdr). That only works when the
 * hero is the first non-script child of <main>, which is where a page puts
 * it anyway.
 */
export function PageHero({
  title,
  lead,
  children,
  tone = "light",
  className = "",
}: {
  title: ReactNode;
  lead?: ReactNode;
  /** Actions or a meta line under the lead. */
  children?: ReactNode;
  tone?: "light" | "dark";
  /** Bottom room when the page ends on its hero, for example. */
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <section
      className={`${dark ? `on-dark ${s.hero} ${s.band}` : s.hero} ${className}`}
      data-hero={dark ? "dark" : undefined}
    >
      <div className="container">
        <h1 className={`${s.title} wrap-anywhere`}>{title}</h1>
        {lead ? <p className={s.lead}>{lead}</p> : null}
        {children ? <div className={s.actions}>{children}</div> : null}
      </div>
    </section>
  );
}
