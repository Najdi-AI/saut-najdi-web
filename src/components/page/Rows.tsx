import type { ReactNode } from "react";
import { Reveal } from "@/components/Reveal";

/**
 * The About pilot's ruled rows: a heading on the start side and its text
 * beside it from 1024px, stacked below that. `Rows` draws the rule above the
 * first row; each `Row` draws its own below.
 *
 * `level` sets the heading element. A level 3 row (a step or an item under a
 * section's H2) takes a smaller title, so the outline reads in the type too.
 */
export function Rows({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border-t border-line ${className}`}>{children}</div>;
}

export function Row({
  title,
  level = 2,
  delay = 0,
  children,
}: {
  title: ReactNode;
  level?: 2 | 3;
  delay?: number;
  children: ReactNode;
}) {
  const H = level === 3 ? "h3" : "h2";
  const size = level === 3 ? "text-[clamp(20px,1.8vw,26px)] leading-[1.4]" : "text-[clamp(24px,2.4vw,34px)] leading-[1.35]";
  return (
    <Reveal delay={delay} className="grid gap-4 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-6">
      <H className={`font-display font-medium text-balance lg:col-span-5 ${size}`}>{title}</H>
      <div className="max-w-[60ch] space-y-4 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:col-span-7">
        {children}
      </div>
    </Reveal>
  );
}
