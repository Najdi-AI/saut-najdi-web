import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { SecurityPage } from "@/components/pages/SecurityPage";
import { VaultFigure } from "@/components/anatomy/vault";

export const metadata = metaFor("en", "security");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="security" />
      <SecurityPage locale="en" figure={<VaultFigure locale="en" fig={1} ground="navy" />} />
    </>
  );
}
