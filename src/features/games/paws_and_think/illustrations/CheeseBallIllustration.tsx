import Svg from '../assets/cheese_ball.svg?react'
import type { CheeseBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { CheeseBallSvgVariables } from './svgVariables'

type CheeseBallIllustrationProps = {
  tokens: CheeseBallIllustrationTokens
  className?: string
}

export function CheeseBallIllustration({ tokens, className }: CheeseBallIllustrationProps) {
  const style: CheeseBallSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--cheese-light': tokens.cheese.light,
    '--cheese-shade': tokens.cheese.shade,
    '--ball-light': tokens.ball.light,
    '--ball-shade': tokens.ball.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
  }

  return <RawSvgIllustration Svg={Svg} ariaLabel="Cheese and ball illustration" className={className} style={style} />
}
