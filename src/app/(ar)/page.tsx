import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { Home } from "@/components/home/Home";

export const metadata = metaFor("ar", "home");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="home" />
      <Home locale="ar" />
    </>
  );
}
