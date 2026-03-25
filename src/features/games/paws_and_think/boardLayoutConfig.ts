import type { ObjectName } from "./cardResolver";
import type { BoardControlName } from "./gameBoardRoundConfig";

export type PercentRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export type BoardModeKey =
  | "single-card"
  | "three-card"
  | "four-card"
  | "five-card"
  | "six-card";

export const BOARD_SHELL_FOOTPRINT_CLASSES: Record<BoardModeKey, string> = {
  "single-card":
    "relative w-full max-w-[24rem] overflow-visible aspect-[321.35/483.89] lg:max-w-[400px]",
  "three-card":
    "relative w-full min-w-[615px] max-w-[617px] overflow-visible aspect-[540/540] sm:max-w-[661px] lg:max-w-[665px]",
  "four-card":
    "relative w-full min-w-[615px] max-w-[617px] overflow-visible aspect-[540/540] sm:max-w-[661px] lg:max-w-[665px]",
  "five-card":
    "relative w-full min-w-[615px] max-w-[617px] overflow-visible aspect-[540/540] sm:max-w-[661px] lg:max-w-[665px]",
  "six-card":
    "relative w-full min-w-[615px] max-w-[617px] overflow-visible aspect-[540/540] sm:max-w-[661px] lg:max-w-[665px]",
};

export const BOARD_VIEWBOX = { width: 321.35, height: 483.89 } as const;

export const BOARD_FRAME_PIECES = [
  { key: "right", x: 259.59, y: 115.09, width: 61.78, height: 304.96 },
  { key: "top", x: 90.92, y: 51.96, width: 84.72, height: 33.3 },
  { key: "bottom", x: 89.52, y: 450.58, width: 87.52, height: 33.3 },
  { key: "left", x: 0.02, y: 116.01, width: 28.38, height: 303.11 },
] as const;

export const SCORE_BACKGROUND_PIECE = {
  x: 0.02,
  y: 0,
  width: 321.34,
  height: 51.95,
} as const;

export const SCOREBOARD_RENDER_HEIGHT_PX = 64;

export const BOARD_HORIZONTAL_STRETCH_SCALE = 3.5;
export const STRETCHED_BOARD_WIDTH = 540;
export const HORIZONTAL_STRETCH_OFFSET =
  STRETCHED_BOARD_WIDTH - BOARD_VIEWBOX.width;
export const STRETCHED_BOARD_HEIGHT = 540;
export const STRETCHED_BOARD_HEIGHT_OFFSET =
  STRETCHED_BOARD_HEIGHT - BOARD_VIEWBOX.height;

export const STRETCHED_BOARD_VIEWBOX = {
  width: STRETCHED_BOARD_WIDTH,
  height: STRETCHED_BOARD_HEIGHT,
} as const;

export const SINGLE_CARD_CONTENT_BOUNDS: PercentRect = {
  left: 0,
  top: 11,
  width: 89,
  height: 89,
};

export const COMPACT_OVERLAY_BOUNDS: PercentRect = {
  left: 8.81,
  top: 17.62,
  width: 71.95,
  height: 75.49,
};

export const LARGE_CONTENT_BOUNDS = {
  x: 0.02,
  y: 51.95,
  width: BOARD_VIEWBOX.width,
  height: STRETCHED_BOARD_VIEWBOX.height - 51.95,
} as const;

export const DEFAULT_ANSWER_LAYOUT: Record<ObjectName, PercentRect> = {
  mouse: { left: 80.4, top: 23.8, width: 19.3, height: 12.8 },
  cat: { left: 80.4, top: 36.5, width: 19.3, height: 12.8 },
  cheese: { left: 80.4, top: 48.6, width: 19.3, height: 12.8 },
  ball: { left: 80.4, top: 61.2, width: 19.3, height: 12.8 },
  pillow: { left: 80.4, top: 73.7, width: 19.3, height: 12.8 },
};

export const CONTROL_LAYOUT: Record<BoardControlName, PercentRect> = {
  previous: { left: 0.9, top: 11.1, width: 13.8, height: 11.4 },
  restart: { left: 80.1, top: 11.7, width: 19.1, height: 11.8 },
  rules: { left: 0.2, top: 91.1, width: 13.8, height: 8.6 },
  "five-card-mode": { left: 78.8, top: 86.8, width: 20.8, height: 13.1 },
};

const FIVE_CARD_LAYOUT_VIEWBOX = {
  width: 494.68,
  height: 458.26,
} as const;

