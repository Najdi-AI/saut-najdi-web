/**
 * The credit meter's live behaviour, framework-free: one frame loop that eases
 * the parts toward the chosen plan and outlet and writes attributes on the
 * server-rendered nodes. The React wrapper (live.tsx) mounts it in an effect;
 * the verification build inlines the same file into its standalone pages.
 *
 * Only the valve lever is rebuilt per frame (lever.ts); everything else moves
 * with transforms: the needle and rotors turn in their own face planes, the
 * selector pointer in the knob's top plane, the drums slide in their window,
 * and the liquid column grows in the sight glass.
 */
import type { Projection } from "../../iso/iso-kit";
import { leverAt, type LeverSpec } from "./lever";

export type Outlet = "calls" | "text";

export interface MeterLive {
  projection: Projection;
  lever: LeverSpec;
  leverAngle: { calls: number; text: number };
  detents: number[];
  sweep: number;
  shares: number[];
  counters: { calls: number; text: number }[];
  column: { base: number; perZ: number; from: number; span: number; bottom: number };
  drum: { count: number; pitch: number };
  rtl: boolean;
  readouts: { calls: string; text: string }[];
  spoken: { calls: string; text: string }[];
  planButton: string[];
  valveButton: { calls: string; text: string };
  start: { plan: number; outlet: Outlet };
}

const TOUR_FIRST = 1.4;
const TOUR_STEP = 2.8;
const TOUR_BACK = 3600;
const QUIET = 700;
const MOST_DT = 1 / 30;
const SPIN = 540;
const SPIN_FOR = 3.2;
const TOUR: { plan: number; outlet: Outlet }[] = [
  { plan: 1, outlet: "text" },
  { plan: 2, outlet: "text" },
  { plan: 2, outlet: "calls" },
  { plan: 0, outlet: "calls" },
  { plan: 0, outlet: "text" },
  { plan: 1, outlet: "text" },
  { plan: 1, outlet: "calls" },
];

const RAD = Math.PI / 180;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const ease = (current: number, target: number, dt: number, seconds: number, calm: boolean, snap: number) => {
  if (calm) return target;
  const next = current + (target - current) * (1 - Math.exp(-dt / seconds));
  return Math.abs(target - next) < snap ? target : next;
};

interface Spring {
  at: number;
  rate: number;
}
function springTo(state: Spring, target: number, dt: number, stiffness: number, damping: number, calm: boolean) {
  if (calm) {
    state.at = target;
    state.rate = 0;
    return;
  }
  const steps = Math.max(1, Math.ceil(dt * 240));
  const slice = dt / steps;
  for (let i = 0; i < steps; i++) {
    state.rate += ((target - state.at) * stiffness - state.rate * damping) * slice;
    state.at += state.rate * slice;
  }
  if (Math.abs(target - state.at) < 2e-4 && Math.abs(state.rate) < 2e-4) {
    state.at = target;
    state.rate = 0;
  }
}

const digitsOf = (value: number, count: number) =>
  String(Math.max(0, Math.round(value)))
    .padStart(count, "0")
    .slice(-count)
    .split("")
    .map(Number);

