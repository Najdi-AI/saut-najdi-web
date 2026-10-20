import {
  corners,
  cylinder,
  dotsSvg,
  haloOf,
  insetPlan,
  knurl,
  lineOnTop,
  lineSvg,
  onTop,
  pathOf,
  planOutline,
  ring,
  segment,
  sideArc,
  sideSeam,
  sideTicks,
  slabOf,
  solidSvg,
  topTicks,
  type Flat,
  type Plan,
  type Point3,
  type SolidStyle,
  type Tone,
} from "../../iso/iso-kit";
import { DOCS, DRAWERS, MOTION } from "./model";
import {
  ARM,
  ARM_H,
  ARM_PARK,
  ARM_Z,
  AXES,
  BASE,
  BASE_H,
  BAY_W,
  BED_Z,
  CAB_X0,
  CAB_X1,
  CAB_Y0,
  CARD,
  CARD_FRONT,
  CARD_Z0,
  CARD_Z1,
  COLUMN,
  DECK_Z,
  DRAWER_DEPTH,
  END,
  FACE_Y,
  FEED,
  FLOOR_T,
  FOOT_H,
  FRONT_T,
  FRONT_Z0,
  FRONT_Z1,
  GANTRY,
  HEAD,
  HEIGHT,
  HOUSING,
  HOUSING_H,
  MAST,
  OVERHANG,
  P,
  PAD_Z,
  PART,
  PICK_Y,
  PLATEN,
  PLATEN_H,
  PLATEN_Z,
  PLINTH_H,
  POSTS,
  POST_W,
  RAIL_GAP,
  RAIL_H,
  RAIL_W,
  ROD,
  SIDE_Z1,
  SLAB_Z,
  STAND,
  STAND_H,
  TOP_Z,
  TRACK_Y,
  UNDER_X,
  WIDTH,
  at,
  bayMid,
  bayX,
} from "./view";

/**
 * Every static path of the knowledge press, computed once at module load on
 * the server (and by the verification build, which imports this module). The
 * figure is one list of items in painter's order; an item carries its SVG,
 * the true shape of what it draws (for the audit) and, when it moves, the
 * name of its live group. Moving parts are built at rest and moved by the
 * client with screen translates only, so no geometry ships to the browser.
 */

export type ShapeDesc =
  | { kind: "slab"; plan: Plan; z: number; h: number; steps: number }
  | { kind: "cylinder"; cx: number; cy: number; r: number; z: number; h: number };

export interface Item {
  name: string;
  svg: string;
  shapes: ShapeDesc[];
  /** Live group path, outermost first, such as "drawer.2/lift.2". */
  part?: string;
  /** Parts of one assembly that are sunk into each other by design. */
  owner?: string;
  ground?: boolean;
}

export interface Marker {
  slot: string;
}

type Entry = Item | Marker;

const S = (paths: Parameters<typeof solidSvg>[0], style: SolidStyle = {}) => solidSvg(paths, style);
const L = lineSvg;
const D = dotsSvg;
const join = (list: string[]) => list.join("");
const f1 = (value: number) => Math.round(value * 10) / 10;

const entries: Entry[] = [];
let current: string | undefined;
let owner: string | undefined;

function within<T>(part: string | undefined, run: () => T, by?: string) {
  const [was, wasOwner] = [current, owner];
  current = part;
  owner = by ?? owner;
  const out = run();
  current = was;
  owner = wasOwner;
  return out;
}

function put(name: string, svg: string, shapes: ShapeDesc[], extra: Partial<Item> = {}) {
  entries.push({ name, svg, shapes, part: current, owner, ...extra });
}

const slabShape = (plan: Plan, z: number, h: number, steps = 4): ShapeDesc => ({ kind: "slab", plan, z, h, steps });
const cylShape = (cx: number, cy: number, r: number, z: number, h: number): ShapeDesc => ({ kind: "cylinder", cx, cy, r, z, h });

/** A rounded box as an item: paths, a lit option, and extra line markup inside or after it. */
function box(
  name: string,
  plan: Plan,
  z: number,
  h: number,
  {
    tone = "mid",
    crease = "faint",
    steps = 4,
    bevel = 0,
    inner = "",
    extra = "",
    before = "",
    shapes = [],
    lit = false,
    litable = false,
  }: { tone?: Tone; crease?: Tone | "none"; steps?: number; bevel?: number; inner?: string; extra?: string; before?: string; shapes?: ShapeDesc[]; lit?: boolean; litable?: boolean } = {},
) {
  const solid = S(slabOf(plan, z, h, P, steps, bevel), { tone, crease: crease as Tone, inner, lit, className: litable ? "kb-litable" : undefined });
  put(name, before + solid + extra, [slabShape(plan, z, h, steps), ...shapes]);
}

function post(name: string, cx: number, cy: number, r: number, z: number, h: number, { tone = "mid", crease = "faint", steps = 28, bevel = 0, inner = "", extra = "" }: { tone?: Tone; crease?: Tone | "none"; steps?: number; bevel?: number; inner?: string; extra?: string } = {}) {
  put(name, S(cylinder(cx, cy, r, z, h, P, steps, bevel), { tone, crease: crease as Tone, inner }) + extra, [cylShape(cx, cy, r, z, h)]);
}

