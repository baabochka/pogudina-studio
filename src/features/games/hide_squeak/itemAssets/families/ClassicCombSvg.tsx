import type { CSSProperties } from 'react'

import CombSvgAsset from './assets/comb.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getCombVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1 }
    case 'coral':
      return { rotation: '3deg', scale: 0.985 }
    case 'cocoa':
      return { rotation: '-4deg', scale: 0.975 }
    case 'aqua':
      return { rotation: '4deg', scale: 0.99 }
    case 'butter':
      return { rotation: '-3deg', scale: 0.98 }
    case 'peach':
      return { rotation: '2deg', scale: 0.99 }
    case 'flamingo':
      return { rotation: '-1deg', scale: 0.98 }
    case 'sky':
      return { rotation: '2deg', scale: 0.985 }
  }
}

export function ClassicCombSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getCombVariantTransform(colorVariant)

  return (
    <CombSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--comb-light': tokens.baseFill,
          transform: `rotate(${transform.rotation}) scale(${transform.scale})`,
          transformOrigin: 'center',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
