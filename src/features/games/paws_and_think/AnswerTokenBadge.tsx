import type { CSSProperties } from "react";

import BallComposedSvg from "./assets/answer_ball_composed.svg?react";
import CatComposedSvg from "./assets/answer_cat_composed.svg?react";
import CheeseComposedSvg from "./assets/answer_cheese_composed.svg?react";
import MouseComposedSvg from "./assets/answer_mouse_composed.svg?react";
import PillowComposedSvg from "./assets/answer_pillow_composed.svg?react";
import { BOARD_ART_STYLE } from "./boardSvgStyle";
import type { ObjectName } from "./cardResolver";
import { fixedDetails } from "./palettes";

const TOKEN_BADGE_ASSETS = {
  mouse: MouseComposedSvg,
  cat: CatComposedSvg,
  cheese: CheeseComposedSvg,
  ball: BallComposedSvg,
  pillow: PillowComposedSvg,
} satisfies Record<ObjectName, typeof MouseComposedSvg>;

export function AnswerTokenBadge({
  answer,
  bottom = "-12px",
  scale = 1,
}: {
  answer: ObjectName;
  bottom?: string;
  scale?: number;
}) {
  const Svg = TOKEN_BADGE_ASSETS[answer];
  const tokenTransform =
    answer === "ball"
      ? "translateY(1px)"
      : answer === "cat"
        ? "translateY(1px)"
      : answer === "pillow"
        ? "translateY(1px)"
        : undefined;
  const svgStyle = {
    ...BOARD_ART_STYLE,
    color: "transparent",
    [`--answer-paw-${answer}-fill`]: "transparent",
    [`--answer-paw-${answer}-stroke`]: "transparent",
    transform: tokenTransform,
  } as CSSProperties;
  const badgeSize = 35 * scale;
  const badgeBorder = 2 * scale;
  const tokenSize = 24 * scale;

  return (
    <div
      className="pointer-events-none absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-full bg-white"
      style={{
        width: `${badgeSize}px`,
        height: `${badgeSize}px`,
        bottom,
        border: `${badgeBorder}px solid ${fixedDetails.board.dark}`,
      }}
      aria-hidden="true"
    >
      <Svg
        className="card-svg"
        style={{
          ...svgStyle,
          width: `${tokenSize}px`,
          height: `${tokenSize}px`,
        }}
      />
    </div>
  );
}
