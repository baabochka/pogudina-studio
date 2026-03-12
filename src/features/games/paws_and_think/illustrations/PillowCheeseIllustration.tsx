import Svg from '../assets/pillow_cheese.svg?react'
import type { PillowCheeseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { PillowCheeseSvgVariables } from './svgVariables'

type PillowCheeseIllustrationProps = {
  tokens: PillowCheeseIllustrationTokens
  className?: string
}

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

  return <RawSvgIllustration Svg={Svg} ariaLabel="Pillow and cheese illustration" className={className} style={style} />
}
