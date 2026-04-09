import type { CSSProperties } from 'react'

import BagelSvgAsset from './assets/bagel.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getBagelVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1 }
    case 'toasted':
      return { rotation: '3deg', scale: 0.985 }
    case 'sesame':
      return { rotation: '-5deg', scale: 0.975 }
    case 'cinnamon':
      return { rotation: '4deg', scale: 0.99 }
    case 'pumpernickel':
      return { rotation: '-3deg', scale: 0.98 }
    case 'honey':
      return { rotation: '2deg', scale: 0.97 }
  }
}

export function ClassicBagelSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getBagelVariantTransform(colorVariant)

  return (
    <BagelSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={{
        '--outline': tokens.outline,
        '--bagel-light': tokens.baseFill,
        '--bagel-detail': tokens.accentFill ?? tokens.baseShade,
        '--bagel-detail-shade': tokens.detailFill,
        '--bagel-detail-shade-deep': tokens.detailFill,
        '--bagel-detail-shadow': tokens.baseShade,
        '--bagel-detail-muted': tokens.accentShade ?? tokens.baseShade,
        '--bagel-detail-accent': tokens.accentFill ?? tokens.baseFill,
        '--bagel-detail-highlight':
          tokens.accentShade ?? tokens.accentFill ?? tokens.baseFill,
        transform: `rotate(${transform.rotation}) scale(${transform.scale})`,
        transformOrigin: 'center',
        ...style,
      } as CSSProperties}
      {...svgProps}
    />
  )
}
