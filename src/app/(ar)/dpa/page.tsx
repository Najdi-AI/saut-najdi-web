import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { legal } from "@/content/legal";

export const metadata = metaFor("ar", "dpa");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="dpa" />
      <LegalPage doc={legal.ar.dpa} />
    </>
  );
}
