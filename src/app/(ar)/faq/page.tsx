import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { FaqPage } from "@/components/pages/FaqPage";

export const metadata = metaFor("ar", "faq");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="faq" />
      <FaqPage locale="ar" />
    </>
  );
}
