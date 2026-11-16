"use client";

import { Fragment, useEffect, useId, useState, type CSSProperties, type ReactNode } from "react";
import { dirOf, type Locale } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Num } from "../ui/Num";
import type { Activity, DemoCopy, Line, Outcome, ReplyDialect, Scenario, Setting } from "./copy";
import s from "./Demo.module.css";

const ACTIVITIES: Activity[] = ["clinic", "restaurant", "hotel"];
const SCENARIOS: Scenario[] = ["book", "price", "urgent"];
const DIALECTS: ReplyDialect[] = ["sa", "ar", "en"];

type State = { activity: Activity; scenario: Scenario; dialect: ReplyDialect } & Record<Setting, boolean>;
type Node =
  | { key: string; kind: "line"; who: Line["who"]; text: string; lang?: Locale }
  | { key: string; kind: "card"; card: Outcome["card"]; title: string; items: string[] }
  | { key: string; kind: "sent"; text: string };
/** What the polite live region reads after a change: the new reply, not the call. */
type Said = { who?: string; text: string; lang?: Locale; outcome?: string };

/** The call on screen for a state: the greeting, the scripted steps its settings allow, the WhatsApp line. */
function threadOf(t: DemoCopy, st: State): Node[] {
  const greeting = t.greetings[st.activity][st.dialect];
  const nodes: Node[] = [{ key: `agent:${greeting}`, kind: "line", who: "agent", text: greeting, lang: st.dialect === "en" ? "en" : "ar" }];
  for (const step of t.calls[st.activity][st.scenario].steps) {
    if (step.when && !Object.entries(step.when).every(([k, v]) => st[k as Setting] === v)) continue;
    if ("card" in step) nodes.push({ key: `card:${step.title}:${step.items.join()}`, kind: "card", card: step.card, title: step.title, items: step.items });
    else nodes.push({ key: `${step.who}:${step.text}`, kind: "line", who: step.who, text: step.text });
  }
  if (st.whatsapp) {
    // A booking left for staff to confirm sends the summary to the team, not a confirmation to the customer.
    const text = st.scenario === "book" && st.autobook ? t.sent.book : st.scenario === "urgent" && st.handoff ? t.sent.staff : t.sent.team;
    nodes.push({ key: `sent:${text}`, kind: "sent", text });
  }
  return nodes;
}

/** Latin digits in an LTR island (house rule), inside a sentence of either script. */
const withDigits = (text: string): ReactNode =>
  text.split(/(\d[\d:.,]*\d|\d)/).map((part, i) => (i % 2 ? <bdi key={i} dir="ltr">{part}</bdi> : <Fragment key={i}>{part}</Fragment>));

