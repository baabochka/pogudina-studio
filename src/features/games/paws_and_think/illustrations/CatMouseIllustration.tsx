import rawSvg from '../assets/cat_mouse_svg.svg?raw'
import type { CatMouseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { CatMouseSvgVariables } from './svgVariables'

type CatMouseIllustrationProps = {
  tokens: CatMouseIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

export function CatMouseIllustration({ tokens, className }: CatMouseIllustrationProps) {
  const style: CatMouseSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--cat-light': tokens.cat.light,
    '--cat-shade': tokens.cat.shade,
    '--mouse-light': tokens.mouse.light,
    '--mouse-shade': tokens.mouse.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
    '--nose-color': tokens.nose,
    '--tag-color': tokens.white,
  }

  return <RawSvgIllustration markup={markup} ariaLabel="Cat and mouse illustration" className={className} style={style} />
}
