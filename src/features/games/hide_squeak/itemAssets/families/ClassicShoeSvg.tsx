import type { CSSProperties } from 'react'

import ShoeSvgAsset from './assets/shoe.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getShoeVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1, flipX: false }
    case 'berry':
      return { rotation: '-3deg', scale: 0.985, flipX: true }
    case 'sage':
      return { rotation: '-4deg', scale: 0.975, flipX: false }
    case 'coral':
      return { rotation: '-2deg', scale: 0.99, flipX: true }
    case 'denim':
      return { rotation: '-3deg', scale: 0.98, flipX: false }
    case 'bright-red':
      return { rotation: '-4deg', scale: 0.985, flipX: true }
    case 'apple-red':
      return { rotation: '-1deg', scale: 0.99, flipX: false }
    case 'bright-yellow':
      return { rotation: '-1deg', scale: 0.98, flipX: true }
  }
}

export function ClassicShoeSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getShoeVariantTransform(colorVariant)
  const scaleX = transform.flipX ? -transform.scale : transform.scale

  return (
    <ShoeSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--shoe-light': tokens.baseFill,
          '--shoe-shade': tokens.baseShade,
          '--shoe-detail': tokens.detailFill,
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
