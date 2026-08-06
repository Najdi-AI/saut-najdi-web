import type { Metadata } from "next";
import { notFound } from "next/navigation";

/**
 * The root layout's `robots` block would otherwise be inherited here and emit
 * "index, follow" plus a googlebot directive on top of Next's own 404
 * noindex — the googlebot line wins, so a 404 would invite indexing. Override
 * both explicitly.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

/** Unknown Arabic-tree URLs return a real 404 (blueprint §8.5). */
export default function CatchAll() {
  notFound();
}
