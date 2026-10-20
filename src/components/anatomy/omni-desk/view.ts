import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3, type Projection } from "../../iso/iso-kit";
import { GLASS_SPAN, LANE_Y, MOUTH_Z, PAD_REST, RAIL_TOP, SLED_TOP, CUP_TOP, TUBE_X } from "./model";

/** World layout of the desk, in units of about 1 px of the real thing (x along the desk, y across, z up). */
export const WIDTH = 600;
export const HEIGHT = 392;
export const AZIMUTH = 62;
export const ELEVATION = 30;

export const DESK: Plan = { x: -192, y: -92, w: 384, d: 106, r: 8 };
export const DESK_H = 20;
export const FOOT_H = 6;

/** Rail and carriage. */
export const RAIL: Plan = { x: -157, y: LANE_Y - 5, w: 314, d: 10, r: 1.5 };
export const STOP_W = 5;
export const SLED: Plan = { x: -15, y: LANE_Y - 9, w: 30, d: 18, r: 2.5 };
export const CUP_R = 7;
export { RAIL_TOP, SLED_TOP, CUP_TOP, LANE_Y, MOUTH_Z, PAD_REST, TUBE_X };

/** The ruler strip in front of the rail: one major tick per tube and at the stamp. */
export const STRIP: Plan = { x: -152, y: LANE_Y + 13, w: 304, d: 6, r: 1 };

/** Tube terminals, top to bottom. */
export const RECEIVER: [number, number] = [MOUTH_Z, MOUTH_Z + 12];
export const RECEIVER_R = 8.4;
export const LOWER_COLLAR: [number, number] = [RECEIVER[1], RECEIVER[1] + 4];
/** The sight glass, from the model (the controller needs its top to know when the capsule is out of sight). */
export const GLASS: [number, number] = GLASS_SPAN;
if (GLASS[0] !== LOWER_COLLAR[1]) throw new Error("the sight glass must sit on the lower collar");
export const GLASS_R = 7.4;
export const TOP_COLLAR: [number, number] = [GLASS[1], GLASS[1] + 4];
export const COLLAR_R = 9.2;
export const TUBE_R = 6;
export const BEAM_Z = 142;
export const BEAM_H = 14;
export const FLANGE: [number, number] = [BEAM_Z - 4, BEAM_Z];
export const FLANGE_R = 9.4;
export const BEAM: Plan = { x: -186, y: LANE_Y - 8, w: 372, d: 16, r: 2 };

/** Posts at both ends of the beam. */
export const POST_X = 172;
export const POST = 12;
export const POST_FOOT = 18;

/** The stamp press behind the lane, between the third and fourth tubes. */
export const COLUMN: Plan = { x: -6, y: -80, w: 12, d: 12, r: 2 };
export const COLUMN_FOOT: Plan = { x: -11, y: -85, w: 22, d: 22, r: 3 };
export const COLUMN_TOP = 72;
/** A round clamp collar holds the stamp's housing; the arm runs from the column's face to the collar's back. */
export const CLAMP_R = 7.5;
export const CLAMP_Z: [number, number] = [60, 69];
export const ARM: Plan = { x: -4, y: COLUMN.y + COLUMN.d, w: 8, d: LANE_Y - CLAMP_R - (COLUMN.y + COLUMN.d) + 0.05, r: 1.2 };
export const ARM_Z: [number, number] = [61, 68];
export const HOUSING_R = 5.6;
export const HOUSING: [number, number] = [PAD_REST + 11, 76];
export const ROD_R = 2.1;
export const PAD_R = 5;
export const PAD_H = 3;
export const KNOB_R = 3.6;

function fit(): Projection {
  const points: Point3[] = [
    ...boxCorners(DESK, -DESK_H - FOOT_H, 0),
    ...boxCorners(BEAM, BEAM_Z, BEAM_Z + BEAM_H),
  ];
  return fitProjection(points, WIDTH, HEIGHT, { pad: 30, azimuth: AZIMUTH, elevation: ELEVATION });
}

export const P = fit();
export const at = (point: Point3): Flat => iso(point, P);

const ORIGIN = at([0, 0, 0]);
const minus = (a: Flat, b: Flat): Flat => [a[0] - b[0], a[1] - b[1]];
const fine = (value: number) => Math.round(value * 10000) / 10000;
/** Screen vectors of one world unit along x and z, all the client needs to move parts. */
export const EX: Flat = minus(at([1, 0, 0]), ORIGIN).map(fine) as Flat;
export const EZ: Flat = minus(at([0, 0, 1]), ORIGIN).map(fine) as Flat;
