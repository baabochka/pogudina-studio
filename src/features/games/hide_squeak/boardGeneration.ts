import { getCellKey, getEmptyCoordinates } from './boardUtils'
import { createBoardBounds, isCoordinateWithinBounds } from './boundsUtils'
import type {
  HideSqueakBoard,
  HideSqueakBoardDefinition,
  HideSqueakBoardGenerationResult,
  HideSqueakBoardItemConstraints,
  HideSqueakBoardSize,
  HideSqueakCoordinate,
  HideSqueakItem,
  HideSqueakItemDefinition,
} from './types'

export interface HideSqueakBoardGenerationOptions {
  size: HideSqueakBoardSize
  itemConstraints: HideSqueakBoardItemConstraints
  definition: HideSqueakBoardDefinition
  random?: () => number
}

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive integer.`)
  }
}

function getAllCoordinates(size: HideSqueakBoardSize) {
  const coordinates: HideSqueakCoordinate[] = []

  for (let row = 1; row <= size.rows; row += 1) {
    for (let column = 1; column <= size.columns; column += 1) {
      coordinates.push({ row, column })
    }
  }

  return coordinates
}

function getShuffledItems<T>(items: readonly T[], random: () => number) {
  const nextItems = [...items]

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1))
    const currentItem = nextItems[index]

    nextItems[index] = nextItems[swapIndex]
    nextItems[swapIndex] = currentItem
  }

  return nextItems
}

function countItemsByAxis(
  items: readonly HideSqueakItem[],
  axis: 'row' | 'column',
) {
  const counts = new Map<number, number>()

  for (const item of items) {
    const key = item.coordinate[axis]
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return counts
}

function validateBoardFeasibility(
  size: HideSqueakBoardSize,
  itemConstraints: HideSqueakBoardItemConstraints,
  uniqueItemCount: number,
) {
  assertPositiveInteger(size.rows, 'Board rows')
  assertPositiveInteger(size.columns, 'Board columns')
  assertPositiveInteger(itemConstraints.minTotalItems, 'Minimum total items')
  assertPositiveInteger(itemConstraints.maxItemsPerRow, 'Max items per row')
  assertPositiveInteger(itemConstraints.maxItemsPerColumn, 'Max items per column')

  const cellCapacity = size.rows * size.columns
  const rowCapacity = size.rows * itemConstraints.maxItemsPerRow
  const columnCapacity = size.columns * itemConstraints.maxItemsPerColumn
  const maxFeasibleItems = Math.min(cellCapacity, rowCapacity, columnCapacity)

  if (itemConstraints.minTotalItems > maxFeasibleItems) {
    throw new Error('Board constraints cannot fit the minimum total item count.')
  }

  if (uniqueItemCount < itemConstraints.minTotalItems) {
    throw new Error('Not enough unique item definitions are available for the board.')
  }
}

function validatePlacedItems(
  items: readonly HideSqueakItem[],
  size: HideSqueakBoardSize,
  itemConstraints: HideSqueakBoardItemConstraints,
) {
  const bounds = createBoardBounds(size)
  const coordinateKeys = new Set<string>()
  const itemIds = new Set<string>()

  for (const item of items) {
    if (!isCoordinateWithinBounds(item.coordinate, bounds)) {
      throw new Error(`Item "${item.id}" is out of board bounds.`)
    }

    if (itemIds.has(item.id)) {
      throw new Error(`Item id "${item.id}" must be unique.`)
    }

    const coordinateKey = getCellKey(item.coordinate)

    if (coordinateKeys.has(coordinateKey)) {
      throw new Error(`Multiple items cannot occupy coordinate "${coordinateKey}".`)
    }

    itemIds.add(item.id)
    coordinateKeys.add(coordinateKey)
  }

  if (items.length < itemConstraints.minTotalItems) {
    throw new Error('Board contains fewer items than the configured minimum.')
  }

  const rowCounts = countItemsByAxis(items, 'row')
  const columnCounts = countItemsByAxis(items, 'column')

  for (const count of rowCounts.values()) {
    if (count > itemConstraints.maxItemsPerRow) {
      throw new Error('Board exceeds the maximum number of items allowed in a row.')
    }
  }

  for (const count of columnCounts.values()) {
    if (count > itemConstraints.maxItemsPerColumn) {
      throw new Error('Board exceeds the maximum number of items allowed in a column.')
    }
  }
}

function buildBoard(
  size: HideSqueakBoardSize,
  items: HideSqueakItem[],
): HideSqueakBoardGenerationResult {
  const itemByCoordinate = new Map(items.map((item) => [getCellKey(item.coordinate), item]))
  const cells = getAllCoordinates(size).map((coordinate) => {
    const item = itemByCoordinate.get(getCellKey(coordinate))

    if (!item) {
      return {
        coordinate,
        kind: 'empty' as const,
      }
    }

    return {
      coordinate,
      kind: 'item' as const,
      itemId: item.id,
    }
  })

  const board: HideSqueakBoard = {
    size,
    cells,
    items,
    startingCoordinate: null,
  }

  return {
    board,
    emptyCoordinates: getEmptyCoordinates(board),
    source: 'generated',
  }
}

function createRandomItems(
  size: HideSqueakBoardSize,
  itemConstraints: HideSqueakBoardItemConstraints,
  itemDefinitions: readonly HideSqueakItemDefinition[],
  random: () => number,
) {
  validateBoardFeasibility(size, itemConstraints, itemDefinitions.length)

  const allCoordinates = getShuffledItems(getAllCoordinates(size), random)
  const availableDefinitions = getShuffledItems(itemDefinitions, random)
  const rowCounts = new Map<number, number>()
  const columnCounts = new Map<number, number>()
  const items: HideSqueakItem[] = []

  for (const coordinate of allCoordinates) {
    if (items.length >= itemConstraints.minTotalItems) {
      break
    }

    const rowCount = rowCounts.get(coordinate.row) ?? 0
    const columnCount = columnCounts.get(coordinate.column) ?? 0

    if (rowCount >= itemConstraints.maxItemsPerRow) {
      continue
    }

    if (columnCount >= itemConstraints.maxItemsPerColumn) {
      continue
    }

    const nextDefinition = availableDefinitions[items.length]

    if (!nextDefinition) {
      break
    }

    items.push({
      ...nextDefinition,
      coordinate,
    })

    rowCounts.set(coordinate.row, rowCount + 1)
    columnCounts.set(coordinate.column, columnCount + 1)
  }

  validatePlacedItems(items, size, itemConstraints)

  return items
}

export function generateBoardLayout({
  size,
  itemConstraints,
  definition,
  random = Math.random,
}: HideSqueakBoardGenerationOptions): HideSqueakBoardGenerationResult {
  if (definition.mode === 'pinned') {
    validateBoardFeasibility(size, itemConstraints, definition.items.length)
    validatePlacedItems(definition.items, size, itemConstraints)

    return {
      ...buildBoard(size, definition.items),
      source: 'preset',
    }
  }

  const items = createRandomItems(size, itemConstraints, definition.itemDefinitions, random)
  return buildBoard(size, items)
}
