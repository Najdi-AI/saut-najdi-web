import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostJsonLd, blogPostMeta } from "@/lib/pageFactory";
import { BlogPostPage } from "@/components/pages/BlogPostPage";
import { posts } from "@/content/blog";
import { getPost } from "@/lib/allPosts";

/** See the Arabic route for why dynamicParams is off. */
export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return post ? blogPostMeta("en", post) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <>
      <BlogPostJsonLd locale="en" post={post} />
      <BlogPostPage locale="en" post={post} />
    </>
  );
}
