import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { RetailPage } from "@/components/pages/RetailPage";

export const metadata = metaFor("ar", "solutions/retail");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="solutions/retail" />
      <RetailPage locale="ar" />
    </>
  );
}
