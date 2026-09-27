import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { BILLING_EMAIL, SUPPORT_EMAIL } from "@/lib/site";

function linkedContact(text: string) {
  return text.split(/(ai@sautnajdi\.ai|billing@sautnajdi\.ai)/g).map((part, i) =>
    part === SUPPORT_EMAIL || part === BILLING_EMAIL ? (
      <a key={i} href={`mailto:${part}`} className="text-brand-blue underline underline-offset-2" dir="ltr">{part}</a>
    ) : part,
  );
}

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <section className="container py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-h1">{doc.title}</h1>
        <p className="mt-2 text-body text-ink/60">{doc.updated}</p>
        <p className="mt-6 text-body-lg leading-relaxed text-ink/80">{linkedContact(doc.intro)}</p>
        <div className="mt-8 space-y-8">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-h4">{s.h}</h2>
              {s.blocks
                ? s.blocks.map((block, i) => {
                    if (block.kind === "paragraph") {
                      return (
                        <p key={i} className="mt-3 text-body-lg leading-relaxed text-ink/75">
                          {linkedContact(block.text)}
                        </p>
                      );
                    }
                    const List = block.kind === "ordered" ? "ol" : "ul";
                    return (
                      <List key={i} className={`mt-3 list-inside space-y-2 text-body-lg leading-relaxed text-ink/75 ${block.kind === "ordered" ? "list-decimal" : "list-disc"}`}>
                        {block.items.map((item, j) => <li key={j}>{linkedContact(item)}</li>)}
                      </List>
                    );
                  })
                : s.ps?.map((p, i) => (
                    <p key={i} className="mt-3 text-body-lg leading-relaxed text-ink/75">
                      {linkedContact(p)}
                    </p>
                  ))}
              {s.links?.map((link) => (
                <p key={link.href} className="mt-3 text-body-lg">
                  <Link href={link.href} className="text-brand-blue underline underline-offset-2">{link.label}</Link>
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
