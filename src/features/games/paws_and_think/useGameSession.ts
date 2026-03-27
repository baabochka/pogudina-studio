import { useEffect, useRef, useState } from "react";

import {
  getIllustrationsForTarget,
  OBJECT_NAMES,
  resolveCard,
  type IllustrationName,
  type ObjectName,
  type ResolvedCard,
} from "./cardResolver";
import {
  CARD_TRANSITION_TOTAL_MS,
  CORRECT_VALIDATION_MS,
  getRecentIllustrationsWithNext,
  loadBestTotal,
  ROUND_DURATION_SECONDS,
  resolveSessionRound,
  saveBestTotal,
  WRONG_VALIDATION_MS,
} from "./gameSessionUtils";

type GameSessionState = {
  cards: ResolvedCard[];
  correctAnswer: ObjectName;
  selectedAnswer: ObjectName | null;
  previousTurn: {
    cards: ResolvedCard[];
    correctAnswer: ObjectName;
    selectedAnswer: ObjectName;
    wasCorrect: boolean;
  } | null;
  score: number;
  answeredCount: number;
  bestTotal: number;
  timeLeft: number;
  recentIllustrations: IllustrationName[];
  pawTrailRunId: number;
  cardSequence: number;
  isCardTransitioning: boolean;
  validationResult: "correct" | "finished" | "idle" | "wrong";
};

export type GameSessionSnapshot = GameSessionState;

function cloneSnapshot(snapshot: GameSessionSnapshot): GameSessionSnapshot {
  return {
    ...snapshot,
    cards: [...snapshot.cards],
    previousTurn: snapshot.previousTurn
      ? {
          ...snapshot.previousTurn,
          cards: [...snapshot.previousTurn.cards],
        }
      : null,
    recentIllustrations: [...snapshot.recentIllustrations],
  };
}

function getRandomItem<T>(items: readonly T[]): T {
  const index = Math.floor(Math.random() * items.length);
  return items[index];
}

function getShuffledItems<T>(items: readonly T[]): T[] {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const currentItem = nextItems[index];

    nextItems[index] = nextItems[swapIndex];
    nextItems[swapIndex] = currentItem;
  }

  return nextItems;
}

function resolveGameRound(
  cardCount: 1 | 3 | 4 | 5 | 6,
  recentIllustrations: IllustrationName[],
) {
  if (cardCount === 1) {
    return resolveSessionRound("single-card", recentIllustrations);
  }

  const repeatedAnswer = getRandomItem(OBJECT_NAMES);
  const uniqueWrongAnswers = getShuffledItems(
    OBJECT_NAMES.filter((objectName) => objectName !== repeatedAnswer),
  ).slice(0, cardCount - 2);
  const roundAnswers = getShuffledItems([
    repeatedAnswer,
    repeatedAnswer,
    ...uniqueWrongAnswers,
  ]);

  const disallowed = new Set(recentIllustrations);
  const usedIllustrations = new Set<IllustrationName>();
  const cards: ResolvedCard[] = [];
  const MAX_ATTEMPTS = 50;

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
    usedIllustrations.clear();
    cards.length = 0;

    const shuffledAnswers = getShuffledItems(roundAnswers);
    let canResolveAllCards = true;

    for (const answer of shuffledAnswers) {
      const availableIllustrations = getShuffledItems(
        getIllustrationsForTarget(answer).filter(
          (illustration) =>
            !usedIllustrations.has(illustration) && !disallowed.has(illustration),
        ),
      );

      const fallbackIllustrations = getShuffledItems(
        getIllustrationsForTarget(answer).filter(
          (illustration) => !usedIllustrations.has(illustration),
        ),
      );

      const illustration = availableIllustrations[0] ?? fallbackIllustrations[0];

      if (!illustration) {
        canResolveAllCards = false;
        break;
      }

      usedIllustrations.add(illustration);
      cards.push(resolveCard({ illustration, targetAnswer: answer }));
    }

    if (canResolveAllCards && cards.length === roundAnswers.length) {
      return {
        cards,
        correctAnswer: repeatedAnswer,
      };
    }
  }

  return {
    cards: roundAnswers.map((answer, index) =>
      resolveCard({
        illustration:
          getIllustrationsForTarget(answer)[
            index % getIllustrationsForTarget(answer).length
          ],
        targetAnswer: answer,
      }),
    ),
    correctAnswer: repeatedAnswer,
  };
}

function createInitialState(cardCount: 1 | 3 | 4 | 5 | 6): GameSessionState {
  const { cards, correctAnswer } = resolveGameRound(cardCount, []);

  return {
    cards,
    correctAnswer,
    selectedAnswer: null,
    previousTurn: null,
    score: 0,
    answeredCount: 0,
    bestTotal: loadBestTotal(),
    timeLeft: ROUND_DURATION_SECONDS,
    recentIllustrations: [],
    pawTrailRunId: 0,
    cardSequence: 0,
    isCardTransitioning: false,
    validationResult: "idle",
  };
}

