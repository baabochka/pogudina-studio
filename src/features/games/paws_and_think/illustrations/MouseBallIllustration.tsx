import Svg from '../assets/mouse_ball.svg?react'
import type { MouseBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { MouseBallSvgVariables } from './svgVariables'

type MouseBallIllustrationProps = {
  tokens: MouseBallIllustrationTokens
  className?: string
}

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

  return <RawSvgIllustration Svg={Svg} ariaLabel="Mouse and ball illustration" className={className} style={style} />
}