const P3 = (x: number, y: number, z: number): Point3 => [x, y, z];
const box3 = (x0: number, x1: number, y0: number, y1: number, r = 0.4): Plan => ({ x: x0, y: y0, w: x1 - x0, d: y1 - y0, r });
const dotAt = (points: Point3[]) => points.map((point) => at(point));
const faceLine = (y: number, x0: number, x1: number, z: number) => segment([x0, y, z], [x1, y, z], P);
const sideLine = (x: number, y0: number, y1: number, z: number) => segment([x, y0, z], [x, y1, z], P);
/** A closed rounded rectangle drawn in the vertical plane y = const, in x and z. */
function faceRect(y: number, x0: number, x1: number, z0: number, z1: number, r = 0.6, steps = 3) {
  const points: Flat[] = [];
  const rr = Math.min(r, (x1 - x0) / 2, (z1 - z0) / 2);
  const arc = (cx: number, cz: number, from: number) => {
    for (let step = 0; step <= steps; step++) {
      const angle = from + (step / steps) * (Math.PI / 2);
      points.push(at([cx + Math.cos(angle) * rr, y, cz + Math.sin(angle) * rr]));
    }
  };
  arc(x1 - rr, z1 - rr, 0);
  arc(x0 + rr, z1 - rr, Math.PI / 2);
  arc(x0 + rr, z0 + rr, Math.PI);
  arc(x1 - rr, z0 + rr, Math.PI * 1.5);
  return pathOf(points, true);
}
/** The same in the vertical plane x = const, in y and z. */
function sideRect(x: number, y0: number, y1: number, z0: number, z1: number, r = 0.6, steps = 3) {
  const points: Flat[] = [];
  const rr = Math.min(r, (y1 - y0) / 2, (z1 - z0) / 2);
  const arc = (cy: number, cz: number, from: number) => {
    for (let step = 0; step <= steps; step++) {
      const angle = from + (step / steps) * (Math.PI / 2);
      points.push(at([x, cy + Math.cos(angle) * rr, cz + Math.sin(angle) * rr]));
    }
  };
  arc(y1 - rr, z1 - rr, 0);
  arc(y0 + rr, z1 - rr, Math.PI / 2);
  arc(y0 + rr, z0 + rr, Math.PI);
  arc(y1 - rr, z0 + rr, Math.PI * 1.5);
  return pathOf(points, true);
}
/** A circle in the vertical plane y = const. */
function faceCircle(y: number, cx: number, cz: number, r: number, steps = 28) {
  const points: Flat[] = [];
  for (let step = 0; step < steps; step++) {
    const angle = (step / steps) * Math.PI * 2;
    points.push(at([cx + Math.cos(angle) * r, y, cz + Math.sin(angle) * r]));
  }
  return pathOf(points, true);
}

/* ------------------------------------------------------------------ base */

function base() {
  const halo = `<path class="iso-halo" d="${haloOf(BASE, -BASE_H - FOOT_H, BASE_H, P)}"/>`;
  const feet = corners(BASE, 22).sort((a, b) => a[0] * 0.53 + a[1] * 0.85 - (b[0] * 0.53 + b[1] * 0.85));
  feet.forEach(([x, y], index) => {
    post(`stand.foot#${index}`, x, y, 7, -BASE_H - FOOT_H, 1.6, { tone: "lo", steps: 28 });
    if (index === 0) entries[entries.length - 1] = { ...(entries[entries.length - 1] as Item), svg: halo + (entries[entries.length - 1] as Item).svg };
    post(`stand.footpost#${index}`, x, y, 5.4, -BASE_H - FOOT_H + 1.6, FOOT_H - 1.6, { tone: "mid", steps: 28 });
  });
  const screws = corners(BASE, 10);
  const strip = box3(-150, 46, BASE.y + BASE.d - 12, BASE.y + BASE.d - 5.6, 1);
  const ticks = topTicks(strip.x + 4, strip.x + strip.w - 4, 4, 5, strip.y, 0.6, [1.8, 3.4], P);
  const plate = box3(66, 132, BASE.y + BASE.d - 15, BASE.y + BASE.d - 4.6, 1.4);
  const plateRule = [0, 1, 2].map((row) => lineOnTop([plate.x + 9, plate.y + 3 + row * 2.3], [plate.x + (row === 1 ? 38 : 50), plate.y + 3 + row * 2.3], 0.8, P)).join("");
  const top = join([
    L(planOutline(insetPlan(BASE, 5), 0, P, 8), { tone: "lo" }),
    L(screws.map(([x, y]) => ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }),
    D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }),
    S(slabOf(strip, 0, 0.6, P, 3), { tone: "lo", crease: "none" as Tone }),
    L(ticks.minor, { tone: "lo" }),
    L(ticks.major, { tone: "mid" }),
    D([at([strip.x + 2, strip.y + strip.d / 2, 0.6]), at([strip.x + strip.w - 2, strip.y + strip.d / 2, 0.6])], { size: 0.45 }),
    S(slabOf(plate, 0, 0.8, P, 3), { tone: "lo", crease: "none" as Tone }),
    L(planOutline(insetPlan(plate, 1.4), 0.8, P, 3), { tone: "faint" }),
    L(plateRule, { tone: "lo", free: true }),
    D([at([plate.x + 4, plate.y + plate.d / 2, 0.8]), at([plate.x + plate.w - 4, plate.y + plate.d / 2, 0.8])], { size: 0.45 }),
  ]);
  const slab = S(slabOf(BASE, -BASE_H, BASE_H, P, 8, 1.6), { tone: "mid", inner: L(sideSeam(BASE, -4, P, 8), { tone: "faint" }) });
  put("stand.plate", slab + top, [slabShape(BASE, -BASE_H, BASE_H, 8), slabShape(strip, 0, 0.6, 3), slabShape(plate, 0, 0.8, 3)], { ground: true });
}

/* --------------------------------------------------------------- gantry */

const GANTRY_FOOT = (x: number): Plan => box3(x - 4, x + POST_W + 4, GANTRY.y0 - 4, GANTRY.y1 + 4, 1.2);

function gantryPost(index: number) {
  const x = POSTS[index]!;
  const foot = GANTRY_FOOT(x);
  const screws = [P3(foot.x + 2, foot.y + 2, 2), P3(foot.x + foot.w - 2, foot.y + 2, 2), P3(foot.x + 2, foot.y + foot.d - 2, 2), P3(foot.x + foot.w - 2, foot.y + foot.d - 2, 2)];
  box(`gantry.foot#${index}`, foot, 0, 2, { tone: "lo", bevel: 0.4, extra: D(dotAt(screws), { size: 0.45 }) });
  const plan = box3(x, x + POST_W, GANTRY.y0, GANTRY.y1, 0.8);
  const seams = join([18, 44].map((z) => sideSeam(plan, z, P, 4)));
  box(`gantry.post#${index}`, plan, 2, GANTRY.z0 - 2, { tone: "mid", inner: L(seams, { tone: "faint" }) });
}

/* -------------------------------------------------------------- cabinet */

const DRAWER_BACK = FACE_Y - FRONT_T - DRAWER_DEPTH;
const tabOf = (x0: number, j: number) => {
  const x1 = x0 + BAY_W;
  const mid = x0 + BAY_W / 2;
  if (j === 0) return [mid - CARD.tabW / 2, mid + CARD.tabW / 2];
  return j % 2 ? [x0 + 4, x0 + 4 + CARD.tabW] : [x1 - 4 - CARD.tabW, x1 - 4];
};

