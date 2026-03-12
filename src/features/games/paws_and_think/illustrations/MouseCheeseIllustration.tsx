import Svg from '../assets/mouse_cheese.svg?react'
import type { MouseCheeseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { MouseCheeseSvgVariables } from './svgVariables'

type MouseCheeseIllustrationProps = {
  tokens: MouseCheeseIllustrationTokens
  className?: string
}

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

  return <RawSvgIllustration Svg={Svg} ariaLabel="Mouse and cheese illustration" className={className} style={style} />
}
