import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { refundPolicy } from "@/content/refund";

export const metadata = metaFor("en", "refund-policy");

export default function Page() {
  return <><PageJsonLd locale="en" kind="refund-policy" /><LegalPage doc={refundPolicy.en} /></>;
}
