import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { AgentBuilderPage } from "@/components/pages/AgentBuilderPage";

export const metadata = metaFor("en", "product/agent-builder");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="product/agent-builder" />
      <AgentBuilderPage locale="en" />
    </>
  );
}
