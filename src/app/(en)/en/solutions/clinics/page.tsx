import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { ClinicsPage } from "@/components/pages/ClinicsPage";

export const metadata = metaFor("en", "solutions/clinics");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="solutions/clinics" />
      <ClinicsPage locale="en" />
    </>
  );
}
