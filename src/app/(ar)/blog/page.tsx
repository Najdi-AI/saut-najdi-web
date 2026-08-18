import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { BlogIndexPage } from "@/components/pages/BlogIndexPage";

export const metadata = metaFor("ar", "blog");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="ar" kind="blog" />
      <BlogIndexPage locale="ar" />
    </>
  );
}
