/**
 * The one desk, built once: every static path, the parts that move (built at
 * their rest pose and moved by translation only), and the recorded shapes the
 * audit proves. Server-only: nothing in here is shipped to the browser.
 */
import * as k from "../../iso/iso-kit";
import * as LatheKit from "../../iso/lathe.mjs";
import * as AuditKit from "../../iso/audit.mjs";
import * as TubeKit from "../../iso/tube.mjs";
import { backHalf, ellipse, frontHalf, roundOf, silhouetteOf } from "./round";
import { CAPSULE_LEN, CHANNELS, COUNT, CUP_TOP, LANE_Y, PAD_REST, PRESS_X, RAIL_TOP, SLED_TOP, STROKE, TUBE_X, tubeOf, type Locale } from "./model";
import {
  ARM,
  ARM_Z,
  AZIMUTH,
  ELEVATION,
  BEAM,
  BEAM_H,
  BEAM_Z,
  CLAMP_R,
  CLAMP_Z,
  COLLAR_R,
  COLUMN,
  COLUMN_FOOT,
  COLUMN_TOP,
  CUP_R,
  DESK,
  DESK_H,
  FLANGE,
  FLANGE_R,
  FOOT_H,
  GLASS,
  GLASS_R,
  HEIGHT,
  HOUSING,
  HOUSING_R,
  KNOB_R,
  LOWER_COLLAR,
  P,
  PAD_H,
  PAD_R,
  POST,
  POST_FOOT,
  POST_X,
  RAIL,
  RECEIVER,
  RECEIVER_R,
  ROD_R,
  SLED,
  STOP_W,
  STRIP,
  TOP_COLLAR,
  TUBE_R,
  WIDTH,
  at,
} from "./view";

/** The kit's lathe, tube and audit modules are plain JavaScript; they are used here through loose types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Loose = any;
const G: Loose = LatheKit;
const A: Loose = AuditKit;
const { tubePieces, tubeSvg }: Loose = TubeKit;

type Point3 = k.Point3;
type Flat = k.Flat;
type Style = Parameters<typeof k.solidSvg>[1];
type Shape = Loose;

const KS = G.scaleOf(P);
const V = G.viewOf(P);
const S = (paths: k.SolidPaths, style: Style = {}) => k.solidSvg(paths, style);
const L = (d: string, style: Parameters<typeof k.lineSvg>[1] = {}) => (d ? k.lineSvg(d, style) : "");
const D = (points: Flat[], style: Parameters<typeof k.dotsSvg>[1] = {}) => (points.length ? k.dotsSvg(points, style) : "");
const RAD = Math.PI / 180;
const VIEW_ANGLE = AZIMUTH * RAD;
const TAN_E = Math.tan(ELEVATION * RAD);

/** A recorder for the audit: every drawn static item puts its svg and its true shapes. */
export const R = A.recorder(P);

interface Item {
  name: string;
  svg: string;
  key: number;
  shapes: Shape[];
  attrs?: string;
}

function put(name: string, ref: Point3, svg: string, shapes: Shape[], { bias = 0, attrs }: { bias?: number; attrs?: string } = {}) {
  R.put({ name, at: ref, bias, svg, shapes, piece: "desk", attrs });
}

function slab(name: string, plan: k.Plan, z: number, h: number, style: Style = {}, { steps: n = 4, bevel = 0, inner = "", extra = "", bias = 0, attrs, owner }: { steps?: number; bevel?: number; inner?: string; extra?: string; bias?: number; attrs?: string; owner?: string } = {}) {
  const shape = R.solid(A.slab(plan, z, h, { name, owner }, n));
  put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], S(k.slabOf(plan, z, h, P, n, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, attrs });
  return shape;
}

function cyl(name: string, cx: number, cy: number, r: number, z: number, h: number, style: Style = {}, { bevel = 0, inner = "", extra = "", bias = 0, owner, attrs }: { bevel?: number; inner?: string; extra?: string; bias?: number; owner?: string; attrs?: string } = {}) {
  const shape = R.solid(A.cylinder(cx, cy, r, z, h, { name, owner }));
  put(name, [cx, cy, z + h / 2], S(roundOf(cx, cy, r, z, z + h, P, { bevel }), { tone: "mid", ...style, inner }) + extra, [shape], { bias, attrs });
  return shape;
}

/** Paths of an upright cylinder without putting it (for moving and late parts). */
const cylPaths = (cx: number, cy: number, r: number, z: number, h: number, bevel = 0) => roundOf(cx, cy, r, z, z + h, P, { bevel });
const ringOn = (cx: number, cy: number, r: number, z: number) => ellipse(cx, cy, r, z, P);
const arcOn = (cx: number, cy: number, r: number, z: number) => frontHalf(cx, cy, r, z, P);
const dotsRound = (cx: number, cy: number, r: number, z: number, count: number, phase = 0) =>
  Array.from({ length: count }, (_, index) => {
    const angle = phase + (index / count) * Math.PI * 2;
    return at([cx + r * Math.cos(angle), cy + r * Math.sin(angle), z]);
  });

/* ------------------------------------------------------------------ desk */

const FOOT_Z = -DESK_H - FOOT_H;
export const HALO = `<path class="iso-halo" d="${k.haloOf(DESK, FOOT_Z, DESK_H + FOOT_H, P)}"/>`;

