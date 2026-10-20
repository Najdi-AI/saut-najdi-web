/**
 * Upright round parts drawn with true elliptical arcs instead of facet
 * polygons: the same four-tone shading the kit's extrude gives a cylinder
 * (its light, its buckets), the same paths (fill, shades, top, crease, bevel,
 * outline) for the kit's solidSvg, at about a tenth of the bytes, and with
 * outlines that are exact ellipses at any zoom.
 *
 * For a vertical axis the kit's projection maps a horizontal circle of radius
 * r to an axis-aligned ellipse (rx = r·k, ry = r·k·sin e), and the kit's side
 * tone, (sin ψ + 1) / 2 with ψ the facing angle from the view, changes bucket
 * at sin ψ = −½, 0, ½: four vertical strips at x = c ± r·k, c ± ½·r·k, c.
 */
import { cameraOf, iso, type Point3, type Projection, type SolidPaths } from "../../iso/iso-kit";

const tenth = (value: number) => {
  const text = (Math.round(value * 10) / 10).toFixed(1).replace(/\.0$/, "");
  return text === "-0" ? "0" : text;
};
const pt = ([x, y]: [number, number]) => `${tenth(x)} ${tenth(y)}`;

interface Ring {
  c: [number, number];
  rx: number;
  ry: number;
}

function ringAt(cx: number, cy: number, r: number, z: number, P: Projection): Ring {
  const { k, sinE } = cameraOf(P);
  return { c: iso([cx, cy, z], P), rx: r * k, ry: r * k * sinE };
}

/** The point on a ring's front (lower) half at lateral offset u (−1 left … 1 right). */
const front = (ring: Ring, u: number): [number, number] => [ring.c[0] + ring.rx * u, ring.c[1] + ring.ry * Math.sqrt(Math.max(0, 1 - u * u))];
const back = (ring: Ring, u: number): [number, number] => [ring.c[0] + ring.rx * u, ring.c[1] - ring.ry * Math.sqrt(Math.max(0, 1 - u * u))];
const arc = (ring: Ring, to: [number, number], sweep: 0 | 1, large: 0 | 1 = 0) => `A${tenth(ring.rx)} ${tenth(ring.ry)} 0 ${large} ${sweep} ${pt(to)}`;

/** Along the front half from u0 to u1 (left to right is anticlockwise on screen, sweep 0). */
const frontArc = (ring: Ring, u0: number, u1: number) => arc(ring, front(ring, u1), u1 > u0 ? 0 : 1);

/** A full ellipse as two half arcs: screw rings, bores, seats. */
export function ellipse(cx: number, cy: number, r: number, z: number, P: Projection) {
  const ring = ringAt(cx, cy, r, z, P);
  return `M${pt(front(ring, -1))}${arc(ring, front(ring, 1), 0)}${arc(ring, front(ring, -1), 0)}Z`;
}

/** The visible front half of a horizontal circle on an upright part: seams, bands, the foot of a glass. */
export function frontHalf(cx: number, cy: number, r: number, z: number, P: Projection, from = -1, to = 1) {
  const ring = ringAt(cx, cy, r, z, P);
  return `M${pt(front(ring, from))}${frontArc(ring, from, to)}`;
}

/** The far half of a horizontal circle (seen through glass). */
export function backHalf(cx: number, cy: number, r: number, z: number, P: Projection) {
  const ring = ringAt(cx, cy, r, z, P);
  return `M${pt(back(ring, -1))}${arc(ring, back(ring, 1), 1)}`;
}

const STRIPS = [1, 0.5, 0, -0.5, -1];

/**
 * An upright round solid from z0 to z1, radius r0 at the bottom and r1 at the
 * top (a cylinder when equal, a chamfer or cone otherwise). Painted by the
 * kit's solidSvg exactly like k.cylinder's output.
 */
export function roundOf(cx: number, cy: number, r0: number, z0: number, z1: number, P: Projection, { r1 = r0, bevel = 0 }: { r1?: number; bevel?: number } = {}): SolidPaths {
  const lo = ringAt(cx, cy, r0, z0, P);
  const hi = ringAt(cx, cy, r1, z1, P);
  const fill = `M${pt(front(hi, -1))}${arc(hi, front(hi, 1), 1)}L${pt(front(lo, 1))}${arc(lo, front(lo, -1), 1)}Z`;
  const outline = `M${pt(front(hi, -1))}${arc(hi, front(hi, 1), 1)}L${pt(front(lo, 1))}${arc(lo, front(lo, -1), 1)}Z`;
  const crease = `M${pt(front(hi, -1))}${frontArc(hi, -1, 1)}`;
  const top = `M${pt(front(hi, -1))}${arc(hi, front(hi, 1), 0)}${arc(hi, front(hi, -1), 0)}Z`;
  const shades = ["", "", "", ""];
  if (z1 > z0) {
    for (let band = 0; band < 4; band++) {
      const a = STRIPS[band]!;
      const b = STRIPS[band + 1]!;
      shades[band] = `M${pt(front(hi, a))}${frontArc(hi, a, b)}L${pt(front(lo, b))}${frontArc(lo, b, a)}Z`;
    }
  }
  let bevelPath: string | undefined;
  if (bevel > 0 && r1 > bevel) {
    const inner = ringAt(cx, cy, r1 - bevel, z1, P);
    bevelPath = `M${pt(front(hi, -1))}L${pt(front(inner, -1))}${frontArc(inner, -1, 1)}L${pt(front(hi, 1))}`;
  }
  return { fill, outline, crease, top, shades, bevel: bevelPath };
}

/** The silhouette of an upright round part, for masks. */
export const silhouetteOf = (cx: number, cy: number, r: number, z0: number, z1: number, P: Projection) => roundOf(cx, cy, r, z0, z1, P).fill;

export type { Point3 };