const SIX_CARD_SLOT_SOURCE = [
  { x: 49.16, y: 51.47, width: 114.24, height: 171.33 },
  { x: 176.19, y: 51.47, width: 114.24, height: 171.33 },
  { x: 303.22, y: 51.47, width: 114.24, height: 171.33 },
  { x: 49.16, y: 235.69, width: 114.24, height: 171.33 },
  { x: 176.19, y: 235.69, width: 114.24, height: 171.33 },
  { x: 303.22, y: 235.69, width: 114.24, height: 171.33 },
] as const;

function toRelativeSlotRect(slot: {
  height: number;
  width: number;
  x: number;
  y: number;
}) {
  return {
    height: (slot.height / FIVE_CARD_LAYOUT_VIEWBOX.height) * 100,
    left: (slot.x / FIVE_CARD_LAYOUT_VIEWBOX.width) * 100,
    top: (slot.y / FIVE_CARD_LAYOUT_VIEWBOX.height) * 100,
    width: (slot.width / FIVE_CARD_LAYOUT_VIEWBOX.width) * 100,
  } satisfies PercentRect;
}

const SIX_CARD_SLOTS = SIX_CARD_SLOT_SOURCE.map(toRelativeSlotRect);

export const BOARD_MODE_LAYOUTS: Record<
  BoardModeKey,
  {
    cardSlots: PercentRect[];
    contentBounds: PercentRect;
  }
> = {
  "single-card": {
    contentBounds: SINGLE_CARD_CONTENT_BOUNDS,
    cardSlots: [{ left: 0, top: 0, width: 100, height: 100 }],
  },
  "three-card": {
    contentBounds: {
      left: (LARGE_CONTENT_BOUNDS.x / STRETCHED_BOARD_VIEWBOX.width) * 100,
      top: (LARGE_CONTENT_BOUNDS.y / STRETCHED_BOARD_VIEWBOX.height) * 100,
      width:
        ((LARGE_CONTENT_BOUNDS.width + HORIZONTAL_STRETCH_OFFSET) /
          STRETCHED_BOARD_VIEWBOX.width) *
        100,
      height:
        (LARGE_CONTENT_BOUNDS.height / STRETCHED_BOARD_VIEWBOX.height) * 100,
    },
    cardSlots: [SIX_CARD_SLOTS[0], SIX_CARD_SLOTS[1], SIX_CARD_SLOTS[2]],
  },
  "four-card": {
    contentBounds: {
      left: (LARGE_CONTENT_BOUNDS.x / STRETCHED_BOARD_VIEWBOX.width) * 100,
      top: (LARGE_CONTENT_BOUNDS.y / STRETCHED_BOARD_VIEWBOX.height) * 100,
      width:
        ((LARGE_CONTENT_BOUNDS.width + HORIZONTAL_STRETCH_OFFSET) /
          STRETCHED_BOARD_VIEWBOX.width) *
        100,
      height:
        (LARGE_CONTENT_BOUNDS.height / STRETCHED_BOARD_VIEWBOX.height) * 100,
    },
    cardSlots: [SIX_CARD_SLOTS[0], SIX_CARD_SLOTS[2], SIX_CARD_SLOTS[3], SIX_CARD_SLOTS[5]],
  },
  "five-card": {
    contentBounds: {
      left: (LARGE_CONTENT_BOUNDS.x / STRETCHED_BOARD_VIEWBOX.width) * 100,
      top: (LARGE_CONTENT_BOUNDS.y / STRETCHED_BOARD_VIEWBOX.height) * 100,
      width:
        ((LARGE_CONTENT_BOUNDS.width + HORIZONTAL_STRETCH_OFFSET) /
          STRETCHED_BOARD_VIEWBOX.width) *
        100,
      height:
        (LARGE_CONTENT_BOUNDS.height / STRETCHED_BOARD_VIEWBOX.height) * 100,
    },
    cardSlots: [
      SIX_CARD_SLOTS[0],
      SIX_CARD_SLOTS[1],
      SIX_CARD_SLOTS[2],
      SIX_CARD_SLOTS[3],
      SIX_CARD_SLOTS[5],
    ],
  },
  "six-card": {
    contentBounds: {
      left: (LARGE_CONTENT_BOUNDS.x / STRETCHED_BOARD_VIEWBOX.width) * 100,
      top: (LARGE_CONTENT_BOUNDS.y / STRETCHED_BOARD_VIEWBOX.height) * 100,
      width:
        ((LARGE_CONTENT_BOUNDS.width + HORIZONTAL_STRETCH_OFFSET) /
          STRETCHED_BOARD_VIEWBOX.width) *
        100,
      height:
        (LARGE_CONTENT_BOUNDS.height / STRETCHED_BOARD_VIEWBOX.height) * 100,
    },
    cardSlots: SIX_CARD_SLOTS,
  },
};

