import { DOCS, DRAWERS, MOTION, QUESTIONS, TOUR, WORDS, type Job, type Locale } from "./model";

/**
 * The knowledge press, live. Framework-free on purpose: the React wrapper
 * (live.tsx) and the standalone verification page both call mountKbPress, so
 * the motion that is checked is the motion that ships. It only writes
 * transforms, opacity, data-lit and text: no geometry runs in the browser.
 */

type Vec = [number, number];

export interface LiveData {
  axes: { x: Vec; y: Vec; z: Vec };
  armPark: number;
  armAt: number[];
  transitAt: number[];
  feeds: { dx: number; dz: number }[];
}

interface Spring {
  x: number;
  v: number;
  t: number;
  tau: number;
  eps: number;
}

const spring = (x: number, tau: number, eps = 0.01): Spring => ({ x, v: 0, t: x, tau, eps });

function stepSpring(s: Spring, dt: number, calm: boolean) {
  if (calm) {
    s.x = s.t;
    s.v = 0;
    return;
  }
  const w = 1 / s.tau;
  const slice = dt / 4;
  for (let step = 0; step < 4; step++) {
    s.v += (w * w * (s.t - s.x) - 2 * w * s.v) * slice;
    s.x += s.v * slice;
  }
  if (Math.abs(s.t - s.x) < s.eps && Math.abs(s.v) < s.eps * 4) {
    s.x = s.t;
    s.v = 0;
  }
}

const arrived = (s: Spring) => s.x === s.t && s.v === 0;
/** Close enough for the next step to start: the spring keeps settling underneath it. */
const near = (s: Spring) => Math.abs(s.t - s.x) < s.eps * 30 && Math.abs(s.v) < s.eps * 120;
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const r2 = (value: number) => Math.round(value * 100) / 100;

interface Step {
  start?: () => void;
  done?: () => boolean;
  hold?: number;
}

class Track {
  private queue: Step[] = [];
  private current: Step | null = null;
  private started = false;
  private held = 0;
  run(steps: Step[]) {
    this.queue = steps.slice();
    this.current = null;
  }
  get busy() {
    return this.current !== null || this.queue.length > 0;
  }
  tick(dt: number, calm: boolean) {
    for (let guard = 0; guard < 32; guard++) {
      if (!this.current) {
        const next = this.queue.shift();
        if (!next) return;
        this.current = next;
        this.started = false;
        this.held = 0;
      }
      if (!this.started) {
        this.started = true;
        this.current.start?.();
        if (!this.current) continue;
      }
      if (this.current.done && !this.current.done()) return;
      if (!calm && this.current.hold && this.held < this.current.hold) {
        this.held += dt;
        return;
      }
      this.current = null;
    }
  }
}

export interface Options {
  locale: Locale;
  /** Where the question buttons and the status line live; defaults to the enclosing .iso-figure. */
  scope?: Element | null;
}

