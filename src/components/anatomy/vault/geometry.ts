import * as k from "../../iso/iso-kit";
import type { Faded, Flat, Plan, Point3, Projection, SolidPaths, SolidStyle, Tone } from "../../iso/iso-kit";
import * as G from "../../iso/lathe.mjs";
import { FIRST_LINE, PITCH, PLAY, ROLES, ROLL_R, TEETH, TOOTH, type Locale } from "./model";
import { KEYS as SETTLED } from "./order";
import {
  AZIMUTH,
  BEZEL,
  BEZEL_R,
  BODY,
  BODY_TOP,
  CARD_FOOT,
  CARD_FOOT_H,
  CARD_LEAN,
  CARD_T,
  CARD_X,
  CHEEK_L,
  CHEEK_R,
  CHEEK_R_X,
  CHEEK_TOP,
  CHEEK_Y,
  CORNICE,
  CORNICE_TOP,
  CRANK,
  CRANK_R,
  CRANK_REST,
  DOOR_COLS,
  DOOR_H,
  DOOR_ROWS,
  DOOR_T,
  DOOR_W,
  EX,
  EY,
  EZ,
  FLANGE,
  FLANGE_H,
  FLANGE_R,
  FLANGE_T,
  FOOT_H,
  FRONT,
  HEAD_Z,
  HEIGHT,
  HOUSING,
  HOUSING_TOP,
  HUB,
  KEY_T,
  KEY_Y,
  KEY_Z,
  KNOB,
  KNOB_R,
  NAME_PLATE,
  P,
  PANEL,
  PANEL_Z,
  PAWL_HUB,
  PAWL_IN,
  PAWL_NOSE,
  PAWL_OUT,
  PAWL_PIVOT,
  PAWL_PIVOT_AT,
  PAWL_PIVOT_R,
  PAWL_TIP_AT,
  PIN_HEAD_R,
  PIN_R,
  PBASE,
  PBASE_TOP,
  PLATE,
  PLATE_H,
  PLINTH,
  PLINTH_TOP,
  PLUG,
  PLUG_R,
  PRINT_Z,
  P_FRONT,
  P_SIDE,
  ROLL_X,
  SHAFT_R,
  SIDE,
  SLOT,
  SPOOL_Y,
  SPOOL_Z,
  STRIP_Y,
  BEZEL_W,
  BEZEL_T,
  TAPE_X,
  TAPE_Y,
  WHEEL,
  WHEEL_ROOT,
  WHEEL_TIP,
  WIDTH,
  WINDOW,
  at,
} from "./view";

type Frame = { o: Point3; a: Point3; u: Point3; v: Point3 };

/** lathe.mjs is untyped JS; this is the one call whose inferred option types are too narrow. */
const ribsOf = G.ribsOf as unknown as (F: Frame, s0: number, s1: number, r: number, count: number, P: Projection, options: { fade?: [number, number]; seams?: boolean }) => Faded[];

/** A recorded shape, as plain data: the verification build turns it into an audit shape. */
export type Shape =
  | { kind: "slab"; plan: Plan; z: number; h: number; steps: number; meta: Meta }
  | { kind: "cyl"; cx: number; cy: number; r: number; z: number; h: number; meta: Meta }
  | { kind: "disc"; F: Frame; s0: number; s1: number; r: number; meta: Meta }
  | { kind: "prism"; F: Frame; poly: Flat[]; s0: number; s1: number; meta: Meta }
  | { kind: "box"; min: Point3; max: Point3; meta: Meta };

interface Meta {
  name: string;
  owner?: string;
  ground?: boolean;
}

export interface Item {
  name: string;
  at: Point3;
  bias: number;
  key: number;
  svg: string;
  shapes: Shape[];
}

const V = G.viewOf(P) as Point3;
const L = G.lightOf(P) as Point3;
const dot3 = (a: Point3, b: Point3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const S = (paths: SolidPaths, style: SolidStyle = {}) => k.solidSvg(paths, style);
const Ln = (d: string, style: Parameters<typeof k.lineSvg>[1] = {}) => k.lineSvg(d, style);
const Dots = (points: Flat[], size = 0.5, tone: Tone = "mid") => k.dotsSvg(points, { size, tone });
const r1 = (value: number) => Math.round(value * 1000) / 1000;

const items: Item[] = [];

const make = (name: string, ref: Point3, svg: string, shapes: Shape[], bias = 0): Item => ({ name, at: ref, bias, key: dot3(ref, V) + bias, svg, shapes });

function put(name: string, ref: Point3, svg: string, shapes: Shape[], bias = 0) {
  items.push(make(name, ref, svg, shapes, bias));
}

const slabShape = (name: string, plan: Plan, z: number, h: number, steps = 8, meta: Partial<Meta> = {}): Shape => ({ kind: "slab", plan, z, h, steps, meta: { name, ...meta } });
const cylShape = (name: string, cx: number, cy: number, r: number, z: number, h: number, meta: Partial<Meta> = {}): Shape => ({ kind: "cyl", cx, cy, r, z, h, meta: { name, ...meta } });
const discShape = (name: string, F: Frame, s0: number, s1: number, r: number, meta: Partial<Meta> = {}): Shape => ({ kind: "disc", F, s0, s1, r, meta: { name, ...meta } });
const prismShape = (name: string, F: Frame, poly: Flat[], s0: number, s1: number, meta: Partial<Meta> = {}): Shape => ({ kind: "prism", F, poly, s0, s1, meta: { name, ...meta } });

const YZ_FRAME: Frame = { o: [0, 0, 0], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] };
const XF = (y: number, z: number): Frame => ({ o: [0, y, z], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] });
/** Frame along +x whose (u, v) are the side-face local coordinates (−y, −z) used by sideMatrix "right". */
const SIDE_F = (y: number, z: number): Frame => ({ o: [0, y, z], a: [1, 0, 0], u: [0, -1, 0], v: [0, 0, -1] });

const planeFront = (y: number) => k.sideMatrix([0, y], 0, P, "left");
const planeSide = (x: number, y = 0, z = 0) => k.sideMatrix([x, y], z, P, "right");
const flatRect = (x0: number, z0: number, x1: number, z1: number, r: number, steps = 6) =>
  k.pathOf(k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, steps).map(([u, z]) => [u, -z] as Flat), true);
const circlePath = (cx: number, cy: number, r: number, steps = 28) =>
  k.pathOf(Array.from({ length: steps }, (_, i) => [cx + r * Math.cos((i / steps) * Math.PI * 2), cy + r * Math.sin((i / steps) * Math.PI * 2)] as Flat), true);

const toneOf = (normal: Point3) => G.bandOf(dot3(normal, L) / Math.hypot(...normal)) as number;
const FRONT_TONE = toneOf([0, 1, 0]);

/* ------------------------------------------------------------------ base */

/* Three feet: the fourth, under the far corner, is hidden by the plate from this camera. */
const FEET: Flat[] = (k.corners(PLATE, 20) as Flat[]).filter(([x, y]) => !(x < PLATE.x + PLATE.w / 2 && y < PLATE.y + PLATE.d / 2));
for (const [x, y] of FEET) {
  const z = -PLATE_H - FOOT_H;
  put(`stand.foot-${x}-${y}`, [x, y, z + 2], S(k.cylinder(x, y, 7, z, 1.6, P, 18), { tone: "lo" }) + S(k.cylinder(x, y, 5.4, z + 1.6, FOOT_H - 1.6, P, 16), { tone: "mid" }), [
    cylShape("stand.foot", x, y, 7, z, 1.6, { ground: true }),
    cylShape("stand.foot", x, y, 5.4, z + 1.6, FOOT_H - 1.6, { ground: true }),
  ], -40);
}

{
  const screws = k.corners(PLATE, 9);
  const plate =
    `<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>` +
    S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid" }) +
    Ln(k.planOutline(k.insetPlan(PLATE, 4.5), 0, P), { tone: "lo" }) +
    Ln(screws.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }) +
    Dots(screws.map(([x, y]) => at([x, y, 0])), 0.5);
  put("stand.plate", [PLATE.x + PLATE.w / 2, PLATE.y + PLATE.d / 2, -PLATE_H / 2], plate, [slabShape("stand.plate", PLATE, -PLATE_H, PLATE_H, 8, { ground: true })], -60);
}