function card(name: string, x0: number, j: number, { tone, lit = false }: { tone: Tone; lit?: boolean }) {
  const front = CARD_FRONT - j * CARD.gap;
  const plan = box3(x0 + 3, x0 + BAY_W - 3, front - CARD.t, front, 0.2);
  const [t0, t1] = tabOf(x0, j);
  const tab = box3(t0!, t1!, front - CARD.t, front, 0.2);
  const rules = j === 0 ? L([CARD_Z1 - 3.4, CARD_Z1 - 5.8, CARD_Z1 - 8.2].map((z, row) => faceLine(front, plan.x + 3, plan.x + plan.w - (row === 1 ? 9 : 4), z)).join(""), { tone: "lo", free: true }) : "";
  const tabRule = j === 0 ? L(faceLine(front, t0! + 1.6, t1! - 1.6, CARD_Z1 + 1.2), { tone: "mid", free: true }) : "";
  const body = S(slabOf(plan, CARD_Z0, CARD.h, P, 2), { tone, crease: "none" as Tone, lit, className: j === 0 ? "kb-litable" : undefined });
  const top = S(slabOf(tab, CARD_Z1, CARD.tab, P, 2), { tone, crease: "none" as Tone, lit, className: j === 0 ? "kb-litable" : undefined });
  put(name, body + top + rules + tabRule, [slabShape(plan, CARD_Z0, CARD.h, 2), slabShape(tab, CARD_Z1, CARD.tab, 2)]);
}

function drawer(index: number) {
  const x0 = bayX(index);
  const x1 = x0 + BAY_W;
  const mid = bayMid(index);
  const fy0 = FACE_Y - FRONT_T;
  within(`drawer.${index}`, () => {
    box(`drawer${index}.side#0`, box3(x0 + 0.6, x0 + 1.6, DRAWER_BACK, fy0, 0.3), DECK_Z, SIDE_Z1 - DECK_Z, { tone: "mid", steps: 2 });
    box(`drawer${index}.back`, box3(x0 + 1.6, x1 - 1.6, DRAWER_BACK, DRAWER_BACK + 1, 0.3), DECK_Z, SIDE_Z1 - DECK_Z, { tone: "lo", steps: 2 });
    box(`drawer${index}.floor`, box3(x0 + 1.6, x1 - 1.6, DRAWER_BACK + 1, fy0, 0.3), DECK_Z, FLOOR_T, { tone: "lo", steps: 2 });
    for (let j = CARD.count - 1; j >= 1; j--) card(`drawer${index}.card#${j}`, x0, j, { tone: "lo" });
    within(`drawer.${index}/lift.${index}`, () => card(`drawer${index}.answer`, x0, 0, { tone: "lo" }));
    box(`drawer${index}.side#1`, box3(x1 - 1.6, x1 - 0.6, DRAWER_BACK, fy0, 0.3), DECK_Z, SIDE_Z1 - DECK_Z, {
      tone: "mid",
      steps: 2,
      inner: L(sideLine(x1 - 0.6, DRAWER_BACK, fy0, SIDE_Z1 - 3), { tone: "faint" }),
    });
    const front = box3(x0 + 0.5, x1 - 0.5, fy0, FACE_Y, 0.6);
    const holder = box3(mid - 8, mid + 8, FACE_Y, FACE_Y + 0.6, 0.3);
    const holderZ: [number, number] = [19.2, 24];
    const window = faceRect(FACE_Y + 0.6, mid - 6.8, mid + 6.8, holderZ[0] + 0.9, holderZ[1] - 0.9, 0.5);
    const words = [holderZ[0] + 3.2, holderZ[0] + 1.7].map((z, row) => faceLine(FACE_Y + 0.6, mid - 5.2, mid + (row ? 1.6 : 5.2), z)).join("");
    const pullPlate = box3(mid - 5.2, mid + 5.2, FACE_Y, FACE_Y + 0.7, 0.4);
    const cup = box3(mid - 4.2, mid + 4.2, FACE_Y + 0.7, FACE_Y + 2.6, 0.9);
    box(`drawer${index}.front`, front, FRONT_Z0, FRONT_Z1 - FRONT_Z0, {
      tone: "mid",
      bevel: 0.5,
      inner: L(faceRect(FACE_Y, x0 + 2.4, x1 - 2.4, FRONT_Z0 + 2, FRONT_Z1 - 2, 0.8), { tone: "faint" }),
    });
    put(
      `drawer${index}.holder`,
      S(slabOf(holder, holderZ[0], holderZ[1] - holderZ[0], P, 2), { tone: "mid" }) + L(window, { tone: "lo" }) + L(words, { tone: "lo", free: true }) + D(dotAt([P3(mid - 7.4, FACE_Y + 0.6, (holderZ[0] + holderZ[1]) / 2), P3(mid + 7.4, FACE_Y + 0.6, (holderZ[0] + holderZ[1]) / 2)]), { size: 0.4 }),
      [slabShape(holder, holderZ[0], holderZ[1] - holderZ[0], 2)],
    );
    box(`drawer${index}.pullplate`, pullPlate, 12, 3.6, { tone: "mid", steps: 2, extra: D(dotAt([P3(mid - 4.6, FACE_Y + 0.7, 13.8), P3(mid + 4.6, FACE_Y + 0.7, 13.8)]), { size: 0.35 }) });
    box(`drawer${index}.pull`, cup, 12.5, 2.2, { tone: "mid", steps: 3, bevel: 0.3 });
  }, `drawer.${index}`);
}

