// The Najdi switchboard: the pure model. No DOM and no kit imports, so the
// client motion can ship it. Every word on the card lives here, in both locales.
//
// What it shows is the site's own four steps (HomePage "how" steps):
//   يتصل العميل → يرد ويفهم → ينفذ → يحوّل إذا لزم
// played as one illustrative call: the hero clip's caller asks «أبغى أحجز موعد بكرة»
// and the agent offers 4:30 العصر. Nothing here is a measured number.

/** Dial positions: exactly the hero chips' words (DialectChips.tsx). */
export const DIALECTS = ["saudi", "arabic", "english"];
export const DIALECT_WORDS = {
  ar: { saudi: "سعودي", arabic: "عربي", english: "إنجليزي" },
  en: { saudi: "Saudi", arabic: "Arabic", english: "English" },
};
/** The dial's home between calls: the agent speaks Arabic, and adapts to the caller. */
export const DIAL_HOME = "arabic";
export const CALL_DIALECT = "saudi";

export const TEXT = {
  ar: {
    fig: "شكل 1",
    title: "السنترال النجدي",
    hint: "اضغط السماعة وتسمع المكالمة",
    label:
      "رسم توضيحي لسنترال مكالمات: لوحة مقابس فيها أربعة خطوط واردة بلمباتها، ومقبس للوكيل ومقبس محفور عليه «موظفك»، وسلك تحويل، وسماعة. على الرف قرص اللهجة، وختم يطبع بطاقة الحجز، وطابعة ورقة الملخص. يمثّل خطوات صوت نجدي: يتصل العميل، يرد الوكيل ويفهم، ينفذ الحجز، ويحوّل لموظفك إذا لزم.",
    play: "اسمع وكيل صوت نجدي",
    pause: "إيقاف الصوت",
    clipCaption: "حوار توضيحي بصوت وكيل صوت نجدي",
    error: "ما قدرنا نشغّل الصوت — جرّب مرة ثانية",
    dialGroup: "قرص اللهجة",
    // the hero clip's three lines (HeroVisual's bubbles), shown on the readout as they are spoken
    lines: ["هلا! كيف أقدر أساعدك؟", "أبغى أحجز موعد بكرة", "أبشر! بكرة عندنا الساعة 4:30 العصر، يناسبك؟"],
    keys: [
      { mark: "lit", label: "اللمبة: خط يدق أو صوت يتكلم" },
      { mark: "raised", label: "سلك التحويل: من الوكيل إلى «موظفك»" },
    ],
    caption:
      "مكالمة توضيحية: يدق الخط، يرد الوكيل بالسعودي ويحجز بكرة 4:30 العصر. وإذا لزم، ينتقل السلك لمقبس «موظفك» وتطلع ورقة الملخص.",
    readout: {
      idle: "بانتظار مكالمة",
      ring: "مكالمة واردة · الخط 2",
      answer: (dialect) => ({ saudi: "يرد بالسعودي", arabic: "يرد بالعربي", english: "يرد بالإنجليزي" })[dialect],
      booked: "حجز 4:30 العصر",
      handoff: "تحويل لموظفك مع الملخص",
      ended: "انتهت المكالمة",
      caller: "العميل يتكلم",
      agent: "الوكيل يتكلم",
      loading: "يجهّز الصوت",
    },
  },
  en: {
    fig: "Fig 1",
    title: "The Najdi switchboard",
    hint: "Press the speaker to hear the call",
    label:
      "Illustration of a call switchboard: a jack panel with four incoming lines and their lamps, a jack for the agent and a jack engraved «موظفك» (your employee), a patch cord and a speaker. On the shelf sit the dialect dial, a stamp that prints the booking card and a printer for the summary ticket. It stands for Saut Najdi's steps: the customer calls, the agent answers and understands, books, and hands off to your employee when needed.",
    play: "Hear the Saut Najdi agent",
    pause: "Pause the audio",
    clipCaption: "An illustrative call in the Saut Najdi agent's voice, in Arabic",
    error: "The audio could not play. Try again.",
    dialGroup: "Dialect dial",
    lines: ["Hello! How can I help?", "I'd like to book for tomorrow", "Sure! Tomorrow at 4:30 PM is open. Does that suit you?"],
    keys: [
      { mark: "lit", label: "Lamp: a line ringing, or a voice speaking" },
      { mark: "raised", label: "Patch cord: from the agent to «موظفك», your employee" },
    ],
    caption:
      "An illustrative call: the line rings, the agent answers in Saudi Arabic and books tomorrow at 4:30 PM. When needed, the cord moves to your employee's jack and a summary ticket comes out.",
    readout: {
      idle: "Waiting for a call",
      ring: "Call coming in · line 2",
      answer: (dialect) => `Answering in ${DIALECT_WORDS.en[dialect]}`,
      booked: "Booked · 4:30 PM",
      handoff: "To your employee, with the summary",
      ended: "Call ended",
      caller: "The caller is speaking",
      agent: "The agent is speaking",
      loading: "Loading the audio",
    },
  },
};

