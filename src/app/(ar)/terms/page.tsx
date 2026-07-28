import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { legal } from "@/content/legal";

export const metadata = metaFor("ar", "terms");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="terms" />
      <LegalPage doc={legal.ar.terms} />
    </>
  );
}