/* The disclosure placard: a card leaning back in a slotted foot, ruled like a printed notice. */
{
  const [[y0, z0], [y1, z1]] = CARD_LEAN;
  const along: Point3 = [0, y1 - y0, z1 - z0];
  const len = Math.hypot(along[1], along[2]);
  const unit: Point3 = [0, along[1] / len, along[2] / len];
  const normal: Point3 = [0, unit[2], -unit[1]];
  const back = CARD_T;
  const poly: Flat[] = [
    [y0, z0],
    [y1, z1],
    [y1 - normal[1] * back, z1 - normal[2] * back],
    [y0 - normal[1] * back, z0 - normal[2] * back],
  ];
  const card = G.prismOf(YZ_FRAME, poly, CARD_X[0], CARD_X[1], P);
  const o = at([CARD_X[0], y1, z1]);
  const down: Flat = [-(at([0, unit[1], unit[2]])[0] - at([0, 0, 0])[0]), -(at([0, unit[1], unit[2]])[1] - at([0, 0, 0])[1])];
  const face = `matrix(${r1(EX[0])} ${r1(EX[1])} ${r1(down[0])} ${r1(down[1])} ${r1(o[0])} ${r1(o[1])})`;
  const w = CARD_X[1] - CARD_X[0];
  const rows = [5.4, 8.2, 11, 13.8];
  const lengths = [24, 19, 26, 15];
  const rules = rows.map((v, i) => `M${r1(5.2)} ${v}H${r1(5.2 + lengths[i]!)}`).join("");
  const header = `M3 2.6H${r1(w - 3)}`;
  const marks = rows.map((v) => [3, v] as Flat);
  const ink =
    `<g transform="${face}">` +
    `<path class="iso-line" data-tone="faint" d="${k.pathOf([[1.2, 1], [w - 1.2, 1], [w - 1.2, len - 1], [1.2, len - 1]], true)}"/>` +
    `<path class="iso-line" data-tone="mid" data-free="" d="${header}"/>` +
    `<path class="iso-line" data-tone="lo" data-free="" d="${rules}"/>` +
    marks.map(([u, v]) => `<circle class="vlt-ink" cx="${u}" cy="${v}" r="0.55"/>`).join("") +
    `</g>`;
  const foot = S(k.slabOf(CARD_FOOT, 0, CARD_FOOT_H, P, 4, 0.4), { tone: "mid" });
  const slot = Ln(k.planOutline({ x: CARD_X[0] - 0.4, y: y0 - back - 0.3, w: w + 0.8, d: back + 0.6, r: 0.3 }, CARD_FOOT_H, P, 2), { tone: "lo" });
  const screws = Dots([at([CARD_FOOT.x + 2, CARD_FOOT.y + CARD_FOOT.d - 1.6, CARD_FOOT_H]), at([CARD_FOOT.x + CARD_FOOT.w - 2, CARD_FOOT.y + CARD_FOOT.d - 1.6, CARD_FOOT_H])], 0.4);
  put("card.foot", [CARD_FOOT.x + CARD_FOOT.w / 2, CARD_FOOT.y + CARD_FOOT.d / 2, CARD_FOOT_H / 2], foot + slot + screws, [slabShape("card.foot", CARD_FOOT, 0, CARD_FOOT_H, 4)]);
  put("card.card", [(CARD_X[0] + CARD_X[1]) / 2, (y0 + y1) / 2, (z0 + z1) / 2], S(card, { tone: "hi" }) + ink, [prismShape("card.card", YZ_FRAME, poly, CARD_X[0], CARD_X[1], { owner: "card.foot" })]);
}

/* ----------------------------------------------------------------- vault */

{
  const bolts = k.corners(FLANGE, 4.5);
  const svg =
    `<path class="iso-halo" d="${k.haloOf(FLANGE, 0, 6, P)}"/>` +
    S(k.slabOf(FLANGE, 0, FLANGE_H, P, 4, 0.5), { tone: "lo" }) +
    bolts.map(([x, y]) => S(k.cylinder(x, y, 2.1, FLANGE_H, 0.5, P, 12), { tone: "mid" }) + S(k.cylinder(x, y, 1.5, FLANGE_H + 0.5, 1.2, P, 6), { tone: "mid" })).join("") +
    Dots(bolts.map(([x, y]) => at([x, y, FLANGE_H + 1.7])), 0.35, "lo");
  put("vault.flange", [FLANGE.x + FLANGE.w / 2, FLANGE.y + FLANGE.d / 2, 1], svg, [
    slabShape("vault.flange", FLANGE, 0, FLANGE_H, 4),
    ...bolts.flatMap(([x, y]) => [cylShape("vault.bolt", x, y, 2.1, FLANGE_H, 0.5, { owner: "vault.flange" }), cylShape("vault.bolt", x, y, 1.5, FLANGE_H + 0.5, 1.2, { owner: "vault.flange" })]),
  ]);
  put("vault.plinth", [PLINTH.x + PLINTH.w / 2, PLINTH.y + PLINTH.d / 2, 4], S(k.slabOf(PLINTH, FLANGE_H, PLINTH_TOP - FLANGE_H, P, 4), { tone: "lo" }), [
    slabShape("vault.plinth", PLINTH, FLANGE_H, PLINTH_TOP - FLANGE_H, 4),
  ]);
}

{
  const seam = k.sideSeam(BODY, PLINTH_TOP + 3, P, 6);
  const front = planeFront(FRONT);
  const frameGroove = flatRect(DOOR_COLS[0]! - 3, DOOR_ROWS[0]! - 3, DOOR_COLS[3]! + DOOR_W + 3, DOOR_ROWS[1]! + DOOR_H + 3, 2);
  const sideVents = Array.from({ length: 5 }, (_, i) => {
    const y = BODY.y + 8 + i * 3.2;
    return k.pathOf(k.roundedPlan({ x: y - 0.7, y: 64, w: 1.4, d: 9, r: 0.7 }, 4).map(([u, z]) => at([SIDE, u, z])), true);
  }).join("");
  const svg =
    S(k.slabOf(BODY, PLINTH_TOP, BODY_TOP - PLINTH_TOP, P, 6, 1.6), { tone: "mid", inner: Ln(seam, { tone: "faint" }) }) +
    `<g transform="${front}">${Ln(frameGroove, { tone: "lo" })}${Ln(flatRect(DOOR_COLS[0]! - 4.6, DOOR_ROWS[0]! - 4.6, DOOR_COLS[3]! + DOOR_W + 4.6, DOOR_ROWS[1]! + DOOR_H + 4.6, 3), { tone: "faint" })}</g>` +
    Ln(sideVents, { tone: "faint" });
  put("vault.body", [BODY.x + BODY.w / 2, BODY.y + BODY.d / 2, (PLINTH_TOP + BODY_TOP) / 2], svg, [slabShape("vault.body", BODY, PLINTH_TOP, BODY_TOP - PLINTH_TOP, 6)]);
}

/** A keyhole in face coordinates (x, −z): a round bore over a tapered slot. */
function keyholeAt(cx: number, cz: number) {
  const r = 1.1;
  const c: Flat = [cx, -(cz + 0.7)];
  const half = 0.36;
  const join = Math.asin(half / r);
  const pts: Flat[] = [];
  for (let i = 0; i <= 20; i++) {
    const t = Math.PI / 2 - join - (i / 20) * (Math.PI * 2 - 2 * join);
    pts.push([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]);
  }
  pts.push([cx - 0.62, -(cz - 2.3)], [cx + 0.62, -(cz - 2.3)]);
  return k.pathOf(pts, true);
}

/* Eight safe-deposit doors, each on two hinge barrels, with a keyhole and a pull. */
DOOR_ROWS.forEach((z0, row) => {
  DOOR_COLS.forEach((x0, col) => {
    const name = `vault.door-${row}-${col}`;
    const plan: Plan = { x: x0, y: FRONT, w: DOOR_W, d: DOOR_T, r: 0.3 };
    const face = planeFront(FRONT + DOOR_T);
    const cx = x0 + DOOR_W / 2;
    const cz = z0 + DOOR_H / 2 + 2;
    const keyhole = keyholeAt(cx, cz);
    const pull: Plan = { x: cx - 4, y: FRONT + DOOR_T, w: 8, d: 1.3, r: 0.6 };
    const hinges = [z0 + 3, z0 + DOOR_H - 7].map((hz) => ({ x: x0 + 0.5, y: FRONT + 0.9, z: hz }));
    const svg =
      S(k.slabOf(plan, z0, DOOR_H, P, 2, 0.4), { tone: "mid" }) +
      `<g transform="${face}"><path class="vlt-hole" d="${keyhole}"/>${Ln(keyhole, { tone: "lo" })}${Ln(circlePath(cx, -(cz - 0.4), 2.6, 16), { tone: "faint" })}${Ln(flatRect(x0 + 2.2, z0 + 2.2, x0 + DOOR_W - 2.2, z0 + DOOR_H - 2.2, 1), { tone: "faint" })}</g>` +
      S(k.slabOf(pull, z0 + 5, 1.6, P, 2, 0.3), { tone: "mid" }) +
      hinges.map((h) => S(k.cylinder(h.x, h.y, 0.9, h.z, 4, P, 8), { tone: "mid" })).join("") +
      Dots(hinges.map((h) => at([h.x, h.y, h.z + 4])), 0.3, "lo");
    put(name, [cx, FRONT + DOOR_T / 2, z0 + DOOR_H / 2], svg, [
      slabShape(name, plan, z0, DOOR_H, 2),
      slabShape(`${name}.pull`, pull, z0 + 5, 1.6, 2, { owner: name }),
      ...hinges.map((h) => cylShape(`${name}.hinge`, h.x, h.y, 0.9, h.z, 4, { owner: name })),
    ]);
  });
});

