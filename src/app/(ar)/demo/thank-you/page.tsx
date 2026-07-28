import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { ThankYouPage } from "@/components/pages/ThankYouPage";

export const metadata = metaFor("ar", "demo/thank-you", { noindex: true });

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="demo/thank-you" />
      <ThankYouPage locale="ar" />
    </>
  );
}
