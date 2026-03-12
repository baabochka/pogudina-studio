import rawSvg from '../assets/cat_ball_svg.svg?raw'
import type { CatBallIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { CatBallSvgVariables } from './svgVariables'

type CatBallIllustrationProps = {
  tokens: CatBallIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

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

  return <RawSvgIllustration markup={markup} ariaLabel="Cat with ball illustration" className={className} style={style} />
}
