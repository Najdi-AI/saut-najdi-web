import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { SecurityPage } from "@/components/pages/SecurityPage";

export const metadata = metaFor("ar", "security");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="security" />
      <SecurityPage locale="ar" />
    </>
  );
}