function cabinet() {
  const ends = [box3(CAB_X0, CAB_X0 + END, CAB_Y0, FACE_Y, 0.6), box3(CAB_X1 - END, CAB_X1, CAB_Y0, FACE_Y, 0.6)];
  box("cab.end#0", ends[0]!, 0, SLAB_Z, { tone: "mid", steps: 2 });
  const plinth = box3(CAB_X0 + END, CAB_X1 - END, CAB_Y0, FACE_Y - 3, 0.5);
  box("cab.plinth", plinth, 0, PLINTH_H, { tone: "lo", steps: 2 });
  const deck = box3(CAB_X0 + END, CAB_X1 - END, CAB_Y0, FACE_Y, 0.4);
  box("cab.deck", deck, PLINTH_H, DECK_Z - PLINTH_H, { tone: "mid", steps: 2, inner: L(faceLine(FACE_Y, deck.x, deck.x + deck.w, PLINTH_H + 2.3), { tone: "faint" }) });
  const endDetail = (plan: Plan) =>
    L(sideRect(plan.x + plan.w, CAB_Y0 + 5, FACE_Y - 5, 5, SLAB_Z - 5, 1.2), { tone: "faint" }) +
    D(dotAt([P3(plan.x + plan.w, CAB_Y0 + 2.4, 2.6), P3(plan.x + plan.w, FACE_Y - 2.4, 2.6), P3(plan.x + plan.w, CAB_Y0 + 2.4, SLAB_Z - 2.6), P3(plan.x + plan.w, FACE_Y - 2.4, SLAB_Z - 2.6)]), { size: 0.4 });
  for (let index = 0; index < DRAWERS; index++) {
    drawer(index);
    if (index < DRAWERS - 1) {
      const x = bayX(index + 1);
      box(`cab.part#${index + 1}`, box3(x - PART, x, CAB_Y0, FACE_Y, 0.4), DECK_Z, SLAB_Z - DECK_Z, { tone: "mid", steps: 2 });
    }
  }
  box("cab.end#1", ends[1]!, 0, SLAB_Z, { tone: "mid", steps: 2, inner: endDetail(ends[1]!) });
  const top = box3(CAB_X0 - OVERHANG, CAB_X1 + OVERHANG, CAB_Y0 - OVERHANG, FACE_Y + OVERHANG, 1.4);
  const slots = Array.from({ length: DRAWERS }, (_, index) => box3(bayMid(index) - 15.5, bayMid(index) + 15.5, TRACK_Y - 0.9, TRACK_Y + 0.9, 0.9));
  const slotFill = slots.map((plan) => `<path class="kb-slot" d="${planOutline(plan, TOP_Z, P, 3)}"/>`).join("");
  const screws = [P3(top.x + 4, top.y + 4, TOP_Z), P3(top.x + top.w - 4, top.y + 4, TOP_Z), P3(top.x + 4, top.y + top.d - 4, TOP_Z), P3(top.x + top.w - 4, top.y + top.d - 4, TOP_Z)];
  box("cab.top", top, SLAB_Z, TOP_Z - SLAB_Z, {
    tone: "mid",
    steps: 6,
    bevel: 0.8,
    extra: slotFill + L(slots.map((plan) => planOutline(plan, TOP_Z, P, 3)).join(""), { tone: "lo" }) + D(dotAt(screws), { size: 0.45 }),
  });
}

/** A label plate behind each slot: the drawer's name, drawn as rule lines that stand for its text. */
function slotPlates() {
  for (let index = 0; index < DRAWERS; index++) {
    const mid = bayMid(index);
    const plate = box3(mid - 9, mid + 9, TRACK_Y - RAIL_GAP - RAIL_W - 7.4, TRACK_Y - RAIL_GAP - RAIL_W - 2, 0.8);
    const z = TOP_Z + 0.6;
    const rules = [0, 1].map((row) => lineOnTop([plate.x + 3.4, plate.y + 1.9 + row * 1.8], [plate.x + (row ? 10 : 14.6), plate.y + 1.9 + row * 1.8], z, P)).join("");
    box(`cab.label#${index}`, plate, TOP_Z, 0.6, {
      tone: "lo",
      crease: "none",
      steps: 2,
      extra: L(planOutline(insetPlan(plate, 1), z, P, 2), { tone: "faint" }) + L(rules, { tone: "lo", free: true }) + D(dotAt([P3(plate.x + 1.8, plate.y + plate.d / 2, z), P3(plate.x + plate.w - 1.8, plate.y + plate.d / 2, z)]), { size: 0.35 }),
    });
  }
}

/* ---------------------------------------------------------------- track */

const RAIL_X0 = CAB_X0 + 3;
const RAIL_X1 = HOUSING.x;
const backRail = box3(RAIL_X0, RAIL_X1, TRACK_Y - RAIL_GAP - RAIL_W, TRACK_Y - RAIL_GAP, 0.3);
const frontRail = box3(RAIL_X0, RAIL_X1, TRACK_Y + RAIL_GAP, TRACK_Y + RAIL_GAP + RAIL_W, 0.3);
const BRIDGE = box3(CAB_X1 + OVERHANG, HOUSING.x, TRACK_Y - 7, TRACK_Y + 7, 0.6);

function bridge() {
  const screws = [P3(BRIDGE.x + 2.4, BRIDGE.y + 2, TOP_Z), P3(BRIDGE.x + BRIDGE.w - 2.4, BRIDGE.y + 2, TOP_Z), P3(BRIDGE.x + 2.4, BRIDGE.y + BRIDGE.d - 2, TOP_Z), P3(BRIDGE.x + BRIDGE.w - 2.4, BRIDGE.y + BRIDGE.d - 2, TOP_Z)];
  box("track.bridge", BRIDGE, TOP_Z - 3, 3, { tone: "lo", steps: 2, extra: D(dotAt(screws), { size: 0.4 }) });
}

function rail(name: string, plan: Plan) {
  const screws = Array.from({ length: 9 }, (_, index) => P3(RAIL_X0 + 6 + index * ((RAIL_X1 - RAIL_X0 - 12) / 8), plan.y + plan.d / 2, TOP_Z + RAIL_H));
  box(name, plan, TOP_Z, RAIL_H, { tone: "mid", steps: 2, extra: D(dotAt(screws), { size: 0.3, tone: "lo" }) });
}

function stops() {
  const plan = box3(RAIL_X0 - 2.6, RAIL_X0, TRACK_Y - RAIL_GAP - RAIL_W - 0.6, TRACK_Y + RAIL_GAP + RAIL_W + 0.6, 0.5);
  box("track.stop", plan, TOP_Z, RAIL_H + 1.4, { tone: "mid", steps: 2 });
}

/* --------------------------------------------------- the card in transit */

export const TRANSIT_X = HOUSING.x + 1;

function transit() {
  const plan = box3(TRANSIT_X, TRANSIT_X + CARD.w, TRACK_Y - CARD.t / 2, TRACK_Y + CARD.t / 2, 0.2);
  const [t0, t1] = [TRANSIT_X + CARD.w / 2 - CARD.tabW / 2, TRANSIT_X + CARD.w / 2 + CARD.tabW / 2];
  const tab = box3(t0, t1, plan.y, plan.y + plan.d, 0.2);
  const face = TRACK_Y + CARD.t / 2;
  const rules = L([BED_Z + CARD.h - 3.4, BED_Z + CARD.h - 5.8, BED_Z + CARD.h - 8.2].map((z, row) => faceLine(face, plan.x + 3, plan.x + plan.w - (row === 1 ? 9 : 4), z)).join(""), { tone: "lo", free: true });
  within("transit", () =>
    put(
      "transit.card",
      S(slabOf(plan, BED_Z, CARD.h, P, 2), { tone: "hi", crease: "none" as Tone, className: "kb-litable" }) + S(slabOf(tab, BED_Z + CARD.h, CARD.tab, P, 2), { tone: "hi", crease: "none" as Tone, className: "kb-litable" }) + rules,
      [slabShape(plan, BED_Z, CARD.h, 2), slabShape(tab, BED_Z + CARD.h, CARD.tab, 2)],
    ),
  );
}

