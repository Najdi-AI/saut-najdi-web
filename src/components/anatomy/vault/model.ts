/**
 * The Gulf vault: the truth the figure is built from.
 *
 * Every claim on the card comes from the site's own copy:
 * - storage in the Gulf region (Doha), with full disclosure of where
 *   processing happens (src/lib/site.ts PDPL line, SecurityPage);
 * - an append-only audit log nobody can edit or delete (TrustStrip,
 *   SecurityPage "Can the audit log be edited or deleted?");
 * - roles and permissions per employee. The three example roles are the
 *   three permission levels AgentBuilderPage describes: one person edits and
 *   publishes, another edits the draft, another can look without touching.
 *
 * The line counter is the figure's own state (lines printed on this demo
 * tape), not a metric. Nothing here is measured from the product.
 */

export type Locale = "ar" | "en";

/** Ratchet: 10 teeth, so one printed line turns the take-up spool 36°. */
export const TEETH = 10;
export const TOOTH = 360 / TEETH;
/** Radius of the paper wound on the take-up spool, world units. */
export const ROLL_R = 7;
/** Tape advance per line = roll radius × one tooth (arc length). */
export const PITCH = (ROLL_R * Math.PI) / TEETH;
/** Free play before a tooth's steep face meets the pawl, degrees. */
export const PLAY = 1.6;
/** Lines already on the tape when the page opens (the drawing's own state). */
export const FIRST_LINE = 12;

export interface Role {
  id: string;
  /** Printed-line pattern: lengths of the "words" on this role's log line. */
  words: number[];
}

export const ROLES: Role[] = [
  { id: "publish", words: [5, 9, 13] },
  { id: "draft", words: [5, 7, 16] },
  { id: "view", words: [5, 11, 8] },
];

interface Words {
  fig: (n: number) => string;
  title: string;
  hint: string;
  roles: string[];
  rest: (line: number) => string;
  turning: (role: number) => string;
  ready: (role: number) => string;
  printed: (line: number, role: number) => string;
  pushing: string;
  held: string;
  label: string;
  stage: string;
  keys: { lit: string; raised: string; edge: string; flat: string };
  caption: string;
  engraved: string;
  announce: { printed: (line: number, role: number) => string; held: string };
}

export const WORDS: Record<Locale, Words> = {
  ar: {
    fig: (n) => `شكل ${n}`,
    title: "خزنة الخليج",
    hint: "لفّ مفتاح · جرّب ترجّع الورق",
    roles: ["النشر", "المسودة", "المشاهدة"],
    rest: (line) => `سجل التدقيق: السطر ${line} · ما يرجع للخلف`,
    turning: (role) => `مفتاح ${WORDS.ar.roles[role]} يلف`,
    ready: (role) => `مفتاح ${WORDS.ar.roles[role]} جاهز`,
    printed: (line, role) => `سطر جديد ${line} · ${WORDS.ar.roles[role]}`,
    pushing: "تحاول ترجّع الورق…",
    held: "السقّاطة ماسكته · ما يرجع للخلف",
    label:
      "خزنة صناديق أمانات على قاعدة، مكتوب على لوحتها الدوحة، وفوقها طابعة سجل التدقيق. على جنب الخزنة ثلاثة مفاتيح، مفتاح لكل دور: النشر، والمسودة، والمشاهدة. إذا لفّ أي مفتاح تطبع الطابعة سطر جديد، ويلتف الورق على بكرة فيها عجلة مسننة وسقّاطة تمنعها ترجع للخلف، فما ينعدل سطر ولا ينحذف. وقدام الخزنة بطاقة الإفصاح عن أماكن المعالجة.",
    stage: "خزنة الخليج. الأسهم تختار المفتاح، وEnter أو المسافة تلفّه ويُطبع سطر في السجل، وBackspace تحاول ترجّع الورق.",
    keys: {
      lit: "آخر سطر في السجل: كل إجراء حساس ينكتب",
      raised: "ثلاثة مفاتيح، كل مفتاح دور وصلاحياته (أدوار للمثال)",
      edge: "السقّاطة: تمسك العجلة فما يرجع الورق",
      flat: "بطاقة الإفصاح عن أماكن المعالجة",
    },
    caption:
      "التخزين في منطقة الخليج (الدوحة). كل موظف بدوره وصلاحياته، وكل ما لفّ مفتاحه ينكتب سطر في سجل تدقيق ملحق فقط: الورق يمشي لقدام بس، والسقّاطة تصدّ أي لفّة للخلف، فما ينعدل سطر ولا ينحذف. والبطاقة قدام الخزنة تذكّر بالإفصاح الكامل عن أماكن المعالجة.",
    engraved: "الدوحة",
    announce: {
      printed: (line, role) => `انطبع السطر ${line} بمفتاح ${WORDS.ar.roles[role]}.`,
      held: "السقّاطة منعت الورق يرجع للخلف.",
    },
  },
  en: {
    fig: (n) => `Fig ${n}`,
    title: "The Gulf vault",
    hint: "Turn a key · try to roll it back",
    roles: ["publish", "draft", "view-only"],
    rest: (line) => `Audit log: line ${line} · forward only`,
    turning: (role) => `${cap(WORDS.en.roles[role]!)} key turning`,
    ready: (role) => `${cap(WORDS.en.roles[role]!)} key ready`,
    printed: (line, role) => `New line ${line} · ${WORDS.en.roles[role]}`,
    pushing: "Trying to roll it back…",
    held: "The pawl holds · it won't roll back",
    label:
      "A safe-deposit vault on a bench plate, its name plate engraved Doha, with an audit-log printer on top. On its side are three keys, one per role: publish, draft and view-only. Turning any key prints a new line, and the paper winds onto a spool whose ratchet wheel is held by a pawl, so it can never turn back: no line can be edited or deleted. In front of the vault stands the card that discloses where processing happens.",
    stage: "The Gulf vault. Arrow keys choose a key, Enter or Space turns it and prints a line in the log, Backspace tries to roll the paper back.",
    keys: {
      lit: "The newest line: every sensitive action is written",
      raised: "Three keys, one per role and its permissions (example roles)",
      edge: "The pawl: it stops the wheel turning back",
      flat: "The card disclosing where processing happens",
    },
    caption:
      "Storage in the Gulf region (Doha). Every employee works under their own role and permissions, and each turn of a key writes a line to an append-only audit log: the paper only moves forward and the pawl stops any turn back, so no line can be edited or deleted. The card in front stands for full disclosure of where processing happens.",
    engraved: "DOHA",
    announce: {
      printed: (line, role) => `Line ${line} printed with the ${WORDS.en.roles[role]} key.`,
      held: "The pawl stopped the paper rolling back.",
    },
  },
};

function cap(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** The words the live controller needs, as plain strings and templates. */
export function textFor(locale: Locale) {
  const w = WORDS[locale];
  return {
    roles: w.roles,
    rest: w.rest(Number.NaN).replace("NaN", "{n}"),
    turning: ROLES.map((_, i) => w.turning(i)),
    ready: ROLES.map((_, i) => w.ready(i)),
    printed: ROLES.map((_, i) => w.printed(Number.NaN, i).replace("NaN", "{n}")),
    pushing: w.pushing,
    held: w.held,
    announcePrinted: ROLES.map((_, i) => w.announce.printed(Number.NaN, i).replace("NaN", "{n}")),
    announceHeld: w.announce.held,
  };
}

export type VaultText = ReturnType<typeof textFor>;
