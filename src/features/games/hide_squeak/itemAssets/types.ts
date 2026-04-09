import type { ComponentType, SVGProps } from 'react'

import type { HideSqueakItem, HideSqueakItemFamily, HideSqueakItemKind } from '../types'

export interface HideSqueakItemAssetTokens {
  outline: string
  baseFill: string
  baseShade: string
  accentFill?: string
  accentShade?: string
  detailFill: string
}

export interface HideSqueakItemAssetRenderProps extends SVGProps<SVGSVGElement> {
  tokens: HideSqueakItemAssetTokens
  colorVariant?: string | null
  detailVariant?: string | null
  title?: string
}

export interface HideSqueakItemAssetDetailVariantDefinition {
  label: string
}

export interface HideSqueakItemAssetFamilyDefinition {
  kind: HideSqueakItemKind
  family: HideSqueakItemFamily
  displayName: string
  Svg: ComponentType<HideSqueakItemAssetRenderProps>
  defaultColorVariant: string
  defaultDetailVariant?: string | null
  tokens: HideSqueakItemAssetTokens
  colorVariants?: Readonly<Record<string, Partial<HideSqueakItemAssetTokens>>>
  detailVariants?: Record<string, HideSqueakItemAssetDetailVariantDefinition>
}

export interface ResolveHideSqueakItemAssetOptions {
  kind: HideSqueakItemKind
  family: HideSqueakItemFamily
  colorVariant?: string | null
  detailVariant?: string | null
  tokenOverrides?: Partial<HideSqueakItemAssetTokens>
}

export interface ResolvedHideSqueakItemAsset {
  definition: HideSqueakItemAssetFamilyDefinition
  colorVariant: string
  detailVariant: string | null
  tokens: HideSqueakItemAssetTokens
}

export interface HideSqueakItemAssetProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  item: Pick<HideSqueakItem, 'kind' | 'family' | 'colorVariant' | 'detailVariant'>
  colorVariant?: string | null
  detailVariant?: string | null
  tokenOverrides?: Partial<HideSqueakItemAssetTokens>
  title?: string
}
