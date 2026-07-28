import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HowItWorksPage } from "@/components/pages/HowItWorksPage";

export const metadata = metaFor("ar", "how-it-works");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="how-it-works" />
      <HowItWorksPage locale="ar" />
    </>
  );
}
