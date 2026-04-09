import { describe, expect, it } from 'vitest'

import { HIDE_SQUEAK_BOARD_CONSTRAINTS } from './boardConstraints'
import { generateBoardLayout } from './boardGeneration'
import { generatePuzzleRound } from './roundGeneration'
import type {
  HideSqueakBoardSize,
  HideSqueakCoordinate,
  HideSqueakDifficulty,
  HideSqueakItem,
} from './types'

function createSeededRandom(seed: number) {
  let state = seed >>> 0

  return () => {
    state = (state * 1664525 + 1013904223) >>> 0
    return state / 0x100000000
  }
}

function getBoardSizeForDifficulty(difficulty: HideSqueakDifficulty): HideSqueakBoardSize {
  return difficulty === 'easy'
    ? { rows: 4, columns: 4 }
    : HIDE_SQUEAK_BOARD_CONSTRAINTS.size
}

function getExpectedItemCountRange(difficulty: HideSqueakDifficulty) {
  switch (difficulty) {
    case 'easy':
      return { min: 3, max: 4 }
    case 'medium':
      return { min: 5, max: 7 }
    case 'hard':
      return { min: 6, max: 8 }
    case 'super-hard':
      return { min: 8, max: 10 }
  }
}

function getCoordinateKey(coordinate: HideSqueakCoordinate) {
  return `${coordinate.row}:${coordinate.column}`
}

function getManhattanDistance(first: HideSqueakCoordinate, second: HideSqueakCoordinate) {
  return Math.abs(first.row - second.row) + Math.abs(first.column - second.column)
}

function getRowAndColumnCounts(items: readonly HideSqueakItem[]) {
  const rowCounts = new Map<number, number>()
  const columnCounts = new Map<number, number>()

  for (const item of items) {
    rowCounts.set(item.coordinate.row, (rowCounts.get(item.coordinate.row) ?? 0) + 1)
    columnCounts.set(
      item.coordinate.column,
      (columnCounts.get(item.coordinate.column) ?? 0) + 1,
    )
  }

  return { rowCounts, columnCounts }
}

function createRandomBoardDefinition(size: HideSqueakBoardSize) {
  const fittingItems = HIDE_SQUEAK_BOARD_CONSTRAINTS.itemDefinitions.filter(
    (itemDefinition) =>
      itemDefinition.id !== 'mouse-trap-classic' || size.rows >= 4,
  )

  return {
    mode: 'random' as const,
    itemDefinitions: fittingItems,
  }
}

function generateRoundForDifficulty(
  difficulty: HideSqueakDifficulty,
  seed: number,
) {
  const random = createSeededRandom(seed)
  const size = getBoardSizeForDifficulty(difficulty)
  const boardResult = generateBoardLayout({
    size,
    difficulty,
    itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
    definition: createRandomBoardDefinition(size),
    random,
  })

  const round = generatePuzzleRound({
    boardResult,
    difficulty,
    random,
  })

  return { boardResult, round }
}

