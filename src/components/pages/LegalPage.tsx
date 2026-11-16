import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { PageHero } from "@/components/page/PageHero";
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
      <PageHero title={doc.title} lead={linkedContact(doc.intro)}>
        <p className="text-body text-muted-foreground">{doc.updated}</p>
      </PageHero>
      <section className="container pt-12 pb-[clamp(96px,11.2vw,168px)] sm:pt-16">
        <div className="max-w-3xl border-t border-line">
          {doc.sections.map((s) => (
            <section key={s.h} className="border-b border-line py-8">
              <h2 className="font-display text-[1.625rem] leading-[1.35] font-medium">{s.h}</h2>
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
