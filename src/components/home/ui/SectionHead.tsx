import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A home section's heading, the mockups' `.h2`: Thmanyah Serif Display at
 * 500, 32px on a phone up to 56px, with an optional lead line under it.
 * The id is for the section's aria-labelledby.
 */
export function SectionHead({
  id,
  title,
  lead,
  className,
}: {
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3.5", className)}>
      <h2 id={id} className="font-display text-[clamp(2rem,3.9vw,3.5rem)] leading-[1.25] font-medium">
        {title}
      </h2>
      {lead && <p className="max-w-[52ch] text-xl leading-[1.7] text-muted-foreground">{lead}</p>}
    </div>
  );
}
