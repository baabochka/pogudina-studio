import { useEffect, useRef, useState } from 'react'

import type { IllustrationName, ObjectName, ResolvedCard } from './cardResolver'
import {
  CARD_TRANSITION_TOTAL_MS,
  CORRECT_VALIDATION_MS,
  loadBestTotal,
  getRecentIllustrationsWithNext,
  resolveSessionCard,
  ROUND_DURATION_SECONDS,
  saveBestTotal,
  WRONG_VALIDATION_MS,
} from './gameSessionUtils'

export type ValidationResult = 'idle' | 'correct' | 'wrong' | 'finished'

export type ReviewedTurn = {
  card: ResolvedCard
  selectedAnswer: ObjectName
  correctAnswer: ObjectName
  wasCorrect: boolean
}

type GameSessionState = {
  card: ResolvedCard
  selectedAnswer: ObjectName | null
  previousTurn: ReviewedTurn | null
  validationResult: ValidationResult
  score: number
  answeredCount: number
  bestTotal: number
  timeLeft: number
  recentIllustrations: IllustrationName[]
  pawTrailRunId: number
  cardSequence: number
  isCardTransitioning: boolean
}

function createInitialState(): GameSessionState {
  return {
    card: resolveSessionCard([]),
    selectedAnswer: null,
    previousTurn: null,
    validationResult: 'idle',
    score: 0,
    answeredCount: 0,
    bestTotal: loadBestTotal(),
    timeLeft: ROUND_DURATION_SECONDS,
    recentIllustrations: [],
    pawTrailRunId: 0,
    cardSequence: 0,
    isCardTransitioning: false,
  }
}

export function useGameSession(isPaused = false) {
  const [state, setState] = useState<GameSessionState>(() => createInitialState())
  const advanceTimeoutRef = useRef<number | null>(null)
  const transitionTimeoutRef = useRef<number | null>(null)
  const timeLeftRef = useRef(state.timeLeft)

  useEffect(() => {
    timeLeftRef.current = state.timeLeft
  }, [state.timeLeft])

  useEffect(() => {
    saveBestTotal(state.bestTotal)
  }, [state.bestTotal])

  useEffect(() => {
    if (state.timeLeft <= 0 || state.validationResult !== 'idle' || state.isCardTransitioning || isPaused) {
      return
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        if (currentState.timeLeft <= 1) {
          return {
            ...currentState,
            timeLeft: 0,
            validationResult:
              currentState.validationResult === 'correct' || currentState.validationResult === 'wrong'
                ? currentState.validationResult
                : 'finished',
          }
        }

        return {
          ...currentState,
          timeLeft: currentState.timeLeft - 1,
        }
      })
    }, 1000)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [isPaused, state.isCardTransitioning, state.timeLeft, state.validationResult])

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current != null) {
        window.clearTimeout(advanceTimeoutRef.current)
      }
      if (transitionTimeoutRef.current != null) {
        window.clearTimeout(transitionTimeoutRef.current)
      }
    }
  }, [])

  const submitAnswer = (answer: ObjectName) => {
    setState((currentState) => {
      if (
        currentState.timeLeft <= 0 ||
        currentState.validationResult === 'correct' ||
        currentState.validationResult === 'wrong' ||
        currentState.validationResult === 'finished'
      ) {
        return currentState
      }

      const isCorrect = answer === currentState.card.targetAnswer
      const correctAnswer = currentState.card.targetAnswer
      const nextScore = isCorrect ? currentState.score + 1 : currentState.score
      const nextAnsweredCount = currentState.answeredCount + 1
      const nextBestTotal = Math.max(currentState.bestTotal, nextScore)

      if (advanceTimeoutRef.current != null) {
        window.clearTimeout(advanceTimeoutRef.current)
      }

      advanceTimeoutRef.current = window.setTimeout(() => {
        if (transitionTimeoutRef.current != null) {
          window.clearTimeout(transitionTimeoutRef.current)
        }

        setState((timeoutState) => {
          if (timeLeftRef.current <= 0) {
            return {
              ...timeoutState,
              selectedAnswer: timeoutState.selectedAnswer,
              validationResult: 'finished',
            }
          }

          const nextRecentIllustrations = getRecentIllustrationsWithNext(
            timeoutState.recentIllustrations,
            timeoutState.card.illustration,
          )

          return {
            ...timeoutState,
            card: resolveSessionCard(nextRecentIllustrations),
            selectedAnswer: null,
            validationResult: 'idle',
            recentIllustrations: nextRecentIllustrations,
            cardSequence: timeoutState.cardSequence + 1,
            isCardTransitioning: true,
          }
        })

        transitionTimeoutRef.current = window.setTimeout(() => {
          setState((transitionState) => {
            if (!transitionState.isCardTransitioning) {
              return transitionState
            }

            return {
              ...transitionState,
              isCardTransitioning: false,
            }
          })
        }, CARD_TRANSITION_TOTAL_MS)
      }, isCorrect ? CORRECT_VALIDATION_MS : WRONG_VALIDATION_MS)

      return {
        ...currentState,
        selectedAnswer: answer,
        previousTurn: correctAnswer
          ? {
              card: currentState.card,
              selectedAnswer: answer,
              correctAnswer,
              wasCorrect: isCorrect,
            }
          : currentState.previousTurn,
        validationResult: isCorrect ? 'correct' : 'wrong',
        score: nextScore,
        answeredCount: nextAnsweredCount,
        bestTotal: nextBestTotal,
        pawTrailRunId: isCorrect ? currentState.pawTrailRunId : currentState.pawTrailRunId + 1,
      }
    })
  }

  const restartRound = () => {
    if (advanceTimeoutRef.current != null) {
      window.clearTimeout(advanceTimeoutRef.current)
      advanceTimeoutRef.current = null
    }
    if (transitionTimeoutRef.current != null) {
      window.clearTimeout(transitionTimeoutRef.current)
      transitionTimeoutRef.current = null
    }

    setState((currentState) => {
      const freshState = createInitialState()
      return {
        ...freshState,
        bestTotal: currentState.bestTotal,
      }
    })
  }

  return {
    card: state.card,
    selectedAnswer: state.selectedAnswer,
    previousTurn: state.previousTurn,
    validationResult: state.validationResult,
    score: state.score,
    answeredCount: state.answeredCount,
    bestTotal: state.bestTotal,
    timeLeft: state.timeLeft,
    pawTrailRunId: state.pawTrailRunId,
    cardSequence: state.cardSequence,
    isCardTransitioning: state.isCardTransitioning,
    canAnswer: state.validationResult === 'idle' && state.timeLeft > 0 && !state.isCardTransitioning,
    isRoundFinished: state.timeLeft === 0,
    submitAnswer,
    restartRound,
  }
}