/** The drop: a card is drawn only above the cabinet top in its own plane, so it sinks into its slot. */
function dropClip() {
  const a = at([-400, TRACK_Y, TOP_Z]);
  const b = at([400, TRACK_Y, TOP_Z]);
  return `<clipPath id="kbp-drop"><path d="M${f1(a[0])} ${f1(a[1])}L${f1(b[0])} ${f1(b[1])}L${f1(b[0])} -600L${f1(a[0])} -600Z"/></clipPath>`;
}

/* ---------------------------------------------------------------- press */

const BED: Plan = { x: HOUSING.x, y: STAND.y - 1, w: STAND.x + STAND.w + 1 - HOUSING.x, d: STAND.d + 2, r: 2.4 };

function press() {
  const halo = `<path class="iso-halo" d="${haloOf(STAND, 0, STAND_H, P)}"/>`;
  const door = faceRect(STAND.y + STAND.d, STAND.x + 10, STAND.x + 58, 5, STAND_H - 5, 1.6);
  const door2 = faceRect(STAND.y + STAND.d, STAND.x + 66, STAND.x + STAND.w - 10, 5, STAND_H - 5, 1.6);
  const vents = Array.from({ length: 7 }, (_, index) => sideRect(STAND.x + STAND.w, STAND.y + 12 + index * 4, STAND.y + 13.4 + index * 4, 9, 21, 0.7, 2)).join("");
  const doorScrews = D(dotAt([P3(STAND.x + 13, STAND.y + STAND.d, 8), P3(STAND.x + 13, STAND.y + STAND.d, STAND_H - 8), P3(STAND.x + STAND.w - 13, STAND.y + STAND.d, 8), P3(STAND.x + STAND.w - 13, STAND.y + STAND.d, STAND_H - 8)]), { size: 0.4 });
  box("press.stand", STAND, 0, STAND_H, { tone: "mid", steps: 4, inner: L(door + door2 + vents, { tone: "faint" }), extra: doorScrews });
  entries[entries.length - 1] = { ...(entries[entries.length - 1] as Item), svg: halo + (entries[entries.length - 1] as Item).svg };
  [STAND.x + 54.5, STAND.x + 69.5].forEach((x, index) =>
    box(`press.handle#${index}`, box3(x - 0.9, x + 0.9, STAND.y + STAND.d, STAND.y + STAND.d + 1.4, 0.5), 11, 10, { tone: "mid", steps: 2, bevel: 0.2 }),
  );
  const bedScrews = [P3(BED.x + 3, BED.y + 3, BED_Z), P3(BED.x + BED.w - 3, BED.y + 3, BED_Z), P3(BED.x + 3, BED.y + BED.d - 3, BED_Z), P3(BED.x + BED.w - 3, BED.y + BED.d - 3, BED_Z)];
  const dieSeat = planOutline(box3(PLATEN.x - 1, PLATEN.x + PLATEN.w + 1, PLATEN.y - 1, PLATEN.y + PLATEN.d + 1, 1.6), BED_Z, P, 3);
  box("press.bed", BED, STAND_H, BED_Z - STAND_H, { tone: "mid", steps: 5, bevel: 0.8, extra: L(dieSeat, { tone: "faint" }) + D(dotAt(bedScrews), { size: 0.45 }) });
}

