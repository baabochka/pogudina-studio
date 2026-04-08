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
    minTotalItems: 5,
    maxItemsPerRow: 2,
    maxItemsPerColumn: 2,
  },
  itemDefinitions: [
    {
      id: 'apple-classic',
      kind: 'apple',
      family: 'classic',
    },
    {
      id: 'bagel-classic',
      kind: 'bagel',
      family: 'classic',
    },
    {
      id: 'book-classic',
      kind: 'book',
      family: 'classic',
    },
    {
      id: 'candy-classic',
      kind: 'candy',
      family: 'classic',
    },
    {
      id: 'cheese-classic',
      kind: 'cheese',
      family: 'classic',
      colorVariant: 'default',
      detailVariant: 'classic-holes',
    },
    {
      id: 'comb-classic',
      kind: 'comb',
      family: 'classic',
    },
    {
      id: 'mouse-trap-classic',
      kind: 'mouse-trap',
      family: 'classic',
    },
    {
      id: 'mug-classic',
      kind: 'mug',
      family: 'classic',
    },
    {
      id: 'shoe-classic',
      kind: 'shoe',
      family: 'classic',
    },
    {
      id: 'soap-classic',
      kind: 'soap',
      family: 'classic',
    },
    {
      id: 'toothbrush-classic',
      kind: 'toothbrush',
      family: 'classic',
    },
  ],
}
