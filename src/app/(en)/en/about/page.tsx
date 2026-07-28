import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata = metaFor("en", "about");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="about" />
      <AboutPage locale="en" />
    </>
  );
}
