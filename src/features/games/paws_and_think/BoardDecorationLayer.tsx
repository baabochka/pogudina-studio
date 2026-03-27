import type { CSSProperties } from "react";

import BottomLeftCornerSvg from "./assets/board_corner_bottom_left.svg?react";
import BottomRightCornerSvg from "./assets/board_corner_bottom_right.svg?react";
import DecorativePawsLightSvg from "./assets/board_decorative_paws_light.svg?react";
import TopLeftCornerSvg from "./assets/board_corner_top_left.svg?react";
import TopRightCornerSvg from "./assets/board_corner_top_right.svg?react";
import { BOARD_ART_STYLE } from "./boardSvgStyle";
import { BoardSvgAsset } from "./BoardSvgAsset";
import { BOARD_CONTROL_HOVER_FILL_COLOR } from "./gameBoardRoundConfig";

const FIXED_CORNER_RENDER_SIZES = {
  topLeft: { width: 118, height: 83 },
  topRight: { width: 186, height: 83 },
  bottomLeft: { width: 118, height: 84 },
  bottomRight: { width: 186, height: 84 },
} as const;

function getAnchoredCornerStyle({
  anchorX,
  anchorY,
  offsetX,
  offsetY,
  renderSize,
}: {
  anchorX: "left" | "right";
  anchorY: "bottom" | "top";
  offsetX: number;
  offsetY: number;
  renderSize: { height: number; width: number };
}): CSSProperties {
  return {
    position: "absolute",
    width: `${renderSize.width}px`,
    height: `${renderSize.height}px`,
    [anchorX]: `${offsetX}px`,
    [anchorY]: `${offsetY}px`,
  };
}

export function BoardDecorationLayer({
  isPreviousReviewActive,
  isPreviousReviewHovered,
  isRestartHovered,
  isModeHovered,
  isRulesActive,
  isRulesHovered,
  showPreviousControl = true,
}: {
  isPreviousReviewActive: boolean;
  isPreviousReviewHovered: boolean;
  isRestartHovered: boolean;
  isModeHovered: boolean;
  isRulesActive: boolean;
  isRulesHovered: boolean;
  showPreviousControl?: boolean;
}) {
  const decorationStyle = {
    ...BOARD_ART_STYLE,
    "--restart-button-fill": isRestartHovered
      ? BOARD_CONTROL_HOVER_FILL_COLOR
      : undefined,
    "--review-previous-fill": isPreviousReviewHovered
      ? BOARD_CONTROL_HOVER_FILL_COLOR
      : undefined,
    "--review-previous-arrow-scale-x": isPreviousReviewActive ? "-1" : undefined,
    "--review-previous-arrow-opacity": showPreviousControl ? undefined : "0",
    "--five-card-mode-fill":
      isModeHovered ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--rules-button-fill":
      isRulesActive || isRulesHovered
        ? BOARD_CONTROL_HOVER_FILL_COLOR
        : undefined,
  } as CSSProperties;

  return (
    <>
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "left",
          anchorY: "top",
          offsetX: -40,
          offsetY: -40,
          renderSize: FIXED_CORNER_RENDER_SIZES.topLeft,
        })}
      >
        <BoardSvgAsset
          Svg={TopLeftCornerSvg}
          className="h-full w-full"
          style={decorationStyle}
        />
      </div>

      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "right",
          anchorY: "top",
          offsetX: -80,
          offsetY: -40,
          renderSize: FIXED_CORNER_RENDER_SIZES.topRight,
        })}
      >
        <BoardSvgAsset
          Svg={TopRightCornerSvg}
          className="h-full w-full"
          style={decorationStyle}
        />
      </div>

      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "left",
          anchorY: "bottom",
          offsetX: -40,
          offsetY: -40,
          renderSize: FIXED_CORNER_RENDER_SIZES.bottomLeft,
        })}
      >
        <BoardSvgAsset
          Svg={BottomLeftCornerSvg}
          className="h-full w-full"
          style={decorationStyle}
        />
      </div>

      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "right",
          anchorY: "bottom",
          offsetX: -80,
          offsetY: -40,
          renderSize: FIXED_CORNER_RENDER_SIZES.bottomRight,
        })}
      >
        <BoardSvgAsset
          Svg={BottomRightCornerSvg}
          className="h-full w-full"
          style={decorationStyle}
        />
      </div>

      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-36.5px",
          bottom: "45px",
          width: "25px",
          height: "40px",
        }}
      >
        <BoardSvgAsset
          Svg={DecorativePawsLightSvg}
          className="h-full w-full"
          style={decorationStyle}
        />
      </div>
    </>
  );
}
