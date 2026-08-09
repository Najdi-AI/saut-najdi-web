import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { VoiceAgentPage } from "@/components/pages/VoiceAgentPage";

export const metadata = metaFor("ar", "product/voice-agent");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="product/voice-agent" />
      <VoiceAgentPage locale="ar" />
    </>
  );
}
