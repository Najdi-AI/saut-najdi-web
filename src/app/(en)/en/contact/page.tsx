import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata = metaFor("en", "contact");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="contact" />
      <ContactPage locale="en" />
    </>
  );
}