const byDepth = (points: k.Plane[]) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
for (const [index, [x, y]] of byDepth(k.corners(DESK, 24)).entries()) {
  const flange = R.solid(A.cylinder(x, y, 7, FOOT_Z, 1.6, { name: `stand.foot${index}`, ground: true }));
  const foot = R.solid(A.cylinder(x, y, 5.4, FOOT_Z + 1.6, FOOT_H - 1.6, { name: `desk.foot${index}` }));
  put(`desk.foot${index}`, [x, y, FOOT_Z], S(cylPaths(x, y, 7, FOOT_Z, 1.6), { tone: "lo" }) + S(cylPaths(x, y, 5.4, FOOT_Z + 1.6, FOOT_H - 1.6), { tone: "mid" }), [flange, foot]);
}

{
  const screws = k.corners(DESK, 10);
  const seam = L(k.sideSeam(DESK, -DESK_H + 2.5, P, 8), { tone: "faint" });
  slab("desk.top", DESK, -DESK_H, DESK_H, { tone: "mid" }, {
    steps: 8,
    bevel: 1.6,
    inner: seam,
    extra:
      L(k.planOutline(k.insetPlan(DESK, 5), 0, P), { tone: "lo" }) +
      L(screws.map(([x, y]) => ringOn(x, y, 2.2, 0)).join(""), { tone: "lo" }) +
      D(screws.map(([x, y]) => at([x, y, 0])), { size: 0.5 }),
  });
}

/** Two drawers in the desk's front face, each with a card holder and a pull. */
const FRONT_Y = DESK.y + DESK.d;
for (const [index, x0] of [-166, 34].entries()) {
  const w = 132;
  const front = { x: x0, y: FRONT_Y, w, d: 1.2, r: 0.6 };
  const holder = { x: x0 + w / 2 - 9, y: FRONT_Y + 1.2, w: 18, d: 0.6, r: 0.3 };
  const pull = { x: x0 + w / 2 - 13, y: FRONT_Y + 1.2, w: 26, d: 2.4, r: 1 };
  const face = FRONT_Y + 1.8;
  const card = k.pathOf([at([x0 + w / 2 - 7.4, face, -6.2]), at([x0 + w / 2 + 7.4, face, -6.2]), at([x0 + w / 2 + 7.4, face, -9.6]), at([x0 + w / 2 - 7.4, face, -9.6])], true);
  /** A raised panel line round each drawer front, in the plane of the front. */
  const panelFace = FRONT_Y + 1.2;
  const panel = k.pathOf([[x0 + 2.6, -15], [x0 + w - 2.6, -15], [x0 + w - 2.6, -4], [x0 + 2.6, -4]].map(([x, z]) => at([x!, panelFace, z!])), true);
  slab(`desk.drawer${index}`, front, -DESK_H + 4, DESK_H - 7, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: L(panel, { tone: "faint" }) });
  slab(`desk.holder${index}`, holder, -10.4, 5, { tone: "lo" }, { steps: 2, extra: L(card, { tone: "faint" }) + D([at([x0 + w / 2 - 8.2, face, -7.9]), at([x0 + w / 2 + 8.2, face, -7.9])], { size: 0.35 }) });
  slab(`desk.pull${index}`, pull, -14.6, 2.6, { tone: "mid" }, { steps: 3, bevel: 0.3 });
}

/** The lock plate between the drawers: a keyhole and its slot, both closed outlines. */
{
  const plate = { x: -30, y: FRONT_Y, w: 60, d: 1.2, r: 0.6 };
  const face = FRONT_Y + 1.2;
  const circle = (cx: number, cz: number, r: number) => k.pathOf(Array.from({ length: 20 }, (_, index) => {
    const angle = (index / 20) * Math.PI * 2;
    return at([cx + r * Math.cos(angle), face, cz + r * Math.sin(angle)]);
  }), true);
  const slot = k.pathOf([[-0.7, -10.6], [0.7, -10.6], [0.7, -13], [-0.7, -13]].map(([x, z]) => at([x!, face, z!])), true);
  slab("desk.lock", plate, -DESK_H + 4, DESK_H - 7, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: L(circle(0, -9.4, 1.6) + slot + circle(0, -9.4, 3.4), { tone: "lo" }) + D([at([-26, face, -6]), at([26, face, -6]), at([-26, face, -13]), at([26, face, -13])], { size: 0.35 }) });
}

/**
 * The line console, front left on the desk: one jewel per tube in the tubes'
 * own order, lit for the line that is working, like the lamp on its receiver.
 */
{
  const plan = { x: -170, y: -22, w: 66, d: 16, r: 2.2 };
  const top = 2.6;
  const jewels = TUBE_X.map((_, tube) => {
    const cx = plan.x + 8 + tube * 10;
    const cy = plan.y + plan.d / 2;
    return `<g class="od-jewel" data-od-jewel="${tube}">{{jewel${tube}}}<path class="od-jewel-glass" d="${ringOn(cx, cy, 2, top)}"/>${L(ringOn(cx, cy, 2, top) + ringOn(cx, cy, 3, top), { tone: "lo" })}</g>`;
  }).join("");
  slab("desk.console", plan, 0, top, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: jewels + D([at([plan.x + 2.6, plan.y + 2.6, top]), at([plan.x + plan.w - 2.6, plan.y + plan.d - 2.6, top])], { size: 0.4 }) });
}

