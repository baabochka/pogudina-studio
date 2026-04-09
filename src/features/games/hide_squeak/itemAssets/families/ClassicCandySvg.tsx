import type { CSSProperties } from 'react'

import CandySvgAsset from './assets/candy.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getCandyVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1 }
    case 'tangerine':
      return { rotation: '3deg', scale: 0.985 }
    case 'grape':
      return { rotation: '-4deg', scale: 0.975 }
    case 'lemon':
      return { rotation: '4deg', scale: 0.99 }
    case 'lagoon':
      return { rotation: '-3deg', scale: 0.98 }
    case 'mint':
      return { rotation: '2deg', scale: 0.98 }
    case 'cherry':
      return { rotation: '-1deg', scale: 0.99 }
  }
}

export function ClassicCandySvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getCandyVariantTransform(colorVariant)

  return (
    <CandySvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--candy-light': tokens.baseFill,
          '--candy-detail': '#fff',
          '--candy-detail-accent': '#5bcbf5',
          transform: `rotate(${transform.rotation}) scale(${transform.scale})`,
          transformOrigin: 'center',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