export function mountKbPress(root: HTMLElement, data: LiveData, { locale, scope }: Options) {
  const W = WORDS[locale];
  const rtl = locale === "ar";
  const figure = scope ?? root.closest(".iso-figure") ?? root;
  const readout = root.closest(".iso-plate")?.querySelector<HTMLElement>("[data-readout]") ?? null;
  const status = figure.querySelector<HTMLElement>("[data-kb-status]");
  const buttons = Array.from(figure.querySelectorAll<HTMLButtonElement>("[data-kb-ask]"));
  const node = (name: string) => root.querySelector<SVGGElement>(`[data-kb="${name}"]`);
  const arm = node("arm");
  const head = node("head");
  const platen = node("platen");
  const transit = node("transit");
  const drawers = Array.from({ length: DRAWERS }, (_, index) => node(`drawer.${index}`));
  const lifts = Array.from({ length: DRAWERS }, (_, index) => node(`lift.${index}`));
  const homes = lifts.map((lift) => (lift?.parentNode ? { parent: lift.parentNode, next: lift.nextSibling } : null));
  const high = root.querySelector<SVGGElement>('[data-kb-slot="lift"]');
  const docs = DOCS.map((_, index) => node(`doc.${index}`));
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const E = MOTION.ease;
  const S = {
    arm: spring(data.armPark, E.arm),
    head: spring(MOTION.up, E.head),
    drawers: Array.from({ length: DRAWERS }, () => spring(0, E.drawer)),
    platen: spring(0, E.platen),
    feeds: DOCS.map(() => spring(0, E.feed, 0.002)),
    fades: DOCS.map(() => spring(1, E.fade, 0.004)),
    tx: spring(0, E.transit),
    tz: spring(0, E.drop),
  };
  let carrying: number | null = null;
  /** The question being asked, and the question whose card is in the picker: the readout names a card only when they agree. */
  let asked: number | null = null;
  let held: number | null = null;
  let answered = false;
  let ingest: number | null = null;
  let phase: "feed" | "press" | "file" | null = null;
  let transitTo = 0;

  const retrieval = new Track();
  const intake = new Track();
  const tour = new Track();

  const put = (q: number) => W.spoken(q);
  const say = (text: string) => {
    if (status && status.textContent !== text) status.textContent = text;
  };

  function putBackSteps(): Step[] {
    return [
      { start: () => carrying !== null && (S.head.t = 0), done: () => carrying === null || arrived(S.head) },
      {
        start: () => {
          answered = false;
          carrying = null;
          held = null;
          S.head.t = MOTION.up;
        },
        done: () => near(S.head),
      },
    ];
  }

  function returnSteps(): Step[] {
    return [{ start: () => (asked = null) }, ...putBackSteps(), { start: () => S.drawers.forEach((s) => (s.t = 0)), done: () => S.drawers.every(near) }];
  }

  function askSteps(q: number): Step[] {
    const d = QUESTIONS[q]!.drawer;
    return [
      { start: () => (asked = q) },
      ...putBackSteps(),
      {
        start: () => {
          S.drawers.forEach((s, index) => index !== d && (s.t = 0));
          S.arm.t = data.armAt[d]!;
        },
        done: () => near(S.arm) && S.drawers.every((s, index) => index === d || near(s)),
      },
      { start: () => (S.drawers[d]!.t = MOTION.open), done: () => near(S.drawers[d]!) },
      { start: () => (S.head.t = 0), done: () => arrived(S.head) },
      {
        start: () => {
          carrying = d;
          held = q;
          S.head.t = MOTION.up;
        },
        done: () => near(S.head),
      },
      {
        start: () => {
          answered = true;
          say(put(q));
        },
      },
    ];
  }

  function ingestSteps(k: number): Step[] {
    return [
      {
        start: () => {
          ingest = k;
          phase = "feed";
          S.fades[k]!.t = 1;
          S.feeds[k]!.t = 1;
        },
        done: () => near(S.feeds[k]!),
      },
      { start: () => ((phase = "press"), (S.platen.t = MOTION.stroke)), done: () => near(S.platen), hold: MOTION.hold.pressed },
      { start: () => (S.fades[k]!.t = 0), done: () => near(S.fades[k]!) },
      {
        start: () => {
          S.platen.t = 0;
          transitTo = DOCS[k]!.drawer;
          S.tx.x = S.tx.t = 0;
          S.tz.x = S.tz.t = 0;
          phase = "file";
          S.tx.t = data.transitAt[transitTo]!;
        },
        done: () => near(S.tx),
      },
      { start: () => (S.tz.t = -MOTION.drop), done: () => near(S.tz) },
      {
        start: () => {
          S.tx.x = S.tx.t = 0;
          S.tz.x = S.tz.t = 0;
          S.tx.v = S.tz.v = 0;
          ingest = null;
          phase = null;
        },
      },
    ];
  }

  function restockSteps(): Step[] {
    return [
      {
        start: () =>
          DOCS.forEach((_, k) => {
            S.feeds[k]!.x = S.feeds[k]!.t = 0;
            S.feeds[k]!.v = 0;
            S.fades[k]!.t = 1;
          }),
        done: () => S.fades.every(arrived),
      },
    ];
  }

  let tourAt = 0;
  function jobSteps(job: Job): Step[] {
    const wait: Step = { done: () => !retrieval.busy && !intake.busy, hold: MOTION.hold.between };
    if (job.kind === "ingest") return [wait, { start: () => intake.run(ingestSteps(job.doc)) }, { done: () => !intake.busy }];
    if (job.kind === "restock") return [wait, { start: () => intake.run(restockSteps()) }, { done: () => !intake.busy }];
    return [
      wait,
      { start: () => retrieval.run(askSteps(job.question)) },
      { done: () => !retrieval.busy, hold: MOTION.hold.answer },
      { start: () => retrieval.run(returnSteps()) },
      { done: () => !retrieval.busy },
    ];
  }
  function nextJob(): Step[] {
    const job = TOUR[tourAt % TOUR.length]!;
    tourAt++;
    return [...jobSteps(job), { start: () => touring && tour.run(nextJob()) }];
  }

  let touring = false;
  let engaged = false;
  let quiet = 0;
  function startTour(delay: number) {
    window.clearTimeout(quiet);
    if (still.matches) return;
    quiet = window.setTimeout(() => {
      if (engaged || still.matches) return;
      touring = true;
      const back = answered || carrying !== null ? [{ start: () => retrieval.run(returnSteps()) }, { done: () => !retrieval.busy }] : [];
      tour.run([...back, ...nextJob()]);
      run();
    }, delay * 1000);
  }
  function takeOver() {
    touring = false;
    tour.run([]);
    startTour(MOTION.hold.back);
  }

  /* drawing */
  const shown = new Map<Element, string>();
  const place = (el: Element | null, [x, y, z]: [number, number, number]) => {
    if (!el) return;
    const { axes } = data;
    const sx = r2(axes.x[0] * x + axes.y[0] * y + axes.z[0] * z);
    const sy = r2(axes.x[1] * x + axes.y[1] * y + axes.z[1] * z);
    const text = sx || sy ? `translate(${sx} ${sy})` : "";
    if (shown.get(el) === text) return;
    shown.set(el, text);
    if (text) el.setAttribute("transform", text);
    else el.removeAttribute("transform");
  };
  const fade = (el: Element | null, alpha: number) => {
    if (!el) return;
    const text = alpha >= 0.999 ? "" : `${r2(alpha)}`;
    const style = (el as SVGGElement).style;
    if (style.opacity !== text) style.opacity = text;
  };
  const light = (el: Element | null, on: boolean) => {
    if (!el) return;
    el.querySelectorAll(".kb-litable").forEach((solid) => solid.toggleAttribute("data-lit", on));
  };

  function draw() {
    const armX = S.arm.x - data.armPark;
    place(arm, [armX, 0, 0]);
    place(head, [0, 0, S.head.x - MOTION.up]);
    const lift = carrying === null ? 0 : S.head.x;
    const lit = carrying !== null && lift > 0.6 ? carrying : null;
    S.drawers.forEach((s, index) => {
      place(drawers[index]!, [0, s.x, 0]);
      const node = lifts[index];
      const mine = carrying === index ? lift : 0;
      const up = mine >= MOTION.clear;
      const home = homes[index];
      if (node && high && home) {
        if (up && node.parentNode !== high) high.appendChild(node);
        else if (!up && node.parentNode !== home.parent) home.parent.insertBefore(node, home.next);
      }
      place(node, [0, up ? s.x : 0, mine]);
      light(node, lit === index);
    });
    place(platen, [0, 0, -S.platen.x]);
    DOCS.forEach((_, k) => {
      const s = S.feeds[k]!.x;
      const feed = data.feeds[k]!;
      place(docs[k]!, [feed.dx * s, 0, feed.dz * smooth(0.78, 1, s)]);
      fade(docs[k]!, S.fades[k]!.x);
      light(docs[k]!, lit === null && ingest === k && (phase === "feed" || phase === "press"));
    });
    place(transit, [S.tx.x, 0, S.tz.x]);
    light(transit, lit === null && phase === "file");
    const text =
      held !== null && held === asked && lift >= MOTION.clear
        ? W.answer(held)
        : asked !== null && retrieval.busy
          ? W.ask(asked)
          : ingest !== null
            ? phase === "file"
              ? W.file(ingest)
              : W.feed(ingest)
            : W.ready;
    if (readout && readout.textContent !== text) readout.textContent = text;
    buttons.forEach((button) => {
      const pressed = `${Number(button.dataset.kbAsk) === asked}`;
      if (button.getAttribute("aria-pressed") !== pressed) button.setAttribute("aria-pressed", pressed);
    });
  }

  /* loop */
  let frame = 0;
  let last = 0;
  let visible = false;
  const all = () => [S.arm, S.head, ...S.drawers, S.platen, ...S.feeds, ...S.fades, S.tx, S.tz];
  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    tour.tick(dt, calm);
    intake.tick(dt, calm);
    retrieval.tick(dt, calm);
    for (const s of all()) stepSpring(s, dt, calm);
    draw();
    const busy = tour.busy || intake.busy || retrieval.busy || !all().every(arrived);
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  }
  function run() {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  /* input */
  const ask = (q: number) => {
    takeOver();
    retrieval.run(askSteps(((q % QUESTIONS.length) + QUESTIONS.length) % QUESTIONS.length));
    run();
  };
  const putBack = () => {
    takeOver();
    retrieval.run(returnSteps());
    run();
  };
  const onClick = (event: Event) => {
    const button = (event.target as Element | null)?.closest<HTMLElement>("[data-kb-ask]");
    if (!button || !figure.contains(button)) return;
    ask(Number(button.dataset.kbAsk));
  };
  const onDrawer = (event: Event) => {
    const group = (event.target as Element | null)?.closest<SVGGElement>("[data-kb-drawer]");
    if (!group) return;
    const q = QUESTIONS.findIndex((item) => item.drawer === Number(group.dataset.kbDrawer));
    if (q >= 0) ask(q);
  };
  const onKey = (event: KeyboardEvent) => {
    const current = asked ?? -1;
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    let q: number | null = null;
    if (event.key === forward || event.key === "ArrowDown") q = current + 1;
    else if (event.key === back || event.key === "ArrowUp") q = current < 0 ? QUESTIONS.length - 1 : current - 1;
    else if (event.key === "Home") q = 0;
    else if (event.key === "End") q = QUESTIONS.length - 1;
    else if (/^[1-9]$/.test(event.key) && Number(event.key) <= QUESTIONS.length) q = Number(event.key) - 1;
    else if (event.key === "Enter" || event.key === " ") q = current < 0 ? 0 : current;
    else if (event.key === "Escape") {
      event.preventDefault();
      putBack();
      return;
    }
    if (q === null) return;
    event.preventDefault();
    ask(q);
  };
  const onEnter = () => {
    engaged = true;
    window.clearTimeout(quiet);
    touring = false;
  };
  const onLeave = () => {
    engaged = false;
    startTour(MOTION.hold.back);
  };
  const onFocus = () => {
    onEnter();
    if (status && !status.textContent) say(held !== null && answered ? put(held) : W.ready);
  };
  const onStill = () => {
    if (still.matches) {
      touring = false;
      tour.run([]);
      window.clearTimeout(quiet);
    } else startTour(MOTION.hold.first);
    run();
  };

  figure.addEventListener("click", onClick);
  root.addEventListener("click", onDrawer);
  root.addEventListener("keydown", onKey);
  root.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("focusin", onFocus);
  root.addEventListener("focusout", onLeave);
  still.addEventListener("change", onStill);

  const observer = new IntersectionObserver(
    (list) => {
      visible = Boolean(list[list.length - 1]?.isIntersecting);
      if (visible) run();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "120px 0px" },
  );
  observer.observe(root);

  if (still.matches) retrieval.run(askSteps(0));
  else startTour(MOTION.hold.first);

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    window.clearTimeout(quiet);
    figure.removeEventListener("click", onClick);
    root.removeEventListener("click", onDrawer);
    root.removeEventListener("keydown", onKey);
    root.removeEventListener("pointerenter", onEnter);
    root.removeEventListener("pointerleave", onLeave);
    root.removeEventListener("focusin", onFocus);
    root.removeEventListener("focusout", onLeave);
    still.removeEventListener("change", onStill);
  };
}
