import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { legal } from "@/content/legal";

export const metadata = metaFor("ar", "privacy");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="privacy" />
      <LegalPage doc={legal.ar.privacy} />
    </>
  );
}
