import type { CSSProperties, ComponentType, SVGProps } from 'react'

import type { HideSqueakItemAssetRenderProps, HideSqueakItemAssetTokens } from '../types'

export function createVariableAssetSvg({
  Svg,
  getVariableStyle,
}: {
  Svg: ComponentType<SVGProps<SVGSVGElement>>
  getVariableStyle: (tokens: HideSqueakItemAssetTokens) => CSSProperties
}) {
  return function VariableAssetSvg({
    title,
    className,
    tokens,
    detailVariant,
    style,
    ...svgProps
  }: HideSqueakItemAssetRenderProps) {
    void detailVariant

    return (
      <Svg
        role={title ? 'img' : 'presentation'}
        aria-label={title}
        className={className}
        style={{
          ...getVariableStyle(tokens),
          ...style,
        }}
        {...svgProps}
      />
    )
  }
}
