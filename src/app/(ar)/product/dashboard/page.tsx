import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { DashboardPage } from "@/components/pages/DashboardPage";

export const metadata = metaFor("ar", "product/dashboard");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="product/dashboard" />
      <DashboardPage locale="ar" />
    </>
  );
}
