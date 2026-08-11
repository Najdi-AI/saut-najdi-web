import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * "Book a demo" — a link to /demo, not a Cal modal.
 *
 * Every one of these used to pop the Cal overlay in place. They now land on
 * /demo, where the same booking desk sits inline. Three reasons that is
 * better: the destination is a real, crawlable, linkable page rather than a
 * modal that exists only after a click; the page answers the questions people
 * hesitate over (price, who to bring, what they leave with) alongside the
 * calendar instead of dropping them straight into a date grid; and a link
 * survives middle-click, right-click and share, which a button never did.
 *
 * The 15-minute quick call keeps its modal — there is no page for it, and
 * sending someone from one booker to another booker is worse than opening it
 * where they stand.
 */
export function DemoLink({
  locale,
  children,
  variant = "primary",
  className = "",
}: {
  locale: Locale;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "spectrum";
  className?: string;
}) {
  const base =
    variant === "primary"
      ? "btn-primary"
      : variant === "secondary"
        ? "btn-secondary"
        : "btn-spectrum";
  return (
    <Link href={localePath(locale, "demo")} className={`${base} ${className}`}>
      {children}
    </Link>
  );
}
