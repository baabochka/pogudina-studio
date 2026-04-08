import { formatDisplayCoordinate } from './coordinateUtils'
import { HIDE_SQUEAK_SCORE_SETTINGS } from './scoreSettings'
import { HIDE_SQUEAK_TIMER_SETTINGS } from './timerSettings'
import { validateTypedCoordinateAnswer } from './answerGeneration'
import { isSameCoordinate } from './boardUtils'
import type {
  HideSqueakCoordinate,
  HideSqueakDifficulty,
  HideSqueakGeneratedRound,
  HideSqueakPlayMode,
  HideSqueakPreviousRoundSnapshot,
  HideSqueakRoundResult,
  HideSqueakSessionPhase,
  HideSqueakSessionState,
  HideSqueakTimerState,
  HideSqueakTypedAnswerValidation,
} from './types'

export type HideSqueakSessionAction =
  | { type: 'set-difficulty'; difficulty: HideSqueakDifficulty }
  | { type: 'set-play-mode'; playMode: HideSqueakPlayMode }
  | { type: 'open-rules' }
  | { type: 'close-rules' }
  | { type: 'start-round-generation' }
  | { type: 'round-generated'; round: HideSqueakGeneratedRound }
  | { type: 'submit-coordinate-answer'; coordinate: HideSqueakCoordinate }
  | { type: 'submit-typed-answer'; input: string }
  | { type: 'use-hint'; stepIndex: number }
  | { type: 'close-hint' }
  | { type: 'open-review' }
  | { type: 'close-review' }
  | { type: 'set-review-step'; stepIndex: number }
  | { type: 'set-review-visibility'; visibility: HideSqueakSessionState['reviewState']['visibility'] }
  | { type: 'tick-timer'; seconds?: number }
  | { type: 'restart-session' }
  | { type: 'restore-timed-best'; bestTimedScore: number }

export interface CreateHideSqueakSessionStateOptions {
  difficulty: HideSqueakDifficulty
  playMode?: HideSqueakPlayMode
  bestTimedScore?: number
}

function createInitialHintState() {
  return {
    hintsUsedThisRound: 0,
    revealedStepIndex: null,
    highlightedCommandIndex: null,
    isOpen: false,
  } satisfies HideSqueakSessionState['hintState']
}

function createInitialReviewState() {
  return {
    isOpen: false,
    visibility: 'step-by-step',
    roundId: null,
    selectedStepIndex: null,
  } satisfies HideSqueakSessionState['reviewState']
}

function createTimerState(playMode: HideSqueakPlayMode) {
  const isEnabled = playMode === 'timed'

  return {
    isEnabled,
    isPaused: false,
    totalSeconds: HIDE_SQUEAK_TIMER_SETTINGS.defaultTimedDurationSeconds,
    remainingSeconds: isEnabled
      ? HIDE_SQUEAK_TIMER_SETTINGS.defaultTimedDurationSeconds
      : HIDE_SQUEAK_TIMER_SETTINGS.defaultTimedDurationSeconds,
  } satisfies HideSqueakTimerState
}

function getPauseReasonPhase(phase: HideSqueakSessionPhase) {
  if (phase === 'rules') {
    return HIDE_SQUEAK_TIMER_SETTINGS.pauseDuringRules
  }

  if (phase === 'round-review') {
    return HIDE_SQUEAK_TIMER_SETTINGS.pauseDuringPreviousRoundReview
  }

  if (phase === 'generating-round') {
    return HIDE_SQUEAK_TIMER_SETTINGS.pauseDuringRoundGeneration
  }

  if (phase === 'hint') {
    return HIDE_SQUEAK_TIMER_SETTINGS.pauseDuringHintInspection
  }

  return false
}

function withTimerPauseState(state: HideSqueakSessionState): HideSqueakSessionState {
  if (!state.timer.isEnabled) {
    return {
      ...state,
      timer: {
        ...state.timer,
        isPaused: false,
      },
    }
  }

  return {
    ...state,
    timer: {
      ...state.timer,
      isPaused: getPauseReasonPhase(state.phase),
    },
  }
}

