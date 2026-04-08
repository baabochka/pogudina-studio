import type { HideSqueakCoordinate, HideSqueakDirection } from './types'

export const HIDE_SQUEAK_DIRECTIONS: readonly HideSqueakDirection[] = [
  'up',
  'right',
  'down',
  'left',
]

const DIRECTION_DELTAS: Record<
  HideSqueakDirection,
  Pick<HideSqueakCoordinate, 'row' | 'column'>
> = {
  up: { row: -1, column: 0 },
  right: { row: 0, column: 1 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
}

const OPPOSITE_DIRECTIONS: Record<HideSqueakDirection, HideSqueakDirection> = {
  up: 'down',
  right: 'left',
  down: 'up',
  left: 'right',
}

export function getDirectionDelta(direction: HideSqueakDirection) {
  return DIRECTION_DELTAS[direction]
}

export function getOppositeDirection(direction: HideSqueakDirection) {
  return OPPOSITE_DIRECTIONS[direction]
}

export function areOppositeDirections(
  firstDirection: HideSqueakDirection,
  secondDirection: HideSqueakDirection,
) {
  return getOppositeDirection(firstDirection) === secondDirection
}
