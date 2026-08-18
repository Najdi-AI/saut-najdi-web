import type { Block } from "@/content/blog";

/**
 * Body blocks <-> editable plain text, for the admin editor.
 *
 * A block-structured WYSIWYG editor would be the single largest piece of UI in
 * the admin, need client JS, and still fight RTL text. A textarea with a
 * four-rule convention needs none of that and survives copy-paste from
 * anywhere:
 *
 *   ## Heading            → h2
 *   - item                → ul (consecutive lines group)
 *   1. item               → ol (any leading digits + dot)
 *   > caveat              → note
 *   anything else         → p, split on blank lines
 *
 * blocksToText(textToBlocks(x)) is stable for text the editor produced, which
 * is what makes repeated edit round-trips safe.
 */
/** Accepts the strict Block union AND the looser draft-store block shape. */
type LooseBlock = { t: string; text?: string; items?: string[] };

export function blocksToText(body: LooseBlock[]): string {
  return body
    .map((b) => {
      switch (b.t) {
        case "h2":
          return `## ${b.text ?? ""}`;
        case "note":
          return `> ${b.text ?? ""}`;
        case "ul":
          return (b.items ?? []).map((i) => `- ${i}`).join("\n");
        case "ol":
          return (b.items ?? []).map((i, n) => `${n + 1}. ${i}`).join("\n");
        default:
          return b.text ?? "";
      }
    })
    .join("\n\n");
}

export function textToBlocks(text: string): Block[] {
  const out: Block[] = [];
  // Normalise line endings; split into chunks on blank lines.
  const chunks = text.replace(/\r\n/g, "\n").split(/\n{2,}/);
  for (const chunk of chunks) {
    const lines = chunk.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    // A chunk of list lines becomes one list; mixed chunks fall through to
    // line-by-line handling so nothing is silently dropped.
    const allUl = lines.every((l) => l.startsWith("- "));
    const allOl = lines.every((l) => /^\d+\.\s/.test(l));
    if (allUl) {
      out.push({ t: "ul", items: lines.map((l) => l.slice(2).trim()) });
      continue;
    }
    if (allOl) {
      out.push({ t: "ol", items: lines.map((l) => l.replace(/^\d+\.\s*/, "")) });
      continue;
    }

    for (const line of lines) {
      if (line.startsWith("## ")) out.push({ t: "h2", text: line.slice(3).trim() });
      else if (line.startsWith("> ")) out.push({ t: "note", text: line.slice(2).trim() });
      else if (line.startsWith("- ")) out.push({ t: "ul", items: [line.slice(2).trim()] });
      else if (/^\d+\.\s/.test(line)) out.push({ t: "ol", items: [line.replace(/^\d+\.\s*/, "")] });
      else {
        // Consecutive plain lines inside one chunk join into one paragraph —
        // that is how prose pasted with manual line-wrapping should behave.
        const prev = out[out.length - 1];
        if (prev && prev.t === "p") prev.text = `${prev.text} ${line}`;
        else out.push({ t: "p", text: line });
      }
    }
  }
  return out;
}