function pressTop() {

  const lid = insetPlan(HOUSING, 2.2);
  const slot = box3(HOUSING.x + 3, HOUSING.x + HOUSING.w - 3, TRACK_Y - 0.9, TRACK_Y + 0.9, 0.9);
  box("press.housing", HOUSING, BED_Z, HOUSING_H, {
    tone: "mid",
    steps: 3,
    bevel: 0.6,
    inner: L(sideSeam(HOUSING, BED_Z + 4, P, 3), { tone: "faint" }),
    extra: L(planOutline(lid, BED_Z + HOUSING_H, P, 3), { tone: "faint" }) + `<path class="kb-slot" d="${planOutline(slot, BED_Z + HOUSING_H, P, 3)}"/>` + L(planOutline(slot, BED_Z + HOUSING_H, P, 3), { tone: "lo" }) + D(dotAt([P3(lid.x + 1.2, lid.y + 1.2, BED_Z + HOUSING_H), P3(lid.x + lid.w - 1.2, lid.y + 1.2, BED_Z + HOUSING_H), P3(lid.x + 1.2, lid.y + lid.d - 1.2, BED_Z + HOUSING_H), P3(lid.x + lid.w - 1.2, lid.y + lid.d - 1.2, BED_Z + HOUSING_H)]), { size: 0.4 }),
  });

  const columnFace = COLUMN.y + COLUMN.d;
  box("press.column", COLUMN, BED_Z, ARM_Z - BED_Z, {
    tone: "mid",
    steps: 3,
    bevel: 0.6,
    inner: L(sideSeam(COLUMN, BED_Z + 5, P, 3) + faceRect(columnFace, COLUMN.x + 5, COLUMN.x + COLUMN.w - 5, BED_Z + 10, ARM_Z - 6, 1.4), { tone: "faint" }),
  });

  const fenceBack = box3(FEED.x - 4, FEED.x + FEED.w + 4, FEED.y - 3.4, FEED.y - 0.6, 0.6);
  const fenceFront = box3(FEED.x - 4, FEED.x + FEED.w + 4, FEED.y + FEED.d + 0.6, FEED.y + FEED.d + 3.4, 0.6);
  box("press.fence#0", fenceBack, BED_Z, 3, { tone: "mid", steps: 2, bevel: 0.3 });

  docs();

  box("press.fence#1", fenceFront, BED_Z, 3, { tone: "mid", steps: 2, bevel: 0.3, extra: D(dotAt([P3(fenceFront.x + 3, fenceFront.y + fenceFront.d / 2, BED_Z + 3), P3(fenceFront.x + fenceFront.w - 3, fenceFront.y + fenceFront.d / 2, BED_Z + 3)]), { size: 0.4 }) });

  within("platen", () => {
    const die = insetPlan(PLATEN, 1.2);
    const dieZ = PLATEN_Z - 1.4;
    const blades = [1, 2, 3].map((k) => segment([die.x + (die.w * k) / 4, die.y + die.d, dieZ], [die.x + (die.w * k) / 4, die.y + die.d, PLATEN_Z], P)).join("");
    box("platen.die", die, dieZ, 1.4, { tone: "lo", steps: 2, inner: L(blades, { tone: "lo" }) });
    box("platen.plate", PLATEN, PLATEN_Z, PLATEN_H, {
      tone: "mid",
      steps: 3,
      bevel: 0.6,
      inner: L(sideSeam(PLATEN, PLATEN_Z + 2, P, 3), { tone: "faint" }),
      extra: D(dotAt([P3(PLATEN.x + 3, PLATEN.y + 3, PLATEN_Z + PLATEN_H), P3(PLATEN.x + PLATEN.w - 3, PLATEN.y + 3, PLATEN_Z + PLATEN_H), P3(PLATEN.x + 3, PLATEN.y + PLATEN.d - 3, PLATEN_Z + PLATEN_H), P3(PLATEN.x + PLATEN.w - 3, PLATEN.y + PLATEN.d - 3, PLATEN_Z + PLATEN_H)]), { size: 0.45 }),
    });
    post("platen.collar", ROD.x, ROD.y, ROD.r + 1.8, PLATEN_Z + PLATEN_H, 2.2, { tone: "mid", bevel: 0.4 });
    const rodTop = ARM_Z + ARM_H - 1;
    post("platen.rod", ROD.x, ROD.y, ROD.r, PLATEN_Z + PLATEN_H + 2.2, rodTop - (PLATEN_Z + PLATEN_H + 2.2), { tone: "mid", crease: "none", inner: L(sideArc(ROD.x, ROD.y, ROD.r, PLATEN_Z + PLATEN_H + 6, P, 18), { tone: "faint" }) });
  }, "press");

  within(undefined, () => {
    const armFace = ARM.y + ARM.d;
    const gauge = { x: ARM.x + 13, z: ARM_Z + ARM_H / 2, r: 4.2 };
    const gaugeTicks = Array.from({ length: 9 }, (_, index) => {
      const angle = Math.PI * (1.15 - (index / 8) * 1.3);
      const r0 = index % 4 === 0 ? gauge.r - 1.6 : gauge.r - 1;
      return segment([gauge.x + Math.cos(angle) * r0, armFace + 0.8, gauge.z + Math.sin(angle) * r0], [gauge.x + Math.cos(angle) * (gauge.r - 0.5), armFace + 0.8, gauge.z + Math.sin(angle) * (gauge.r - 0.5)], P);
    }).join("");
    const needle = segment([gauge.x, armFace + 0.9, gauge.z], [gauge.x + Math.cos(Math.PI * 0.82) * (gauge.r - 1), armFace + 0.9, gauge.z + Math.sin(Math.PI * 0.82) * (gauge.r - 1)], P);
    const plate = { x: ARM.x + ARM.w - 22, y: armFace, z0: ARM_Z + 3, z1: ARM_Z + ARM_H - 3 };
    const plateRule = [plate.z1 - 2, plate.z1 - 4].map((z, row) => faceLine(armFace, plate.x + 2.4, plate.x + (row ? 10 : 14), z)).join("");
    const gland = S(cylinder(ROD.x, ROD.y, ROD.r + 2, ARM_Z - 1.6, 1.6, P, 28), { tone: "mid" });
    box("press.arm", ARM, ARM_Z, ARM_H, {
      tone: "mid",
      steps: 4,
      bevel: 0.8,
      before: gland,
      shapes: [cylShape(ROD.x, ROD.y, ROD.r + 2, ARM_Z - 1.6, 1.6)],
      inner: L(sideSeam(ARM, ARM_Z + 3, P, 4), { tone: "faint" }),
      extra:
        L(faceRect(armFace, plate.x, plate.x + 17, plate.z0, plate.z1, 0.6), { tone: "lo" }) +
        L(plateRule, { tone: "lo", free: true }) +
        D(dotAt([P3(plate.x + 1.4, armFace, plate.z0 + 1.2), P3(plate.x + 15.6, armFace, plate.z0 + 1.2)]), { size: 0.35 }),
    });
    const bezel = box3(gauge.x - gauge.r - 0.6, gauge.x + gauge.r + 0.6, armFace, armFace + 0.8, gauge.r);
    put(
      "press.gauge",
      S(slabOf(bezel, gauge.z - gauge.r - 0.6, (gauge.r + 0.6) * 2, P, 2), { tone: "mid" }) +
        L(faceCircle(armFace + 0.8, gauge.x, gauge.z, gauge.r, 36), { tone: "lo" }) +
        L(gaugeTicks, { tone: "lo" }) +
        L(needle, { tone: "hi", free: "end" }) +
        D([at([gauge.x, armFace + 0.9, gauge.z])], { size: 0.55, tone: "hi" }),
      [slabShape(bezel, gauge.z - gauge.r - 0.6, (gauge.r + 0.6) * 2, 2)],
    );
    const cyl = { x: ROD.x, y: ROD.y - 3, r: 9.5 };
    const cylTop = ARM_Z + ARM_H;
    post("press.cylinder.base", cyl.x, cyl.y, cyl.r + 1.6, cylTop, 2.4, { tone: "mid", bevel: 0.4 });
    post("press.cylinder", cyl.x, cyl.y, cyl.r, cylTop + 2.4, 13, {
      tone: "mid",
      crease: "none",
      inner: L(sideArc(cyl.x, cyl.y, cyl.r, cylTop + 8.9, P, 30), { tone: "faint" }),
    });
    post("press.cylinder.cap", cyl.x, cyl.y, cyl.r + 1.6, cylTop + 15.4, 2.4, {
      tone: "mid",
      bevel: 0.4,
      extra: D(Array.from({ length: 8 }, (_, index) => (index / 8) * Math.PI * 2 + Math.PI / 8).map((angle) => at([cyl.x + Math.cos(angle) * (cyl.r - 0.4), cyl.y + Math.sin(angle) * (cyl.r - 0.4), cylTop + 17.8])), { size: 0.45 }),
    });
    post("press.cylinder.port", cyl.x + 3.2, cyl.y + 2.4, 2, cylTop + 17.8, 2.6, { tone: "mid", extra: L(ring(cyl.x + 3.2, cyl.y + 2.4, 1, cylTop + 20.4, P, 14), { tone: "lo" }) });
    post("press.cylinder.knob", cyl.x - 4, cyl.y - 1, 2.2, cylTop + 17.8, 2.4, { tone: "mid", extra: L(knurl(cyl.x - 4, cyl.y - 1, 2.2, cylTop + 17.8, cylTop + 20.2, 16, P), { tone: "lo" }) });
  }, "press");
}

/* ------------------------------------------------------------- the files */

