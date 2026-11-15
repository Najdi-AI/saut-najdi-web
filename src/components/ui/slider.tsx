import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { PageDirection } from "@/components/ui/page-direction";
import { cn } from "@/lib/utils";

/**
 * Ink on a control-outline track; Najdi Red stays off it. On Arabic pages
 * PageDirection puts the minimum on the right and makes the arrow keys follow
 * what the eye sees (ArrowLeft raises, ArrowRight lowers). The thumb draws at
 * 20px; its ::after and the control strip are 44px for touch (the ::after
 * insets from the 16px padding box inside the 2px border: 16 + 2 × 14).
 * Focus lands on the thumb's hidden range input, so the outline keys off
 * :has().
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  dir,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [min, max];

  return (
    <PageDirection dir={dir}>
      <SliderPrimitive.Root
        className={cn("data-horizontal:w-full data-vertical:h-full", className)}
        data-slot="slider"
        defaultValue={defaultValue}
        value={value}
        min={min}
        max={max}
        dir={dir}
        thumbAlignment="edge"
        {...props}
      >
        <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-horizontal:min-h-11 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:min-w-11 data-vertical:flex-col">
          <SliderPrimitive.Track
            data-slot="slider-track"
            className="relative grow overflow-hidden rounded-full bg-input select-none data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5"
          >
            <SliderPrimitive.Indicator
              data-slot="slider-range"
              className="bg-foreground select-none data-horizontal:h-full data-vertical:w-full"
            />
          </SliderPrimitive.Track>
          {Array.from({ length: _values.length }, (_, index) => (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className="relative block size-5 shrink-0 rounded-full border-2 border-background bg-foreground select-none after:absolute after:-inset-3.5 has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-ring data-disabled:pointer-events-none"
            />
          ))}
        </SliderPrimitive.Control>
      </SliderPrimitive.Root>
    </PageDirection>
  );
}

export { Slider };
