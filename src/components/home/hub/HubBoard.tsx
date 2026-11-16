"use client";

import { useState, type ReactNode } from "react";
import type { Channel } from "./copy";
import s from "./Hub.module.css";

export type Tile = { ch: Channel; name: ReactNode; kind: string };

/**
 * The hub's client island: the two tile columns around the server-rendered
 * inbox. Hover and keyboard focus colour a tile and light its inbox rows in
 * CSS alone (Hub.module.css); this only adds the tap. A tap or click
 * presses a tile (aria-pressed) so its colour stays on a touch screen, and
 * a second tap lets it go. Hovering or focusing another tile lets it go
 * too, so one channel shows at a time. The chat launcher tucks away while
 * it would cover a tile (data-fab-avoid, ChatLauncher).
 */
export function HubBoard({ groups, sides, children }: { groups: string[]; sides: Tile[][]; children: ReactNode }) {
  const [on, setOn] = useState<Channel | null>(null);
  const others = (ch: Channel) => setOn((k) => (k === ch ? k : null));

  const tile = ({ ch, name, kind }: Tile) => (
    <button
      key={ch}
      type="button"
      className={s.ch}
      data-ch={ch}
      data-fab-avoid=""
      aria-pressed={on === ch}
      onClick={() => setOn((k) => (k === ch ? null : ch))}
      onFocus={() => others(ch)}
      onPointerEnter={(e) => e.pointerType === "mouse" && others(ch)}
    >
      <span className={s.name}>{name}</span>
      <span className={s.kind}>{kind}</span>
    </button>
  );

  return (
    <div className={s.board}>
      <div className={s.side} role="group" aria-label={groups[0]}>
        {sides[0].map(tile)}
      </div>
      {children}
      <div className={s.side} role="group" aria-label={groups[1]}>
        {sides[1].map(tile)}
      </div>
    </div>
  );
}