/** Ruler strip in front of the rail: minor ticks every 5, a major tick under each tube, the zero under the stamp. */
{
  const minor: string[] = [];
  const major: string[] = [];
  const edge = STRIP.y + 0.4;
  for (let x = -150; x <= 150; x += 5) {
    const big = TUBE_X.includes(x);
    if (x === PRESS_X) continue;
    (big ? major : minor).push(k.lineOnTop([x, edge], [x, edge + (big ? 4 : 2.2)], 0.6, P));
  }
  const zero = k.lineOnTop([PRESS_X, edge], [PRESS_X, STRIP.y + STRIP.d - 0.4], 0.6, P);
  slab("desk.strip", STRIP, 0, 0.6, { tone: "lo", crease: "none" }, {
    steps: 3,
    extra: L(minor.join(""), { tone: "lo" }) + L(major.join(""), { tone: "mid" }) + L(zero, { tone: "hi" }) + D([at([STRIP.x + 2.4, STRIP.y + STRIP.d / 2, 0.6]), at([STRIP.x + STRIP.w - 2.4, STRIP.y + STRIP.d / 2, 0.6])], { size: 0.45 }),
  });
}

/** Label plate, front right: three rule lines stand for printed text. */
{
  const plate = { x: 124, y: -16, w: 52, d: 14, r: 2 };
  const rules = [0, 1, 2].map((row) => k.lineOnTop([plate.x + 8, plate.y + 4 + row * 2.6], [plate.x + (row === 1 ? 30 : row === 2 ? 38 : 44), plate.y + 4 + row * 2.6], 0.8, P)).join("");
  slab("desk.label", plate, 0, 0.8, { tone: "lo", crease: "none" }, {
    steps: 4,
    extra:
      L(k.planOutline(k.insetPlan(plate, 1.6), 0.8, P, 4), { tone: "faint" }) +
      L(rules, { tone: "lo", free: true }) +
      D([at([plate.x + 3.6, plate.y + plate.d / 2, 0.8]), at([plate.x + plate.w - 3.6, plate.y + plate.d / 2, 0.8])], { size: 0.45 }),
  });
}

/* ------------------------------------------------------------- the rail */

{
  const screws = [-152, -115, -65, -20, 20, 65, 115, 152].map((x) => at([x, LANE_Y, RAIL_TOP]));
  slab("rail", RAIL, 0, RAIL_TOP, { tone: "mid" }, { steps: 3, bevel: 0.5, extra: D(screws, { size: 0.45 }) });
  for (const side of [-1, 1]) {
    const x = side < 0 ? RAIL.x - STOP_W : RAIL.x + RAIL.w;
    const plan = { x, y: LANE_Y - 7, w: STOP_W, d: 14, r: 1.2 };
    slab(`rail.stop${side < 0 ? 0 : 1}`, plan, 0, 9, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: D([at([x + STOP_W / 2, LANE_Y - 4, 9]), at([x + STOP_W / 2, LANE_Y + 4, 9])], { size: 0.45 }) });
  }
}

/* ---------------------------------------------------- posts and the beam */

for (const side of [-1, 1]) {
  const cx = side * POST_X;
  const foot = { x: cx - POST_FOOT / 2, y: LANE_Y - POST_FOOT / 2, w: POST_FOOT, d: POST_FOOT, r: 2 };
  const post = { x: cx - POST / 2, y: LANE_Y - POST / 2, w: POST, d: POST, r: 2 };
  const name = side < 0 ? "post0" : "post1";
  slab(`${name}.foot`, foot, 0, 3, { tone: "lo" }, { steps: 3, bevel: 0.4, extra: D(k.corners(foot, 3).map(([x, y]) => at([x, y, 3])), { size: 0.45 }) });
  slab(`${name}`, post, 3, BEAM_Z - 3, { tone: "mid" }, { steps: 3, inner: L(k.sideSeam(post, 14, P, 3) + k.sideSeam(post, BEAM_Z - 10, P, 3), { tone: "faint" }) });
}

/** One badge per tube on the beam's face, each engraved with its channel's shape (never a brand logo). */
const GLYPHS: Record<(typeof CHANNELS)[number], { d: string; dots?: [number, number][] }> = {
  calls: { d: "M7.5 4h3l1.5 4-2 1.3a10 10 0 0 0 4.7 4.7L16 12l4 1.5v3a2 2 0 0 1-2 2A14.5 14.5 0 0 1 5.5 6a2 2 0 0 1 2-2z" },
  whatsapp: { d: "M12 3.5a8.5 8.5 0 0 0-7.4 12.7L3.5 20.5l4.4-1.1A8.5 8.5 0 1 0 12 3.5z" },
  telegram: { d: "M21 3.5 2.8 11.2l6 2.3 1.6 6 3.2-3.7 4.9 3.7zM8.8 13.5 21 3.5" },
  sms: { d: "M4 5h16v11H9l-5 4z", dots: [[8.5, 10.5], [12, 10.5], [15.5, 10.5]] },
  email: { d: "M4 6h16v12H4zM4 6l8 6.5L20 6" },
  web: { d: "M3.5 12a8.5 8.5 0 1 0 17 0a8.5 8.5 0 1 0-17 0zM3.5 12h17M8.2 12a3.8 8.5 0 1 0 7.6 0a3.8 8.5 0 1 0-7.6 0z" },
};
const BADGE_W = 14;
const BADGE_Z: [number, number] = [BEAM_Z + 2.4, BEAM_Z + BEAM_H - 2.4];
const BADGE_FACE = BEAM.y + BEAM.d + 0.8;
const GLYPH = 0.3;

function badgeArt(tube: number, channel: number) {
  const x = TUBE_X[tube]!;
  const zc = (BADGE_Z[0] + BADGE_Z[1]) / 2;
  const glyph = GLYPHS[CHANNELS[channel]!];
  const matrix = k.sideMatrix([x, BADGE_FACE], zc, P, "left");
  const local = (u: number, v: number): Point3 => [x + (u - 12) * GLYPH, BADGE_FACE, zc - (v - 12) * GLYPH];
  const lines = `<g transform="${matrix} scale(${GLYPH}) translate(-12 -12)">${L(glyph.d, { tone: "mid" })}</g>`;
  const dots = glyph.dots ? D(glyph.dots.map(([u, v]) => at(local(u, v))), { size: 0.38, tone: "hi" }) : "";
  return lines + dots;
}

