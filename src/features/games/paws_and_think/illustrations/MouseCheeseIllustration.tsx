import rawSvg from '../assets/mouse_cheese.svg?raw'
import type { MouseCheeseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { MouseCheeseSvgVariables } from './svgVariables'

type MouseCheeseIllustrationProps = {
  tokens: MouseCheeseIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

export function MouseCheeseIllustration({ tokens, className }: MouseCheeseIllustrationProps) {
  const style: MouseCheeseSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--mouse-light': tokens.mouse.light,
    '--mouse-shade': tokens.mouse.shade,
    '--cheese-light': tokens.cheese.light,
    '--cheese-shade': tokens.cheese.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
  }

  return <RawSvgIllustration markup={markup} ariaLabel="Mouse and cheese illustration" className={className} style={style} />
}
