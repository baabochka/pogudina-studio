import { getItemAtCoordinate } from './boardUtils'
import { createBoardBounds, isCoordinateWithinBounds } from './boundsUtils'
import { HIDE_SQUEAK_DIFFICULTY_PRESETS } from './difficultyPresets'
import { areOppositeDirections, HIDE_SQUEAK_DIRECTIONS } from './directionUtils'
import { getTraversedCoordinates, stepCoordinate } from './pathUtils'
import type {
  HideSqueakBoard,
  HideSqueakBoardGenerationResult,
  HideSqueakCommand,
  HideSqueakCommandStep,
  HideSqueakCoordinate,
  HideSqueakDifficulty,
  HideSqueakDirection,
  HideSqueakGeneratedRound,
  HideSqueakRoundRules,
} from './types'

const DEFAULT_ROUND_ATTEMPT_LIMIT = 40

type BuildPathState = {
  commands: HideSqueakCommand[]
  positions: HideSqueakCoordinate[]
}

export interface HideSqueakRoundGenerationOptions {
  boardResult: HideSqueakBoardGenerationResult
  difficulty: HideSqueakDifficulty
  attemptLimit?: number
  random?: () => number
}

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive integer.`)
  }
}

function getRandomInteger(
  min: number,
  max: number,
  random: () => number,
) {
  assertPositiveInteger(min, 'Minimum random value')
  assertPositiveInteger(max, 'Maximum random value')

  if (min > max) {
    throw new RangeError('Minimum random value cannot be greater than the maximum.')
  }

  return Math.floor(random() * (max - min + 1)) + min
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

function createRoundId(random: () => number) {
  return `hide-squeak-${Math.floor(random() * 1_000_000_000).toString(36)}`
}

function isTraversedPathWithinBounds(
  start: HideSqueakCoordinate,
  command: HideSqueakCommand,
  board: Pick<HideSqueakBoard, 'size'>,
) {
  const bounds = createBoardBounds(board.size)

  return getTraversedCoordinates(start, command).every((coordinate) =>
    isCoordinateWithinBounds(coordinate, bounds),
  )
}

function createCommandStep(
  index: number,
  from: HideSqueakCoordinate,
  command: HideSqueakCommand,
): HideSqueakCommandStep {
  return {
    index,
    command,
    from,
    to: stepCoordinate(from, command.direction, command.steps),
  }
}

function buildCommandSteps(
  start: HideSqueakCoordinate,
  commands: HideSqueakCommand[],
) {
  const steps: HideSqueakCommandStep[] = []
  let currentCoordinate = start

  commands.forEach((command, index) => {
    const step = createCommandStep(index, currentCoordinate, command)
    steps.push(step)
    currentCoordinate = step.to
  })

  return steps
}

function getCandidateDirections(previousDirection?: HideSqueakDirection) {
  return HIDE_SQUEAK_DIRECTIONS.filter((direction) => {
    if (!previousDirection) {
      return true
    }

    if (direction === previousDirection) {
      return false
    }

    return !areOppositeDirections(direction, previousDirection)
  })
}

function getFinalStepCandidates(
  rules: HideSqueakRoundRules,
  random: () => number,
) {
  const normalSteps = getShuffledItems(
    Array.from(
      { length: rules.stepRange.max - rules.stepRange.min + 1 },
      (_, index) => rules.stepRange.min + index,
    ),
    random,
  )

  const extendedSteps = getShuffledItems(
    Array.from({ length: rules.finalStepRangeExtension }, (_, index) =>
      rules.stepRange.max + index + 1,
    ),
    random,
  )

  return [...normalSteps, ...extendedSteps]
}

function getIntermediateStepCandidates(
  rules: HideSqueakRoundRules,
  random: () => number,
) {
  return getShuffledItems(
    Array.from(
      { length: rules.stepRange.max - rules.stepRange.min + 1 },
      (_, index) => rules.stepRange.min + index,
    ),
    random,
  )
}

function getValidCommandCandidates({
  board,
  currentCoordinate,
  previousDirection,
  rules,
  isFinalCommand,
  random,
}: {
  board: HideSqueakBoard
  currentCoordinate: HideSqueakCoordinate
  previousDirection?: HideSqueakDirection
  rules: HideSqueakRoundRules
  isFinalCommand: boolean
  random: () => number
}) {
  const stepCandidates = isFinalCommand
    ? getFinalStepCandidates(rules, random)
    : getIntermediateStepCandidates(rules, random)
  const directions = getShuffledItems(
    getCandidateDirections(previousDirection),
    random,
  )
  const commands: HideSqueakCommand[] = []

  for (const steps of stepCandidates) {
    for (const direction of directions) {
      const command = { direction, steps }

      if (!isTraversedPathWithinBounds(currentCoordinate, command, board)) {
        continue
      }

      const destination = stepCoordinate(currentCoordinate, direction, steps)
      const landingItem = getItemAtCoordinate(board, destination)

      if (isFinalCommand) {
        if (!landingItem) {
          continue
        }
      } else if (!rules.allowLoops && landingItem) {
        continue
      }

      commands.push(command)
    }
  }

  return commands
}

function buildCommandPath({
  board,
  currentCoordinate,
  commandCount,
  commandIndex,
  previousDirection,
  rules,
  random,
}: {
  board: HideSqueakBoard
  currentCoordinate: HideSqueakCoordinate
  commandCount: number
  commandIndex: number
  previousDirection?: HideSqueakDirection
  rules: HideSqueakRoundRules
  random: () => number
}): BuildPathState | null {
  const isFinalCommand = commandIndex === commandCount - 1
  const candidates = getValidCommandCandidates({
    board,
    currentCoordinate,
    previousDirection,
    rules,
    isFinalCommand,
    random,
  })

  for (const command of candidates) {
    const nextCoordinate = stepCoordinate(
      currentCoordinate,
      command.direction,
      command.steps,
    )

    if (isFinalCommand) {
      return {
        commands: [command],
        positions: [nextCoordinate],
      }
    }

    const nextPath = buildCommandPath({
      board,
      currentCoordinate: nextCoordinate,
      commandCount,
      commandIndex: commandIndex + 1,
      previousDirection: command.direction,
      rules,
      random,
    })

    if (nextPath) {
      return {
        commands: [command, ...nextPath.commands],
        positions: [nextCoordinate, ...nextPath.positions],
      }
    }
  }

  return null
}

function getRandomStartCoordinate(
  boardResult: HideSqueakBoardGenerationResult,
  random: () => number,
) {
  if (boardResult.emptyCoordinates.length === 0) {
    throw new Error('Board has no empty cells available for the mouse start.')
  }

  const shuffledCoordinates = getShuffledItems(boardResult.emptyCoordinates, random)
  return shuffledCoordinates[0]
}

function withStartingCoordinate(
  board: HideSqueakBoard,
  startingCoordinate: HideSqueakCoordinate,
): HideSqueakBoard {
  return {
    ...board,
    startingCoordinate,
  }
}

export function generatePuzzleRound({
  boardResult,
  difficulty,
  attemptLimit = DEFAULT_ROUND_ATTEMPT_LIMIT,
  random = Math.random,
}: HideSqueakRoundGenerationOptions): HideSqueakGeneratedRound {
  assertPositiveInteger(attemptLimit, 'Round attempt limit')

  const preset = HIDE_SQUEAK_DIFFICULTY_PRESETS[difficulty]

  if (boardResult.board.items.length === 0) {
    throw new Error('Cannot generate a puzzle round without at least one board item.')
  }

  for (let attempt = 0; attempt < attemptLimit; attempt += 1) {
    const commandCount = getRandomInteger(
      preset.rules.commandCount.min,
      preset.rules.commandCount.max,
      random,
    )
    const startingCoordinate = getRandomStartCoordinate(boardResult, random)
    const path = buildCommandPath({
      board: boardResult.board,
      currentCoordinate: startingCoordinate,
      commandCount,
      commandIndex: 0,
      rules: preset.rules,
      random,
    })

    if (!path) {
      continue
    }

    const finalCoordinate = path.positions[path.positions.length - 1]
    const targetItem = getItemAtCoordinate(boardResult.board, finalCoordinate)

    if (!targetItem) {
      continue
    }

    return {
      id: createRoundId(random),
      board: withStartingCoordinate(boardResult.board, startingCoordinate),
      difficulty,
      startingCoordinate,
      commands: path.commands,
      commandSteps: buildCommandSteps(startingCoordinate, path.commands),
      intermediatePositions: path.positions.slice(0, -1),
      finalCoordinate,
      answer: finalCoordinate,
      answerModel: null,
      targetItem,
      answerOptions: [],
    }
  }

  throw new Error('Unable to generate a valid Hide & Squeak round within the attempt limit.')
}
