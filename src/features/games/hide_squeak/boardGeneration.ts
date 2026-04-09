import { getCellKey, getEmptyCoordinates } from './boardUtils'
import { createBoardBounds, isCoordinateWithinBounds } from './boundsUtils'
import { getHideSqueakItemAssetColorVariants } from './itemAssets'
import type {
  HideSqueakBoard,
  HideSqueakBoardDefinition,
  HideSqueakBoardGenerationResult,
  HideSqueakBoardItemConstraints,
  HideSqueakBoardSize,
  HideSqueakCoordinate,
  HideSqueakDifficulty,
  HideSqueakItem,
  HideSqueakItemDefinition,
} from './types'

export interface HideSqueakBoardGenerationOptions {
  size: HideSqueakBoardSize
  difficulty: HideSqueakDifficulty
  itemConstraints: HideSqueakBoardItemConstraints
  definition: HideSqueakBoardDefinition
  random?: () => number
}

const ITEM_OCCUPANCY_TARGETS: Record<
  HideSqueakDifficulty,
  { min: number; max: number }
> = {
  easy: { min: 0.18, max: 0.24 },
  medium: { min: 0.2, max: 0.28 },
  hard: { min: 0.24, max: 0.32 },
  'super-hard': { min: 0.3, max: 0.4 },
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

function getRandomArrayItem<T>(items: readonly T[], random: () => number) {
  if (items.length === 0) {
    return null
  }

  return items[Math.floor(random() * items.length)] ?? null
}

function getRandomizedItemDefinition(
  definition: HideSqueakItemDefinition,
  usedColorVariantsByFamily: Map<string, Set<string>>,
  random: () => number,
): HideSqueakItemDefinition {
  const availableColorVariants = getHideSqueakItemAssetColorVariants(
    definition.kind,
    definition.family,
  )

  if (availableColorVariants.length === 0) {
    return definition
  }

  const familyKey = `${definition.kind}:${definition.family}`
  const usedColorVariants = usedColorVariantsByFamily.get(familyKey) ?? new Set<string>()
  const unusedColorVariants = availableColorVariants.filter(
    (variant) => !usedColorVariants.has(variant),
  )

  const selectedColorVariant =
    getRandomArrayItem(
      unusedColorVariants.length > 0 ? unusedColorVariants : availableColorVariants,
      random,
    ) ??
    definition.colorVariant ??
    null

  if (selectedColorVariant) {
    usedColorVariants.add(selectedColorVariant)
    usedColorVariantsByFamily.set(familyKey, usedColorVariants)
  }

  return {
    ...definition,
    id: `${definition.id}--${selectedColorVariant ?? 'default'}`,
    colorVariant: selectedColorVariant,
  }
}

function getRandomizedItemDefinitions(
  itemDefinitions: readonly HideSqueakItemDefinition[],
  random: () => number,
) {
  const usedColorVariantsByFamily = new Map<string, Set<string>>()

  return itemDefinitions.map((definition) =>
    getRandomizedItemDefinition(definition, usedColorVariantsByFamily, random),
  )
}

function getRandomInteger(min: number, max: number, random: () => number) {
  if (!Number.isInteger(min) || !Number.isInteger(max) || min < 0 || max < 0) {
    throw new RangeError('Random range values must be non-negative integers.')
  }

  if (min > max) {
    throw new RangeError('Minimum random value cannot be greater than the maximum.')
  }

  return Math.floor(random() * (max - min + 1)) + min
}

function getBoardCellCount(size: HideSqueakBoardSize) {
  return size.rows * size.columns
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

function getMaxFeasibleItemCount(
  size: HideSqueakBoardSize,
  itemConstraints: HideSqueakBoardItemConstraints,
  availableItemCount: number,
) {
  const cellCapacity = Math.max(0, getBoardCellCount(size) - 1)
  const rowCapacity = size.rows * itemConstraints.maxItemsPerRow
  const columnCapacity = size.columns * itemConstraints.maxItemsPerColumn

  return Math.min(cellCapacity, rowCapacity, columnCapacity, availableItemCount)
}

function getManhattanDistance(
  first: HideSqueakCoordinate,
  second: HideSqueakCoordinate,
) {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}

function countNearbyItems(
  coordinate: HideSqueakCoordinate,
  items: readonly HideSqueakItem[],
) {
  let orthogonalNeighbors = 0
  let nearbyNeighbors = 0

  for (const item of items) {
    const rowDistance = Math.abs(item.coordinate.row - coordinate.row)
    const columnDistance = Math.abs(item.coordinate.column - coordinate.column)

    if (rowDistance === 0 && columnDistance === 0) {
      continue
    }

    if (rowDistance <= 1 && columnDistance <= 1) {
      nearbyNeighbors += 1
    }

    if (rowDistance + columnDistance === 1) {
      orthogonalNeighbors += 1
    }
  }

  return {
    nearbyNeighbors,
    orthogonalNeighbors,
  }
}

function countNearbySameFamilyItems(
  coordinate: HideSqueakCoordinate,
  items: readonly HideSqueakItem[],
  definition: Pick<HideSqueakItemDefinition, 'kind' | 'family'>,
) {
  let adjacentMatches = 0
  let nearbyMatches = 0

  for (const item of items) {
    if (item.kind !== definition.kind || item.family !== definition.family) {
      continue
    }

    const distance = getManhattanDistance(item.coordinate, coordinate)

    if (distance === 0) {
      continue
    }

    if (distance === 1) {
      adjacentMatches += 1
    }

    if (distance <= 2) {
      nearbyMatches += 1
    }
  }

  return {
    adjacentMatches,
    nearbyMatches,
  }
}

function hasAdjacentSameFamilyItem(
  coordinate: HideSqueakCoordinate,
  items: readonly HideSqueakItem[],
  definition: Pick<HideSqueakItemDefinition, 'kind' | 'family'>,
) {
  return items.some(
    (item) =>
      item.kind === definition.kind &&
      item.family === definition.family &&
      getManhattanDistance(item.coordinate, coordinate) === 1,
  )
}

function pickWeightedItem<T>(
  items: readonly T[],
  getWeight: (item: T) => number,
  random: () => number,
) {
  const weightedItems = items.map((item) => ({
    item,
    weight: Math.max(0, getWeight(item)),
  }))
  const totalWeight = weightedItems.reduce((sum, current) => sum + current.weight, 0)

  if (totalWeight <= 0) {
    return items[Math.floor(random() * items.length)] ?? null
  }

  let threshold = random() * totalWeight

  for (const weightedItem of weightedItems) {
    threshold -= weightedItem.weight

    if (threshold <= 0) {
      return weightedItem.item
    }
  }

  return weightedItems[weightedItems.length - 1]?.item ?? null
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

  const maxFeasibleItems = getMaxFeasibleItemCount(
    size,
    itemConstraints,
    uniqueItemCount,
  )

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
  itemConstraints: HideSqueakBoardItemConstraints,
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
    itemConstraints,
  }
}

export function getTargetItemCount(
  size: HideSqueakBoardSize,
  difficulty: HideSqueakDifficulty,
  itemConstraints: HideSqueakBoardItemConstraints,
  availableItemCount: number,
  random: () => number = Math.random,
) {
  const occupancyTarget = ITEM_OCCUPANCY_TARGETS[difficulty]
  const boardCellCount = getBoardCellCount(size)
  const maxFeasibleItemCount = getMaxFeasibleItemCount(
    size,
    itemConstraints,
    availableItemCount,
  )
  const minTargetCount = Math.max(
    itemConstraints.minTotalItems,
    Math.round(boardCellCount * occupancyTarget.min),
  )
  const maxTargetCount = Math.max(
    minTargetCount,
    Math.round(boardCellCount * occupancyTarget.max),
  )
  const boundedMinTargetCount = Math.min(minTargetCount, maxFeasibleItemCount)
  const boundedMaxTargetCount = Math.min(maxTargetCount, maxFeasibleItemCount)

  if (boundedMaxTargetCount < itemConstraints.minTotalItems) {
    throw new Error('Board constraints cannot fit the minimum total item count.')
  }

  return getRandomInteger(
    boundedMinTargetCount,
    boundedMaxTargetCount,
    random,
  )
}

function getCandidatePlacementScore({
  coordinate,
  items,
  definition,
  rowCounts,
  columnCounts,
  difficulty,
  startingCoordinate,
  finalCoordinate,
  random,
}: {
  coordinate: HideSqueakCoordinate
  items: readonly HideSqueakItem[]
  definition: Pick<HideSqueakItemDefinition, 'kind' | 'family'>
  rowCounts: ReadonlyMap<number, number>
  columnCounts: ReadonlyMap<number, number>
  difficulty: HideSqueakDifficulty
  startingCoordinate?: HideSqueakCoordinate | null
  finalCoordinate?: HideSqueakCoordinate | null
  random: () => number
}) {
  let score = 1 + random() * 0.08
  const rowCount = rowCounts.get(coordinate.row) ?? 0
  const columnCount = columnCounts.get(coordinate.column) ?? 0
  const { nearbyNeighbors, orthogonalNeighbors } = countNearbyItems(
    coordinate,
    items,
  )
  const { adjacentMatches, nearbyMatches } = countNearbySameFamilyItems(
    coordinate,
    items,
    definition,
  )

  score /= 1 + rowCount * 0.75
  score /= 1 + columnCount * 0.75
  score /= 1 + nearbyNeighbors * 0.95 + orthogonalNeighbors * 0.9
  score /= 1 + adjacentMatches * 3.2 + nearbyMatches * 1.15

  if (startingCoordinate) {
    const distanceFromStart = getManhattanDistance(coordinate, startingCoordinate)

    if (distanceFromStart <= 1) {
      score *= 0.08
    } else if (distanceFromStart === 2) {
      score *= 0.35
    } else if (distanceFromStart === 3) {
      score *= 0.72
    }
  }

  if (
    finalCoordinate &&
    (difficulty === 'hard' || difficulty === 'super-hard')
  ) {
    const distanceFromFinal = getManhattanDistance(coordinate, finalCoordinate)

    if (distanceFromFinal <= 1) {
      score *= 2.1
    } else if (distanceFromFinal <= 2) {
      score *= 1.7
    } else if (distanceFromFinal <= 3) {
      score *= 1.3
    }

    if (
      coordinate.row === finalCoordinate.row ||
      coordinate.column === finalCoordinate.column
    ) {
      score *= 1.22
    }
  }

  return score
}

function placeItemsWithScoring({
  size,
  itemConstraints,
  itemDefinitions,
  difficulty,
  targetItemCount,
  startingCoordinate = null,
  finalCoordinate = null,
  reservedFinalItemId = null,
  random,
}: {
  size: HideSqueakBoardSize
  itemConstraints: HideSqueakBoardItemConstraints
  itemDefinitions: readonly HideSqueakItemDefinition[]
  difficulty: HideSqueakDifficulty
  targetItemCount: number
  startingCoordinate?: HideSqueakCoordinate | null
  finalCoordinate?: HideSqueakCoordinate | null
  reservedFinalItemId?: string | null
  random: () => number
}) {
  validateBoardFeasibility(size, itemConstraints, itemDefinitions.length)

  if (
    startingCoordinate &&
    finalCoordinate &&
    getCellKey(startingCoordinate) === getCellKey(finalCoordinate)
  ) {
    throw new Error('Start and final coordinates cannot be the same when placing board items.')
  }

  const allCoordinates = getAllCoordinates(size)
  const availableDefinitions = getShuffledItems(itemDefinitions, random)
  const rowCounts = new Map<number, number>()
  const columnCounts = new Map<number, number>()
  const items: HideSqueakItem[] = []
  const targetCount = Math.min(targetItemCount, availableDefinitions.length)

  if (reservedFinalItemId && finalCoordinate) {
    const reservedIndex = availableDefinitions.findIndex(
      (definition) => definition.id === reservedFinalItemId,
    )

    if (reservedIndex === -1) {
      throw new Error(`Reserved final item "${reservedFinalItemId}" was not found in the item definitions.`)
    }

    const [reservedDefinition] = availableDefinitions.splice(reservedIndex, 1)

    if (!reservedDefinition) {
      throw new Error(`Reserved final item "${reservedFinalItemId}" could not be placed.`)
    }

    items.push({
      ...reservedDefinition,
      coordinate: finalCoordinate,
    })
    rowCounts.set(finalCoordinate.row, 1)
    columnCounts.set(finalCoordinate.column, 1)
  }

  while (items.length < targetCount) {
    const definitionIndex = items.length - (reservedFinalItemId ? 1 : 0)
    const nextDefinition = availableDefinitions[definitionIndex]

    if (!nextDefinition) {
      break
    }

    const candidates = allCoordinates.filter((coordinate) => {
      if (startingCoordinate && getCellKey(coordinate) === getCellKey(startingCoordinate)) {
        return false
      }

      if (items.some((item) => getCellKey(item.coordinate) === getCellKey(coordinate))) {
        return false
      }

      const rowCount = rowCounts.get(coordinate.row) ?? 0
      const columnCount = columnCounts.get(coordinate.column) ?? 0

      return (
        rowCount < itemConstraints.maxItemsPerRow &&
        columnCount < itemConstraints.maxItemsPerColumn
      )
    })

    if (candidates.length === 0) {
      break
    }

    const spacedCandidates = candidates.filter(
      (candidate) =>
        !hasAdjacentSameFamilyItem(candidate, items, nextDefinition),
    )
    const eligibleCandidates =
      spacedCandidates.length > 0 ? spacedCandidates : candidates

    const coordinate = pickWeightedItem(
      eligibleCandidates,
      (candidate) =>
        getCandidatePlacementScore({
          coordinate: candidate,
          items,
          definition: nextDefinition,
          rowCounts,
          columnCounts,
          difficulty,
          startingCoordinate,
          finalCoordinate,
          random,
        }),
      random,
    )

    if (!coordinate) {
      break
    }

    const rowCount = rowCounts.get(coordinate.row) ?? 0
    const columnCount = columnCounts.get(coordinate.column) ?? 0

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

function createRandomItems(
  size: HideSqueakBoardSize,
  difficulty: HideSqueakDifficulty,
  itemConstraints: HideSqueakBoardItemConstraints,
  itemDefinitions: readonly HideSqueakItemDefinition[],
  random: () => number,
) {
  const randomizedDefinitions = getRandomizedItemDefinitions(itemDefinitions, random)
  const targetItemCount = getTargetItemCount(
    size,
    difficulty,
    itemConstraints,
    randomizedDefinitions.length,
    random,
  )

  return placeItemsWithScoring({
    size,
    itemConstraints,
    itemDefinitions: randomizedDefinitions,
    difficulty,
    targetItemCount,
    random,
  })
}

export function regenerateBoardItemsForRoundContext({
  size,
  difficulty,
  itemConstraints,
  itemDefinitions,
  startingCoordinate,
  finalCoordinate,
  targetItemId,
  random = Math.random,
}: {
  size: HideSqueakBoardSize
  difficulty: HideSqueakDifficulty
  itemConstraints: HideSqueakBoardItemConstraints
  itemDefinitions: readonly HideSqueakItemDefinition[]
  startingCoordinate: HideSqueakCoordinate
  finalCoordinate: HideSqueakCoordinate
  targetItemId: string
  random?: () => number
}) {
  const items = placeItemsWithScoring({
    size,
    itemConstraints,
    itemDefinitions,
    difficulty,
    targetItemCount: itemDefinitions.length,
    startingCoordinate,
    finalCoordinate,
    reservedFinalItemId: targetItemId,
    random,
  })

  return buildBoard(size, items, itemConstraints)
}

export function generateBoardLayout({
  size,
  difficulty,
  itemConstraints,
  definition,
  random = Math.random,
}: HideSqueakBoardGenerationOptions): HideSqueakBoardGenerationResult {
  if (definition.mode === 'pinned') {
    validateBoardFeasibility(size, itemConstraints, definition.items.length)
    validatePlacedItems(definition.items, size, itemConstraints)

    return {
      ...buildBoard(size, definition.items, itemConstraints),
      source: 'preset',
    }
  }

  const items = createRandomItems(
    size,
    difficulty,
    itemConstraints,
    definition.itemDefinitions,
    random,
  )

  return buildBoard(size, items, itemConstraints)
}
