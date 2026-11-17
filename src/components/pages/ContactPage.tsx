"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import {
  SUPPORT_EMAIL,
  CAL_LINK_QUICK,
  SELLER_NAME,
  SELLER_NAME_AR,
  SELLER_CR,
  SELLER_ADDRESS_AR,
  SELLER_ADDRESS_EN,
  BILLING_EMAIL,
  VAT_NUMBER,
} from "@/lib/site";
import { CalButton } from "@/components/CalButton";
import { DemoCta } from "@/components/DemoCta";
import { Reveal } from "@/components/Reveal";
import { PageHero } from "@/components/page/PageHero";
import { Section } from "@/components/page/Section";

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
 *
 * On the inner-page kit (About is the pilot): PageHero, the form as a flat
 * panel beside the two channels, the company details, then each question
 * with its answer as a ruled row. This module is a client component (the
 * form's state), so the kit pieces ship in /contact's own bundle only.
 */

/** About's ruled row (PR 11's local Row): the question on the start side, its answer beside it. */
function Row({ title, delay = 0, children }: { title: string; delay?: number; children: ReactNode }) {
  return (
    <Reveal delay={delay} className="grid gap-4 border-b border-line py-10 sm:py-12 lg:grid-cols-12 lg:gap-6">
      <h2 className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium text-balance lg:col-span-5">
        {title}
      </h2>
      <div className="max-w-[60ch] space-y-4 text-[1.0625rem] leading-[1.7] sm:text-[1.125rem] lg:col-span-7">
        {children}
      </div>
    </Reveal>
  );
}

/** The underlined link of the inner pages (About, PR 11). */
const link = "font-bold underline decoration-2 underline-offset-[0.35em] hover:decoration-najdi-red";

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
    companyHeading: "بيانات الشركة",
    sellerLabel: "الاسم المسجل",
    crLabel: "السجل التجاري",
    vatLabel: "الرقم الضريبي",
    addressLabel: "العنوان الوطني",
    billingLabel: "استفسارات الفوترة",
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
    companyHeading: "Company details",
    sellerLabel: "Registered seller",
    crLabel: "Commercial Registration",
    vatLabel: "VAT number",
    addressLabel: "National address",
    billingLabel: "Billing enquiries",
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

  // Square, as NewsletterSignup's field: white on the panel, a muted-ink edge (5.57:1 on Silver Gray), and the
  // site's focus outline (the old border-only focus hid the outline).
  const field =
    "w-full rounded-none border border-muted-foreground bg-white px-4 py-3 text-body-lg text-ink placeholder:text-muted-foreground";
  const label = "mb-1.5 block text-body font-medium text-muted-foreground";

  return (
    <>
      <PageHero title={s.h1} lead={s.lead}>
        <p className="max-w-[52ch] text-body-lg text-muted-foreground">{s.onboardNote}</p>
      </PageHero>

      <Section>
        <div className="grid gap-2 lg:grid-cols-12">
          <form
            className="space-y-4 bg-silver-gray p-6 sm:p-8 lg:col-span-7"
            onSubmit={(e) => {
              e.preventDefault();
              mailto();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={label}>{s.name}</span>
                <input required className={field} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label className="block">
                <span className={label}>{s.email}</span>
                <input required type="email" dir="ltr" className={field} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
            </div>
            <label className="block">
              <span className={label}>{s.subject}</span>
              <input className={field} value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </label>
            <label className="block">
              <span className={label}>{s.message}</span>
              <textarea required rows={5} className={field} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </label>
            <button type="submit" className="btn-primary w-full">{s.send}</button>
            <p className="text-body text-muted-foreground">{s.formNote}</p>
          </form>

          <div className="grid content-start gap-2 lg:col-span-5">
            <div className="border border-line p-6 sm:p-8">
              <h2 className="text-[1.25rem] leading-[1.3] font-bold">{s.emailHeading}</h2>
              <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className={`mt-1 inline-flex min-h-12 items-center text-body-lg ${link}`}>
                {SUPPORT_EMAIL}
              </a>
            </div>
            <div className="border border-line p-6 sm:p-8">
              <p className="text-body-lg text-muted-foreground">{s.or}</p>
              <div className="mt-3">
                <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="secondary" className="w-full">
                  {s.quick}
                </CalButton>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-2 bg-silver-gray p-6 sm:p-8" aria-label={s.companyHeading}>
          <h2 className="font-display text-[clamp(24px,2.4vw,34px)] leading-[1.35] font-medium">{s.companyHeading}</h2>
          <dl className="mt-6 grid gap-x-6 gap-y-5 sm:grid-cols-2">
            <div>
              <dt className="text-body text-muted-foreground">{s.sellerLabel}</dt>
              <dd className="mt-1 text-body-lg">{locale === "ar" ? SELLER_NAME_AR : SELLER_NAME}</dd>
            </div>
            <div>
              <dt className="text-body text-muted-foreground">{s.crLabel}</dt>
              <dd className="mt-1 text-body-lg" dir="ltr">{SELLER_CR}</dd>
            </div>
            <div>
              <dt className="text-body text-muted-foreground">{s.vatLabel}</dt>
              <dd className="mt-1 text-body-lg" dir="ltr">{VAT_NUMBER}</dd>
            </div>
            <div>
              <dt className="text-body text-muted-foreground">{s.billingLabel}</dt>
              <dd className="text-body-lg">
                <a href={`mailto:${BILLING_EMAIL}`} dir="ltr" className={`inline-flex min-h-12 items-center ${link}`}>{BILLING_EMAIL}</a>
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-body text-muted-foreground">{s.addressLabel}</dt>
              <dd className="mt-1 text-body-lg">
                <address className="not-italic">{locale === "ar" ? SELLER_ADDRESS_AR : SELLER_ADDRESS_EN}</address>
              </dd>
            </div>
          </dl>
        </section>
      </Section>

      <Section className="pb-[clamp(96px,11.2vw,168px)]">
        <div className="border-t border-line">
          {s.sections.map((sec, i) => (
            <Row key={sec.h} title={sec.h} delay={i * 0.04}>
              <p>
                {sec.p.map((part, j) =>
                  typeof part === "string" ? (
                    part
                  ) : (
                    <Link key={j} href={localePath(locale, part.path)} className={link}>
                      {part.text}
                    </Link>
                  ),
                )}
              </p>
            </Row>
          ))}
        </div>
      </Section>

      <DemoCta locale={locale} />
    </>
  );
}
