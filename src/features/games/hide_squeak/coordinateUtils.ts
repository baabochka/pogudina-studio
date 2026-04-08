import type {
  HideSqueakBoardSize,
  HideSqueakCoordinate,
} from './types'
import { isCoordinateWithinBoard } from './boundsUtils'

const ASCII_UPPERCASE_A = 65
const ALPHABET_LENGTH = 26

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 1) {
    throw new RangeError(`${label} must be a positive integer.`)
  }
}

function columnNumberToLabel(column: number) {
  assertPositiveInteger(column, 'Column')

  let value = column
  let label = ''

  while (value > 0) {
    const remainder = (value - 1) % ALPHABET_LENGTH
    label = String.fromCharCode(ASCII_UPPERCASE_A + remainder) + label
    value = Math.floor((value - 1) / ALPHABET_LENGTH)
  }

  return label
}

function columnLabelToNumber(label: string) {
  if (!/^[A-Z]+$/.test(label)) {
    return null
  }

  let column = 0

  for (const character of label) {
    column = column * ALPHABET_LENGTH + (character.charCodeAt(0) - ASCII_UPPERCASE_A + 1)
  }

  return column
}

export function formatDisplayCoordinate(coordinate: HideSqueakCoordinate) {
  assertPositiveInteger(coordinate.row, 'Row')
  return `${columnNumberToLabel(coordinate.column)}${coordinate.row}`
}

export function parseDisplayCoordinate(
  value: string,
  boardSize?: HideSqueakBoardSize,
): HideSqueakCoordinate | null {
  const normalizedValue = value.trim().toUpperCase()
  const match = normalizedValue.match(/^([A-Z]+)([1-9]\d*)$/)

  if (!match) {
    return null
  }

  const [, columnLabel, rowValue] = match
  const column = columnLabelToNumber(columnLabel)
  const row = Number.parseInt(rowValue, 10)

  if (column == null || !Number.isInteger(row) || row < 1) {
    return null
  }

  const coordinate = { row, column }

  if (boardSize && !isCoordinateWithinBoard(coordinate, boardSize)) {
    return null
  }

  return coordinate
}
