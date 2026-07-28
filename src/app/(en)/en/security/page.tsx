import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { SecurityPage } from "@/components/pages/SecurityPage";

export const metadata = metaFor("en", "security");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="security" />
      <SecurityPage locale="en" />
    </>
  );
}
