import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { ClinicsPage } from "@/components/pages/ClinicsPage";

export const metadata = metaFor("ar", "solutions/clinics");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="solutions/clinics" />
      <ClinicsPage locale="ar" />
    </>
  );
}
