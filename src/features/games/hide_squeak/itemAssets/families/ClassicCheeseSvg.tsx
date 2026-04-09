import type { CSSProperties } from 'react'

import CheeseSvgAsset from './assets/cheese.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getCheeseVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '0deg', scaleX: 1, scaleY: 1, flipX: false }
    case 'off-white':
      return { rotation: '0deg', scaleX: 0.85, scaleY: 0.97, flipX: true }
    case 'pale':
      return { rotation: '0deg', scaleX: 0.91, scaleY: 0.91, flipX: false }
    case 'cheddar':
      return { rotation: '0deg', scaleX: 0.96, scaleY: 0.96, flipX: false }
    case 'honey':
      return { rotation: '0deg', scaleX: 0.98, scaleY: 0.98, flipX: true }
  }
}

export function ClassicCheeseSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getCheeseVariantTransform(colorVariant)
  const scaleX = transform.flipX ? -transform.scaleX : transform.scaleX

  return (
    <CheeseSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--cheese-light': tokens.baseFill,
          '--cheese-shade': tokens.baseShade,
          '--cheese-detail': tokens.detailFill,
          transform: `rotate(${transform.rotation}) scale(${scaleX}, ${transform.scaleY})`,
          transformOrigin: 'center center',
          transformBox: 'fill-box',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
