import type { CSSProperties } from "react";

import BoardSvg from "../assets/paws_think_frame.svg?react";
import { BoardDecorationLayer } from "../BoardDecorationLayer";
import { BoardFrame } from "../BoardFrame";
import type { ObjectName } from "../cardResolver";
import type { BoardControlName } from "../gameBoardRoundConfig";
import {
  BOARD_CONTROL_HOVER_FILL_COLOR,
} from "../gameBoardRoundConfig";
import { basePalettes, fixedDetails, neutrals } from "../palettes";
import { RawSvgIllustration } from "./RawSvgIllustration";

type GameBoardSmallIllustrationProps = {
  className?: string;
  selectedAnswer?: ObjectName;
  hoveredAnswer?: ObjectName;
  hoveredControl?: BoardControlName;
  isPreviousReviewActive?: boolean;
  isRulesActive?: boolean;
  showPreviousControl?: boolean;
  answerPawFillColor?: string;
  answerPawStrokeColor?: string;
  highlightedAnswer?: ObjectName;
  highlightedAnswerPawFillColor?: string;
  highlightedAnswerPawStrokeColor?: string;
};

const BOARD_STYLE: CSSProperties = {
  "--white": neutrals.white,
  "--black": neutrals.black,
  "--outline": neutrals.black,
  "--board-light": fixedDetails.board.light,
  "--board-light-fill": fixedDetails.board.light,
  "--board-dark": fixedDetails.board.dark,
  "--cat-light": basePalettes.orange.light,
  "--cat-shade": basePalettes.orange.shade,
  "--mouse-light": basePalettes.grey.light,
  "--mouse-shade": basePalettes.grey.shade,
  "--cheese-light": basePalettes.yellow.light,
  "--cheese-shade": basePalettes.yellow.shade,
  "--ball-light": basePalettes.blue.light,
  "--ball-shade": basePalettes.blue.shade,
  "--pillow-light": basePalettes.red.light,
  "--pillow-shade": basePalettes.red.shade,
  "--accent-light": fixedDetails.accent.light,
  "--accent-shade": fixedDetails.accent.shade,
} as CSSProperties;

const HIGHLIGHTED_ANSWER_PAW_SCALE = "0.65";

