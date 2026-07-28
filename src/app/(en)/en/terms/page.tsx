import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { LegalPage } from "@/components/pages/LegalPage";
import { legal } from "@/content/legal";

export const metadata = metaFor("en", "terms");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="terms" />
      <LegalPage doc={legal.en.terms} />
    </>
  );
}
