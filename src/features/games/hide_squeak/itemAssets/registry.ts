import { createHideSqueakItemColorVariants, getHideSqueakItemColorPreset } from './colorPresets'
import { ClassicAppleSvg } from './families/ClassicAppleSvg'
import { ClassicBagelSvg } from './families/ClassicBagelSvg'
import { ClassicBookSvg } from './families/ClassicBookSvg'
import { ClassicCandySvg } from './families/ClassicCandySvg'
import { ClassicCheeseSvg } from './families/ClassicCheeseSvg'
import { ClassicCombSvg } from './families/ClassicCombSvg'
import { ClassicMugSvg } from './families/ClassicMugSvg'
import { ClassicMouseTrapSvg } from './families/ClassicMouseTrapSvg'
import { ClassicShoeSvg } from './families/ClassicShoeSvg'
import { ClassicSoapSvg } from './families/ClassicSoapSvg'
import { ClassicToothbrushSvg } from './families/ClassicToothbrushSvg'
import type {
  HideSqueakItemAssetFamilyDefinition,
  HideSqueakItemAssetTokens,
  ResolveHideSqueakItemAssetOptions,
  ResolvedHideSqueakItemAsset,
} from './types'

const CLASSIC_CHEESE_FAMILY = {
  kind: 'cheese',
  family: 'classic',
  displayName: 'Classic cheese',
  Svg: ClassicCheeseSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('cheese'),
  colorVariants: createHideSqueakItemColorVariants('cheese', {
    default: {},
    original: {
      baseFill: '#ffdf5d',
      baseShade: '#e9c31e',
      detailFill: '#231f20',
    },
    honey: {
      baseFill: '#f2c84f',
      baseShade: '#d5a11f',
      detailFill: '#231f20',
    },
    'off-white': {
      baseFill: '#fbf4dc',
      baseShade: '#eadfb9',
      detailFill: '#231f20',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_APPLE_FAMILY = {
  kind: 'apple',
  displayName: 'Classic apple',
  family: 'classic',
  Svg: ClassicAppleSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('apple'),
  colorVariants: createHideSqueakItemColorVariants('apple', {
    default: {
      baseFill: '#d2212f',
      baseShade: '#a91a25',
    },
    golden: {
      baseFill: '#e2b24c',
      baseShade: '#bf8d34',
    },
    jade: {
      baseFill: '#7bb564',
      baseShade: '#5d9448',
    },
    'bright-red': {
      baseFill: '#d2212f',
      baseShade: '#a91a25',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_BAGEL_FAMILY = {
  kind: 'bagel',
  displayName: 'Classic bagel',
  family: 'classic',
  Svg: ClassicBagelSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('bagel'),
  colorVariants: createHideSqueakItemColorVariants('bagel', {
    default: {},
    original: {
      baseFill: '#d18333',
      baseShade: '#755b43',
      accentFill: '#faa864',
      accentShade: '#e5d594',
      detailFill: '#42271c',
    },
    toasted: {
      baseFill: '#c9935c',
      baseShade: '#9d6b3d',
      accentFill: '#efd4a4',
      accentShade: '#ceb27f',
      detailFill: '#5a3926',
    },
    sesame: {
      baseFill: '#deb483',
      baseShade: '#bd8857',
      accentFill: '#f5e7ba',
      accentShade: '#dcc796',
      detailFill: '#6a4328',
    },
    cinnamon: {
      baseFill: '#b87a52',
      baseShade: '#8e5533',
      accentFill: '#e4c38f',
      accentShade: '#bc9666',
      detailFill: '#4d2d1d',
    },
    pumpernickel: {
      baseFill: '#8b654a',
      baseShade: '#61452f',
      accentFill: '#cfa97d',
      accentShade: '#a07854',
      detailFill: '#342116',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_BOOK_FAMILY = {
  kind: 'book',
  displayName: 'Classic book',
  family: 'classic',
  Svg: ClassicBookSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('book'),
  colorVariants: createHideSqueakItemColorVariants('book', {
    default: {},
    original: {
      baseFill: '#005e8f',
      baseShade: '#002443',
      accentFill: '#c4beb4',
      detailFill: '#002443',
    },
    plum: {
      baseFill: '#6756a8',
      baseShade: '#47387e',
      accentFill: '#cdc4e5',
      detailFill: '#352a56',
    },
    forest: {
      baseFill: '#4d7a5b',
      baseShade: '#2d5037',
      accentFill: '#cfd8ca',
      detailFill: '#2d5037',
    },
    terracotta: {
      baseFill: '#b86d52',
      baseShade: '#7e4530',
      accentFill: '#dec2b4',
      detailFill: '#6c3726',
    },
    slate: {
      baseFill: '#6d7c8f',
      baseShade: '#445061',
      accentFill: '#cfd4dc',
      detailFill: '#445061',
    },
    mustard: {
      baseFill: '#c8a24a',
      baseShade: '#866827',
      accentFill: '#e2d2a9',
      detailFill: '#6e531f',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_CANDY_FAMILY = {
  kind: 'candy',
  family: 'classic',
  displayName: 'Classic candy',
  Svg: ClassicCandySvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('candy'),
  colorVariants: createHideSqueakItemColorVariants('candy', {
    default: {},
    original: {},
    grape: {
      baseFill: '#a672f0',
      baseShade: '#7d49cc',
    },
    lemon: {
      baseFill: '#ffd84d',
      baseShade: '#d7ac1d',
    },
    lagoon: {
      baseFill: '#4fc6f4',
      baseShade: '#259bca',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_COMB_FAMILY = {
  kind: 'comb',
  family: 'classic',
  displayName: 'Classic comb',
  Svg: ClassicCombSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('comb'),
  colorVariants: createHideSqueakItemColorVariants('comb', {
    default: {},
    original: {},
    coral: {
      baseFill: '#d98f7d',
    },
    cocoa: {
      baseFill: '#a88470',
    },
    flamingo: {
      baseFill: '#ef8a8a',
    },
    aqua: {
      baseFill: '#78c7d6',
    },
    butter: {
      baseFill: '#e8c86a',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_MOUSE_TRAP_FAMILY = {
  kind: 'mouse-trap',
  family: 'classic',
  displayName: 'Classic mouse trap',
  Svg: ClassicMouseTrapSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('mouse-trap'),
  colorVariants: createHideSqueakItemColorVariants('mouse-trap', {
    default: {},
    original: {
      baseFill: '#905f49',
      baseShade: '#714836',
      accentFill: '#cdae91',
      accentShade: '#7d98a6',
      detailFill: '#231f20',
    },
    honey: {
      baseFill: '#d0a16d',
      baseShade: '#a57542',
      accentFill: '#e4cba7',
      accentShade: '#8693a2',
    },
    pewter: {
      baseFill: '#979893',
      baseShade: '#6e706b',
      accentFill: '#bdbeb9',
      accentShade: '#687d8f',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_MUG_FAMILY = {
  kind: 'mug',
  family: 'classic',
  displayName: 'Classic mug',
  Svg: ClassicMugSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('mug'),
  colorVariants: createHideSqueakItemColorVariants('mug', {
    default: {},
    original: {
      baseFill: '#3c8b34',
      baseShade: '#244429',
    },
    blueberry: {
      baseFill: '#6f88c7',
      baseShade: '#5368a4',
    },
    'bright-blue': {
      baseFill: '#005e8f',
      baseShade: '#002443',
    },
    cream: {
      baseFill: '#f0e5d6',
      baseShade: '#d5c1aa',
    },
    rose: {
      baseFill: '#d58a92',
      baseShade: '#b4666f',
    },
    'bright-red': {
      baseFill: '#d2212f',
      baseShade: '#a91a25',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_SHOE_FAMILY = {
  kind: 'shoe',
  family: 'classic',
  displayName: 'Classic shoe',
  Svg: ClassicShoeSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('shoe'),
  colorVariants: createHideSqueakItemColorVariants('shoe', {
    default: {},
    original: {
      baseFill: '#69301b',
      baseShade: '#551d0e',
      detailFill: '#231f20',
    },
    berry: {
      baseFill: '#8d5b76',
      baseShade: '#6b4059',
      detailFill: '#2e1b26',
    },
    sage: {
      baseFill: '#8ea37e',
      baseShade: '#667857',
      detailFill: '#314128',
    },
    denim: {
      baseFill: '#7289b6',
      baseShade: '#516796',
      detailFill: '#253252',
    },
    'bright-red': {
      baseFill: '#cf564c',
      baseShade: '#a5362d',
      detailFill: '#4b1a16',
    },
    'apple-red': {
      baseFill: '#d2212f',
      baseShade: '#a91a25',
      detailFill: '#4b1a16',
    },
    'bright-yellow': {
      baseFill: '#e4bf4f',
      baseShade: '#b78f1f',
      detailFill: '#4b3710',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_SOAP_FAMILY = {
  kind: 'soap',
  family: 'classic',
  displayName: 'Classic soap',
  Svg: ClassicSoapSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('soap'),
  colorVariants: createHideSqueakItemColorVariants('soap', {
    default: {},
    original: {
      baseFill: '#e1f4fd',
      baseShade: '#b3d2c9',
      detailFill: '#97c6b3',
    },
    lavender: {
      baseFill: '#ddd9f3',
      baseShade: '#bcb4e3',
      detailFill: '#8f88bf',
    },
    mint: {
      baseFill: '#d8f3ea',
      baseShade: '#a9d7c8',
      detailFill: '#79b6a4',
    },
    peach: {
      baseFill: '#f5ddd2',
      baseShade: '#ddb5a8',
      detailFill: '#c98e7c',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

const CLASSIC_TOOTHBRUSH_FAMILY = {
  kind: 'toothbrush',
  family: 'classic',
  displayName: 'Classic toothbrush',
  Svg: ClassicToothbrushSvg,
  defaultColorVariant: 'default',
  defaultDetailVariant: null,
  tokens: getHideSqueakItemColorPreset('toothbrush'),
  colorVariants: createHideSqueakItemColorVariants('toothbrush', {
    default: {},
    original: {
      baseFill: '#42bfef',
      baseShade: '#005e8f',
      accentFill: '#e4e2cf',
      accentShade: '#9a9787',
      detailFill: '#9a9787',
    },
    coral: {
      baseFill: '#f09788',
      baseShade: '#d46f61',
      accentFill: '#f5efe8',
      accentShade: '#c1b7ad',
    },
    mint: {
      baseFill: '#74d0c3',
      baseShade: '#319587',
      accentFill: '#edf4ea',
      accentShade: '#b2c0b0',
    },
    lilac: {
      baseFill: '#a89be4',
      baseShade: '#7267b5',
      accentFill: '#f1ecf5',
      accentShade: '#beb4c6',
    },
  }),
} satisfies HideSqueakItemAssetFamilyDefinition

export const HIDE_SQUEAK_ITEM_ASSET_REGISTRY = {
  apple: {
    classic: CLASSIC_APPLE_FAMILY,
  },
  bagel: {
    classic: CLASSIC_BAGEL_FAMILY,
  },
  book: {
    classic: CLASSIC_BOOK_FAMILY,
  },
  candy: {
    classic: CLASSIC_CANDY_FAMILY,
  },
  cheese: {
    classic: CLASSIC_CHEESE_FAMILY,
  },
  comb: {
    classic: CLASSIC_COMB_FAMILY,
  },
  'mouse-trap': {
    classic: CLASSIC_MOUSE_TRAP_FAMILY,
  },
  mug: {
    classic: CLASSIC_MUG_FAMILY,
  },
  shoe: {
    classic: CLASSIC_SHOE_FAMILY,
  },
  soap: {
    classic: CLASSIC_SOAP_FAMILY,
  },
  toothbrush: {
    classic: CLASSIC_TOOTHBRUSH_FAMILY,
  },
} as const

function mergeItemAssetTokens(
  baseTokens: HideSqueakItemAssetTokens,
  overrides?: Partial<HideSqueakItemAssetTokens>,
) {
  return {
    ...baseTokens,
    ...overrides,
  } satisfies HideSqueakItemAssetTokens
}

export function getHideSqueakItemAssetFamily(
  kind: keyof typeof HIDE_SQUEAK_ITEM_ASSET_REGISTRY,
  family: string,
): HideSqueakItemAssetFamilyDefinition | null {
  const kindRegistry = HIDE_SQUEAK_ITEM_ASSET_REGISTRY[kind]

  if (!kindRegistry) {
    return null
  }

  return kindRegistry[family as keyof typeof kindRegistry] ?? null
}

export function resolveHideSqueakItemAsset({
  kind,
  family,
  colorVariant,
  detailVariant,
  tokenOverrides,
}: ResolveHideSqueakItemAssetOptions): ResolvedHideSqueakItemAsset {
  const definition = getHideSqueakItemAssetFamily(kind, family)

  if (!definition) {
    throw new Error(`No Hide & Squeak item asset family registered for ${kind}/${family}.`)
  }

  const resolvedColorVariant = colorVariant ?? definition.defaultColorVariant
  const variantTokens = definition.colorVariants?.[resolvedColorVariant]

  return {
    definition,
    colorVariant: resolvedColorVariant,
    detailVariant: detailVariant ?? definition.defaultDetailVariant ?? null,
    tokens: mergeItemAssetTokens(
      mergeItemAssetTokens(definition.tokens, variantTokens),
      tokenOverrides,
    ),
  }
}

export function getHideSqueakItemAssetDetailVariants(
  kind: keyof typeof HIDE_SQUEAK_ITEM_ASSET_REGISTRY,
  family: string,
) {
  const definition = getHideSqueakItemAssetFamily(kind, family)

  return definition?.detailVariants ?? {}
}

export function getHideSqueakItemAssetColorVariants(
  kind: keyof typeof HIDE_SQUEAK_ITEM_ASSET_REGISTRY,
  family: string,
) {
  const definition = getHideSqueakItemAssetFamily(kind, family)

  if (!definition?.colorVariants) {
    return []
  }

  return Object.keys(definition.colorVariants).filter(
    (variantName) => variantName !== 'default',
  )
}
