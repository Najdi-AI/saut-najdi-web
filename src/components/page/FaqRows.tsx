import type { FaqItem } from "@/lib/schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

/**
 * FaqAccordion's rows on the ui/ Accordion: Try 1's filled square rows, and
 * the open row turns Charcoal. Loaded only through FaqAccordion (see there
 * for why it is a separate, lazily loaded module).
 *
 * Every answer stays in the server HTML: AccordionContent keeps closed
 * panels mounted (with `hidden`), so crawlers and no-JavaScript visitors
 * still get them. `multiple` keeps each row independent, as the native
 * <details> rows were. The trigger is the whole row (76px, 64px on a phone)
 * and takes `rounded-none` so its focus outline is square like the row.
 */
export default function FaqRows({ items }: { items: FaqItem[] }) {
  return (
    <Accordion multiple className="gap-2">
      {items.map((item) => (
        <AccordionItem
          key={item.q}
          className="not-last:border-b-0 bg-silver-gray transition-colors duration-200 not-data-open:hover:bg-[#dadde3] data-open:bg-charcoal data-open:text-off-white"
        >
          <AccordionTrigger className="min-h-16 rounded-none px-5 py-4 text-[1.0625rem] font-bold hover:no-underline sm:min-h-19 sm:px-6 sm:text-[1.25rem] sm:font-medium **:data-[slot=accordion-trigger-icon]:text-current!">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="max-w-[60ch] px-5 pb-6 text-[1.0625rem] leading-[1.7] text-[#d5d9e2] sm:px-6 sm:text-[1.125rem]">
            <p>{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
