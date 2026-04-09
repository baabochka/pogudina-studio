import type { CSSProperties } from 'react'

import MouseTrapSvgAsset from './assets/mouse_trap.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getMouseTrapVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1 }
    case 'honey':
      return { rotation: '3deg', scale: 0.985 }
    case 'pewter':
      return { rotation: '-4deg', scale: 0.975 }
    case 'ash':
      return { rotation: '4deg', scale: 0.99 }
    case 'coolwood':
      return { rotation: '-3deg', scale: 0.98 }
    case 'rosewood':
      return { rotation: '2deg', scale: 0.985 }
    case 'slate':
      return { rotation: '-1deg', scale: 0.98 }
  }
}

export function ClassicMouseTrapSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getMouseTrapVariantTransform(colorVariant)

  return (
    <MouseTrapSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--mouse-trap-light': tokens.baseFill,
          '--mouse-trap-shade': tokens.baseShade,
          '--mouse-trap-detail': tokens.accentFill ?? tokens.baseFill,
          '--mouse-trap-metal': tokens.accentShade ?? tokens.baseShade,
          '--mouse-trap-detail-shade': tokens.detailFill,
          '--mouse-trap-cheese-light': '#fde060',
          '--mouse-trap-cheese-shade': '#f1c617',
          transform: `rotate(${transform.rotation}) scale(${transform.scale})`,
          transformOrigin: 'center',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
