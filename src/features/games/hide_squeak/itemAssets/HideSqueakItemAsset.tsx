import { resolveHideSqueakItemAsset } from './registry'
import type { HideSqueakItemAssetProps } from './types'

export function HideSqueakItemAsset({
  item,
  colorVariant,
  detailVariant,
  tokenOverrides,
  title,
  ...svgProps
}: HideSqueakItemAssetProps) {
  const resolvedAsset = resolveHideSqueakItemAsset({
    kind: item.kind,
    family: item.family,
    colorVariant: colorVariant ?? item.colorVariant,
    detailVariant: detailVariant ?? item.detailVariant,
    tokenOverrides,
  })

  return (
    <resolvedAsset.definition.Svg
      {...svgProps}
      title={title}
      tokens={resolvedAsset.tokens}
      detailVariant={resolvedAsset.detailVariant}
    />
  )
}
