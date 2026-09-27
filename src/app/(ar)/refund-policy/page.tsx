import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { refundPolicy } from "@/content/refund";

export const metadata = metaFor("ar", "refund-policy");

export default function Page() {
  return <><PageJsonLd locale="ar" kind="refund-policy" /><LegalPage doc={refundPolicy.ar} /></>;
}
