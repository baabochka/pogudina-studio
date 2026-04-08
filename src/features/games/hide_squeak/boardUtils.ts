import type {
  HideSqueakBoard,
  HideSqueakCell,
  HideSqueakCoordinate,
  HideSqueakItem,
} from './types'

export function getCellKey(coordinate: HideSqueakCoordinate) {
  return `${coordinate.row}:${coordinate.column}`
}

export function isSameCoordinate(
  firstCoordinate: HideSqueakCoordinate,
  secondCoordinate: HideSqueakCoordinate,
) {
  return (
    firstCoordinate.row === secondCoordinate.row &&
    firstCoordinate.column === secondCoordinate.column
  )
}

export function getCellAtCoordinate(
  board: Pick<HideSqueakBoard, 'cells'>,
  coordinate: HideSqueakCoordinate,
): HideSqueakCell | null {
  return board.cells.find((cell) => isSameCoordinate(cell.coordinate, coordinate)) ?? null
}

export function getItemAtCoordinate(
  board: Pick<HideSqueakBoard, 'items'>,
  coordinate: HideSqueakCoordinate,
): HideSqueakItem | null {
  return board.items.find((item) => isSameCoordinate(item.coordinate, coordinate)) ?? null
}

export function isEmptyCell(cell: HideSqueakCell | null | undefined) {
  return cell?.kind === 'empty'
}

export function isItemCell(cell: HideSqueakCell | null | undefined) {
  return cell?.kind === 'item'
}

export function getEmptyCells(board: Pick<HideSqueakBoard, 'cells'>) {
  return board.cells.filter((cell) => isEmptyCell(cell))
}

export function getEmptyCoordinates(board: Pick<HideSqueakBoard, 'cells'>) {
  return getEmptyCells(board).map((cell) => cell.coordinate)
}
