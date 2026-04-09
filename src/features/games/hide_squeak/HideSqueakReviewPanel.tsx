import { formatDisplayCoordinate } from './coordinateUtils'
import type { HideSqueakPreviousRoundSnapshot, HideSqueakReviewVisibility } from './types'

function formatDirectionText(direction: string, steps: number) {
  return `${steps} step${steps === 1 ? '' : 's'} ${direction}`
}

function getRevealChevronOpacity({
  revealIndex,
  selectedStepIndex,
  totalSteps,
}: {
  revealIndex: number
  selectedStepIndex: number | null
  totalSteps: number
}) {
  const latestRevealIndex =
    selectedStepIndex == null ? null : Math.min(selectedStepIndex + 1, totalSteps)

  if (latestRevealIndex == null || revealIndex > latestRevealIndex) {
    return null
  }

  const stepsBack = latestRevealIndex - revealIndex

  return Math.max(0.45, 1 - stepsBack * 0.05)
}

const REVIEW_STEP_BUTTON_CLASS_NAME =
  'font-game flex w-full items-center justify-between rounded-[18px] px-4 py-1 text-left transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel'
const REVIEW_ACTION_BUTTON_CLASS_NAME =
  'font-game w-full rounded-[18px] px-4 py-1 text-[1rem] shadow-hs-soft transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel'

export function HideSqueakReviewPanel({
  snapshot,
  visibility,
  selectedStepIndex,
  onSelectStep,
  onVisibilityChange,
}: {
  snapshot: HideSqueakPreviousRoundSnapshot
  visibility: HideSqueakReviewVisibility
  selectedStepIndex: number | null
  onSelectStep: (stepIndex: number) => void
  onVisibilityChange: (visibility: HideSqueakReviewVisibility) => void
}) {
  const isStartActive = visibility === 'step-by-step' && selectedStepIndex == null
  const isStartReached =
    visibility === 'full-path' ||
    (visibility === 'step-by-step' && selectedStepIndex != null)
  const isFullPathVisible =
    visibility === 'full-path' ||
    selectedStepIndex === snapshot.round.commandSteps.length - 1
  const useDenseStepSpacing =
    snapshot.round.difficulty === 'hard' || snapshot.round.difficulty === 'super-hard'
  const startChevronOpacity = getRevealChevronOpacity({
    revealIndex: 0,
    selectedStepIndex,
    totalSteps: snapshot.round.commandSteps.length,
  })

  return (
    <div className={useDenseStepSpacing ? 'space-y-2 text-left text-hs-textPrimary' : 'space-y-4 text-left text-hs-textPrimary'}>
      <ol className={useDenseStepSpacing ? 'space-y-1' : 'space-y-2'}>
        <li>
          <button
            type="button"
            className={[
              REVIEW_STEP_BUTTON_CLASS_NAME,
              useDenseStepSpacing ? 'rounded-[16px] px-3.5' : '',
              isStartActive
                ? 'bg-hs-highlight text-hs-textStrong shadow-hs-soft'
                : 'bg-hs-control/48 text-hs-textPrimary hover:bg-hs-controlHover/75 active:bg-hs-controlActive/70',
            ].join(' ')}
            onClick={() => onVisibilityChange('step-by-step')}
            aria-pressed={isStartActive}
          >
            <span className={useDenseStepSpacing ? 'text-[0.92rem] font-semibold leading-none' : 'text-[0.98rem] font-semibold leading-none'}>
              Start: {formatDisplayCoordinate(snapshot.round.startingCoordinate)}
            </span>
            <span
              className={useDenseStepSpacing ? 'text-[0.9rem] leading-none text-hs-textSecondary/88' : 'text-[1rem] leading-none text-hs-textSecondary/90'}
              style={
                isStartActive || isStartReached
                  ? startChevronOpacity != null
                    ? { opacity: startChevronOpacity }
                    : undefined
                  : undefined
              }
            >
              {isStartActive || isStartReached ? '▸' : '▹'}
            </span>
          </button>
        </li>

        {snapshot.round.commandSteps.map((step) => {
          const isActive = visibility === 'step-by-step' && selectedStepIndex === step.index
          const isReached =
            visibility === 'full-path' ||
            (visibility === 'step-by-step' &&
              selectedStepIndex != null &&
              step.index <= selectedStepIndex)
          const chevronOpacity = getRevealChevronOpacity({
            revealIndex: step.index + 1,
            selectedStepIndex,
            totalSteps: snapshot.round.commandSteps.length,
          })

          return (
            <li key={`${step.index}-${step.command.direction}-${step.command.steps}`}>
              <button
                type="button"
                className={[
                  REVIEW_STEP_BUTTON_CLASS_NAME,
                  useDenseStepSpacing ? 'rounded-[16px] px-3.5' : '',
                  isActive
                    ? 'bg-hs-highlight text-hs-textStrong shadow-hs-soft'
                    : 'bg-hs-control/48 text-hs-textPrimary hover:bg-hs-controlHover/75 active:bg-hs-controlActive/70',
                ].join(' ')}
                onClick={() => {
                  onVisibilityChange('step-by-step')
                  onSelectStep(step.index)
                }}
                aria-pressed={isActive}
              >
                <span className={useDenseStepSpacing ? 'text-[0.92rem] font-semibold leading-none' : 'text-[0.98rem] font-semibold leading-none'}>
                  {formatDirectionText(step.command.direction, step.command.steps)}
                </span>
                <span
                  className={useDenseStepSpacing ? 'text-[0.9rem] leading-none text-hs-textSecondary/88' : 'text-[1rem] leading-none text-hs-textSecondary/90'}
                  style={
                    isActive || isReached
                      ? chevronOpacity != null
                        ? { opacity: chevronOpacity }
                        : undefined
                      : undefined
                  }
                >
                  {isActive || isReached ? '▸' : '▹'}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div className={useDenseStepSpacing ? 'space-y-2 pt-0.5' : 'space-y-2.5 pt-1'}>
        <button
          type="button"
          className={[
            REVIEW_ACTION_BUTTON_CLASS_NAME,
            useDenseStepSpacing ? 'rounded-[16px] text-[0.94rem]' : '',
            'bg-hs-highlightSoft text-hs-textStrong hover:bg-hs-controlHover active:bg-hs-controlActive',
          ].join(' ')}
          onClick={() => onVisibilityChange(isFullPathVisible ? 'step-by-step' : 'full-path')}
        >
          {isFullPathVisible ? 'Hide full path' : 'Show full path'}
        </button>
      </div>
    </div>
  )
}
