import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { SecurityPage } from "@/components/pages/SecurityPage";
import { VaultFigure } from "@/components/anatomy/vault";

export const metadata = metaFor("ar", "security");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="security" />
      <SecurityPage locale="ar" figure={<VaultFigure locale="ar" fig={1} ground="navy" />} />
    </>
  );
}
