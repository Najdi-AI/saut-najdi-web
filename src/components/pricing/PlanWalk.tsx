import Link from "next/link";
import type { ReactNode } from "react";
import { DemoLink } from "@/components/DemoLink";
import { Num } from "@/components/home/ui/Num";
import { plans, textConversations, voiceMinutes } from "@/content/pricing";
import { localePath, type Locale } from "@/lib/i18n";
import { PlanSteps } from "./PlanSteps";
import s from "./PlanWalk.module.css";

/**
 * The four tiers, one at a time as the visitor scrolls (decision 185):
 * Essential, Growth, Expansion and Enterprise. Shared by the home page's
 * #pricing and /pricing. Prices and capacity come from content/pricing.ts
 * only; the copy is the old home's approved plans strip, and
 * Enterprise's is decision 186's. Every tier carries the VAT and setup-fee
 * note, so it is on screen whichever tier is.
 *
 * The tiers are server markup; PlanSteps (client) adds the index and picks
 * the active one, and the CSS module decides between the walk and the four
 * stacked cards.
 */

type PlanKey = (typeof plans)[number]["key"];

const sar = new Intl.NumberFormat("en-US");
const vatRate = <bdi dir="ltr">15%</bdi>;

const copy: Record<
  Locale,
  {
    label: string;
    pre?: string; // the unit before the figure: English reads "SAR 990 a month"
    per: string;
    fit: Record<PlanKey, string>;
    capacity: (minutes: number, conversations: number) => ReactNode;
    includes: Record<PlanKey, string>;
    /** The live region's prefix, and the figure in words after a tier's name. */
    said: string;
    price: (monthlySar: number) => string;
    enterprise: { name: string; fig: string; fit: string; body: string; price: string; contact: string };
    vat: ReactNode;
    cta: string;
  }
> = {
  ar: {
    label: "الباقات",
    per: "ر.س شهرياً",
    fit: {
      essential: "لفرع واحد، يغطي مكالماتك بعد الدوام وإذا انشغل فريقك",
      growth: "لفريق يكبر ويبي سعة أكبر للرد والمتابعة",
      expansion: "لأكثر من فرع، بسعة أكبر لفريقك ووكلائك",
    },
    capacity: (minutes, conversations) => (
      <>
        تكفي لحد <Num value={minutes} /> دقيقة مكالمة، أو <Num value={conversations} /> محادثة نصية.
      </>
    ),
    includes: {
      essential: "يرد على المكالمات ودردشة موقعك، ويحوّل لموظفك، مع تقارير أساسية.",
      growth: "كل اللي في أساسي، مع واتساب وتيليجرام وصندوق وارد مشترك، وتسمع المكالمة وتستلمها وهي شغالة.",
      expansion: "كل اللي في نمو، مع مسارات أتمتة أكثر وتقارير لكل فرع.",
    },
    said: "الباقة: ",
    price: (monthlySar) => `، ${sar.format(monthlySar)} ر.س شهرياً`,
    enterprise: {
      name: "مؤسسات",
      fig: "على مقاسك",
      fit: "لشركة كبيرة أو فروعها كثيرة، واحتياجاتها خاصة",
      body: "نجهز لك باقة على قد شغلك: السعة، والقنوات، والتكاملات، ومدة حفظ التسجيلات، كلها نتفق عليها في العقد، ومدير حساب واتفاقية خدمة حسب الاتفاق.",
      price: "، على مقاسك",
      contact: "أو تواصل معنا",
    },
    vat: (
      <>
        الأسعار بالريال وما تشمل ضريبة القيمة المضافة {vatRate}، ورسوم التجهيز نحددها لك في العرض
        المكتوب.
      </>
    ),
    cta: "احجز عرضاً",
  },
  en: {
    label: "Plans",
    pre: "SAR",
    per: "a month",
    fit: {
      essential: "For one location: after-hours and overflow calls covered",
      growth: "For a growing team that needs more answering capacity",
      expansion: "For several branches, with room for a bigger team and more agents",
    },
    capacity: (minutes, conversations) => (
      <>
        Up to <Num value={minutes} /> call minutes, or <Num value={conversations} /> text conversations.
      </>
    ),
    includes: {
      essential: "Voice answering and website chat, human handoff and basic reports.",
      growth:
        "Everything in Essential, plus WhatsApp, Telegram, a shared inbox, and listening in on live calls and taking them over.",
      expansion: "Everything in Growth, plus more automated workflows and per-branch reporting.",
    },
    said: "Plan: ",
    price: (monthlySar) => `, SAR ${sar.format(monthlySar)} a month`,
    enterprise: {
      name: "Enterprise",
      fig: "Tailored to you",
      fit: "For large companies or many branches with special needs",
      body: "Capacity, channels, integrations and recording retention agreed in your contract, with an account manager and SLA as agreed.",
      price: ", tailored to you",
      contact: "or contact us",
    },
    vat: <>Prices in SAR, excluding {vatRate} VAT. Setup fees are scoped to your needs in the written offer.</>,
    cta: "Book a demo",
  },
};

function Tier({
  step,
  name,
  figure,
  fit,
  text,
  more,
  locale,
}: {
  step: number;
  name: string;
  figure: ReactNode;
  fit: string;
  text: ReactNode;
  more?: ReactNode;
  locale: Locale;
}) {
  const t = copy[locale];
  return (
    <div className={s.step} data-step={step}>
      <h3 className={s.name}>{name}</h3>
      <div className={s.body}>
        <p className={s.fig}>{figure}</p>
        <p className={s.fit}>{fit}</p>
        <p className={s.text}>{text}</p>
        <div className={s.act}>
          <DemoLink locale={locale}>{t.cta}</DemoLink>
          {more}
        </div>
        <p className={s.note}>{t.vat}</p>
      </div>
    </div>
  );
}

export function PlanWalk({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const e = t.enterprise;
  const names = [...plans.map((p) => p[locale]), e.name];
  const prices = [...plans.map((p) => t.price(p.monthlySar)), e.price];
  const said = names.map((name, i) => t.said + name + prices[i]);

  return (
    <PlanSteps label={t.label} names={names} prices={prices} said={said}>
      {plans.map((plan, i) => (
        <Tier
          key={plan.key}
          step={i}
          name={plan[locale]}
          figure={
            <>
              {t.pre && <span className={s.per}>{t.pre}</span>}
              <Num value={plan.monthlySar} className={s.num} />
              <span className={s.per}>{t.per}</span>
            </>
          }
          fit={t.fit[plan.key]}
          text={
            <>
              {t.capacity(voiceMinutes(plan.credits), textConversations(plan.credits))} {t.includes[plan.key]}
            </>
          }
          locale={locale}
        />
      ))}
      <Tier
        step={plans.length}
        name={e.name}
        figure={<span className={s.word}>{e.fig}</span>}
        fit={e.fit}
        text={e.body}
        more={
          <Link href={localePath(locale, "contact")} className={s.more}>
            {e.contact}
          </Link>
        }
        locale={locale}
      />
    </PlanSteps>
  );
}