export function GameBoardSmallIllustration({
  className,
  selectedAnswer,
  hoveredAnswer,
  hoveredControl,
  isPreviousReviewActive,
  isRulesActive,
  showPreviousControl = true,
  answerPawFillColor,
  answerPawStrokeColor,
  highlightedAnswer,
  highlightedAnswerPawFillColor,
  highlightedAnswerPawStrokeColor,
}: GameBoardSmallIllustrationProps) {
  const style = {
    ...BOARD_STYLE,
    "--answer-button-bg-mouse-fill":
      hoveredAnswer === "mouse" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--answer-button-bg-cat-fill":
      hoveredAnswer === "cat" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--answer-button-bg-cheese-fill":
      hoveredAnswer === "cheese" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--answer-button-bg-ball-fill":
      hoveredAnswer === "ball" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--answer-button-bg-pillow-fill":
      hoveredAnswer === "pillow" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--restart-button-fill":
      hoveredControl === "restart" ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    "--rules-button-fill":
      hoveredControl === "rules" || isRulesActive
        ? BOARD_CONTROL_HOVER_FILL_COLOR
        : undefined,
    "--review-previous-fill":
      hoveredControl === "previous"
        ? BOARD_CONTROL_HOVER_FILL_COLOR
        : undefined,
    "--five-card-mode-fill":
      hoveredControl === "five-card-mode"
        ? BOARD_CONTROL_HOVER_FILL_COLOR
        : undefined,
    "--review-previous-arrow-scale-x": isPreviousReviewActive
      ? "-1"
      : undefined,
    "--review-previous-arrow-opacity": showPreviousControl ? undefined : "0",
    "--answer-paw-mouse-fill":
      selectedAnswer === "mouse"
        ? answerPawFillColor
        : highlightedAnswer === "mouse"
          ? highlightedAnswerPawFillColor
          : undefined,
    "--answer-paw-mouse-stroke":
      selectedAnswer === "mouse"
        ? answerPawStrokeColor
        : highlightedAnswer === "mouse"
          ? highlightedAnswerPawStrokeColor
          : undefined,
    "--answer-paw-mouse-scale":
      selectedAnswer === "mouse"
        ? undefined
        : highlightedAnswer === "mouse"
          ? HIGHLIGHTED_ANSWER_PAW_SCALE
          : undefined,
    "--answer-paw-cat-fill":
      selectedAnswer === "cat"
        ? answerPawFillColor
        : highlightedAnswer === "cat"
          ? highlightedAnswerPawFillColor
          : undefined,
    "--answer-paw-cat-stroke":
      selectedAnswer === "cat"
        ? answerPawStrokeColor
        : highlightedAnswer === "cat"
          ? highlightedAnswerPawStrokeColor
          : undefined,
    "--answer-paw-cat-scale":
      selectedAnswer === "cat"
        ? undefined
        : highlightedAnswer === "cat"
          ? HIGHLIGHTED_ANSWER_PAW_SCALE
          : undefined,
    "--answer-paw-cheese-fill":
      selectedAnswer === "cheese"
        ? answerPawFillColor
        : highlightedAnswer === "cheese"
          ? highlightedAnswerPawFillColor
          : undefined,
    "--answer-paw-cheese-stroke":
      selectedAnswer === "cheese"
        ? answerPawStrokeColor
        : highlightedAnswer === "cheese"
          ? highlightedAnswerPawStrokeColor
          : undefined,
    "--answer-paw-cheese-scale":
      selectedAnswer === "cheese"
        ? undefined
        : highlightedAnswer === "cheese"
          ? HIGHLIGHTED_ANSWER_PAW_SCALE
          : undefined,
    "--answer-paw-ball-fill":
      selectedAnswer === "ball"
        ? answerPawFillColor
        : highlightedAnswer === "ball"
          ? highlightedAnswerPawFillColor
          : undefined,
    "--answer-paw-ball-stroke":
      selectedAnswer === "ball"
        ? answerPawStrokeColor
        : highlightedAnswer === "ball"
          ? highlightedAnswerPawStrokeColor
          : undefined,
    "--answer-paw-ball-scale":
      selectedAnswer === "ball"
        ? undefined
        : highlightedAnswer === "ball"
          ? HIGHLIGHTED_ANSWER_PAW_SCALE
          : undefined,
    "--answer-paw-pillow-fill":
      selectedAnswer === "pillow"
        ? answerPawFillColor
        : highlightedAnswer === "pillow"
          ? highlightedAnswerPawFillColor
          : undefined,
    "--answer-paw-pillow-stroke":
      selectedAnswer === "pillow"
        ? answerPawStrokeColor
        : highlightedAnswer === "pillow"
          ? highlightedAnswerPawStrokeColor
          : undefined,
    "--answer-paw-pillow-scale":
      selectedAnswer === "pillow"
        ? undefined
        : highlightedAnswer === "pillow"
          ? HIGHLIGHTED_ANSWER_PAW_SCALE
          : undefined,
  } as CSSProperties;

  return (
    <div className={`relative aspect-[321.35/483.89] ${className ?? ""}`}>
      <BoardFrame />
      <RawSvgIllustration
        Svg={BoardSvg}
        ariaLabel="Small game board illustration"
        className="absolute inset-0 h-full w-full"
        style={style}
      />
      <BoardDecorationLayer
        hoveredControl={hoveredControl ?? null}
        isPreviousReviewActive={Boolean(isPreviousReviewActive)}
        isRulesActive={Boolean(isRulesActive)}
        showPreviousControl={showPreviousControl}
      />
    </div>
  );
}