{
  const plan = BEAM;
  const top = BEAM_Z + BEAM_H;
  const screws = [-1, 1].flatMap((side) => [at([side * POST_X, LANE_Y - 4, top]), at([side * POST_X, LANE_Y + 4, top])]);
  slab("beam", plan, BEAM_Z, BEAM_H, { tone: "mid" }, { steps: 3, bevel: 0.8, inner: L(k.sideSeam(plan, top - 2.2, P, 3), { tone: "faint" }), extra: L(k.planOutline(k.insetPlan(plan, 3), top, P, 3), { tone: "faint" }) + D(screws, { size: 0.5 }) });
}

/**
 * One blower on the beam for each line: the air that drives a capsule down
 * its tube and pulls it back up. A base plate on the beam, a finned motor can
 * and a cap with its bolt circle.
 */
const BEAM_TOP = BEAM_Z + BEAM_H;
for (let tube = 0; tube < COUNT; tube++) {
  const x = TUBE_X[tube]!;
  const plate = { x: x - 8, y: LANE_Y - 7, w: 16, d: 14, r: 1.5 };
  slab(`t${tube}.blower.plate`, plate, BEAM_TOP, 1.2, { tone: "lo" }, { steps: 2, bevel: 0.3, extra: D([at([x - 6, LANE_Y + 5, BEAM_TOP + 1.2]), at([x + 6, LANE_Y - 5, BEAM_TOP + 1.2])], { size: 0.4 }) });
  const can: [number, number] = [BEAM_TOP + 1.2, BEAM_TOP + 10.4];
  cyl(`t${tube}.blower`, x, LANE_Y, 5.8, can[0], can[1] - can[0], { tone: "mid" }, { extra: L(k.knurl(x, LANE_Y, 5.8, can[0] + 1, can[1] - 1, 16, P), { tone: "faint" }) + L(arcOn(x, LANE_Y, 5.8, can[0] + 1) + arcOn(x, LANE_Y, 5.8, can[1] - 1), { tone: "lo" }) });
  cyl(`t${tube}.blower.cap`, x, LANE_Y, 6.4, can[1], 1.8, { tone: "mid" }, { bevel: 0.4, extra: L(ringOn(x, LANE_Y, 2, can[1] + 1.8), { tone: "lo" }) + D(dotsRound(x, LANE_Y, 4.6, can[1] + 1.8, 6, Math.PI / 6), { size: 0.36 }) });
}

/** Badge plates are shared; their engraving is per locale (the channel order runs right to left in Arabic). */
for (let tube = 0; tube < COUNT; tube++) {
  const x = TUBE_X[tube]!;
  const plan = { x: x - BADGE_W / 2, y: BEAM.y + BEAM.d, w: BADGE_W, d: 0.8, r: 0.6 };
  const shape = R.solid(A.slab(plan, BADGE_Z[0], BADGE_Z[1] - BADGE_Z[0], { name: `beam.badge${tube}` }, 2));
  const rivets = D([at([x - BADGE_W / 2 + 1.4, BADGE_FACE, BADGE_Z[1] - 1.4]), at([x + BADGE_W / 2 - 1.4, BADGE_FACE, BADGE_Z[1] - 1.4])], { size: 0.32 });
  const svg = S(k.slabOf(plan, BADGE_Z[0], BADGE_Z[1] - BADGE_Z[0], P, 2, 0.3), { tone: "lo" }) + rivets;
  put(`beam.badge${tube}`, [x, plan.y + 0.4, (BADGE_Z[0] + BADGE_Z[1]) / 2], svg, [shape]);
}

/* ------------------------------------------------------------ the tubes */

/** Opaque parts that hide the capsule wherever it passes behind or inside them (the capsule is drawn late, under this mask). */
const MASK_BLACK: string[] = [];
/** A marker the svg writer swaps for the lamp that is on in the still. */
const LAMP_ON = (tube: number) => `{{lamp${tube}}}`;
/** Openings through which the capsule shows again: the bore of each lower collar under its glass. */
const MASK_WHITE: string[] = [];
/** Glass fronts, drawn after the capsule. */
const GLASS_FRONT: string[] = [];

/**
 * Where a line drawn up the glass at angle delta from the view direction meets
 * the top collar's lower rim on screen: it ends there, on that outline.
 */
const COUPLING_AT = 110;
const COUPLING_H = 4;
const glassTop = (delta: number) => GLASS[1] - (COLLAR_R * Math.sqrt(Math.max(0, 1 - ((GLASS_R * Math.sin(delta)) / COLLAR_R) ** 2)) - GLASS_R * Math.cos(delta)) * TAN_E;
const onGlass = (x: number, y: number, delta: number) => {
  const angle = VIEW_ANGLE + delta;
  const px = x + GLASS_R * Math.cos(angle);
  const py = y + GLASS_R * Math.sin(angle);
  return k.pathOf([at([px, py, GLASS[0]]), at([px, py, glassTop(delta)])]);
};

