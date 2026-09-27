import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { PricingPage } from "@/components/pages/PricingPage";

export const metadata = metaFor("en", "pricing");

export default function Page() {
  return <><PageJsonLd locale="en" kind="pricing" /><PricingPage locale="en" /></>;
}
