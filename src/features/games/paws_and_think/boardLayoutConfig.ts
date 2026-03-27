import type { ObjectName } from "./cardResolver";

export type PercentRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export const BOARD_VIEWBOX = { width: 321.35, height: 483.89 } as const;

export const SCOREBOARD_RENDER_HEIGHT_PX = 64;

export const STRETCHED_BOARD_WIDTH = 540;
export const STRETCHED_BOARD_HEIGHT = 540;

export const STRETCHED_BOARD_VIEWBOX = {
  width: STRETCHED_BOARD_WIDTH,
  height: STRETCHED_BOARD_HEIGHT,
} as const;

export const DEFAULT_ANSWER_LAYOUT: Record<ObjectName, PercentRect> = {
  mouse: { left: 80.4, top: 23.8, width: 19.3, height: 12.8 },
  cat: { left: 80.4, top: 36.5, width: 19.3, height: 12.8 },
  cheese: { left: 80.4, top: 48.6, width: 19.3, height: 12.8 },
  ball: { left: 80.4, top: 61.2, width: 19.3, height: 12.8 },
  pillow: { left: 80.4, top: 73.7, width: 19.3, height: 12.8 },
};

const RIGHT_FRAME_X = 259.59;
const RIGHT_FRAME_TOP_Y = 115.09;
const RIGHT_FRAME_WIDTH = 61.78;
const RIGHT_FRAME_HEIGHT = 304.96;
const TOKEN_STACK_CENTER_SPACING = 65;
const TOKEN_STACK_TOP_OFFSET = -20;
const TOKEN_WIDTH = (DEFAULT_ANSWER_LAYOUT.mouse.width / 100) * BOARD_VIEWBOX.width;
const TOKEN_HEIGHT = (DEFAULT_ANSWER_LAYOUT.mouse.height / 100) * BOARD_VIEWBOX.height;
const HORIZONTAL_STRETCH_OFFSET = STRETCHED_BOARD_WIDTH - BOARD_VIEWBOX.width;
const STRETCHED_RIGHT_FRAME_HEIGHT =
  RIGHT_FRAME_HEIGHT + (STRETCHED_BOARD_HEIGHT - BOARD_VIEWBOX.height);
const TOKEN_STACK_HEIGHT = TOKEN_HEIGHT + TOKEN_STACK_CENTER_SPACING * 4;
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
