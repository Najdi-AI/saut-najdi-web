"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { SUPPORT_EMAIL, CAL_LINK_QUICK } from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { DemoCta } from "@/components/DemoCta";
import { Reveal } from "@/components/Reveal";
import { IconChip } from "@/components/icons";

/**
 * /contact (blueprint §6.8) — «كلمنا». No phone number (telecom gate).
 * Honest form: until a mail backend is wired, the form composes a
 * pre-filled email in the visitor's own mail client (never a fake
 * submit that discards data — the old site's documented pitfall).
 *
 * The prose below the form answers what a contact form can't: which
 * channel is fastest, why there's no number, where the compliance
 * answers live, and what «ما في تسجيل ذاتي» actually means — the four
 * questions people otherwise send an email to ask.
 */

/**
 * Section bodies are part arrays, not plain strings, so a sentence can
 * carry an in-prose link without splitting the paragraph in the markup.
 */
type Part = string | { text: string; path: string };
type Section = { h: string; p: Part[] };

const t = {
  ar: {
    h1: "كلمنا",
    lead: "راسلنا وبنرد عليك — أو احجز مكالمة سريعة إذا تبغى جواب أسرع.",
    onboardNote: "ما في تسجيل ذاتي — فريقنا يجهز لك كل شي، من الوكيل إلى قاعدة المعرفة.",
    name: "الاسم",
    email: "الإيميل",
    subject: "الموضوع",
    message: "رسالتك",
    send: "أرسل عبر بريدك",
    formNote: "الزر يفتح تطبيق البريد عندك برسالة جاهزة — ما نستقبل بياناتك في الموقع.",
    or: "أو",
    quick: "احجز مكالمة 15 دقيقة",
    emailHeading: "الإيميل",
    sections: [
      {
        h: "وش أسرع طريقة توصل لنا؟",
        p: [
          "احجز مكالمة 15 دقيقة وتكلم أحد من الفريق مباشرة. وإذا سؤالك فيه تفاصيل أو ملفات، راسلنا على الإيميل — اللي يرد عليك شخص قرأ رسالتك.",
        ],
      },
      {
        h: "ليش ما فيه رقم تواصل في الصفحة؟",
        p: [
          "ما عندنا رقم سعودي مفعّل للحين — تفعيل الأرقام يمر بإجراءات الجهات التنظيمية، وما نحب نحط رقماً ما يرد عليه أحد. لين ما يجهز، الإيميل والتقويم هما القناتان الرسميتان.",
        ],
      },
      {
        h: "تبغى تسأل عن الأمان والبيانات؟",
        p: [
          "أسئلة التخزين والمعالجة ونظام حماية البيانات الشخصية (PDPL) مجاوبة في ",
          { text: "صفحة الأمان والبيانات", path: "security" },
          "، وفيه ملخص ",
          { text: "اتفاقية معالجة البيانات", path: "dpa" },
          " جاهز لفريق المشتريات. تبغى النسخة الكاملة أو استبياناً أمنياً؟ راسلنا.",
        ],
      },
      {
        h: "«ما في تسجيل ذاتي» — وش يعني بالضبط؟",
        p: [
          "يعني ما فيه زر «سجّل الآن» يرميك في نظام فاضي. فريقنا يجهز لك الوكيل وقاعدة المعرفة وقواعد التصعيد قبل أول مكالمة.",
        ],
      },
    ] as Section[],
  },
  en: {
    h1: "Talk to us",
    lead: "Write to us and we'll get back to you — or book a quick call for a faster answer.",
    onboardNote: "There's no self-signup — our team sets everything up for you, from the agent to the knowledge base.",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Your message",
    send: "Send via your mail app",
    formNote: "The button opens your mail app with the message ready — the site itself doesn't collect your data.",
    or: "or",
    quick: "Book a 15-minute call",
    emailHeading: "Email",
    sections: [
      {
        h: "What's the fastest way to reach us?",
        p: [
          "Book the 15-minute call and talk to someone on the team directly. If your question is detailed or comes with files, email us — whoever replies has read your message, and it isn't a canned response.",
        ],
      },
      {
        h: "Why is there no phone number on this page?",
        p: [
          "We don't have a live Saudi number yet — activation runs through Saudi telecom regulatory steps, and we'd rather publish nothing than a number nobody answers. Until then, email and the calendar are the two official channels.",
        ],
      },
      {
        h: "Want to ask about security and data?",
        p: [
          "Storage, processing and Personal Data Protection Law (PDPL) questions are answered on ",
          { text: "the security and data page", path: "security" },
          ", and a summary ",
          { text: "data processing agreement", path: "dpa" },
          " is published for procurement. Need the full agreement or a security questionnaire completed? Email us.",
        ],
      },
      {
        h: "“No self-signup” — what does that actually mean?",
        p: [
          "There's no “sign up now” button that drops you into an empty system. Our team builds the agent, the knowledge base and the escalation rules with you, so the first call the agent answers is answered correctly.",
        ],
      },
    ] as Section[],
  },
} as const;

export function ContactPage({ locale }: { locale: Locale }) {
  const s = t[locale];
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const mailto = () => {
    const body = `${form.message}\n\n— ${form.name} (${form.email})`;
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      form.subject || (locale === "ar" ? "استفسار من الموقع" : "Website enquiry"),
    )}&body=${encodeURIComponent(body)}`;
  };

  const field =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-body-lg text-ink placeholder:text-ink/55 focus:border-brand-blue focus:outline-none";

  return (
    <>
      <section className="container py-14">
        <div className="text-center">
          <h1 className="text-h1">{s.h1}</h1>
          <p className="mx-auto mt-4 max-w-xl text-body-lg leading-relaxed text-ink/70">{s.lead}</p>
          <p className="mx-auto mt-2 max-w-xl text-body text-ink/60">{s.onboardNote}</p>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-8 md:grid-cols-[1.4fr_1fr]">
          <form
            className="card space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              mailto();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-body font-medium text-ink/70">{s.name}</span>
                <input required className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-body font-medium text-ink/70">{s.email}</span>
                <input required type="email" dir="ltr" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-body font-medium text-ink/70">{s.subject}</span>
              <input className={field} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-body font-medium text-ink/70">{s.message}</span>
              <textarea required rows={5} className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
            <button type="submit" className="btn-primary w-full">{s.send}</button>
            <p className="text-center text-body-sm text-ink/60">{s.formNote}</p>
          </form>

          <div className="space-y-4">
            <div className="card group">
              <IconChip name="mail" />
              <h2 className="mt-3 text-h5">{s.emailHeading}</h2>
              <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="mt-2 block text-body-lg text-brand-blue hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </div>
            <div className="card group text-center">
              <div className="flex justify-center">
                <IconChip name="phone" delay={0.15} />
              </div>
              <p className="mt-3 text-body-lg text-ink/70">{s.or}</p>
              <div className="mt-3">
                <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="secondary" className="w-full">
                  {s.quick}
                </CalButton>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl space-y-6">
          {s.sections.map((sec, i) => (
            <Reveal key={sec.h} delay={i * 0.04}>
              <article className="card">
                <h2 className="text-h4">{sec.h}</h2>
                <p className="mt-3 text-body-lg leading-relaxed text-ink/80">
                  {sec.p.map((part, j) =>
                    typeof part === "string" ? (
                      part
                    ) : (
                      <Link key={j} href={localePath(locale, part.path)} className="text-brand-blue hover:underline">
                        {part.text}
                      </Link>
                    ),
                  )}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <DemoCta locale={locale} />
    </>
  );
}
