import { memo, type CSSProperties } from "react";

import BallComposedSvg from "./assets/answer_ball_composed.svg?react";
import CatComposedSvg from "./assets/answer_cat_composed.svg?react";
import CheeseComposedSvg from "./assets/answer_cheese_composed.svg?react";
import MouseComposedSvg from "./assets/answer_mouse_composed.svg?react";
import PillowComposedSvg from "./assets/answer_pillow_composed.svg?react";
import { BOARD_ART_STYLE } from "./boardSvgStyle";
import type { ObjectName } from "./cardResolver";
import {
  BOARD_ANSWER_OPTIONS,
  BOARD_CONTROL_HOVER_FILL_COLOR,
} from "./gameBoardRoundConfig";
import {
  BOARD_VIEWBOX,
  DEFAULT_ANSWER_LAYOUT,
  STRETCHED_ANSWER_LAYOUT,
  STRETCHED_BOARD_VIEWBOX,
} from "./boardLayoutConfig";
import { fixedDetails } from "./palettes";

const HIGHLIGHTED_ANSWER_PAW_SCALE = "0.65";
const ANSWER_TOKEN_SIZE_PX = 75;
const TOKEN_STACK_START_TOP_PX = 135;
const SMALL_MODE_TOKEN_GAP_PX = 73;
const LARGE_MODE_TOKEN_GAP_PX = 80;
const ANSWER_TOKEN_ORDER: ObjectName[] = [
  "mouse",
  "cat",
  "cheese",
  "ball",
  "pillow",
];

const ANSWER_ASSETS = {
  mouse: {
    Svg: MouseComposedSvg,
  },
  cat: {
    Svg: CatComposedSvg,
  },
  cheese: {
    Svg: CheeseComposedSvg,
  },
  ball: {
    Svg: BallComposedSvg,
  },
  pillow: {
    Svg: PillowComposedSvg,
  },
} satisfies Record<
  ObjectName,
  {
    Svg: typeof MouseComposedSvg;
  }
>;

function getRectStyle(
  layout: {
    height: number;
    left: number;
    top: number;
    width: number;
  },
  boardSize: { width: number; height: number },
  answer: ObjectName,
  isBoardStretched: boolean,
): CSSProperties {
  const formatPx = (value: number) => {
    const nearestInteger = Math.round(value);

    if (Math.abs(value) < 0.5) {
      return "0";
    }

    if (Math.abs(value - nearestInteger) < 0.1) {
      return `${nearestInteger}px`;
    }

    return `${value}px`;
  };

  const topPx = (layout.top / 100) * boardSize.height;
  const widthPx = ANSWER_TOKEN_SIZE_PX;
  const heightPx = ANSWER_TOKEN_SIZE_PX;
  const answerIndex = ANSWER_TOKEN_ORDER.indexOf(answer);
  const gapPx = isBoardStretched
    ? LARGE_MODE_TOKEN_GAP_PX
    : SMALL_MODE_TOKEN_GAP_PX;
  const stackedTopPx = TOKEN_STACK_START_TOP_PX + answerIndex * gapPx;

  return {
    right: "0",
    top: formatPx(answerIndex >= 0 ? stackedTopPx : topPx),
    width: formatPx(widthPx),
    height: formatPx(heightPx),
  };
}

