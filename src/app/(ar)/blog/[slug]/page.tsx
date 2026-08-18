import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostJsonLd, blogPostMeta } from "@/lib/pageFactory";
import { BlogPostPage } from "@/components/pages/BlogPostPage";
import { posts } from "@/content/blog";
import { getPost } from "@/lib/allPosts";

/**
 * Code posts prerender; pipeline-published posts live in Blob and render on
 * demand (dynamicParams = true), cached for an hour. An unknown slug still
 * ends in a hard notFound() below, so /blog/anything stays a real 404 rather
 * than the soft-200 crawl trap this file used to guard against with
 * dynamicParams = false.
 */
export const dynamicParams = true;
export const revalidate = 3600;

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
  return post ? blogPostMeta("ar", post) : {};
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  return (
    <>
      <BlogPostJsonLd locale="ar" post={post} />
      <BlogPostPage locale="ar" post={post} />
    </>
  );
}
