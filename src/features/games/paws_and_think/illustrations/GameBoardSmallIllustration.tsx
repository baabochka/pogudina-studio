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
}

export function GameBoardSmallIllustration({
  className,
  selectedAnswer,
  hoveredAnswer,
  answerPawFillColor,
  answerPawStrokeColor,
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
    '--answer-paw-cat-fill': selectedAnswer === 'cat' ? answerPawFillColor : 'transparent',
    '--answer-paw-cat-stroke': selectedAnswer === 'cat' ? answerPawStrokeColor : 'transparent',
    '--answer-paw-pillow-fill': selectedAnswer === 'pillow' ? answerPawFillColor : 'transparent',
    '--answer-paw-pillow-stroke': selectedAnswer === 'pillow' ? answerPawStrokeColor : 'transparent',
    '--answer-paw-mouse-fill': selectedAnswer === 'mouse' ? answerPawFillColor : 'transparent',
    '--answer-paw-mouse-stroke': selectedAnswer === 'mouse' ? answerPawStrokeColor : 'transparent',
    '--answer-paw-cheese-fill': selectedAnswer === 'cheese' ? answerPawFillColor : 'transparent',
    '--answer-paw-cheese-stroke': selectedAnswer === 'cheese' ? answerPawStrokeColor : 'transparent',
    '--answer-paw-ball-fill': selectedAnswer === 'ball' ? answerPawFillColor : 'transparent',
    '--answer-paw-ball-stroke': selectedAnswer === 'ball' ? answerPawStrokeColor : 'transparent',
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
