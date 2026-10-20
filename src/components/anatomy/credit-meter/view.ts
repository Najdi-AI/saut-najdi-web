/**
 * World layout of the credit meter, in world units of about 1 px of the real
 * thing (x, y on the bench, z up), and the one projection P every path uses.
 *
 * Seen from azimuth 55°: +x runs right and down the screen, +y left and down,
 * so the tank's window sits on its +y face and the gauge faces the viewer.
 */
import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from "../../iso/iso-kit";

export const WIDTH = 600;
export const HEIGHT = 400;
export const AZIMUTH = 55;
const PAD = 26;

/** Base plate on four feet. */
export const PLATE: Plan = { x: -152, y: -64, w: 274, d: 126, r: 9 };
export const PLATE_H = 10;
export const FOOT_H = 5;

/** The reservoir: one tank, filled to the plan's monthly pool. */
export const TANK: Plan = { x: -140, y: -52, w: 66, d: 62, r: 6 };
export const TANK_Z = 4;
export const TANK_TOP = 104;
export const LID_H = 4;
export const FRONT = TANK.y + TANK.d;
export const SIDE = TANK.x + TANK.w;

/** The sight window on the tank's +y face, and its level scale. */
export const WINDOW = { x0: -130, x1: -110, z0: 16, z1: 94, r: 3, depth: 3 };
export const LEVEL_SPAN = WINDOW.z1 - WINDOW.z0 - 4;
export const LEVEL_FROM = WINDOW.z0 + 2;

/** The main line from the tank to the valve, with the gauge riser on a tee. */
export const LINE_Y = -20;
export const LINE_Z = 34;
export const MAIN_R = 4.4;
export const TEE_X = -30;
export const TEE_R = 6.4;

/** The dial gauge: a round case on a riser, its face turned to the viewer. */
export const GAUGE_R = 31;
export const GAUGE_Z = 104;
/** The case sits 1.5 behind its axis point so the riser socket lands under the middle of the drum. */
export const GAUGE: Point3 = [TEE_X + 1.5 * Math.cos((AZIMUTH * Math.PI) / 180), LINE_Y + 1.5 * Math.sin((AZIMUTH * Math.PI) / 180), GAUGE_Z];
export const RISER_R = 3;

/** The two-way valve: in from −x, out to +x (calls) or +y (text). */
export const VALVE: Point3 = [34, LINE_Y, LINE_Z];
export const VALVE_R = 8.6;
export const NECK = 12;

/**
 * The two outlets. A call minute draws 10 credits and a text conversation 4,
 * so the call line has 2.5 times the bore area of the text line.
 */
export const CALL_R = 4.1;
export const TEXT_R = 2.6;
export const CALL_X = 96;
export const TEXT_Y = 36;

/** The plan selector: a detent switch on the bench in front of the tank. */
export const SWITCH: Plan = { x: -132, y: 22, w: 34, d: 30, r: 3 };
export const SWITCH_H = 7;
export const KNOB: [number, number] = [SWITCH.x + 17, SWITCH.y + 15];
export const KNOB_R = 7;
export const KNOB_H = 5;

export const P = fitProjection(
  [
    ...boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
    ...boxCorners(TANK, 0, TANK_TOP + LID_H + 8),
    [GAUGE[0] - 22, GAUGE[1] + 22, GAUGE_Z + GAUGE_R + 2],
    [GAUGE[0] + 22, GAUGE[1] - 22, GAUGE_Z + GAUGE_R + 2],
  ],
  WIDTH,
  HEIGHT,
  { pad: PAD, azimuth: AZIMUTH },
);

export const at = (point: Point3): Flat => iso(point, P);
