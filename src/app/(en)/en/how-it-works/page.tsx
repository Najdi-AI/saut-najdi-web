import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { HowItWorksPage } from "@/components/pages/HowItWorksPage";

export const metadata = metaFor("en", "how-it-works");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="how-it-works" />
      <HowItWorksPage locale="en" />
    </>
  );
}
