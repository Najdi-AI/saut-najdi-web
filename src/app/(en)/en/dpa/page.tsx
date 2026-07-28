import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { legal } from "@/content/legal";

export const metadata = metaFor("en", "dpa");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="dpa" />
      <LegalPage doc={legal.en.dpa} />
    </>
  );
}
