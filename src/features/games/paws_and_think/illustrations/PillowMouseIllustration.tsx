import Svg from '../assets/pillow_mouse.svg?react'
import type { PillowMouseIllustrationTokens } from '../palettes'
import { RawSvgIllustration } from './RawSvgIllustration'
import type { PillowMouseSvgVariables } from './svgVariables'

type PillowMouseIllustrationProps = {
  tokens: PillowMouseIllustrationTokens
  className?: string
}

export function PillowMouseIllustration({ tokens, className }: PillowMouseIllustrationProps) {
  const style: PillowMouseSvgVariables = {
    '--outline': tokens.outline,
    '--black': tokens.black,
    '--white': tokens.white,
    '--pillow-light': tokens.pillow.light,
    '--pillow-shade': tokens.pillow.shade,
    '--mouse-light': tokens.mouse.light,
    '--mouse-shade': tokens.mouse.shade,
    '--accent-light': tokens.accent.light,
    '--accent-shade': tokens.accent.shade,
  }

  return <RawSvgIllustration Svg={Svg} ariaLabel="Pillow and mouse illustration" className={className} style={style} />
}
