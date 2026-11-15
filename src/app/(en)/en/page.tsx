import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { Home } from "@/components/home/Home";

export const metadata = metaFor("en", "home");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="home" />
      <Home locale="en" />
    </>
  );
}
