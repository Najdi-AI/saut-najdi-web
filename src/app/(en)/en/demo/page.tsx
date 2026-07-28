import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { DemoPage } from "@/components/pages/DemoPage";

export const metadata = metaFor("en", "demo");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="demo" />
      <DemoPage locale="en" />
    </>
  );
}
