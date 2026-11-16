"use client";

import dynamic from "next/dynamic";
import type { FaqItem } from "@/lib/schema";

/**
 * FAQ accordion (blueprint §4.3), rendered by page/FaqRows on the ui/
 * Accordion. Feeds FAQPage schema via the page's JSON-LD (built from the
 * same items).
 *
 * Lazy on purpose. lib/pageFactory imports the FAQ arrays from the page
 * modules, so every route that uses it pulls in every page module's client
 * components, whether the route renders them or not. A static import here
 * put the Base UI accordion (~10 kB) in the First Load JS of 50 routes;
 * through next/dynamic it is still server-rendered (every answer in the
 * prerendered HTML) but its chunk loads only where a FAQ actually renders.
 */
const FaqRows = dynamic(() => import("./page/FaqRows"));

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  return <FaqRows items={items} />;
}
