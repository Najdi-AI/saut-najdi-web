import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { PricingPage } from "@/components/pages/PricingPage";

export const metadata = metaFor("ar", "pricing");

export default function Page() {
  return <><PageJsonLd locale="ar" kind="pricing" /><PricingPage locale="ar" /></>;
}
