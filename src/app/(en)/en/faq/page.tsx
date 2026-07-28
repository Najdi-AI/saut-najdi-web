import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { FaqPage } from "@/components/pages/FaqPage";

export const metadata = metaFor("en", "faq");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="faq" />
      <FaqPage locale="en" />
    </>
  );
}
