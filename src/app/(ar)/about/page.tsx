import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { AboutPage } from "@/components/pages/AboutPage";

export const metadata = metaFor("ar", "about");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="about" />
      <AboutPage locale="ar" />
    </>
  );
}
