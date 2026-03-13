import Svg from '../assets/cat_cheese.svg?react'
import type { CatCheeseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { CatCheeseSvgVariables } from './svgVariables'

type CatCheeseIllustrationProps = {
  tokens: CatCheeseIllustrationTokens
  className?: string
}

export function CatCheeseIllustration({ tokens, className }: CatCheeseIllustrationProps) {
  const style: CatCheeseSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--cat-light': tokens.cat.light,
    '--cat-shade': tokens.cat.shade,
    '--cheese-light': tokens.cheese.light,
    '--cheese-shade': tokens.cheese.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
    '--nose-color': tokens.nose,
    '--tag-color': tokens.white,
  }

  return <RawSvgIllustration Svg={Svg} ariaLabel="Cat and cheese illustration" className={className} style={style} />
}
