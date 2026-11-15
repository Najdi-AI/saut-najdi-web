import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The mockups' one button shape: flat, no resting shadow, Najdi Red on the
 * primary variant only (every other variant is ink on Off-White or Silver).
 * Corners read the single --radius token, so a section that sets
 * `--radius: 0` squares every primitive at once (marketing panels are square,
 * product fragments keep 10px). Keyboard focus is a 3px --ring outline.
 *
 * Non-link actions only: a link that looks like a button stays DemoLink.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2.5 rounded-(--radius) border border-transparent font-bold whitespace-nowrap transition-[background-color,border-color,color,scale] duration-150 ease-out select-none focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring active:not-aria-[haspopup]:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // White on Najdi Red is 4.39:1: AA for bold type at 18.66px or
        // more, which this variant keeps at every size (see compoundVariants).
        default: "bg-primary text-primary-foreground hover:bg-najdi-red-press active:bg-najdi-red-press",
        outline: "border-input bg-card text-foreground hover:border-foreground aria-expanded:border-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]",
        ghost: "text-foreground hover:bg-muted aria-expanded:bg-muted",
        link: "text-foreground underline decoration-2 underline-offset-[0.35em]",
      },
      size: {
        // The mockups' .btn: 52px tall (46px on a phone), 20px bold.
        default:
          "min-h-13 px-7 text-[1.25rem] leading-none max-sm:min-h-11.5 max-sm:px-4.5 has-data-[icon=inline-end]:pe-6 has-data-[icon=inline-start]:ps-6",
        // Controls inside product fragments: the 44px tap target, 15px type.
        sm: "min-h-11 gap-1.5 px-3.5 text-[0.9375rem] has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        icon: "size-11",
      },
    },
    compoundVariants: [{ variant: "default", size: "sm", className: "text-[1.1875rem]" }],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
