/**
 * Every static path of the credit meter, computed once at module load with
 * the vendored anatomy kit, plus the numbers the client controller needs to
 * move the live parts. Server-only: the page receives finished SVG strings.
 *
 * Every drawn item records its true shape in an audit recorder; A.settle
 * measures depth wherever two items overlap and sets the painter's keys, and
 * the verification build runs the full audit on the same recorder.
 */
import * as k from "../../iso/iso-kit";
import type { Flat, Plan, Plane, Point3, SolidPaths } from "../../iso/iso-kit";
import * as Gm from "../../iso/lathe.mjs";
import * as Tm from "../../iso/tube.mjs";
import * as Am from "../../iso/audit.mjs";
import { leverAt, leverRings, type LeverSpec } from "./lever";
import { FULL_CONVERSATIONS, FULL_MINUTES, FULL_SCALE, PER_CONVERSATION, PER_MINUTE, READINGS, shareOf } from "./model";
import {
  AZIMUTH,
  CALL_R,
  CALL_X,
  FOOT_H,
  FRONT,
  GAUGE,
  GAUGE_R,
  GAUGE_Z,
  HEIGHT,
  KNOB,
  KNOB_H,
  KNOB_R,
  LEVEL_FROM,
  LEVEL_SPAN,
  LID_H,
  LINE_Y,
  LINE_Z,
  MAIN_R,
  NECK,
  P,
  PLATE,
  PLATE_H,
  RISER_R,
  SIDE,
  SWITCH,
  SWITCH_H,
  TANK,
  TANK_TOP,
  TANK_Z,
  TEE_R,
  TEE_X,
  TEXT_R,
  TEXT_Y,
  VALVE,
  VALVE_R,
  WIDTH,
  at,
} from "./view";

/* The kit's .mjs modules carry no type declarations; they are used through
   these loose handles, exactly as the kit's own examples use them. */
const G = Gm as any;
const T = Tm as any;
const A = Am as any;

const RAD = Math.PI / 180;
const V: Point3 = G.viewOf(P);
const KS: number = G.scaleOf(P);
const N: Point3 = [Math.cos(AZIMUTH * RAD), Math.sin(AZIMUTH * RAD), 0];
const U: Point3 = [Math.sin(AZIMUTH * RAD), -Math.cos(AZIMUTH * RAD), 0];
const UP: Point3 = [0, 0, 1];
const DOWN: Point3 = [0, 0, -1];
const X: Point3 = [1, 0, 0];
const Y: Point3 = [0, 1, 0];

const f2 = (value: number) => Math.round(value * 100) / 100;
const f3 = (value: number) => Math.round(value * 1000) / 1000;
type Style = any;
const S = (paths: SolidPaths, style: Style = {}) => k.solidSvg(paths, style);
const L = (d: string, style: Style = {}) => k.lineSvg(d, style);
const D = (points: Array<Flat | [number, number, number]>, style: Style = {}) => k.dotsSvg(points, style);
const path3 = (points: Point3[], closed = false) => k.pathOf(points.map(at), closed);
const add = (a: Point3, b: Point3): Point3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: Point3, s: number): Point3 => [a[0] * s, a[1] * s, a[2] * s];

function planeMatrix(o: Point3, ex: Point3, ey: Point3) {
  const p0 = at(o);
  const px = at(add(o, ex));
  const py = at(add(o, ey));
  return `matrix(${f3(px[0] - p0[0])} ${f3(px[1] - p0[1])} ${f3(py[0] - p0[0])} ${f3(py[1] - p0[1])} ${f2(p0[0])} ${f2(p0[1])})`;
}

const hexagon = (r: number, phase = 30): Plane[] => Array.from({ length: 6 }, (_, i) => [r * Math.cos((phase + i * 60) * RAD), r * Math.sin((phase + i * 60) * RAD)] as Plane);

/* ------------------------------------------------------------------ */
/* Recorder and drawing helpers                                        */
/* ------------------------------------------------------------------ */

const R = A.recorder(P);
const record = (shape: unknown) => R.solid(shape);

/** The assembly the next parts belong to: parts of one assembly may sit in each other (a neck in its valve body). */
let OWNER: string | undefined;
function assembly(name: string, build: () => void) {
  const was = OWNER;
  OWNER = name;
  build();
  OWNER = was;
}

function put(name: string, ref: Point3, svg: string, shapes: unknown[], options: { bias?: number; attrs?: string } = {}) {
  return R.put({ name, at: ref, bias: options.bias ?? 0, svg, shapes, piece: "meter", attrs: options.attrs ?? "" });
}

function slab(name: string, plan: Plan, z: number, h: number, style: Style = {}, { steps = 4, bevel = 0, extra = "", inner = "", bias = 0, owner }: { steps?: number; bevel?: number; extra?: string; inner?: string; bias?: number; owner?: string } = {}) {
  const shape = record(A.slab(plan, z, h, { name, owner: owner ?? OWNER }, steps));
  put(name, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], S(k.slabOf(plan, z, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias });
  return shape;
}