/* The name plate, engraved with the vault's place: the drawing's one label. */
export const ENGRAVED = "__VLT_ENGRAVED__";
{
  const { x0, x1, z0, z1 } = NAME_PLATE;
  const plan: Plan = { x: x0, y: FRONT, w: x1 - x0, d: 0.8, r: 0.3 };
  const face = planeFront(FRONT + 0.8);
  const svg =
    S(k.slabOf(plan, z0, z1 - z0, P, 2, 0.3), { tone: "mid" }) +
    `<g transform="${face}">${Ln(flatRect(x0 + 1, z0 + 1, x1 - 1, z1 - 1, 0.6), { tone: "faint" })}<text class="iso-face-text vlt-engraved" data-tone="hi" x="${(x0 + x1) / 2}" y="${-(z0 + 2.15)}" font-size="3.3" text-anchor="middle">${ENGRAVED}</text></g>` +
    Dots([at([x0 + 1.9, FRONT + 0.8, (z0 + z1) / 2]), at([x1 - 1.9, FRONT + 0.8, (z0 + z1) / 2])], 0.38);
  put("vault.name", [(x0 + x1) / 2, FRONT + 0.4, (z0 + z1) / 2], svg, [slabShape("vault.name", plan, z0, z1 - z0, 2)]);
}

{
  const rivets = Array.from({ length: 9 }, (_, i) => at([CORNICE.x + 6 + i * ((CORNICE.w - 12) / 8), CORNICE.y + CORNICE.d, CORNICE_TOP - 2]));
  const svg = S(k.slabOf(CORNICE, BODY_TOP, CORNICE_TOP - BODY_TOP, P, 6, 0.8), { tone: "mid" }) + Dots(rivets, 0.38, "lo") + Ln(k.planOutline(k.insetPlan(CORNICE, 3.5), CORNICE_TOP, P, 6), { tone: "faint" });
  put("vault.cornice", [CORNICE.x + CORNICE.w / 2, CORNICE.y + CORNICE.d / 2, (BODY_TOP + CORNICE_TOP) / 2], svg, [slabShape("vault.cornice", CORNICE, BODY_TOP, CORNICE_TOP - BODY_TOP, 6)]);
}

/* ------------------------------------------------------------- key panel */

{
  const z0 = PANEL_Z[0];
  const h = PANEL_Z[1] - PANEL_Z[0];
  const face = PANEL.x + PANEL.w;
  const screws: Point3[] = [
    [face, PANEL.y + 2.4, z0 + 2.4],
    [face, PANEL.y + PANEL.d - 2.4, z0 + 2.4],
    [face, PANEL.y + 2.4, z0 + h - 2.4],
    [face, PANEL.y + PANEL.d - 2.4, z0 + h - 2.4],
  ];
  const roleDots = KEY_Y.map((y, i) => `<g class="vlt-dots" data-role-dots="${i}">${Dots(Array.from({ length: i + 1 }, (_, j) => at([face, y + (j - i / 2) * 1.6, KEY_Z + 8.6])), 0.42, "hi")}</g>`).join("");
  const svg =
    S(k.slabOf(PANEL, z0, h, P, 3, 0.4), { tone: "mid" }) +
    `<g transform="${planeSide(face)}">${Ln(flatRect(-(PANEL.y + PANEL.d) + 1.4, z0 + 1.4, -PANEL.y - 1.4, z0 + h - 1.4, 0.8), { tone: "faint" })}</g>` +
    Dots(screws.map(at), 0.42) +
    roleDots;
  put("keys.panel", [PANEL.x + PANEL.w / 2, PANEL.y + PANEL.d / 2, (PANEL_Z[0] + PANEL_Z[1]) / 2], svg, [slabShape("keys.panel", PANEL, z0, h, 3)]);
}

/** Bow outlines of the three keys, in the key plane: u out of the lock along +x, v across. */
function bowShape(role: number) {
  const shank: Flat[] = [[0, -1.1], [3.8, -1.1], [3.8, 1.1], [0, 1.1]];
  let head: Flat[];
  if (role === 0) head = Array.from({ length: 28 }, (_, i) => [8.1 + 4.3 * Math.cos((i / 28) * Math.PI * 2), 4.3 * Math.sin((i / 28) * Math.PI * 2)] as Flat);
  else if (role === 1) head = k.roundedPlan({ x: 3.6, y: -4.1, w: 8.6, d: 8.2, r: 1.6 }, 4) as Flat[];
  else head = Array.from({ length: 6 }, (_, i) => [8.1 + 4.6 * Math.cos((i / 6) * Math.PI * 2 + Math.PI / 6), 4.6 * Math.sin((i / 6) * Math.PI * 2 + Math.PI / 6)] as Flat);
  const hole = circlePath(9.6, 0, 1.25, 16);
  const path = k.pathOf(shank, true) + k.pathOf(head, true);
  return { path, hole, hull: G.hullOf([...shank, ...head].map(([u, v]) => [u, v, 0])).map(([u, v]: number[]) => [u, v] as Flat) };
}

export const KEY_LAYERS = [-KEY_T / 2, -KEY_T / 6, KEY_T / 6, KEY_T / 2];
const KEY_FACE = PANEL.x + PANEL.w + PLUG[1];

KEY_Y.forEach((y, i) => {
  const lockF: Frame = { o: [PANEL.x + PANEL.w, y, KEY_Z], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] };
  const bezel = S(G.disc(BEZEL[0], BEZEL[1], BEZEL_R, lockF, P, { bevel: 0.3, steps: 20 }), { tone: "mid" });
  const ring = Ln(G.circleOf(lockF, BEZEL[1], BEZEL_R - 1, P, 24), { tone: "faint" });
  const ticks = [0, 90].map((deg) => {
    const a = (deg * Math.PI) / 180;
    const dir: Point3 = [0, Math.sin(a), Math.cos(a)];
    const p = (r: number) => at([lockF.o[0] + BEZEL[1], y + dir[1] * r, KEY_Z + dir[2] * r]);
    return k.pathOf([p(BEZEL_R - 1), p(BEZEL_R - 0.25)]);
  });
  const plug = S(G.disc(PLUG[0], PLUG[1], PLUG_R, lockF, P, { steps: 16 }), { tone: "mid" }) + Ln(G.circleOf(lockF, PLUG[1], PLUG_R - 0.7, P, 18), { tone: "faint" });
  put(`keys.lock-${i}`, [lockF.o[0] + 1, y, KEY_Z], bezel + ring + Ln(ticks[0]!, { tone: "hi" }) + Ln(ticks[1]!, { tone: "lo" }) + plug, [
    discShape(`keys.lock-${i}`, lockF, BEZEL[0], BEZEL[1], BEZEL_R),
    discShape(`keys.plug-${i}`, lockF, PLUG[0], PLUG[1], PLUG_R, { owner: `keys.lock-${i}` }),
  ]);

  items.push(bowItem(i, 0));
});

/**
 * Key `i`'s bow turned `deg` about the lock axis (x): its stacked layers in
 * that pose and its true shape there. The page draws it at 0° and the live
 * controller writes the same matrices; the verification build records the
 * turned poses too, so the painter's order holds while a key turns.
 */
export function bowItem(i: number, deg: number): Item {
  const y = KEY_Y[i]!;
  const bow = bowShape(i);
  const layers = KEY_LAYERS.map((w, layer) => {
    const front = layer === KEY_LAYERS.length - 1;
    const back = layer === 0;
    const fill = front ? `class="vlt-face iso-shade" data-shade="${FRONT_TONE}"` : `class="iso-shade" data-shade="${Math.max(0, FRONT_TONE - 1)}"`;
    const stroke = front ? `<path class="iso-line vlt-bow-edge" data-tone="hi" d="${bow.path}"/><path class="vlt-hole" d="${bow.hole}"/><path class="iso-line" data-tone="lo" d="${bow.hole}"/>` : back ? `<path class="iso-line" data-tone="lo" d="${bow.path}"/>` : "";
    return `<g data-layer="${w}" transform="${keyMatrix(i, deg, w)}"><path ${fill} d="${bow.path}" fill-rule="nonzero"/>${stroke}</g>`;
  });
  const a = (deg * Math.PI) / 180;
  const keyF: Frame = { o: [KEY_FACE, y, KEY_Z], a: [0, Math.cos(a), -Math.sin(a)], u: [1, 0, 0], v: [0, Math.sin(a), Math.cos(a)] };
  return make(`keys.bow-${i}`, [KEY_FACE + 6, y, KEY_Z], `<g class="vlt-bow" data-part="bow" data-key="${i}">${layers.join("")}</g>`, [
    prismShape(`keys.bow-${i}`, keyF, bow.hull, -KEY_T / 2, KEY_T / 2, { owner: `keys.lock-${i}` }),
  ]);
}

