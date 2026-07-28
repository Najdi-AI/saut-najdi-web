"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

/**
 * The genuinely interactive module (blueprint §7): a sample call played
 * as chat bubbles with an escalation moment. All text is server-rendered;
 * motion only reveals it in sequence. Content is illustrative dialogue,
 * clearly presented as an example — no metrics, no real customer data.
 */

type Turn =
  | { who: "caller" | "agent"; text: string }
  | { who: "handoff"; title: string; lines: string[] }
  | { who: "human"; text: string };

const script: Record<Locale, { title: string; note: string; turns: Turn[] }> = {
  ar: {
    title: "مثال: مكالمة عيادة… وفيها لحظة تصعيد",
    note: "حوار توضيحي — هذا شكل المكالمة، مو تسجيل حقيقي.",
    turns: [
      { who: "caller", text: "السلام عليكم، أبغى أحجز موعد أسنان بكرة." },
      { who: "agent", text: "هلا وغلا! أبشر. بكرة عندنا فاضي الساعة 4:30 العصر — يناسبك؟" },
      { who: "caller", text: "يناسبني. بس عندي سؤال عن ألم بعد حشوة سويتها عندكم…" },
      {
        who: "handoff",
        title: "سؤال طبي — تصعيد فوري لموظف بشري",
        lines: ["النص الكامل للمكالمة", "ملخص: حجز 4:30 + سؤال عن ألم بعد حشوة", "تاريخ العميل عندكم"],
      },
      { who: "human", text: "معك أحمد من العيادة، قريت ملخص كلامك — خلني أطمنك على موضوع الحشوة…" },
    ],
  },
  en: {
    title: "Example: a clinic call — with an escalation moment",
    note: "Illustrative dialogue — this is what a call looks like, not a real recording.",
    turns: [
      { who: "caller", text: "Hi, I'd like to book a dental appointment for tomorrow." },
      { who: "agent", text: "Of course! Tomorrow we have 4:30 PM free — does that work?" },
      { who: "caller", text: "Works. But I have a question about pain after a filling you did…" },
      {
        who: "handoff",
        title: "Medical question — instant escalation to a human",
        lines: ["Full call transcript", "Summary: 4:30 booking + post-filling pain question", "The caller's history with you"],
      },
      { who: "human", text: "This is Ahmed from the clinic — I've read the summary. Let me put your mind at ease about that filling…" },
    ],
  },
};

export function SampleConversation({ locale }: { locale: Locale }) {
  const reduced = useReducedMotion();
  const s = script[locale];

  return (
    <div className="mx-auto max-w-xl">
      <h3 className="text-center text-h4">{s.title}</h3>
      <div className="mt-6 space-y-3">
        {s.turns.map((turn, i) => {
          const anim = reduced
            ? {}
            : {
                initial: { opacity: 0, y: 14, scale: 0.98 },
                whileInView: { opacity: 1, y: 0, scale: 1 },
                viewport: { once: true, margin: "-40px" },
                transition: { duration: 0.4, delay: i * 0.5, ease: "easeOut" as const },
              };
          if (turn.who === "handoff") {
            return (
              <motion.div key={i} {...anim} className="rounded-2xl border-2 border-brand-blue/30 bg-brand-gradient-soft p-4">
                <p className="flex items-center gap-2 text-body-lg font-bold text-brand-purple">
                  <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden fill="none" className="shrink-0">
                    <path d="M10 3v8m0 0l-3-3m3 3l3-3M4 15h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {turn.title}
                </p>
                <ul className="mt-2 space-y-1">
                  {turn.lines.map((l) => (
                    <li key={l} className="flex items-center gap-2 text-body text-ink/70">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-blue" aria-hidden />
                      {l}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          }
          const isCaller = turn.who === "caller";
          return (
            <motion.div key={i} {...anim} className={`flex ${isCaller ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-body-lg leading-relaxed shadow-card ${
                  isCaller
                    ? "rounded-es-md bg-white text-ink"
                    : turn.who === "human"
                      ? "rounded-ee-md bg-brand-purple text-white"
                      : "rounded-ee-md bg-ink text-white"
                }`}
              >
                {turn.who !== "caller" && (
                  <span className={`mb-1 block text-body-sm font-medium ${turn.who === "human" ? "text-white/75" : "text-white/60"}`}>
                    {turn.who === "human"
                      ? locale === "ar" ? "موظفك" : "Your employee"
                      : locale === "ar" ? "وكيل صوت نجدي" : "Saut Najdi agent"}
                  </span>
                )}
                {turn.text}
              </div>
            </motion.div>
          );
        })}
      </div>
      <p className="mt-4 text-center text-body-sm text-ink/45">{s.note}</p>
    </div>
  );
}
