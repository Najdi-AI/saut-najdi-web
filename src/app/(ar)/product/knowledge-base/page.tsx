import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { KnowledgeBasePage } from "@/components/pages/KnowledgeBasePage";
import { KbPressFigure } from "@/components/anatomy/kb-press";

export const metadata = metaFor("ar", "product/knowledge-base");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="product/knowledge-base" />
      <KnowledgeBasePage locale="ar" figure={<KbPressFigure locale="ar" fig={1} />} />
    </>
  );
}