describe('Hide & Squeak generation invariants', () => {
  it('keeps generated item counts within the expected difficulty range', () => {
    const difficulties: HideSqueakDifficulty[] = ['easy', 'medium', 'hard', 'super-hard']

    for (const difficulty of difficulties) {
      const expectedRange = getExpectedItemCountRange(difficulty)

      for (const seed of [11, 22, 33, 44, 55, 66]) {
        const random = createSeededRandom(seed)
        const size = getBoardSizeForDifficulty(difficulty)
        const boardResult = generateBoardLayout({
          size,
          difficulty,
          itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
          definition: createRandomBoardDefinition(size),
          random,
        })

        expect(boardResult.board.items.length).toBeGreaterThanOrEqual(expectedRange.min)
        expect(boardResult.board.items.length).toBeLessThanOrEqual(expectedRange.max)
      }
    }
  })

  it('keeps row and column caps respected on generated boards', () => {
    const maxPerRow = HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints.maxItemsPerRow
    const maxPerColumn = HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints.maxItemsPerColumn

    for (const difficulty of ['easy', 'medium', 'hard', 'super-hard'] as const) {
      for (const seed of [101, 202, 303, 404, 505]) {
        const random = createSeededRandom(seed)
        const size = getBoardSizeForDifficulty(difficulty)
        const boardResult = generateBoardLayout({
          size,
          difficulty,
          itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
          definition: createRandomBoardDefinition(size),
          random,
        })
        const { rowCounts, columnCounts } = getRowAndColumnCounts(boardResult.board.items)

        for (const count of rowCounts.values()) {
          expect(count).toBeLessThanOrEqual(maxPerRow)
        }

        for (const count of columnCounts.values()) {
          expect(count).toBeLessThanOrEqual(maxPerColumn)
        }
      }
    }
  })

  it('guarantees the final answer cell contains an item on hard and super-hard rounds', () => {
    for (const difficulty of ['hard', 'super-hard'] as const) {
      for (const seed of [17, 27, 37, 47, 57, 67]) {
        const { round } = generateRoundForDifficulty(difficulty, seed)
        const answerItem = round.board.items.find((item) =>
          getCoordinateKey(item.coordinate) === getCoordinateKey(round.answer),
        )

        expect(answerItem).toBeDefined()
      }
    }
  })

  it('keeps the start cell empty after the contextual post-pass', () => {
    for (const difficulty of ['easy', 'medium', 'hard', 'super-hard'] as const) {
      for (const seed of [71, 81, 91, 101, 111]) {
        const { round } = generateRoundForDifficulty(difficulty, seed)
        const startItem = round.board.items.find((item) =>
          getCoordinateKey(item.coordinate) === getCoordinateKey(round.startingCoordinate),
        )

        expect(startItem).toBeUndefined()
      }
    }
  })

  it('keeps item identities unique and coordinates unique after the contextual post-pass', () => {
    for (const difficulty of ['easy', 'medium', 'hard', 'super-hard'] as const) {
      for (const seed of [121, 131, 141, 151]) {
        const { round } = generateRoundForDifficulty(difficulty, seed)
        const itemIds = new Set(round.board.items.map((item) => item.id))
        const coordinateKeys = new Set(
          round.board.items.map((item) => getCoordinateKey(item.coordinate)),
        )

        expect(itemIds.size).toBe(round.board.items.length)
        expect(coordinateKeys.size).toBe(round.board.items.length)
      }
    }
  })

  it('allows controlled duplicate families without exceeding two per family', () => {
    let foundDuplicateFamily = false

    for (const difficulty of ['medium', 'hard', 'super-hard'] as const) {
      for (const seed of [12, 24, 36, 48, 60, 72, 84, 96]) {
        const random = createSeededRandom(seed)
        const size = getBoardSizeForDifficulty(difficulty)
        const boardResult = generateBoardLayout({
          size,
          difficulty,
          itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
          definition: createRandomBoardDefinition(size),
          random,
        })

        const countsByKind = new Map<string, number>()

        for (const item of boardResult.board.items) {
          countsByKind.set(item.kind, (countsByKind.get(item.kind) ?? 0) + 1)
        }

        for (const count of countsByKind.values()) {
          expect(count).toBeLessThanOrEqual(2)
        }

        if ([...countsByKind.values()].some((count) => count >= 2)) {
          foundDuplicateFamily = true
        }
      }
    }

    expect(foundDuplicateFamily).toBe(true)
  })

  it('prefers different color variants when duplicate families appear', () => {
    let foundDuplicateWithDifferentColors = false

    for (const difficulty of ['medium', 'hard', 'super-hard'] as const) {
      for (const seed of [12, 24, 36, 48, 60, 72, 84, 96]) {
        const random = createSeededRandom(seed)
        const size = getBoardSizeForDifficulty(difficulty)
        const boardResult = generateBoardLayout({
          size,
          difficulty,
          itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
          definition: createRandomBoardDefinition(size),
          random,
        })

        const variantsByKind = new Map<string, Set<string>>()

        for (const item of boardResult.board.items) {
          const variants = variantsByKind.get(item.kind) ?? new Set<string>()
          variants.add(item.colorVariant ?? 'default')
          variantsByKind.set(item.kind, variants)
        }

        for (const [kind, variants] of variantsByKind.entries()) {
          const countForKind = boardResult.board.items.filter((item) => item.kind === kind).length

          if (countForKind >= 2) {
            expect(variants.size).toBe(countForKind)
            foundDuplicateWithDifferentColors = true
          }
        }
      }
    }

    expect(foundDuplicateWithDifferentColors).toBe(true)
  })

  it('discourages placing duplicate families directly adjacent to each other', () => {
    let foundDuplicateFamily = false

    for (const difficulty of ['medium', 'hard', 'super-hard'] as const) {
      for (const seed of [12, 24, 36, 48, 60, 72, 84, 96]) {
        const random = createSeededRandom(seed)
        const size = getBoardSizeForDifficulty(difficulty)
        const boardResult = generateBoardLayout({
          size,
          difficulty,
          itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
          definition: createRandomBoardDefinition(size),
          random,
        })

        const itemsByKind = new Map<string, HideSqueakItem[]>()

        for (const item of boardResult.board.items) {
          const items = itemsByKind.get(item.kind) ?? []
          items.push(item)
          itemsByKind.set(item.kind, items)
        }

        for (const items of itemsByKind.values()) {
          if (items.length < 2) {
            continue
          }

          foundDuplicateFamily = true

          for (let index = 0; index < items.length; index += 1) {
            for (let compareIndex = index + 1; compareIndex < items.length; compareIndex += 1) {
              expect(
                getManhattanDistance(
                  items[index].coordinate,
                  items[compareIndex].coordinate,
                ),
              ).toBeGreaterThan(1)
            }
          }
        }
      }
    }

    expect(foundDuplicateFamily).toBe(true)
  })

  it('hard and super-hard boards place some distractor-adjacent items near the answer without over-clustering', () => {
    for (const difficulty of ['hard', 'super-hard'] as const) {
      for (const seed of [211, 311, 411, 511, 611]) {
        const { round } = generateRoundForDifficulty(difficulty, seed)
        const distractorItems = round.board.items.filter(
          (item) => getCoordinateKey(item.coordinate) !== getCoordinateKey(round.answer),
        )
        const plausibleNearbyCount = distractorItems.filter((item) => {
          const distance = getManhattanDistance(item.coordinate, round.answer)

          return (
            distance <= 3 ||
            item.coordinate.row === round.answer.row ||
            item.coordinate.column === round.answer.column
          )
        }).length
        const immediateNeighborCount = distractorItems.filter(
          (item) => getManhattanDistance(item.coordinate, round.answer) <= 1,
        ).length
        const nearAnswerClusterCount = distractorItems.filter(
          (item) => getManhattanDistance(item.coordinate, round.answer) <= 2,
        ).length

        expect(plausibleNearbyCount).toBeGreaterThanOrEqual(1)
        expect(immediateNeighborCount).toBeLessThanOrEqual(2)
        expect(nearAnswerClusterCount).toBeLessThanOrEqual(4)
      }
    }
  })
})
