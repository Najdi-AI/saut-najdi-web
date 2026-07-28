import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { DemoPage } from "@/components/pages/DemoPage";

export const metadata = metaFor("ar", "demo");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="demo" />
      <DemoPage locale="ar" />
    </>
  );
}
