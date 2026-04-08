import { useState } from 'react'

import { formatDisplayCoordinate } from './coordinateUtils'
import type {
  HideSqueakCoordinate,
  HideSqueakGeneratedRound,
  HideSqueakTypedAnswerValidation,
  HideSqueakValidationResult,
} from './types'

const ANSWER_BUTTON_CLASS_NAME =
  'font-game rounded-[16px] border-[3px] border-hs-textPrimary bg-hs-board px-3 py-1 text-[1.18rem] font-semibold leading-none text-hs-textPrimary shadow-hs-soft transition duration-150 hover:bg-hs-controlHover/30 active:bg-hs-controlActive/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel disabled:cursor-not-allowed disabled:opacity-60'
const ANSWER_INPUT_CLASS_NAME =
  'font-game h-10 w-22 rounded-[16px] border-[3px] border-hs-textSecondary bg-hs-board px-2.5 text-center text-[1.18rem] font-semibold uppercase text-hs-textPrimary shadow-hs-soft transition duration-150 hover:bg-hs-controlHover/25 active:bg-hs-controlActive/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel disabled:cursor-not-allowed disabled:opacity-60'

export function HideSqueakAnswerPanel({
  round,
  validationResult,
  isWaitingForNextRound,
  onCoordinateSelect,
  onTypedSubmit,
  onInteraction,
}: {
  round: HideSqueakGeneratedRound
  validationResult: HideSqueakValidationResult
  isWaitingForNextRound: boolean
  onCoordinateSelect?: (coordinate: HideSqueakCoordinate) => void
  onTypedSubmit?: (input: string) => HideSqueakTypedAnswerValidation
  onInteraction?: () => void
}) {
  const [typedValue, setTypedValue] = useState('')
  const [typedValidation, setTypedValidation] = useState<HideSqueakTypedAnswerValidation | null>(null)
  const answerModel = round.answerModel

  if (!answerModel || answerModel.kind === 'board-cell') {
    return null
  }

  function handleTypedSubmit() {
    if (!onTypedSubmit) {
      return
    }

    const nextValidation = onTypedSubmit(typedValue)
    setTypedValidation(nextValidation)

    if (nextValidation.isValidFormat) {
      setTypedValue(nextValidation.normalizedLabel ?? typedValue)
    }
  }

  return (
    <div className="mt-2 rounded-[20px] border-[3px] border-hs-panelMuted/90 bg-hs-panelMuted p-1.5 text-hs-textPrimary shadow-[inset_0_0_0_3px_color-mix(in_srgb,var(--hs-highlight)_38%,transparent)]">
      {answerModel.kind === 'multiple-choice' ? (
        <div className="space-y-2">
          <div className="text-center">
            <h4 className="font-game text-[1.12rem] font-medium leading-none text-hs-textSecondary">Answer:</h4>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-0.5">
            {answerModel.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={ANSWER_BUTTON_CLASS_NAME}
                disabled={validationResult !== 'idle' || isWaitingForNextRound}
                onFocus={onInteraction}
                onClick={() => {
                  onInteraction?.()
                  onCoordinateSelect?.(option.coordinate)
                }}
                aria-label={`Answer option ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {answerModel.kind === 'typed-coordinate' ? (
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2.5">
            <h4 className="font-game text-[1.12rem] font-medium leading-none text-hs-textSecondary">Answer:</h4>
            <input
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              value={typedValue}
              disabled={validationResult !== 'idle' || isWaitingForNextRound}
              onChange={(event) => {
                onInteraction?.()
                setTypedValue(event.target.value.toUpperCase())
                if (typedValidation) {
                  setTypedValidation(null)
                }
              }}
              onFocus={onInteraction}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  onInteraction?.()
                  handleTypedSubmit()
                }
              }}
              className={ANSWER_INPUT_CLASS_NAME}
              aria-label="Coordinate answer"
            />
          </div>
          <p className="font-ui text-center text-[0.88rem] leading-5 text-hs-textSecondary">
            (coordinates like {formatDisplayCoordinate({ row: 1, column: 1 })},{' '}
            {formatDisplayCoordinate({ row: 3, column: 3 })}, etc)
          </p>
          {typedValidation && !typedValidation.isValidFormat ? (
            <p className="font-ui text-center text-sm text-hs-wrong">
              Enter a valid in-bounds coordinate.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