const CHECK = (
  <svg viewBox="0 0 20 20" aria-hidden>
    <circle cx="10" cy="10" r="9" fill="#2EC4E6" />
    <path d="M6 10.3l2.6 2.6L14.2 7" fill="none" stroke="#0D1326" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const CLOCK = (
  <svg viewBox="0 0 20 20" aria-hidden>
    <circle cx="10" cy="10" r="8.2" fill="none" stroke="#5B6CE5" strokeWidth="1.8" />
    <path d="M10 5.5V10l3 2" fill="none" stroke="#5B6CE5" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);
const ARROW = (
  <svg viewBox="0 0 20 20" aria-hidden>
    <path d="M10 3v9m0 0l-3.4-3.4M10 12l3.4-3.4M4 16h12" fill="none" stroke="#6F3FA4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const TICKS = (
  <svg viewBox="0 0 16 16" aria-hidden>
    <path d="M1.5 8.5l3 3 6-7M7.5 11.5l1 0 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// The activity picker is the mockups' light segmented control: 32px drawn,
// ::after stretches each target to 44px, the pressed item is Paper on the track.
const SEG_ITEM =
  "relative min-h-8 min-w-0 rounded-[calc(var(--radius)-3px)] border-0 bg-transparent px-3 text-sm text-muted-foreground after:absolute after:inset-x-0 after:-inset-y-1.5 hover:not-aria-pressed:bg-transparent hover:not-aria-pressed:text-foreground aria-pressed:bg-card aria-pressed:text-foreground";
// The off track darkened from --input (1.3:1 on the Silver controls) to 3.3:1, so an
// unchecked switch still reads as a control (WCAG 1.4.11); on stays Charcoal.
const SWITCH = "data-unchecked:bg-[#737d99]";

/**
 * The live demo: the call on the left (right in Arabic), the settings
 * beside it. Every control rewrites the call; only the steps that changed
 * enter (and only without reduced motion), and a polite live region reads
 * the agent's new reply instead of the whole thread. On a phone three rows
 * fold behind «كل الإعدادات»; they fold only once this has hydrated, so
 * without JavaScript every row stays visible.
 */
export function DemoPanel({ locale, t }: { locale: Locale; t: DemoCopy }) {
  const id = useId();
  const dir = dirOf(locale);
  const [view, setView] = useState(() => ({
    st: { activity: "clinic", scenario: "book", dialect: locale === "ar" ? "sa" : "en", handoff: true, autobook: true, whatsapp: true } as State,
    fresh: [] as string[],
    said: null as Said | null,
  }));
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  const change = (patch: Partial<State>) =>
    setView((v) => {
      const st = { ...v.st, ...patch };
      const before = new Set(threadOf(t, v.st).map((n) => n.key));
      const fresh = threadOf(t, st).filter((n) => !before.has(n.key));
      const reply = fresh.find((n) => n.kind === "line" && n.who !== "caller");
      const card = fresh.find((n) => n.kind === "card");
      const sent = fresh.find((n) => n.kind === "sent");
      let said: Said | null = null;
      if (reply?.kind === "line") said = { who: reply.who === "staff" ? t.staff : t.agent, text: reply.text, lang: reply.lang, outcome: card?.kind === "card" ? card.title : undefined };
      else if (card?.kind === "card") said = { text: card.title };
      else if (sent?.kind === "sent") said = { text: sent.text };
      return { st, fresh: fresh.map((n) => n.key), said };
    });

  const { st, fresh, said } = view;
  const nodes = threadOf(t, st);
  const nextDialect = DIALECTS[(DIALECTS.indexOf(st.dialect) + 1) % DIALECTS.length];
  const setting = (k: Setting, more = false) => (
    <div className={`${s.ctl} ${more ? s.more : ""}`} id={more ? `${id}-${k}` : undefined}>
      <span className={s.name} id={`${id}-${k}-name`}>
        {t.settings[k]}
      </span>
      <Switch checked={st[k]} onCheckedChange={(on) => change({ [k]: on })} aria-labelledby={`${id}-${k}-name`} className={SWITCH} />
    </div>
  );

  return (
    <div className={s.panel} data-ready={ready || undefined} data-open={open || undefined}>
      <div className={s.demo}>
        <div className={s.callbar}>
          <div className={s.who}>
            <span className={s.avatar} aria-hidden>
              {t.avatar}
            </span>
            <span>
              {t.call} · {t.places[st.activity]}
            </span>
          </div>
          <div className={s.meta}>
            <span className={s.live}>{t.live}</span>
            <Num>{t.calls[st.activity][st.scenario].time}</Num>
          </div>
        </div>
        <div className={s.thread}>
          {nodes.map((n) => {
            const i = fresh.indexOf(n.key);
            const enter = i < 0 ? {} : { "data-enter": "", style: { "--i": i } as CSSProperties };
            if (n.kind === "card")
              return (
                <div key={n.key} className={s.card} data-card={n.card} {...enter}>
                  <div className={s.cardTitle}>
                    {n.card === "done" ? CHECK : n.card === "handoff" ? ARROW : CLOCK}
                    <span>{withDigits(n.title)}</span>
                  </div>
                  <ul>
                    {n.items.map((item) => (
                      <li key={item}>
                        <span>{withDigits(item)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            if (n.kind === "sent")
              return (
                <div key={n.key} className={s.sent} {...enter}>
                  {TICKS}
                  {n.text}
                </div>
              );
            return (
              <div key={n.key} className={s.bubble} data-who={n.who} {...enter}>
                {n.who !== "caller" && <small>{n.who === "staff" ? t.staff : t.agent}</small>}
                {n.lang ? (
                  <span lang={n.lang} dir={dirOf(n.lang)} className="block">
                    {n.text}
                  </span>
                ) : (
                  withDigits(n.text)
                )}
              </div>
            );
          })}
        </div>
        <p className={s.note}>{t.note}</p>
        <p className="sr-only" aria-live="polite">
          {said && (
            <>
              {said.who && `${said.who}: `}
              <span lang={said.lang}>{said.text}</span>
              {said.outcome && ` ${said.outcome}`}
            </>
          )}
        </p>
      </div>

      <div className={s.controls} role="group" aria-label={t.controls}>
        <div className={s.ctl}>
          <span className={s.name} id={`${id}-activity`}>
            {t.activity}
          </span>
          <ToggleGroup
            dir={dir}
            aria-labelledby={`${id}-activity`}
            value={[st.activity]}
            // A single-choice group: pressing the pressed item would empty it.
            onValueChange={(v) => v[0] && change({ activity: v[0] as Activity })}
            spacing={0.5}
            className="rounded-(--radius) bg-[#d3d7de] p-[3px]"
          >
            {ACTIVITIES.map((a) => (
              <ToggleGroupItem key={a} value={a} className={SEG_ITEM}>
                {t.activities[a]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className={`${s.ctl} ${s.more}`} id={`${id}-voice`}>
          <span className={s.name}>{t.voice}</span>
          <span className={s.value}>
            {t.voiceName} <small>{t.voiceAccent}</small>
          </span>
        </div>
        <div className={`${s.ctl} ${s.more}`} id={`${id}-dialect`}>
          <span className={s.name} id={`${id}-dialect-name`}>
            {t.dialect}
          </span>
          {/* Cycles Saudi, Arabic, English, as in the mockup. */}
          <Button
            variant="ghost"
            size="sm"
            aria-labelledby={`${id}-dialect-name ${id}-dialect-value`}
            onClick={() => change({ dialect: nextDialect })}
            className="px-1 hover:bg-transparent"
          >
            <span id={`${id}-dialect-value`} lang={st.dialect === "en" && locale === "ar" ? "en" : undefined}>
              {t.dialects[st.dialect]}
            </span>
            <svg viewBox="0 0 14 14" aria-hidden className="size-3.5 text-muted-foreground">
              <path d="M3 5l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </Button>
        </div>
        {setting("handoff")}
        {setting("autobook")}
        {setting("whatsapp", true)}
        <div className={`${s.ctl} ${s.stack}`}>
          <span className={s.name} id={`${id}-scenario`}>
            {t.scenario}
          </span>
          <ToggleGroup
            dir={dir}
            variant="outline"
            aria-labelledby={`${id}-scenario`}
            value={[st.scenario]}
            onValueChange={(v) => v[0] && change({ scenario: v[0] as Scenario })}
            className="grid w-full grid-cols-3"
          >
            {SCENARIOS.map((k) => (
              <ToggleGroupItem key={k} value={k} className="min-w-0 px-2 leading-tight whitespace-normal">
                {t.scenarios[k]}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <Button
          variant="link"
          size="sm"
          aria-expanded={open}
          aria-controls={`${id}-voice ${id}-dialect ${id}-whatsapp`}
          onClick={() => setOpen((o) => !o)}
          className={`${s.toggle} px-0`}
        >
          {open ? t.less : t.more}
        </Button>
      </div>
    </div>
  );
}
