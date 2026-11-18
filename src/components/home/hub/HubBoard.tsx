"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useInView } from "../ui/useInView";
import type { Channel } from "./copy";
import s from "./Hub.module.css";

export type Tile = { ch: Channel; name: ReactNode; kind: string };

/**
 * The hub's client island: the two tile columns around the server-rendered
 * inbox. Hover and keyboard focus colour a tile and light its inbox rows in
 * CSS alone (Hub.module.css); this only adds the tap. A tap or click
 * presses a tile (aria-pressed) so its colour stays on a touch screen, and
 * a second tap lets it go. Hovering or focusing another tile lets it go
 * too, so one channel shows at a time.
 *
 * Clip D: the first time the board comes into view, the inbox rows arrive
 * from their channels' sides and settle into the one inbox (data-merge,
 * CSS), about a second, holding while the board is off screen. A board
 * already on screen when this hydrates skips it, and under reduced motion
 * or without JavaScript the inbox is simply there.
 */
export function HubBoard({ groups, sides, children }: { groups: string[]; sides: Tile[][]; children: ReactNode }) {
  const [on, setOn] = useState<Channel | null>(null);
  const others = (ch: Channel) => setOn((k) => (k === ch ? k : null));
  const [ref, inView] = useInView<HTMLDivElement>({ once: false });
  const [merge, setMerge] = useState<"wait" | "go" | "skip">();
  useEffect(() => {
    const r = ref.current?.getBoundingClientRect();
    setMerge(r && r.top < innerHeight && r.bottom > 0 ? "skip" : "wait");
  }, [ref]);
  useEffect(() => {
    if (inView) setMerge((m) => (m === "wait" ? "go" : m));
  }, [inView]);

  const tile = ({ ch, name, kind }: Tile) => (
    <button
      key={ch}
      type="button"
      className={s.ch}
      data-ch={ch}
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
    <div ref={ref} className={s.board} data-merge={merge} data-hold={(merge === "go" && !inView) || undefined}>
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