function resetRoundScopedState(state: HideSqueakSessionState): HideSqueakSessionState {
  return {
    ...state,
    hintState: createInitialHintState(),
    reviewState: createInitialReviewState(),
    progress: {
      ...state.progress,
      validationResult: 'idle',
      selectedAnswer: null,
    },
  }
}

function getHintPenalty(
  difficulty: HideSqueakDifficulty,
  hintsUsedThisRound: number,
) {
  if (difficulty === 'easy' || difficulty === 'medium') {
    return 0
  }

  return hintsUsedThisRound * HIDE_SQUEAK_SCORE_SETTINGS.hintPenaltyPerUse
}

function getCorrectRoundScoreDelta(
  difficulty: HideSqueakDifficulty,
  hintsUsedThisRound: number,
  streak: number,
) {
  const streakBonus = Math.min(
    streak * HIDE_SQUEAK_SCORE_SETTINGS.streakBonusStep,
    HIDE_SQUEAK_SCORE_SETTINGS.maxStreakBonus,
  )

  return Math.max(
    HIDE_SQUEAK_SCORE_SETTINGS.basePointsPerCorrectRound +
      streakBonus -
      getHintPenalty(difficulty, hintsUsedThisRound),
    0,
  )
}

function getWrongRoundScoreDelta() {
  return -HIDE_SQUEAK_SCORE_SETTINGS.wrongAnswerPenalty
}

function buildPreviousRoundSnapshot({
  round,
  result,
  selectedAnswer,
  scoreAfterRound,
  streakAfterRound,
}: {
  round: HideSqueakGeneratedRound
  result: HideSqueakRoundResult
  selectedAnswer: HideSqueakCoordinate | null
  scoreAfterRound: number
  streakAfterRound: number
}): HideSqueakPreviousRoundSnapshot {
  return {
    round,
    result,
    selectedAnswer,
    revealedAnswerLabel: formatDisplayCoordinate(round.answer),
    scoreAfterRound,
    streakAfterRound,
  }
}

function updateBestTimedScore(
  playMode: HideSqueakPlayMode,
  currentBestTimedScore: number,
  score: number,
) {
  return playMode === 'timed' ? Math.max(currentBestTimedScore, score) : currentBestTimedScore
}

function finishRound(
  state: HideSqueakSessionState,
  result: HideSqueakRoundResult,
  selectedAnswer: HideSqueakCoordinate | null,
) {
  if (!state.currentRound) {
    return state
  }

  const nextStreak = result === 'correct' ? state.progress.streak + 1 : 0
  const scoreDelta =
    result === 'correct'
      ? getCorrectRoundScoreDelta(
          state.difficulty,
          state.hintState.hintsUsedThisRound,
          state.progress.streak,
        )
      : getWrongRoundScoreDelta()
  const nextScore = Math.max(0, state.progress.score + scoreDelta)
  const nextBestTimedScore = updateBestTimedScore(
    state.playMode,
    state.progress.bestTimedScore,
    nextScore,
  )

  return withTimerPauseState({
    ...state,
    phase: state.timer.isEnabled && state.timer.remainingSeconds <= 0 ? 'finished' : 'paused',
    previousRound: buildPreviousRoundSnapshot({
      round: state.currentRound,
      result,
      selectedAnswer,
      scoreAfterRound: nextScore,
      streakAfterRound: nextStreak,
    }),
    progress: {
      ...state.progress,
      score: nextScore,
      streak: nextStreak,
      bestTimedScore: nextBestTimedScore,
      validationResult: result === 'correct' ? 'correct' : result === 'timed-out' ? 'revealed' : 'wrong',
      selectedAnswer,
    },
  })
}

