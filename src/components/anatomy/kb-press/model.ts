/**
 * The knowledge press: the pure model. No DOM, no kit, no imports, so the
 * server art, the client motion and the standalone verification build all
 * read the same numbers and the same words.
 *
 * Claim boundary (KnowledgeBasePage.tsx, blueprint §10.8): answering from the
 * knowledge base is claimable on text chat channels and in the dashboard's
 * retrieval test, not on live calls. Every word below says "customer asks",
 * never "caller", and the caption scopes it to text chat. The questions and
 * card names are the site's own examples (KnowledgeBasePage.tsx: opening
 * hours, the price list, the 45-minute whitening session, the cancellation
 * policy), shown as illustrative, never as customer data.
 */

export type Locale = "ar" | "en";

/** Four drawers, left to right on the bench. */
export const DRAWERS = 4;

/** The files the press takes, as the site lists them: PDF, Word, and a page from your site by link. */
export type DocKind = "pdf" | "word" | "link";

export interface Doc {
  kind: DocKind;
  /** The drawer its card drops into. */
  drawer: number;
}

/** Fed top first: the link tag lies on the Word page, which lies on the PDF bundle. */
export const DOCS: Doc[] = [
  { kind: "link", drawer: 0 },
  { kind: "word", drawer: 2 },
  { kind: "pdf", drawer: 1 },
];

export interface Question {
  drawer: number;
}

/** One question per drawer; question n is answered by the front card of drawer n. */
export const QUESTIONS: Question[] = [{ drawer: 0 }, { drawer: 1 }, { drawer: 2 }, { drawer: 3 }];

/** Motion constants in world units (about 1 px of the drawn object) and seconds. */
export const MOTION = {
  /** How far a drawer slides out so its front card stands under the picker. */
  open: 42,
  /** The picker head's travel: 0 grips the card's tab, `up` is its parked height. */
  up: 22,
  /** A lifted card's bottom passes the drawer front's top at this lift: from here on it is drawn over the cabinet top. */
  clear: 15.4,
  /** The press platen's stroke, down onto the sheet on the bed. */
  stroke: 9.4,
  /** How far a card sinks through its slot: deep enough that nothing is left above the cabinet top. */
  drop: 21,
  /** Easing time constants. */
  ease: { arm: 0.32, drawer: 0.22, head: 0.2, platen: 0.09, feed: 0.34, transit: 0.4, drop: 0.16, fade: 0.14 },
  /** Holds. */
  hold: { answer: 2.6, pressed: 0.28, between: 0.9, first: 1.4, back: 3.6 },
};

interface Words {
  fig: string;
  title: string;
  hint: string;
  ready: string;
  stage: string;
  svg: string;
  asks: string;
  caption: string;
  keys: { lit: string; drawers: string; files: string };
  questions: string[];
  cards: string[];
  drawers: string[];
  docs: Record<DocKind, string>;
  ask: (question: number) => string;
  answer: (question: number) => string;
  feed: (doc: number) => string;
  file: (doc: number) => string;
  spoken: (question: number) => string;
}