const DOC_PLANS: Record<string, Plan> = {
  link: box3(FEED.x, FEED.x + 16, FEED.y + 5, FEED.y + 17, 3),
  word: box3(FEED.x + 18, FEED.x + 38, FEED.y + 1.4, FEED.y + FEED.d - 1.4, 0.6),
  pdf: box3(FEED.x + 40, FEED.x + 62, FEED.y, FEED.y + FEED.d, 1.2),
};
const DOC_Z: Record<string, [number, number]> = { pdf: [BED_Z, BED_Z + 1.2], word: [BED_Z, BED_Z + 0.4], link: [BED_Z, BED_Z + 0.4] };

/** How a fed file moves: along the bed to under the platen, then down to the bed. */
export const FEEDS = DOCS.map(({ kind }) => ({ dx: UNDER_X - DOC_PLANS[kind]!.x, dz: BED_Z - DOC_Z[kind]![0] }));

function docs() {
  const order = DOCS.map((doc, index) => ({ doc, index })).sort((a, b) => DOC_PLANS[a.doc.kind]!.x - DOC_PLANS[b.doc.kind]!.x);
  for (const { doc, index } of order) {
    const plan = DOC_PLANS[doc.kind]!;
    const [z0, z1] = DOC_Z[doc.kind]!;
    within(`doc.${index}`, () => {
      if (doc.kind === "pdf") {
        const seams = L(sideSeam(plan, z0 + 0.4, P, 3) + sideSeam(plan, z0 + 0.8, P, 3), { tone: "faint" });
        const text = [0, 1, 2, 3, 4].map((row) => lineOnTop([plan.x + 3.6, plan.y + 4 + row * 2.4], [plan.x + (row === 4 ? 12 : 18), plan.y + 4 + row * 2.4], z1, P)).join("");
        const badge = box3(plan.x + plan.w - 9, plan.x + plan.w - 3, plan.y + plan.d - 7, plan.y + plan.d - 3, 0.6);
        const staple = [P3(plan.x + 2.4, plan.y + 2.4, z1), P3(plan.x + 5.6, plan.y + 2.4, z1)];
        put(
          "doc.pdf",
          S(slabOf(plan, z0, z1 - z0, P, 3), { tone: "hi", inner: seams, className: "kb-litable" }) + L(text, { tone: "lo", free: true }) + L(planOutline(badge, z1, P, 2), { tone: "mid" }) + L(planOutline(insetPlan(badge, 1.1), z1, P, 2), { tone: "lo" }) + L(pathOf(dotAt(staple)), { tone: "mid" }) + D(dotAt(staple), { size: 0.45, tone: "hi" }),
          [slabShape(plan, z0, z1 - z0, 3)],
        );
      } else if (doc.kind === "word") {
        const fold = [P3(plan.x + plan.w - 6, plan.y + plan.d, z1), P3(plan.x + plan.w, plan.y + plan.d - 6, z1), P3(plan.x + plan.w - 6, plan.y + plan.d - 6, z1)];
        const text = [0, 1, 2, 3].map((row) => lineOnTop([plan.x + 3.2, plan.y + 3.6 + row * 2.6], [plan.x + (row === 3 ? 11 : 15.6), plan.y + 3.6 + row * 2.6], z1, P)).join("");
        const heading = lineOnTop([plan.x + 3.2, plan.y + plan.d - 4], [plan.x + 10, plan.y + plan.d - 4], z1, P);
        put(
          "doc.word",
          S(slabOf(plan, z0, z1 - z0, P, 2), { tone: "hi", className: "kb-litable" }) + L(text, { tone: "lo", free: true }) + L(heading, { tone: "mid", free: true }) + L(pathOf(dotAt(fold), true), { tone: "mid" }),
          [slabShape(plan, z0, z1 - z0, 2)],
        );
      } else {
        const eye: Point3 = [plan.x + 3.8, plan.y + plan.d / 2, z1];
        const chain = [box3(plan.x + 6.8, plan.x + 10.8, plan.y + 2.8, plan.y + 5.2, 1.2), box3(plan.x + 9.2, plan.x + 13.2, plan.y + 4.4, plan.y + 6.8, 1.2)];
        const text = [0, 1].map((row) => lineOnTop([plan.x + 6.8, plan.y + 8.8 + row * 2], [plan.x + (row ? 10.4 : 13), plan.y + 8.8 + row * 2], z1, P)).join("");
        put(
          "doc.link",
          S(slabOf(plan, z0, z1 - z0, P, 4), { tone: "hi", className: "kb-litable" }) +
            L(ring(eye[0], eye[1], 1.5, z1, P, 16), { tone: "mid" }) +
            L(ring(eye[0], eye[1], 0.8, z1, P, 12), { tone: "lo" }) +
            L(chain.map((c) => planOutline(c, z1, P, 3)).join(""), { tone: "mid" }) +
            L(text, { tone: "lo", free: true }),
          [slabShape(plan, z0, z1 - z0, 4)],
        );
      }
    });
  }
}

/* ------------------------------------------------- gantry rail and arm */

const RAIL_PLAN = box3(GANTRY.x0, GANTRY.x1, GANTRY.y0, GANTRY.y1, 0.8);

function gantryRail() {
  box("gantry.cap#0", box3(GANTRY.x0 - 1.6, GANTRY.x0, GANTRY.y0 - 0.6, GANTRY.y1 + 0.6, 0.4), GANTRY.z0 - 0.6, GANTRY.z1 - GANTRY.z0 + 1.2, { tone: "mid", steps: 2 });
  const ticks = sideTicks(GANTRY.x0 + 8, GANTRY.x1 - 6, 4, 5, GANTRY.y1, GANTRY.z1 - 0.6, [1.4, 2.8], P, "x");
  const seam = faceLine(GANTRY.y1, GANTRY.x0, GANTRY.x1, GANTRY.z1 - 0.6);
  box("gantry.rail", RAIL_PLAN, GANTRY.z0, GANTRY.z1 - GANTRY.z0, {
    tone: "mid",
    steps: 3,
    bevel: 0.6,
    inner: L(seam, { tone: "faint" }),
    extra: L(ticks.minor, { tone: "lo" }) + L(ticks.major, { tone: "mid" }) + D(dotAt(POSTS.map((x) => P3(x + POST_W / 2, (GANTRY.y0 + GANTRY.y1) / 2, GANTRY.z1))), { size: 0.5 }),
  });
  box("gantry.cap#1", box3(GANTRY.x1, GANTRY.x1 + 1.6, GANTRY.y0 - 0.6, GANTRY.y1 + 0.6, 0.4), GANTRY.z0 - 0.6, GANTRY.z1 - GANTRY.z0 + 1.2, { tone: "mid", steps: 2 });
}

