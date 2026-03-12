import type { ComponentType, CSSProperties, SVGProps } from 'react'

import '../styles/card-svg.css'

type RawSvgIllustrationProps = {
  Svg: ComponentType<SVGProps<SVGSVGElement>>
  ariaLabel: string
  className?: string
  style: CSSProperties
}

export function RawSvgIllustration({
  Svg,
  ariaLabel,
  className,
  style,
}: RawSvgIllustrationProps) {
  return (
    <Svg
      className={['card-svg', className].filter(Boolean).join(' ')}
      style={style}
      aria-label={ariaLabel}
      role="img"
    />
  )
}
