import { metaFor, PageJsonLd } from "@/lib/pageFactory";
import { BlogIndexPage } from "@/components/pages/BlogIndexPage";

export const metadata = metaFor("en", "blog");

export default function Page() {
  return (
    <>
      <PageJsonLd locale="en" kind="blog" />
      <BlogIndexPage locale="en" />
    </>
  );
}
