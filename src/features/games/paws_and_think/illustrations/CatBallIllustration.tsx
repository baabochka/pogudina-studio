import Svg from '../assets/cat_ball_svg.svg?react'
import type { CatBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { CatBallSvgVariables } from './svgVariables'

type CatBallIllustrationProps = {
  tokens: CatBallIllustrationTokens
  className?: string
}

export function CatBallIllustration({ tokens, className }: CatBallIllustrationProps) {
  const style: CatBallSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--cat-light': tokens.cat.light,
    '--cat-shade': tokens.cat.shade,
    '--ball-light': tokens.ball.light,
    '--ball-shade': tokens.ball.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
    '--nose-color': tokens.nose,
    '--tag-color': tokens.white,
  }

  return <RawSvgIllustration Svg={Svg} ariaLabel="Cat with ball illustration" className={className} style={style} />
}
