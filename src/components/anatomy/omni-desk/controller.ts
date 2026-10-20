/**
 * The live part of the one desk, framework-free: one loop that moves four
 * groups by translation, lights one lamp and writes the readout. React mounts
 * it from live.tsx; the standalone verification page inlines this same file.
 * No geometry is shipped: the art is server-rendered, and the only numbers the
 * browser needs are two screen vectors and the model's timeline.
 */
import { COUNT, CUP_TOP, PRESS_X, STILL_CHANNEL, STROKE, TUBE_X, channelOf, poseAt, readoutOf, stillAge, stillJob, tubeOf, type Job, type Locale, type Pose, type Step, type Words } from "./model";

export interface DeskData {
  locale: Locale;
  /** Screen vector of one world unit along x, and along z. */
  ex: [number, number];
  ez: [number, number];
  /** Screen x of the lane's centre (world x = 0), for pointer picking. */
  laneX: number;
  width: number;
  words: Words;
}

const TOUR_FIRST = 1400;
const TOUR_BACK = 3600;
const LONGEST = 1 / 30;
const STILLNESS = "(prefers-reduced-motion: reduce)";

const fine = (value: number) => Math.round(value * 100) / 100;

export function mountDesk(root: HTMLElement, data: DeskData): () => void {
  const { locale, ex, ez, words } = data;
  const figure = root.closest(".od");
  const node = (name: string) => root.querySelector<SVGGElement>(`[data-od="${name}"]`);
  const carriage = node("carriage");
  const capsule = node("capsule");
  const seal = node("seal");
  const plunger = node("plunger");
  const knob = node("knob");
  const svg = root.querySelector("svg");
  const lamps: (Element | null)[] = Array.from({ length: COUNT }, (_, tube) => root.querySelector(`[data-od-lamp="${tube}"]`));
  const badges: (Element | null)[] = Array.from({ length: COUNT }, (_, tube) => root.querySelector(`[data-od-badge="${tube}"]`));
  const picks = Array.from(figure?.querySelectorAll<HTMLButtonElement>("[data-od-pick]") ?? []);
  const status = figure?.querySelector("[data-od-status]") ?? null;
  const readout = root.closest(".iso-plate")?.querySelector("[data-readout]") ?? null;
  const still = window.matchMedia(STILLNESS);

  let job: Job = stillJob(locale);
  let age = stillAge(job);
  let channel = STILL_CHANNEL;
  let queued: number | null = null;
  let announce = false;
  /** The still holds until the tour or the reader moves it. */
  let holding = true;
  let touring = false;
  let hovering = false;
  let focused = false;
  let visible = false;
  let frame = 0;
  let last = 0;
  let tourTimer = 0;
  let shownStep: Step | null = null;
  const written = new Map<Element, string>();

  const write = (element: Element | null, name: string, value: string | null) => {
    if (!element) return;
    const id = element as Element & { __od?: Record<string, string | null> };
    const memo = (id.__od ??= {});
    if (memo[name] === value) return;
    memo[name] = value;
    if (value === null) element.removeAttribute(name);
    else element.setAttribute(name, value);
  };
  const shift = (dx: number, dz: number) => (dx === 0 && dz === 0 ? null : `translate(${fine(ex[0] * dx + ez[0] * dz)} ${fine(ex[1] * dx + ez[1] * dz)})`);

  function draw(pose: Pose) {
    write(carriage, "transform", shift(pose.carriage, 0));
    write(capsule, "transform", shift(pose.capsuleX, pose.capsuleZ - CUP_TOP));
    write(seal, "opacity", pose.seal >= 1 ? null : `${fine(pose.seal)}`);
    const press = shift(0, -STROKE * pose.press);
    write(plunger, "transform", press);
    write(knob, "transform", press);
    lamps.forEach((lamp, tube) => write(lamp, "data-on", tube === pose.lamp ? "" : null));
    const text = readoutOf(channel, pose.step, words);
    if (readout && written.get(readout) !== text) {
      written.set(readout, text);
      readout.textContent = text;
    }
    if (pose.step !== shownStep) {
      shownStep = pose.step;
      if (announce && status) status.textContent = text;
    }
    picks.forEach((button) => write(button, "aria-pressed", Number(button.dataset.odPick) === channel && !pose.done ? "true" : "false"));
  }

  function start(next: number, user: boolean) {
    const from = poseAt(job, age).carriage;
    channel = next;
    job = { tube: tubeOf(next, locale), from };
    announce = user;
    shownStep = null;
    if (still.matches) {
      job = { tube: job.tube, from: PRESS_X };
      age = stillAge(job);
    } else age = 0;
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, LONGEST) : 1 / 60;
    last = now;
    let pose = poseAt(job, age);
    if (!pose.done && !still.matches && !holding) {
      age += dt;
      pose = poseAt(job, age);
    }
    if (pose.done || still.matches) {
      if (queued !== null) {
        start(queued, true);
        queued = null;
        pose = poseAt(job, age);
      } else if (touring && !hovering && !focused && !still.matches) {
        start((channel + 1) % COUNT, false);
        pose = poseAt(job, age);
      }
    }
    draw(pose);
    const busy = !still.matches && !holding && (!pose.done || queued !== null || (touring && !hovering && !focused));
    frame = visible && busy ? requestAnimationFrame(tick) : 0;
  }

  const run = () => {
    if (frame || !visible) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  };

  const scheduleTour = (delay: number) => {
    window.clearTimeout(tourTimer);
    touring = false;
    if (still.matches) return;
    tourTimer = window.setTimeout(() => {
      touring = true;
      holding = false;
      run();
    }, delay);
  };

  const pick = (next: number) => {
    if (next < 0 || next >= COUNT) return;
    const pose = poseAt(job, age);
    holding = false;
    if (still.matches || pose.done) {
      start(next, true);
      draw(poseAt(job, age));
    } else queued = next;
    scheduleTour(TOUR_BACK);
    run();
  };

  /** Pointer: the tube nearest the pointer across the drawing; hover previews its badge, a press sends it. */
  const tubeAt = (clientX: number) => {
    const box = svg?.getBoundingClientRect();
    if (!box || !box.width) return -1;
    const sx = ((clientX - box.left) / box.width) * data.width;
    let best = -1;
    let gap = Infinity;
    TUBE_X.forEach((x, tube) => {
      const distance = Math.abs(data.laneX + ex[0] * x - sx);
      if (distance < gap) (gap = distance), (best = tube);
    });
    return gap < Math.abs(ex[0]) * 30 ? best : -1;
  };
  const hover = (tube: number) => badges.forEach((badge, index) => write(badge, "data-hover", index === tube ? "" : null));

  const onMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    hovering = true;
    hover(tubeAt(event.clientX));
    scheduleTour(TOUR_BACK);
  };
  const onLeave = () => {
    hovering = false;
    hover(-1);
    scheduleTour(TOUR_BACK);
    run();
  };
  const onClick = (event: MouseEvent) => {
    const tube = tubeAt(event.clientX);
    if (tube >= 0) pick(channelOf(tube, locale));
  };
  const onPick = (event: Event) => {
    const button = (event.target as Element | null)?.closest<HTMLButtonElement>("[data-od-pick]");
    if (button) pick(Number(button.dataset.odPick));
  };
  const onKey = (event: KeyboardEvent) => {
    const index = picks.indexOf(event.target as HTMLButtonElement);
    if (index < 0) return;
    const forward = locale === "ar" ? "ArrowLeft" : "ArrowRight";
    const back = locale === "ar" ? "ArrowRight" : "ArrowLeft";
    let to = -1;
    if (event.key === forward || event.key === "ArrowDown") to = (index + 1) % picks.length;
    else if (event.key === back || event.key === "ArrowUp") to = (index + picks.length - 1) % picks.length;
    else if (event.key === "Home") to = 0;
    else if (event.key === "End") to = picks.length - 1;
    if (to < 0) return;
    event.preventDefault();
    picks[to]?.focus();
  };
  const onFocusIn = () => {
    focused = true;
    scheduleTour(TOUR_BACK);
    if (status && !status.textContent) status.textContent = readoutOf(channel, poseAt(job, age).step, words);
  };
  const onFocusOut = (event: FocusEvent) => {
    if (figure && event.relatedTarget instanceof Node && figure.contains(event.relatedTarget)) return;
    focused = false;
    scheduleTour(TOUR_BACK);
    run();
  };
  const onStill = () => {
    if (still.matches) {
      window.clearTimeout(tourTimer);
      touring = false;
      job = { tube: job.tube, from: PRESS_X };
      age = stillAge(job);
      draw(poseAt(job, age));
    } else scheduleTour(TOUR_FIRST);
  };

  root.addEventListener("pointermove", onMove);
  root.addEventListener("pointerleave", onLeave);
  root.addEventListener("click", onClick);
  figure?.addEventListener("click", onPick);
  figure?.addEventListener("keydown", onKey as EventListener);
  figure?.addEventListener("focusin", onFocusIn);
  figure?.addEventListener("focusout", onFocusOut as EventListener);
  still.addEventListener("change", onStill);

  /** The site's theme lives on <html>; the kit's lives on the figure. Follow it. */
  let themes: MutationObserver | null = null;
  if (figure instanceof HTMLElement && figure.hasAttribute("data-od-sync")) {
    const html = document.documentElement;
    const sync = () => figure.setAttribute("data-theme", html.getAttribute("data-theme") === "dark" ? "dark" : "light");
    sync();
    themes = new MutationObserver(sync);
    themes.observe(html, { attributes: true, attributeFilter: ["data-theme"] });
  }

  const seen = new IntersectionObserver(
    (entries) => {
      visible = Boolean(entries[entries.length - 1]?.isIntersecting);
      if (visible) run();
      else if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
    },
    { rootMargin: "120px 0px" },
  );
  seen.observe(root);
  draw(poseAt(job, age));
  scheduleTour(TOUR_FIRST);

  return () => {
    seen.disconnect();
    themes?.disconnect();
    window.clearTimeout(tourTimer);
    if (frame) cancelAnimationFrame(frame);
    root.removeEventListener("pointermove", onMove);
    root.removeEventListener("pointerleave", onLeave);
    root.removeEventListener("click", onClick);
    figure?.removeEventListener("click", onPick);
    figure?.removeEventListener("keydown", onKey as EventListener);
    figure?.removeEventListener("focusin", onFocusIn);
    figure?.removeEventListener("focusout", onFocusOut as EventListener);
    still.removeEventListener("change", onStill);
  };
}
