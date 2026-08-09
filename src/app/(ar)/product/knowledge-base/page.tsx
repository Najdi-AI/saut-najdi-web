import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { KnowledgeBasePage } from "@/components/pages/KnowledgeBasePage";

export const metadata = metaFor("ar", "product/knowledge-base");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="product/knowledge-base" />
      <KnowledgeBasePage locale="ar" />
    </>
  );
}
