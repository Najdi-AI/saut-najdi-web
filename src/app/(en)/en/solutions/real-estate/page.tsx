import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { RealEstatePage } from "@/components/pages/RealEstatePage";

export const metadata = metaFor("en", "solutions/real-estate");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="solutions/real-estate" />
      <RealEstatePage locale="en" />
    </>
  );
}
