import Svg from '../assets/pillow_ball.svg?react'
import type { PillowBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { PillowBallSvgVariables } from './svgVariables'

type PillowBallIllustrationProps = {
  tokens: PillowBallIllustrationTokens
  className?: string
}

export function PillowBallIllustration({ tokens, className }: PillowBallIllustrationProps) {
  const style: PillowBallSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--pillow-light': tokens.pillow.light,
    '--pillow-shade': tokens.pillow.shade,
    '--ball-light': tokens.ball.light,
    '--ball-shade': tokens.ball.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
  }

  return <RawSvgIllustration Svg={Svg} ariaLabel="Pillow and ball illustration" className={className} style={style} />
}
