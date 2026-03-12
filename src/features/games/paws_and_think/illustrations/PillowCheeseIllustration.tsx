import rawSvg from '../assets/pillow_cheese.svg?raw'
import type { PillowCheeseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import { extractSvgBody } from './extractSvgBody'
import type { PillowCheeseSvgVariables } from './svgVariables'

type PillowCheeseIllustrationProps = {
  tokens: PillowCheeseIllustrationTokens
  className?: string
}

const markup = extractSvgBody(rawSvg)

export function PillowCheeseIllustration({ tokens, className }: PillowCheeseIllustrationProps) {
  const style: PillowCheeseSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--pillow-light': tokens.pillow.light,
    '--pillow-shade': tokens.pillow.shade,
    '--cheese-light': tokens.cheese.light,
    '--cheese-shade': tokens.cheese.shade,
  }

  return <RawSvgIllustration markup={markup} ariaLabel="Pillow and cheese illustration" className={className} style={style} />
}