export function mountMeter(root: HTMLElement, data: MeterLive): () => void {
  const q = <T extends Element>(selector: string) => root.querySelector<T>(selector);
  const qa = <T extends Element>(selector: string) => Array.from(root.querySelectorAll<T>(selector));
  const still = window.matchMedia("(prefers-reduced-motion: reduce)");
  const calmNow = () => still.matches;

  const needle = q<SVGGElement>('[data-part="needle"]');
  const pointer = q<SVGGElement>('[data-part="pointer"]');
  const column = q<SVGRectElement>('[data-part="column"]');
  const meniscus = q<SVGGElement>('[data-part="meniscus"]');
  const drums = qa<SVGGElement>('[data-part="drum"]');
  const rotors = qa<SVGGElement>('[data-part="rotor"]');
  const leverNodes = ["lever-plate", "lever-grip"].map((name) => {
    const group = q<SVGGElement>(`[data-part="${name}"]`);
    return {
      fill: group?.querySelector<SVGPathElement>(".iso-fill") ?? null,
      shades: group ? Array.from(group.querySelectorAll<SVGPathElement>(".iso-shade")) : [],
      top: group?.querySelector<SVGPathElement>(".iso-top") ?? null,
      crease: group?.querySelector<SVGPathElement>(".iso-crease") ?? null,
      bevel: group?.querySelector<SVGPathElement>(".iso-bevel") ?? null,
      edge: group?.querySelector<SVGPathElement>(".iso-edge") ?? null,
    };
  });
  const planButton = q<HTMLButtonElement>('[data-control="plan"]');
  const valveButton = q<HTMLButtonElement>('[data-control="valve"]');
  const status = q<HTMLElement>("[data-status]");
  const readout = root.closest(".iso-plate")?.querySelector<HTMLElement>("[data-readout]") ?? null;

  const state = {
    plan: data.start.plan,
    outlet: data.start.outlet as Outlet,
    share: { at: data.shares[data.start.plan]!, rate: 0 } as Spring,
    level: data.shares[data.start.plan]!,
    lever: data.leverAngle[data.start.outlet],
    pointer: data.detents[data.start.plan]!,
    drums: digitsOf(data.counters[data.start.plan]![data.start.outlet], data.drum.count).map((digit) => ({ at: digit, from: digit, to: digit, start: 0, span: 0 })),
    spin: { calls: 0, text: 0 } as Record<Outlet, number>,
    turn: { calls: 0, text: 0 } as Record<Outlet, number>,
    changedAt: -Infinity,
    clock: 0,
    tourAt: 0,
    tourStep: 0,
    touring: false,
    visible: false,
    engaged: false,
    leverDrawn: data.leverAngle[data.start.outlet],
  };

  let frame = 0;
  let last = 0;
  let idleTimer = 0;
  let firstTimer = 0;
  let quietTimer = 0;
  let spoke = false;

  const angleOf = (share: number) => -data.sweep + share * data.sweep * 2;

  function drawLever(angle: number) {
    const paths = leverAt(data.lever, angle * RAD, data.projection);
    [paths.plate, paths.grip].forEach((solid, index) => {
      const nodes = leverNodes[index]!;
      nodes.fill?.setAttribute("d", solid.fill);
      nodes.shades.forEach((node, shade) => node.setAttribute("d", solid.shades[shade] ?? ""));
      nodes.top?.setAttribute("d", solid.top);
      nodes.crease?.setAttribute("d", solid.crease);
      nodes.bevel?.setAttribute("d", solid.bevel ?? "");
      nodes.edge?.setAttribute("d", solid.outline);
    });
    state.leverDrawn = angle;
  }

  const fixed = (value: number) => Math.round(value * 100) / 100;

  function draw() {
    needle?.setAttribute("transform", `rotate(${fixed(angleOf(state.share.at))})`);
    pointer?.setAttribute("transform", `rotate(${fixed(state.pointer)})`);
    const z = data.column.from + data.column.span * state.level;
    const top = data.column.base - z * data.column.perZ;
    const bottom = data.column.base - data.column.bottom * data.column.perZ;
    column?.setAttribute("y", `${fixed(top)}`);
    column?.setAttribute("height", `${fixed(Math.max(0, bottom - top))}`);
    meniscus?.setAttribute("transform", `translate(0 ${fixed(-z * data.column.perZ)})`);
    drums.forEach((node, index) => node.setAttribute("transform", `translate(0 ${fixed(-(((state.drums[index]!.at % 10) + 10) % 10) * data.drum.pitch)})`));
    rotors.forEach((node) => {
      const outlet = node.dataset.outlet as Outlet;
      node.setAttribute("transform", `rotate(${fixed(state.turn[outlet] % 360)})`);
    });
    if (Math.abs(state.leverDrawn - state.lever) > 1e-3) drawLever(state.lever);
  }

  /** The parts that carry the reading have reached it: the readout may say so. */
  function arrived() {
    return (
      Math.abs(state.share.at - data.shares[state.plan]!) < 0.004 &&
      Math.abs(state.share.rate) < 0.02 &&
      state.lever === data.leverAngle[state.outlet] &&
      state.pointer === data.detents[state.plan] &&
      state.drums.every((drum) => drum.at === drum.to)
    );
  }

  /** Nothing moves at all, rotors included: the loop may stop. */
  const settled = () => arrived() && state.share.rate === 0 && state.share.at === data.shares[state.plan] && state.level === data.shares[state.plan] && state.spin.calls === 0 && state.spin.text === 0;

  function writeWords() {
    const text = data.readouts[state.plan]![state.outlet];
    if (readout && readout.textContent !== text) readout.textContent = text;
  }

  function writeControls() {
    planButton?.setAttribute("aria-label", data.planButton[state.plan]!);
    valveButton?.setAttribute("aria-label", data.valveButton[state.outlet]);
    root.dataset.outlet = state.outlet;
    root.dataset.plan = String(state.plan);
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, MOST_DT) : 1 / 60;
    last = now;
    const calm = calmNow();
    state.clock += dt;
    if (state.touring && !calm) {
      state.tourAt += dt;
      if (state.tourAt >= TOUR_STEP) {
        state.tourAt = 0;
        const step = TOUR[state.tourStep % TOUR.length]!;
        state.tourStep += 1;
        choose(step.plan, step.outlet, false);
      }
    }
    const share = data.shares[state.plan]!;
    springTo(state.share, share, dt, 70, 12.5, calm);
    state.level = ease(state.level, share, dt, 0.4, calm, 1e-3);
    state.lever = ease(state.lever, data.leverAngle[state.outlet], dt, 0.16, calm, 0.05);
    state.pointer = ease(state.pointer, data.detents[state.plan]!, dt, 0.12, calm, 0.05);
    state.drums.forEach((drum) => {
      const t = calm || drum.span <= 0 ? 1 : clamp((state.clock - drum.start) / drum.span, 0, 1);
      const eased = t * t * t * (t * (t * 6 - 15) + 10);
      drum.at = t >= 1 ? drum.to : drum.from + (drum.to - drum.from) * eased;
    });
    const flowing = !calm && state.clock - state.changedAt < SPIN_FOR;
    (["calls", "text"] as Outlet[]).forEach((outlet) => {
      const want = flowing && outlet === state.outlet ? SPIN : 0;
      state.spin[outlet] = ease(state.spin[outlet], want, dt, 0.55, calm, 2);
      state.turn[outlet] = (state.turn[outlet] + state.spin[outlet] * dt) % 3600;
    });
    draw();
    if (arrived()) writeWords();
    const keep = state.visible && (state.touring || !settled());
    frame = keep ? requestAnimationFrame(tick) : 0;
  }

  function run() {
    if (frame || !state.visible) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function choose(plan: number, outlet: Outlet, byHand: boolean) {
    const count = data.shares.length;
    const nextPlan = clamp(plan, 0, count - 1);
    if (nextPlan === state.plan && outlet === state.outlet) return;
    state.plan = nextPlan;
    state.outlet = outlet;
    state.changedAt = state.clock;
    const digits = digitsOf(data.counters[nextPlan]![outlet], data.drum.count);
    state.drums.forEach((drum, index) => {
      const shown = ((drum.at % 10) + 10) % 10;
      const steps = (digits[index]! - Math.round(shown) + 10) % 10;
      drum.from = shown;
      drum.to = Math.round(shown) + steps;
      drum.start = state.clock + (data.drum.count - 1 - index) * 0.05;
      drum.span = steps ? 0.42 + steps * 0.045 : 0.2;
    });
    writeControls();
    if (calmNow()) writeWords();
    if (byHand) announceSoon();
    run();
  }

  function announceSoon() {
    window.clearTimeout(quietTimer);
    quietTimer = window.setTimeout(() => {
      if (status) status.textContent = data.spoken[state.plan]![state.outlet];
      spoke = true;
    }, QUIET);
  }

  function stopTour() {
    state.touring = false;
    window.clearTimeout(firstTimer);
  }

  function scheduleTour(delay: number) {
    window.clearTimeout(firstTimer);
    window.clearTimeout(idleTimer);
    if (calmNow() || !state.visible) return;
    firstTimer = window.setTimeout(() => {
      if (state.engaged || !state.visible || calmNow()) return;
      state.touring = true;
      state.tourAt = TOUR_STEP * 0.6;
      run();
    }, delay);
  }

  function wake() {
    stopTour();
    window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(() => {
      if (!state.engaged) scheduleTour(0);
    }, TOUR_BACK);
  }

  const nextKey = data.rtl ? "ArrowLeft" : "ArrowRight";
  const prevKey = data.rtl ? "ArrowRight" : "ArrowLeft";

  const onPlanClick = () => {
    wake();
    choose((state.plan + 1) % data.shares.length, state.outlet, true);
  };
  const onPlanKey = (event: KeyboardEvent) => {
    let plan: number | null = null;
    if (event.key === "ArrowUp" || event.key === nextKey) plan = state.plan + 1;
    else if (event.key === "ArrowDown" || event.key === prevKey) plan = state.plan - 1;
    else if (event.key === "Home") plan = 0;
    else if (event.key === "End") plan = data.shares.length - 1;
    if (plan === null) return;
    event.preventDefault();
    wake();
    choose(plan, state.outlet, true);
  };
  const onValveClick = () => {
    wake();
    choose(state.plan, state.outlet === "calls" ? "text" : "calls", true);
  };
  const onValveKey = (event: KeyboardEvent) => {
    let outlet: Outlet | null = null;
    if (event.key === "ArrowRight") outlet = "calls";
    else if (event.key === "ArrowLeft") outlet = "text";
    if (!outlet) return;
    event.preventDefault();
    wake();
    choose(state.plan, outlet, true);
  };
  const engage = () => {
    state.engaged = true;
    stopTour();
    window.clearTimeout(idleTimer);
  };
  const release = () => {
    state.engaged = false;
    wake();
  };
  const onFocusIn = () => {
    engage();
    if (status && !spoke) status.textContent = data.spoken[state.plan]![state.outlet];
  };
  const onFocusOut = (event: FocusEvent) => {
    if (!root.contains(event.relatedTarget as Node | null)) release();
  };
  const onEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse") engage();
  };
  const onLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && !root.contains(document.activeElement)) release();
  };
  const onStill = () => {
    if (calmNow()) {
      stopTour();
      run();
    } else scheduleTour(TOUR_FIRST * 1000);
  };

  planButton?.addEventListener("click", onPlanClick);
  planButton?.addEventListener("keydown", onPlanKey);
  valveButton?.addEventListener("click", onValveClick);
  valveButton?.addEventListener("keydown", onValveKey);
  root.addEventListener("focusin", onFocusIn);
  root.addEventListener("focusout", onFocusOut);
  root.addEventListener("pointerenter", onEnter);
  root.addEventListener("pointerleave", onLeave);
  still.addEventListener("change", onStill);

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[entries.length - 1];
      state.visible = Boolean(entry?.isIntersecting);
      if (state.visible) {
        run();
        if (!state.engaged) scheduleTour(TOUR_FIRST * 1000);
      } else {
        stopTour();
        window.clearTimeout(idleTimer);
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "120px 0px" },
  );
  observer.observe(root);
  writeControls();
  draw();

  return () => {
    observer.disconnect();
    cancelAnimationFrame(frame);
    window.clearTimeout(idleTimer);
    window.clearTimeout(firstTimer);
    window.clearTimeout(quietTimer);
    planButton?.removeEventListener("click", onPlanClick);
    planButton?.removeEventListener("keydown", onPlanKey);
    valveButton?.removeEventListener("click", onValveClick);
    valveButton?.removeEventListener("keydown", onValveKey);
    root.removeEventListener("focusin", onFocusIn);
    root.removeEventListener("focusout", onFocusOut);
    root.removeEventListener("pointerenter", onEnter);
    root.removeEventListener("pointerleave", onLeave);
    still.removeEventListener("change", onStill);
  };
}
