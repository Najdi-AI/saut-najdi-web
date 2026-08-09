import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { AgentBuilderPage } from "@/components/pages/AgentBuilderPage";

export const metadata = metaFor("ar", "product/agent-builder");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="product/agent-builder" />
      <AgentBuilderPage locale="ar" />
    </>
  );
}
