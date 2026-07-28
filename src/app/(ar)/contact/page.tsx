import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { ContactPage } from "@/components/pages/ContactPage";

export const metadata = metaFor("ar", "contact");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="contact" />
      <ContactPage locale="ar" />
    </>
  );
}
