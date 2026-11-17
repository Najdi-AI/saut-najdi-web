import { Fragment, type CSSProperties, type ReactNode } from "react";

/** Latin digits (a time, a price) in an LTR island, inside a sentence of either script (house rule). */
export const withDigits = (text: string): ReactNode =>
  text.split(/(\d[\d:.,]*\d|\d)/).map((part, i) => (i % 2 ? <bdi key={i} dir="ltr">{part}</bdi> : <Fragment key={i}>{part}</Fragment>));

/**
 * A line split into its words for word-by-word motion (Arabic moves a word
 * at a time, never a letter). Each word is a span carrying its place in
 * --w; the spaces between them stay plain text, so the line still reads,
 * wraps and copies as one sentence. `shown` marks the first words as on
 * (the hero's live line); without it no word is marked.
 */
export function Words({ text, shown }: { text: string; shown?: number }) {
  return text.split(" ").map((word, i) => (
    <Fragment key={i}>
      {i > 0 && " "}
      <span data-w="" data-on={(shown !== undefined && i < shown) || undefined} style={{ "--w": i } as CSSProperties}>
        {withDigits(word)}
      </span>
    </Fragment>
  ));
}
