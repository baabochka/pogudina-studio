import type { CSSProperties } from "react";

import BoardSvg from "../assets/paws_think_frame.svg?react";
import type { ObjectName } from "../cardResolver";
import type { BoardControlName } from "../gameBoardRoundConfig";
import {
  ANSWER_BUTTON_CENTERS,
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
  isBoardStretched?: boolean;
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
const BOARD_HORIZONTAL_STRETCH_SCALE = 3.5;
const BOARD_VERTICAL_STRETCH_SCALE = 1.2;
const RIGHT_FRAME_TOP_Y = 115.09;
const RIGHT_FRAME_X = 259.59;
const RIGHT_FRAME_WIDTH = 61.78;
const TOP_FRAME_WIDTH = 84.72;
const RIGHT_FRAME_HEIGHT = 304.96;
const LEFT_FRAME_HEIGHT = 303.11;
const TOKEN_STACK_CENTER_SPACING = 65;
const TOKEN_STACK_TOP_OFFSET = -20;
const TOKEN_WIDTH = (19.3 / 100) * 321.35;
const TOKEN_HEIGHT = (12.8 / 100) * 483.89;
const HORIZONTAL_STRETCH_OFFSET =
  (TOP_FRAME_WIDTH * (BOARD_HORIZONTAL_STRETCH_SCALE - 1)).toFixed(2);
const VERTICAL_STRETCH_OFFSET =
  (LEFT_FRAME_HEIGHT * (BOARD_VERTICAL_STRETCH_SCALE - 1)).toFixed(2);
const STRETCHED_RIGHT_FRAME_HEIGHT = RIGHT_FRAME_HEIGHT * BOARD_VERTICAL_STRETCH_SCALE;
const TOKEN_STACK_HEIGHT =
  TOKEN_HEIGHT + TOKEN_STACK_CENTER_SPACING * 4;
const TOKEN_STACK_TOP =
  RIGHT_FRAME_TOP_Y +
  (STRETCHED_RIGHT_FRAME_HEIGHT - TOKEN_STACK_HEIGHT) / 2 +
  TOKEN_STACK_TOP_OFFSET;
const TOKEN_STACK_LEFT =
  RIGHT_FRAME_X + Number(HORIZONTAL_STRETCH_OFFSET) + (RIGHT_FRAME_WIDTH - TOKEN_WIDTH) / 2;

const COMPACT_STACK_CENTERS = {
  mouse: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2,
  },
  cat: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING,
  },
  cheese: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 2,
  },
  ball: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 3,
  },
  pillow: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 4,
  },
} as const;

const ANSWER_GROUP_TRANSLATE_Y = {
  mouse: (COMPACT_STACK_CENTERS.mouse.y - ANSWER_BUTTON_CENTERS.mouse.y).toFixed(2),
  cat: (COMPACT_STACK_CENTERS.cat.y - ANSWER_BUTTON_CENTERS.cat.y).toFixed(2),
  cheese: (COMPACT_STACK_CENTERS.cheese.y - ANSWER_BUTTON_CENTERS.cheese.y).toFixed(2),
  ball: (COMPACT_STACK_CENTERS.ball.y - ANSWER_BUTTON_CENTERS.ball.y).toFixed(2),
  pillow: (COMPACT_STACK_CENTERS.pillow.y - ANSWER_BUTTON_CENTERS.pillow.y).toFixed(2),
} as const;

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
  isBoardStretched = false,
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
    "--board-top-right-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--board-bottom-right-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--board-bottom-right-translate-y": isBoardStretched
      ? `${VERTICAL_STRETCH_OFFSET}px`
      : undefined,
    "--board-bottom-left-translate-y": isBoardStretched
      ? `${VERTICAL_STRETCH_OFFSET}px`
      : undefined,
    "--board-decorative-paws-light-translate-y": isBoardStretched
      ? `${VERTICAL_STRETCH_OFFSET}px`
      : undefined,
    "--mouse-group-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--mouse-group-translate-y": isBoardStretched
      ? `${ANSWER_GROUP_TRANSLATE_Y.mouse}px`
      : undefined,
    "--cat-group-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--cat-group-translate-y": isBoardStretched
      ? `${ANSWER_GROUP_TRANSLATE_Y.cat}px`
      : undefined,
    "--cheese-group-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--cheese-group-translate-y": isBoardStretched
      ? `${ANSWER_GROUP_TRANSLATE_Y.cheese}px`
      : undefined,
    "--ball-group-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--ball-group-translate-y": isBoardStretched
      ? `${ANSWER_GROUP_TRANSLATE_Y.ball}px`
      : undefined,
    "--pillow-group-translate-x": isBoardStretched
      ? `${HORIZONTAL_STRETCH_OFFSET}px`
      : undefined,
    "--pillow-group-translate-y": isBoardStretched
      ? `${ANSWER_GROUP_TRANSLATE_Y.pillow}px`
      : undefined,
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
    <div className={className ?? ""}>
      <RawSvgIllustration
        Svg={BoardSvg}
        ariaLabel="Small game board illustration with scores"
        className="h-full w-auto"
        style={style}
      />
    </div>
  );
}