for (let tube = 0; tube < COUNT; tube++) {
  const x = TUBE_X[tube]!;
  const y = LANE_Y;
  const name = `t${tube}`;

  cyl(`${name}.flange`, x, y, FLANGE_R, FLANGE[0], FLANGE[1] - FLANGE[0], { tone: "mid" }, { bevel: 0.4 });

  const route: Point3[] = [
    [x, y, FLANGE[0]],
    [x, y, TOP_COLLAR[1]],
  ];
  /** Straight down from the flange (its top end is hidden in the flange) to the collar's top face, in two lengths joined by a coupling. */
  const joint = COUPLING_AT - TOP_COLLAR[1];
  const length = FLANGE[0] - TOP_COLLAR[1];
  const gaps: [number, number][] = [[length - joint - COUPLING_H / 2, length - joint + COUPLING_H / 2]];
  R.route(`${name}.tube`, route, TUBE_R, { piece: "desk", gaps });
  tubePieces(route, TUBE_R, P, { maxLength: 80, spacing: 40, caps: [false, true], gaps }).forEach((piece: Loose, index: number) => {
    put(`${name}.tube:${index}`, piece.mid, tubeSvg(piece, { tone: "mid" }), [A.tube(piece.points, piece.radii, { name: `${name}.tube` })], { bias: 0.05 });
  });
  cyl(`${name}.coupling`, x, y, TUBE_R + 1.2, COUPLING_AT - COUPLING_H / 2, COUPLING_H, { tone: "mid" }, { bevel: 0.3, owner: `${name}.tube`, inner: L(arcOn(x, y, TUBE_R + 1.2, COUPLING_AT), { tone: "faint" }), extra: D(dotsRound(x, y, TUBE_R + 0.6, COUPLING_AT + COUPLING_H / 2, 4, Math.PI / 4), { size: 0.36 }) });
  MASK_BLACK.push(silhouetteOf(x, y, TUBE_R + 1.2, COUPLING_AT - COUPLING_H / 2, COUPLING_AT + COUPLING_H / 2, P));
  MASK_BLACK.push(silhouetteOf(x, y, TUBE_R, TOP_COLLAR[1], FLANGE[0], P));

  const topBolts = dotsRound(x, y, 7.4, TOP_COLLAR[1], 6, Math.PI / 6);
  cyl(`${name}.collar`, x, y, COLLAR_R, TOP_COLLAR[0], TOP_COLLAR[1] - TOP_COLLAR[0], { tone: "mid" }, { bevel: 0.5, extra: D(topBolts, { size: 0.42 }) });
  MASK_BLACK.push(silhouetteOf(x, y, COLLAR_R, TOP_COLLAR[0], TOP_COLLAR[1], P));

  /** The glass: its back (tinted fill and the far half of its foot ring) sits in the sorted art, its front lines come after the capsule. */
  const glass = cylPaths(x, y, GLASS_R, GLASS[0], GLASS[1] - GLASS[0]);
  const backFoot = backHalf(x, y, GLASS_R, GLASS[0], P);
  const glassShape = R.solid(A.cylinder(x, y, GLASS_R, GLASS[0], GLASS[1] - GLASS[0], { name: `${name}.glass` }));
  put(`${name}.glass`, [x, y, (GLASS[0] + GLASS[1]) / 2], `<path class="od-glass" d="${glass.fill}"/>${L(backFoot, { tone: "faint" })}`, [glassShape]);

  const sides = [-1, 1].map((side) => onGlass(x, y, side * (Math.PI / 2 - 0.002)));
  const shine = [-0.62, -0.38].map((delta) => onGlass(x, y, delta));
  const frontFoot = arcOn(x, y, GLASS_R, GLASS[0]);
  GLASS_FRONT.push(L(frontFoot + sides.join(""), { tone: "mid" }) + L(shine.join(""), { tone: "faint", className: "od-shine" }));

  const lowerBolts = dotsRound(x, y, 7.6, LOWER_COLLAR[1], 8, Math.PI / 8);
  cyl(`${name}.base`, x, y, COLLAR_R, LOWER_COLLAR[0], LOWER_COLLAR[1] - LOWER_COLLAR[0], { tone: "mid" }, { bevel: 0.5, extra: D(lowerBolts, { size: 0.42 }) });
  MASK_BLACK.push(silhouetteOf(x, y, COLLAR_R, LOWER_COLLAR[0], LOWER_COLLAR[1], P));
  MASK_WHITE.push(ringOn(x, y, GLASS_R, LOWER_COLLAR[1]));

  /** Receiver body with a lip at the mouth, a seam, and an arrival lamp facing the viewer. */
  const lipH = 2.2;
  const receiver = cyl(`${name}.receiver`, x, y, RECEIVER_R, RECEIVER[0] + lipH, RECEIVER[1] - RECEIVER[0] - lipH, { tone: "mid" }, { inner: L(arcOn(x, y, RECEIVER_R, RECEIVER[1] - 3), { tone: "faint" }) });
  cyl(`${name}.lip`, x, y, RECEIVER_R + 0.8, RECEIVER[0], lipH, { tone: "mid" }, { bevel: 0.4 });
  MASK_BLACK.push(silhouetteOf(x, y, RECEIVER_R + 0.8, RECEIVER[0], RECEIVER[1], P));

  const lampAngle = VIEW_ANGLE - 18 * RAD;
  const normal: Point3 = [Math.cos(lampAngle), Math.sin(lampAngle), 0];
  const lampZ = RECEIVER[0] + lipH + 4.6;
  const base: Point3 = [x, y, lampZ];
  const F = G.frameAlong(base, normal);
  const padTop = RECEIVER_R + 1.2;
  const pad = G.saddleOf(F, 2.3, RECEIVER_R, padTop, P, { steps: 12 });
  const lensC = G.add3(base, G.mul3(normal, padTop));
  const lens = G.sphereOf(lensC, 1.6, P, { steps: 14 });
  const padShape = R.solid(A.disc(F, RECEIVER_R - 0.4, padTop, 2.3, { name: `${name}.lamp`, owner: `${name}.receiver`, seated: true, cut: [receiver] }));
  const lensShape = R.solid(A.ball(lensC, 1.6, { name: `${name}.lens`, owner: `${name}.receiver` }));
  put(`${name}.lamp`, G.add3(base, G.mul3(normal, RECEIVER_R + 1)), `<g class="od-lamp" data-od-lamp="${tube}"${LAMP_ON(tube)}>${S(pad, { tone: "mid" })}${S(lens, { tone: "mid", className: "od-lens" })}</g>`, [padShape, lensShape], { bias: 0.2 });
  MASK_BLACK.push(pad.fill, lens.fill);
}

