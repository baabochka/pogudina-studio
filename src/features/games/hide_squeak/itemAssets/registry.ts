import appleSvgUrl from './families/assets/apple.svg'
import bagelSvgUrl from './families/assets/bagel.svg'
import bookSvgUrl from './families/assets/book.svg'
import candySvgUrl from './families/assets/candy.svg'
import cheeseSvgUrl from './families/assets/cheese.svg'
import combSvgUrl from './families/assets/comb.svg'
import mouseTrapSvgUrl from './families/assets/mouse_trap.svg'
import mugSvgUrl from './families/assets/mug.svg'
import shoeSvgUrl from './families/assets/shoe.svg'
import soapSvgUrl from './families/assets/soap.svg'
import { createStaticAssetSvg } from './families/StaticAssetSvg'
import toothbrushSvgUrl from './families/assets/toothbrush.svg'
import type {
  HideSqueakItemAssetFamilyDefinition,
  HideSqueakItemAssetTokens,
  ResolveHideSqueakItemAssetOptions,
  ResolvedHideSqueakItemAsset,
} from './types'

const STATIC_ASSET_TOKENS = {
  outline: '#231f20',
  baseFill: '#ffffff',
  baseShade: '#e5e7eb',
  detailFill: '#111827',
} satisfies HideSqueakItemAssetTokens

function createStaticFamilyDefinition({
  kind,
  displayName,
  src,
  viewBox,
}: {
  kind: HideSqueakItemAssetFamilyDefinition['kind']
  displayName: string
  src: string
  viewBox: string
}) {
  return {
    kind,
    family: 'classic',
    displayName,
    Svg: createStaticAssetSvg({ src, viewBox }),
    defaultColorVariant: 'default',
    defaultDetailVariant: null,
    tokens: STATIC_ASSET_TOKENS,
    colorVariants: {
      default: {},
    },
  } satisfies HideSqueakItemAssetFamilyDefinition
}

const CLASSIC_CHEESE_FAMILY = createStaticFamilyDefinition({
  kind: 'cheese',
  displayName: 'Classic cheese',
  src: cheeseSvgUrl,
  viewBox: '0 0 69.14 66.66',
})

const CLASSIC_APPLE_FAMILY = createStaticFamilyDefinition({
  kind: 'apple',
  displayName: 'Classic apple',
  src: appleSvgUrl,
  viewBox: '0 0 56.3 51.73',
})

const CLASSIC_BAGEL_FAMILY = createStaticFamilyDefinition({
  kind: 'bagel',
  displayName: 'Classic bagel',
  src: bagelSvgUrl,
  viewBox: '0 0 56.43 43.43',
})

const CLASSIC_BOOK_FAMILY = createStaticFamilyDefinition({
  kind: 'book',
  displayName: 'Classic book',
  src: bookSvgUrl,
  viewBox: '0 0 90.03 54.07',
})

const CLASSIC_CANDY_FAMILY = createStaticFamilyDefinition({
  kind: 'candy',
  displayName: 'Classic candy',
  src: candySvgUrl,
  viewBox: '0 0 59.16 32.11',
})

const CLASSIC_COMB_FAMILY = createStaticFamilyDefinition({
  kind: 'comb',
  displayName: 'Classic comb',
  src: combSvgUrl,
  viewBox: '0 0 70.29 66.53',
})

const CLASSIC_MOUSE_TRAP_FAMILY = createStaticFamilyDefinition({
  kind: 'mouse-trap',
  displayName: 'Classic mouse trap',
  src: mouseTrapSvgUrl,
  viewBox: '0 0 81.68 54.4',
})

const CLASSIC_MUG_FAMILY = createStaticFamilyDefinition({
  kind: 'mug',
  displayName: 'Classic mug',
  src: mugSvgUrl,
  viewBox: '0 0 51.89 47.61',
})

const CLASSIC_SHOE_FAMILY = createStaticFamilyDefinition({
  kind: 'shoe',
  displayName: 'Classic shoe',
  src: shoeSvgUrl,
  viewBox: '0 0 85.16 38.95',
})

const CLASSIC_SOAP_FAMILY = createStaticFamilyDefinition({
  kind: 'soap',
  displayName: 'Classic soap',
  src: soapSvgUrl,
  viewBox: '0 0 68.37 48.3',
})

const CLASSIC_TOOTHBRUSH_FAMILY = createStaticFamilyDefinition({
  kind: 'toothbrush',
  displayName: 'Classic toothbrush',
  src: toothbrushSvgUrl,
  viewBox: '0 0 63.68 70.76',
})

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