function arm() {
  const xa = ARM_PARK;
  const xm = xa + MAST.x;
  within("arm", () => {
    const top = box3(xa - 9, xm + 4, GANTRY.y0 - 1.5, MAST.y - MAST.half, 1);
    const skirt = box3(xa - 9, xm + 4, GANTRY.y1, MAST.y - MAST.half, 0.4);
    box("arm.skirt", skirt, GANTRY.z0 - 2, GANTRY.z1 - GANTRY.z0 + 2, {
      tone: "mid",
      steps: 2,
      extra: D(dotAt([P3(skirt.x + 2, MAST.y - MAST.half, GANTRY.z0 - 0.4), P3(skirt.x + skirt.w - 2, MAST.y - MAST.half, GANTRY.z0 - 0.4)]), { size: 0.4 }),
    });
    box("arm.carriage", top, GANTRY.z1, 5, {
      tone: "mid",
      steps: 3,
      bevel: 0.6,
      extra: L(planOutline(insetPlan(top, 2), GANTRY.z1 + 5, P, 3), { tone: "faint" }) + D(dotAt([P3(top.x + 1.4, top.y + 1.4, GANTRY.z1 + 5), P3(top.x + top.w - 1.4, top.y + 1.4, GANTRY.z1 + 5), P3(top.x + 1.4, top.y + top.d - 1.4, GANTRY.z1 + 5), P3(top.x + top.w - 1.4, top.y + top.d - 1.4, GANTRY.z1 + 5)]), { size: 0.45 }),
    });
    post("arm.knob", xa, top.y + top.d / 2, 2.4, GANTRY.z1 + 5, 3, { tone: "mid", steps: 20, extra: L(knurl(xa, top.y + top.d / 2, 2.4, GANTRY.z1 + 5, GANTRY.z1 + 8, 16, P), { tone: "lo" }) });
  });
  within("arm/head", () => {
    const up = MOTION.up;
    const head = box3(xa + HEAD.x0, xa + HEAD.x1, HEAD.y0, HEAD.y1, 0.8);
    const stem = box3(xa - 1, xa + 1, PICK_Y + 0.2, PICK_Y + 1.6, 0.3);
    const pad = box3(xa - 3.5, xa + 3.5, PICK_Y, PICK_Y + 1.4, 0.6);
    box("head.pad", pad, PAD_Z[0] + up, PAD_Z[1] - PAD_Z[0], { tone: "lo", steps: 3 });
    box("head.stem", stem, PAD_Z[1] + up, HEAD.z0 - PAD_Z[1], { tone: "mid", steps: 2 });
    const bolts = [P3(xa - 2.6, HEAD.y0 + 1.4, HEAD.z0 + up + HEAD.h), P3(xa + 2.6, HEAD.y0 + 1.4, HEAD.z0 + up + HEAD.h), P3(xm, HEAD.y0 + 1.4, HEAD.z0 + up + HEAD.h)];
    box("head.body", head, HEAD.z0 + up, HEAD.h, {
      tone: "mid",
      steps: 3,
      bevel: 0.5,
      inner: L(sideSeam(head, HEAD.z0 + up + HEAD.h / 2, P, 3), { tone: "faint" }),
      extra: D(dotAt(bolts), { size: 0.4 }),
    });
  });
  within("arm", () => {
    const mast = box3(xm - MAST.half, xm + MAST.half, MAST.y - MAST.half, MAST.y + MAST.half, 0.3);
    const marks = join([44, 52, 60, 68].map((z) => faceLine(MAST.y + MAST.half, xm - MAST.half, xm + MAST.half, z)));
    box("arm.stop", box3(xm - MAST.half - 0.4, xm + MAST.half + 0.4, MAST.y - MAST.half, MAST.y + MAST.half + 0.4, 0.3), MAST.bottom, 1.2, { tone: "mid", steps: 2 });
    box("arm.mast", mast, MAST.bottom + 1.2, GANTRY.z0 + 2 - MAST.bottom - 1.2, { tone: "mid", steps: 2, inner: L(marks, { tone: "lo" }) });
  });
}

/* -------------------------------------------------------------- compose */

base();
gantryPost(0);
cabinet();
slotPlates();
bridge();
within(undefined, press, "press");
stops();
rail("track.rail#0", backRail);
entries.push({ slot: "transit" });
within(undefined, transit, "press");
rail("track.rail#1", frontRail);
entries.push({ slot: "lift" });
gantryPost(1);
within(undefined, pressTop, "press");
gantryRail();
arm();

export const ENTRIES: readonly Entry[] = entries;
export const isMarker = (entry: Entry): entry is Marker => "slot" in entry;

/** The SVG body: every entry in order, live groups opened and closed around their items. */
export function bodyOf(list: readonly Entry[] = ENTRIES, transforms: Record<string, string> = {}) {
  const out: string[] = [dropClip()];
  let open: string[] = [];
  const close = (depth: number) => {
    while (open.length > depth) {
      const name = open.pop()!;
      out.push(`</g>`);
      if (name === "transit") out.push(`</g>`);
    }
  };
  for (const entry of list) {
    if (isMarker(entry)) {
      close(0);
      if (entry.slot === "transit") continue;
      out.push(`<g data-kb-slot="${entry.slot}"></g>`);
      continue;
    }
    const path = entry.part ? entry.part.split("/") : [];
    let common = 0;
    while (common < open.length && common < path.length && open[common] === path[common]) common++;
    close(common);
    for (let depth = common; depth < path.length; depth++) {
      const name = path[depth]!;
      const extra = transforms[name] ? ` transform="${transforms[name]}"` : "";
      if (name === "transit") out.push(`<g clip-path="url(#kbp-drop)">`);
      out.push(`<g data-kb="${name}"${name.startsWith("drawer.") ? ` data-kb-drawer="${name.slice(7)}"` : ""}${extra}>`);
      open.push(name);
    }
    out.push(entry.svg);
  }
  close(0);
  return out.join("");
}

export const BODY = bodyOf();

/** What the client needs to move the parts: screen vectors and rest positions, no geometry. */
export const LIVE = {
  axes: AXES,
  armPark: ARM_PARK,
  armAt: Array.from({ length: DRAWERS }, (_, index) => bayMid(index)),
  transitAt: Array.from({ length: DRAWERS }, (_, index) => bayMid(index) - (TRANSIT_X + CARD.w / 2)),
  feeds: FEEDS,
};

export const VIEW = { width: WIDTH, height: HEIGHT };
