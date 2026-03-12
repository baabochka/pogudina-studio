import Svg from '../assets/cat_pillow_svg.svg?react'
import type { CatPillowIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { CatPillowSvgVariables } from './svgVariables'

type CatPillowIllustrationProps = {
  tokens: CatPillowIllustrationTokens
  className?: string
}

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

  return <RawSvgIllustration Svg={Svg} ariaLabel="Cat and pillow illustration" className={className} style={style} />
}
