import type {
  HideSqueakBoardBounds,
  HideSqueakBoardItemConstraints,
  HideSqueakBoardSize,
  HideSqueakCoordinateFormat,
  HideSqueakItemDefinition,
  HideSqueakItemKind,
} from './types'

export interface HideSqueakBoardConstraints {
  size: HideSqueakBoardSize
  bounds: HideSqueakBoardBounds
  coordinateFormat: HideSqueakCoordinateFormat
  defaultItemKind: HideSqueakItemKind
  maxHintsPerRound: number
  itemConstraints: HideSqueakBoardItemConstraints
  itemDefinitions: HideSqueakItemDefinition[]
}

export const HIDE_SQUEAK_BOARD_CONSTRAINTS: HideSqueakBoardConstraints = {
  size: {
    rows: 5,
    columns: 5,
  },
  bounds: {
    minRow: 1,
    maxRow: 5,
    minColumn: 1,
    maxColumn: 5,
  },
  coordinateFormat: 'alpha-numeric',
  defaultItemKind: 'cheese',
  maxHintsPerRound: 3,
  itemConstraints: {
    minTotalItems: 3,
    maxItemsPerRow: 2,
    maxItemsPerColumn: 2,
  },
  itemDefinitions: [
    {
      id: 'apple-classic-bright-red',
      kind: 'apple',
      family: 'classic',
      colorVariant: 'bright-red',
    },
    {
      id: 'bagel-classic-toasted',
      kind: 'bagel',
      family: 'classic',
      colorVariant: 'toasted',
    },
    {
      id: 'book-classic-plum',
      kind: 'book',
      family: 'classic',
      colorVariant: 'plum',
    },
    {
      id: 'candy-classic-grape',
      kind: 'candy',
      family: 'classic',
      colorVariant: 'grape',
    },
    {
      id: 'cheese-classic-off-white',
      kind: 'cheese',
      family: 'classic',
      colorVariant: 'off-white',
    },
    {
      id: 'comb-classic-coral',
      kind: 'comb',
      family: 'classic',
      colorVariant: 'coral',
    },
    {
      id: 'mouse-trap-classic-pewter',
      kind: 'mouse-trap',
      family: 'classic',
      colorVariant: 'pewter',
    },
    {
      id: 'mug-classic-blueberry',
      kind: 'mug',
      family: 'classic',
      colorVariant: 'blueberry',
    },
    {
      id: 'shoe-classic-apple-red',
      kind: 'shoe',
      family: 'classic',
      colorVariant: 'apple-red',
    },
    {
      id: 'soap-classic-original',
      kind: 'soap',
      family: 'classic',
      colorVariant: 'original',
    },
    {
      id: 'toothbrush-classic-mint',
      kind: 'toothbrush',
      family: 'classic',
      colorVariant: 'mint',
    },
  ],
}
