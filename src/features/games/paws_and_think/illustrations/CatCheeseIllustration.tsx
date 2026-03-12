import rawSvg from '../assets/cat_cheese_svg.svg?raw'
import type { CatCheeseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { CatCheeseSvgVariables } from './svgVariables'

type CatCheeseIllustrationProps = {
  tokens: CatCheeseIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

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

  return <RawSvgIllustration markup={markup} ariaLabel="Cat and cheese illustration" className={className} style={style} />
}
