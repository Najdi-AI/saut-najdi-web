// The Najdi switchboard: the live behaviour, framework-free.
// The site's client component and the standalone verification page both call
// mountSwitchboard(), so what the checks film is what the visitor sees.
// It ships the kit's tube ribbon (the patch cord changes shape every frame) and
// the camera; every other path is static art from the server.
import { tubePieces, tubeSvg } from "../../iso/tube.mjs";
import { iso, pathOf, translateAlong } from "../../iso/iso-kit.mjs";
import { CALL_DIALECT, DIAL_HOME, STILL, TOUR_BACK, TOUR_FIRST, cordRoute, plugTravel, readoutOf, tourAt } from "./model.mjs";

const MOST_DT = 1 / 30;
const TRAVEL = 1.5;
const HOME = { a: ["", "park", 1], b: ["", "ai", 1], dial: DIAL_HOME, lamps: {}, speak: 0, stamp: 0, mark: 0, ticket: 0, phase: "idle" };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (current, target, dt, seconds, calm) => {
  if (calm) return target;
  const next = current + (target - current) * (1 - Math.exp(-dt / seconds));
  return Math.abs(target - next) < 1e-3 ? target : next;
};

/**
 * Mount the motion on a rendered switchboard.
 * @param {HTMLElement} root  the element holding the figure's <svg> (inside the card's .iso-plate)
 * @param {object} data       liveData() from geometry.mjs
 * @param {{ locale?: "ar" | "en", lines?: string[], onDial?: (dialect: string) => void }} options
 */
