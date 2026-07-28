"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { SUPPORT_EMAIL, CAL_LINK_QUICK } from "@/lib/site";
import { CalButton } from "@/components/CalButton";

/**
 * /contact (blueprint §6.8) — «كلمنا». No phone number (telecom gate).
 * Honest form: until a mail backend is wired, the form composes a
 * pre-filled email in the visitor's own mail client (never a fake
 * submit that discards data — the old site's documented pitfall).
 */

const t = {
  ar: {
    h1: "كلمنا",
    lead: "راسلنا وبنرد عليك — أو إذا تبغى جواب أسرع، احجز مكالمة سريعة مع الفريق.",
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
  },
  en: {
    h1: "Talk to us",
    lead: "Write to us and we'll get back to you — or book a quick call with the team if you want a faster answer.",
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
    "w-full rounded-xl border border-line bg-white px-4 py-3 text-body-lg text-ink placeholder:text-ink/55 focus:border-brand-blue focus:outline-none";

  return (
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
          <div className="card">
            <h2 className="text-h5">{s.emailHeading}</h2>
            <a href={`mailto:${SUPPORT_EMAIL}`} dir="ltr" className="mt-2 block text-body-lg text-brand-blue hover:underline">
              {SUPPORT_EMAIL}
            </a>
          </div>
          <div className="card text-center">
            <p className="text-body-lg text-ink/70">{s.or}</p>
            <div className="mt-3">
              <CalButton calLink={CAL_LINK_QUICK} locale={locale} variant="secondary" className="w-full">
                {s.quick}
              </CalButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
