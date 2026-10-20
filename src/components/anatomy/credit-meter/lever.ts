/**
 * The valve lever: the only part whose shape changes as it moves (it turns
 * about the valve stem, so its sides change tone). Rebuilt per frame with the
 * kit's own extrude; shared by the server art (rest pose) and the client
 * controller (every frame), so both draw the same solid.
 */
import { extrude, type Plane, type Projection, type SolidPaths } from "../../iso/iso-kit";

export interface LeverSpec {
  /** Stem centre on the bench. */
  at: Plane;
  /** Bottom of the lever plate and its thickness. */
  z: number;
  h: number;
  /** The plate runs from `back` behind the stem to `reach` in front of it. */
  back: number;
  reach: number;
  half: number;
  /** The grip sleeve on the far end: from `grip` to `reach`, a little wider and taller. */
  grip: number;
  gripHalf: number;
  gripLift: number;
}

/** A capsule from `from` to `to` along the lever, `half` wide, as a floor ring. */
function capsule(spec: LeverSpec, angle: number, from: number, to: number, half: number): Plane[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const [x, y] = spec.at;
  const ring: Plane[] = [];
  const steps = 7;
  for (let i = 0; i <= steps; i++) {
    const t = -Math.PI / 2 + (i / steps) * Math.PI;
    const a = to + Math.cos(t) * half;
    const b = Math.sin(t) * half;
    ring.push([x + a * c - b * s, y + a * s + b * c]);
  }
  for (let i = 0; i <= steps; i++) {
    const t = Math.PI / 2 + (i / steps) * Math.PI;
    const a = from + Math.cos(t) * half;
    const b = Math.sin(t) * half;
    ring.push([x + a * c - b * s, y + a * s + b * c]);
  }
  return ring;
}

export interface LeverPaths {
  plate: SolidPaths;
  grip: SolidPaths;
}

/** The lever turned to `angle` (radians, 0 along +x, π/2 along +y). */
export function leverAt(spec: LeverSpec, angle: number, P: Projection): LeverPaths {
  const plate = extrude(capsule(spec, angle, -spec.back, spec.reach, spec.half), spec.z, spec.h, P, { convex: true, bevel: 0.3 });
  const grip = extrude(capsule(spec, angle, spec.grip, spec.reach + 0.6, spec.gripHalf), spec.z - spec.gripLift / 2, spec.h + spec.gripLift, P, { convex: true, bevel: 0.3 });
  return { plate, grip };
}

/** The floor rings at rest, for the audit's recorded shapes. */
export const leverRings = (spec: LeverSpec, angle: number) => ({
  plate: capsule(spec, angle, -spec.back, spec.reach, spec.half),
  grip: capsule(spec, angle, spec.grip, spec.reach + 0.6, spec.gripHalf),
});
