"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Pressed is Charcoal with Off-White bold type in both variants, as in the
 * mockups. Never Najdi Red: that is the primary Button's alone. Every size
 * keeps the 44px tap target.
 */
const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 border border-transparent font-medium whitespace-nowrap transition-[background-color,border-color,color,scale] duration-150 ease-out focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring active:scale-[0.96] disabled:pointer-events-none disabled:opacity-50 aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:font-bold aria-pressed:text-background [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The flip picker (.pick) and channel tiles (.ch): a square Silver tile.
        default:
          "rounded-none bg-secondary text-secondary-foreground hover:not-aria-pressed:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        // The scenario buttons (.scen): Paper with the control outline and
        // the --radius corners of product controls.
        outline: "rounded-(--radius) border-input bg-card text-foreground hover:not-aria-pressed:border-foreground",
      },
      size: {
        default:
          "min-h-11 min-w-11 px-4 text-[0.9375rem] has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        sm: "min-h-11 min-w-11 px-3 text-sm has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
