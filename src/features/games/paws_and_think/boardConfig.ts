import type { CSSProperties } from "react";

import type { ObjectName } from "./cardResolver";
import { basePalettes, fixedDetails, neutrals } from "./palettes";

export type PercentRect = {
  height: number;
  left: number;
  top: number;
  width: number;
};

export const BOARD_VIEWBOX = { width: 321.35, height: 483.89 } as const;

export const SCOREBOARD_RENDER_HEIGHT_PX = 64;
export const MODE_TRANSITION_MS = 320;

export const SHELL_SIZES = {
  expanded: {
    height: 617,
    width: 617,
  },
  compact: {
    height: 602.31,
    width: 400,
  },
} as const;

export const BOARD_PANEL_INSETS = {
  bottom: 40,
  left: 40,
  right: 80,
  top: 40,
} as const;

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
const TOKEN_HEIGHT =
  (DEFAULT_ANSWER_LAYOUT.mouse.height / 100) * BOARD_VIEWBOX.height;
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

export const ANSWER_TOKEN_SIZE_PX = 75;
export const SMALL_MODE_TOKEN_STACK_START_TOP_PX = 135;
export const SMALL_MODE_TOKEN_GAP_PX = 73;
export const LARGE_MODE_TOKEN_TOPS_PX: Record<ObjectName, number> = {
  mouse: 135,
  cat: 220,
  cheese: 295,
  ball: 375,
  pillow: 455,
};
export const ANSWER_TOKEN_ORDER: ObjectName[] = [
  "mouse",
  "cat",
  "cheese",
  "ball",
  "pillow",
];

export type BoardControlName =
  | "previous"
  | "restart"
  | "rules"
  | "five-card-mode";

export const BOARD_ANSWER_OPTIONS: ObjectName[] = [
  "mouse",
  "cat",
  "cheese",
  "ball",
  "pillow",
];

export const ANSWER_BUTTON_OVERLAYS: Record<
  ObjectName,
  { className: string; label: string }
> = {
  mouse: { className: "right-[0.3%] top-[23.8%] h-[12.8%] w-[19.3%]", label: "Mouse" },
  cat: { className: "right-[0.3%] top-[36.5%] h-[12.8%] w-[19.3%]", label: "Cat" },
  cheese: {
    className: "right-[0.3%] top-[48.6%] h-[12.8%] w-[19.3%]",
    label: "Cheese",
  },
  ball: { className: "right-[0.3%] top-[61.2%] h-[12.8%] w-[19.3%]", label: "Ball" },
  pillow: {
    className: "right-[0.3%] top-[73.7%] h-[12.8%] w-[19.3%]",
    label: "Pillow",
  },
};

export const ANSWER_BUTTON_CENTERS: Record<ObjectName, { x: number; y: number }> = {
  mouse: { x: 291.24, y: 140.67 },
  cat: { x: 291.24, y: 201.89 },
  cheese: { x: 291.24, y: 260.46 },
  ball: { x: 291.24, y: 321.68 },
  pillow: { x: 291.24, y: 381.89 },
};

export const BOARD_CONTROL_OVERLAYS: Record<
  BoardControlName,
  { className: string; label: string }
> = {
  previous: {
    className: "left-[0.9%] top-[11.1%] h-[11.4%] w-[13.8%]",
    label: "Review the previous card",
  },
  restart: {
    className: "right-[0.8%] top-[11.7%] h-[11.8%] w-[19.1%]",
    label: "Restart the round",
  },
  rules: {
    className: "left-[0.2%] bottom-[0.3%] h-[8.6%] w-[13.8%]",
    label: "Show the rules",
  },
  "five-card-mode": {
    className: "right-[0.4%] bottom-[0.1%] h-[13.1%] w-[20.8%]",
    label: "Switch to five card mode",
  },
};

export const CORRECT_ANSWER_PAW_FILL_COLOR = `${fixedDetails.accent.light}CC`;
export const INCORRECT_ANSWER_PAW_FILL_COLOR = `${basePalettes.red.light}CC`;
export const ANSWER_PAW_STROKE_COLOR = neutrals.black;
export const PAW_TRAIL_FILL_COLOR = `${fixedDetails.accent.light}D9`;
export const PAW_TRAIL_STROKE_COLOR = neutrals.black;
export const BOARD_CONTROL_HOVER_FILL_COLOR = fixedDetails.board.hover;

export type PawTrailStep = {
  key: string;
  left: string;
  top: string;
  rotation: string;
  delay: string;
};

export function createPawTrailSteps(
  from: { x: number; y: number },
  to: { x: number; y: number },
  count: number,
  runId: number,
  viewBox: { width: number; height: number } = BOARD_VIEWBOX,
): PawTrailStep[] {
  const verticalDistance = Math.abs(to.y - from.y);
  const controlX = (from.x + to.x) / 2 - (92 + verticalDistance * 0.18);
  const controlY = (from.y + to.y) / 2 + (to.y - from.y) * 0.18;

  return Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / (count + 1);
    const invT = 1 - t;
    const x = invT * invT * from.x + 2 * invT * t * controlX + t * t * to.x;
    const y = invT * invT * from.y + 2 * invT * t * controlY + t * t * to.y;

    const tangentX = 2 * invT * (controlX - from.x) + 2 * t * (to.x - controlX);
    const tangentY = 2 * invT * (controlY - from.y) + 2 * t * (to.y - controlY);
    const rotation = `${(Math.atan2(tangentY, tangentX) * 180) / Math.PI + 90}deg`;

    return {
      key: `paw-step-${runId}-${index}`,
      left: `${(x / viewBox.width) * 100}%`,
      top: `${(y / viewBox.height) * 100}%`,
      rotation,
      delay: `${index * 180}ms`,
    };
  });
}

export function getPawTrailStyle(step: PawTrailStep): CSSProperties {
  return {
    left: step.left,
    top: step.top,
    animationDelay: step.delay,
    "--paw-step-rotation": step.rotation,
  } as CSSProperties;
}

export const COMPACT_CARD_BOUNDS = {
  bottom: 40,
  left: 40,
  right: 80,
  top: SCOREBOARD_RENDER_HEIGHT_PX + BOARD_PANEL_INSETS.top,
} as const;

export type GuideBubbleName =
  | "changeLevel"
  | "gameRules"
  | "quickStart"
  | "reviewPrevious"
  | "startNewGame";

export type GuideBubbleBounds = {
  width: number;
  height: number;
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
};

export const QUICK_START_GUIDE_LAYOUT = {
  large: {
    bubbles: {
      reviewPrevious: { left: 15, top: 15, width: 115, height: 35 },
      startNewGame: { right: 15, top: 15, width: 115, height: 35 },
      quickStart: { right: 10, top: 96, width: 260, height: 270 },
      changeLevel: { right: 15, bottom: 15, width: 90, height: 35 },
      gameRules: { left: 15, bottom: 15, width: 90, height: 35 },
    },
  },
  small: {
    bubbles: {
      reviewPrevious: { left: 15, top: 15, width: 115, height: 35 },
      startNewGame: { right: 15, top: 15, width: 115, height: 35 },
      quickStart: { right: 10, top: 84, width: 260, height: 270 },
      changeLevel: { right: 15, bottom: 15, width: 90, height: 35 },
      gameRules: { left: 15, bottom: 15, width: 90, height: 35 },
    },
  },
} as const satisfies Record<"large" | "small", {
  bubbles: Record<GuideBubbleName, GuideBubbleBounds>;
}>;
