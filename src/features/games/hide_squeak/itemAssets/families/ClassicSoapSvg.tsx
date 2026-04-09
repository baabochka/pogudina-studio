import type { CSSProperties } from 'react'

import SoapSvgAsset from './assets/soap.svg?react'
import type { HideSqueakItemAssetRenderProps } from '../types'

function getSoapVariantTransform(colorVariant: string | null | undefined) {
  switch (colorVariant) {
    case 'original':
    default:
      return { rotation: '-2deg', scale: 1 }
    case 'lavender':
      return { rotation: '3deg', scale: 0.985 }
    case 'mint':
      return { rotation: '-4deg', scale: 0.975 }
    case 'peach':
      return { rotation: '4deg', scale: 0.99 }
  }
}

export function ClassicSoapSvg({
  tokens,
  colorVariant,
  title,
  className,
  style,
  ...svgProps
}: HideSqueakItemAssetRenderProps) {
  const transform = getSoapVariantTransform(colorVariant)

  return (
    <SoapSvgAsset
      role={title ? 'img' : 'presentation'}
      aria-label={title}
      className={className}
      style={
        {
          '--outline': tokens.outline,
          '--soap-light': tokens.baseFill,
          '--soap-shade': tokens.baseShade,
          '--soap-detail': tokens.detailFill,
          transform: `rotate(${transform.rotation}) scale(${transform.scale})`,
          transformOrigin: 'center',
          ...style,
        } as CSSProperties
      }
      {...svgProps}
    />
  )
}