function post(name: string, cx: number, cy: number, r: number, z: number, h: number, style: Style = {}, { extra = "", inner = "", bias = 0, steps = 24, bevel = 0, owner }: { extra?: string; inner?: string; bias?: number; steps?: number; bevel?: number; owner?: string } = {}) {
  const shape = record(A.cylinder(cx, cy, r, z, h, { name, owner: owner ?? OWNER }));
  put(name, [cx, cy, z + h / 2], S(k.cylinder(cx, cy, r, z, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias });
  return shape;
}

function disc(name: string, F: any, s0: number, s1: number, r: number, style: Style = {}, { extra = "", inner = "", bias = 0, owner, bevel = 0 }: { extra?: string; inner?: string; bias?: number; owner?: string; bevel?: number } = {}) {
  const shape = record(A.disc(F, s0, s1, r, { name, owner: owner ?? OWNER }));
  const steps = Math.max(14, Math.min(72, Math.round(r * 3.4)));
  put(name, add(F.o, mul(F.a, (s0 + s1) / 2)), S(G.disc(s0, s1, r, F, P, { bevel, steps }), { tone: "mid", ...style, inner }) + extra, [shape], { bias });
  return shape;
}

function hex(name: string, F: any, s0: number, s1: number, r: number, style: Style = {}, { extra = "", bias = 0, owner }: { extra?: string; bias?: number; owner?: string } = {}) {
  const polygon = hexagon(r);
  const shape = record(A.prism(F, polygon, s0, s1, { name, owner: owner ?? OWNER }));
  put(name, add(F.o, mul(F.a, (s0 + s1) / 2)), S(G.prismOf(F, polygon, s0, s1, P), { tone: "mid", ...style }) + extra, [shape], { bias });
  return shape;
}

function ball(name: string, c: Point3, r: number, style: Style = {}, { extra = "", bias = 0, owner }: { extra?: string; bias?: number; owner?: string } = {}) {
  const shape = record(A.ball(c, r, { name, owner: owner ?? OWNER }));
  put(name, c, S(G.sphereOf(c, r, P, { steps: r > 6 ? 40 : r > 3 ? 28 : 20 }), { tone: "mid", ...style }) + extra, [shape], { bias });
  return shape;
}

/** A pipe: filleted route, gapped where a fitting wraps it, drawn as depth-sorted chunks. */
function pipe(name: string, points: Point3[], r: number, { bend = 2.6, gaps = [] as [number, number][], tone = "mid", maxLength = 14, bias = 0 } = {}) {
  const route: Point3[] = G.fillet(points, Math.max(3, r * bend), 10, { P, tube: r });
  R.route(name, route, r, { gaps, piece: "meter" });
  const pieces = T.tubePieces(route, r, P, { maxLength, gaps });
  pieces.forEach((piece: any, index: number) => put(`${name}:${index}`, piece.mid, T.tubeSvg(piece, { tone }), [A.tube(piece.points, piece.radii)], { bias, attrs: ` data-route="${name}"` }));
  return route;
}

/* ------------------------------------------------------------------ */
/* The bench: plate, feet, groove, screws, label plate (static, back)  */
/* ------------------------------------------------------------------ */

const back: string[] = [];
back.push(`<path class="iso-halo" d="${k.haloOf(PLATE, -PLATE_H - FOOT_H, PLATE_H, P)}"/>`);
const byDepth = (points: Plane[]) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
for (const [x, y] of byDepth(k.corners(PLATE, 22))) {
  back.push(S(k.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, P, 20), { tone: "lo" }));
  back.push(S(k.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, P, 20), { tone: "mid" }));
  record(A.cylinder(x, y, 7, -PLATE_H - FOOT_H, 1.6, { name: "stand.foot", ground: true }));
  record(A.cylinder(x, y, 5.4, -PLATE_H - FOOT_H + 1.6, FOOT_H - 1.6, { name: "stand.foot.post", ground: true }));
}
back.push(S(k.slabOf(PLATE, -PLATE_H, PLATE_H, P, 8, 1.6), { tone: "mid", inner: L(k.sideSeam(PLATE, -4, P, 8), { tone: "faint" }) }));
record(A.slab(PLATE, -PLATE_H, PLATE_H, { name: "stand.plate", ground: true }, 8));
back.push(L(k.planOutline(k.insetPlan(PLATE, 5), 0, P), { tone: "lo" }));
const PLATE_SCREWS = k.corners(PLATE, 10);
back.push(L(PLATE_SCREWS.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
back.push(D(PLATE_SCREWS.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));

const LABEL: Plan = { x: 54, y: 42, w: 50, d: 12, r: 1.2 };
back.push(S(k.slabOf(LABEL, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
back.push(L(k.planOutline(k.insetPlan(LABEL, 1.6), 0.8, P, 3), { tone: "faint" }));
back.push(L([34, 26, 30].map((w, i) => k.lineOnTop([LABEL.x + 6, LABEL.y + 3.4 + i * 2.6], [LABEL.x + 6 + w, LABEL.y + 3.4 + i * 2.6], 0.8, P)).join(""), { tone: "lo", free: true }));
back.push(D([at([LABEL.x + 3, LABEL.y + LABEL.d / 2, 0.8]), at([LABEL.x + LABEL.w - 3, LABEL.y + LABEL.d / 2, 0.8])], { size: 0.45 }));
record(A.slab(LABEL, 0, 0.8, { name: "stand.label" }, 3));

/* ------------------------------------------------------------------ */
/* The tank                                                            */
/* ------------------------------------------------------------------ */

const TANK_CX = TANK.x + TANK.w / 2;
const TANK_CY = TANK.y + TANK.d / 2;
const PLINTH = k.insetPlan(TANK, -3);
back.push(`<path class="iso-halo" d="${k.haloOf(PLINTH, 0, 6, P)}"/>`);
slab("tank.plinth", PLINTH, 0, TANK_Z, { tone: "lo" }, {
  steps: 6,
  bevel: 0.6,
  extra: D(k.corners(PLINTH, 3.2).map(([x, y]) => at([x, y, TANK_Z])), { size: 0.5 }),
});
const SEAMS = [30, 76].map((z) => L(k.sideSeam(TANK, z, P, 6), { tone: "faint" })).join("");
slab("tank.body", TANK, TANK_Z, TANK_TOP - TANK_Z, { tone: "mid" }, { steps: 6, bevel: 1.2, inner: SEAMS });
const LID = k.insetPlan(TANK, -1.4);
const LID_BOLTS: Point3[] = [];
for (const x of [LID.x + 4, LID.x + LID.w / 2, LID.x + LID.w - 4]) LID_BOLTS.push([x, LID.y + 3.2, TANK_TOP + LID_H], [x, LID.y + LID.d - 3.2, TANK_TOP + LID_H]);
for (const y of [LID.y + LID.d / 2]) LID_BOLTS.push([LID.x + 3.2, y, TANK_TOP + LID_H], [LID.x + LID.w - 3.2, y, TANK_TOP + LID_H]);
slab("tank.lid", LID, TANK_TOP, LID_H, { tone: "mid" }, {
  steps: 6,
  bevel: 0.8,
  extra: D(LID_BOLTS.map(at), { size: 0.5 }) + L(k.planOutline(k.insetPlan(LID, 6), TANK_TOP + LID_H, P, 4), { tone: "faint" }),
});
const LID_TOP = TANK_TOP + LID_H;
post("tank.neck", TANK_CX, TANK_CY, 6, LID_TOP, 3, { tone: "mid" }, { steps: 28 });
post("tank.cap", TANK_CX, TANK_CY, 7.6, LID_TOP + 3, 4.6, { tone: "mid" }, { steps: 32, bevel: 0.5, extra: L(k.knurl(TANK_CX, TANK_CY, 7.6, LID_TOP + 3, LID_TOP + 7.6, 40, P), { tone: "lo" }) + L(k.ring(TANK_CX, TANK_CY, 3, LID_TOP + 7.6, P, 24), { tone: "lo" }) });
const VENT: Plane = [TANK.x + 10, TANK.y + 10];
post("tank.vent", VENT[0], VENT[1], 2, LID_TOP, 5, { tone: "mid" }, { steps: 16 });
post("tank.vent.cap", VENT[0], VENT[1], 3.4, LID_TOP + 5, 2.2, { tone: "mid" }, { steps: 18 });
/* Two lifting lugs on the lid, each a plate with an eye. */
for (const [name, lx] of [["tank.lug.left", TANK.x + 7], ["tank.lug.right", TANK.x + TANK.w - 9]] as const) {
  const lug: Plan = { x: lx, y: TANK_CY - 5, w: 2, d: 10, r: 0.6 };
  slab(name, lug, LID_TOP, 6.4, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: L(k.sideRing([lx + 2, TANK_CY, LID_TOP + 3.6], 1.6, "x", P, 20), { tone: "lo" }) });
}

/* Sight glass on the +y face: two fittings, a glass tube and the liquid column. */
const GLASS_X = TANK.x + 13;
const GLASS_Y = FRONT + 4.6;
const GLASS_R = 2.8;
const COLUMN_R = 2;
const FIT_LO = { z0: LEVEL_FROM - 7, z1: LEVEL_FROM - 1 };
const FIT_HI = { z0: LEVEL_FROM + LEVEL_SPAN + 1, z1: LEVEL_FROM + LEVEL_SPAN + 7 };
for (const [label, fit] of [["low", FIT_LO], ["high", FIT_HI]] as const) {
  const plan: Plan = { x: GLASS_X - 4.2, y: FRONT, w: 8.4, d: 8.6, r: 1.6 };
  slab(`glass.fit.${label}`, plan, fit.z0, fit.z1 - fit.z0, { tone: "mid" }, { steps: 3, bevel: 0.4, extra: D([at([GLASS_X, FRONT + 6.8, fit.z1])], { size: 0.5, tone: "mid" }) });
}
const GLASS_Z0 = FIT_LO.z1;
const GLASS_Z1 = FIT_HI.z0;
const glassPaths = k.cylinder(GLASS_X, GLASS_Y, GLASS_R, GLASS_Z0, GLASS_Z1 - GLASS_Z0, P, 28);
const columnBase = at([GLASS_X, GLASS_Y, 0]);
const COLUMN_W = COLUMN_R * KS;
const liquidAt = (share: number) => LEVEL_FROM + LEVEL_SPAN * share;
const meniscus = k.pathOf(k.circleRing(GLASS_X, GLASS_Y, COLUMN_R, 24).map(([x, y]) => at([x, y, 0])), true);
const zToY = (z: number) => f2(columnBase[1] - z * KS * Math.cos(30 * RAD));
const REST_SHARE = shareOf(READINGS[1]!.credits);
const restLevel = liquidAt(REST_SHARE);
const glassHighlight = path3([[GLASS_X + GLASS_R * Math.cos(130 * RAD), GLASS_Y + GLASS_R * Math.sin(130 * RAD), GLASS_Z0], [GLASS_X + GLASS_R * Math.cos(130 * RAD), GLASS_Y + GLASS_R * Math.sin(130 * RAD), GLASS_Z1]]);
const columnSvg = [
  `<path class="cm-glass" d="${glassPaths.fill}"/>`,
  `<rect class="cm-liquid" data-part="column" x="${f2(columnBase[0] - COLUMN_W)}" width="${f2(COLUMN_W * 2)}" y="${zToY(restLevel)}" height="${f2(zToY(GLASS_Z0) - zToY(restLevel))}"/>`,
  `<g data-part="meniscus" transform="${k.translateAlong(P, [0, 0, restLevel])}"><path class="cm-liquid-top" d="${meniscus}"/></g>`,
  L(glassHighlight, { tone: "hi", className: "cm-glint" }),
  `<path class="iso-line iso-edge" data-tone="mid" d="${glassPaths.outline}"/>`,
].join("");
put("glass.tube", [GLASS_X, GLASS_Y, (GLASS_Z0 + GLASS_Z1) / 2], `<g class="cm-sight">${columnSvg}</g>`, [record(A.cylinder(GLASS_X, GLASS_Y, GLASS_R, GLASS_Z0, GLASS_Z1 - GLASS_Z0, { name: "glass.tube" }))]);
/* Guard rods either side of the glass, between the two fittings. */
for (const side of [-1, 1]) {
  const gx = GLASS_X + side * 3.6;
  const gy = FRONT + 7.6;
  post(`glass.guard${side < 0 ? "L" : "R"}`, gx, gy, 0.6, GLASS_Z0, GLASS_Z1 - GLASS_Z0, { tone: "mid" }, { steps: 12 });
}

/* Level scale: a strip on the tank face, ticks rooted on its left edge. */
const STRIP: Plan = { x: GLASS_X + 6.4, y: FRONT, w: 5.2, d: 0.8, r: 0.3 };
const STRIP_Y = FRONT + 0.8;
const stripTicks = { minor: [] as string[], major: [] as string[] };
for (let credits = 0; credits <= FULL_SCALE; credits += 2_500) {
  const z = liquidAt(credits / FULL_SCALE);
  const big = credits % 10_000 === 0;
  (big ? stripTicks.major : stripTicks.minor).push(path3([[STRIP.x, STRIP_Y, z], [STRIP.x + (big ? 3.4 : 1.8), STRIP_Y, z]]));
}
slab("tank.strip", STRIP, LEVEL_FROM - 1.2, LEVEL_SPAN + 2.4, { tone: "lo", crease: "none" }, {
  steps: 2,
  extra: L(path3([[STRIP.x, STRIP_Y, LEVEL_FROM - 1.2], [STRIP.x, STRIP_Y, LEVEL_FROM + LEVEL_SPAN + 1.2]]), { tone: "lo" }) + L(stripTicks.minor.join(""), { tone: "lo" }) + L(stripTicks.major.join(""), { tone: "mid" }),
});

/* Name plate on the tank face, with the one engraved label. */
const NAME = { x0: TANK.x + 26, x1: TANK.x + 60, z0: 54, z1: 70 };
const NAME_PLAN: Plan = { x: NAME.x0, y: FRONT, w: NAME.x1 - NAME.x0, d: 0.8, r: 0.4 };
const NAME_FACE = FRONT + 0.8;
const nameMatrix = k.sideMatrix([0, NAME_FACE], 0, P, "left");
slab("tank.nameplate", NAME_PLAN, NAME.z0, NAME.z1 - NAME.z0, { tone: "lo", crease: "none" }, {
  steps: 2,
  extra:
    `<g transform="${nameMatrix}">` +
    `<path class="iso-line" data-tone="faint" d="M${NAME.x0 + 1.4} ${-(NAME.z1 - 1.4)}H${NAME.x1 - 1.4}V${-(NAME.z0 + 1.4)}H${NAME.x0 + 1.4}Z"/>` +
    `<g data-part="label"></g>` +
    `<path class="iso-line" data-tone="lo" data-free="" d="M${NAME.x0 + 5} ${-(NAME.z0 + 5.4)}H${NAME.x1 - 9}M${NAME.x0 + 5} ${-(NAME.z0 + 3.6)}H${NAME.x1 - 13}"/>` +
    `</g>` +
    D([at([NAME.x0 + 2.6, NAME_FACE, NAME.z1 - 2.6]), at([NAME.x1 - 2.6, NAME_FACE, NAME.z1 - 2.6]), at([NAME.x0 + 2.6, NAME_FACE, NAME.z0 + 2.6]), at([NAME.x1 - 2.6, NAME_FACE, NAME.z0 + 2.6])], { size: 0.45 }),
});
export const LABEL_SPOT = { transform: nameMatrix, x: (NAME.x0 + NAME.x1) / 2, y: -(NAME.z1 - 6.4), size: 3.4 };

/* Outlet boss and flange on the tank's +x face. */
/* Drain on the front face, low and to the right of the sight glass. */
const DRAIN = G.frameOf([TANK.x + TANK.w - 14, FRONT, 12], Y, X, UP);
assembly("tank.drain", () => {
  disc("tank.drain.boss", DRAIN, 0, 1.8, 4.6, { tone: "mid" });
  hex("tank.drain.plug", DRAIN, 1.8, 4.2, 3.4, { tone: "mid" }, { extra: D([G.pointOf(DRAIN, 4.2, 0, 0)].map(at), { size: 0.5, tone: "hi" }) });
});
const BOSS = G.frameOf([SIDE, LINE_Y, LINE_Z], X, Y, UP);
disc("tank.boss", BOSS, 0, 2.4, 8.6, { tone: "mid" });
disc("tank.flange", BOSS, 2.4, 4.6, 7.8, { tone: "mid" }, { bevel: 0.3, extra: D(G.dotsOf(BOSS, 4.6, 6.2, 6, P, { all: true, phase: Math.PI / 6 }), { size: 0.5, tone: "mid" }) });

/* ------------------------------------------------------------------ */
/* Main line, tee, riser and the gauge                                 */
/* ------------------------------------------------------------------ */

const MAIN_FROM = SIDE + 4.6;
const MAIN_TO = VALVE[0] - NECK;
const TEE: Point3 = [TEE_X, LINE_Y, LINE_Z];
const teeHalf = Math.sqrt(TEE_R * TEE_R - MAIN_R * MAIN_R);
pipe("line.main", [[MAIN_FROM, LINE_Y, LINE_Z], [MAIN_TO, LINE_Y, LINE_Z]], MAIN_R, { gaps: [[TEE_X - teeHalf - MAIN_FROM, TEE_X + teeHalf - MAIN_FROM]], maxLength: 26 });

/** A pipe support: a post on the bench, a cradle under the line and a strap over it (the line is gapped at the strap). */
const STRAP_W = 1.8;
function support(line: string, x: number, r: number) {
  assembly(line, () => {
    const CRADLE_TOP = LINE_Z - r;
    const cradle: Plan = { x: x - 3.4, y: LINE_Y - 5, w: 6.8, d: 10, r: 1 };
    post(`${line}.support.foot`, x, LINE_Y, 4.4, 0, 1.4, { tone: "lo" }, { steps: 24, extra: D([[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy]) => at([x + dx * 3.2, LINE_Y + dy * 3.2, 1.4])), { size: 0.45 }) });
    post(`${line}.support.post`, x, LINE_Y, 1.8, 1.4, CRADLE_TOP - 2.2 - 1.4, { tone: "mid" }, { steps: 16 });
    slab(`${line}.support.cradle`, cradle, CRADLE_TOP - 2.2, 2.2, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: D([at([x, cradle.y + 1.4, CRADLE_TOP]), at([x, cradle.y + cradle.d - 1.4, CRADLE_TOP])], { size: 0.45, tone: "mid" }) });
    const SF = G.frameOf([x, LINE_Y, LINE_Z], X, Y, UP);
    const strap = G.ringBand(-STRAP_W / 2, STRAP_W / 2, r, r + 0.7, SF, P, { steps: 40 });
    put(`${line}.support.strap`, [x, LINE_Y, LINE_Z], S(strap, { tone: "mid" }), [record(A.ring(SF, -STRAP_W / 2, STRAP_W / 2, r, r + 0.7, { name: `${line}.support.strap`, owner: line }))]);
  });
}
ball("line.tee", TEE, TEE_R, { tone: "mid" }, { owner: "line.main" });

const CASE_S0 = -6;
const FACE_S = 3;
const BEZEL_S = FACE_S + 2.6;
const GF = G.frameOf(GAUGE, N, U, UP);
const BOSS_R = 3.6;
const CASE_BOTTOM = GAUGE_Z - GAUGE_R;
const BOSS_Z0 = CASE_BOTTOM - 4.4;
const NUT_Z0 = BOSS_Z0 - 4.2;
const COCK_Z = LINE_Z + 20;
const COCK_R = 4.4;
const riserFrom = LINE_Z + Math.sqrt(TEE_R * TEE_R - RISER_R * RISER_R);
const cockHalf = Math.sqrt(COCK_R * COCK_R - RISER_R * RISER_R);
pipe("line.riser", [[TEE_X, LINE_Y, riserFrom], [TEE_X, LINE_Y, NUT_Z0]], RISER_R, { gaps: [[COCK_Z - cockHalf - riserFrom, COCK_Z + cockHalf - riserFrom]], maxLength: 30 });
assembly("line.riser", () => {
ball("riser.cock", [TEE_X, LINE_Y, COCK_Z], COCK_R, { tone: "mid" });
  const CF = G.frameOf([TEE_X, LINE_Y, COCK_Z], U, N, UP);
  const s0 = Math.sqrt(COCK_R * COCK_R - 1.3 * 1.3);
  disc("riser.cock.stem", CF, s0 - 0.2, COCK_R + 2.6, 1.3, { tone: "mid" });
  const knob = add([TEE_X, LINE_Y, COCK_Z], mul(U, COCK_R + 2.6 + 1.8));
  ball("riser.cock.knob", knob, 2, { tone: "hi" });
});
const NUT_F = G.frameOf([TEE_X, LINE_Y, 0], UP, X, Y);
OWNER = "gauge";
hex("riser.nut", NUT_F, NUT_Z0, BOSS_Z0, 4.6, { tone: "mid" });
post("gauge.socket", TEE_X, LINE_Y, BOSS_R, BOSS_Z0, CASE_BOTTOM - BOSS_Z0 + 0.2, { tone: "mid" }, { steps: 28 });

/* Gauge case: a drum on its axis toward the viewer, a seam, the back screws. */
disc("gauge.case", GF, CASE_S0, FACE_S, GAUGE_R, { tone: "mid" }, { inner: L(G.arcOf(GF, -1.6, GAUGE_R, P), { tone: "faint" }) });

/* Gauge face, in its own plane. Face coordinates: u to the right, y down. */
const FACE_O = add(GAUGE, mul(N, FACE_S));
const faceMatrix = planeMatrix(FACE_O, U, DOWN);
const R_IN = GAUGE_R - 3.4;
const SWEEP = 135;
const angleOf = (share: number) => -SWEEP + share * SWEEP * 2;
const polar = (r: number, deg: number): Flat => [f2(r * Math.sin(deg * RAD)), f2(-r * Math.cos(deg * RAD))];
const arcPath = (r: number, from: number, to: number, steps = 64) => k.pathOf(Array.from({ length: steps + 1 }, (_, i) => polar(r, from + ((to - from) * i) / steps)));

const OUTER_RING = 23.2;
const INNER_RING = 15.6;
function scale(ring: number, full: number, minorEvery: number, majorEvery: number, inward: boolean) {
  const minor: string[] = [];
  const major: string[] = [];
  for (let value = 0; value <= full + 1e-9; value += minorEvery) {
    const deg = angleOf(value / full);
    const big = Math.abs(value / majorEvery - Math.round(value / majorEvery)) < 1e-9;
    const length = big ? 2.8 : 1.5;
    const tip = inward ? ring - length : ring + length;
    (big ? major : minor).push(k.pathOf([polar(ring, deg), polar(tip, deg)]));
  }
  return { minor: minor.join(""), major: major.join(""), ring: arcPath(ring, -SWEEP, SWEEP) };
}
const MINUTES = scale(OUTER_RING, FULL_MINUTES, 250, 1_000, true);
const CONVERSATIONS = scale(INNER_RING, FULL_CONVERSATIONS, 1_000, 5_000, false);

/* Plan marks: a small dot on each ring at each plan's pool. */
const planDots = (ring: number) => READINGS.map((reading) => polar(ring, angleOf(shareOf(reading.credits))));

/* The drum counter: five drums in a window below the hub. */
const DRUMS = 5;
const DRUM_W = 3.5;
const DRUM_H = 5.6;
const DRUM_Y = 8.4;
const DRUM_X0 = -(DRUMS * DRUM_W) / 2;
const DIGIT = 4.4;
const drumClip = "cm-drum-clip";
const faceClip = "cm-face-clip";
const START_DIGITS = String(READINGS[1]!.minutes).padStart(DRUMS, "0").split("").map(Number);
const drums = Array.from({ length: DRUMS }, (_, i) => {
  const x = DRUM_X0 + (i + 0.5) * DRUM_W;
  const digits = Array.from({ length: 11 }, (_, d) => `<text x="${f2(x)}" y="${f2(DRUM_Y + DRUM_H / 2 + DIGIT * 0.36 + d * DRUM_H)}">${d % 10}</text>`).join("");
  return `<g class="cm-digit" data-part="drum" data-drum="${i}" transform="translate(0 ${f2(-START_DIGITS[i]! * DRUM_H)})">${digits}</g>`;
}).join("");
const drumFrame = `M${f2(DRUM_X0)} ${DRUM_Y}H${f2(-DRUM_X0)}V${f2(DRUM_Y + DRUM_H)}H${f2(DRUM_X0)}Z`;
const drumBezel = `M${f2(DRUM_X0 - 1)} ${DRUM_Y - 1}H${f2(-DRUM_X0 + 1)}V${f2(DRUM_Y + DRUM_H + 1)}H${f2(DRUM_X0 - 1)}Z`;
const drumSplits = Array.from({ length: DRUMS - 1 }, (_, i) => `M${f2(DRUM_X0 + (i + 1) * DRUM_W)} ${DRUM_Y}V${f2(DRUM_Y + DRUM_H)}`).join("");

const NEEDLE = `M0 -21.6L0.9 -2L1.7 0L1.1 4.6H-1.1L-1.7 0L-0.9 -2Z`;
const restAngle = angleOf(REST_SHARE);

const drumGrad =
  `<linearGradient id="cm-drum-grad" gradientUnits="userSpaceOnUse" x1="0" y1="${DRUM_Y}" x2="0" y2="${f2(DRUM_Y + DRUM_H)}">` +
  [[0, 0.75], [0.34, 0], [0.66, 0], [1, 0.75]].map(([at, alpha]) => `<stop offset="${at}" stop-opacity="${alpha}" style="stop-color:var(--cm-drum-edge)"/>`).join("") +
  `</linearGradient>`;
const faceSvg = [
  `<defs>${drumGrad}</defs>`,
  `<clipPath id="${faceClip}"><circle r="${R_IN}"/></clipPath>`,
  `<clipPath id="${drumClip}"><path d="${drumFrame}"/></clipPath>`,
  `<g clip-path="url(#${faceClip})">`,
  `<circle class="cm-dial" r="${R_IN + 0.5}"/>`,
  `<g class="cm-scale" data-scale="calls">`,
  L(MINUTES.ring, { tone: "lo" }),
  L(MINUTES.minor, { tone: "lo" }),
  L(MINUTES.major, { tone: "mid" }),
  L(`${k.pathOf([polar(OUTER_RING, -SWEEP), polar(OUTER_RING - 3.6, -SWEEP)])}`, { tone: "hi" }),
  D(planDots(OUTER_RING + 1.6), { size: 0.55, tone: "mid" }),
  `</g>`,
  `<g class="cm-scale" data-scale="text">`,
  L(CONVERSATIONS.ring, { tone: "lo" }),
  L(CONVERSATIONS.minor, { tone: "lo" }),
  L(CONVERSATIONS.major, { tone: "mid" }),
  L(`${k.pathOf([polar(INNER_RING, -SWEEP), polar(INNER_RING + 3.6, -SWEEP)])}`, { tone: "hi" }),
  D(planDots(INNER_RING - 1.6), { size: 0.55, tone: "mid" }),
  `</g>`,
  `<path class="cm-drum-bezel" d="${drumBezel}"/>`,
  `<path class="cm-drum-well" d="${drumFrame}"/>`,
  `<g clip-path="url(#${drumClip})"><g class="cm-drums">${drums}</g><path class="cm-drum-shade" d="${drumFrame}"/></g>`,
  L(drumSplits, { tone: "faint" }),
  L(drumFrame, { tone: "lo" }),
  L(drumBezel, { tone: "faint" }),
  `<g data-part="needle" transform="rotate(${f2(restAngle)})"><path class="cm-needle" d="${NEEDLE}"/></g>`,
  `<circle class="cm-hub" r="2.6"/>`,
  `<circle class="cm-hub-cap" r="1.1"/>`,
  `</g>`,
].join("");

const bezel = G.ringBand(FACE_S, BEZEL_S, R_IN, GAUGE_R + 0.8, GF, P, { hole: [BEZEL_S, R_IN], bevel: 0, steps: 72 });
const bezelScrews = G.dotsOf(GF, BEZEL_S, GAUGE_R - 1.4, 8, P, { all: true, phase: Math.PI / 8 });
const opening = G.circleOf(GF, BEZEL_S, R_IN, P, 96);
const glare = (() => {
  const outer = Array.from({ length: 13 }, (_, i) => G.pointOf(GF, BEZEL_S - 0.1, R_IN - 1.6, (110 + i * 5) * RAD));
  const inner = Array.from({ length: 13 }, (_, i) => G.pointOf(GF, BEZEL_S - 0.1, R_IN - 4.4, (170 - i * 5) * RAD));
  return path3([...outer, ...inner], true);
})();
const gaugeFront = [
  `<clipPath id="cm-opening"><path d="${opening}"/></clipPath>`,
  `<g clip-path="url(#cm-opening)"><g transform="${faceMatrix}">${faceSvg}</g></g>`,
  S(bezel, { tone: "hi", crease: "lo" }),
  D(bezelScrews, { size: 0.55, tone: "mid" }),
  `<path class="cm-glare" d="${glare}"/>`,
].join("");
put("gauge.front", add(GAUGE, mul(N, FACE_S)), gaugeFront, [record(A.ring(GF, FACE_S, BEZEL_S, R_IN, GAUGE_R + 0.8, { name: "gauge.bezel", owner: "gauge" })), record(A.disc(GF, FACE_S - 0.4, FACE_S, R_IN, { name: "gauge.dial", owner: "gauge" }))], { bias: 0.05 });
OWNER = undefined;

/* ------------------------------------------------------------------ */
/* The two-way valve                                                   */
/* ------------------------------------------------------------------ */

OWNER = "valve";
ball("valve.body", VALVE, VALVE_R, { tone: "hi", inner: L(G.arcOf(G.frameOf(VALVE, UP, X, Y), 0, VALVE_R, P), { tone: "faint" }) });
const NECK_IN = G.frameOf(VALVE, mul(X, -1), Y, UP);
const NECK_CALL = G.frameOf(VALVE, X, Y, UP);
const NECK_TEXT = G.frameOf(VALVE, Y, X, UP);
const neck = (name: string, F: unknown, r: number, nut: number) => {
  const s0 = Math.sqrt(VALVE_R * VALVE_R - r * r);
  disc(`${name}.neck`, F, s0 - 0.2, NECK - 3.2, r, { tone: "mid" });
  hex(`${name}.nut`, F, NECK - 3.2, NECK, nut, { tone: "mid" });
};
neck("valve.in", NECK_IN, 5.4, 6.6);
neck("valve.calls", NECK_CALL, 5.2, 6.4);
neck("valve.text", NECK_TEXT, 3.6, 4.6);

const STEM_R = 2.6;
const STEM_Z0 = VALVE[2] + Math.sqrt(VALVE_R * VALVE_R - STEM_R * STEM_R) - 0.2;
const GLAND_Z0 = VALVE[2] + VALVE_R + 1.6;
const GLAND_Z1 = GLAND_Z0 + 2.6;
post("valve.stem", VALVE[0], VALVE[1], STEM_R, STEM_Z0, GLAND_Z0 - STEM_Z0, { tone: "mid" }, { steps: 24 });
hex("valve.gland", G.frameOf([VALVE[0], VALVE[1], 0], UP, X, Y), GLAND_Z0, GLAND_Z1, 4.4, { tone: "mid" });
/* Two stop lugs on the gland, at the lever's two positions. */
for (const [name, deg] of [["valve.stop.calls", -28], ["valve.stop.text", 118]] as const) {
  const lx = VALVE[0] + 3.2 * Math.cos(deg * RAD);
  const ly = VALVE[1] + 3.2 * Math.sin(deg * RAD);
  post(name, lx, ly, 0.8, GLAND_Z1, 1.4, { tone: "lo" }, { steps: 12 });
}
const HUB_Z0 = GLAND_Z1;
const HUB_H = 2.2;
post("valve.hub", VALVE[0], VALVE[1], 2.6, HUB_Z0, HUB_H, { tone: "mid" }, { steps: 24 });

export const LEVER: LeverSpec = { at: [VALVE[0], VALVE[1]], z: HUB_Z0 + HUB_H, h: 1.6, back: 3.2, reach: 21, half: 1.7, grip: 12.5, gripHalf: 2.3, gripLift: 1.2 };
export const LEVER_ANGLE = { calls: 0, text: 90 };
const leverRest = leverAt(LEVER, LEVER_ANGLE.calls * RAD, P);
const leverRings0 = leverRings(LEVER, LEVER_ANGLE.calls * RAD);
const liveSolid = (part: string, paths: SolidPaths, tone: string) =>
  `<g class="iso-solid" data-part="${part}">` +
  `<path class="iso-fill" d="${paths.fill}"/>` +
  [0, 1, 2, 3].map((shade) => `<path class="iso-shade" data-shade="${shade}" d="${paths.shades[shade] ?? ""}"/>`).join("") +
  `<path class="iso-top" d="${paths.top}"/>` +
  `<path class="iso-line iso-crease" data-tone="faint" d="${paths.crease}"/>` +
  `<path class="iso-line iso-bevel" data-tone="faint" d="${paths.bevel ?? ""}"/>` +
  `<path class="iso-line iso-edge" data-tone="${tone}" d="${paths.outline}"/>` +
  `</g>`;
put("valve.lever", [VALVE[0] + 8, VALVE[1], LEVER.z + 1], `<g data-part="lever">${liveSolid("lever-plate", leverRest.plate, "mid")}${liveSolid("lever-grip", leverRest.grip, "hi")}</g>`, [
  record(A.extruded(leverRings0.plate, LEVER.z, LEVER.h, { name: "valve.lever", owner: "valve" })),
  record(A.extruded(leverRings0.grip, LEVER.z - LEVER.gripLift / 2, LEVER.h + LEVER.gripLift, { name: "valve.lever.grip", owner: "valve" })),
], { bias: 0.4 });
const PIVOT_Z = LEVER.z + LEVER.h;
post("valve.pivot", VALVE[0], VALVE[1], 1.9, PIVOT_Z, 1.3, { tone: "mid" }, { steps: 18, bias: 0.6, extra: D([at([VALVE[0], VALVE[1], PIVOT_Z + 1.3])], { size: 0.5, tone: "hi" }) });
OWNER = undefined;

/* ------------------------------------------------------------------ */
/* The two outlets, each with a flow indicator and a floor flange      */
/* ------------------------------------------------------------------ */

const FLANGE_H = 2.2;
interface Outlet {
  name: "calls" | "text";
  r: number;
  start: Point3;
  corner: Point3;
  foot: Plane;
  body: Plan;
  bodyZ: [number, number];
  window: number;
  flange: number;
  support?: number;
}
const OUTLETS: Outlet[] = [
  { name: "calls", r: CALL_R, start: [VALVE[0] + NECK, LINE_Y, LINE_Z], corner: [CALL_X, LINE_Y, LINE_Z], foot: [CALL_X, LINE_Y], body: { x: CALL_X - 7.5, y: LINE_Y - 7.5, w: 15, d: 15, r: 2.4 }, bodyZ: [7, 20], window: 4.6, flange: 8, support: 68 },
  { name: "text", r: TEXT_R, start: [VALVE[0], LINE_Y + NECK, LINE_Z], corner: [VALVE[0], TEXT_Y, LINE_Z], foot: [VALVE[0], TEXT_Y], body: { x: VALVE[0] - 6, y: TEXT_Y - 6, w: 12, d: 12, r: 2 }, bodyZ: [7, 18], window: 3.6, flange: 6 },
];

for (const outlet of OUTLETS) {
  const [fx, fy] = outlet.foot;
  const end: Point3 = [fx, fy, FLANGE_H];
  const points = [outlet.start, outlet.corner, end];
  const route: Point3[] = G.fillet(points, Math.max(3, outlet.r * 2.6), 10, { P, tube: outlet.r });
  const total: number = G.pathLength(route);
  const [b0, b1] = outlet.bodyZ;
  const NUT_H = 2.2;
  const gap: [number, number] = [total - (b1 + NUT_H - FLANGE_H), total - (b0 - NUT_H - FLANGE_H)];
  const gaps: [number, number][] = [gap];
  if (outlet.support !== undefined) gaps.unshift([outlet.support - STRAP_W / 2 - outlet.start[0], outlet.support + STRAP_W / 2 - outlet.start[0]]);
  pipe(`line.${outlet.name}`, points, outlet.r, { gaps, maxLength: 16 });
  if (outlet.support !== undefined) support(`line.${outlet.name}`, outlet.support, outlet.r);

  /* Flow indicator: a block on the drop with a round window on its +y face. */
  const faceY = outlet.body.y + outlet.body.d;
  const cz = (b0 + b1) / 2;
  const sideM = k.sideMatrix([0, faceY], 0, P, "left");
  const w = outlet.window;
  const blades = [0, 120, 240].map((deg) => `<path class="cm-blade" d="M0 0L${f2(w * 0.86 * Math.cos(deg * RAD) - 0.7 * Math.sin(deg * RAD))} ${f2(w * 0.86 * Math.sin(deg * RAD) + 0.7 * Math.cos(deg * RAD))}L${f2(w * 0.86 * Math.cos(deg * RAD) + 0.7 * Math.sin(deg * RAD))} ${f2(w * 0.86 * Math.sin(deg * RAD) - 0.7 * Math.cos(deg * RAD))}Z"/>`).join("");
  const id = `cm-window-${outlet.name}`;
  const windowSvg =
    `<g transform="${sideM}">` +
    `<clipPath id="${id}"><circle cx="${fx}" cy="${-cz}" r="${w}"/></clipPath>` +
    `<circle class="cm-window-ring" cx="${fx}" cy="${-cz}" r="${f2(w + 1.4)}"/>` +
    `<circle class="cm-window" cx="${fx}" cy="${-cz}" r="${w}"/>` +
    `<g clip-path="url(#${id})"><g transform="translate(${fx} ${-cz})"><g data-part="rotor" data-outlet="${outlet.name}">${blades}<circle class="cm-rotor-hub" r="0.9"/></g></g></g>` +
    `<circle class="iso-line" data-tone="lo" cx="${fx}" cy="${-cz}" r="${w}"/>` +
    `<circle class="iso-line" data-tone="faint" cx="${fx}" cy="${-cz}" r="${f2(w + 1.4)}"/>` +
    `</g>` +
    D([[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([dx, dz]) => at([fx + dx * (w + 1.6) * 0.86, faceY, cz + dz * (w + 1.6) * 0.86])), { size: 0.45, tone: "mid" });
  slab(`flow.${outlet.name}`, outlet.body, b0, b1 - b0, { tone: "mid" }, { owner: `line.${outlet.name}`, steps: 4, bevel: 0.6, extra: windowSvg, inner: L(k.sideSeam(outlet.body, b1 - 3, P, 4), { tone: "faint" }) });
  const ZF = G.frameOf([fx, fy, 0], UP, X, Y);
  hex(`flow.${outlet.name}.nut.top`, ZF, b1, b1 + NUT_H, outlet.r + 1.9, { tone: "mid" }, { owner: `line.${outlet.name}` });
  hex(`flow.${outlet.name}.nut.bottom`, ZF, b0 - NUT_H, b0, outlet.r + 1.9, { tone: "mid" }, { owner: `line.${outlet.name}` });

  /* Floor flange where the line goes into the bench. */
  post(`foot.${outlet.name}`, fx, fy, outlet.flange, 0, FLANGE_H, { tone: "mid" }, {
    steps: 28,
    bevel: 0.3,
    extra: D([45, 135, 225, 315].map((deg) => at([fx + (outlet.flange - 1.8) * Math.cos(deg * RAD), fy + (outlet.flange - 1.8) * Math.sin(deg * RAD), FLANGE_H])), { size: 0.5, tone: "mid" }),
  });
}

/* ------------------------------------------------------------------ */
/* The plan selector                                                   */
/* ------------------------------------------------------------------ */

back.push(`<path class="iso-halo" d="${k.haloOf(SWITCH, 0, 4, P)}"/>`);
const [KX, KY] = KNOB;
const DIAL_PLATE_R = 11.6;
const DETENTS = [20, 58, 96];
const detentTicks = DETENTS.map((deg) => k.lineOnTop([KX + (DIAL_PLATE_R - 2.4) * Math.cos(deg * RAD), KY + (DIAL_PLATE_R - 2.4) * Math.sin(deg * RAD)], [KX + DIAL_PLATE_R * Math.cos(deg * RAD), KY + DIAL_PLATE_R * Math.sin(deg * RAD)], SWITCH_H + 0.6, P)).join("");
const pips = DETENTS.flatMap((deg, index) =>
  Array.from({ length: index + 1 }, (_, j) => {
    const spread = (j - index / 2) * 5.4;
    const a = (deg + spread) * RAD;
    return at([KX + (DIAL_PLATE_R + 2.2) * Math.cos(a), KY + (DIAL_PLATE_R + 2.2) * Math.sin(a), SWITCH_H]);
  }),
);
slab("switch.block", SWITCH, 0, SWITCH_H, { tone: "mid" }, {
  steps: 4,
  bevel: 0.6,
  extra: D(k.corners(SWITCH, 3).map(([x, y]) => at([x, y, SWITCH_H])), { size: 0.45 }) + D(pips, { size: 0.55, tone: "hi" }),
});
post("switch.plate", KX, KY, DIAL_PLATE_R, SWITCH_H, 0.6, { tone: "lo" }, { steps: 32, extra: L(detentTicks, { tone: "mid" }) });
const KNOB_Z0 = SWITCH_H + 0.6;
const KNOB_TOP = KNOB_Z0 + KNOB_H;
const KNOB_MATRIX = k.topMatrix([KX, KY], KNOB_TOP, P, "x");
post("switch.knob", KX, KY, KNOB_R, KNOB_Z0, KNOB_H, { tone: "hi" }, {
  steps: 32,
  bevel: 0.4,
  extra:
    L(k.knurl(KX, KY, KNOB_R, KNOB_Z0, KNOB_TOP, 44, P), { tone: "lo" }) +
    `<g transform="${KNOB_MATRIX}"><g data-part="pointer" transform="rotate(${DETENTS[1]})">` +
    `<path class="iso-line" data-tone="hi" data-free="end" d="M1.6 0H${KNOB_R - 1.2}"/>` +
    `</g><circle class="cm-knob-dot" r="1.6"/></g>`,
});

/* A short cable from the switch to the tank's fill solenoid on the plinth. */
{
  const box: Plan = { x: KX - 4.5, y: TANK.y + TANK.d, w: 9, d: 3.4, r: 0.8 };
  const CABLE_Z = 5.6;
  slab("tank.solenoid", box, TANK_Z, 5.4, { tone: "mid" }, { steps: 2, bevel: 0.3, extra: D([at([box.x + 1.6, box.y + box.d, TANK_Z + 4.4]), at([box.x + box.w - 1.6, box.y + box.d, TANK_Z + 4.4])], { size: 0.4 }) });
  const GL = G.frameOf([KX, box.y + box.d, CABLE_Z], Y, X, UP);
  const GS = G.frameOf([KX, SWITCH.y, CABLE_Z], mul(Y, -1), X, UP);
  disc("tank.solenoid.gland", GL, 0, 1.6, 1.5, { tone: "mid" }, { owner: "tank.solenoid" });
  disc("switch.grommet", GS, 0, 1.4, 1.5, { tone: "mid" }, { owner: "switch.block" });
  pipe("cable.fill", [[KX, box.y + box.d + 1.6, CABLE_Z], [KX, SWITCH.y - 1.4, CABLE_Z]], 0.75, { tone: "mid", maxLength: 20 });
}

/* ------------------------------------------------------------------ */
/* Settle the painter's order from true depth, then serialise          */
/* ------------------------------------------------------------------ */

A.settle(R, P);
R.items.sort((a: any, b: any) => a.key - b.key);

export const RECORDER = R;
export const BACK = back.join("");
export const ITEMS: string[] = R.items.map((item: any) => `<g class="it" data-name="${item.name}"${item.attrs ?? ""}>${item.svg}</g>`);


/** Everything the client controller needs, all plain numbers and strings. */
export const METER = {
  width: WIDTH,
  height: HEIGHT,
  projection: P,
  lever: LEVER,
  leverAngle: LEVER_ANGLE,
  detents: DETENTS,
  sweep: SWEEP,
  shares: READINGS.map((reading) => shareOf(reading.credits)),
  counters: READINGS.map((reading) => ({ calls: reading.minutes, text: reading.conversations })),
  column: { base: f2(columnBase[1]), perZ: f2(KS * Math.cos(30 * RAD) * 1000) / 1000, from: LEVEL_FROM, span: LEVEL_SPAN, bottom: GLASS_Z0 },
  drum: { count: DRUMS, pitch: DRUM_H },
  perMinute: PER_MINUTE,
  perConversation: PER_CONVERSATION,
};

/** Where the two controls sit, as fractions of the viewBox, for the hit areas (r is a fraction of the width: about 32 px across at 390 px). */
const knobScreen = at([KX, KY, KNOB_TOP]);
const leverScreen = at([VALVE[0] + 9, VALVE[1] + 5, LEVER.z]);
export const HITS = {
  plan: { x: knobScreen[0] / WIDTH, y: knobScreen[1] / HEIGHT, r: 0.043 },
  valve: { x: leverScreen[0] / WIDTH, y: leverScreen[1] / HEIGHT, r: 0.043 },
};
