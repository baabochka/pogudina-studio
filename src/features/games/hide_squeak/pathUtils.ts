import type {
  HideSqueakCommand,
  HideSqueakCoordinate,
  HideSqueakDirection,
} from './types'
import { getDirectionDelta } from './directionUtils'

function assertNonNegativeInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value < 0) {
    throw new RangeError(`${label} must be a non-negative integer.`)
  }
}

export function stepCoordinate(
  coordinate: HideSqueakCoordinate,
  direction: HideSqueakDirection,
  steps = 1,
): HideSqueakCoordinate {
  assertNonNegativeInteger(steps, 'Steps')

  const delta = getDirectionDelta(direction)

  return {
    row: coordinate.row + delta.row * steps,
    column: coordinate.column + delta.column * steps,
  }
}

export function getCommandDestination(
  coordinate: HideSqueakCoordinate,
  command: HideSqueakCommand,
) {
  return stepCoordinate(coordinate, command.direction, command.steps)
}

export function getTraversedCoordinates(
  coordinate: HideSqueakCoordinate,
  command: HideSqueakCommand,
) {
  assertNonNegativeInteger(command.steps, 'Command steps')

  return Array.from({ length: command.steps }, (_, index) =>
    stepCoordinate(coordinate, command.direction, index + 1),
  )
}