function finishTimedSession(state: HideSqueakSessionState) {
  const nextBestTimedScore = updateBestTimedScore(
    state.playMode,
    state.progress.bestTimedScore,
    state.progress.score,
  )

  return withTimerPauseState({
    ...state,
    phase: 'finished',
    progress: {
      ...state.progress,
      bestTimedScore: nextBestTimedScore,
      validationResult:
        state.progress.validationResult === 'idle'
          ? 'revealed'
          : state.progress.validationResult,
    },
  })
}

function getPhaseAfterClosingReview(state: HideSqueakSessionState): HideSqueakSessionPhase {
  if (!state.currentRound) {
    return 'boot'
  }

  if (state.previousRound && state.currentRound.id === state.previousRound.round.id) {
    return 'paused'
  }

  return 'playing'
}

function submitCoordinateAnswer(
  state: HideSqueakSessionState,
  coordinate: HideSqueakCoordinate,
) {
  if (!state.currentRound || state.phase !== 'playing') {
    return state
  }

  return isSameCoordinate(coordinate, state.currentRound.answer)
    ? finishRound(state, 'correct', coordinate)
    : finishRound(state, 'wrong', coordinate)
}

function submitTypedAnswer(
  state: HideSqueakSessionState,
  input: string,
): HideSqueakSessionState {
  if (!state.currentRound || state.phase !== 'playing') {
    return state
  }

  const validation: HideSqueakTypedAnswerValidation = validateTypedCoordinateAnswer(input, {
    answer: state.currentRound.answer,
    board: state.currentRound.board,
  })

  if (!validation.isValidFormat || !validation.parsedCoordinate) {
    return {
      ...state,
      progress: {
        ...state.progress,
        validationResult: 'wrong',
      },
    }
  }

  return validation.isCorrect
    ? finishRound(state, 'correct', validation.parsedCoordinate)
    : finishRound(state, 'wrong', validation.parsedCoordinate)
}

export function createHideSqueakSessionState({
  difficulty,
  playMode = 'endless',
  bestTimedScore = 0,
}: CreateHideSqueakSessionStateOptions): HideSqueakSessionState {
  return withTimerPauseState({
    phase: 'boot',
    difficulty,
    playMode,
    currentRound: null,
    previousRound: null,
    progress: {
      roundNumber: 0,
      score: 0,
      streak: 0,
      bestTimedScore,
      validationResult: 'idle',
      selectedAnswer: null,
    },
    hintState: createInitialHintState(),
    reviewState: createInitialReviewState(),
    timer: createTimerState(playMode),
  })
}

export function shouldPauseHideSqueakTimer(state: HideSqueakSessionState) {
  return state.timer.isEnabled && state.timer.isPaused
}

