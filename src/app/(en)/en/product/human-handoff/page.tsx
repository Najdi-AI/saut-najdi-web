import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HumanHandoffPage } from "@/components/pages/HumanHandoffPage";

export const metadata = metaFor("en", "product/human-handoff");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="product/human-handoff" />
      <HumanHandoffPage locale="en" />
    </>
  );
}
