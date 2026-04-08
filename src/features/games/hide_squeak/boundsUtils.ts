import type {
  HideSqueakBoardBounds,
  HideSqueakBoardSize,
  HideSqueakCoordinate,
} from './types'

export function createBoardBounds(
  size: HideSqueakBoardSize,
): HideSqueakBoardBounds {
  return {
    minRow: 1,
    maxRow: size.rows,
    minColumn: 1,
    maxColumn: size.columns,
  }
}

export function isCoordinateWithinBounds(
  coordinate: HideSqueakCoordinate,
  bounds: HideSqueakBoardBounds,
) {
  return (
    coordinate.row >= bounds.minRow &&
    coordinate.row <= bounds.maxRow &&
    coordinate.column >= bounds.minColumn &&
    coordinate.column <= bounds.maxColumn
  )
}

export function isCoordinateWithinBoard(
  coordinate: HideSqueakCoordinate,
  size: HideSqueakBoardSize,
) {
  return isCoordinateWithinBounds(coordinate, createBoardBounds(size))
}
