// The Najdi switchboard: world layout and camera.
// World units are about 1 px of the drawn object: x along the console, y toward
// the operator (the front), z up. Everything here is plain data so the server art,
// the verification build and the client motion read the same numbers.
import { fitProjection, iso } from "../../iso/iso-kit.mjs";

export const WIDTH = 600;
export const HEIGHT = 392;
export const AZIMUTH = 67;
export const ELEVATION = 25;

/** The bench plate the console stands on. */
export const PLATE = { x: -146, y: -70, w: 292, d: 134, r: 10 };
export const PLATE_H = 9;
export const FOOT_H = 5;

/** The console: a cabinet carrying the jack field, and a keyshelf in front of it. */
export const PLINTH = { x: -124, y: -50, w: 248, d: 84, r: 3 };
export const PLINTH_H = 6;
export const CAB = { x: -128, y: -54, w: 256, d: 38, r: 4 };
export const CAB_TOP = 124;
export const CAP = { x: -131, y: -57, w: 262, d: 45, r: 5 };
export const CAP_H = 6;
export const FACE_Y = CAB.y + CAB.d; // -16, the cabinet's front face
export const SHELF = { x: -128, y: FACE_Y, w: 256, d: 52, r: 3 };
export const SHELF_Z = 36; // top of the shelf box
export const BOARD = { x: -130, y: FACE_Y, w: 260, d: 56, r: 4 }; // the writing board on top
export const BOARD_H = 4;
export const DESK = SHELF_Z + BOARD_H; // 40, the working surface

/** The enamel jack panel set into the cabinet front. */
export const PANEL = { x0: -117, x1: 117, z0: 50, z1: 116, r: 3 };
export const PANEL_T = 1.2;
export const PANEL_Y = FACE_Y + PANEL_T; // the panel's face plane
export const JACK_Z = 83;
export const LAMP_Z = 101;
export const BUSH_R = 3.6;
export const BUSH_T = 2.2;
export const BORE_R = 1.7;
export const JACK_FACE = PANEL_Y + BUSH_T; // where a plug's collar lands
export const LAMP_BEZEL_R = 4.9;
export const LAMP_BEZEL_T = 1.8;
export const LENS_R = 3.6;
export const LENS_H = 2.4;

/** Jacks on the row, by name. Four incoming lines, a rest jack, the agent and the employee. */
export const LINES = [-103, -85, -67, -49];
export const JACKS = {
  l1: LINES[0],
  l2: LINES[1],
  l3: LINES[2],
  l4: LINES[3],
  park: -27,
  ai: -5,
  staff: 17,
};
/** Jacks with a lamp above them. The rest jack has none. */
export const LAMPED = ["l1", "l2", "l3", "l4", "ai", "staff"];
/** The line the illustrative call comes in on. */
export const CALL_LINE = "l2";

/** The speaker on the panel's right: the agent's voice, and the play control. */
export const SPEAKER = { x: 71, z: 83, r: 23, rim: 19.4 };
/** The speaker's port: closed slots in the enamel between the employee's jack and the grille. */
export const PORT = { x0: 30, x1: 42, h: 2, z: [72, 77.5, 83, 88.5, 94] };
/** The row of line fuses along the bottom of the panel, one under each lamped circuit. */
export const FUSE_Z = 59;
/** A rating plate on the bench, right of the keyshelf. */
export const RATING = { x: 132.5, y: 20, w: 8, d: 28, r: 1.2 };

/** Plugs: turned along +y, their collar on the jack face. */
export const PLUG = { collar: [0, 1.2, 2.5], body: [1.2, 8.6, 2.75], boot: [8.6, 13.2], r: 2.75 };
export const PLUG_LEN = 13.2;
export const PLUG_OUT = 8; // how far a plug is drawn out before it travels
export const CORD_R = 1.05;

/** Keyshelf furniture. */
export const DIAL = { x: -99, y: 15, plate: 15.5, knob: 8.2, knobH: 7 };
export const DIAL_ANGLES = { saudi: 132, arabic: 180, english: 228 }; // degrees from -y, clockwise from above: the three face the operator
export const STAMP = { x: 30, y: 19 };
export const CARD = { x: 16, y: 2, w: 28, d: 22 };
export const PRINTER = { x: -66, y: 2, w: 42, d: 26, h: 14 };
export const SLOT = { x0: -59, x1: -31, z: 45.4, gap: 1.4 };
export const TICKET = { x0: -57, x1: -33, length: 26, out: 19, t: 0.5 };
export const KEYS = { x: 76, y: 16, pitch: 15, count: 3 };

/** Where the trunk cable leaves the cabinet side for the line box on the bench. */
export const GLAND = { y: -47, z: 58 };
export const LINEBOX = { x: 133, y: -67, w: 11, d: 24, h: 12, r: 1.4 };

export const P = fitProjection(
  [
    ...[PLATE.x, PLATE.x + PLATE.w].flatMap((x) => [PLATE.y, PLATE.y + PLATE.d].flatMap((y) => [[x, y, -PLATE_H - FOOT_H], [x, y, 0]])),
    ...[CAP.x, CAP.x + CAP.w].flatMap((x) => [CAP.y, CAP.y + CAP.d].map((y) => [x, y, CAB_TOP + CAP_H])),
  ],
  WIDTH,
  HEIGHT,
  { pad: 22, azimuth: AZIMUTH, elevation: ELEVATION },
);

export const at = (point) => iso(point, P);

/**
 * The frameless hero's viewBox: the drawing's own extent (at rest and in every
 * pose of the tour: plugs out, cord sagging, ticket out) with a few units for
 * the halo, inside the 600 × 392 the projection was fitted to. Without a card
 * the empty margin round the machine only made it smaller on the page. Parts
 * and the halo may still run past it (the SVG is overflow: visible).
 */
export const FRAME = { x: 46, y: 12, width: 508, height: 368 };
