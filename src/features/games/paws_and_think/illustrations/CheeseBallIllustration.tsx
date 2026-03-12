import rawSvg from '../assets/cheese_ball.svg?raw'
import type { CheeseBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { CheeseBallSvgVariables } from './svgVariables'

type CheeseBallIllustrationProps = {
  tokens: CheeseBallIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

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

  return <RawSvgIllustration markup={markup} ariaLabel="Cheese and ball illustration" className={className} style={style} />
}
