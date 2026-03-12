import type { CSSProperties } from 'react'

import '../styles/card-svg.css'

type RawSvgIllustrationProps = {
  markup: string
  ariaLabel: string
  className?: string
  style: CSSProperties
}

export function RawSvgIllustration({
  markup,
  ariaLabel,
  className,
  style,
}: RawSvgIllustrationProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 288 431.15"
      className={['card-svg', className].filter(Boolean).join(' ')}
      style={style}
      aria-label={ariaLabel}
      role="img"
    >
      <g dangerouslySetInnerHTML={{ __html: markup }} />
    </svg>
  )
}