const AnswerChoice = memo(function AnswerChoice({
  answer,
  canAnswer,
  disabledByOverlay,
  hasStarted,
  isActive,
  isHovered,
  isRoundFinished,
  highlightedAnswer,
  answerPawFillColor,
  answerPawStrokeColor,
  highlightedAnswerPawFillColor,
  highlightedAnswerPawStrokeColor,
  onAnswerBlur,
  onAnswerClick,
  onAnswerFocus,
  onAnswerHoverEnd,
  onAnswerHoverStart,
  style,
}: {
  answer: ObjectName;
  canAnswer: boolean;
  disabledByOverlay: boolean;
  hasStarted: boolean;
  isActive: boolean;
  isHovered: boolean;
  isRoundFinished: boolean;
  highlightedAnswer: ObjectName | null;
  answerPawFillColor?: string;
  answerPawStrokeColor?: string;
  highlightedAnswerPawFillColor?: string;
  highlightedAnswerPawStrokeColor?: string;
  onAnswerBlur: (answer: ObjectName) => void;
  onAnswerClick: (answer: ObjectName) => void;
  onAnswerFocus: (answer: ObjectName) => void;
  onAnswerHoverEnd: (answer: ObjectName) => void;
  onAnswerHoverStart: (answer: ObjectName) => void;
  style: CSSProperties;
}) {
  const { Svg } = ANSWER_ASSETS[answer];
  const backgroundColor = isHovered
    ? BOARD_CONTROL_HOVER_FILL_COLOR
    : fixedDetails.board.dark;
  const svgStyle = {
    color: backgroundColor,
    ...BOARD_ART_STYLE,
    [`--answer-paw-${answer}-fill`]: isActive
      ? answerPawFillColor
      : highlightedAnswer === answer
        ? highlightedAnswerPawFillColor
        : undefined,
    [`--answer-paw-${answer}-stroke`]: isActive
      ? answerPawStrokeColor
      : highlightedAnswer === answer
        ? highlightedAnswerPawStrokeColor
        : undefined,
    [`--answer-paw-${answer}-scale`]: isActive
      ? undefined
      : highlightedAnswer === answer
        ? HIGHLIGHTED_ANSWER_PAW_SCALE
        : undefined,
  } as CSSProperties;

  return (
    <div
      className="absolute transition-[right,top,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={style}
    >
      <Svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 card-svg h-full w-full"
        style={svgStyle}
      />
      <button
        type="button"
        onClick={() => onAnswerClick(answer)}
        onMouseEnter={() => onAnswerHoverStart(answer)}
        onMouseLeave={() => onAnswerHoverEnd(answer)}
        onFocus={() => onAnswerFocus(answer)}
        onBlur={() => onAnswerBlur(answer)}
        data-answer-object={answer}
        data-selected={isActive}
        data-hovered={isHovered}
        disabled={
          ((!hasStarted || !canAnswer) && !isRoundFinished) || disabledByOverlay
        }
        className="absolute inset-0 z-40 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default"
        aria-label={`Choose ${answer} as the answer`}
      />
    </div>
  );
});

export function AnswerChoicesLayer({
  canAnswer,
  disabledByOverlay,
  hasStarted,
  hoveredAnswer,
  isBoardStretched,
  isRoundFinished,
  onAnswerBlur,
  onAnswerClick,
  onAnswerFocus,
  onAnswerHoverEnd,
  onAnswerHoverStart,
  selectedAnswer,
  highlightedAnswer = null,
  answerPawFillColor,
  answerPawStrokeColor,
  highlightedAnswerPawFillColor,
  highlightedAnswerPawStrokeColor,
}: {
  canAnswer: boolean;
  disabledByOverlay: boolean;
  hasStarted: boolean;
  hoveredAnswer: ObjectName | null;
  isBoardStretched: boolean;
  isRoundFinished: boolean;
  onAnswerBlur: (answer: ObjectName) => void;
  onAnswerClick: (answer: ObjectName) => void;
  onAnswerFocus: (answer: ObjectName) => void;
  onAnswerHoverEnd: (answer: ObjectName) => void;
  onAnswerHoverStart: (answer: ObjectName) => void;
  selectedAnswer: ObjectName | null;
  highlightedAnswer?: ObjectName | null;
  answerPawFillColor?: string;
  answerPawStrokeColor?: string;
  highlightedAnswerPawFillColor?: string;
  highlightedAnswerPawStrokeColor?: string;
}) {
  const answerLayout = isBoardStretched
    ? STRETCHED_ANSWER_LAYOUT
    : DEFAULT_ANSWER_LAYOUT;
  const boardSize = isBoardStretched ? STRETCHED_BOARD_VIEWBOX : BOARD_VIEWBOX;

  return (
    <>
      {BOARD_ANSWER_OPTIONS.map((answer) => (
        <AnswerChoice
          key={answer}
          answer={answer}
          canAnswer={canAnswer}
          disabledByOverlay={disabledByOverlay}
          hasStarted={hasStarted}
          isActive={selectedAnswer === answer}
          isHovered={hoveredAnswer === answer}
          isRoundFinished={isRoundFinished}
          highlightedAnswer={highlightedAnswer}
          answerPawFillColor={answerPawFillColor}
          answerPawStrokeColor={answerPawStrokeColor}
          highlightedAnswerPawFillColor={highlightedAnswerPawFillColor}
          highlightedAnswerPawStrokeColor={highlightedAnswerPawStrokeColor}
          onAnswerBlur={onAnswerBlur}
          onAnswerClick={onAnswerClick}
          onAnswerFocus={onAnswerFocus}
          onAnswerHoverEnd={onAnswerHoverEnd}
          onAnswerHoverStart={onAnswerHoverStart}
          style={getRectStyle(
            answerLayout[answer],
            boardSize,
            answer,
            isBoardStretched,
          )}
        />
      ))}
    </>
  );
}
