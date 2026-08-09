import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { RetailPage } from "@/components/pages/RetailPage";

export const metadata = metaFor("en", "solutions/retail");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="solutions/retail" />
      <RetailPage locale="en" />
    </>
  );
}
