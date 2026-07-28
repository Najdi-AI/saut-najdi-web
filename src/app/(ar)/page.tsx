import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HomePage } from "@/components/pages/HomePage";

export const metadata = metaFor("ar", "home");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="home" />
      <HomePage locale="ar" />
    </>
  );
}
