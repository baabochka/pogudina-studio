import type { ObjectName } from "./cardResolver";

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
