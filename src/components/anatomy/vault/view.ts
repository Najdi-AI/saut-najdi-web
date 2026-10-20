import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from "../../iso/iso-kit";

/**
 * World layout of the Gulf vault, in world units of about 1 px.
 * x runs along the vault's width, y from back to front, z up.
 */

export const WIDTH = 600;
export const HEIGHT = 440;
export const AZIMUTH = 50;

export const PLATE: Plan = { x: -84, y: -54, w: 160, d: 122, r: 8 };
export const PLATE_H = 9;
export const FOOT_H = 5;

/** Vault: a base flange bolted to the plate, a recessed plinth, the body, a cornice. */
export const FLANGE: Plan = { x: -64, y: -40, w: 118, d: 78, r: 2 };
export const FLANGE_H = 2;
export const PLINTH: Plan = { x: -57, y: -33, w: 104, d: 64, r: 1.5 };
export const PLINTH_TOP = 6;
export const BODY: Plan = { x: -60, y: -36, w: 110, d: 70, r: 2.5 };
export const BODY_TOP = 78;
export const FRONT = BODY.y + BODY.d;
export const SIDE = BODY.x + BODY.w;
export const CORNICE: Plan = { x: -62, y: -38, w: 114, d: 74, r: 3 };
export const CORNICE_TOP = 82;

/** Safe-deposit doors on the front face: 4 columns × 2 rows. */
export const DOOR_W = 21;
export const DOOR_H = 24;
export const DOOR_T = 1.4;
export const DOOR_COLS = [-53, -28, -3, 22];
export const DOOR_ROWS = [13, 41];
export const NAME_PLATE = { x0: -19, x1: 9, z0: 69, z1: 75.5 };

/** The journal printer on top. */
export const PBASE: Plan = { x: -54, y: -31, w: 92, d: 60, r: 2.5 };
export const PBASE_TOP = 84;
export const HOUSING: Plan = { x: -48, y: -26, w: 80, d: 50, r: 4 };
export const HOUSING_TOP = 116;
export const P_FRONT = HOUSING.y + HOUSING.d;
export const P_SIDE = HOUSING.x + HOUSING.w;
export const WINDOW = { x0: -38, x1: 10, z0: 90, z1: 110, r: 3, depth: 3 };
export const TAPE_Y = P_FRONT - WINDOW.depth;
export const TAPE_X: [number, number] = [-36, 8];
export const SLOT: Plan = { x: -37, y: TAPE_Y - 1.3, w: 46, d: 1.6, r: 0.8 };
export const HEAD_Z = 92;
export const PRINT_Z = 95.6;
export const BEZEL_W = 2;
export const BEZEL_T = 0.8;

/** The take-up spool between two cheeks, its ratchet on the +x side. */
export const STRIP_Y = TAPE_Y - 0.5;
export const SPOOL_Y = STRIP_Y - 7;
export const SPOOL_Z = 132;
export const CHEEK_Y: [number, number] = [SPOOL_Y - 16, SPOOL_Y + 10];
export const CHEEK_TOP = 146;
export const CHEEK_R = 7;
export const CHEEK_L: [number, number] = [-41.7, -38.7];
export const CHEEK_R_X: [number, number] = [10.7, 13.7];
export const FLANGE_R = 10.2;
export const FLANGE_T = 1.2;
export const ROLL_X: [number, number] = [-36.5, 8.5];
export const SHAFT_R = 1.8;
export const HUB: [number, number] = [13.7, 14.6];
export const WHEEL: [number, number] = [14.6, 16.6];
export const WHEEL_ROOT = 7.8;
export const WHEEL_TIP = 10.4;
/**
 * The pawl, in the side plane's local coordinates (u = −y, v = −z, wheel
 * centre at the origin, angles in degrees from +u toward +v). It hangs on a
 * pin straight above the wheel, inside the cheek's flat top; its hub clears
 * the tooth tips (12.3 − 1.6 = 10.7 > 10.4), its arm runs round the wheel
 * between radii 11 and 12.9, and its nose drops to the root at −50°.
 */
export const PAWL_PIVOT_AT = -90;
export const PAWL_PIVOT_R = 12.3;
export const PAWL_PIVOT: Flat = [PAWL_PIVOT_R * Math.cos((PAWL_PIVOT_AT * Math.PI) / 180), PAWL_PIVOT_R * Math.sin((PAWL_PIVOT_AT * Math.PI) / 180)];
export const PAWL_HUB = 1.6;
export const PAWL_IN = 11;
export const PAWL_OUT = 12.9;
export const PAWL_NOSE = 9.9;
export const PAWL_TIP_AT = -50;
export const PIN_R = 1.1;
export const PIN_HEAD_R = 1.4;
/** The crank sits 0.4 proud of the pawl pin's head (16.6–17.0), so its arm sweeps past it. */
export const CRANK: [number, number] = [17.4, 18.8];
export const CRANK_R = 11;
export const KNOB: [number, number] = [18.8, 23.8];
export const KNOB_R = 1.7;
export const CRANK_REST = 118;

/** Key panel on the vault's +x face: one lock and one key per role. */
export const PANEL: Plan = { x: SIDE, y: -26, w: 1.6, d: 50, r: 0.6 };
export const PANEL_Z: [number, number] = [31, 61];
export const KEY_Y = [-16, -1, 14];
export const KEY_Z = 46;
export const BEZEL: [number, number] = [0, 1.2];
export const BEZEL_R = 4.6;
export const PLUG: [number, number] = [1.2, 1.8];
export const PLUG_R = 3;
export const KEY_T = 1.2;

/** The disclosure placard on the bench in front of the vault: a card leaning in a slotted foot. */
export const CARD_FOOT: Plan = { x: -50, y: 50, w: 42, d: 6.5, r: 1.2 };
export const CARD_FOOT_H = 2.6;
export const CARD_X: [number, number] = [-48, -10];
export const CARD_LEAN: [Flat, Flat] = [[54.6, CARD_FOOT_H], [51.2, 17]];
export const CARD_T = 0.7;

const fitPoints: Point3[] = [
  ...boxCorners(PLATE, -PLATE_H - FOOT_H, 0),
  ...boxCorners({ x: CHEEK_L[0], y: CHEEK_Y[0], w: KNOB[1] - CHEEK_L[0], d: CHEEK_Y[1] - CHEEK_Y[0], r: 0 }, CHEEK_TOP - 2, CHEEK_TOP),
  [SIDE + 16, KEY_Y[0]! - 5, KEY_Z],
];

export const P = fitProjection(fitPoints, WIDTH, HEIGHT, { pad: 26, azimuth: AZIMUTH });

export const at = (point: Point3): Flat => iso(point, P);

const minus = (a: Flat, b: Flat): Flat => [a[0] - b[0], a[1] - b[1]];
const ORIGIN = at([0, 0, 0]);
/** Screen vectors of one world unit along each axis. */
export const EX = minus(at([1, 0, 0]), ORIGIN);
export const EY = minus(at([0, 1, 0]), ORIGIN);
export const EZ = minus(at([0, 0, 1]), ORIGIN);