/* ------------------------------------------------------------ the press */

{
  const foot = COLUMN_FOOT;
  slab("press.foot", foot, 0, 3, { tone: "lo" }, { steps: 3, bevel: 0.4, extra: D(k.corners(foot, 3).map(([x, y]) => at([x, y, 3])), { size: 0.45 }), owner: "press" });
  slab("press.column", COLUMN, 3, COLUMN_TOP - 3, { tone: "mid" }, { steps: 3, inner: L(k.sideSeam(COLUMN, 16, P, 3), { tone: "faint" }), owner: "press" });
  slab("press.cap", k.insetPlan(COLUMN, -1), COLUMN_TOP, 2.4, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: D([at([COLUMN.x + COLUMN.w / 2, COLUMN.y + COLUMN.d / 2, COLUMN_TOP + 2.4])], { size: 0.5 }), owner: "press" });
  slab("press.arm", ARM, ARM_Z[0], ARM_Z[1] - ARM_Z[0], { tone: "mid" }, { steps: 3, bevel: 0.5, extra: D([at([0, ARM.y + 3, ARM_Z[1]]), at([0, ARM.y + ARM.d - 4, ARM_Z[1]])], { size: 0.45 }), owner: "press" });
}

/* -------------------------------------------- the static head of the press (drawn after the capsule) */

const HEAD_Y = LANE_Y;
const head: string[] = [];
const headShapes: Shape[] = [];
{
  const lower = cylPaths(PRESS_X, HEAD_Y, HOUSING_R, HOUSING[0], CLAMP_Z[0] - HOUSING[0]);
  const clamp = cylPaths(PRESS_X, HEAD_Y, CLAMP_R, CLAMP_Z[0], CLAMP_Z[1] - CLAMP_Z[0], 0.5);
  const upper = cylPaths(PRESS_X, HEAD_Y, HOUSING_R, CLAMP_Z[1], HOUSING[1] - CLAMP_Z[1]);
  const cap = cylPaths(PRESS_X, HEAD_Y, HOUSING_R + 0.8, HOUSING[1], 1.6, 0.3);
  const gland = L(arcOn(PRESS_X, HEAD_Y, HOUSING_R, HOUSING[0] + 3), { tone: "faint" });
  head.push(
    S(lower, { tone: "mid", inner: gland }),
    S(clamp, { tone: "mid", inner: L(arcOn(PRESS_X, HEAD_Y, CLAMP_R, (CLAMP_Z[0] + CLAMP_Z[1]) / 2), { tone: "faint" }) }) + D(dotsRound(PRESS_X, HEAD_Y, 6.6, CLAMP_Z[1], 6, Math.PI / 6), { size: 0.42 }),
    S(upper, { tone: "mid" }),
    S(cap, { tone: "mid" }) + L(ringOn(PRESS_X, HEAD_Y, 2.4, HOUSING[1] + 1.6), { tone: "lo" }),
  );
  headShapes.push(
    R.solid(A.cylinder(PRESS_X, HEAD_Y, HOUSING_R, HOUSING[0], CLAMP_Z[0] - HOUSING[0], { name: "press.housing", owner: "press" })),
    R.solid(A.cylinder(PRESS_X, HEAD_Y, CLAMP_R, CLAMP_Z[0], CLAMP_Z[1] - CLAMP_Z[0], { name: "press.clamp", owner: "press" })),
    R.solid(A.cylinder(PRESS_X, HEAD_Y, HOUSING_R, CLAMP_Z[1], HOUSING[1] - CLAMP_Z[1], { name: "press.housing.upper", owner: "press" })),
    R.solid(A.cylinder(PRESS_X, HEAD_Y, HOUSING_R + 0.8, HOUSING[1], 1.6, { name: "press.cap", owner: "press" })),
  );
}

/* ------------------------------------------------------- moving parts */

/** The plunger under the head: stamp pad and rod, built at rest and moved down by translation. */
const ROD_TOP = CLAMP_Z[0] - 2;
const padPaths = cylPaths(PRESS_X, HEAD_Y, PAD_R, PAD_REST + 1, PAD_H - 1, 0.4);
const diePaths = cylPaths(PRESS_X, HEAD_Y, PAD_R - 0.6, PAD_REST, 1);
const rodPaths = cylPaths(PRESS_X, HEAD_Y, ROD_R, PAD_REST + PAD_H, ROD_TOP - PAD_REST - PAD_H);
const PLUNGER = S(diePaths, { tone: "lo" }) + S(padPaths, { tone: "hi", inner: L(arcOn(PRESS_X, HEAD_Y, PAD_R, PAD_REST + 2), { tone: "faint" }) }) + S(rodPaths, { tone: "mid", crease: "none" });
const plungerShapes: Shape[] = [
  R.solid(A.cylinder(PRESS_X, HEAD_Y, PAD_R - 0.6, PAD_REST, 1, { name: "press.die", owner: "press" })),
  R.solid(A.cylinder(PRESS_X, HEAD_Y, PAD_R, PAD_REST + 1, PAD_H - 1, { name: "press.pad", owner: "press" })),
  R.solid(A.cylinder(PRESS_X, HEAD_Y, ROD_R, PAD_REST + PAD_H, ROD_TOP - PAD_REST - PAD_H, { name: "press.rod", owner: "press" })),
];