/** The plane matrix of key `i` turned by `deg`, offset `w` along its visible normal. */
export function keyMatrix(i: number, deg: number, w: number) {
  const a = (deg * Math.PI) / 180;
  const d: Flat = [Math.sin(a) * EY[0] + Math.cos(a) * EZ[0], Math.sin(a) * EY[1] + Math.cos(a) * EZ[1]];
  const n: Point3 = [0, Math.cos(a), -Math.sin(a)];
  const sign = dot3(n, V) >= 0 ? 1 : -1;
  const o = at([KEY_FACE, KEY_Y[i]! + sign * w * n[1], KEY_Z + sign * w * n[2]]);
  return `matrix(${r1(EX[0])} ${r1(EX[1])} ${r1(d[0])} ${r1(d[1])} ${r1(o[0])} ${r1(o[1])})`;
}

/* --------------------------------------------------------------- printer */

{
  const bolts = k.corners(PBASE, 2.5);
  const svg =
    S(k.slabOf(PBASE, CORNICE_TOP, PBASE_TOP - CORNICE_TOP, P, 4, 0.4), { tone: "lo" }) +
    bolts.map(([x, y]) => S(k.cylinder(x, y, 1.2, PBASE_TOP, 0.9, P, 6), { tone: "mid", crease: "none" })).join("") +
    Dots(bolts.map(([x, y]) => at([x, y, PBASE_TOP + 0.9])), 0.3, "lo");
  put("printer.base", [PBASE.x + PBASE.w / 2, PBASE.y + PBASE.d / 2, CORNICE_TOP + 1], svg, [
    slabShape("printer.base", PBASE, CORNICE_TOP, PBASE_TOP - CORNICE_TOP, 4),
    ...bolts.map(([x, y]) => cylShape("printer.bolt", x, y, 1.2, PBASE_TOP, 0.9, { owner: "printer.base" })),
  ]);
}

{
  const lid = k.insetPlan(HOUSING, 3);
  const screws = k.corners(HOUSING, 4.2);
  const sideSlots = Array.from({ length: 6 }, (_, i) => {
    const y = HOUSING.y + 9 + i * 3;
    return k.pathOf(k.roundedPlan({ x: y - 0.6, y: PBASE_TOP + 9, w: 1.2, d: 14, r: 0.6 }, 4).map(([u, z]) => at([P_SIDE, u, z])), true);
  }).join("");
  const seam = k.sideSeam(HOUSING, PBASE_TOP + 4, P, 6);
  const svg =
    S(k.slabOf(HOUSING, PBASE_TOP, HOUSING_TOP - PBASE_TOP, P, 6, 1), { tone: "mid", inner: Ln(seam, { tone: "faint" }) }) +
    Ln(k.planOutline(lid, HOUSING_TOP, P, 6), { tone: "faint" }) +
    Ln(screws.map(([x, y]) => k.ring(x, y, 1.5, HOUSING_TOP, P, 14)).join(""), { tone: "faint" }) +
    Dots(screws.map(([x, y]) => at([x, y, HOUSING_TOP])), 0.42) +
    `<path class="vlt-hole" d="${k.planOutline(SLOT, HOUSING_TOP, P, 4)}"/>` +
    Ln(k.planOutline(SLOT, HOUSING_TOP, P, 4), { tone: "lo" }) +
    Ln(sideSlots, { tone: "faint" });
  put("printer.housing", [HOUSING.x + HOUSING.w / 2, HOUSING.y + HOUSING.d / 2, (PBASE_TOP + HOUSING_TOP) / 2], svg, [slabShape("printer.housing", HOUSING, PBASE_TOP, HOUSING_TOP - PBASE_TOP, 6)]);
}

/* A rating plate on the printer's side: three printed rules and two rivets. */
{
  const y0 = 4;
  const y1 = 19;
  const z0 = PBASE_TOP + 10;
  const z1 = PBASE_TOP + 19;
  const plan: Plan = { x: P_SIDE, y: y0, w: 0.6, d: y1 - y0, r: 0.3 };
  const face = planeSide(P_SIDE + 0.6);
  const rules = [0, 1, 2].map((i) => `M${r1(-y1 + 3)} ${r1(-(z1 - 3 - i * 2))}H${r1(-y1 + 3 + [9, 6, 8][i]!)}`).join("");
  const svg =
    S(k.slabOf(plan, z0, z1 - z0, P, 2, 0.2), { tone: "lo" }) +
    `<g transform="${face}">${Ln(flatRect(-y1 + 0.9, z0 + 0.9, -y0 - 0.9, z1 - 0.9, 0.4), { tone: "faint" })}${Ln(rules, { tone: "lo", free: true })}</g>` +
    Dots([at([P_SIDE + 0.6, y1 - 1.6, z0 + 1.6]), at([P_SIDE + 0.6, y0 + 1.6, z0 + 1.6])], 0.32);
  put("printer.plate", [P_SIDE + 0.3, (y0 + y1) / 2, (z0 + z1) / 2], svg, [slabShape("printer.plate", plan, z0, z1 - z0, 2)]);
}

/** A rounded opening in the face y, its walls shaded by facing, with `back` drawn on the back plane and `inside` in front of it. */
function recess(y: number, back: string, inside: string) {
  const { x0, x1, z0, z1, r, depth } = WINDOW;
  const ring = k.roundedPlan({ x: x0, y: z0, w: x1 - x0, d: z1 - z0, r }, 6);
  const cx = (x0 + x1) / 2;
  const cz = (z0 + z1) / 2;
  const { sinA } = k.cameraOf(P);
  const tops: string[] = [];
  const sides: string[][] = [[], [], [], []];
  ring.forEach(([ax, az], index) => {
    const [bx, bz] = ring[(index + 1) % ring.length]!;
    const length = Math.hypot(bx - ax, bz - az) || 1;
    let nx = (bz - az) / length;
    let nz = -(bx - ax) / length;
    if (nx * (cx - (ax + bx) / 2) + nz * (cz - (az + bz) / 2) < 0) [nx, nz] = [-nx, -nz];
    if (nx <= 0 && nz <= 0) return;
    const quad = k.pathOf([at([ax, y, az]), at([bx, y, bz]), at([bx, y - depth, bz]), at([ax, y - depth, az])], true);
    if (nz >= nx) tops.push(quad);
    else sides[Math.min(3, Math.max(0, Math.floor(((nx * -sinA + 1) / 2) * 4)))]!.push(quad);
  });
  const shape = flatRect(x0, z0, x1, z1, r);
  return [
    `<clipPath id="vlt-window"><path transform="${planeFront(y)}" d="${shape}"/></clipPath>`,
    `<g clip-path="url(#vlt-window)">`,
    `<path class="iso-top" d="${tops.join("")}"/>`,
    ...sides.map((d, shade) => (d.length ? `<path class="iso-shade" data-shade="${shade}" d="${d.join("")}"/>` : "")),
    `<g transform="${planeFront(y - depth)}"><path class="vlt-well" d="${shape}"/>${back}<path class="iso-line" data-tone="faint" d="${shape}"/></g>`,
    inside,
    `</g>`,
    `<g transform="${planeFront(y)}"><path class="iso-line" data-tone="lo" d="${shape}"/></g>`,
  ].join("");
}

/** The tape's printed lines in the window plane: x along the tape, v = −z. */
export function lineOf(role: number, z: number, grow = 1) {
  const words = ROLES[role]!.words;
  let x = TAPE_X[0] + 3;
  const end = TAPE_X[0] + 3 + (words.reduce((a, b) => a + b + 2, 0) - 2) * grow;
  const out: string[] = [];
  for (const w of words) {
    const to = Math.min(x + w, end);
    if (to - x > 0.05) out.push(`M${r1(x)} ${r1(-z)}H${r1(to)}`);
    x += w + 2;
    if (x >= end) break;
  }
  return out.join("");
}

/** Lines on the tape at rest: the newest, FIRST_LINE, has been fed one pitch past the print row. */
export function tapeAt(count: number, fed: number, roleOf: (line: number) => number) {
  const older: string[] = [];
  let newest = "";
  for (let line = count; line > count - 8; line--) {
    const z = PRINT_Z + (count + 1 - line) * PITCH - PITCH + fed;
    if (z > WINDOW.z1 + 2) break;
    if (line === count) newest = lineOf(roleOf(line), z);
    else older.push(lineOf(roleOf(line), z));
  }
  return { older: older.join(""), newest };
}

export const restRole = (line: number) => ((line % 3) + 3) % 3;

