import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HomePage } from "@/components/pages/HomePage";

export const metadata = metaFor("en", "home");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="home" />
      <HomePage locale="en" />
    </>
  );
}
