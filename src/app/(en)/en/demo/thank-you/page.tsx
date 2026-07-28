import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { ThankYouPage } from "@/components/pages/ThankYouPage";

export const metadata = metaFor("en", "demo/thank-you", { noindex: true });

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="demo/thank-you" />
      <ThankYouPage locale="en" />
    </>
  );
}