const AR: Words = {
  fig: "شكل",
  title: "مكبس المعرفة",
  hint: "اختر سؤالاً من تحت",
  ready: "جاهز للسؤال",
  stage: "مكبس المعرفة: اختر سؤالاً تحت الشكل أو استخدم الأسهم، والذراع يسحب البطاقة اللي فيها الجواب.",
  svg: "مكبس مستندات وخزانة بطاقات على منضدة. على اليمين مكبس تدخله ملفات النشاط: ملف PDF، وصفحة Word، ووسم رابط لصفحة من الموقع. المكبس يقسّم الملف إلى بطاقات، وكل بطاقة تمشي على سكة فوق الخزانة وتنزل من فتحة في درجها. على اليسار أربعة أدراج معنونة: الدوام، الأسعار، الخدمات، السياسات. وفوقها ذراع على سكة يفتح الدرج الصحيح ويرفع البطاقة اللي فيها الجواب.",
  asks: "أسئلة توضيحية",
  caption:
    "ملفاتك — PDF وWord، وصفحة من موقعك برابط — تدخل المكبس، تتقسّم إلى بطاقات، وكل بطاقة تنزل في درجها المعنون. ولما يسأل عميلك في قنوات المحادثة النصية، الذراع يفتح الدرج الصحيح ويرفع البطاقة اللي فيها الجواب، ومعها مصدرها. الأسئلة والبطاقات أمثلة توضيحية.",
  keys: {
    lit: "البطاقة اللي ينبني منها الجواب",
    drawers: "أربعة أدراج: الدوام، الأسعار، الخدمات، السياسات",
    files: "ملف PDF، وصفحة Word، ووسم رابط",
  },
  questions: ["متى تفتحون؟", "كم الأسعار؟", "كم تاخذ جلسة التبييض؟", "أقدر ألغي موعدي؟"],
  cards: ["ساعات الدوام", "قائمة الأسعار", "مدة جلسة التبييض", "سياسة الإلغاء"],
  drawers: ["الدوام", "الأسعار", "الخدمات", "السياسات"],
  docs: { pdf: "ملف PDF", word: "صفحة Word", link: "رابط من موقعك" },
  ask: (q) => `سؤال: ${AR.questions[q]} ← …`,
  answer: (q) => `سؤال: ${AR.questions[q]} ← بطاقة: ${AR.cards[q]}`,
  feed: (d) => `${AR.docs[DOCS[d]!.kind]} ← يتقسّم بطاقات`,
  file: (d) => `بطاقة ← درج ${AR.drawers[DOCS[d]!.drawer]}`,
  spoken: (q) => `بطاقة ${AR.cards[q]}، من درج ${AR.drawers[QUESTIONS[q]!.drawer]}.`,
};

const EN: Words = {
  fig: "Fig",
  title: "The knowledge press",
  hint: "Pick a question below",
  ready: "Ready for a question",
  stage: "Knowledge press: pick a question below the figure or use the arrow keys, and the arm lifts the card that holds the answer.",
  svg: "A document press and a card cabinet on a bench. On the right, a press takes the business's files: a PDF bundle, a Word page and a link tag for a page of its website. The press splits each file into cards, and each card rides a track over the cabinet and drops through a slot into its drawer. On the left, four labelled drawers: hours, prices, services and policies. Above them an arm on a rail opens the right drawer and lifts the one card that holds the answer.",
  asks: "Illustrative questions",
  caption:
    "Your files (PDF and Word, plus a page of your website by link) go into the press, get split into cards, and each card drops into its labelled drawer. When a customer asks on your text chat channels, the arm opens the right drawer and lifts the one card that holds the answer, with its source. The questions and cards are illustrative examples.",
  keys: {
    lit: "The card the answer is built from",
    drawers: "Four drawers: hours, prices, services, policies",
    files: "A PDF file, a Word page and a link tag",
  },
  questions: ["When do you open?", "What are your prices?", "How long is a whitening session?", "Can I cancel my appointment?"],
  cards: ["Opening hours", "Price list", "Whitening session length", "Cancellation policy"],
  drawers: ["hours", "prices", "services", "policies"],
  docs: { pdf: "PDF file", word: "Word page", link: "Link to your site" },
  ask: (q) => `Q: ${EN.questions[q]} → …`,
  answer: (q) => `Q: ${EN.questions[q]} → card: ${EN.cards[q]}`,
  feed: (d) => `${EN.docs[DOCS[d]!.kind]} → split into cards`,
  file: (d) => `Card → ${EN.drawers[DOCS[d]!.drawer]} drawer`,
  spoken: (q) => `Card ${EN.cards[q]}, from the ${EN.drawers[QUESTIONS[q]!.drawer]} drawer.`,
};

export const WORDS: Record<Locale, Words> = { ar: AR, en: EN };

/** The tour: feed a file, ask the question its card answers, and so on; the policies question needs no file. */
export type Job = { kind: "ingest"; doc: number } | { kind: "ask"; question: number } | { kind: "restock" };

export const TOUR: Job[] = [
  { kind: "ingest", doc: 0 },
  { kind: "ask", question: 0 },
  { kind: "ingest", doc: 1 },
  { kind: "ask", question: 2 },
  { kind: "ingest", doc: 2 },
  { kind: "ask", question: 1 },
  { kind: "ask", question: 3 },
  { kind: "restock" },
];
