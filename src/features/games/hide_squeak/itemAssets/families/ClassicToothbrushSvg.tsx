import type { CSSProperties } from 'react'

import ToothbrushSvgAsset from './assets/toothbrush.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getToothbrushVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-3deg', scale: 1, flipX: false }
    case 'coral':
      return { rotation: '2deg', scale: 0.985, flipX: true }
    case 'mint':
      return { rotation: '-5deg', scale: 0.975, flipX: false }
    case 'lilac':
      return { rotation: '4deg', scale: 0.99, flipX: true }
  }
}

export function ClassicToothbrushSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getToothbrushVariantTransform(colorVariant)
  const scaleX = transform.flipX ? -transform.scale : transform.scale

  return (
    <ToothbrushSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--toothbrush-light': tokens.baseFill,
          '--toothbrush-shade': tokens.baseShade,
          '--toothbrush-detail': tokens.accentFill ?? tokens.baseFill,
          '--toothbrush-detail-shade': tokens.accentShade ?? tokens.detailFill,
          transform: `rotate(${transform.rotation}) scale(${scaleX}, ${transform.scale})`,
          transformOrigin: 'center center',
          transformBox: 'fill-box',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
