import type { CSSProperties } from 'react'

import type { ObjectName } from './cardResolver'
import { basePalettes, fixedDetails, neutrals } from './palettes'

export const BOARD_VIEWBOX = { width: 321.35, height: 483.89 }

export type BoardControlName = 'previous' | 'restart' | 'rules' | 'five-card-mode'

export const BOARD_ANSWER_OPTIONS: ObjectName[] = ['mouse', 'cat', 'cheese', 'ball', 'pillow']

export const ANSWER_BUTTON_OVERLAYS: Record<ObjectName, { className: string; label: string }> = {
  mouse: { className: 'right-[0.3%] top-[23.8%] h-[12.8%] w-[19.3%]', label: 'Mouse' },
  cat: { className: 'right-[0.3%] top-[36.5%] h-[12.8%] w-[19.3%]', label: 'Cat' },
  cheese: { className: 'right-[0.3%] top-[48.6%] h-[12.8%] w-[19.3%]', label: 'Cheese' },
  ball: { className: 'right-[0.3%] top-[61.2%] h-[12.8%] w-[19.3%]', label: 'Ball' },
  pillow: { className: 'right-[0.3%] top-[73.7%] h-[12.8%] w-[19.3%]', label: 'Pillow' },
}

export const ANSWER_BUTTON_CENTERS: Record<ObjectName, { x: number; y: number }> = {
  mouse: { x: 291.24, y: 140.67 },
  cat: { x: 291.24, y: 201.89 },
  cheese: { x: 291.24, y: 260.46 },
  ball: { x: 291.24, y: 321.68 },
  pillow: { x: 291.24, y: 381.89 },
}

export const BOARD_CONTROL_OVERLAYS: Record<BoardControlName, { className: string; label: string }> = {
  previous: {
    className: 'left-[0.9%] top-[11.1%] h-[11.4%] w-[13.8%]',
    label: 'Review the previous card',
  },
  restart: {
    className: 'right-[0.8%] top-[11.7%] h-[11.8%] w-[19.1%]',
    label: 'Restart the round',
  },
  rules: {
    className: 'left-[0.2%] bottom-[0.3%] h-[8.6%] w-[13.8%]',
    label: 'Show the rules',
  },
  'five-card-mode': {
    className: 'right-[0.4%] bottom-[0.1%] h-[13.1%] w-[20.8%]',
    label: 'Switch to five card mode',
  },
}

export const CORRECT_ANSWER_PAW_FILL_COLOR = `${fixedDetails.accent.light}CC`
export const INCORRECT_ANSWER_PAW_FILL_COLOR = `${basePalettes.red.light}CC`
export const ANSWER_PAW_STROKE_COLOR = neutrals.black
export const PAW_TRAIL_FILL_COLOR = `${fixedDetails.accent.light}D9`
export const PAW_TRAIL_STROKE_COLOR = neutrals.black
export const BOARD_CONTROL_HOVER_FILL_COLOR = fixedDetails.board.hover

export type PawTrailStep = {
  key: string
  left: string
  top: string
  rotation: string
  delay: string
}

export function createPawTrailSteps(
  from: { x: number; y: number },
  to: { x: number; y: number },
  count: number,
  runId: number,
): PawTrailStep[] {
  const verticalDistance = Math.abs(to.y - from.y)
  const controlX = (from.x + to.x) / 2 - (92 + verticalDistance * 0.18)
  const controlY = (from.y + to.y) / 2 + (to.y - from.y) * 0.18

  return Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / (count + 1)
    const invT = 1 - t
    const x = invT * invT * from.x + 2 * invT * t * controlX + t * t * to.x
    const y = invT * invT * from.y + 2 * invT * t * controlY + t * t * to.y

    const tangentX = 2 * invT * (controlX - from.x) + 2 * t * (to.x - controlX)
    const tangentY = 2 * invT * (controlY - from.y) + 2 * t * (to.y - controlY)
    const rotation = `${(Math.atan2(tangentY, tangentX) * 180) / Math.PI + 90}deg`

    return {
      key: `paw-step-${runId}-${index}`,
      left: `${(x / BOARD_VIEWBOX.width) * 100}%`,
      top: `${(y / BOARD_VIEWBOX.height) * 100}%`,
      rotation,
      delay: `${index * 180}ms`,
    }
  })
}

export function getPawTrailStyle(step: PawTrailStep): CSSProperties {
  return {
    left: step.left,
    top: step.top,
    animationDelay: step.delay,
    '--paw-step-rotation': step.rotation,
  } as CSSProperties
}