{
  const tape = tapeAt(FIRST_LINE, PITCH, restRole);
  const strip = flatRect(TAPE_X[0], WINDOW.z0 - 6, TAPE_X[1], WINDOW.z1 + 6, 0);
  const back =
    `<path class="vlt-paper" d="${strip}"/><path class="iso-line" data-tone="lo" d="${strip}"/>` +
    `<g data-part="tape"><path class="iso-line vlt-lines" data-tone="mid" data-free="" data-part="older" d="${tape.older}"/><path class="iso-line vlt-newest" data-tone="lit" data-free="" data-part="newest" d="${tape.newest}"/></g>`;
  const rodF = XF(TAPE_Y + 1.4, HEAD_Z);
  const rod = S(G.disc(WINDOW.x0 - 1, WINDOW.x1 + 1, 0.7, rodF, P), { tone: "mid", crease: "none" });
  const headPlan: Plan = { x: TAPE_X[0] - 1, y: TAPE_Y + 0.3, w: 5, d: 2.6, r: 0.6 };
  const head =
    S(k.slabOf(headPlan, HEAD_Z - 2.2, 4.6, P, 3, 0.3), { tone: "hi" }) +
    Dots([at([headPlan.x + 2.5, headPlan.y + headPlan.d, HEAD_Z + 0.8])], 0.4, "hi");
  const sheen = [
    [WINDOW.x0 + 8, WINDOW.x0 + 15, WINDOW.x0 + 3, WINDOW.x0 - 4],
    [WINDOW.x0 + 17, WINDOW.x0 + 19.5, WINDOW.x0 + 14.5, WINDOW.x0 + 12],
  ]
    .map(([a, b, c, d]) => k.pathOf([[a!, -WINDOW.z1 - 1], [b!, -WINDOW.z1 - 1], [c!, -WINDOW.z0 + 1], [d!, -WINDOW.z0 + 1]], true))
    .join("");
  const inside = rod + `<g data-part="head">${head}</g>` + `<g transform="${planeFront(P_FRONT)}"><path class="vlt-glass" d="${sheen}"/></g>`;
  const svg = recess(P_FRONT, back, inside);
  put("printer.window", [(WINDOW.x0 + WINDOW.x1) / 2, P_FRONT, (WINDOW.z0 + WINDOW.z1) / 2], svg, [
    { kind: "box", min: [WINDOW.x0, P_FRONT, WINDOW.z0], max: [WINDOW.x1, P_FRONT + 0.4, WINDOW.z1], meta: { name: "printer.glass", owner: "printer.housing" } },
  ], 0.5);
}

/* A bezel of four bars round the window, proud of the face. */
{
  const { x0, x1, z0, z1 } = WINDOW;
  const y = P_FRONT;
  const bars: [string, Plan, number, number][] = [
    ["left", { x: x0 - BEZEL_W, y, w: BEZEL_W, d: BEZEL_T, r: 0.2 }, z0, z1 - z0],
    ["top", { x: x0 - BEZEL_W, y, w: x1 - x0 + BEZEL_W * 2, d: BEZEL_T, r: 0.2 }, z1, BEZEL_W],
    ["bottom", { x: x0 - BEZEL_W, y, w: x1 - x0 + BEZEL_W * 2, d: BEZEL_T, r: 0.2 }, z0 - BEZEL_W, BEZEL_W],
    ["right", { x: x1, y, w: BEZEL_W, d: BEZEL_T, r: 0.2 }, z0, z1 - z0],
  ];
  const svg = bars.map(([, plan, z, h]) => S(k.slabOf(plan, z, h, P, 2, 0.2), { tone: "mid" })).join("") + Dots([at([x0 - 1, y + BEZEL_T, z0 - 1]), at([x1 + 1, y + BEZEL_T, z0 - 1]), at([x0 - 1, y + BEZEL_T, z1 + 1]), at([x1 + 1, y + BEZEL_T, z1 + 1])], 0.35);
  put("printer.bezel", [(x0 + x1) / 2, y + BEZEL_T / 2, (z0 + z1) / 2], svg, bars.map(([side, plan, z, h]) => slabShape(`printer.bezel-${side}`, plan, z, h, 2, { owner: "printer.bezel" })), 0.6);
}

/* ------------------------------------------------------------ take-up spool */

const cheekPoly: Flat[] = (() => {
  const [y0, y1] = CHEEK_Y;
  const pts: Flat[] = [[y0, HOUSING_TOP], [y1, HOUSING_TOP]];
  const arc = (cy: number, cz: number, from: number, to: number) => {
    for (let i = 0; i <= 8; i++) {
      const a = ((from + ((to - from) * i) / 8) * Math.PI) / 180;
      pts.push([cy + CHEEK_R * Math.cos(a), cz + CHEEK_R * Math.sin(a)]);
    }
  };
  arc(y1 - CHEEK_R, CHEEK_TOP - CHEEK_R, 0, 90);
  arc(y0 + CHEEK_R, CHEEK_TOP - CHEEK_R, 90, 180);
  return pts;
})();
const YZ: Frame = { o: [0, 0, 0], a: [1, 0, 0], u: [0, 1, 0], v: [0, 0, 1] };

function cheek(name: string, [x0, x1]: [number, number]) {
  const paths = G.prismOf(YZ, cheekPoly, x0, x1, P);
  const outer = G.circleOf(XF(SPOOL_Y, SPOOL_Z), x1, 3.6, P, 32);
  const screws = [CHEEK_Y[0] + 3, CHEEK_Y[1] - 3].map((y) => at([x1, y, HOUSING_TOP + 3]));
  put(name, [(x0 + x1) / 2, (CHEEK_Y[0] + CHEEK_Y[1]) / 2, (HOUSING_TOP + CHEEK_TOP) / 2], S(paths, { tone: "mid" }) + Ln(outer, { tone: "faint" }) + Dots(screws, 0.4), [
    prismShape(name, YZ, cheekPoly, x0, x1),
  ]);
}
cheek("spool.cheek-left", CHEEK_L);

{
  const F = XF(SPOOL_Y, SPOOL_Z);
  const flange = (name: string, s0: number) => {
    const paths = G.disc(s0, s0 + FLANGE_T, FLANGE_R, F, P, { bevel: 0.3, steps: 40 });
    const holes = G.dotsOf(F, s0 + FLANGE_T, FLANGE_R - 3.2, 6, P, { all: true });
    put(name, [s0, SPOOL_Y, SPOOL_Z], S(paths, { tone: "mid" }) + Ln(G.circleOf(F, s0 + FLANGE_T, FLANGE_R - 1.2, P, 36), { tone: "faint" }) + Dots(holes as Flat[], 0.5, "lo"), [
      discShape(name, F, s0, s0 + FLANGE_T, FLANGE_R, { owner: "spool" }),
    ]);
  };
  put("spool.shaft-left", [CHEEK_L[1] + 0.5, SPOOL_Y, SPOOL_Z], S(G.disc(CHEEK_L[1], ROLL_X[0] - FLANGE_T, SHAFT_R, F, P), { tone: "mid" }), [
    discShape("spool.shaft-left", F, CHEEK_L[1], ROLL_X[0] - FLANGE_T, SHAFT_R, { owner: "spool" }),
  ]);
  flange("spool.flange-left", ROLL_X[0] - FLANGE_T);
  const rollF = F;
  const roll = G.disc(ROLL_X[0], ROLL_X[1], ROLL_R, rollF, P);
  put("spool.roll", [(ROLL_X[0] + ROLL_X[1]) / 2, SPOOL_Y, SPOOL_Z], S(roll, { tone: "hi" }), [discShape("spool.roll", rollF, ROLL_X[0], ROLL_X[1], ROLL_R, { owner: "spool" })]);
  flange("spool.flange-right", ROLL_X[1]);
  put("spool.shaft-right", [ROLL_X[1] + FLANGE_T + 0.5, SPOOL_Y, SPOOL_Z], S(G.disc(ROLL_X[1] + FLANGE_T, CHEEK_R_X[0], SHAFT_R, F, P), { tone: "mid" }), [
    discShape("spool.shaft-right", F, ROLL_X[1] + FLANGE_T, CHEEK_R_X[0], SHAFT_R, { owner: "spool" }),
  ]);
}
cheek("spool.cheek-right", CHEEK_R_X);

/* The tape rises straight out of the housing slot and winds onto the front of the roll. */
export const STRIP_TOP = SPOOL_Z;
/**
 * One path slot for every printed line the strip can show at once: lines sit
 * a PITCH apart on the (STRIP_TOP − HOUSING_TOP + 1)-tall run the controller
 * draws, plus one spare. That is 9 here, so a line only ever leaves through
 * the fade at the top of the strip, never while it is still visible (it was
 * 6, and the top line blinked out mid-strip).
 */
export const STRIP_LINES = Math.floor((STRIP_TOP - HOUSING_TOP + 1) / PITCH) + 2;
/** How many lines the tape holds from the print row to the top of the strip: the rest pose seeds this many. */
export const TAPE_LINES = Math.ceil((STRIP_TOP - PRINT_Z) / PITCH) + 1;

