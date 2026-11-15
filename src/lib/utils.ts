import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge only knows Tailwind's default scale names, and reads any
 * other `text-*`, `shadow-*` or `bg-*` as a colour. Unregistered, this
 * site's @theme names lose to the next colour class: cn("text-body-lg",
 * "text-ink") would drop the size. Keep these lists in step with the @theme
 * blocks and the @utility names in globals.css; scripts/check-cn.mjs
 * asserts the cases that matter.
 */
const twMerge = extendTailwindMerge<"text-gradient">({
  extend: {
    theme: {
      text: ["h1", "h2", "h3", "h4", "h5", "body-lg", "body", "body-sm"],
      shadow: ["card", "card-hover"],
      animate: ["wave-bar", "fade-rise"],
    },
    classGroups: {
      // Flat since the rebrand (@utility in globals.css), but still kept
      // apart from the bg and text colours so existing pairs survive cn().
      "bg-image": [{ bg: ["brand-gradient", "brand-gradient-soft"] }],
      "text-gradient": ["text-gradient"],
    },
  },
});

/** Class-name join for shadcn/ui components: clsx, then Tailwind conflict merge. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
