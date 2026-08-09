import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { VoiceAgentPage } from "@/components/pages/VoiceAgentPage";

export const metadata = metaFor("en", "product/voice-agent");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="product/voice-agent" />
      <VoiceAgentPage locale="en" />
    </>
  );
}
