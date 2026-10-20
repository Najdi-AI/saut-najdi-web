/**
 * The live part of the one desk, framework-free: one loop that moves four
 * groups by translation, lights the lamps and writes the readout. React mounts
 * it from live.tsx; the standalone verification page inlines this same file.
 * No geometry is shipped: the art is server-rendered, and the only numbers the
 * browser needs are two screen vectors and the model's timeline.
 *
 * Taking over from the tour (motion.md): a reader's press answers at once. The
 * chosen button is pressed, its arrival lamp lights and the readout and the
 * live region name it in the same frame. If the running capsule is out of
 * sight, the new job starts there and then, from where the carriage is and
 * with its speed. If the capsule is in view on the desk, the running job is
 * hurried (its stamp and its trip back up) so the desk is clear within
 * HANDOVER seconds, and the chosen capsule comes down after it: every
 * message on the desk is still answered.
 */
import { COUNT, CUP_TOP, STILL_CHANNEL, STROKE, TUBE_X, channelOf, hiddenAt, inSight, poseAt, rateAt, readoutOf, stillAge, stillJob, tubeOf, type Job, type Locale, type Pose, type Step, type Words } from "./model";

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
/** A reader's press clears the desk within this long (s) before the chosen capsule is called down. */
const HANDOVER = 0.8;
/** The most a hurried job is sped up. */
const RUSH_MOST = 8;
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
  const lamps: Element[][] = Array.from({ length: COUNT }, (_, tube) => Array.from(root.querySelectorAll(`[data-od-lamp="${tube}"], [data-od-jewel="${tube}"]`)));
  const badges: (Element | null)[] = Array.from({ length: COUNT }, (_, tube) => root.querySelector(`[data-od-badge="${tube}"]`));
  const picks = Array.from(figure?.querySelectorAll<HTMLButtonElement>("[data-od-pick]") ?? []);
  const status = figure?.querySelector("[data-od-status]") ?? null;
  const readout = root.closest(".iso-plate")?.querySelector("[data-readout]") ?? null;
  const still = window.matchMedia(STILLNESS);

  let job: Job = stillJob(locale);
  let age = stillAge(job);
  /** The channel the desk is serving: the reader's choice from the moment they press. */
  let channel = STILL_CHANNEL;
  /** A chosen channel waiting for the desk to clear, and the job age at which it is clear. */
  let pending: number | null = null;
  let clearAt = 0;
  /** How fast the running job plays: 1, or faster while a reader's choice waits. */
  let rush = 1;
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
  let shown: string | null = null;

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
    /** The running capsule's lamp, and the chosen one's while it waits: two lines live at once. */
    const waiting = pending === null ? -1 : tubeOf(pending, locale);
    lamps.forEach((list, tube) => list.forEach((lamp) => write(lamp, "data-on", tube === pose.lamp || tube === waiting ? "" : null)));
    const step: Step = pending === null ? pose.step : "coming";
    const text = readoutOf(channel, step, words);
    if (readout && readout.textContent !== text) readout.textContent = text;
    const key = `${channel}|${step}`;
    if (key !== shown) {
      shown = key;
      if (announce && status) status.textContent = text;
    }
    picks.forEach((button) => write(button, "aria-pressed", Number(button.dataset.odPick) === channel ? "true" : "false"));
  }

  /** A new job for a channel, from where the carriage is and at the speed it has. */
  function begin(next: number, from: number, v0: number) {
    job = { tube: tubeOf(next, locale), from, v0 };
    age = 0;
    rush = 1;
    pending = null;
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 1000, LONGEST) : 1 / 60;
    last = now;
    const moving = !still.matches && !holding;
    let pose = poseAt(job, age);
    if (moving && (!pose.done || pending !== null)) {
      age += dt * rush;
      if (pending !== null && age >= clearAt) begin(pending, poseAt(job, clearAt).carriage, 0);
      pose = poseAt(job, age);
    }
    if (moving && pose.done && pending === null && touring && !hovering && !focused) {
      announce = false;
      channel = (channel + 1) % COUNT;
      begin(channel, pose.carriage, 0);
      pose = poseAt(job, age);
    }
    draw(pose);
    const busy = moving && (!pose.done || pending !== null || (touring && !hovering && !focused));
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

  /** A reader's choice, by button, key or pointer: it takes over at once (see the header). */
  const pick = (next: number) => {
    if (next < 0 || next >= COUNT) return;
    holding = false;
    channel = next;
    announce = true;
    shown = null;
    if (still.matches) {
      job = stillJob(locale, next);
      age = stillAge(job);
      pending = null;
      rush = 1;
    } else {
      const pose = poseAt(job, age);
      if (inSight(pose)) {
        pending = next;
        clearAt = hiddenAt(job);
        rush = Math.min(RUSH_MOST, Math.max(1, (clearAt - age) / HANDOVER));
      } else begin(next, pose.carriage, pose.done ? 0 : rateAt(job, age));
    }
    draw(poseAt(job, age));
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
    if (status && !status.textContent) status.textContent = readoutOf(channel, pending === null ? poseAt(job, age).step : "coming", words);
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
      job = stillJob(locale, channel);
      age = stillAge(job);
      pending = null;
      rush = 1;
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
