import type { Locale } from "@/lib/i18n";
import { CAL_LINK_DEMO, CAL_LINK_QUICK } from "@/lib/site";
import { BOOKER_SURFACE } from "@/lib/bookerTheme";
import { CalInline } from "@/components/CalInline";
import { CalButton } from "@/components/CalButton";
import { AnimatedIcon } from "@/components/icons";

/**
 * The booking desk: one dark card holding three columns — our event panel,
 * then Cal's calendar and slot columns.
 *
 * Extracted from /demo so the homepage can end on the real thing instead of a
 * button that opens a modal. Renders the CARD ONLY; each caller supplies its
 * own section wrapper and heading, because the two placements introduce it
 * differently (a page whose whole job is booking vs. the closing pitch).
 *
 * Cal's own event panel is switched off (`hideEventTypeDetails`, see
 * lib/cal.ts) and this one takes its place: the upstream event is titled
 * "demo" with an empty description, one Cal description cannot serve both
 * locales, and — unlike anything inside the iframe — this panel is in the
 * server-rendered HTML.
 *
 * Only ONE of these per page: CalInline mounts on a fixed element id.
 */

const t = {
  ar: {
    org: "صوت نجدي",
    title: "عرض تعريفي",
    // One line each at the panel's 320px. Longer bullets push the card
    // taller than the calendar beside it and leave dead space under it.
    items: [
      "تسمع الوكيل بلهجة عملائك — حي",
      "تشوف موظفك يستلم المكالمة بسياقها",
      "نختار القالب اللي يناسب نشاطك",
      "نجاوب أسئلة البيانات وPDPL",
      "تطلع بخطة تجهيز واضحة",
    ],
    // Mirrors Cal's own meta rows, which hideEventTypeDetails removes.
    // «بتوقيتك المحلي» rather than a named zone: the booker reads the
    // visitor's browser timezone, so naming Riyadh would be wrong for
    // anyone outside it — and without Cal's picker they cannot correct us.
    meta: [
      { icon: "clock", label: "30 دقيقة" },
      { icon: "people", label: "اجتماع فيديو — الرابط يوصلك بالإيميل" },
      { icon: "globe", label: "الأوقات معروضة بتوقيتك المحلي" },
    ],
    quick: "ما عندك 30 دقيقة؟ احجز مكالمة سريعة — 15 دقيقة",
    loading: "التقويم يحمّل…",
  },
  en: {
    org: "Saut Najdi",
    title: "Intro demo",
    items: [
      "Hear the agent in your customers' dialect — live",
      "Watch an employee take over mid-call",
      "Pick the template that fits your business",
      "Get your data and PDPL questions answered",
      "Leave with a setup plan",
    ],
    meta: [
      { icon: "clock", label: "30 minutes" },
      { icon: "people", label: "Video call — link sent by email" },
      { icon: "globe", label: "Times shown in your local timezone" },
    ],
    quick: "Short on time? Book a quick 15-minute call",
    loading: "Loading the calendar…",
  },
} as const;

export function BookingDesk({ locale }: { locale: Locale }) {
  const s = t[locale];
  return (
    <div
      className="mx-auto grid max-w-[1120px] overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)] lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]"
      /* Pinning --surface as well as the background: this card is dark in
         BOTH themes, so anything inside it that reads the surface token —
         .ring-spectrum fills its centre with it — must see the card's own
         colour rather than the page's, or the chip turns into a white
         sticker whenever the site is in light mode. */
      style={
        { backgroundColor: BOOKER_SURFACE, "--surface": BOOKER_SURFACE } as React.CSSProperties
      }
    >
      <aside className="min-w-0 border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-e">
        <div className="flex items-center gap-3">
          {/* Cyan, not purple: the chip's ground is the dark card in both
              themes, and brand-purple on it is nearly unreadable. */}
          <span className="ring-spectrum flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-brand-cyan">
            <AnimatedIcon name="wave" size={22} />
          </span>
          <span className="text-body font-medium text-white/55">{s.org}</span>
        </div>

        <p className="mt-5 text-h3 text-white">{s.title}</p>

        <ul className="mt-5 space-y-3">
          {s.items.map((item, i) => (
            <li key={item} className="flex items-start gap-3 text-body leading-relaxed text-white/70">
              <span className="mt-0.5 shrink-0 text-brand-cyan">
                <AnimatedIcon name="check" size={16} delay={i * 0.18} strokeWidth={2.4} />
              </span>
              {item}
            </li>
          ))}
        </ul>

        <ul className="mt-6 space-y-3 border-t border-white/10 pt-5">
          {s.meta.map((m) => (
            <li key={m.label} className="flex items-center gap-3 text-body text-white/55">
              <span className="shrink-0 text-white/35">
                <AnimatedIcon name={m.icon} size={16} />
              </span>
              {m.label}
            </li>
          ))}
        </ul>

        <div className="mt-6 border-t border-white/10 pt-5">
          {/* Stays a modal: there is no page for the 15-minute call, and
              sending someone from a booker to another booker is worse than
              opening it where they stand. */}
          <CalButton
            calLink={CAL_LINK_QUICK}
            locale={locale}
            variant="link"
            className="!text-body !text-brand-cyan"
          >
            {s.quick}
          </CalButton>
        </div>
      </aside>

      <CalInline calLink={CAL_LINK_DEMO} locale={locale} loadingLabel={s.loading} />
    </div>
  );
}
