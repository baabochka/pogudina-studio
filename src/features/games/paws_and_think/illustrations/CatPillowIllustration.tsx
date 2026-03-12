import rawSvg from '../assets/cat_pillow_svg.svg?raw'
import type { CatPillowIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { CatPillowSvgVariables } from './svgVariables'

type CatPillowIllustrationProps = {
  tokens: CatPillowIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

export function CatPillowIllustration({ tokens, className }: CatPillowIllustrationProps) {
  const style: CatPillowSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--cat-light': tokens.cat.light,
    '--cat-shade': tokens.cat.shade,
    '--pillow-light': tokens.pillow.light,
    '--pillow-shade': tokens.pillow.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
    '--nose-color': tokens.nose,
    '--tag-color': tokens.white,
  }

  return <RawSvgIllustration markup={markup} ariaLabel="Cat and pillow illustration" className={className} style={style} />
}