/** The strip's lines in the rest pose, exactly as the controller draws them (controller.ts drawTape at rest). */
function stripRest() {
  const out: { d: string; opacity: number }[] = [];
  for (let line = FIRST_LINE; line > FIRST_LINE - TAPE_LINES; line--) {
    const z = PRINT_Z + (FIRST_LINE + 1 - line) * PITCH;
    if (z <= WINDOW.z1 + 2 || z <= HOUSING_TOP - 1 || z >= STRIP_TOP) continue;
    const fade = Math.min(1, Math.max(0, (STRIP_TOP - z) / 3.5));
    out.push({ d: lineOf(restRole(line), z), opacity: Math.round(fade * fade * (3 - 2 * fade) * 100) / 100 });
  }
  return out;
}
{
  const poly: Flat[] = [
    [STRIP_Y, HOUSING_TOP],
    [STRIP_Y + 0.4, HOUSING_TOP],
    [STRIP_Y + 0.4, STRIP_TOP],
    [STRIP_Y, STRIP_TOP],
  ];
  const paths = G.prismOf(YZ, poly, TAPE_X[0], TAPE_X[1], P);
  const face = planeFront(STRIP_Y + 0.4);
  const rect = flatRect(TAPE_X[0], HOUSING_TOP, TAPE_X[1], STRIP_TOP, 0);
  const rest = stripRest();
  const slots = Array.from({ length: STRIP_LINES }, (_, slot) => {
    const line = rest[slot];
    return `<path class="iso-line vlt-lines" data-tone="mid" data-free="" data-part="strip-line" d="${line?.d ?? ""}"${line ? ` opacity="${line.opacity}"` : ""}/>`;
  }).join("");
  const lines = `<clipPath id="vlt-strip"><path transform="${face}" d="${rect}"/></clipPath><g clip-path="url(#vlt-strip)"><g transform="${face}">${slots}</g></g>`;
  put("spool.strip", [(TAPE_X[0] + TAPE_X[1]) / 2, STRIP_Y + 0.2, (HOUSING_TOP + STRIP_TOP) / 2], S(paths, { tone: "hi", crease: "lo" }) + lines, [prismShape("spool.strip", YZ, poly, TAPE_X[0], TAPE_X[1], { owner: "spool" })]);
}

/* ------------------------------------------------------------- the ratchet */

/** Radius of the tooth profile at wheel angle `phi` (degrees, wheel coordinates). */
export function profileAt(phi: number) {
  const t = (((phi % TOOTH) + TOOTH) % TOOTH) / TOOTH;
  const start = phi - t * TOOTH;
  const A = polar(WHEEL_TIP, start);
  const B = polar(WHEEL_ROOT, start + TOOTH);
  const d = polar(1, phi);
  const e: Flat = [B[0] - A[0], B[1] - A[1]];
  return (A[0] * e[1] - A[1] * e[0]) / (d[0] * e[1] - d[1] * e[0]);
}
function polar(r: number, deg: number): Flat {
  const a = (deg * Math.PI) / 180;
  return [r * Math.cos(a), r * Math.sin(a)];
}
/** Turn a side-plane point by `deg` about `centre`, as SVG rotate(deg cx cy) does. */
function turn([x, y]: Flat, deg: number, [cx, cy]: Flat = [0, 0]): Flat {
  const a = (deg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
}
const angleOf = ([x, y]: Flat) => (Math.atan2(y, x) * 180) / Math.PI;
const mod = (value: number, by: number) => ((value % by) + by) % by;
function densify(poly: Flat[], spacing: number): Flat[] {
  return poly.flatMap((p, i) => {
    const q = poly[(i + 1) % poly.length]!;
    const n = Math.max(1, Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / spacing));
    return Array.from({ length: n }, (_, j) => [p[0] + ((q[0] - p[0]) * j) / n, p[1] + ((q[1] - p[1]) * j) / n] as Flat);
  });
}
/** How far `p` lies inside `poly` (distance to its outline), or 0 when it is outside or on it. */
function depthIn(poly: Flat[], [x, y]: Flat) {
  let inside = false;
  let best = Infinity;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x0, y0] = poly[j]!;
    const [x1, y1] = poly[i]!;
    if (y0 > y !== y1 > y && x < x0 + ((y - y0) * (x1 - x0)) / (y1 - y0 || 1e-12)) inside = !inside;
    const dx = x1 - x0;
    const dy = y1 - y0;
    const t = Math.max(0, Math.min(1, ((x - x0) * dx + (y - y0) * dy) / (dx * dx + dy * dy || 1e-12)));
    best = Math.min(best, Math.hypot(x - x0 - dx * t, y - y0 - dy * t));
  }
  return inside ? best : 0;
}

/** The wheel in its own coordinates: per tooth a steep radial face (root to tip), then a straight slope down to the next root. */
const WHEEL_POLY: Flat[] = Array.from({ length: TEETH }, (_, i) => [polar(WHEEL_ROOT, i * TOOTH), polar(WHEEL_TIP, i * TOOTH)]).flat();
const wheelPath = k.pathOf(WHEEL_POLY, true);
const wheelHoles = Array.from({ length: 4 }, (_, i) => circlePath(...polar(4.3, i * 90 + 45), 1.15, 14)).join("");

/**
 * The pawl: a curved arm round the wheel, hung on its pin, with a hooked nose.
 * The nose's face toward the next tooth is radial, so a steep face meets it
 * flush and pushes it deeper (the pin sits where that push turns the pawl
 * in); its other side climbs steeper than a tooth's slope, so a turning
 * wheel lifts it. The arm runs between radii 11 and 12.9, clear of the tips.
 */
export const PAWL_TIP: Flat = polar(WHEEL_ROOT + 0.06, PAWL_TIP_AT);
const PAWL_POLY: Flat[] = (() => {
  const a = PAWL_TIP_AT;
  const meet = (r: number) => (Math.acos((r * r + PAWL_PIVOT_R * PAWL_PIVOT_R - PAWL_HUB * PAWL_HUB) / (2 * r * PAWL_PIVOT_R)) * 180) / Math.PI;
  const outerEnd = PAWL_PIVOT_AT + meet(PAWL_OUT);
  const innerEnd = PAWL_PIVOT_AT + meet(PAWL_IN);
  const pts: Flat[] = [PAWL_TIP, polar(PAWL_NOSE, a), polar(PAWL_OUT - 0.6, a - 1)];
  for (let phi = a - 2.5; phi > outerEnd + 0.5; phi -= 2.5) pts.push(polar(PAWL_OUT, phi));
  const hubAt = (deg: number): Flat => [PAWL_PIVOT[0] + PAWL_HUB * Math.cos((deg * Math.PI) / 180), PAWL_PIVOT[1] + PAWL_HUB * Math.sin((deg * Math.PI) / 180)];
  const psi = (p: Flat) => angleOf([p[0] - PAWL_PIVOT[0], p[1] - PAWL_PIVOT[1]]);
  const from = psi(polar(PAWL_OUT, outerEnd));
  const to = psi(polar(PAWL_IN, innerEnd));
  /* Round the far side of the hub, away from the arm. */
  const down = to < from ? to : to - 360;
  const up = to > from ? to : to + 360;
  const reach = (end: number) => {
    const m = hubAt((from + end) / 2);
    return Math.hypot(m[0] - PAWL_TIP[0], m[1] - PAWL_TIP[1]);
  };
  const end = reach(down) > reach(up) ? down : up;
  const n = Math.ceil(Math.abs(end - from) / 8);
  for (let j = 0; j <= n; j++) pts.push(hubAt(from + ((end - from) * j) / n));
  for (let phi = innerEnd + 2.5; phi < a - 5; phi += 2.5) pts.push(polar(PAWL_IN, phi));
  pts.push(polar(PAWL_IN, a - 4.5));
  return pts;
})();
const pawlPath = k.pathOf(PAWL_POLY, true);
const PAWL_EDGE = densify(PAWL_POLY, 0.08);
/** Only the nose region can reach the teeth: the arm and hub stay outside radius 10.7 in every lift. */
const PAWL_NEAR = PAWL_EDGE.filter(([x, y]) => Math.hypot(x, y) < WHEEL_TIP + 1.5);
const WHEEL_EDGE = densify(WHEEL_POLY, 0.08);
/** The sense of rotation that lifts the nose off the wheel. */
const LIFT_OUT = Math.hypot(...turn(PAWL_TIP, 1, PAWL_PIVOT)) > Math.hypot(...PAWL_TIP) ? 1 : -1;

/** True when the pawl, turned `lift` about its pin, nowhere enters the wheel turned `theta` (contact allowed). */
function clearOf(theta: number, lift: number, points = PAWL_NEAR) {
  for (const p of points) {
    const q = turn(p, lift, PAWL_PIVOT);
    const r = Math.hypot(q[0], q[1]);
    if (r < WHEEL_TIP && r < profileAt(angleOf(q) - theta) - 0.004) return false;
  }
  for (const c of WHEEL_POLY) if (depthIn(PAWL_POLY, turn(turn(c, theta), -lift, PAWL_PIVOT)) > 0.004) return false;
  return true;
}

