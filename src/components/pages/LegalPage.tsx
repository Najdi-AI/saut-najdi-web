import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { Waveform } from "@/components/Waveform";
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
    <>
      <section className="bg-gradient-to-b from-surface to-canvas">
        <div className="container py-12 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <h1 className="text-center text-h2 sm:text-h1">{doc.title}</h1>
            <p className="mt-3 text-center text-body text-ink/60">{doc.updated}</p>
            <Waveform bars={32} maxHeight={28} animate={false} className="mt-6 opacity-70" />
            <p className="mx-auto mt-7 max-w-2xl text-body-lg leading-relaxed text-ink/80">{linkedContact(doc.intro)}</p>
          </div>
        </div>
      </section>
      <section className="container pb-16 pt-8">
        <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-surface px-5 py-2 shadow-card sm:px-8">
          {doc.sections.map((s) => (
            <section key={s.h} className="border-b border-line py-7 last:border-b-0">
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
      </section>
    </>
  );
}
