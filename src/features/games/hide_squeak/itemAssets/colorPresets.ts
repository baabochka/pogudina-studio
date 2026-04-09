import type { HideSqueakItemKind } from '../types'
import type { HideSqueakItemAssetTokens } from './types'

const DEFAULT_ITEM_OUTLINE = '#231f20'

export const HIDE_SQUEAK_ITEM_COLOR_PRESETS = {
  apple: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#d36b5f',
    baseShade: '#b44f46',
    accentFill: '#9fbe67',
    accentShade: '#7d9a4e',
    detailFill: '#7b3f34',
  },
  bagel: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#dfb27b',
    baseShade: '#bf8b59',
    accentFill: '#f4dfb3',
    accentShade: '#dfc188',
    detailFill: '#8a5f36',
  },
  book: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#c9716d',
    baseShade: '#ab5655',
    accentFill: '#f1dbc4',
    accentShade: '#d5b599',
    detailFill: '#4a5b7a',
  },
  candy: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#ef8db2',
    baseShade: '#d66f97',
    accentFill: '#ffe8f1',
    accentShade: '#f6c8d9',
    detailFill: '#90506f',
  },
  cheese: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#fde060',
    baseShade: '#f1c617',
    accentFill: '#fff1a1',
    accentShade: '#efcf54',
    detailFill: '#c49311',
  },
  comb: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#d4b09a',
    baseShade: '#b9896c',
    accentFill: '#ebd2bf',
    accentShade: '#cfaa90',
    detailFill: '#875b48',
  },
  'mouse-trap': {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#cdae91',
    baseShade: '#714836',
    accentFill: '#7d98a6',
    accentShade: '#5c7682',
    detailFill: '#231f20',
  },
  mug: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#c97a6c',
    baseShade: '#a95d52',
    accentFill: '#f6d0c7',
    accentShade: '#dfa79b',
    detailFill: '#7c413a',
  },
  shoe: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#7f8db8',
    baseShade: '#60709c',
    accentFill: '#d8deef',
    accentShade: '#b8c2dd',
    detailFill: '#434f77',
  },
  soap: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#c4ebe8',
    baseShade: '#98d4d0',
    accentFill: '#f1fbfa',
    accentShade: '#d8f1ee',
    detailFill: '#5f9a96',
  },
  toothbrush: {
    outline: DEFAULT_ITEM_OUTLINE,
    baseFill: '#6e9bc3',
    baseShade: '#4f7da6',
    accentFill: '#f6f4ef',
    accentShade: '#d8d3cb',
    detailFill: '#36506f',
  },
} satisfies Record<HideSqueakItemKind, HideSqueakItemAssetTokens>

export function getHideSqueakItemColorPreset(
  kind: HideSqueakItemKind,
): HideSqueakItemAssetTokens {
  return HIDE_SQUEAK_ITEM_COLOR_PRESETS[kind]
}

export function createHideSqueakItemColorVariant(
  kind: HideSqueakItemKind,
  overrides: Partial<HideSqueakItemAssetTokens> = {},
): Partial<HideSqueakItemAssetTokens> {
  return {
    ...getHideSqueakItemColorPreset(kind),
    ...overrides,
  }
}

export function createHideSqueakItemColorVariants<
  Variants extends Readonly<Record<string, Partial<HideSqueakItemAssetTokens>>>,
>(
  kind: HideSqueakItemKind,
  variants: Variants,
): { [VariantName in keyof Variants]: Partial<HideSqueakItemAssetTokens> } {
  return Object.fromEntries(
    Object.entries(variants).map(([variantName, overrides]) => [
      variantName,
      createHideSqueakItemColorVariant(kind, overrides),
    ]),
  ) as { [VariantName in keyof Variants]: Partial<HideSqueakItemAssetTokens> }
}
