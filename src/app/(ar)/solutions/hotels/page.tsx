import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HotelsPage } from "@/components/pages/HotelsPage";

export const metadata = metaFor("ar", "solutions/hotels");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="solutions/hotels" />
      <HotelsPage locale="ar" />
    </>
  );
}