export function reduceHideSqueakSessionState(
  state: HideSqueakSessionState,
  action: HideSqueakSessionAction,
): HideSqueakSessionState {
  switch (action.type) {
    case 'set-difficulty':
      return withTimerPauseState({
        ...createHideSqueakSessionState({
          difficulty: action.difficulty,
          playMode: state.playMode,
          bestTimedScore: state.progress.bestTimedScore,
        }),
      })

    case 'set-play-mode':
      return withTimerPauseState({
        ...createHideSqueakSessionState({
          difficulty: state.difficulty,
          playMode: action.playMode,
          bestTimedScore: state.progress.bestTimedScore,
        }),
      })

    case 'open-rules':
      return withTimerPauseState({
        ...state,
        phase: 'rules',
        reviewState: createInitialReviewState(),
        hintState: {
          ...state.hintState,
          isOpen: false,
          highlightedCommandIndex: null,
        },
      })

    case 'close-rules':
      return withTimerPauseState({
        ...state,
        phase: state.currentRound ? 'playing' : 'boot',
      })

    case 'start-round-generation':
      return withTimerPauseState(
        resetRoundScopedState({
          ...state,
          phase: 'generating-round',
        }),
      )

    case 'round-generated':
      return withTimerPauseState({
        ...resetRoundScopedState(state),
        phase: 'playing',
        currentRound: action.round,
        progress: {
          ...state.progress,
          roundNumber: state.progress.roundNumber + 1,
          validationResult: 'idle',
          selectedAnswer: null,
        },
      })

    case 'submit-coordinate-answer':
      return submitCoordinateAnswer(state, action.coordinate)

    case 'submit-typed-answer':
      return submitTypedAnswer(state, action.input)

    case 'use-hint':
      if (!state.currentRound || state.phase !== 'playing') {
        return state
      }

      return withTimerPauseState({
        ...state,
        phase: 'hint',
        hintState: {
          hintsUsedThisRound: state.hintState.hintsUsedThisRound + 1,
          revealedStepIndex: action.stepIndex,
          highlightedCommandIndex: action.stepIndex,
          isOpen: true,
        },
      })

    case 'close-hint':
      return withTimerPauseState({
        ...state,
        phase: state.currentRound ? 'playing' : state.phase,
        hintState: {
          ...state.hintState,
          isOpen: false,
          highlightedCommandIndex: null,
        },
      })

    case 'open-review':
      if (!state.previousRound) {
        return state
      }

      return withTimerPauseState({
        ...state,
        phase: 'round-review',
        reviewState: {
          isOpen: true,
          visibility: 'step-by-step',
          roundId: state.previousRound.round.id,
          selectedStepIndex: null,
        },
        hintState: {
          ...state.hintState,
          isOpen: false,
          highlightedCommandIndex: null,
        },
      })

    case 'close-review':
      return withTimerPauseState({
        ...state,
        phase: getPhaseAfterClosingReview(state),
        reviewState: createInitialReviewState(),
      })

    case 'set-review-step':
      if (!state.reviewState.isOpen) {
        return state
      }

      if (!state.previousRound) {
        return state
      }

      return withTimerPauseState({
        ...state,
        reviewState: {
          ...state.reviewState,
          selectedStepIndex: Math.min(
            Math.max(0, action.stepIndex),
            Math.max(state.previousRound.round.commandSteps.length - 1, 0),
          ),
        },
      })

    case 'set-review-visibility':
      if (!state.reviewState.isOpen) {
        return state
      }

      return withTimerPauseState({
        ...state,
        reviewState: {
          ...state.reviewState,
          visibility: action.visibility,
          selectedStepIndex:
            action.visibility === 'full-path'
              ? state.previousRound
                ? Math.max(state.previousRound.round.commandSteps.length - 1, 0)
                : state.reviewState.selectedStepIndex
              : null,
        },
      })

    case 'tick-timer': {
      if (
        !state.timer.isEnabled ||
        shouldPauseHideSqueakTimer(state) ||
        state.phase === 'finished'
      ) {
        return state
      }

      const elapsedSeconds = action.seconds ?? 1
      const remainingSeconds = Math.max(0, state.timer.remainingSeconds - elapsedSeconds)
      const nextState = {
        ...state,
        timer: {
          ...state.timer,
          remainingSeconds,
        },
      }

      if (remainingSeconds > 0) {
        return nextState
      }

      if (state.currentRound && state.phase === 'playing') {
        return finishTimedSession(
          finishRound(
            {
              ...nextState,
              timer: {
                ...nextState.timer,
                remainingSeconds: 0,
              },
            },
            'timed-out',
            null,
          ),
        )
      }

      return finishTimedSession(nextState)
    }

    case 'restart-session':
      return withTimerPauseState({
        ...createHideSqueakSessionState({
          difficulty: state.difficulty,
          playMode: state.playMode,
          bestTimedScore: state.progress.bestTimedScore,
        }),
      })

    case 'restore-timed-best':
      return {
        ...state,
        progress: {
          ...state.progress,
          bestTimedScore: Math.max(0, action.bestTimedScore),
        },
      }

    default:
      return state
  }
}
