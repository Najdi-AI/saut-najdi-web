import type { CSSProperties } from "react";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Num } from "../ui/Num";
import { SectionHead } from "../ui/SectionHead";
import { hubCopy, type Channel, type Text } from "./copy";
import { HubBoard, type Tile } from "./HubBoard";
import s from "./Hub.module.css";

/** Copy text, with its middle part (a figure or a Latin name) as an LTR island; a Latin name is marked English. */
const Run = ({ text }: { text: Text }) =>
  typeof text === "string" ? (
    text
  ) : (
    <>
      {text[0]}
      <bdi dir="ltr" lang={/[a-z]/i.test(text[1]) ? "en" : undefined}>
        {text[1]}
      </bdi>
      {text[2]}
    </>
  );

const SIDES: Channel[][] = [
  ["phone", "whatsapp", "telegram"],
  ["web", "grandstream", "sip"],
];
const PBX: Channel[] = ["grandstream", "sip"];

/**
 * Channels and phone systems (Try 3 `#hub`): the channel tiles around one
 * shared inbox. Each tile takes its own colour on hover, keyboard focus and
 * tap, and the inbox rows from that channel light up with it, so the
 * section shows where each channel's messages land. The inbox is a
 * Charcoal .on-dark fragment; the tiles are square marketing tiles.
 */
export function Hub({ locale }: { locale: Locale }) {
  const t = hubCopy[locale];
  const sides = SIDES.map((group) =>
    group.map((ch): Tile => ({ ch, name: <Run text={t.tiles[ch]} />, kind: PBX.includes(ch) ? t.pbx : t.channel })),
  );
  return (
    <section id="hub" aria-labelledby="hub-title" className="px-5 pt-24 sm:px-8 lg:pt-40">
      <SectionHead id="hub-title" title={t.title} lead={t.lead} />
      <HubBoard groups={t.groups} sides={sides}>
        <div className={cn(s.inbox, "on-dark")}>
          <div className={s.inboxTop}>
            <b className={s.inboxTitle}>{t.inbox}</b>
            <span className={s.all}>{t.all}</span>
          </div>
          <ul className={s.list}>
            {t.rows.map((row, i) => (
              <li
                key={row.time}
                className={s.row}
                data-ch={row.ch}
                data-dup={"dup" in row ? "" : undefined}
                style={{ "--i": i } as CSSProperties}
              >
                <span className={s.rowCh}>
                  <i />
                  <span>
                    <Run text={t.labels[row.ch as Channel]} />
                  </span>
                </span>
                <span className={s.rowBody}>
                  <b>
                    <Run text={row.who} />
                  </b>
                  <span className={s.msg}>
                    <Run text={row.msg} />
                  </span>
                </span>
                <span className={s.rowT}>
                  <Num>{row.time}</Num> {row.half}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </HubBoard>
    </section>
  );
}
