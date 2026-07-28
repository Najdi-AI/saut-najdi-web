import type { LegalDoc } from "@/content/legal";

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <section className="container py-14">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-h1">{doc.title}</h1>
        <p className="mt-2 text-body text-ink/60">{doc.updated}</p>
        <p className="mt-6 text-body-lg leading-relaxed text-ink/80">{doc.intro}</p>
        <div className="mt-8 space-y-8">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-h4">{s.h}</h2>
              {s.ps.map((p, i) => (
                <p key={i} className="mt-3 text-body-lg leading-relaxed text-ink/75">
                  {p}
                </p>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
