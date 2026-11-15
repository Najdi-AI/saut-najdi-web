"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

/**
 * The mockups' light switch: a 48×28 track with a 22px Paper knob, Charcoal
 * when on (never Najdi Red). The track draws 28px tall and its ::after
 * stretches the hit area to 44px. The knob's travel flips under dir="rtl".
 */
function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer group/switch relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-[3px] transition-colors duration-200 ease-out after:absolute after:-inset-x-2 after:-inset-y-2 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-ring data-checked:bg-foreground data-unchecked:bg-input data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block size-[22px] rounded-full bg-card transition-transform duration-200 ease-out data-checked:translate-x-5 rtl:data-checked:-translate-x-5"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