/** Where the pawl rests on a wheel at `theta`: the least lift that keeps it out of the teeth. */
function liftAt(theta: number) {
  if (clearOf(theta, 0)) return 0;
  for (let d = 0.5; d <= 40; d += 0.5) {
    if (!clearOf(theta, LIFT_OUT * d)) continue;
    let lo = d - 0.5;
    let hi = d;
    for (let i = 0; i < 16; i++) {
      const mid = (lo + hi) / 2;
      if (clearOf(theta, LIFT_OUT * mid)) hi = mid;
      else lo = mid;
    }
    return LIFT_OUT * hi;
  }
  throw new Error(`vault: the pawl jams at wheel angle ${theta}`);
}

/**
 * The click: the wheel angle (mod one tooth) where a tooth's tip passes the
 * nose and the pawl drops into the next gap. Turning back, that same angle is
 * where the steep face meets the nose: nothing can pass it.
 */
const CLICK = (() => {
  const n = 144;
  const lifts = Array.from({ length: n + 1 }, (_, i) => Math.abs(liftAt((i * TOOTH) / n)));
  let drop = 1;
  for (let i = 1; i <= n; i++) if (lifts[i - 1]! - lifts[i]! > lifts[drop - 1]! - lifts[drop]!) drop = i;
  let lo = ((drop - 1) * TOOTH) / n;
  let hi = (drop * TOOTH) / n;
  const split = (lifts[drop - 1]! + lifts[drop]!) / 2;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    if (Math.abs(liftAt(mid)) > split) lo = mid;
    else hi = mid;
  }
  return hi;
})();

/** The wheel angle at rest: each feed stops PLAY degrees past the click. */
export const WHEEL_REST = mod(CLICK + PLAY, TOOTH);
/** How far the wheel can turn back from rest before a steep face meets the nose (kept 0.15° short of contact). */
export const HOLD = PLAY - 0.15;
/** The pawl's lift over one tooth from rest, sampled every TOOTH/160 degrees: the page and the audit read the same table. */
export const LIFT_STEP = TOOTH / 160;
export const LIFT_CLICK = mod(CLICK - WHEEL_REST, TOOTH);
export const LIFT: number[] = Array.from({ length: 161 }, (_, j) => {
  const u = j * LIFT_STEP;
  return r1(liftAt(WHEEL_REST + (Math.abs(u - LIFT_CLICK) < 1e-6 ? u + 1e-4 : u)));
});
/** The pawl's lift at wheel angle `theta`, from the table, never blended across the click (the controller does the same). */
export function liftOf(theta: number) {
  const u = mod(theta - WHEEL_REST, TOOTH);
  const f = u / LIFT_STEP;
  const i = Math.min(LIFT.length - 2, Math.floor(f));
  const a = LIFT[i]!;
  const b = LIFT[i + 1]!;
  if (i * LIFT_STEP < LIFT_CLICK && LIFT_CLICK <= (i + 1) * LIFT_STEP) return u < LIFT_CLICK ? a : b;
  return a + (b - a) * (f - i);
}

/** Deepest overlap of the pawl and the wheel in one pose, checked over both outlines (0 when they only touch). */
export function meshOverlap(theta: number, lift: number) {
  let worst = 0;
  for (const p of PAWL_EDGE) {
    const q = turn(p, lift, PAWL_PIVOT);
    const r = Math.hypot(q[0], q[1]);
    if (r < WHEEL_TIP) worst = Math.max(worst, profileAt(angleOf(q) - theta) - r);
  }
  for (const c of WHEEL_EDGE) {
    const w = turn(turn(c, theta), -lift, PAWL_PIVOT);
    if (w[0] < PAWL_BOX[0] || w[0] > PAWL_BOX[2] || w[1] < PAWL_BOX[1] || w[1] > PAWL_BOX[3]) continue;
    worst = Math.max(worst, depthIn(PAWL_POLY, w));
  }
  return worst;
}
const PAWL_BOX = [Math.min(...PAWL_POLY.map((p) => p[0])), Math.min(...PAWL_POLY.map((p) => p[1])), Math.max(...PAWL_POLY.map((p) => p[0])), Math.max(...PAWL_POLY.map((p) => p[1]))];

/**
 * A flat part in the side plane (wheel, pawl, crank), drawn as stacked copies through its thickness:
 * its machined face takes the light top tone so it reads against the darker cheek behind it.
 */
function layers(x0: number, x1: number, d: string, extra: string, rot: number, pivot: Flat = [0, 0], bands = 4, edge: Tone = "mid", face = "iso-top", rim = 1) {
  const out: string[] = [];
  for (let i = 0; i < bands; i++) {
    const x = x0 + ((x1 - x0) * i) / (bands - 1);
    const front = i === bands - 1;
    const back = i === 0;
    const fill = front ? `class="${face}"` : back ? `class="iso-shade" data-shade="0"` : `class="iso-shade" data-shade="${rim}"`;
    const lines = front ? `<path class="iso-line" data-tone="${edge}" d="${d}"/>${extra}` : back ? `<path class="iso-line" data-tone="lo" d="${d}"/>` : "";
    out.push(`<g transform="${planeSide(x, SPOOL_Y, SPOOL_Z)}"><g data-rot="" transform="rotate(${r1(rot)} ${pivot[0]} ${pivot[1]})"><path ${fill} d="${d}"/>${lines}</g></g>`);
  }
  return out;
}
function layered(x0: number, x1: number, d: string, extra: string, part: string, rot: number, pivot: Flat = [0, 0], bands = 4, edge: Tone = "mid", face = "iso-top", rim = 1) {
  return `<g data-part="${part}">${layers(x0, x1, d, extra, rot, pivot, bands, edge, face, rim).join("")}</g>`;
}

const AXIS_F = XF(SPOOL_Y, SPOOL_Z);

/**
 * The wheel turned to `theta` and the pawl resting on it, as one item. They
 * lie in one slab (x 14.6–16.6) with the nose down between two teeth, so
 * each is in front of the other somewhere on screen and no painter's key can
 * order them as two items. Drawn as one, slice by slice through the slab
 * (wheel then pawl in each slice, back slice first), they occlude exactly.
 * Both true outlines are recorded.
 */
export function ratchetItem(theta: number): Item {
  const lift = liftOf(theta);
  const extra = `<path class="vlt-hole" d="${wheelHoles}"/><path class="iso-line" data-tone="lo" d="${wheelHoles}"/><path class="iso-line" data-tone="faint" d="${circlePath(0, 0, WHEEL_ROOT - 1.1, 40)}"/>`;
  const wheel = layers(WHEEL[0], WHEEL[1], wheelPath, extra, theta);
  const pawl = layers(WHEEL[0], WHEEL[1], pawlPath, "", lift, PAWL_PIVOT, 4, "hi");
  const svg = wheel.map((slice, i) => `<g data-part="wheel">${slice}</g><g data-part="pawl">${pawl[i]}</g>`).join("");
  return make("ratchet.wheel", [(WHEEL[0] + WHEEL[1]) / 2, SPOOL_Y, SPOOL_Z], svg, [
    prismShape("ratchet.wheel", SIDE_F(SPOOL_Y, SPOOL_Z), WHEEL_POLY.map((p) => turn(p, theta)), WHEEL[0], WHEEL[1], { owner: "ratchet" }),
    prismShape("ratchet.pawl", SIDE_F(SPOOL_Y, SPOOL_Z), PAWL_POLY.map((p) => turn(p, lift, PAWL_PIVOT)), WHEEL[0], WHEEL[1], { owner: "ratchet" }),
  ]);
}

put("ratchet.hub", [HUB[0] + 0.4, SPOOL_Y, SPOOL_Z], S(G.disc(HUB[0], HUB[1], 3, AXIS_F, P), { tone: "mid" }), [discShape("ratchet.hub", AXIS_F, HUB[0], HUB[1], 3, { owner: "ratchet" })]);
items.push(ratchetItem(WHEEL_REST));
{
  const pinF = XF(SPOOL_Y - PAWL_PIVOT[0], SPOOL_Z - PAWL_PIVOT[1]);
  const pinAt: Point3 = [0, SPOOL_Y - PAWL_PIVOT[0], SPOOL_Z - PAWL_PIVOT[1]];
  put("ratchet.pin", [(CHEEK_R_X[1] + WHEEL[0]) / 2, pinAt[1], pinAt[2]], S(G.disc(CHEEK_R_X[1], WHEEL[0], PIN_R, pinF, P), { tone: "mid" }), [
    discShape("ratchet.pin", pinF, CHEEK_R_X[1], WHEEL[0], PIN_R, { owner: "ratchet" }),
  ]);
  put("ratchet.pin-head", [WHEEL[1] + 0.2, pinAt[1], pinAt[2]], S(G.disc(WHEEL[1], WHEEL[1] + 0.4, PIN_HEAD_R, pinF, P, { bevel: 0.2 }), { tone: "mid" }) + Dots([at([WHEEL[1] + 0.4, pinAt[1], pinAt[2]])], 0.35, "lo"), [
    discShape("ratchet.pin-head", pinF, WHEEL[1], WHEEL[1] + 0.4, PIN_HEAD_R, { owner: "ratchet" }),
  ], 0.4);
}

