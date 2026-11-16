import type { ReactNode } from "react";
import s from "./page.module.css";

/**
 * One inner-page section on the home's rhythm: an optional serif H2 and
 * lead, then the content.
 *
 * - `layout="split"`: from 1024px the head takes the start four columns and
 *   stays in view beside the content (Try 3's FAQ); stacked below that.
 * - `tone="dark"`: a Charcoal `.on-dark` band with room above and inside it.
 *   ui/ primitives and DemoLink read right inside; legacy utilities such as
 *   text-ink or btn-secondary don't follow the band.
 *
 * Light sections pad only their top, as on the home, so a page's last light
 * section passes its own bottom padding in `className`.
 */
export function Section({
  id,
  title,
  lead,
  layout = "stack",
  tone = "light",
  className = "",
  children,
}: {
  id?: string;
  title?: ReactNode;
  lead?: ReactNode;
  layout?: "stack" | "split";
  tone?: "light" | "dark";
  className?: string;
  children: ReactNode;
}) {
  const tones = tone === "dark" ? `on-dark ${s.band}` : s.section;
  const head = title ? (
    <div className={s.head}>
      <h2 className={s.h2}>{title}</h2>
      {lead ? <p>{lead}</p> : null}
    </div>
  ) : null;
  return (
    <section id={id} className={`${tones} ${className}`}>
      <div className={`container ${layout === "split" ? s.split : ""}`}>
        {head}
        <div className={s.body}>{children}</div>
      </div>
    </section>
  );
}