/** The stem and knob above the head, moving with the plunger. */
/** The stem runs down through the cap's bore; a fixed clip shows it only above the bore's front rim, wherever the stroke takes it. */
const STEM_Z = HOUSING[1] + 1.6;
const STEM_SHOWN = 8;
const KNOB_Z = STEM_Z + STEM_SHOWN;
const BORE_R = 2.4;
const stemPaths = cylPaths(PRESS_X, HEAD_Y, 1.5, STEM_Z - STROKE - 1, STEM_SHOWN + STROKE + 1);
const knobPaths = cylPaths(PRESS_X, HEAD_Y, KNOB_R, KNOB_Z, 4, 0.4);
const STEM_CLIP = (() => {
  const [cx, cy] = at([PRESS_X, HEAD_Y, STEM_Z]);
  const rx = BORE_R * KS;
  const ry = rx * Math.sin(ELEVATION * RAD);
  const f = (v: number) => Math.round(v * 10) / 10;
  return `M0 0H${WIDTH}V${f(cy)}H${f(cx + rx)}A${f(rx)} ${f(ry)} 0 0 1 ${f(cx - rx)} ${f(cy)}H0Z`;
})();
const KNOB =
  S(stemPaths, { tone: "mid", crease: "none" }) +
  S(knobPaths, { tone: "mid" }) +
  L(k.knurl(PRESS_X, HEAD_Y, KNOB_R, KNOB_Z, KNOB_Z + 4, 28, P), { tone: "lo" }) +
  D([at([PRESS_X, HEAD_Y, KNOB_Z + 4])], { size: 0.5, tone: "hi" });
const knobShapes: Shape[] = [
  R.solid(A.cylinder(PRESS_X, HEAD_Y, 1.5, STEM_Z - STROKE - 1, STEM_SHOWN + STROKE + 1, { name: "press.stem", owner: "press" })),
  R.solid(A.cylinder(PRESS_X, HEAD_Y, KNOB_R, KNOB_Z, 4, { name: "press.knob", owner: "press" })),
];

/** The carriage at x = 0: sled on the rail, gibs on both sides of the rail, a cup that holds the capsule upright, and a pointer over the ruler. */
const carriageParts: string[] = [];
const carriageShapes: Shape[] = [];
{
  const sledH = SLED_TOP - RAIL_TOP;
  carriageParts.push(`<path class="iso-halo od-carriage-halo" d="${k.haloOf(k.insetPlan(SLED, 2), RAIL_TOP, 0.1, P)}"/>`);
  for (const [index, gy] of [SLED.y + 1.5, LANE_Y + 5].entries()) {
    const gib = { x: SLED.x + 2, y: gy, w: SLED.w - 4, d: 2.5, r: 0.6 };
    carriageParts.push(S(k.slabOf(gib, 1.2, RAIL_TOP - 1.2, P, 2), { tone: "lo" }));
    carriageShapes.push(R.solid(A.slab(gib, 1.2, RAIL_TOP - 1.2, { name: `carriage.gib${index}`, owner: "carriage" }, 2)));
  }
  const rivets = [-10, -5, 0, 5, 10].map((x) => at([x, SLED.y + SLED.d - 1.8, SLED_TOP]));
  const corners = k.corners(SLED, 2.6).map(([x, y]) => at([x, y, SLED_TOP]));
  carriageParts.push(S(k.slabOf(SLED, RAIL_TOP, sledH, P, 4, 0.6), { tone: "mid" }) + D(rivets, { size: 0.36, tone: "lo" }) + D(corners, { size: 0.45 }));
  carriageShapes.push(R.solid(A.slab(SLED, RAIL_TOP, sledH, { name: "carriage.sled", owner: "carriage" }, 4)));
  const pointer = { x: -1.3, y: SLED.y + SLED.d, w: 2.6, d: STRIP.y + 3.4 - (SLED.y + SLED.d), r: 0.5 };
  carriageParts.push(S(k.slabOf(pointer, SLED_TOP - 2.2, 1.6, P, 2), { tone: "mid" }) + L(k.lineOnTop([0, SLED.y + SLED.d], [0, pointer.y + pointer.d - 0.3], SLED_TOP - 0.6, P), { tone: "hi" }));
  carriageShapes.push(R.solid(A.slab(pointer, SLED_TOP - 2.2, 1.6, { name: "carriage.pointer", owner: "carriage" }, 2)));
  const cup = cylPaths(0, LANE_Y, CUP_R, SLED_TOP, CUP_TOP - SLED_TOP, 0.6);
  carriageParts.push(S(cup, { tone: "hi", crease: "lo" }) + L(ringOn(0, LANE_Y, 4.8, CUP_TOP), { tone: "faint" }) + D(dotsRound(0, LANE_Y, 6, CUP_TOP, 6, Math.PI / 6), { size: 0.38 }));
  carriageShapes.push(R.solid(A.cylinder(0, LANE_Y, CUP_R, SLED_TOP, CUP_TOP - SLED_TOP, { name: "carriage.cup", owner: "carriage" })));
}
const CARRIAGE = carriageParts.join("");

