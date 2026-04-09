import { isSameCoordinate } from './boardUtils'
import { isCoordinateWithinBoard } from './boundsUtils'
import { formatDisplayCoordinate, parseDisplayCoordinate } from './coordinateUtils'
import { HIDE_SQUEAK_DIFFICULTY_PRESETS } from './difficultyPresets'
import { HIDE_SQUEAK_ANSWER_SETTINGS } from './answerSettings'
import type {
  HideSqueakAnswerModel,
  HideSqueakCoordinate,
  HideSqueakGeneratedRound,
  HideSqueakRoundAnswerOption,
  HideSqueakTypedAnswerValidation,
} from './types'

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

function getRandomInteger(min: number, max: number, random: () => number) {
  return Math.floor(random() * (max - min + 1)) + min
}

function getCoordinateKey(coordinate: HideSqueakCoordinate) {
  return `${coordinate.row}:${coordinate.column}`
}

function getBoardCoordinates(round: HideSqueakGeneratedRound) {
  const coordinates: HideSqueakCoordinate[] = []

  for (let row = 1; row <= round.board.size.rows; row += 1) {
    for (let column = 1; column <= round.board.size.columns; column += 1) {
      coordinates.push({ row, column })
    }
  }

  return coordinates
}

function getManhattanDistance(
  firstCoordinate: HideSqueakCoordinate,
  secondCoordinate: HideSqueakCoordinate,
) {
  return (
    Math.abs(firstCoordinate.row - secondCoordinate.row) +
    Math.abs(firstCoordinate.column - secondCoordinate.column)
  )
}

function getPlausibilityScore(
  candidate: HideSqueakCoordinate,
  answer: HideSqueakCoordinate,
) {
  const manhattanDistance = getManhattanDistance(candidate, answer)
  const rowDelta = Math.abs(candidate.row - answer.row)
  const columnDelta = Math.abs(candidate.column - answer.column)
  const sharesAxis = candidate.row === answer.row || candidate.column === answer.column
  const diagonalNeighbor = rowDelta === columnDelta

  return (
    manhattanDistance * 10 +
    (sharesAxis ? -3 : 0) +
    (diagonalNeighbor ? 1 : 0) +
    Math.abs(rowDelta - columnDelta)
  )
}

function getDistractorCoordinates(
  round: HideSqueakGeneratedRound,
  random: () => number,
) {
  const nearbyDistance = HIDE_SQUEAK_ANSWER_SETTINGS.nearbyDistractorDistance
  const answer = round.answer
  const nearbyCandidates: HideSqueakCoordinate[] = []
  const broaderCandidates: HideSqueakCoordinate[] = []

  for (const coordinate of getBoardCoordinates(round)) {
    if (isSameCoordinate(coordinate, answer)) {
      continue
    }

    if (!isCoordinateWithinBoard(coordinate, round.board.size)) {
      continue
    }

    const distance = getManhattanDistance(coordinate, answer)

    if (distance <= nearbyDistance) {
      nearbyCandidates.push(coordinate)
      continue
    }

    broaderCandidates.push(coordinate)
  }

  const sortByPlausibility = (coordinates: HideSqueakCoordinate[]) =>
    [...coordinates].sort(
      (firstCoordinate, secondCoordinate) =>
        getPlausibilityScore(firstCoordinate, answer) -
        getPlausibilityScore(secondCoordinate, answer),
    )

  return [
    ...getShuffledItems(sortByPlausibility(nearbyCandidates), random),
    ...getShuffledItems(sortByPlausibility(broaderCandidates), random),
  ]
}

function getItemCoordinateKeys(round: HideSqueakGeneratedRound) {
  return new Set(round.board.items.map((item) => getCoordinateKey(item.coordinate)))
}