export function mountSwitchboard(root, data, { locale = "ar", lines = [], onDial } = {}) {
  const svg = root.querySelector("svg");
  const P = data.P;
  const q = (name) => svg.querySelector(`[data-live="${name}"]`);
  const nodes = {
    plugA: q("plugA"),
    plugB: q("plugB"),
    cord: q("cord"),
    pointer: q("pointer"),
    stamp: q("stamp"),
    head: q("head"),
    mark: q("mark"),
    ticket: q("ticket"),
    printlamp: q("printlamp"),
    cone: q("cone"),
    clapper: q("clapper"),
  };
  const glows = Object.fromEntries([...svg.querySelectorAll("[data-lamp]")].map((node) => [node.getAttribute("data-lamp"), node]));
  const plate = root.closest(".iso-plate");
  const readout = plate?.querySelector("[data-readout]");
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");

  const tail = (jack, offset) => [data.jacks[jack] + offset[0], data.jackFace + data.plugLen + offset[1], data.jackZ + offset[2]];
  const plugOffset = (track) => {
    const dx = data.jacks[track.to] - data.jacks[track.from];
    return { jack: track.from, offset: plugTravel(track.u, dx, data.plugOut) };
  };

  // what is shown, eased toward the targets each frame
  const shown = {
    a: { from: "park", to: "park", u: 1 },
    b: { from: "ai", to: "ai", u: 1 },
    angle: data.dial.angles[DIAL_HOME],
    spin: 0,
    lamps: { l1: 0, l2: 0, l3: 0, l4: 0, ai: 0, staff: 0 },
    stamp: 0,
    mark: 0,
    ticket: 0,
    ticketFade: 1,
    speak: 0,
    ring: 0,
  };
  let want = { ...HOME };
  let mode = "rest"; // rest (nothing has run) | tour | user (eased to `want`) | clip (following the voice)
  let homing = false; // easing home before the tour starts again
  let frozen = false; // verification only: the tour held at one moment
  let clock = 0;
  let wall = 0;
  let frame = 0;
  let last = 0;
  let visible = false;
  let engaged = false;
  let timer = 0;
  let userDial = null;
  let clip = { active: false, speaking: "", turn: -1, status: "idle" };
  let phaseShown = "idle";
  let dialShown = DIAL_HOME;
  let text = readout?.textContent ?? "";
  let cordKey = "";

  // ------------------------------------------------------------ drawing
  const setT = (node, t) => {
    if (node.getAttribute("transform") !== t) t ? node.setAttribute("transform", t) : node.removeAttribute("transform");
  };
  function placePlug(node, track, restJack) {
    if (!node) return;
    const { jack, offset } = plugOffset(track);
    const dx = data.jacks[jack] - data.jacks[restJack] + offset[0];
    setT(node, dx || offset[1] || offset[2] ? translateAlong(P, [dx, offset[1], offset[2]]) : "");
  }
  function drawCord() {
    if (!nodes.cord) return;
    const a = plugOffset(shown.a);
    const b = plugOffset(shown.b);
    const ta = tail(a.jack, a.offset);
    const tb = tail(b.jack, b.offset);
    const key = [...ta, ...tb].map((v) => v.toFixed(2)).join(",");
    if (key === cordKey) return;
    cordKey = key;
    // tubeSvg markup is built from numbers only: no visitor text reaches it
    const pieces = tubePieces(cordRoute(ta, tb), data.cordR, P, { maxLength: 400, spacing: 0.9 });
    nodes.cord.innerHTML = pieces.map((piece) => tubeSvg(piece, { tone: "mid" })).join("");
  }
  function drawPointer() {
    if (!nodes.pointer) return;
    const { x, y, z, r } = data.dial;
    const a = (shown.angle * Math.PI) / 180;
    const d = pathOf([iso([x, y, z], P), iso([x + Math.sin(a) * r, y - Math.cos(a) * r, z], P)]);
    if (nodes.pointer.getAttribute("d") !== d) nodes.pointer.setAttribute("d", d);
  }
  function shiftOf(vector) {
    const o = iso([0, 0, 0], P);
    const p = iso(vector, P);
    return [Math.round((p[0] - o[0]) * 100) / 100, Math.round((p[1] - o[1]) * 100) / 100];
  }
  /** Move a group by a world vector; a [data-hold] clip inside it stays put (the kit's holdStill). */
  function move(node, vector, held = false) {
    if (!node) return;
    const [dx, dy] = shiftOf(vector);
    setT(node, dx || dy ? `translate(${dx} ${dy})` : "");
    if (held) node.querySelectorAll("[data-hold]").forEach((h) => setT(h, dx || dy ? `translate(${-dx} ${-dy})` : ""));
  }
  const setOpacity = (node, value) => {
    if (!node) return;
    const v = `${Math.round(clamp(value, 0, 1) * 100) / 100}`;
    if (node.style.opacity !== v) node.style.opacity = v;
  };

  function draw() {
    placePlug(nodes.plugA, shown.a, "park");
    placePlug(nodes.plugB, shown.b, "ai");
    drawCord();
    drawPointer();
    move(nodes.stamp, [0, 0, -shown.stamp * data.stampStroke], true);
    move(nodes.head, [0, 0, -shown.stamp * data.stampStroke]);
    setOpacity(nodes.mark, shown.mark);
    move(nodes.ticket, [0, shown.ticket * data.ticketOut, 0], true);
    setOpacity(nodes.ticket, shown.ticket > 0.001 ? shown.ticketFade : 1);
    setOpacity(nodes.printlamp, shown.ticket > 0.02 ? shown.ticketFade : 0);
    for (const [name, node] of Object.entries(glows)) setOpacity(node, shown.lamps[name] ?? 0);
    // the cone moves with the agent's voice: a syllable rhythm under a slower phrase swell
    const cone = shown.speak * (0.55 + 0.45 * Math.sin(wall * 2 * Math.PI * 2.3)) * (0.5 + 0.5 * Math.sin(wall * 2 * Math.PI * 7.1));
    move(nodes.cone, [0, cone * 1.4, 0]);
    move(nodes.clapper, [Math.sin(wall * 2 * Math.PI * 15) * 0.7 * shown.ring, 0, 0]);
  }

  // ------------------------------------------------------------ targets
  function clipTargets() {
    const who = clip.speaking;
    return {
      a: ["", "l2", 1],
      b: ["", "ai", 1],
      dial: CALL_DIALECT,
      lamps: { l2: who === "caller" ? 1 : 0.32, ai: who === "agent" ? 1 : 0.32 },
      speak: who === "agent" ? 1 : 0,
      stamp: 0,
      mark: 0,
      ticket: 0,
      phase: clip.status === "loading" ? "loading" : clip.turn >= 0 && lines[clip.turn] ? "line" : "answer",
    };
  }

  /** Steer a plug toward a jack along its path: finish the current leg, reverse it, or start a new one. */
  function steerPlug(track, jack, dt, calm) {
    if (calm) {
      track.from = jack;
      track.to = jack;
      track.u = 1;
    } else if (track.to === jack) track.u = Math.min(1, track.u + dt / TRAVEL);
    else if (track.from === jack) {
      [track.from, track.to] = [track.to, track.from];
      track.u = 1 - track.u;
    } else if (track.u >= 1) {
      track.from = track.to;
      track.to = jack;
      track.u = 0;
    } else track.u = Math.min(1, track.u + dt / TRAVEL);
  }

  function step(dt) {
    const calm = still.matches;
    wall += dt;
    let s;
    if (mode === "tour") {
      if (!frozen) clock += dt;
      s = tourAt(clock);
      shown.a = { from: s.a[0], to: s.a[1], u: s.a[2] };
      shown.b = { from: s.b[0], to: s.b[1], u: s.b[2] };
      shown.stamp = s.stamp;
      shown.mark = s.mark;
      shown.ticket = s.ticket;
      shown.ticketFade = s.ticketFade;
    } else {
      s = mode === "clip" ? clipTargets() : mode === "rest" && calm ? STILL : want;
      steerPlug(shown.a, s.a[1], dt, calm);
      steerPlug(shown.b, s.b[1], dt, calm);
      shown.stamp = ease(shown.stamp, s.stamp ?? 0, dt, 0.18, calm);
      shown.mark = ease(shown.mark, s.mark ?? 0, dt, 0.3, calm);
      if (shown.ticket > 0 && !(s.ticket > 0)) {
        // a ticket is taken, not fed back: it fades where it is
        shown.ticketFade = ease(shown.ticketFade, 0, dt, 0.25, calm);
        if (shown.ticketFade === 0) (shown.ticket = 0), (shown.ticketFade = 1);
      } else shown.ticket = ease(shown.ticket, s.ticket ?? 0, dt, 0.35, calm);
    }
    // the visitor's word turns the dial, also while the clip plays
    const dialect = (mode === "user" || mode === "clip") && userDial ? userDial : s.dial ?? DIAL_HOME;
    const target = data.dial.angles[dialect];
    if (calm) {
      shown.angle = target;
      shown.spin = 0;
    } else {
      // a detent click: a stiff spring that overshoots once
      const sub = Math.max(1, Math.ceil(dt * 240));
      for (let i = 0; i < sub; i++) {
        shown.spin += ((target - shown.angle) * 520 - shown.spin * 26) * (dt / sub);
        shown.angle += shown.spin * (dt / sub);
      }
      if (Math.abs(target - shown.angle) < 0.02 && Math.abs(shown.spin) < 0.05) (shown.angle = target), (shown.spin = 0);
    }
    const lamps = s.lamps ?? {};
    for (const name of Object.keys(shown.lamps)) {
      const goal = lamps[name] ?? 0;
      // eased in every mode, so a lamp never pops between the tour's phases
      shown.lamps[name] = ease(shown.lamps[name], goal, dt, goal > shown.lamps[name] ? 0.05 : 0.14, calm);
    }
    shown.speak = calm ? 0 : ease(shown.speak, s.speak ?? 0, dt, 0.08, false);
    shown.ring = calm ? 0 : ease(shown.ring, mode === "tour" && s.phase === "ring" && shown.a.u === 0 ? 1 : 0, dt, 0.06, false);
    draw();

    phaseShown = s.phase ?? "idle";
    const next = phaseShown === "line" ? lines[clip.turn] : readoutOf(locale, phaseShown, dialect);
    if (next !== text && readout) readout.textContent = text = next;
    if (dialect !== dialShown) {
      dialShown = dialect;
      onDial?.(dialect);
    }
    const settled =
      shown.a.u >= 1 &&
      shown.b.u >= 1 &&
      shown.spin === 0 &&
      shown.angle === target &&
      shown.speak < 0.001 &&
      shown.ring < 0.001 &&
      Object.keys(shown.lamps).every((name) => shown.lamps[name] === (lamps[name] ?? 0)) &&
      shown.stamp === (s.stamp ?? 0) &&
      shown.mark === (s.mark ?? 0) &&
      shown.ticket === (s.ticket ?? 0);
    if (homing && settled) {
      // home and still: the next call can start
      homing = false;
      userDial = null;
      clock = 0;
      mode = "tour";
      return true;
    }
    // The clip keeps the loop alive only while something moves (the cone while the
    // agent speaks, a lamp or plug easing): paused, it idles. Each new turn of the
    // clip calls setClip, which starts the loop again.
    return mode === "tour" || !settled;
  }

  function tick(now) {
    const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
    last = now;
    frame = visible && step(dt) ? requestAnimationFrame(tick) : 0;
  }
  function run() {
    if (!frame && visible) {
      last = 0;
      frame = requestAnimationFrame(tick);
    }
  }

  // ------------------------------------------------------------ the tour, and taking over from it
  /** Stop the tour and leave the machine where it stands (motion.md, "Taking over from the tour"). */
  function freeze() {
    if (mode !== "tour" && mode !== "rest") return;
    const jackOf = (track) => (track.u >= 0.5 ? track.to : track.from);
    const level = (v) => (v > 0.5 ? 1 : v > 0.1 ? 0.32 : 0);
    want = {
      a: ["", jackOf(shown.a), 1],
      b: ["", jackOf(shown.b), 1],
      dial: dialShown,
      lamps: Object.fromEntries(Object.entries(shown.lamps).map(([name, v]) => [name, level(v)])),
      speak: 0,
      stamp: 0,
      mark: shown.mark > 0.5 ? 1 : 0,
      ticket: shown.ticket > 0.5 && shown.ticketFade > 0.5 ? 1 : 0,
      phase: phaseShown,
    };
    mode = "user";
    homing = false;
    run();
  }
  function scheduleTour(delay) {
    window.clearTimeout(timer);
    if (still.matches || clip.active || frozen) return;
    timer = window.setTimeout(() => {
      if (engaged || clip.active || still.matches) return;
      if (mode === "rest") {
        clock = 0;
        mode = "tour";
      } else {
        want = { ...HOME };
        mode = "user";
        homing = true;
      }
      run();
    }, delay * 1000);
  }
  const quietly = () => {
    if (!engaged && !clip.active) scheduleTour(TOUR_BACK);
  };
  const engage = () => {
    engaged = true;
    window.clearTimeout(timer);
    freeze();
  };
  const onEnter = (event) => event.pointerType === "mouse" && engage();
  const onLeave = (event) => {
    if (event.pointerType !== "mouse") return;
    engaged = false;
    quietly();
  };
  const onFocusIn = () => engage();
  const onFocusOut = (event) => {
    if (root.contains(event.relatedTarget)) return;
    engaged = false;
    quietly();
  };
  // the card (the stage and its controls) is what the visitor touches
  const zone = root.closest(".iso-figure, .sb") ?? root;
  zone.addEventListener("pointerenter", onEnter);
  zone.addEventListener("pointerleave", onLeave);
  zone.addEventListener("focusin", onFocusIn);
  zone.addEventListener("focusout", onFocusOut);

  const observer = new IntersectionObserver(
    (entries) => {
      visible = Boolean(entries[entries.length - 1]?.isIntersecting);
      if (visible) {
        run();
        if (mode === "rest" && !engaged) scheduleTour(TOUR_FIRST);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "120px 0px" },
  );
  observer.observe(root);
  const onStill = () => {
    if (still.matches) {
      window.clearTimeout(timer);
      if (mode === "tour") freeze();
    } else if (!engaged) scheduleTour(TOUR_FIRST);
    run();
  };
  still.addEventListener("change", onStill);

  // reduced motion: one representative still, the call answered in Saudi and booked
  if (still.matches) step(0);
  else draw();

  return {
    /** Follow the voice clip: { active, speaking: "agent" | "caller" | "", turn, status }. */
    setClip(next) {
      const was = clip.active;
      clip = { ...clip, ...next };
      if (clip.active) {
        window.clearTimeout(timer);
        homing = false;
        // the clip is a call in Saudi Arabic: the dial goes to its word until the visitor turns it
        if (!was) userDial = null;
        mode = "clip";
      } else if (was) {
        want = { ...clipTargets(), lamps: {}, speak: 0, phase: clip.status === "ended" ? "ended" : "answer" };
        mode = "user";
        quietly();
      }
      plate?.toggleAttribute("data-clip", clip.active);
      run();
    },
    /** The visitor turned the dial to one of the three words. */
    setDial(dialect) {
      window.clearTimeout(timer);
      freeze();
      userDial = dialect;
      if (mode === "user") {
        homing = false;
        want = { ...want, dial: dialect, phase: "answer" };
      }
      run();
      quietly();
    },
    /** Verification only: show the tour frozen at a moment (seconds into the two-call cycle). */
    hold(seconds) {
      window.clearTimeout(timer);
      frozen = true;
      clock = seconds;
      mode = "tour";
      run();
    },
    destroy() {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      observer.disconnect();
      still.removeEventListener("change", onStill);
      zone.removeEventListener("pointerenter", onEnter);
      zone.removeEventListener("pointerleave", onLeave);
      zone.removeEventListener("focusin", onFocusIn);
      zone.removeEventListener("focusout", onFocusOut);
    },
  };
}
