import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HumanHandoffPage } from "@/components/pages/HumanHandoffPage";

export const metadata = metaFor("ar", "product/human-handoff");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="product/human-handoff" />
      <HumanHandoffPage locale="ar" />
    </>
  );
}
