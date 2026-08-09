import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { RealEstatePage } from "@/components/pages/RealEstatePage";

export const metadata = metaFor("ar", "solutions/real-estate");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="solutions/real-estate" />
      <RealEstatePage locale="ar" />
    </>
  );
}
