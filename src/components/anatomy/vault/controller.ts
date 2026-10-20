/**
 * The Gulf vault's live controller: plain DOM, no React, no geometry.
 *
 * Every moving part was drawn once on the server; this only writes
 * transforms, a few path strings in flat face coordinates, data attributes
 * and the readout. It takes plain numbers (LiveData) so the standalone
 * verification page and the site run the very same code.
 */
import type { LiveData } from "./geometry";
import type { VaultText } from "./model";

type Vec = [number, number, number];

interface Printed {
  line: number;
  role: number;
  at: number;
}

interface Action {
  kind: "use" | "back";
  role: number;
  t: number;
  said: number;
}

const USE = { turn: 0.4, print: 1.25, feed: 1.75, back: 1.55, done: 2 };
const BACK = { hit: 0.2, hold: 0.95, done: 1.4 };
const TOUR_FIRST = 1400;
const TOUR_BACK = 3600;
const TOUR: Array<["use", number] | ["back", number] | ["wait", number]> = [
  ["use", 0],
  ["wait", 1.5],
  ["use", 2],
  ["wait", 1.5],
  ["back", 0],
  ["wait", 1.8],
  ["use", 1],
  ["wait", 1.5],
  ["back", 0],
  ["wait", 2.4],
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const ease = (t: number) => {
  const u = clamp(t, 0, 1);
  return u * u * (3 - 2 * u);
};
const f2 = (v: number) => Math.round(v * 100) / 100;
const f3 = (v: number) => Math.round(v * 1000) / 1000;
const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const fill = (template: string, n: number) => template.replace("{n}", String(n));

export function mountVault(root: HTMLElement, data: LiveData, text: VaultText): () => void {
  const stage = root.querySelector<HTMLElement>(".vlt-stage");
  const svg = root.querySelector<SVGSVGElement>("svg");
  if (!stage || !svg) return () => {};
  const readout = root.querySelector<HTMLElement>("[data-readout]");
  const status = root.querySelector<HTMLElement>("[data-status]");
  const bows = [...svg.querySelectorAll<SVGGElement>('[data-part="bow"]')];
  const wheelRot = [...svg.querySelectorAll<SVGGElement>('[data-part="wheel"] [data-rot]')];
  const pawlRot = [...svg.querySelectorAll<SVGGElement>('[data-part="pawl"] [data-rot]')];
  const crankRot = [...svg.querySelectorAll<SVGGElement>('[data-part="crank"] [data-rot]')];
  const pawls = [...svg.querySelectorAll<SVGGElement>('[data-part="pawl"]')];
  const knob = svg.querySelector<SVGGElement>('[data-part="knob"]');
  const head = svg.querySelector<SVGGElement>('[data-part="head"]');
  const older = svg.querySelector<SVGPathElement>('[data-part="older"]');
  const newest = svg.querySelector<SVGPathElement>('[data-part="newest"]');
  const stripLines = [...svg.querySelectorAll<SVGPathElement>('[data-part="strip-line"]')];
  const roleDots = [...svg.querySelectorAll<SVGGElement>("[data-role-dots]")];
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const D = data;
  const toRad = Math.PI / 180;
  const printed: Printed[] = [];
  /* Seed the whole tape, from the print row to the top of the strip (D.tapeLines), so the rest pose has no gap at the top;
     keep two more than that, so a line is only dropped once it has left through the strip's top fade. */
  const keep = D.tapeLines + 2;
  for (let line = D.firstLine; line > D.firstLine - D.tapeLines; line--) printed.push({ line, role: ((line % 3) + 3) % 3, at: -(D.firstLine + 1 - line) * D.pitch });

  let base = D.wheelRest;
  let theta = D.wheelRest;
  let count = D.firstLine;
  let selected = 0;
  const keyAngle = [0, 0, 0];
  let headAt = 0;
  let grow = 1;
  let action: Action | null = null;
  const queue: Action[] = [];
  let touring = false;
  let tourStep = 0;
  let tourWait = 0;
  let visible = false;
  let engaged = false;
  let frame = 0;
  let last = 0;
  let tourTimer = 0;
  let drawn = "";

  const fed = () => (theta - D.wheelRest) * toRad * D.rollR;

  function say(line: string) {
    if (readout && readout.textContent !== line) readout.textContent = line;
  }
  function announce(line: string) {
    if (status) status.textContent = line;
  }

  /**
   * The pawl's lift (degrees about its pin) on a wheel at `wheel`, read from
   * the table the server solved from the drawn teeth and pawl (geometry.ts
   * liftOf does the same), never blended across the click.
   */
  function pawlLift(wheel: number) {
    const u = (((wheel - D.wheelRest) % D.tooth) + D.tooth) % D.tooth;
    const f = u / D.liftStep;
    const i = Math.min(D.lift.length - 2, Math.floor(f));
    const a = D.lift[i]!;
    const b = D.lift[i + 1]!;
    if (i * D.liftStep < D.liftClick && D.liftClick <= (i + 1) * D.liftStep) return u < D.liftClick ? a : b;
    return a + (b - a) * (f - i);
  }

  function keyMatrix(i: number, deg: number, w: number) {
    const a = deg * toRad;
    const dx = Math.sin(a) * D.ey[0] + Math.cos(a) * D.ez[0];
    const dy = Math.sin(a) * D.ey[1] + Math.cos(a) * D.ez[1];
    const n: Vec = [0, Math.cos(a), -Math.sin(a)];
    const sign = dot(n, D.view as Vec) >= 0 ? 1 : -1;
    const oy = D.keyY[i]! + sign * w * n[1];
    const oz = D.keyZ + sign * w * n[2];
    const ox = D.origin[0] + D.keyFace * D.ex[0] + oy * D.ey[0] + oz * D.ez[0];
    const oyS = D.origin[1] + D.keyFace * D.ex[1] + oy * D.ey[1] + oz * D.ez[1];
    const shade = bandOf(dot([0, sign * n[1], sign * n[2]], D.light as Vec));
    return { m: `matrix(${f3(D.ex[0])} ${f3(D.ex[1])} ${f3(dx)} ${f3(dy)} ${f3(ox)} ${f3(oyS)})`, shade };
  }

  function bandOf(score: number) {
    let tone = 0;
    while (tone < D.bands.length && score >= D.bands[tone]!) tone++;
    return tone;
  }

  function lineOf(role: number, z: number, share = 1) {
    const words = D.words[role]!;
    const start = D.tapeX[0] + 3;
    const end = start + (words.reduce((a, b) => a + b + 2, 0) - 2) * share;
    let x = start;
    let d = "";
    for (const w of words) {
      const to = Math.min(x + w, end);
      if (to - x > 0.05) d += `M${f2(x)} ${f2(-z)}H${f2(to)}`;
      x += w + 2;
      if (x >= end) break;
    }
    return d;
  }

  function drawTape() {
    const s = fed();
    const key = `${f3(s)}|${f3(grow)}|${printed[0]!.line}`;
    if (key === drawn) return;
    drawn = key;
    let old = "";
    let top = "";
    let slot = 0;
    printed.forEach((entry, index) => {
      const z = D.printZ + (s - entry.at);
      if (z <= D.windowTop + 2) {
        if (index === 0) top = lineOf(entry.role, z, grow);
        else old += lineOf(entry.role, z);
      } else if (z > D.stripFrom - 1 && z < D.stripTop && slot < stripLines.length) {
        const path = stripLines[slot++]!;
        path.setAttribute("d", lineOf(entry.role, z));
        path.setAttribute("opacity", String(f2(ease((D.stripTop - z) / 3.5))));
      }
    });
    for (; slot < stripLines.length; slot++) stripLines[slot]!.setAttribute("d", "");
    if (printed.length > keep) printed.length = keep;
    older?.setAttribute("d", old);
    newest?.setAttribute("d", top);
  }

  let shown = "";
  function draw() {
    const state = `${f3(theta)}|${keyAngle.map(f2).join(",")}|${f3(headAt)}|${f3(grow)}|${selected}|${count}`;
    if (state === shown) return;
    shown = state;
    const spin = theta - D.wheelRest;
    const wheelT = `rotate(${f2(theta)} 0 0)`;
    wheelRot.forEach((g) => g.setAttribute("transform", wheelT));
    const lift = pawlLift(theta);
    const pawlT = `rotate(${f2(lift)} ${D.pivot[0]} ${D.pivot[1]})`;
    pawlRot.forEach((g) => g.setAttribute("transform", pawlT));
    const crankT = `rotate(${f2(spin)} 0 0)`;
    crankRot.forEach((g) => g.setAttribute("transform", crankT));
    if (knob) {
      const a0 = D.crankRest * toRad;
      const a1 = (D.crankRest + spin) * toRad;
      const du = D.crankR * (Math.cos(a1) - Math.cos(a0));
      const dv = D.crankR * (Math.sin(a1) - Math.sin(a0));
      const sx = du * D.side.u[0] + dv * D.side.v[0];
      const sy = du * D.side.u[1] + dv * D.side.v[1];
      knob.setAttribute("transform", `translate(${f2(sx)} ${f2(sy)})`);
    }
    bows.forEach((bow, i) => {
      const deg = keyAngle[i]!;
      bow.querySelectorAll<SVGGElement>("[data-layer]").forEach((layer, index, all) => {
        const { m, shade } = keyMatrix(i, deg, Number(layer.dataset.layer));
        layer.setAttribute("transform", m);
        const face = layer.querySelector<SVGPathElement>("path");
        if (!face) return;
        const front = index === all.length - 1;
        const tone = front ? shade : shade >= 4 ? 1 : Math.max(0, shade - 1);
        if (tone >= 4) {
          face.setAttribute("class", front ? "vlt-face iso-top" : "iso-top");
          face.removeAttribute("data-shade");
        } else {
          face.setAttribute("class", front ? "vlt-face iso-shade" : "iso-shade");
          face.setAttribute("data-shade", String(tone));
        }
      });
      bow.toggleAttribute("data-lit", deg > 4);
    });
    if (head) head.setAttribute("transform", `translate(${f2(headAt * D.headTravel * D.ex[0])} ${f2(headAt * D.headTravel * D.ex[1])})`);
    roleDots.forEach((g, i) => g.toggleAttribute("data-on", i === selected));
    drawTape();
  }

  function setFocus(on: "line" | "key" | "pawl") {
    root.setAttribute("data-focus", on);
    pawls.forEach((slice) => slice.toggleAttribute("data-lit", on === "pawl"));
  }

  function begin(next: Action) {
    action = next;
    if (next.kind === "use") {
      selected = next.role;
      say(text.turning[next.role]!);
      setFocus("key");
    } else {
      say(text.pushing);
      setFocus("pawl");
    }
  }

  function finish() {
    if (!action) return;
    if (action.kind === "use") {
      keyAngle[action.role] = 0;
      headAt = 0;
      grow = 1;
      theta = base;
      say(fill(text.printed[action.role]!, count));
      setFocus("line");
    } else {
      theta = base;
      say(text.held);
      setFocus("line");
    }
    action = null;
  }

  function stepAction(dt: number, calm: boolean) {
    if (!action && queue.length) begin(queue.shift()!);
    const a = action;
    if (!a) return false;
    if (calm) {
      if (a.kind === "use") {
        count++;
        printed.unshift({ line: count, role: a.role, at: fed() });
        base += D.tooth;
        announce(fill(text.announcePrinted[a.role]!, count));
      } else announce(text.announceHeld);
      finish();
      return queue.length > 0;
    }
    a.t += dt;
    const t = a.t;
    if (a.kind === "use") {
      keyAngle[a.role] = t < USE.back ? 90 * ease(t / USE.turn) : 90 * (1 - ease((t - USE.back) / (USE.done - USE.back - 0.05)));
      if (t >= USE.turn && a.said === 0) {
        a.said = 1;
        count++;
        printed.unshift({ line: count, role: a.role, at: fed() });
        grow = 0;
        say(fill(text.printed[a.role]!, count));
        setFocus("line");
      }
      if (a.said >= 1) {
        const sweep = clamp((t - USE.turn) / (USE.print - USE.turn), 0, 1);
        const span = D.words[a.role]!.reduce((x, y) => x + y + 2, 0) - 2;
        const reach = D.tapeX[0] + 1.5 + ease(sweep) * D.headTravel - (D.tapeX[0] + 3);
        grow = clamp(reach / span, 0, 1);
        headAt = t < USE.print ? ease(sweep) : 1 - ease((t - USE.print) / (USE.feed - USE.print - 0.1));
      }
      if (t >= USE.print) {
        if (a.said === 1) {
          a.said = 2;
          grow = 1;
          announce(fill(text.announcePrinted[a.role]!, count));
        }
        theta = base + D.tooth * ease((t - USE.print) / (USE.feed - USE.print));
      }
      if (t >= USE.done) {
        base += D.tooth;
        finish();
      }
    } else {
      /* The wheel turns back until a steep face meets the pawl, rebounds off it (never into it) and is held. */
      const stop = D.hold;
      if (t < BACK.hit) theta = base - stop * Math.pow(t / BACK.hit, 2);
      else if (t < BACK.hold) {
        const since = t - BACK.hit;
        theta = base - stop + stop * 0.18 * Math.exp(-since * 14) * Math.abs(Math.sin(since * 40));
        if (a.said === 0) {
          a.said = 1;
          say(text.held);
          announce(text.announceHeld);
        }
      } else theta = base - stop * (1 - ease((t - BACK.hold) / (BACK.done - BACK.hold)));
      if (t >= BACK.done) finish();
    }
    return true;
  }

  function tourTick(dt: number) {
    if (!touring || action || queue.length) return;
    tourWait -= dt;
    if (tourWait > 0) return;
    const [kind, value] = TOUR[tourStep % TOUR.length]!;
    tourStep++;
    if (kind === "wait") tourWait = value;
    else queue.push({ kind, role: value, t: 0, said: 0 });
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
    last = now;
    const calm = still.matches;
    tourTick(dt);
    const busy = stepAction(dt, calm);
    draw();
    frame = visible && (busy || touring || action !== null || queue.length > 0) ? requestAnimationFrame(tick) : 0;
  }

  function run() {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  function startTour(delay: number) {
    window.clearTimeout(tourTimer);
    if (still.matches) return;
    tourTimer = window.setTimeout(() => {
      if (engaged) return;
      touring = true;
      tourWait = 0;
      run();
    }, delay);
  }

  function takeOver() {
    touring = false;
    window.clearTimeout(tourTimer);
    if (!engaged) startTour(TOUR_BACK);
  }

  function use(role: number) {
    takeOver();
    if (queue.length > 1) return;
    queue.push({ kind: "use", role, t: 0, said: 0 });
    run();
  }

  function pushBack() {
    takeOver();
    if (queue.length > 1) return;
    queue.push({ kind: "back", role: selected, t: 0, said: 0 });
    run();
  }

  function select(next: number) {
    takeOver();
    selected = (next + 3) % 3;
    if (!action) say(text.ready[selected]!);
    draw();
  }

  const onKey = (event: KeyboardEvent) => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const k = event.key;
    if (k === "ArrowRight" || k === "ArrowUp") select(selected - 1);
    else if (k === "ArrowLeft" || k === "ArrowDown") select(selected + 1);
    else if (k === "Enter" || k === " ") {
      if (event.repeat) return;
      use(selected);
    } else if (k === "Backspace" || k === "Delete") pushBack();
    else if (k === "Escape") takeOver();
    else return;
    event.preventDefault();
  };
  const onDown = (event: PointerEvent) => {
    const target = event.target as Element | null;
    const hit = target?.closest<SVGElement>("[data-hit]");
    if (!hit) return;
    const what = hit.getAttribute("data-hit");
    if (what === "crank") pushBack();
    else if (what !== null) use(Number(what));
  };
  const onOver = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const hit = (event.target as Element | null)?.closest<SVGElement>("[data-hit]");
    const what = hit?.getAttribute("data-hit");
    if (what && what !== "crank" && Number(what) !== selected && !action) select(Number(what));
  };
  const engage = () => {
    engaged = true;
    touring = false;
    window.clearTimeout(tourTimer);
  };
  const release = () => {
    engaged = false;
    startTour(TOUR_BACK);
  };
  const onFocus = () => {
    engage();
    announce(fill(text.rest, count));
  };

  stage.addEventListener("keydown", onKey);
  stage.addEventListener("pointerdown", onDown);
  stage.addEventListener("pointerover", onOver);
  stage.addEventListener("pointerenter", engage);
  stage.addEventListener("pointerleave", release);
  stage.addEventListener("focus", onFocus);
  stage.addEventListener("blur", release);

  const observer = new IntersectionObserver(
    (entries) => {
      visible = Boolean(entries[entries.length - 1]?.isIntersecting);
      if (visible) run();
      else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "120px 0px" },
  );
  observer.observe(stage);
  setFocus("line");
  say(fill(text.rest, count));
  draw();
  startTour(TOUR_FIRST);

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    window.clearTimeout(tourTimer);
    stage.removeEventListener("keydown", onKey);
    stage.removeEventListener("pointerdown", onDown);
    stage.removeEventListener("pointerover", onOver);
    stage.removeEventListener("pointerenter", engage);
    stage.removeEventListener("pointerleave", release);
    stage.removeEventListener("focus", onFocus);
    stage.removeEventListener("blur", release);
  };
}
