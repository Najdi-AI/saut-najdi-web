import type { ReactNode } from "react";

const grouped = new Intl.NumberFormat("en-US", { maximumFractionDigits: 1 });

/**
 * A figure on the home page: Latin digits in an LTR island (house rule), so
 * "12,600" or "0:08" keeps its order inside Arabic text. Pass `value` for a
 * number with thousands separators, or children for a ready-made string
 * such as a time. Tabular figures, so a counting value does not jitter.
 */
export function Num({
  value,
  children,
  className = "",
}: {
  value?: number;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <bdi dir="ltr" className={`tabular-nums ${className}`.trim()}>
      {value === undefined ? children : grouped.format(value)}
    </bdi>
  );
}