const RIGHT_FRAME_X = BOARD_FRAME_PIECES[0].x;
const RIGHT_FRAME_TOP_Y = BOARD_FRAME_PIECES[0].y;
const RIGHT_FRAME_WIDTH = BOARD_FRAME_PIECES[0].width;
const RIGHT_FRAME_HEIGHT = BOARD_FRAME_PIECES[0].height;
const TOKEN_STACK_CENTER_SPACING = 65;
const TOKEN_STACK_TOP_OFFSET = -20;
const TOKEN_WIDTH = (DEFAULT_ANSWER_LAYOUT.mouse.width / 100) * BOARD_VIEWBOX.width;
const TOKEN_HEIGHT = (DEFAULT_ANSWER_LAYOUT.mouse.height / 100) * BOARD_VIEWBOX.height;
const STRETCHED_RIGHT_FRAME_HEIGHT =
  RIGHT_FRAME_HEIGHT + STRETCHED_BOARD_HEIGHT_OFFSET;
const TOKEN_STACK_HEIGHT =
  TOKEN_HEIGHT + TOKEN_STACK_CENTER_SPACING * 4;
const TOKEN_STACK_TOP =
  RIGHT_FRAME_TOP_Y +
  (STRETCHED_RIGHT_FRAME_HEIGHT - TOKEN_STACK_HEIGHT) / 2 +
  TOKEN_STACK_TOP_OFFSET;
const TOKEN_STACK_LEFT =
  RIGHT_FRAME_X + HORIZONTAL_STRETCH_OFFSET + (RIGHT_FRAME_WIDTH - TOKEN_WIDTH) / 2;

export const STRETCHED_ANSWER_LAYOUT: Record<ObjectName, PercentRect> = {
  mouse: {
    left: (TOKEN_STACK_LEFT / STRETCHED_BOARD_VIEWBOX.width) * 100,
    top: (TOKEN_STACK_TOP / STRETCHED_BOARD_VIEWBOX.height) * 100,
    width: (TOKEN_WIDTH / STRETCHED_BOARD_VIEWBOX.width) * 100,
    height: (TOKEN_HEIGHT / STRETCHED_BOARD_VIEWBOX.height) * 100,
  },
  cat: {
    left: (TOKEN_STACK_LEFT / STRETCHED_BOARD_VIEWBOX.width) * 100,
    top:
      ((TOKEN_STACK_TOP + TOKEN_STACK_CENTER_SPACING) /
        STRETCHED_BOARD_VIEWBOX.height) *
      100,
    width: (TOKEN_WIDTH / STRETCHED_BOARD_VIEWBOX.width) * 100,
    height: (TOKEN_HEIGHT / STRETCHED_BOARD_VIEWBOX.height) * 100,
  },
  cheese: {
    left: (TOKEN_STACK_LEFT / STRETCHED_BOARD_VIEWBOX.width) * 100,
    top:
      ((TOKEN_STACK_TOP + TOKEN_STACK_CENTER_SPACING * 2) /
        STRETCHED_BOARD_VIEWBOX.height) *
      100,
    width: (TOKEN_WIDTH / STRETCHED_BOARD_VIEWBOX.width) * 100,
    height: (TOKEN_HEIGHT / STRETCHED_BOARD_VIEWBOX.height) * 100,
  },
  ball: {
    left: (TOKEN_STACK_LEFT / STRETCHED_BOARD_VIEWBOX.width) * 100,
    top:
      ((TOKEN_STACK_TOP + TOKEN_STACK_CENTER_SPACING * 3) /
        STRETCHED_BOARD_VIEWBOX.height) *
      100,
    width: (TOKEN_WIDTH / STRETCHED_BOARD_VIEWBOX.width) * 100,
    height: (TOKEN_HEIGHT / STRETCHED_BOARD_VIEWBOX.height) * 100,
  },
  pillow: {
    left: (TOKEN_STACK_LEFT / STRETCHED_BOARD_VIEWBOX.width) * 100,
    top:
      ((TOKEN_STACK_TOP + TOKEN_STACK_CENTER_SPACING * 4) /
        STRETCHED_BOARD_VIEWBOX.height) *
      100,
    width: (TOKEN_WIDTH / STRETCHED_BOARD_VIEWBOX.width) * 100,
    height: (TOKEN_HEIGHT / STRETCHED_BOARD_VIEWBOX.height) * 100,
  },
};

export const STRETCHED_ANSWER_CENTERS: Record<ObjectName, { x: number; y: number }> = {
  mouse: { x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2, y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 },
  cat: { x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2, y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING },
  cheese: { x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2, y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 2 },
  ball: { x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2, y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 3 },
  pillow: { x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2, y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 4 },
};
