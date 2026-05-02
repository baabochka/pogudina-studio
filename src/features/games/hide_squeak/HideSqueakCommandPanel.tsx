import type { ReactNode } from 'react'

import { formatDisplayCoordinate } from './coordinateUtils'
import type { HideSqueakGeneratedRound } from './types'

const DIRECTION_SYMBOLS = {
  up: '↑',
  right: '→',
  down: '↓',
  left: '←',
} as const

function formatDirectionText(
  direction: HideSqueakGeneratedRound['commands'][number]['direction'],
  steps: number,
) {
  return `${steps} step${steps === 1 ? '' : 's'} ${direction}`
}

export function HideSqueakCommandPanel({
  round,
  displayMode,
  isRules = false,
  headerAction,
}: {
  round: HideSqueakGeneratedRound
  displayMode: 'symbol' | 'text'
  isRules?: boolean
  headerAction?: ReactNode
}) {
  if (isRules) {
    const rulesCopy =
      round.difficulty === 'hard'
        ? 'Track where the mouse ends up by following the directions. Then choose the correct coordinate from the answer choices.'
        : round.difficulty === 'super-hard'
          ? 'Track where the mouse ends up by following the directions. Then type the final coordinate, like A1 or C3.'
          : 'Help the mouse reach an object by following directions like “1 step up” or “2 steps right.” When you reach the final step, click the object on the board.'

    return (
      <div className="font-ui text-left text-hs-textPrimary">
        <div className="space-y-2">
          <h3 className="font-game text-center text-[1.24rem] font-semibold leading-none sm:text-[1.5rem]">
            Rules:
          </h3>
          <p className="text-[0.92rem] leading-[1.28rem] text-hs-textPrimary/88 sm:text-[0.98rem] sm:leading-[1.4rem]">
            {rulesCopy}
          </p>
        </div>
      </div>
    )
  }

  const useTwoColumnLayout = round.difficulty === 'hard' || round.difficulty === 'super-hard'
  const useWideBubbleLayout = round.difficulty === 'hard' || round.difficulty === 'super-hard'
  const stepEntries = round.commandSteps.map((step) => ({
    id: `${step.index}-${step.command.direction}-${step.command.steps}`,
    index: step.index,
    label:
      displayMode === 'text'
        ? formatDirectionText(step.command.direction, step.command.steps)
        : `${DIRECTION_SYMBOLS[step.command.direction]} ${step.command.steps}`,
  }))
  const splitIndex = Math.ceil(stepEntries.length / 2)
  const columns = useTwoColumnLayout
    ? [stepEntries.slice(0, splitIndex), stepEntries.slice(splitIndex)]
    : [stepEntries]

  return (
    <div
      className={['min-w-0 max-w-full text-left text-hs-textPrimary', useWideBubbleLayout ? 'w-full' : ''].filter(Boolean).join(' ')}
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-3">
          <p className="font-game text-[15px] font-semibold leading-tight text-hs-textPrimary/95">
            I started on <span className="font-bold">{formatDisplayCoordinate(round.startingCoordinate)}</span>.
          </p>
          {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
        </div>

        <div>
          <p className="font-game text-sm leading-tight text-hs-textPrimary">
            Then:
          </p>

          <div
            className={[
              useTwoColumnLayout ? 'grid grid-cols-2 gap-x-1.5 gap-y-1.5' : 'space-y-1.5',
              'min-w-0 pb-1',
            ].join(' ')}
          >
            {columns.map((column, columnIndex) => (
              <ol
                key={`column-${columnIndex}`}
                className={[
                  'min-w-0 space-y-1.5',
                  useTwoColumnLayout && columnIndex === 0
                    ? 'border-r border-hs-panelMuted/60 pr-1.5'
                    : '',
                  useTwoColumnLayout && columnIndex === 1 ? 'pl-0.5' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                {column.map((step) => (
                  <li
                    key={step.id}
                    className={
                      useTwoColumnLayout
                        ? 'flex min-w-0 items-baseline gap-2 whitespace-normal sm:whitespace-nowrap'
                        : 'min-w-0 whitespace-normal text-[1rem] sm:whitespace-nowrap'
                    }
                  >
                    {useTwoColumnLayout ? (
                      <span className="font-ui min-w-5 text-right text-[0.9rem] text-hs-textSecondary/75">
                        {step.index + 1}.
                      </span>
                    ) : null}
                    <span className="font-game min-w-0 whitespace-normal text-[15px] font-medium leading-none text-hs-textPrimary sm:whitespace-nowrap">
                      {step.label}
                    </span>
                  </li>
                ))}
              </ol>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
