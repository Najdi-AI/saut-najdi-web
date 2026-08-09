import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { KnowledgeBasePage } from "@/components/pages/KnowledgeBasePage";

export const metadata = metaFor("en", "product/knowledge-base");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="product/knowledge-base" />
      <KnowledgeBasePage locale="en" />
    </>
  );
}