export const readoutOf = (locale, phase, dialect = CALL_DIALECT) => {
  const r = TEXT[locale].readout;
  return phase === "answer" ? r.answer(dialect) : r[phase] ?? r.idle;
};

// ---------------------------------------------------------------- the tour
// One loop is a call. Every other loop ends in the handoff. Times in seconds.
export const TOUR_FIRST = 1.4;
export const TOUR_BACK = 3.6;
const T = {
  ring: 0.6,
  answer: 2.3,
  travel: 1.5,
  dial: 4.0,
  greet: [4.15, 5.7],
  caller: [5.95, 7.15],
  reply: [7.4, 9.3],
  stamp: 9.5,
  plain: { hang: 10.9, end: 13.2 },
  hand: { move: 10.5, ticket: 12.15, hang: 14.6, end: 17.0 },
};
export const LOOPS = [T.plain.end, T.hand.end];
export const CYCLE = LOOPS[0] + LOOPS[1];

const clamp01 = (x) => Math.min(1, Math.max(0, x));
const smooth = (x) => {
  const u = clamp01(x);
  return u * u * (3 - 2 * u);
};
const within = (t, [a, b]) => t >= a && t < b;

/** A plug's travel from one jack to another, as a share u in 0..1: out, across, in. */
export function plugTravel(u, dx, out = 8) {
  const v = clamp01(u);
  const pull = v < 0.24 ? smooth(v / 0.24) : v > 0.78 ? 1 - smooth((v - 0.78) / 0.22) : 1;
  const across = smooth((v - 0.2) / 0.6);
  const lift = Math.sin(Math.PI * clamp01((v - 0.2) / 0.6)) * 2.4;
  return [dx * across, out * pull, lift];
}

/** The ring: the lamp blinks twice a second, eased so it never pops. */
const blink = (t) => 0.5 - 0.5 * Math.cos(Math.PI * 2 * 1.9 * t);

/**
 * The state of the machine at tour time t (seconds into the two-call cycle).
 * Plugs are given as [from, to, share] so the motion can place them.
 */
