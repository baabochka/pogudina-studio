import type { CSSProperties } from 'react'

import BoardSvg from '../assets/game_board_small_with_scores.svg?react'
import type { ObjectName } from '../cardResolver'
import type { BoardControlName } from '../gameBoardRoundConfig'
import {
  ANSWER_BUTTON_CENTERS,
  BOARD_CONTROL_HOVER_FILL_COLOR,
  BOARD_VIEWBOX,
} from '../gameBoardRoundConfig'
import { basePalettes, fixedDetails, neutrals } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { HintPawStep } from '../HintPawStep'

type GameBoardSmallIllustrationProps = {
  className?: string
  selectedAnswer?: ObjectName
  hoveredAnswer?: ObjectName
  hoveredControl?: BoardControlName
  isPreviousReviewActive?: boolean
  showPreviousControl?: boolean
  answerPawFillColor?: string
  answerPawStrokeColor?: string
  highlightedAnswer?: ObjectName
  highlightedAnswerPawFillColor?: string
  highlightedAnswerPawStrokeColor?: string
  highlightedAnswerPawClassName?: string
}

const BOARD_STYLE: CSSProperties = {
  '--white': neutrals.white,
  '--black': neutrals.black,
  '--outline': neutrals.black,
  '--board-light': fixedDetails.board.light,
  '--board-dark': fixedDetails.board.dark,
  '--cat-light': basePalettes.orange.light,
  '--cat-shade': basePalettes.orange.shade,
  '--mouse-light': basePalettes.grey.light,
  '--mouse-shade': basePalettes.grey.shade,
  '--cheese-light': basePalettes.yellow.light,
  '--cheese-shade': basePalettes.yellow.shade,
  '--ball-light': basePalettes.blue.light,
  '--ball-shade': basePalettes.blue.shade,
  '--pillow-light': basePalettes.red.light,
  '--pillow-shade': basePalettes.red.shade,
  '--accent-light': fixedDetails.accent.light,
  '--accent-shade': fixedDetails.accent.shade,
} as CSSProperties

export function GameBoardSmallIllustration({
  className,
  selectedAnswer,
  hoveredAnswer,
  hoveredControl,
  isPreviousReviewActive,
  showPreviousControl = true,
  answerPawFillColor,
  answerPawStrokeColor,
  highlightedAnswer,
  highlightedAnswerPawFillColor,
  highlightedAnswerPawStrokeColor,
  highlightedAnswerPawClassName,
}: GameBoardSmallIllustrationProps) {
  const selectedPosition = selectedAnswer
    ? {
        left: `${(ANSWER_BUTTON_CENTERS[selectedAnswer].x / BOARD_VIEWBOX.width) * 100}%`,
        top: `${(ANSWER_BUTTON_CENTERS[selectedAnswer].y / BOARD_VIEWBOX.height) * 100}%`,
        fill: answerPawFillColor,
        stroke: answerPawStrokeColor,
      }
    : null

  const highlightedPosition =
    highlightedAnswer && highlightedAnswer !== selectedAnswer
      ? {
          left: `${(ANSWER_BUTTON_CENTERS[highlightedAnswer].x / BOARD_VIEWBOX.width) * 100}%`,
          top: `${(ANSWER_BUTTON_CENTERS[highlightedAnswer].y / BOARD_VIEWBOX.height) * 100}%`,
          fill: highlightedAnswerPawFillColor,
          stroke: highlightedAnswerPawStrokeColor,
        }
      : null

  const style = {
    ...BOARD_STYLE,
    '--answer-button-bg-mouse-fill':
      hoveredAnswer === 'mouse' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--answer-button-bg-cat-fill':
      hoveredAnswer === 'cat' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--answer-button-bg-cheese-fill':
      hoveredAnswer === 'cheese' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--answer-button-bg-ball-fill':
      hoveredAnswer === 'ball' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--answer-button-bg-pillow-fill':
      hoveredAnswer === 'pillow' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--restart-button-fill':
      hoveredControl === 'restart' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--rules-button-fill':
      hoveredControl === 'rules' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--review-previous-fill':
      hoveredControl === 'previous' ? BOARD_CONTROL_HOVER_FILL_COLOR : undefined,
    '--review-previous-arrow-scale-x': isPreviousReviewActive ? '-1' : undefined,
    '--review-previous-arrow-opacity': showPreviousControl ? undefined : '0',
  } as CSSProperties

  return (
    <div className={`relative ${className ?? ''}`}>
      <RawSvgIllustration
        Svg={BoardSvg}
        ariaLabel="Small game board illustration with scores"
        className="h-full w-auto"
        style={style}
      />

      {selectedPosition ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: selectedPosition.left, top: selectedPosition.top }}
          aria-hidden="true"
        >
          <HintPawStep
            fill={selectedPosition.fill ?? 'transparent'}
            stroke={selectedPosition.stroke ?? 'transparent'}
            className="h-[54px] w-[54px]"
          />
        </div>
      ) : null}

      {highlightedPosition ? (
        <div
          className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: highlightedPosition.left, top: highlightedPosition.top }}
          aria-hidden="true"
        >
          <HintPawStep
            fill={highlightedPosition.fill ?? 'transparent'}
            stroke={highlightedPosition.stroke ?? 'transparent'}
            className={highlightedAnswerPawClassName ?? 'h-[54px] w-[54px]'}
          />
        </div>
      ) : null}
    </div>
  )
}
