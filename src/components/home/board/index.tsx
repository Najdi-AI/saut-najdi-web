import type { Locale } from "@/lib/i18n";
import { SectionHead } from "../ui/SectionHead";
import { BoardGame } from "./BoardGame";
import { boardCopy } from "./copy";
import s from "./Board.module.css";

/**
 * The missed-calls board (Try 3 #board, t3-05-receipt-loss/profit): a
 * Charcoal .on-dark band. The heading is server markup; the score, the
 * day's tiles and the knobs are one client island that server-renders the
 * defaults (420 SAR a day, 12,600 a month), so they read without
 * JavaScript too. The arithmetic is ./model.ts, checked by
 * scripts/check-board-model.mjs.
 */
export function Board({ locale }: { locale: Locale }) {
  const t = boardCopy[locale];
  return (
    <section id="board" aria-labelledby="board-title" className={`on-dark ${s.board}`}>
      <div className={s.grid}>
        <SectionHead id="board-title" title={t.title} lead={t.lead} className={s.head} />
        <BoardGame t={t} />
      </div>
    </section>
  );
}
