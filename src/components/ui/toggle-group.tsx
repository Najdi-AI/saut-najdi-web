"use client";

import * as React from "react";
import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { type VariantProps } from "class-variance-authority";

import { PageDirection } from "@/components/ui/page-direction";
import { toggleVariants } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }
>({
  size: "default",
  variant: "default",
  spacing: 1.5,
  orientation: "horizontal",
});

/**
 * Arrow keys move focus in visual order on Arabic pages too (PageDirection).
 * The default 6px gap is the mockups' picker gap; items wrap rather than
 * overflow a 390px screen. spacing={0} joins them into one segmented bar.
 */
function ToggleGroup({
  className,
  variant,
  size,
  spacing = 1.5,
  orientation = "horizontal",
  dir,
  children,
  ...props
}: ToggleGroupPrimitive.Props &
  VariantProps<typeof toggleVariants> & {
    spacing?: number;
    orientation?: "horizontal" | "vertical";
  }) {
  return (
    <PageDirection dir={dir}>
      <ToggleGroupPrimitive
        data-slot="toggle-group"
        data-variant={variant}
        data-size={size}
        data-spacing={spacing}
        data-orientation={orientation}
        dir={dir}
        style={{ "--gap": spacing } as React.CSSProperties}
        className={cn(
          "group/toggle-group flex w-fit flex-row flex-wrap items-center gap-[--spacing(var(--gap))] rounded-(--radius) data-vertical:flex-col data-vertical:items-stretch",
          className,
        )}
        {...props}
      >
        <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
          {children}
        </ToggleGroupContext.Provider>
      </ToggleGroupPrimitive>
    </PageDirection>
  );
}

function ToggleGroupItem({
  className,
  children,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);

  return (
    <TogglePrimitive
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      data-spacing={context.spacing}
      className={cn(
        "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pe-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:ps-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-s-(--radius) group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-(--radius) group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-e-(--radius) group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-(--radius) group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-s-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-s group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className,
      )}
      {...props}
    >
      {children}
    </TogglePrimitive>
  );
}

export { ToggleGroup, ToggleGroupItem };
