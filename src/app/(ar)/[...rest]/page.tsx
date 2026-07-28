import { notFound } from "next/navigation";

/** Unknown Arabic-tree URLs return a real 404 (blueprint §8.5). */
export default function CatchAll() {
  notFound();
}
