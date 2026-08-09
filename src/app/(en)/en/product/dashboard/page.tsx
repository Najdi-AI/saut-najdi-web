import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { DashboardPage } from "@/components/pages/DashboardPage";

export const metadata = metaFor("en", "product/dashboard");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="product/dashboard" />
      <DashboardPage locale="en" />
    </>
  );
}
