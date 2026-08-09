import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HotelsPage } from "@/components/pages/HotelsPage";

export const metadata = metaFor("en", "solutions/hotels");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="solutions/hotels" />
      <HotelsPage locale="en" />
    </>
  );
}
