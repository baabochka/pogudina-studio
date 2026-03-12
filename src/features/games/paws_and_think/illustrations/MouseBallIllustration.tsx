import rawSvg from '../assets/mouse_ball.svg?raw'
import type { MouseBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { MouseBallSvgVariables } from './svgVariables'

type MouseBallIllustrationProps = {
  tokens: MouseBallIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

export function MouseBallIllustration({ tokens, className }: MouseBallIllustrationProps) {
  const style: MouseBallSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--ball-light': tokens.ball.light,
    '--ball-shade': tokens.ball.shade,
    '--mouse-light': tokens.mouse.light,
    '--mouse-shade': tokens.mouse.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
  }

  return <RawSvgIllustration markup={markup} ariaLabel="Mouse and ball illustration" className={className} style={style} />
}
