import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { KnowledgeBasePage } from "@/components/pages/KnowledgeBasePage";
import { KbPressFigure } from "@/components/anatomy/kb-press";

export const metadata = metaFor("en", "product/knowledge-base");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="product/knowledge-base" />
      <KnowledgeBasePage locale="en" figure={<KbPressFigure locale="en" fig={1} />} />
    </>
  );
}