/* The crank: an arm keyed to the wheel and a knob on a pin. */
const crankArm = (() => {
  const a = (CRANK_REST * Math.PI) / 180;
  const dir: Flat = [Math.cos(a), Math.sin(a)];
  const nrm: Flat = [-dir[1], dir[0]];
  const pts: Flat[] = [];
  for (let i = 0; i <= 10; i++) {
    const t = Math.PI / 2 + (i / 10) * Math.PI;
    pts.push([3 * Math.cos(t) * dir[0] + 3 * Math.sin(t) * nrm[0], 3 * Math.cos(t) * dir[1] + 3 * Math.sin(t) * nrm[1]]);
  }
  for (let i = 0; i <= 10; i++) {
    const t = -Math.PI / 2 + (i / 10) * Math.PI;
    pts.push([CRANK_R * dir[0] + 2.1 * (Math.cos(t) * dir[0] + Math.sin(t) * nrm[0]), CRANK_R * dir[1] + 2.1 * (Math.cos(t) * dir[1] + Math.sin(t) * nrm[1])]);
  }
  return { d: k.pathOf(pts, true), end: [CRANK_R * dir[0], CRANK_R * dir[1]] as Flat, hull: pts };
})();

/** The crank arm turned `spin` degrees with the wheel it is keyed to. */
export function crankItem(spin: number): Item {
  const extra = `<path class="iso-line" data-tone="lo" d="${circlePath(0, 0, 1.4, 16)}"/>`;
  return make("ratchet.crank", [(CRANK[0] + CRANK[1]) / 2, SPOOL_Y, SPOOL_Z], layered(CRANK[0], CRANK[1], crankArm.d, extra, "crank", spin, [0, 0], 3, "mid", "iso-shade vlt-arm"), [
    prismShape("ratchet.crank", SIDE_F(SPOOL_Y, SPOOL_Z), crankArm.hull.map((p) => turn(p, spin)), CRANK[0], CRANK[1], { owner: "ratchet" }),
  ], 0.5);
}

/** The knob on the crank's end, carried round `spin` degrees (the page translates the same drawing). */
export function knobItem(spin: number): Item {
  const [eu, ev] = polar(CRANK_R, CRANK_REST + spin);
  const F = XF(SPOOL_Y - eu, SPOOL_Z - ev);
  const knob = S(G.disc(KNOB[0], KNOB[1], KNOB_R, F, P, { bevel: 0.3 }), { tone: "mid" }) + k.fadedSvg(ribsOf(F, KNOB[0] + 0.8, KNOB[1] - 0.8, KNOB_R, 18, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" });
  return make("ratchet.knob", [(KNOB[0] + KNOB[1]) / 2, SPOOL_Y - eu, SPOOL_Z - ev], `<g data-part="knob">${knob}</g>`, [discShape("ratchet.knob", F, KNOB[0], KNOB[1], KNOB_R, { owner: "ratchet" })], 0.6);
}

put("ratchet.boss", [(WHEEL[1] + CRANK[0]) / 2, SPOOL_Y, SPOOL_Z], S(G.disc(WHEEL[1], CRANK[0], 2.6, AXIS_F, P), { tone: "mid" }), [discShape("ratchet.boss", AXIS_F, WHEEL[1], CRANK[0], 2.6, { owner: "ratchet" })], 0.45);
items.push(crankItem(0), knobItem(0));

/* ------------------------------------------------------------------ order */

const settled = SETTLED as Record<string, number>;
export const ITEMS: Item[] = items.map((item) => ({ ...item, key: settled[item.name] ?? item.key }));
const ordered = () => [...ITEMS].sort((a, b) => a.key - b.key);

/** Every item the page moves. */
export const MOVING = ["ratchet.wheel", "ratchet.crank", "ratchet.knob", "keys.bow-0", "keys.bow-1", "keys.bow-2"];

export interface Pose {
  label: string;
  theta: number;
  keys: number[];
}

/**
 * The poses the page can show, for the verification build to settle the
 * painter's keys over and audit: the wheel every quarter tooth round a full
 * turn (the crank rests in 20 places), each click from both sides, each hold
 * against the pawl, and each key a third, two thirds and all the way turned.
 */
export const POSES: Pose[] = [
  ...Array.from({ length: TEETH * 4 }, (_, j) => ({ label: `wheel +${r1((j * TOOTH) / 4)}°`, theta: WHEEL_REST + (j * TOOTH) / 4, keys: [0, 0, 0] })),
  ...Array.from({ length: TEETH }, (_, i) => [
    { label: `tooth ${i + 1} just before the click`, theta: WHEEL_REST + i * TOOTH + LIFT_CLICK - 0.05, keys: [0, 0, 0] },
    { label: `tooth ${i + 1} just after the click`, theta: WHEEL_REST + i * TOOTH + LIFT_CLICK + 0.05, keys: [0, 0, 0] },
    { label: `rest ${i} held against the pawl`, theta: WHEEL_REST + i * TOOTH - HOLD, keys: [0, 0, 0] },
  ]).flat(),
  ...[0, 1, 2].flatMap((key) => [30, 60, 90].map((deg) => ({ label: `key ${key} turned ${deg}°`, theta: WHEEL_REST, keys: [0, 1, 2].map((i) => (i === key ? deg : 0)) }))),
];

/** The item list in one pose: the moving parts rebuilt there, every key as settled. */
export function itemsAt(pose: Pose): Item[] {
  const spin = pose.theta - WHEEL_REST;
  const posed = new Map<string, Item>([
    ["ratchet.wheel", ratchetItem(pose.theta)],
    ["ratchet.crank", crankItem(spin)],
    ["ratchet.knob", knobItem(spin)],
    ...pose.keys.map((deg, i) => [`keys.bow-${i}`, bowItem(i, deg)] as [string, Item]),
  ]);
  return ITEMS.map((item) => {
    const moved = posed.get(item.name);
    return moved ? { ...moved, key: item.key } : item;
  });
}

/** Invisible hit targets over the keys and the crank, drawn above everything. */
const HITS = [
  ...KEY_Y.map((y, i) => {
    const [cx, cy] = at([KEY_FACE + 6, y, KEY_Z]);
    return `<circle class="vlt-hit" data-hit="${i}" cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(9 * k.cameraOf(P).k)}"/>`;
  }),
  (() => {
    const [cx, cy] = at([KNOB[1], SPOOL_Y, SPOOL_Z]);
    return `<circle class="vlt-hit" data-hit="crank" cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(13 * k.cameraOf(P).k)}"/>`;
  })(),
].join("");

/**
 * The drawing's markup in painter's order. `uid` suffixes the two clipPath
 * ids, so two vault figures on one page never share an id.
 */
export function bodyFor(locale: Locale, list: Item[] = ordered(), uid = "") {
  const engraved = locale === "ar" ? "الدوحة" : "DOHA";
  const body = list.map((item) => `<g data-item="${item.name}">${item.svg}</g>`).join("").replace(ENGRAVED, engraved) + `<g class="vlt-hits">${HITS}</g>`;
  return uid ? body.replace(/(id="|url\(#)vlt-(window|strip)/g, `$1vlt-$2-${uid}`) : body;
}

/** What the live controller needs: numbers only, no geometry code ships. */
export const LIVE = {
  width: WIDTH,
  height: HEIGHT,
  azimuth: AZIMUTH,
  ex: EX,
  ey: EY,
  ez: EZ,
  view: V,
  light: L,
  bands: [0, 0.2, 0.42, 0.62],
  keyFace: KEY_FACE,
  keyY: KEY_Y,
  keyZ: KEY_Z,
  keyLayers: KEY_LAYERS,
  origin: at([0, 0, 0]),
  side: { u: [-EY[0], -EY[1]] as Flat, v: [-EZ[0], -EZ[1]] as Flat },
  tooth: TOOTH,
  pivot: PAWL_PIVOT,
  wheelRest: WHEEL_REST,
  lift: LIFT,
  liftStep: LIFT_STEP,
  liftClick: LIFT_CLICK,
  hold: HOLD,
  crankR: CRANK_R,
  crankRest: CRANK_REST,
  rollR: ROLL_R,
  pitch: PITCH,
  printZ: PRINT_Z,
  windowTop: WINDOW.z1,
  tapeX: TAPE_X,
  headTravel: TAPE_X[1] - TAPE_X[0] - 4,
  words: ROLES.map((role) => role.words),
  firstLine: FIRST_LINE,
  stripFrom: HOUSING_TOP,
  stripTop: STRIP_TOP,
  tapeLines: TAPE_LINES,
};

export type LiveData = typeof LIVE;
