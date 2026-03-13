import type { CSSProperties } from 'react'

import Svg from '../assets/game_board_small.svg?react'
import { getBasePalette } from '../colorRules'
import { RawSvgIllustration } from './RawSvgIllustration'
import { ORIGINAL_COLOR_BY_OBJECT, type ObjectName } from '../cardResolver'
import { fixedDetails, neutrals } from '../palettes'

type GameBoardSmallIllustrationProps = {
  className?: string
  selectedAnswer?: ObjectName
  hoveredAnswer?: ObjectName
  answerPawFillColor?: string
  answerPawStrokeColor?: string
  highlightedAnswer?: ObjectName
  highlightedAnswerPawFillColor?: string
  highlightedAnswerPawStrokeColor?: string
}

export function GameBoardSmallIllustration({
  className,
  selectedAnswer,
  hoveredAnswer,
  answerPawFillColor,
  answerPawStrokeColor,
  highlightedAnswer,
  highlightedAnswerPawFillColor,
  highlightedAnswerPawStrokeColor,
}: GameBoardSmallIllustrationProps) {
  const cat = getBasePalette(ORIGINAL_COLOR_BY_OBJECT.cat)
  const pillow = getBasePalette(ORIGINAL_COLOR_BY_OBJECT.pillow)
  const mouse = getBasePalette(ORIGINAL_COLOR_BY_OBJECT.mouse)
  const cheese = getBasePalette(ORIGINAL_COLOR_BY_OBJECT.cheese)
  const ball = getBasePalette(ORIGINAL_COLOR_BY_OBJECT.ball)

  const answerButtonHoverColor = '#006f75'
  const getAnswerButtonFill = (answer: ObjectName) => {
    return hoveredAnswer === answer || selectedAnswer === answer ? answerButtonHoverColor : '#005157'
  }
  const getAnswerPawFill = (answer: ObjectName) => {
    if (selectedAnswer === answer) {
      return answerPawFillColor
    }

    if (highlightedAnswer === answer) {
      return highlightedAnswerPawFillColor
    }

    return 'transparent'
  }
  const getAnswerPawStroke = (answer: ObjectName) => {
    if (selectedAnswer === answer) {
      return answerPawStrokeColor
    }

    if (highlightedAnswer === answer) {
      return highlightedAnswerPawStrokeColor
    }

    return 'transparent'
  }

  const style = {
    '--outline': neutrals.black,
    '--black': neutrals.black,
    '--white': neutrals.white,
    '--accent-light': fixedDetails.accent.light,
    '--accent-shade': fixedDetails.accent.shade,
    '--cat-light': cat.light,
    '--cat-shade': cat.shade,
    '--pillow-light': pillow.light,
    '--pillow-shade': pillow.shade,
    '--mouse-light': mouse.light,
    '--mouse-shade': mouse.shade,
    '--cheese-light': cheese.light,
    '--cheese-shade': cheese.shade,
    '--ball-light': ball.light,
    '--ball-shade': ball.shade,
    '--answer-button-cat-bg': getAnswerButtonFill('cat'),
    '--answer-button-pillow-bg': getAnswerButtonFill('pillow'),
    '--answer-button-mouse-bg': getAnswerButtonFill('mouse'),
    '--answer-button-cheese-bg': getAnswerButtonFill('cheese'),
    '--answer-button-ball-bg': getAnswerButtonFill('ball'),
    '--answer-paw-cat-fill': getAnswerPawFill('cat'),
    '--answer-paw-cat-stroke': getAnswerPawStroke('cat'),
    '--answer-paw-pillow-fill': getAnswerPawFill('pillow'),
    '--answer-paw-pillow-stroke': getAnswerPawStroke('pillow'),
    '--answer-paw-mouse-fill': getAnswerPawFill('mouse'),
    '--answer-paw-mouse-stroke': getAnswerPawStroke('mouse'),
    '--answer-paw-cheese-fill': getAnswerPawFill('cheese'),
    '--answer-paw-cheese-stroke': getAnswerPawStroke('cheese'),
    '--answer-paw-ball-fill': getAnswerPawFill('ball'),
    '--answer-paw-ball-stroke': getAnswerPawStroke('ball'),
  } as CSSProperties

  return (
    <RawSvgIllustration
      Svg={Svg}
      ariaLabel="Small game board illustration"
      className={className}
      style={style}
    />
  )
}
