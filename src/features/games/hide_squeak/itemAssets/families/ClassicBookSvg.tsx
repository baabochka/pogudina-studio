import type { CSSProperties } from 'react'

import BookSvgAsset from './assets/book.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getBookVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1 }
    case 'plum':
      return { rotation: '3deg', scale: 0.985 }
    case 'forest':
      return { rotation: '-4deg', scale: 0.975 }
    case 'terracotta':
      return { rotation: '4deg', scale: 0.99 }
    case 'slate':
      return { rotation: '-3deg', scale: 0.98 }
    case 'mustard':
      return { rotation: '2deg', scale: 0.97 }
  }
}

export function ClassicBookSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getBookVariantTransform(colorVariant)

  return (
    <BookSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--book-light': tokens.baseFill,
          '--book-shade': tokens.baseShade,
          '--book-detail': tokens.accentFill ?? tokens.accentShade ?? tokens.baseShade,
          transform: `rotate(${transform.rotation}) scale(${transform.scale})`,
          transformOrigin: 'center',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