function createAnswerOption(
  coordinate: HideSqueakCoordinate,
  isCorrect: boolean,
): HideSqueakRoundAnswerOption {
  return {
    id: `option-${getCoordinateKey(coordinate)}`,
    coordinate,
    label: formatDisplayCoordinate(coordinate),
    isCorrect,
  }
}

function createMultipleChoiceOptions(
  round: HideSqueakGeneratedRound,
  random: () => number,
) {
  const presetChoiceCount = HIDE_SQUEAK_DIFFICULTY_PRESETS[round.difficulty].choiceCount
  const choiceCount =
    presetChoiceCount > 0
      ? presetChoiceCount
      : getRandomInteger(
          HIDE_SQUEAK_ANSWER_SETTINGS.hardChoiceCountRange.min,
          HIDE_SQUEAK_ANSWER_SETTINGS.hardChoiceCountRange.max,
          random,
        )
  const chosenCoordinates = new Set<string>([getCoordinateKey(round.answer)])
  const itemCoordinateKeys = getItemCoordinateKeys(round)
  const prioritizedDistractorCoordinates = getDistractorCoordinates(round, random)
  const itemBackedDistractorCoordinates = prioritizedDistractorCoordinates.filter(
    (coordinate) => itemCoordinateKeys.has(getCoordinateKey(coordinate)),
  )
  const nonItemDistractorCoordinates = prioritizedDistractorCoordinates.filter(
    (coordinate) => !itemCoordinateKeys.has(getCoordinateKey(coordinate)),
  )
  const distractors: HideSqueakCoordinate[] = []

  for (const candidateGroup of [
    itemBackedDistractorCoordinates,
    nonItemDistractorCoordinates,
  ]) {
    for (const coordinate of candidateGroup) {
      if (distractors.length >= choiceCount - 1) {
        break
      }

      const key = getCoordinateKey(coordinate)

      if (chosenCoordinates.has(key)) {
        continue
      }

      distractors.push(coordinate)
      chosenCoordinates.add(key)
    }
  }

  const options = [
    createAnswerOption(round.answer, true),
    ...distractors.map((coordinate) => createAnswerOption(coordinate, false)),
  ]

  return getShuffledItems(options, random)
}

export function createAnswerModelForRound(
  round: HideSqueakGeneratedRound,
  random = Math.random,
): HideSqueakAnswerModel {
  const preset = HIDE_SQUEAK_DIFFICULTY_PRESETS[round.difficulty]
  const correctLabel = formatDisplayCoordinate(round.answer)

  if (preset.answerInput === 'board-click') {
    return {
      kind: 'board-cell',
      correctCoordinate: round.answer,
      correctLabel,
    }
  }

  if (preset.answerInput === 'coordinate-entry') {
    return {
      kind: 'typed-coordinate',
      correctCoordinate: round.answer,
      correctLabel,
    }
  }

  return {
    kind: 'multiple-choice',
    correctCoordinate: round.answer,
    correctLabel,
    options: createMultipleChoiceOptions(round, random),
  }
}

export function applyAnswerModelToRound(
  round: HideSqueakGeneratedRound,
  random = Math.random,
): HideSqueakGeneratedRound {
  const answerModel = createAnswerModelForRound(round, random)

  return {
    ...round,
    answerModel,
    answerOptions: answerModel.kind === 'multiple-choice' ? answerModel.options : [],
  }
}

export function validateTypedCoordinateAnswer(
  input: string,
  round: Pick<HideSqueakGeneratedRound, 'answer' | 'board'>,
): HideSqueakTypedAnswerValidation {
  const parsedCoordinate = parseDisplayCoordinate(input, round.board.size)
  const normalizedLabel = parsedCoordinate
    ? formatDisplayCoordinate(parsedCoordinate)
    : null

  return {
    input,
    parsedCoordinate,
    normalizedLabel,
    isValidFormat: parsedCoordinate != null,
    isCorrect:
      parsedCoordinate != null && isSameCoordinate(parsedCoordinate, round.answer),
  }
}