export function useGameSession({
  cardCount,
  isPaused = false,
}: {
  cardCount: 1 | 3 | 4 | 5 | 6;
  isPaused?: boolean;
}) {
  const [state, setState] = useState<GameSessionState>(() =>
    createInitialState(cardCount),
  );
  const advanceTimeoutRef = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const timeLeftRef = useRef(state.timeLeft);
  const cardCountRef = useRef(cardCount);

  useEffect(() => {
    timeLeftRef.current = state.timeLeft;
  }, [state.timeLeft]);

  useEffect(() => {
    cardCountRef.current = cardCount;
  }, [cardCount]);

  useEffect(() => {
    saveBestTotal(state.bestTotal);
  }, [state.bestTotal]);

  useEffect(() => {
    if (
      state.timeLeft <= 0 ||
      state.validationResult !== "idle" ||
      state.isCardTransitioning ||
      isPaused
    ) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setState((currentState) => {
        if (currentState.timeLeft <= 1) {
          return {
            ...currentState,
            timeLeft: 0,
            validationResult:
              currentState.validationResult === "correct" ||
              currentState.validationResult === "wrong"
                ? currentState.validationResult
                : "finished",
          };
        }

        return {
          ...currentState,
          timeLeft: currentState.timeLeft - 1,
        };
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, state.isCardTransitioning, state.timeLeft, state.validationResult]);

  useEffect(() => {
    return () => {
      if (advanceTimeoutRef.current != null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }
      if (transitionTimeoutRef.current != null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  const submitAnswer = (answer: ObjectName) => {
    setState((currentState) => {
      if (
        currentState.timeLeft <= 0 ||
        currentState.validationResult === "correct" ||
        currentState.validationResult === "wrong" ||
        currentState.validationResult === "finished"
      ) {
        return currentState;
      }

      const isCorrect = answer === currentState.correctAnswer;
      const correctAnswer = currentState.correctAnswer;
      const nextScore = isCorrect ? currentState.score + 1 : currentState.score;
      const nextAnsweredCount = currentState.answeredCount + 1;
      const nextBestTotal = Math.max(currentState.bestTotal, nextScore);

      if (advanceTimeoutRef.current != null) {
        window.clearTimeout(advanceTimeoutRef.current);
      }

      advanceTimeoutRef.current = window.setTimeout(() => {
        if (transitionTimeoutRef.current != null) {
          window.clearTimeout(transitionTimeoutRef.current);
        }

        setState((timeoutState) => {
          if (timeLeftRef.current <= 0) {
            return {
              ...timeoutState,
              selectedAnswer: timeoutState.selectedAnswer,
              validationResult: "finished",
            };
          }

          const nextRecentIllustrations = getRecentIllustrationsWithNext(
            timeoutState.recentIllustrations,
            timeoutState.cards.map((card) => card.illustration),
          );
          const nextRound = resolveGameRound(
            cardCountRef.current,
            nextRecentIllustrations,
          );

          return {
            ...timeoutState,
            cards: nextRound.cards,
            correctAnswer: nextRound.correctAnswer,
            selectedAnswer: null,
            recentIllustrations: nextRecentIllustrations,
            cardSequence: timeoutState.cardSequence + 1,
            isCardTransitioning: true,
            validationResult: "idle",
          };
        });

        transitionTimeoutRef.current = window.setTimeout(() => {
          setState((transitionState) => {
            if (!transitionState.isCardTransitioning) {
              return transitionState;
            }

            return {
              ...transitionState,
              isCardTransitioning: false,
            };
          });
        }, CARD_TRANSITION_TOTAL_MS);
      }, isCorrect ? CORRECT_VALIDATION_MS : WRONG_VALIDATION_MS);

      return {
        ...currentState,
        selectedAnswer: answer,
        previousTurn: {
          cards: currentState.cards,
          correctAnswer,
          selectedAnswer: answer,
          wasCorrect: isCorrect,
        },
        pawTrailRunId: isCorrect
          ? currentState.pawTrailRunId
          : currentState.pawTrailRunId + 1,
        validationResult: isCorrect ? "correct" : "wrong",
        score: nextScore,
        answeredCount: nextAnsweredCount,
        bestTotal: nextBestTotal,
      };
    });
  };

  const restartRound = (cardCountOverride?: 1 | 3 | 4 | 5 | 6) => {
    if (advanceTimeoutRef.current != null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (transitionTimeoutRef.current != null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    setState((currentState) => {
      const freshState = createInitialState(
        cardCountOverride ?? cardCountRef.current,
      );

      return {
        ...freshState,
        bestTotal: currentState.bestTotal,
      };
    });
  };

  const getSnapshot = () => cloneSnapshot(state);

  const restoreSnapshot = (
    snapshot: GameSessionSnapshot,
    cardCountOverride?: 1 | 3 | 4 | 5 | 6,
  ) => {
    if (advanceTimeoutRef.current != null) {
      window.clearTimeout(advanceTimeoutRef.current);
      advanceTimeoutRef.current = null;
    }
    if (transitionTimeoutRef.current != null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    if (cardCountOverride != null) {
      cardCountRef.current = cardCountOverride;
    }

    timeLeftRef.current = snapshot.timeLeft;
    setState(cloneSnapshot(snapshot));
  };

  return {
    card: state.cards[0],
    cards: state.cards,
    correctAnswer: state.correctAnswer,
    selectedAnswer: state.selectedAnswer,
    previousTurn: state.previousTurn,
    pawTrailRunId: state.pawTrailRunId,
    cardSequence: state.cardSequence,
    isCardTransitioning: state.isCardTransitioning,
    validationResult: state.validationResult,
    score: state.score,
    answeredCount: state.answeredCount,
    bestTotal: state.bestTotal,
    timeLeft: state.timeLeft,
    canAnswer:
      state.validationResult === "idle" &&
      state.timeLeft > 0 &&
      !state.isCardTransitioning,
    isRoundFinished: state.timeLeft === 0,
    getSnapshot,
    restoreSnapshot,
    submitAnswer,
    restartRound,
  };
}