export function tourAt(clock) {
  const t0 = ((clock % CYCLE) + CYCLE) % CYCLE;
  const hand = t0 >= LOOPS[0];
  const t = hand ? t0 - LOOPS[0] : t0;
  const s = {
    loop: hand ? 1 : 0,
    a: ["park", "l2", 0],
    b: ["ai", "staff", 0],
    dial: DIAL_HOME,
    lamps: { l2: 0, ai: 0, staff: 0 },
    speak: 0,
    stamp: 0,
    mark: 0,
    ticket: 0,
    ticketFade: 1,
    phase: "idle",
  };
  if (t >= T.ring && t < T.answer + T.travel) s.lamps.l2 = t < T.answer ? blink(t - T.ring) : 1 - smooth((t - T.answer) / 0.5) * 0.0;
  if (t >= T.ring) s.phase = "ring";
  // plug A: park → line 2 on answer, back to park on hang-up
  const hang = hand ? T.hand.hang : T.plain.hang;
  if (t >= T.answer) s.a[2] = clamp01((t - T.answer) / T.travel);
  if (t >= hang) s.a = ["l2", "park", clamp01((t - hang) / T.travel)];
  if (t >= T.answer + T.travel - 0.05 && t < hang) {
    s.lamps.l2 = 1;
  }
  // the dial clicks to the caller's dialect once the call is up, home after hang-up
  if (t >= T.dial && t < hang + 0.8) s.dial = CALL_DIALECT;
  if (t >= T.dial + 0.2) s.phase = "answer";
  // who is speaking: the lamp of whoever talks is the brightest thing on the board
  const speaking = within(t, T.greet) || within(t, T.reply) ? "agent" : within(t, T.caller) ? "caller" : "";
  if (t >= T.answer + T.travel && t < hang) {
    s.lamps.l2 = speaking === "caller" ? 1 : 0.32;
    s.lamps.ai = speaking === "agent" ? 1 : 0.32;
  }
  s.speak = speaking === "agent" ? 1 : 0;
  // the stamp: down, hold, up; the impression appears at contact
  if (t >= T.stamp) {
    const k = t - T.stamp;
    s.stamp = k < 0.28 ? smooth(k / 0.28) : k < 0.5 ? 1 : 1 - smooth((k - 0.5) / 0.45);
    s.mark = smooth((k - 0.22) / 0.12);
    if (k >= 0.24) s.phase = "booked";
  }
  if (t >= hang) {
    s.mark = 1 - smooth((t - hang - 0.6) / 0.6);
    s.lamps.l2 = 0;
    s.lamps.ai = 0;
    s.phase = "ended";
  }
  if (hand) {
    if (t >= T.hand.move) s.b[2] = clamp01((t - T.hand.move) / T.travel);
    const arrived = T.hand.move + T.travel;
    if (t >= arrived && t < hang) {
      s.lamps.ai = 0;
      s.lamps.staff = 1;
      s.phase = "handoff";
    }
    if (t >= T.hand.ticket) s.ticket = smooth((t - T.hand.ticket) / 0.9);
    if (t >= hang) {
      s.b = ["staff", "ai", clamp01((t - hang) / T.travel)];
      s.ticketFade = 1 - smooth((t - hang - 0.2) / 0.6);
      s.lamps.staff = 0;
    }
  }
  if (t >= hang + T.travel + 0.4) s.phase = "idle";
  if (t < T.ring) s.phase = "idle";
  return s;
}

/** A resting pose for stills (reduced motion, offscreen first paint): the call answered and booked. */
export const STILL = {
  loop: 0,
  a: ["park", "l2", 1],
  b: ["ai", "staff", 0],
  dial: CALL_DIALECT,
  lamps: { l2: 0.32, ai: 1, staff: 0 },
  speak: 0,
  stamp: 0,
  mark: 1,
  ticket: 0,
  ticketFade: 1,
  phase: "booked",
};

// ---------------------------------------------------------------- the cord
/** Sag grows with the span, like a cord pulled across the board. */
export const sagOf = (span) => 7 + 0.1 * Math.abs(span);

/**
 * The patch cord's centreline between two plug tails (world points on the boot
 * end faces). It leaves each boot straight toward the operator, then hangs in
 * two cubic spans that meet level at the bottom of the loop.
 */
export function cordRoute(ta, tb, samples = 18) {
  const sag = sagOf(tb[0] - ta[0]);
  const out = 2.2;
  const ea = [ta[0], ta[1] + out, ta[2]];
  const eb = [tb[0], tb[1] + out, tb[2]];
  const m = [(ea[0] + eb[0]) / 2, Math.max(ea[1], eb[1]) + 7, (ea[2] + eb[2]) / 2 - sag];
  const half = (eb[0] - ea[0]) / 2;
  const cubic = (p0, p1, p2, p3, u) => [0, 1, 2].map((k) => (1 - u) ** 3 * p0[k] + 3 * (1 - u) ** 2 * u * p1[k] + 3 * (1 - u) * u * u * p2[k] + u ** 3 * p3[k]);
  const spanA = [ea, [ea[0], ea[1] + 6, ea[2]], [m[0] - half * 0.55, m[1], m[2]], m];
  const spanB = [m, [m[0] + half * 0.55, m[1], m[2]], [eb[0], eb[1] + 6, eb[2]], eb];
  const points = [ta];
  for (let i = 0; i <= samples; i++) points.push(cubic(...spanA, i / samples));
  for (let i = 1; i <= samples; i++) points.push(cubic(...spanB, i / samples));
  points.push(tb);
  return points;
}