/** The capsule, standing in the cup at the stamp: felt rings near both ends, chamfered caps, and the answered mark on its top. */
const CAPSULE_F = G.frameOf([0, LANE_Y, CUP_TOP], [0, 0, 1], [1, 0, 0], [0, 1, 0]);
const CAPSULE_PROFILE: [number, number][] = [
  [0, 3.3],
  [1, 4.4],
  [2.6, 4.4],
  [2.6, 5.1],
  [4.4, 5.1],
  [4.4, 4.4],
  [13.6, 4.4],
  [13.6, 5.1],
  [15.4, 5.1],
  [15.4, 4.4],
  [17, 4.4],
  [CAPSULE_LEN, 3.3],
];
const capsuleShape = R.solid(A.solid(CAPSULE_F, CAPSULE_PROFILE, { name: "capsule" }));
const CAP_Z = CUP_TOP + CAPSULE_LEN;
/** Drawn bottom to top as coaxial pieces of the same profile, each a true round part (a step or a chamfer is a crease, as on a lathe). */
const CAPSULE = CAPSULE_PROFILE.slice(1)
  .map(([s1, r1], index) => {
    const [s0, r0] = CAPSULE_PROFILE[index]!;
    if (s1 === s0) return "";
    const seam = s0 < 9 && s1 > 9 ? L(arcOn(0, LANE_Y, r1, CUP_TOP + 9), { tone: "faint" }) : "";
    return S(roundOf(0, LANE_Y, r0, CUP_TOP + s0, CUP_TOP + s1, P, { r1 }), { tone: "hi", lit: true, crease: "lo", inner: seam });
  })
  .join("");
const SEAL = L(ringOn(0, LANE_Y, 2.2, CAP_Z) + ringOn(0, LANE_Y, 1.1, CAP_Z), { tone: "lit" });

/* ---------------------------------------------------------- settle and order */

A.settle(R, P);
R.items.sort((a: Item, b: Item) => a.key - b.key);

export const ITEMS = R.items as Item[];
export const MOVING = {
  carriage: { svg: CARRIAGE, shapes: carriageShapes },
  capsule: { svg: CAPSULE, seal: SEAL, shapes: [capsuleShape] },
  plunger: { svg: PLUNGER, shapes: plungerShapes },
  knob: { svg: KNOB, shapes: knobShapes },
  head: { svg: head.join(""), shapes: headShapes },
};

/**
 * Where the carriage is drawn in the sorted art: after everything it can be in
 * front of, before everything that can be in front of it. The build proves the
 * slot against every pose; here it is the slot after the rail, its stops and
 * the posts' and press column's feet, found from the settled order by name.
 */
export const CARRIAGE_AFTER = ["rail", "rail.stop0", "press.foot", "press.column", "post0.foot", "post0", "desk.strip", "desk.top"];

export function carriageSlot(items: Item[] = ITEMS, after: string[] = CARRIAGE_AFTER) {
  let slot = 0;
  items.forEach((item, index) => {
    if (after.includes(item.name)) slot = Math.max(slot, index + 1);
  });
  return slot;
}

const MASK_ID = "od-capsule-mask";

/** The whole drawing as one SVG string for a locale and a pose's lamp. */
export function svgOf(locale: Locale, label: string, { lamp = -1 }: { lamp?: number } = {}) {
  const slot = carriageSlot();
  const badgeSvg = (item: Item) => {
    const tube = Number(/beam\.badge(\d)/.exec(item.name)?.[1]);
    const channel = tubeOf(tube, locale);
    return `<g data-od-badge="${tube}" data-od-channel="${channel}">${item.svg}${badgeArt(tube, channel)}</g>`;
  };
  const sorted = ITEMS.map((item, index) => {
    const own = item.name.startsWith("beam.badge") ? badgeSvg(item) : item.svg.replace(/\{\{(lamp|jewel)(\d)\}\}/g, (_: string, kind: string, tube: string) => (Number(tube) === lamp ? (kind === "lamp" ? ` data-on=""` : "") : "")).replace(/data-od-jewel="(\d)"/g, (m: string, tube: string) => (Number(tube) === lamp ? `${m} data-on=""` : m));
    return (index === slot ? `<g class="od-carriage" data-od="carriage">${CARRIAGE}</g>` : "") + own;
  }).join("");
  const mask = `<mask id="${MASK_ID}" maskUnits="userSpaceOnUse" x="0" y="0" width="${WIDTH}" height="${HEIGHT}"><rect width="${WIDTH}" height="${HEIGHT}" fill="#fff"/><path fill="#000" d="${MASK_BLACK.join("")}"/><path fill="#fff" d="${MASK_WHITE.join("")}"/></mask><clipPath id="od-stem-clip"><path d="${STEM_CLIP}"/></clipPath>`;
  const capsule = `<g mask="url(#${MASK_ID})"><g data-od="capsule">${CAPSULE}<g data-od="seal">${SEAL}</g></g></g>`;
  const late = `${capsule}<g class="od-glass-front">${GLASS_FRONT.join("")}</g><g data-od="plunger">${PLUNGER}</g>${MOVING.head.svg}<g clip-path="url(#od-stem-clip)"><g data-od="knob">${KNOB}</g></g>`;
  return `<svg class="iso-svg od-svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${label.replace(/"/g, "&quot;")}" focusable="false"><defs>${mask}</defs>${HALO}${sorted}${late}</svg>`;
}

export { MASK_ID, KS, V };
