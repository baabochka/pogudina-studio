import type { CSSProperties } from "react";

import BottomLeftCornerSvg from "./assets/board_corner_bottom_left.svg?react";
import BottomRightCornerSvg from "./assets/board_corner_bottom_right.svg?react";
import DecorativePawsLightSvg from "./assets/board_decorative_paws_light.svg?react";
import TopLeftCornerSvg from "./assets/board_corner_top_left.svg?react";
import TopRightCornerSvg from "./assets/board_corner_top_right.svg?react";
import { SCOREBOARD_RENDER_HEIGHT_PX } from "./boardLayoutConfig";
import type { BoardControlName } from "./gameBoardRoundConfig";
import { BOARD_CONTROL_HOVER_FILL_COLOR } from "./gameBoardRoundConfig";
import { BOARD_ART_STYLE } from "./boardSvgStyle";
import { BoardSvgAsset } from "./BoardSvgAsset";

const FIXED_CORNER_RENDER_SIZES = {
  topLeft: { width: 118, height: 83 },
  topRight: { width: 186, height: 83 },
  bottomLeft: { width: 118, height: 84 },
  bottomRight: { width: 186, height: 84 },
} as const;

function getAnchoredCornerStyle({
  anchorX,
  anchorY,
  renderSize,
}: {
  anchorX: "left" | "right";
  anchorY: "bottom" | "top";
  renderSize: { height: number; width: number };
}): CSSProperties {
  const style: CSSProperties = {
    position: "absolute",
    width: `${renderSize.width}px`,
    height: `${renderSize.height}px`,
  };

  if (anchorX === "left") {
    style.left = "0";
  } else {
    style.right = "0";
  }

  if (anchorY === "top") {
    style.top = `${SCOREBOARD_RENDER_HEIGHT_PX}px`;
  } else {
    style.bottom = "0";
  }

  return style;
}

function getDecorativePawsLightStyle(
): CSSProperties {
  return {
    position: "absolute",
    left: "3.5px",
    bottom: "85px",
    width: "25px",
    height: "40px",
  };
}

export function BoardDecorationLayer({
  hoveredControl,
  isPreviousReviewActive,
  isRulesActive,
  showPreviousControl,
}: {
  hoveredControl: BoardControlName | null;
  isPreviousReviewActive: boolean;
  isRulesActive: boolean;
  showPreviousControl: boolean;
}) {
  const decorationStyle = {
    ...BOARD_ART_STYLE,
    "--restart-button-fill":
      hoveredControl === "restart" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--rules-button-fill":
      hoveredControl === "rules" || isRulesActive
        ? BOARD_CONTROL_HOVER_FILL_COLOR
        : undefined,
    "--review-previous-fill":
      hoveredControl === "previous" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--five-card-mode-fill":
      hoveredControl === "five-card-mode"
        ? BOARD_CONTROL_HOVER_FILL_COLOR
        : undefined,
    "--review-previous-arrow-scale-x": isPreviousReviewActive ? "-1" : undefined,
    "--review-previous-arrow-opacity": showPreviousControl ? undefined : "0",
  } as CSSProperties;

  return (
    <>
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "left",
          anchorY: "top",
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
          renderSize: FIXED_CORNER_RENDER_SIZES.topRight,
        })}
      >
        <BoardSvgAsset Svg={TopRightCornerSvg} className="h-full w-full" style={decorationStyle} />
      </div>
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "left",
          anchorY: "bottom",
          renderSize: FIXED_CORNER_RENDER_SIZES.bottomLeft,
        })}
      >
        <BoardSvgAsset Svg={BottomLeftCornerSvg} className="h-full w-full" style={decorationStyle} />
      </div>
      <div
        className="absolute pointer-events-none"
        aria-hidden="true"
        style={getAnchoredCornerStyle({
          anchorX: "right",
          anchorY: "bottom",
          renderSize: FIXED_CORNER_RENDER_SIZES.bottomRight,
        })}
      >
        <BoardSvgAsset Svg={BottomRightCornerSvg} className="h-full w-full" style={decorationStyle} />
      </div>
      <div
        className="absolute pointer-events-none transition-[left,right,top,bottom,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        aria-hidden="true"
        style={getDecorativePawsLightStyle()}
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
