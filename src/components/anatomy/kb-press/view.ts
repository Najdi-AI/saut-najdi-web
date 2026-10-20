import { boxCorners, fitProjection, iso, type Flat, type Plan, type Point3 } from "../../iso/iso-kit";
import { DRAWERS, MOTION } from "./model";

/**
 * World layout of the knowledge press, in units of about 1 px: x runs along
 * the bench (left to right on screen), y toward the viewer, z up. The plate
 * top is z = 0. Every constant here is shared by the geometry, the live
 * offsets and the verification build.
 */

export const WIDTH = 600;
export const HEIGHT = 352;
export const AZIMUTH = 58;
const PAD = 22;

export const BASE: Plan = { x: -186, y: -62, w: 362, d: 134, r: 9 };
export const BASE_H = 10;
export const FOOT_H = 5;

/* The card cabinet: four bays of drawers between end panels and partitions. */
export const END = 4;
export const PART = 3;
export const BAY_W = 34;
export const CAB_X0 = -160;
export const CAB_X1 = CAB_X0 + END * 2 + BAY_W * DRAWERS + PART * (DRAWERS - 1);
export const CAB_Y0 = -42;
/** The cabinet face plane: drawer fronts are inset flush with it. */
export const FACE_Y = 10;
export const PLINTH_H = 5;
export const DECK_Z = 9.6;
export const SLAB_Z = 31.8;
export const TOP_Z = 36;
export const OVERHANG = 1.5;

export const bayX = (index: number) => CAB_X0 + END + index * (BAY_W + PART);
export const bayMid = (index: number) => bayX(index) + BAY_W / 2;

/* A drawer, built closed. */
export const FRONT_T = 3;
export const FRONT_Z0 = 10.1;
export const FRONT_Z1 = 26;
export const DRAWER_DEPTH = 46;
export const SIDE_Z1 = 20;
export const FLOOR_T = 1;
export const CARD = { w: 28, h: 17, t: 0.8, gap: 4, count: 5, tab: 2.6, tabW: 9 };
export const CARD_Z0 = DECK_Z + FLOOR_T;
export const CARD_Z1 = CARD_Z0 + CARD.h;
/** Front face of a drawer's front card, closed. Open by MOTION.open, it is the pick plane. */
export const CARD_FRONT = FACE_Y - FRONT_T - 2;

/* The track along the cabinet top, and the slots the cards drop through. */
export const TRACK_Y = 2;
export const RAIL_GAP = 1.4;
export const RAIL_W = 1.2;
export const RAIL_H = 1.4;

/* The gantry: two posts, a rail, a carriage, a mast and a picker head. */
/** The picker pad meets the front face of an open drawer's front card here. */
export const PICK_Y = CARD_FRONT + MOTION.open;
/** The mast hangs in front of the card plane, offset to the side of the pad; the head slides on its back face. */
export const MAST = { y: PICK_Y + 3.3, x: 7, half: 1.5, bottom: CARD_Z1 + CARD.tab + 1.5 };
export const GANTRY = { y0: MAST.y - MAST.half - 12.4, y1: MAST.y - MAST.half - 4.4, z0: 90, z1: 96, x0: -182, x1: 32 };
export const POSTS = [-176, 14];
export const POST_W = 8;
export const ARM_PARK = 18;
export const HEAD = { y0: MAST.y - MAST.half - 4.2, y1: MAST.y - MAST.half, z0: MAST.bottom, h: 6.5, x0: -4.5, x1: MAST.x + 2 };
export const PAD_Z = [CARD_Z1 + 0.3, CARD_Z1 + CARD.tab - 0.1] as const;

/* The press. */
export const STAND: Plan = { x: 15, y: -44, w: 145, d: 56, r: 3 };
export const STAND_H = 32;
export const BED_Z = TOP_Z;
export const HOUSING: Plan = { x: 14, y: -10, w: 30, d: 22, r: 2 };
export const HOUSING_H = 22;
export const COLUMN: Plan = { x: 52, y: -42, w: 36, d: 13, r: 2 };
export const ARM: Plan = { x: 48, y: -42, w: 44, d: 48, r: 3 };
export const ARM_Z = 74;
export const ARM_H = 12;
export const PLATEN: Plan = { x: 53, y: -27, w: 34, d: 28, r: 1.6 };
export const PLATEN_Z = 48;
export const PLATEN_H = 6;
export const ROD = { x: 70, y: -13, r: 3.6 };
/** The feed lane: the three files lie side by side on the bed and each slides flat under the platen. */
export const FEED: Plan = { x: 93, y: -26, w: 62, d: 22, r: 1.2 };
/** Where a fed sheet lies under the platen. */
export const UNDER_X = 57;

const fit = () =>
  fitProjection(
    [
      ...boxCorners(BASE, -BASE_H - FOOT_H, 0),
      [GANTRY.x0, GANTRY.y0, GANTRY.z1 + 6],
      [GANTRY.x1, GANTRY.y0, GANTRY.z1 + 6],
      [ARM.x, ARM.y, ARM_Z + ARM_H + 18],
      [ARM.x + ARM.w, ARM.y, ARM_Z + ARM_H + 18],
    ],
    WIDTH,
    HEIGHT,
    { pad: PAD, azimuth: AZIMUTH },
  );

export const P = fit();

export const at = (point: Point3): Flat => iso(point, P);

const origin = at([0, 0, 0]);
const axis = (point: Point3): Flat => {
  const moved = at(point);
  return [Math.round((moved[0] - origin[0]) * 1e4) / 1e4, Math.round((moved[1] - origin[1]) * 1e4) / 1e4];
};

/** Screen vectors of one world unit along x, y and z: all the client needs to move parts. */
export const AXES = { x: axis([1, 0, 0]), y: axis([0, 1, 0]), z: axis([0, 0, 1]) };
