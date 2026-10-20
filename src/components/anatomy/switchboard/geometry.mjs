// The Najdi switchboard: every static path, built once with the anatomy kit.
// Server only: the page receives finished strings. The verification build
// (scripts/anatomy/switchboard/build.mjs) imports this same module, records
// every shape and audits each resting pose.
import * as k from "../../iso/iso-kit.mjs";
import * as G from "../../iso/lathe.mjs";
import { tubePieces, tubeSvg } from "../../iso/tube.mjs";
import * as A from "../../iso/audit.mjs";
import * as V from "./view.mjs";
import { cordRoute } from "./model.mjs";

const { P, at } = V;
const KS = G.scaleOf(P);
const S = (paths, style) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const f2 = (v) => Math.round(v * 100) / 100;
const Y = [0, 1, 0];
const UP = [0, 0, 1];
const X = [1, 0, 0];

/** Frames on the panel: a = +y (toward the operator), u = +x, v = +z. */
const onPanel = (x, z, y = V.PANEL_Y) => G.frameOf([x, y, z], Y, X, UP);
/** A rounded rectangle in a frame's u, v plane. */
function rounded(u0, u1, v0, v1, r, steps = 4) {
  return k.roundedPlan({ x: u0, y: v0, w: u1 - u0, d: v1 - v0, r }, steps);
}
const rect = (u0, u1, v0, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
/** A closed outline on the face plane y, from (x, z) points. */
const onFace = (points, y = V.PANEL_Y, closed = true) => path3(points.map(([x, z]) => [x, y, z]), closed);

/** Plug and jack positions. */
export const jackAt = (name) => [V.JACKS[name], V.JACK_FACE, V.JACK_Z];
export const tailAt = (name, offset = [0, 0, 0]) => [V.JACKS[name] + offset[0], V.JACK_FACE + V.PLUG_LEN + offset[1], V.JACK_Z + offset[2]];

export const REST = { a: "park", b: "ai", stamp: 0, ticket: 0, mark: 0 };
export const POSES = {
  rest: REST,
  answered: { a: "l2", b: "ai", stamp: 0, ticket: 0, mark: 1 },
  stamped: { a: "l2", b: "ai", stamp: 1, ticket: 0, mark: 1 },
  handoff: { a: "l2", b: "staff", stamp: 0, ticket: 1, mark: 1 },
};

export const STAMP_STROKE = 6;
const LAYER = { base: 0, panel: 1, deck: 2, live: 3, front: 4 };

/**
 * Build the scene in one pose. Returns the recorder (for the audit) and the
 * items in painter's order. `live` items carry `live: name` and are drawn at
 * their rest position on the page, inside a group the motion moves.
 */
export function buildScene(pose = REST, { reuse = false } = {}) {
  const R = A.recorder(P);
  const record = R.solid;
  let layer = "base";
  // Identical parts along the panel or the shelf differ only by a world shift, which
  // projects to a screen translation: with `reuse` the page draws the first one in
  // <defs> and the rest as <use>. The audit and the line check build them in full.
  const defs = new Map();
  const shareOf = (id, ref, svg) => {
    if (!reuse) return svg;
    const known = defs.get(id);
    if (!known) {
      defs.set(id, { ref, svg });
      return `<use href="#sb-${id}"/>`;
    }
    const [x0, y0] = at(known.ref);
    const [x1, y1] = at(ref);
    return `<use href="#sb-${id}" transform="translate(${f2(x1 - x0)} ${f2(y1 - y0)})"/>`;
  };
  const put = (name, ref, svg, shapes = [], { bias = 0, share, own = "", ...rest } = {}) =>
    R.put({ name: R.nameFor(name), at: ref, bias, svg: (share ? shareOf(share, ref, svg) : svg) + own, shapes, piece: "board", layer, ...rest });

  function slab(name, plan, z, h, style = {}, { steps = 4, bevel = 0, inner = "", extra = "", bias = 0, ref, meta = {}, ...rest } = {}) {
    const shape = record(A.slab(plan, z, h, { name, ...meta }, steps));
    const centre = ref ?? [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2];
    return put(name, centre, S(k.slabOf(plan, z, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, ...rest });
  }
  function post(name, cx, cy, r, z, h, style = {}, { steps = 48, bevel = 0, inner = "", extra = "", bias = 0, meta = {}, ...rest } = {}) {
    const shape = record(A.cylinder(cx, cy, r, z, h, { name, ...meta }));
    return put(name, [cx, cy, z + h / 2], S(k.cylinder(cx, cy, r, z, h, P, steps, bevel), { tone: "mid", ...style, inner }) + extra, [shape], { bias, ...rest });
  }
  function prism(name, F, poly, s0, s1, style = {}, { inner = "", extra = "", bias = 0, ref, meta = {}, ...rest } = {}) {
    const shape = record(A.prism(F, poly, s0, s1, { name, ...meta }));
    const cu = poly.reduce((a, p) => a + p[0], 0) / poly.length;
    const cv = poly.reduce((a, p) => a + p[1], 0) / poly.length;
    const centre = ref ?? G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cu)), G.mul3(F.v, cv));
    return put(name, centre, S(G.prismOf(F, poly, s0, s1, P), { tone: "mid", ...style, inner }) + extra, [shape], { bias, ...rest });
  }
  function disc(name, F, s0, s1, r, style = {}, { steps, bevel = 0, inner = "", extra = "", bias = 0, meta = {}, ...rest } = {}) {
    const shape = record(A.disc(F, s0, s1, r, { name, ...meta }));
    const paths = G.disc(s0, s1, r, F, P, { ...(steps ? { steps } : {}), bevel });
    return put(name, G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), S(paths, { tone: "mid", ...style, inner }) + extra, [shape], { bias, ...rest });
  }
  function turned(name, F, profile, style = {}, { inner = "", extra = "", bias = 0, smooth, steps, meta = {}, ...rest } = {}) {
    const opts = { ...(smooth !== undefined ? { smooth } : {}), ...(steps ? { steps } : {}) };
    const shape = record(A.solid(F, profile, { name, radius: smooth && smooth.radius ? smooth.radius : null, ...meta }));
    const mid = (profile[0][0] + profile[profile.length - 1][0]) / 2;
    return put(name, G.add3(F.o, G.mul3(F.a, mid)), S(G.solidOf(profile, F, P, opts), { tone: "mid", ...style, inner }) + extra, [shape], { bias, ...rest });
  }
  function ball(name, c, r, style = {}, { bias = 0, extra = "", meta = {}, ...rest } = {}) {
    const shape = record(A.ball(c, r, { name, ...meta }));
    return put(name, c, S(G.sphereOf(c, r, P, { steps: 20 }), { tone: "mid", ...style }) + extra, [shape], { bias, ...rest });
  }
  const screw = (points, size = 0.5, tone = "mid") => Dots(points.map(at), { size, tone });

  // the keyshelf box and its writing board: drawn before the cord, which hangs above them
  function DECK() {
  {
    const S0 = V.SHELF;
    const front = S0.y + S0.d;
    const drawer = (x0, x1) =>
      onFace(rounded(x0, x1, 12, 30, 2, 3), front) + onFace(rounded(x0 + 2.2, x1 - 2.2, 14.2, 27.8, 1.2, 3), front);
    slab("shelf", S0, V.PLINTH_H, V.SHELF_Z - V.PLINTH_H, { tone: "mid" }, {
      steps: 3,
      bevel: 0,
      inner: Ln(k.sideSeam(S0, 10, P, 3), { tone: "faint" }),
      extra:
        Ln(drawer(-112, -40) + drawer(-28, 44), { tone: "lo" }) +
        Ln(path3(rounded(S0.y + 8, front - 8, 12, 30, 2, 3).map(([y, z]) => [S0.x + S0.w, y, z]), true), { tone: "faint" }),
    });
    for (const x of [-76, 8]) {
      slab("drawer.pull", { x: x - 7, y: front, w: 14, d: 2.2, r: 1 }, 17, 2.4, { tone: "hi" }, { steps: 3, bevel: 0.3, share: "pull" });
      // a card holder above the pull; its rules stand for the drawer's written label
      const holder = { x: x - 9, y: front, w: 18, d: 0.6, r: 0.2 };
      const face = front + 0.6;
      slab("drawer.holder", holder, 22.4, 5, { tone: "mid" }, {
        steps: 2,
        share: "holder",
        extra:
          Ln(onFace(rounded(x - 7.8, x + 7.8, 23.4, 26.4, 0.4, 2), face), { tone: "faint" }) +
          Ln(onFace([[x - 5.6, 24.9], [x + 3.4, 24.9]], face, false), { tone: "lo", free: true }) +
          screw([[x - 8.2, face, 24.9], [x + 8.2, face, 24.9]], 0.36),
      });
    }
  }
  {
    const B = V.BOARD;
    const top = V.DESK;
    const inlay = k.insetPlan(B, 7);
    slab("board", B, V.SHELF_Z, V.BOARD_H, { tone: "mid" }, {
      steps: 4,
      bevel: 1,
      extra: Ln(k.planOutline(inlay, top, P, 4), { tone: "lo" }) + Ln(k.planOutline(k.insetPlan(inlay, 1.8), top, P, 4), { tone: "faint" }),
    });
  }

  }

  // ------------------------------------------------------------- bench plate
  const back = [];
  back.push(`<path class="iso-halo" d="${k.haloOf(V.PLATE, -V.PLATE_H - V.FOOT_H, V.PLATE_H, P)}"/>`);
  const byDepth = (points) => [...points].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P));
  for (const [x, y] of byDepth(k.corners(V.PLATE, 22))) {
    back.push(S(k.cylinder(x, y, 7, -V.PLATE_H - V.FOOT_H, 1.6, P, 28), { tone: "lo" }));
    back.push(S(k.cylinder(x, y, 5.4, -V.PLATE_H - V.FOOT_H + 1.6, V.FOOT_H - 1.6, P, 28), { tone: "mid" }));
    record(A.cylinder(x, y, 7, -V.PLATE_H - V.FOOT_H, 1.6, { name: "stand.foot", ground: true }));
  }
  back.push(S(k.slabOf(V.PLATE, -V.PLATE_H, V.PLATE_H, P, 8, 1.6), { tone: "mid", inner: Ln(k.sideSeam(V.PLATE, -4, P, 8), { tone: "faint" }) }));
  back.push(Ln(k.planOutline(k.insetPlan(V.PLATE, 5), 0, P), { tone: "lo" }));
  const plateScrews = k.corners(V.PLATE, 10);
  back.push(Ln(plateScrews.map(([x, y]) => k.ring(x, y, 2.2, 0, P, 16)).join(""), { tone: "lo" }));
  back.push(Dots(plateScrews.map(([x, y]) => at([x, y, 0])), { size: 0.5 }));
  record(A.slab(V.PLATE, -V.PLATE_H, V.PLATE_H, { name: "stand.plate", ground: true }, 8));
  const LABEL = { x: -136, y: V.PLATE.y + V.PLATE.d - 26, w: 44, d: 15, r: 1.4 };
  back.push(S(k.slabOf(LABEL, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
  back.push(Ln(k.planOutline(k.insetPlan(LABEL, 1.5), 0.8, P, 3), { tone: "faint" }));
  back.push(Ln([30, 20, 25].map((w, i) => k.lineOnTop([LABEL.x + 5, LABEL.y + 4 + i * 3.4], [LABEL.x + 5 + w, LABEL.y + 4 + i * 3.4], 0.8, P)).join(""), { tone: "lo", free: true }));
  back.push(Dots([at([LABEL.x + LABEL.w - 3, LABEL.y + 3, 0.8]), at([LABEL.x + LABEL.w - 3, LABEL.y + LABEL.d - 3, 0.8])], { size: 0.45 }));
  record(A.slab(LABEL, 0, 0.8, { name: "stand.label" }, 3));
  const STRIP = { x: -84, y: V.PLATE.y + V.PLATE.d - 12, w: 212, d: 6, r: 1 };
  back.push(S(k.slabOf(STRIP, 0, 0.6, P, 3), { tone: "lo", crease: "none" }));
  const ticks = k.topTicks(STRIP.x + 4, STRIP.x + STRIP.w - 4, 4, 5, STRIP.y, 0.6, [1.8, 3.4], P);
  back.push(Ln(ticks.minor, { tone: "lo" }), Ln(ticks.major, { tone: "mid" }));
  back.push(Dots([at([STRIP.x + 2, STRIP.y + 3, 0.6]), at([STRIP.x + STRIP.w - 2, STRIP.y + 3, 0.6])], { size: 0.45 }));
  record(A.slab(STRIP, 0, 0.6, { name: "stand.ruler" }, 3));
  // the rating plate on the bench's right front: its rules stand for stamped text
  {
    const RP = V.RATING;
    back.push(S(k.slabOf(RP, 0, 0.8, P, 3), { tone: "lo", crease: "none" }));
    back.push(Ln(k.planOutline(k.insetPlan(RP, 1.4), 0.8, P, 3), { tone: "faint" }));
    back.push(Ln([16, 11, 14].map((d, i) => k.lineOnTop([RP.x + 2.6 + i * 1.6, RP.y + 5], [RP.x + 2.6 + i * 1.6, RP.y + 5 + d], 0.8, P)).join(""), { tone: "lo", free: true }));
    back.push(Dots([at([RP.x + RP.w / 2, RP.y + 2.6, 0.8]), at([RP.x + RP.w / 2, RP.y + RP.d - 2.6, 0.8])], { size: 0.45 }));
    record(A.slab(RP, 0, 0.8, { name: "stand.rating" }, 3));
  }

  // ------------------------------------------------------------- the console
  layer = "panel";
  slab("plinth", V.PLINTH, 0, V.PLINTH_H, { tone: "lo" }, { steps: 3, bias: -2 });
  const cabInner = Ln(k.sideSeam(V.CAB, 40, P, 4), { tone: "faint" });
  // the cabinet: frame-and-panel side, the panel field on its front
  const sideX = V.CAB.x + V.CAB.w;
  const sideOutline = (inset) =>
    path3(rounded(V.CAB.y + inset, V.CAB.y + V.CAB.d - inset, 44 + inset - 6, V.CAB_TOP - 6 - inset, 2.5).map(([y, z]) => [sideX, y, z]), true);
  slab("cabinet", V.CAB, V.PLINTH_H, V.CAB_TOP - 3 - V.PLINTH_H, { tone: "mid" }, {
    steps: 4,
    bevel: 0.8,
    inner: cabInner,
    extra:
      Ln(sideOutline(7) + sideOutline(9.4), { tone: "faint" }) +
      // the maker's plate on the side panel: its rules stand for stamped text
      `<g>${S(G.prismOf(G.frameOf([sideX, 0, 0], X, Y, UP), rounded(V.CAB.y + 12, V.CAB.y + 30, 84, 96, 1, 2), 0, 0.5, P), { tone: "lo", crease: "none" })}` +
      Ln([0, 1, 2].map((i) => path3([[sideX + 0.5, V.CAB.y + 15, 92.6 - i * 2.6], [sideX + 0.5, V.CAB.y + [27, 22, 25][i], 92.6 - i * 2.6]])).join(""), { tone: "lo", free: true }) +
      Dots([at([sideX + 0.5, V.CAB.y + 13.6, 90]), at([sideX + 0.5, V.CAB.y + 28.4, 90])], { size: 0.42, tone: "mid" }) +
      `</g>`,
  });
  // cap moulding and the bead under it
  slab("bead", k.insetPlan(V.CAP, 1.6), V.CAB_TOP - 3, 3, { tone: "lo" }, { steps: 4 });
  const capTop = V.CAB_TOP + V.CAP_H;
  const vents = Array.from({ length: 9 }, (_, i) => k.planOutline({ x: 22 + i * 9, y: V.CAP.y + 12, w: 3, d: 24, r: 1.5 }, capTop, P, 3)).join("");
  slab("cap", V.CAP, V.CAB_TOP, V.CAP_H, { tone: "mid" }, {
    steps: 5,
    bevel: 1.2,
    extra:
      Ln(k.planOutline(k.insetPlan(V.CAP, 5), capTop, P, 5), { tone: "faint" }) +
      Ln(vents, { tone: "lo" }) +
      Ln(k.planOutline({ x: -48, y: V.CAP.y + 14, w: 56, d: 12, r: 6 }, capTop, P, 6) + k.planOutline({ x: -46, y: V.CAP.y + 16, w: 52, d: 8, r: 4 }, capTop, P, 6), { tone: "lo" }) +
      screw(k.corners(V.CAP, 9).map(([x, y]) => [x, y, capTop])),
  });
  // the bell on the cap: it rings with the line
  {
    const B = [-92, -42];
    const F = G.frameOf([B[0], B[1], capTop], UP, X, Y);
    disc("bell.foot", F, 0, 1.4, 6.2, { tone: "lo" }, { steps: 40, extra: screw([0, 1, 2].map((i) => [B[0] + Math.cos(i * 2.1 + 0.4) * 4.6, B[1] + Math.sin(i * 2.1 + 0.4) * 4.6, capTop + 1.4]), 0.4) });
    disc("bell.post", F, 1.4, 5.4, 1.5, { tone: "mid" }, { steps: 20 });
    const R0 = 9.6;
    const H0 = 6.4;
    const dome = (s) => R0 * Math.sqrt(Math.max(0, 1 - ((s - 5.4) / H0) ** 2));
    const domeSlope = (s) => {
      const u = Math.min(0.995, Math.max(0, (s - 5.4) / H0));
      return (-R0 * u) / (H0 * Math.sqrt(1 - u * u));
    };
    const knots = [0, 0.25, 0.45, 0.62, 0.76, 0.87, 0.94, 0.985].map((u) => [5.4 + u * H0, dome(5.4 + u * H0), 1]);
    turned("bell.gong", F, [[5.4, R0 - 0.01], ...knots, [5.4 + H0, 0]], { tone: "hi" }, { smooth: { slope: domeSlope, radius: dome }, steps: 28 });
    disc("bell.nut", F, 5.4 + H0 - 0.2, 5.4 + H0 + 1.2, 1.3, { tone: "mid" }, { steps: 6 });
    // the clapper on its arm, beside the gong
    const arm = G.frameOf([B[0] + 10.6, B[1] + 0.5, capTop], UP, X, Y);
    disc("bell.stud", arm, 0, 7.4, 0.9, { tone: "mid" }, { steps: 16 });
    const ballAt = [B[0] + 10.6, B[1] + 0.5, capTop + 7.4 + Math.sqrt(1.8 ** 2 - 0.9 ** 2)];
    put("bell.clapper", ballAt, `<g data-live="clapper">${S(G.sphereOf(ballAt, 1.8, P, { steps: 24 }), { tone: "hi" })}</g>`, [record(A.ball(ballAt, 1.8, { name: "bell.clapper", seated: true, cut: [] }))]);
  }

  // the enamel panel
  const PANEL_F = G.frameOf([0, V.FACE_Y, 0], Y, X, UP);
  const panelRing = rounded(V.PANEL.x0, V.PANEL.x1, V.PANEL.z0, V.PANEL.z1, V.PANEL.r, 4);
  const panelScrews = [[V.PANEL.x0 + 4.4, V.PANEL.z0 + 4.4], [V.PANEL.x1 - 4.4, V.PANEL.z0 + 4.4], [V.PANEL.x0 + 4.4, V.PANEL.z1 - 4.4], [V.PANEL.x1 - 4.4, V.PANEL.z1 - 4.4]];
  // the speaker's port: closed slots in the enamel beside its grille
  const port = V.PORT.z.map((z) => onFace(rounded(V.PORT.x0, V.PORT.x1, z - V.PORT.h / 2, z + V.PORT.h / 2, V.PORT.h / 2, 3))).join("");
  prism("panel", PANEL_F, panelRing, 0, V.PANEL_T, { tone: "hi" }, {
    extra:
      Ln(onFace(rounded(V.PANEL.x0 + 2.2, V.PANEL.x1 - 2.2, V.PANEL.z0 + 2.2, V.PANEL.z1 - 2.2, 1.6, 3)), { tone: "faint" }) +
      Ln(port, { tone: "lo" }) +
      Ln(panelScrews.map(([x, z]) => G.circleOf(onPanel(x, z), 0, 1.7, P, 16)).join(""), { tone: "lo" }) +
      screw(panelScrews.map(([x, z]) => [x, V.PANEL_Y, z]), 0.5),
  });

  // lamp rail across the top of the lamps
  const RAIL_Z = V.LAMP_Z + 8.5;
  prism("lamp.rail", onPanel(0, 0), rounded(-110, -42, RAIL_Z - 1.6, RAIL_Z + 1.6, 1, 2), 0, 1, { tone: "mid" }, {
    extra: screw([[-107.6, V.PANEL_Y + 1, RAIL_Z], [-44.4, V.PANEL_Y + 1, RAIL_Z]], 0.42),
  });

  // jacks: a hex nut on the enamel and a brass bushing with its bore
  const jackParts = (name, x) => {
    const F = onPanel(x, V.JACK_Z);
    disc(`jack.${name}.nut`, F, 0, 1, 4.4, { tone: "mid" }, { steps: 6, share: "nut" });
    disc(`jack.${name}`, F, 1, V.BUSH_T, V.BUSH_R - 0.6, { tone: "hi" }, {
      steps: 28,
      bias: 0.05,
      share: "jack",
      extra:
        `<path class="sb-bore" d="${G.circleOf(F, V.BUSH_T, V.BORE_R, P, 18)}"/>` +
        Ln(G.circleOf(F, V.BUSH_T, V.BORE_R, P, 18), { tone: "lo" }) +
        Ln(G.circleOf(F, V.BUSH_T, V.BORE_R + 0.75, P, 20), { tone: "faint" }),
    });
  };
  // lamps: a bezel ring and a jewel cap; the cap carries a glow layer the motion lights
  const lampParts = (name, x) => {
    const F = onPanel(x, V.LAMP_Z);
    disc(`lamp.${name}.bezel`, F, 0, V.LAMP_BEZEL_T, V.LAMP_BEZEL_R, { tone: "mid" }, { steps: 28, bevel: 0.3, share: "bezel" });
    const s0 = V.LAMP_BEZEL_T;
    const s1 = s0 + V.LENS_H;
    const paths = G.disc(s0, s1, V.LENS_R, F, P, { steps: 24, bevel: 0.35 });
    const shape = record(A.disc(F, s0, s1, V.LENS_R, { name: `lamp.${name}` }));
    const face = G.circleOf(F, s1, V.LENS_R * 0.62, P, 20);
    const glow = `<g class="sb-glow" data-lamp="${name}" style="opacity:0"><path class="sb-glow-body" d="${paths.fill}"/><path class="sb-glow-core" d="${face}"/></g>`;
    put(`lamp.${name}`, G.add3(F.o, G.mul3(Y, (s0 + s1) / 2)), S(paths, { tone: "hi", inner: Ln(face, { tone: "faint" }) }), [shape], { bias: 0.1, share: "lens", own: glow });
  };
  for (const [name, x] of Object.entries(V.JACKS)) {
    jackParts(name, x);
    if (V.LAMPED.includes(name)) lampParts(name, x);
  }

  // the designation strip between the jacks and the lamps: card windows whose rules stand for written names
  {
    const z0 = 87.6;
    const z1 = 94.2;
    const F = onPanel(0, 0);
    const windows = V.LINES.map((x) => rounded(x - 7, x + 7, z0 + 1.5, z1 - 1.5, 0.8, 2));
    const rules = V.LINES.map((x, i) => onFace([[x - 4.5, (z0 + z1) / 2], [x - 4.5 + [8, 6, 9, 7][i], (z0 + z1) / 2]], V.PANEL_Y + 0.8, false)).join("");
    prism("strip", F, rounded(-112, -40, z0, z1, 1, 2), 0, 0.8, { tone: "mid" }, {
      extra:
        Ln(windows.map((w) => onFace(w, V.PANEL_Y + 0.8)).join(""), { tone: "lo" }) +
        Ln(rules, { tone: "faint", free: true }) +
        screw([[-109.4, V.PANEL_Y + 0.8, (z0 + z1) / 2], [-42.6, V.PANEL_Y + 0.8, (z0 + z1) / 2]], 0.4),
    });
  }
  // the one engraved word: «موظفك» on a plate above the employee's lamp
  {
    const x = V.JACKS.staff;
    const z0 = V.LAMP_Z + 5.6;
    const z1 = V.LAMP_Z + 12.2;
    const F = onPanel(0, 0);
    const text = `<text class="sb-engrave" transform="${k.sideMatrix([x, V.PANEL_Y + 0.8], (z0 + z1) / 2 - 1.5, P, "left")}" font-size="4.2" text-anchor="middle" direction="rtl">موظفك</text>`;
    prism("label.staff", F, rounded(x - 9, x + 9, z0, z1, 1.2, 3), 0, 0.8, { tone: "lo" }, {
      extra: Ln(onFace(rounded(x - 7.8, x + 7.8, z0 + 1.2, z1 - 1.2, 0.8, 3), V.PANEL_Y + 0.8), { tone: "faint" }) + text,
    });
  }
  // busy-test buttons under the lines, one per line
  for (const x of V.LINES) {
    const F = onPanel(x, 70);
    disc("test.ring", F, 0, 0.8, 2.6, { tone: "mid" }, { steps: 20, share: "test-ring" });
    disc("test.button", F, 0.8, 2, 1.7, { tone: "hi" }, { steps: 16, share: "test-button" });
  }
  // a line fuse for every circuit that has a lamp: a hex holder and a slotted cap
  for (const name of V.LAMPED) {
    const x = V.JACKS[name];
    const F = onPanel(x, V.FUSE_Z);
    const face = 2.3;
    const slot = k.pathOf([at(G.pointOf(F, face, 1.45, 0)), at(G.pointOf(F, face, 1.45, Math.PI))]);
    disc("fuse.holder", F, 0, 0.9, 2.5, { tone: "lo" }, { steps: 6, share: "fuse-holder" });
    disc("fuse.cap", F, 0.9, face, 1.8, { tone: "mid" }, { steps: 20, bevel: 0.25, share: "fuse-cap", extra: Ln(slot, { tone: "lo" }) });
  }

  // the speaker: a ring bezel, a cross of grille spokes and a hub where the play control sits
  {
    const { x, z, r, rim } = V.SPEAKER;
    const F = onPanel(x, z);
    put(
      "speaker.well",
      [x, V.PANEL_Y - 0.5, z],
      [
        `<path class="sb-well" d="${G.circleOf(F, 0, rim, P, 48)}"/>`,
        `<g data-live="cone">`,
        Ln(G.circleOf(onPanel(x, z, V.PANEL_Y - 2), 0, rim - 2.4, P, 48), { tone: "faint" }),
        Ln(G.circleOf(onPanel(x, z, V.PANEL_Y - 3.6), 0, rim - 6.5, P, 40), { tone: "lo" }),
        Ln(G.circleOf(onPanel(x, z, V.PANEL_Y - 5), 0, rim - 11, P, 32), { tone: "faint" }),
        S(G.disc(0, 1.6, 5.6, onPanel(x, z, V.PANEL_Y - 6.4), P, { steps: 28, bevel: 0.4 }), { tone: "hi" }),
        `</g>`,
      ].join(""),
      [record(A.disc(F, 0, 0.1, rim, { name: "speaker.well" }))],
      { bias: -0.5 },
    );
    {
      const shape = record(A.ring(F, 0, 1.8, rim, r, { name: "speaker.bezel" }));
      const paths = G.ringBand(0, 1.8, rim, r, F, P, { steps: 44, hole: [1.8, rim] });
      put("speaker.bezel", G.add3(F.o, G.mul3(Y, 0.9)), S(paths, { tone: "mid" }) + Dots(G.dotsOf(F, 1.8, (r + rim) / 2 + 0.4, 6, P, { all: true, phase: Math.PI / 6 }), { size: 0.5, tone: "mid" }), [shape]);
    }
    // the inside of the bezel ring, seen through the opening
    const spoke = (angle) => {
      const c = Math.cos(angle);
      const s = Math.sin(angle);
      const w = 1.1;
      const r0 = 5.6;
      const r1 = rim + 1.9;
      return [[c * r0 - s * w, s * r0 + c * w], [c * r1 - s * w, s * r1 + c * w], [c * r1 + s * w, s * r1 - c * w], [c * r0 + s * w, s * r0 - c * w]];
    };
    for (const angle of [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4]) prism("speaker.spoke", F, spoke(angle), 1.8, 2.7, { tone: "mid" }, { extra: screw([G.pointOf(F, 2.7, rim + 0.8, angle)], 0.42) });
    disc("speaker.hub", F, 1.8, 2.7, 5.6, { tone: "hi" }, { steps: 32, bevel: 0.3, extra: Ln(G.circleOf(F, 2.7, 3.8, P, 24), { tone: "faint" }) });
  }

  // the speaker's volume knob, beside it on the panel, with its scale
  {
    const KF = onPanel(105, 62);
    const scale = G.circleOf(KF, 0.6, 6.4, P, 40);
    disc("volume.plate", KF, 0, 0.6, 7.2, { tone: "mid" }, {
      steps: 40,
      extra:
        Ln(scale, { tone: "faint" }) +
        Ln(
          [-135, -90, -45, 0, 45, 90, 135]
            .map((deg) => {
              const a = (deg * Math.PI) / 180;
              return k.pathOf([at(G.pointOf(KF, 0.6, 6.4, Math.PI / 2 - a)), at(G.pointOf(KF, 0.6, 5.2, Math.PI / 2 - a))]);
            })
            .join(""),
          { tone: "lo" },
        ),
    });
    disc("volume.knob", KF, 0.6, 4.2, 4.2, {
      tone: "hi",
    }, { steps: 32, bevel: 0.3, inner: k.fadedSvg(G.ribsOf(KF, 0.6, 4.2, 4.2, 18, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }), extra: Ln(k.pathOf([at(G.pointOf(KF, 4.2, 0.8, Math.PI / 2 - 0.6)), at(G.pointOf(KF, 4.2, 3.4, Math.PI / 2 - 0.6))]), { tone: "hi" }) + Dots([at(G.pointOf(KF, 4.2, 0, 0))], { size: 0.5, tone: "mid" }) });
  }

  // the trunk cable: from a gland on the cabinet side down to the line box on the bench
  {
    const gx = sideX;
    const F = G.frameOf([gx, V.GLAND.y, V.GLAND.z], X, Y, UP);
    disc("gland.nut", F, 0, 1.4, 4.2, { tone: "mid" }, { steps: 6 });
    disc("gland", F, 1.4, 4.4, 2.8, { tone: "mid" }, { steps: 32, extra: "" });
    const B = V.LINEBOX;
    slab("linebox", B, 0, B.h, { tone: "mid" }, {
      steps: 3,
      bevel: 0.5,
      inner: Ln(k.sideSeam(B, B.h - 3, P, 3), { tone: "faint" }),
      extra: screw([[B.x + 2.4, B.y + 2.6, B.h], [B.x + B.w - 2.4, B.y + B.d - 2.6, B.h], [B.x + 2.4, B.y + B.d - 2.6, B.h], [B.x + B.w - 2.4, B.y + 2.6, B.h]], 0.42),
    });
    const port = [B.x + B.w / 2, B.y + B.d / 2, B.h];
    disc("linebox.port", G.frameOf(port, UP, X, Y), 0, 1.6, 2.6, { tone: "mid" }, { steps: 28 });
    const start = [gx + 4.4, V.GLAND.y, V.GLAND.z];
    const route = G.fillet([start, [port[0], V.GLAND.y, V.GLAND.z], [port[0], port[1], V.GLAND.z - 14], [port[0], port[1], B.h + 1.6]], 5.2, 10, { P, tube: 1.7 });
    R.route("trunk", route, 1.7, { piece: "board" });
    tubePieces(route, 1.7, P, { maxLength: 36, spacing: 1.4, rings: { pitch: 2.2, twist: 0.7, cross: false, fade: [0.1, 0.55], steps: 10 } }).forEach((piece, index) =>
      put(`trunk:${index}`, piece.mid, tubeSvg(piece, { tone: "mid" }), [A.tube(piece.points, piece.radii, { name: "trunk" })], { bias: 0.05, route: "trunk", chunk: index }),
    );
  }

  // ------------------------------------------------------------- the keyshelf
  layer = "deck";
  DECK();

  // ------------------------------------------------------------- the patch cord and its plugs
  layer = "live";
  const plug = (live, name, jack) => {
    const F = G.frameAlong(jackAt(jack), Y);
    const [c0, c1, cr] = V.PLUG.collar;
    const [b0, b1, br] = V.PLUG.body;
    const [t0, t1] = V.PLUG.boot;
    const shapes = [
      record(A.disc(F, c0, c1, cr, { name: `${name}.collar`, owner: name })),
      record(A.disc(F, b0, b1, br, { name: `${name}.body`, owner: name })),
      record(A.solid(F, [[t0, 2.25], [t1, 1.3]], { name: `${name}.boot`, owner: name })),
    ];
    const svg = [
      S(G.disc(c0, c1, cr, F, P, { steps: 24 }), { tone: "mid" }),
      S(G.disc(b0, b1, br, F, P, { steps: 28 }), {
        tone: "hi",
        inner: k.fadedSvg(G.ribsOf(F, b0 + 1.6, b1 - 1.2, br, 16, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }),
      }),
      S(G.solidOf([[t0, 2.25], [t1, 1.3]], F, P, { steps: 24 }), { tone: "mid" }),
    ].join("");
    return put(name, G.add3(jackAt(jack), [0, 7, 0]), `<g data-live="${live}">${svg}</g>`, shapes, { bias: 0.3, live });
  };
  const offsetOf = (from, to) => [V.JACKS[to] - V.JACKS[from], 0, 0];
  // On the page both plugs are built at their rest jacks and moved; an audit pose builds them where they sit.
  plug("plugA", "plug.a", pose.a);
  plug("plugB", "plug.b", pose.b);
  {
    const route = cordRoute(tailAt(pose.a), tailAt(pose.b));
    R.route("cord", route, V.CORD_R, { piece: "board", limp: true, rims: [1.3, 1.3] });
    const pieces = tubePieces(route, V.CORD_R, P, { maxLength: 400, spacing: 0.9 });
    put("cord", tailAt(pose.a, [0, 6, -10]), `<g data-live="cord">${pieces.map((piece) => tubeSvg(piece, { tone: "mid" })).join("")}</g>`, pieces.map((piece) => A.tube(piece.points, piece.radii, { name: "cord" })), { bias: 4, live: "cord", route: "cord", chunk: 0 });
  }
  void offsetOf;

  layer = "front";

  // the dialect dial: an escutcheon with three detents, a skirt and a knurled knob
  {
    const { x, y, plate, knob, knobH } = V.DIAL;
    const z = V.DESK;
    const marks = Object.values(V.DIAL_ANGLES).map((deg) => {
      const a = (deg * Math.PI) / 180;
      const sx = Math.sin(a);
      const sy = -Math.cos(a);
      return k.lineOnTop([x + sx * (plate - 4.6), y + sy * (plate - 4.6)], [x + sx * (plate - 1.3), y + sy * (plate - 1.3)], z + 1.2, P);
    });
    const detents = Object.values(V.DIAL_ANGLES).map((deg) => {
      const a = (deg * Math.PI) / 180;
      return at([x + Math.sin(a) * (plate - 4.6), y - Math.cos(a) * (plate - 4.6), z + 1.2]);
    });
    const ticks = k.radialTicks(x, y, plate - 1.3, 24, 6, z + 1.2, [0.9, 0.9], P, (120 * Math.PI) / 180, (120 * Math.PI) / 180);
    post("dial.plate", x, y, plate, z, 1.2, { tone: "mid" }, {
      steps: 40,
      bevel: 0.4,
      extra:
        Ln(k.ring(x, y, plate - 1.3, z + 1.2, P, 64), { tone: "lo" }) +
        Ln(ticks.minor + ticks.major, { tone: "faint" }) +
        Ln(marks.join(""), { tone: "hi" }) +
        Dots(detents, { size: 0.75, tone: "hi" }) +
        screw([[x - plate + 2.6, y, z + 1.2], [x + plate - 2.6, y, z + 1.2]], 0.42),
    });
    const skirtR = knob + 1.8;
    post("dial.skirt", x, y, skirtR, z + 1.2, 1.4, { tone: "mid" }, { steps: 48, bevel: 0.3 });
    const k0 = z + 2.6;
    post("dial.knob", x, y, knob, k0, knobH, { tone: "hi" }, {
      steps: 48,
      bevel: 0.5,
      extra: Ln(k.knurl(x, y, knob, k0, k0 + knobH, 40, P, 0), { tone: "lo" }) + Ln(k.ring(x, y, knob - 2.2, k0 + knobH, P, 40), { tone: "faint" }),
    });
    put("dial.pointer", [x, y, k0 + knobH + 0.2], `<path class="iso-line sb-pointer" data-tone="lit" data-live="pointer" d=""/>` + Dots([at([x, y, k0 + knobH])], { size: 0.9, tone: "hi" }), [record(A.cylinder(x, y, knob - 0.8, k0 + knobH, 0.2, { name: "dial.pointer" }))], { bias: 0.4 });
  }

  // the booking stamp: a column and arm carrying a solenoid; its rod slides out to print the card
  {
    const { x, y } = V.STAMP;
    const z = V.DESK;
    const TRAY = { x: V.CARD.x - 3, y: y - 14, w: V.CARD.w + 6, d: 28, r: 1.6 };
    slab("stamp.tray", TRAY, z, 1.4, { tone: "lo" }, { steps: 3, bevel: 0.3, extra: Ln(k.planOutline(k.insetPlan(TRAY, 1.2), z + 1.4, P, 3), { tone: "faint" }) });
    const CARD = { x: V.CARD.x, y: y - 11, w: V.CARD.w, d: 22, r: 0.8 };
    const cardTop = z + 1.9;
    const rules = [16, 10, 13].map((w, i) => k.lineOnTop([CARD.x + 3, CARD.y + 13 + i * 2.6], [CARD.x + 3 + w, CARD.y + 13 + i * 2.6], cardTop, P)).join("");
    const markRing = k.ring(x, y - 3.6, 4.2, cardTop, P, 40) + k.ring(x, y - 3.6, 3.1, cardTop, P, 36);
    const markRule = k.lineOnTop([x - 2, y - 3.6], [x + 2, y - 3.6], cardTop, P);
    slab("stamp.card", CARD, z + 1.4, 0.5, { tone: "hi" }, {
      steps: 2,
      extra: Ln(rules, { tone: "lo", free: true }) + `<g class="sb-mark" data-live="mark" style="opacity:0">${Ln(markRing, { tone: "lit" })}${Ln(markRule, { tone: "lit", free: true })}</g>`,
    });
    const colX = TRAY.x + TRAY.w + 2.2;
    const COL = { x: colX, y: y - 3.5, w: 7, d: 7, r: 1.2 };
    slab("stamp.foot", { x: colX - 2, y: y - 6, w: 11, d: 12, r: 1.6 }, z, 1.6, { tone: "lo" }, { steps: 3, extra: screw([[colX + 6, y - 4, z + 1.6], [colX + 6, y + 4, z + 1.6]], 0.4) });
    const armZ = 58;
    slab("stamp.column", COL, z + 1.6, armZ - z - 1.6, { tone: "mid" }, { steps: 3, bevel: 0.4 });
    const ARM = { x: x - 5, y: y - 4, w: colX + 7 - (x - 5), d: 8, r: 1.6 };
    slab("stamp.arm", ARM, armZ, 4, { tone: "mid" }, { steps: 3, bevel: 0.5, extra: screw([[colX + 3.5, y, armZ + 4]], 0.42) });
    const canF = G.frameOf([x, y, armZ + 4], UP, X, Y);
    disc("stamp.can", canF, 0, 7, 4.4, { tone: "hi" }, { steps: 32, bevel: 0.4, inner: Ln(G.arcOf(canF, 2.4, 4.4, P), { tone: "faint" }) });
    disc("stamp.cap", canF, 7, 8, 3, { tone: "mid" }, { steps: 32 });
    const glandF = G.frameOf([x, y, armZ], [0, 0, -1], X, [0, -1, 0]);
    disc("stamp.gland", glandF, 0, 1.6, 2.3, { tone: "mid" }, { steps: 32 });
    // the rod slides out of the gland; its head carries the rubber die
    const ROD_R = 1.1;
    const from = 1.6;
    const to = 6.4;
    const ROD = G.rodOut(glandF, from, to, ROD_R, P, { stroke: STAMP_STROKE });
    const stroke = pose.stamp * STAMP_STROKE;
    const headTop = armZ - to;
    const headF = G.frameOf([x, y, headTop - stroke], [0, 0, -1], X, [0, -1, 0]);
    const head = S(G.disc(0, 3, 4.8, headF, P, { steps: 32, bevel: 0.3 }), { tone: "hi" }) + S(G.disc(3, 4, 4.2, headF, P, { steps: 28 }), { tone: "lo" });
    const shift = k.translateAlong(P, [0, 0, -stroke]);
    put(
      "stamp.rod",
      [x, y, headTop - 2],
      `<g data-live="stamp"${stroke ? ` transform="${shift}"` : ""}><clipPath id="sb-rod"><path data-hold d="${ROD.clip}"/></clipPath><g clip-path="url(#sb-rod)">${S(ROD.paths, { tone: "mid" })}</g></g>`,
      [record(A.slide(glandF, from, to + stroke, ROD_R, { name: "stamp.rod" }))],
      { bias: 0.2 },
    );
    put("stamp.head", [x, y, headTop - 2 - stroke], `<g data-live="head">${head}</g>`, [record(A.disc(headF, 0, 4, 4.8, { name: "stamp.head" }))], { bias: 0.3 });
  }

  // the summary printer: its ticket slides out of the slot on a handoff
  {
    const B = V.PRINTER;
    const z = V.DESK;
    const plan = { x: B.x, y: B.y, w: B.w, d: B.d, r: 2.2 };
    const front = B.y + B.d;
    const slot = onFace(rounded(V.SLOT.x0, V.SLOT.x1, V.SLOT.z - V.SLOT.gap / 2, V.SLOT.z + V.SLOT.gap / 2, 0.6, 2), front);
    slab("printer", plan, z, B.h, { tone: "mid" }, {
      steps: 4,
      bevel: 0.8,
      inner: Ln(k.sideSeam(plan, z + B.h - 4, P, 4), { tone: "faint" }),
      extra:
        `<path class="sb-slot" d="${slot}"/>` +
        Ln(slot, { tone: "lo" }) +
        Ln(k.planOutline({ x: B.x + 5, y: B.y + 4, w: 18, d: 12, r: 1 }, z + B.h, P, 3), { tone: "lo" }) +
        screw([[B.x + 3, B.y + 3, z + B.h], [B.x + B.w - 3, B.y + 3, z + B.h], [B.x + 3, B.y + B.d - 3, z + B.h], [B.x + B.w - 3, B.y + B.d - 3, z + B.h]], 0.42),
    });
    // feed knob on the printer's side
    const KF = G.frameOf([B.x + B.w, B.y + 11, z + 8], X, Y, UP);
    disc("printer.boss", KF, 0, 1.2, 3.2, { tone: "mid" }, { steps: 32 });
    disc("printer.knob", KF, 1.2, 4.2, 2.6, { tone: "hi" }, { steps: 32, inner: k.fadedSvg(G.ribsOf(KF, 1.2, 4.2, 2.6, 20, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" }) });
    // a status lamp for the printer: lit while a ticket is out
    const LF = G.frameOf([B.x + 30, B.y + 9, z + B.h], UP, X, Y);
    disc("printer.lamp.ring", LF, 0, 0.8, 2.6, { tone: "mid" }, { steps: 32 });
    disc("printer.lamp", LF, 0.8, 1.6, 1.8, { tone: "hi" }, { steps: 28, extra: `<path class="sb-glow-body sb-print-lamp" data-live="printlamp" style="opacity:0" d="${G.circleOf(LF, 1.6, 1.8, P, 24)}"/>` });
    // the ticket: built inside the printer, slid out by the motion; clipped at the slot face
    const T0 = V.TICKET;
    const out = pose.ticket * T0.out;
    const tz = V.SLOT.z - T0.t / 2;
    const ticketPlan = { x: T0.x0, y: front - T0.length, w: T0.x1 - T0.x0, d: T0.length, r: 0.6 };
    const tTop = tz + T0.t;
    const rules = [18, 12, 15, 9].map((w, i) => k.lineOnTop([T0.x0 + 3, front - T0.length + 9 + i * 3.2], [T0.x0 + 3 + w, front - T0.length + 9 + i * 3.2], tTop, P)).join("");
    const tear = k.lineOnTop([T0.x0, front - T0.length + 4.2], [T0.x1, front - T0.length + 4.2], tTop, P);
    const clip = k.pathOf(
      G.hullOf(
        [T0.x0 - 0.4, T0.x1 + 0.4].flatMap((xx) => [front + 0.05, front + T0.out + 1].flatMap((yy) => [tz - 0.15, tTop + 0.15].map((zz) => at([xx, yy, zz])))),
      ),
      true,
    );
    const ticketSvg = S(k.slabOf(ticketPlan, tz, T0.t, P, 2), { tone: "hi" }) + Ln(rules, { tone: "lo", free: true }) + Ln(tear, { tone: "faint" });
    const shift = k.translateAlong(P, [0, out, 0]);
    const visible = Math.max(0.01, out);
    put(
      "ticket",
      [(T0.x0 + T0.x1) / 2, front + visible / 2, tz],
      `<g data-live="ticket"${out ? ` transform="${shift}"` : ""}><clipPath id="sb-ticket"><path data-hold${out ? ` transform="${k.translateAlong(P, [0, -out, 0])}"` : ""} d="${clip}"/></clipPath><g clip-path="url(#sb-ticket)">${ticketSvg}</g></g>`,
      out > 0.5 ? [record(A.slab({ x: T0.x0, y: front, w: T0.x1 - T0.x0, d: out, r: 0.6 }, tz, T0.t, { name: "ticket" }, 2))] : [record(A.slab({ x: T0.x0, y: front - 0.4, w: T0.x1 - T0.x0, d: 0.4, r: 0.1 }, tz, T0.t, { name: "ticket" }, 2))],
      { bias: 0.3 },
    );
  }

  // lever keys on the right of the shelf: the operator's talk and ring keys
  {
    const z = V.DESK;
    for (let i = 0; i < V.KEYS.count; i++) {
      const x = V.KEYS.x + i * V.KEYS.pitch;
      const y = V.KEYS.y;
      const base = { x: x - 5, y: y - 6, w: 10, d: 12, r: 1.4 };
      slab("key.base", base, z, 2.4, { tone: "mid" }, { steps: 3, bevel: 0.4, share: "key-base", extra: screw([[x, y - 4, z + 2.4], [x, y + 4, z + 2.4]], 0.4) });
      const tilt = i === 1 ? 0 : i === 0 ? -1 : 1;
      const CF = G.frameOf([x, y, z + 2.4], UP, X, Y);
      disc("key.collar", CF, 0, 1.4, 2.2, { tone: "mid" }, { steps: 18, share: "key-collar" });
      const pivot = [x, y, z + 2.4 + 1.4 + 1.3];
      ball("key.pivot", pivot, 1.3, { tone: "mid" }, { share: "key-pivot" });
      const axis = G.unit3([0, tilt * 0.32, 1]);
      const LF = G.frameAlong(pivot, axis);
      const s0 = Math.sqrt(1.3 ** 2 - 0.8 ** 2);
      const tipS = 8.4 + Math.sqrt(1.9 ** 2 - 0.8 ** 2);
      disc("key.lever", LF, s0, 8.4, 0.8, { tone: "mid" }, { steps: 12 });
      ball("key.ball", G.add3(pivot, G.mul3(axis, tipS)), 1.9, { tone: "hi" });
    }
  }

  // ------------------------------------------------------------- order
  A.settle(R, P);
  for (const item of R.items) item.key = LAYER[item.layer] * 1e5 + item.key;
  const items = R.items.slice().sort((a, b) => a.key - b.key);
  const defsSvg = defs.size ? `<defs>${[...defs].map(([id, { svg }]) => `<g id="sb-${id}">${svg}</g>`).join("")}</defs>` : "";
  return { R, items, back: defsSvg + back.join("") };
}

/**
 * Rewrite the kit's absolute path data (M, L and Z on a 0.1 grid) as relative
 * moves with the shortest numbers. Lossless: positions are kept in integer
 * tenths, so every point lands exactly where the kit put it.
 */
export function compactPath(d) {
  const tokens = d.match(/[MLZ]|-?\d*\.?\d+/g) ?? [];
  const num = (tenths) => {
    if (tenths === 0) return "0";
    const sign = tenths < 0 ? "-" : "";
    const a = Math.abs(tenths);
    const whole = Math.floor(a / 10);
    const frac = a % 10;
    return sign + (frac ? `${whole || ""}.${frac}` : `${whole}`);
  };
  const join = (out, text) => (out && !/[a-zA-Z]$/.test(out) && !text.startsWith("-") && !(text.startsWith(".") && /\.\d+$/.test(out.split(/[ a-zA-Z-]/).pop() ?? "")) ? `${out} ${text}` : out + text);
  let out = "";
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let last = "";
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === "Z") {
      out += "z";
      x = sx;
      y = sy;
      last = "z";
      continue;
    }
    const cmd = t === "M" || t === "L" ? t : last === "m" || last === "M" ? "L" : last.toUpperCase() || "L";
    if (t === "M" || t === "L") i++;
    const ax = Math.round(parseFloat(tokens[i]) * 10);
    const ay = Math.round(parseFloat(tokens[++i]) * 10);
    const want = cmd === "M" ? "m" : "l";
    out = want === last || (want === "l" && last === "m") ? out : out + want;
    out = join(out, num(ax - x));
    out = join(out, num(ay - y));
    x = ax;
    y = ay;
    if (cmd === "M") (sx = x), (sy = y);
    last = want;
  }
  return out;
}

/** The static art in painter's order, with the live groups in their slots. */
export function artOf({ reuse = true, compact = true } = {}) {
  const { items, back } = buildScene(REST, { reuse });
  const art = back + items.map((item) => `<g class="it" data-name="${item.name}">${item.svg}</g>`).join("");
  return compact ? art.replace(/ d="([MLZ0-9. -]*)"/g, (_, d) => ` d="${compactPath(d)}"`) : art;
}

/** Numbers the client motion needs (no geometry code ships). */
export function liveData() {
  const lamps = Object.fromEntries(V.LAMPED.map((name) => [name, true]));
  const hub = at([V.SPEAKER.x, V.PANEL_Y + 2.7, V.SPEAKER.z]);
  return {
    P,
    width: V.WIDTH,
    height: V.HEIGHT,
    jacks: V.JACKS,
    jackFace: V.JACK_FACE,
    jackZ: V.JACK_Z,
    plugLen: V.PLUG_LEN,
    plugOut: V.PLUG_OUT,
    cordR: V.CORD_R,
    lamps,
    dial: { x: V.DIAL.x, y: V.DIAL.y, z: V.DESK + 2.6 + V.DIAL.knobH, r: V.DIAL.knob - 0.6, skirt: V.DIAL.knob + 1.6, angles: V.DIAL_ANGLES },
    stampStroke: STAMP_STROKE,
    ticketOut: V.TICKET.out,
    hub: [f2((hub[0] / V.WIDTH) * 100), f2((hub[1] / V.HEIGHT) * 100)],
    hubR: f2(((5.6 * KS) / V.WIDTH) * 100),
  };
}
