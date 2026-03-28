import { type CSSProperties, useEffect, useId, useRef, useState } from "react";

import { AnswerChoicesLayer } from "./AnswerChoicesLayer";
import {
  ANSWER_TOKEN_ORDER,
  ANSWER_TOKEN_SIZE_PX,
  ANSWER_PAW_STROKE_COLOR,
  BOARD_PANEL_INSETS,
  COMPACT_CARD_BOUNDS,
  CORRECT_ANSWER_PAW_FILL_COLOR,
  createPawTrailSteps,
  getPawTrailStyle,
  INCORRECT_ANSWER_PAW_FILL_COLOR,
  LARGE_MODE_TOKEN_TOPS_PX,
  MODE_TRANSITION_MS,
  PAW_TRAIL_FILL_COLOR,
  PAW_TRAIL_STROKE_COLOR,
  SCOREBOARD_RENDER_HEIGHT_PX,
  SHELL_SIZES,
  SMALL_MODE_TOKEN_GAP_PX,
  SMALL_MODE_TOKEN_STACK_START_TOP_PX,
} from "./boardConfig";
import {
  FIVE_CARD_RULES_PAGES,
  getMultiCardReviewExplanation,
  getReviewExplanation,
  SINGLE_CARD_RULES_PAGES,
} from "./boardContent";
import { GameQuickStartGuide } from "./GameQuickStartGuide";
import { HintPawStep } from "./HintPawStep";
import { BoardDecorationLayer } from "./BoardDecorationLayer";
import {
  MultiCardLayer,
  type CardCount,
} from "./MultiCardLayer";
import { SingleCardLayer } from "./SingleCardLayer";
import { ReviewCardIllustration } from "./ReviewCardIllustration";
import { SimpleBoardBase } from "./SimpleBoardBase";
import type { ObjectName, ResolvedCard } from "./cardResolver";
import { fixedDetails } from "./palettes";
import {
  useGameSession,
  type GameSessionSnapshot,
} from "./useGameSession";
import type { GameMode } from "./gameMode";

const PANEL_OVERLAY_PADDING_CLASS = "px-5 pt-4 pb-4";
type SessionCardCount = 1 | 3 | 4 | 5 | 6;

function isCompatibleSnapshot(
  snapshot: GameSessionSnapshot | null | undefined,
  expectedCardCount: SessionCardCount,
): snapshot is GameSessionSnapshot {
  return (
    snapshot != null &&
    snapshot.cards.length === expectedCardCount &&
    snapshot.validationResult === "idle" &&
    !snapshot.isCardTransitioning &&
    snapshot.timeLeft > 0
  );
}

const FALLBACK_SINGLE_CARD: ResolvedCard = {
  illustration: "cat-ball",
  objectA: "cat",
  objectB: "ball",
  colorA: "orange",
  colorB: "red",
  source: "manual",
  targetAnswer: "cat",
};

const FALLBACK_MULTI_CARDS: ResolvedCard[] = [
  {
    illustration: "cat-cheese",
    objectA: "cat",
    objectB: "cheese",
    colorA: "grey",
    colorB: "yellow",
    source: "manual",
    targetAnswer: "cheese",
  },
  {
    illustration: "cat-ball",
    objectA: "cat",
    objectB: "ball",
    colorA: "orange",
    colorB: "red",
    source: "manual",
    targetAnswer: "cat",
  },
  {
    illustration: "ball-mouse",
    objectA: "ball",
    objectB: "mouse",
    colorA: "red",
    colorB: "blue",
    source: "manual",
    targetAnswer: "mouse",
  },
  {
    illustration: "ball-pillow",
    objectA: "ball",
    objectB: "pillow",
    colorA: "orange",
    colorB: "grey",
    source: "manual",
    targetAnswer: "ball",
  },
  {
    illustration: "cat-pillow",
    objectA: "cat",
    objectB: "pillow",
    colorA: "blue",
    colorB: "red",
    source: "manual",
    targetAnswer: "pillow",
  },
  {
    illustration: "cheese-mouse",
    objectA: "cheese",
    objectB: "mouse",
    colorA: "yellow",
    colorB: "orange",
    source: "manual",
    targetAnswer: "cheese",
  },
] as const;

export function GameBoardRound({
  onModeChange,
}: {
  onModeChange?: (mode: GameMode) => void;
} = {}) {
  const boardViewportRef = useRef<HTMLDivElement | null>(null);
  const [isCompactBase, setIsCompactBase] = useState(true);
  const [isQuickStartOpen, setIsQuickStartOpen] = useState(true);
  const [displayedRulesCompactMode, setDisplayedRulesCompactMode] =
    useState(false);
  const [expandedCardCount, setExpandedCardCount] = useState<CardCount>(5);
  const [isModeHovered, setIsModeHovered] = useState(false);
  const [isPreviousHovered, setIsPreviousHovered] = useState(false);
  const [isRestartHovered, setIsRestartHovered] = useState(false);
  const [isRulesHovered, setIsRulesHovered] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPreviousReviewOpen, setIsPreviousReviewOpen] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const [hoveredAnswer, setHoveredAnswer] = useState<ObjectName | null>(null);
  const [rulesPageIndex, setRulesPageIndex] = useState(0);
  const [isBoardModeTransitioning, setIsBoardModeTransitioning] = useState(false);
  const savedSessionSnapshotsRef = useRef<
    Partial<Record<SessionCardCount, GameSessionSnapshot>>
  >({});
  const pendingModeSwitchRef = useRef<{
    cardCount: SessionCardCount;
    snapshot: GameSessionSnapshot | null;
  } | null>(null);
  const boardModeTransitionTimeoutRef = useRef<number | null>(null);
  const rulesTitleId = useId();
  const reviewTitleId = useId();
  const rulesModeCompact = isRulesOpen ? displayedRulesCompactMode : isCompactBase;
  const isRulesTransitioning =
    isRulesOpen && displayedRulesCompactMode !== isCompactBase;
  const rulesPages = rulesModeCompact
    ? SINGLE_CARD_RULES_PAGES
    : FIVE_CARD_RULES_PAGES;
  const currentRulesPage = rulesPages[rulesPageIndex];
  const canGoBack = rulesPageIndex > 0;
  const canGoNext = rulesPageIndex < rulesPages.length - 1;
  const shellSize = isCompactBase
    ? SHELL_SIZES.compact
    : SHELL_SIZES.expanded;
  const [availableWidth, setAvailableWidth] = useState<number>(shellSize.width);
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window === "undefined" ? shellSize.width : window.innerWidth,
  );
  const activeCardCount = isCompactBase ? 1 : expandedCardCount;
  const {
    cards,
    canAnswer,
    isRoundFinished,
    answeredCount,
    bestTotal,
    correctAnswer,
    previousTurn,
    pawTrailRunId,
    cardSequence,
    score,
    selectedAnswer,
    submitAnswer,
    timeLeft,
    validationResult,
    isCardTransitioning,
    getSnapshot,
    restoreSnapshot,
    restartRound,
  } = useGameSession({
    cardCount: activeCardCount,
    isPaused:
      isRulesOpen ||
      isPreviousReviewOpen ||
      isQuickStartOpen ||
      isBoardModeTransitioning,
  });
  const showPreviousControl = previousTurn != null;
  const activeAnswerCenters = ANSWER_TOKEN_ORDER.reduce<
    Record<ObjectName, { x: number; y: number }>
  >((accumulator, answer, index) => {
    const top = isCompactBase
      ? SMALL_MODE_TOKEN_STACK_START_TOP_PX + index * SMALL_MODE_TOKEN_GAP_PX
      : LARGE_MODE_TOKEN_TOPS_PX[answer];

    accumulator[answer] = {
      x: shellSize.width - ANSWER_TOKEN_SIZE_PX / 2,
      y: top + ANSWER_TOKEN_SIZE_PX / 2,
    };

    return accumulator;
  }, {} as Record<ObjectName, { x: number; y: number }>);
  const pawTrailSteps =
    selectedAnswer &&
    correctAnswer &&
    selectedAnswer !== correctAnswer &&
    validationResult === "wrong" &&
    !isRulesOpen &&
    !isPreviousReviewOpen
      ? createPawTrailSteps(
          activeAnswerCenters[selectedAnswer],
          activeAnswerCenters[correctAnswer],
          3,
          pawTrailRunId,
          { width: shellSize.width, height: shellSize.height },
        )
      : [];
  const targetHintPosition =
    selectedAnswer &&
    correctAnswer &&
    selectedAnswer !== correctAnswer &&
    validationResult === "wrong"
      ? activeAnswerCenters[correctAnswer]
      : null;
  const isHintAnimationActive =
    validationResult === "wrong" &&
    (pawTrailSteps.length > 0 || targetHintPosition != null);
  const isAnswerFeedbackActive =
    validationResult === "correct" || isHintAnimationActive;
  const targetHintDelay =
    pawTrailSteps.length > 0 ? `${pawTrailSteps.length * 180 + 220}ms` : "0ms";
  const currentReviewCards = previousTurn?.cards ?? [];
  const reviewCardCount = (currentReviewCards.length || 5) as CardCount;
  const reviewExplanation = previousTurn
    ? previousTurn.cards.length === 1
      ? getReviewExplanation(previousTurn.cards[0])
      : getMultiCardReviewExplanation({
          correctAnswer: previousTurn.correctAnswer,
        })
    : [];
  const largeExplanationCardContentClassName =
    reviewCardCount === 3
      ? "flex h-full w-full flex-col items-center justify-center gap-4 p-8"
      : "flex h-full w-full flex-col items-center justify-end gap-4 pb-6";
  const largeExplanationCardScale = reviewCardCount === 3 ? 1 : 0.8;
  const largeExplanationBadgeScale = reviewCardCount === 3 ? 1.25 : 1;
  const largeExplanationBadgeBottom = reviewCardCount === 3 ? "-15px" : undefined;
  const largeExplanationRowClassName =
    reviewCardCount === 3
      ? "flex w-full items-center justify-center gap-8"
      : "flex w-full items-center justify-center gap-4";
  const largeReviewCardContentClassName =
    reviewCardCount === 3
      ? "flex h-full w-full flex-col items-center justify-center gap-4 p-8"
      : "flex h-full w-full flex-col items-center justify-end gap-4 pb-6";
  const largeReviewRowClassName =
    reviewCardCount === 3
      ? "flex w-full items-center justify-center gap-8"
      : "flex w-full items-center justify-center gap-4";

  const startQuickStartRound = () => {
    const startingCardCount = isCompactBase ? 1 : expandedCardCount;

    setDisplayedRulesCompactMode(isCompactBase);
    setHoveredAnswer(null);
    setIsPreviousReviewOpen(false);
    setIsExplanationVisible(false);
    setIsRulesOpen(false);
    setRulesPageIndex(0);
    setIsQuickStartOpen(false);
    restartRound(startingCardCount);
  };

  const toggleBoardMode = () => {
    if (isRulesOpen || isAnswerFeedbackActive) {
      return;
    }

    if (isQuickStartOpen) {
      setIsBoardModeTransitioning(true);
      if (boardModeTransitionTimeoutRef.current != null) {
        window.clearTimeout(boardModeTransitionTimeoutRef.current);
      }
      boardModeTransitionTimeoutRef.current = window.setTimeout(() => {
        setIsBoardModeTransitioning(false);
        boardModeTransitionTimeoutRef.current = null;
      }, MODE_TRANSITION_MS);

      setIsCompactBase((current) => !current);
      setHoveredAnswer(null);
      setIsPreviousReviewOpen(false);
      setIsExplanationVisible(false);
      setRulesPageIndex(0);
      return;
    }

    setIsCompactBase((current) => {
      const nextIsCompact = !current;
      const currentCardCount = current ? 1 : expandedCardCount;
      const nextCardCount = nextIsCompact ? 1 : expandedCardCount;
      const currentSnapshot = getSnapshot();

      savedSessionSnapshotsRef.current[currentCardCount] = currentSnapshot;
      setIsBoardModeTransitioning(true);
      if (boardModeTransitionTimeoutRef.current != null) {
        window.clearTimeout(boardModeTransitionTimeoutRef.current);
      }
      boardModeTransitionTimeoutRef.current = window.setTimeout(() => {
        setIsBoardModeTransitioning(false);
        boardModeTransitionTimeoutRef.current = null;
      }, MODE_TRANSITION_MS);
      setHoveredAnswer(null);
      setIsPreviousReviewOpen(false);
      setIsExplanationVisible(false);
      setRulesPageIndex(0);

      const nextSnapshot = savedSessionSnapshotsRef.current[nextCardCount] ?? null;

      if (isCompatibleSnapshot(nextSnapshot, nextCardCount)) {
        restoreSnapshot(nextSnapshot, nextCardCount);
      } else {
        restartRound(nextCardCount);
      }

      return nextIsCompact;
    });
  };

  useEffect(() => {
    if (!isRulesOpen || displayedRulesCompactMode === isCompactBase) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setDisplayedRulesCompactMode(isCompactBase);
      setRulesPageIndex(0);

      const pendingModeSwitch = pendingModeSwitchRef.current;

      if (pendingModeSwitch) {
        if (pendingModeSwitch.snapshot) {
          restoreSnapshot(pendingModeSwitch.snapshot, pendingModeSwitch.cardCount);
        } else {
          restartRound(pendingModeSwitch.cardCount);
        }

        pendingModeSwitchRef.current = null;
      }
    }, MODE_TRANSITION_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    displayedRulesCompactMode,
    isCompactBase,
    isRulesOpen,
    restartRound,
    restoreSnapshot,
  ]);

  useEffect(() => {
    return () => {
      if (boardModeTransitionTimeoutRef.current != null) {
        window.clearTimeout(boardModeTransitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    onModeChange?.(isCompactBase ? "single-card" : "five-card");
  }, [isCompactBase, onModeChange]);

  useEffect(() => {
    setDisplayedRulesCompactMode(isCompactBase);
  }, [isCompactBase]);

  useEffect(() => {
    if (!isRulesOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      setIsRulesOpen(false);
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isRulesOpen]);

  useEffect(() => {
    const viewportElement = boardViewportRef.current;

    if (!viewportElement || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateAvailableWidth = () => {
      setAvailableWidth(viewportElement.clientWidth);
    };

    updateAvailableWidth();

    const observer = new ResizeObserver(() => {
      updateAvailableWidth();
    });

    observer.observe(viewportElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const updateViewportWidth = () => {
      setViewportWidth(window.innerWidth);
    };

    updateViewportWidth();
    window.addEventListener("resize", updateViewportWidth);

    return () => {
      window.removeEventListener("resize", updateViewportWidth);
    };
  }, []);

  const minScaledWidth = isCompactBase ? 250 : 400;
  const viewportLimitedWidth = Math.max(minScaledWidth, viewportWidth - 32);
  const maxRenderableWidth = Math.max(
    minScaledWidth,
    Math.min(availableWidth, viewportLimitedWidth),
  );
  const boardScale = Math.min(1, maxRenderableWidth / shellSize.width);
  const scaledBoardWidth = shellSize.width * boardScale;
  const scaledBoardHeight = shellSize.height * boardScale;

  const board = (
    <div ref={boardViewportRef} className="w-full overflow-visible">
      <div
        className="relative mx-auto overflow-visible"
        style={{
          width: `${scaledBoardWidth}px`,
          height: `${scaledBoardHeight}px`,
        }}
      >
        <div
          className="relative overflow-visible"
          style={{
            "--board-light-fill": "#008D96",
            "--board-dark-fill": "#005157",
            transition:
              `width ${MODE_TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1), height ${MODE_TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1), transform ${MODE_TRANSITION_MS}ms cubic-bezier(0.22,1,0.36,1)`,
            width: `${shellSize.width}px`,
            height: `${shellSize.height}px`,
            transform: `scale(${boardScale})`,
            transformOrigin: "top left",
          } as CSSProperties}
        >
        <div className="BoardBaseLayer absolute inset-0 z-0">
          <SimpleBoardBase
            bestTotal={bestTotal}
            isBoardStretched={!isCompactBase}
            score={score}
            timeLeft={timeLeft}
          />
        </div>
        <div className="BoardCardLayer absolute inset-0 z-5">
          {isCompactBase &&
          !isQuickStartOpen &&
          !isRulesOpen &&
          !isRoundFinished &&
          !isBoardModeTransitioning &&
          !isPreviousReviewOpen ? (
            <SingleCardLayer
              card={cards[0] ?? FALLBACK_SINGLE_CARD}
              previousCard={isCardTransitioning ? previousTurn?.cards[0] : undefined}
              transitionRunId={isCardTransitioning ? cardSequence : undefined}
              bounds={COMPACT_CARD_BOUNDS}
            />
          ) : null}
          {!isCompactBase &&
          !isQuickStartOpen &&
          !isRulesOpen &&
          !isRoundFinished &&
          !isBoardModeTransitioning &&
          !isPreviousReviewOpen ? (
            <MultiCardLayer
              cards={cards.length > 0 ? cards : FALLBACK_MULTI_CARDS}
              count={expandedCardCount}
              previousCards={isCardTransitioning ? previousTurn?.cards : undefined}
              transitionRunId={isCardTransitioning ? cardSequence : undefined}
            />
          ) : null}
        </div>
        <div
          className="BoardDecorationLayer pointer-events-none absolute z-10 overflow-visible"
          style={{
            left: `${BOARD_PANEL_INSETS.left}px`,
            top: `${SCOREBOARD_RENDER_HEIGHT_PX + BOARD_PANEL_INSETS.top}px`,
            right: `${BOARD_PANEL_INSETS.right}px`,
            bottom: `${BOARD_PANEL_INSETS.bottom}px`,
          }}
        >
          <BoardDecorationLayer
            isPreviousReviewActive={isPreviousReviewOpen}
            isPreviousReviewHovered={isRulesOpen ? false : isPreviousHovered}
            isRestartHovered={isRulesOpen ? false : isRestartHovered}
            isModeHovered={isRulesOpen ? false : isModeHovered}
            isRulesActive={isRulesOpen}
            isRulesHovered={isRulesOpen ? false : isRulesHovered}
            showPreviousControl={showPreviousControl}
          />
        </div>

        <div className="BoardInteractionLayer absolute inset-0 z-20">
          {!isRoundFinished || isPreviousReviewOpen ? (
            <AnswerChoicesLayer
              canAnswer={
                isPreviousReviewOpen || isBoardModeTransitioning || isQuickStartOpen
                  ? false
                  : canAnswer
              }
              disabledByOverlay={
                isRulesOpen || isPreviousReviewOpen || isQuickStartOpen
              }
              hasStarted={!isQuickStartOpen}
              hoveredAnswer={hoveredAnswer}
              isBoardStretched={!isCompactBase}
              isRoundFinished={isRoundFinished}
              highlightedAnswer={
                isPreviousReviewOpen ? previousTurn?.correctAnswer ?? null : null
              }
              answerPawFillColor={
                isPreviousReviewOpen
                  ? previousTurn?.wasCorrect
                    ? CORRECT_ANSWER_PAW_FILL_COLOR
                    : INCORRECT_ANSWER_PAW_FILL_COLOR
                  : validationResult === "correct"
                  ? CORRECT_ANSWER_PAW_FILL_COLOR
                  : validationResult === "wrong"
                    ? INCORRECT_ANSWER_PAW_FILL_COLOR
                    : undefined
              }
              answerPawStrokeColor={
                (isPreviousReviewOpen
                  ? previousTurn?.selectedAnswer
                  : selectedAnswer) != null
                  ? ANSWER_PAW_STROKE_COLOR
                  : undefined
              }
              highlightedAnswerPawFillColor={
                isPreviousReviewOpen &&
                previousTurn?.selectedAnswer !== previousTurn?.correctAnswer
                  ? CORRECT_ANSWER_PAW_FILL_COLOR
                  : undefined
              }
              highlightedAnswerPawStrokeColor={
                isPreviousReviewOpen &&
                previousTurn?.selectedAnswer !== previousTurn?.correctAnswer
                  ? ANSWER_PAW_STROKE_COLOR
                  : undefined
              }
              onAnswerBlur={(answer) => {
                setHoveredAnswer((current) =>
                  current === answer ? null : current,
                );
              }}
              onAnswerClick={(answer) => {
                submitAnswer(answer);
              }}
              onAnswerFocus={(answer) => {
                setHoveredAnswer(answer);
              }}
              onAnswerHoverEnd={(answer) => {
                setHoveredAnswer((current) =>
                  current === answer ? null : current,
                );
              }}
              onAnswerHoverStart={(answer) => {
                setHoveredAnswer(answer);
              }}
              selectedAnswer={
                isPreviousReviewOpen
                  ? previousTurn?.selectedAnswer ?? null
                  : selectedAnswer
              }
            />
          ) : null}

          {!isCompactBase ? (
            <div
              className="absolute left-[40px] right-[80px] z-30 flex justify-center"
              aria-label="Card complexity"
              style={{ bottom: "5px" }}
            >
              <div
                className="rounded-[8px] border border-black/10 px-2 py-1"
                style={{
                  background: fixedDetails.board.dark,
                  fontFamily: '"Hannotate TC", sans-serif',
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="whitespace-nowrap text-[11px] font-bold leading-none text-white">
                    Difficulty:
                  </span>
                  <div className="flex items-center gap-1">
                    {([3, 4, 5, 6] as const).map((count) => {
                      const isActive = expandedCardCount === count;

                      return (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            if (isAnswerFeedbackActive) {
                              return;
                            }

                            const currentCardCount = isCompactBase
                              ? 1
                              : expandedCardCount;
                            const currentSnapshot = getSnapshot();

                            savedSessionSnapshotsRef.current[currentCardCount] =
                              currentSnapshot;
                            setExpandedCardCount(count);
                            setHoveredAnswer(null);
                            setIsPreviousReviewOpen(false);
                            setIsExplanationVisible(false);
                            const nextSnapshot =
                              savedSessionSnapshotsRef.current[count] ?? null;

                            if (isCompatibleSnapshot(nextSnapshot, count)) {
                              restoreSnapshot(nextSnapshot, count);
                            } else {
                              restartRound(count);
                            }
                          }}
                          disabled={
                            isRulesOpen ||
                            isPreviousReviewOpen ||
                            isAnswerFeedbackActive
                          }
                          className="inline-flex min-w-[24px] items-center justify-center rounded-[5px] px-1.5 py-1 text-[11px] font-bold leading-none text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default disabled:opacity-80"
                          style={{
                            background: isActive
                              ? fixedDetails.board.light
                              : "transparent",
                          }}
                          aria-label={`Show ${count} cards`}
                          aria-pressed={isActive}
                        >
                          {count}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {pawTrailSteps.length > 0 || targetHintPosition ? (
            <div className="pointer-events-none absolute inset-0 z-30" aria-hidden="true">
              {pawTrailSteps.map((step) => (
                <div
                  key={step.key}
                  className="paw-step-trail absolute"
                  style={getPawTrailStyle(step)}
                >
                  <HintPawStep
                    fill={PAW_TRAIL_FILL_COLOR}
                    stroke={PAW_TRAIL_STROKE_COLOR}
                    className="h-11 w-11"
                  />
                </div>
              ))}
              {targetHintPosition ? (
                <div
                  key={`target-paw-${pawTrailRunId}`}
                  className="paw-step-target absolute"
                  style={{
                    left: `${targetHintPosition.x}px`,
                    top: `${targetHintPosition.y}px`,
                    animationDelay: targetHintDelay,
                  }}
                >
                  <HintPawStep
                    fill={PAW_TRAIL_FILL_COLOR}
                    stroke={PAW_TRAIL_STROKE_COLOR}
                    className="h-9 w-9"
                  />
                </div>
              ) : null}
            </div>
          ) : null}

        </div>

        {isQuickStartOpen && !isRulesOpen ? (
          <div
            className="absolute z-[35]"
            style={{
              left: `${BOARD_PANEL_INSETS.left}px`,
              top: `${SCOREBOARD_RENDER_HEIGHT_PX + BOARD_PANEL_INSETS.top}px`,
              right: `${BOARD_PANEL_INSETS.right}px`,
              bottom: `${BOARD_PANEL_INSETS.bottom}px`,
            }}
          >
            <GameQuickStartGuide
              isLarge={!isCompactBase}
              onOpenRules={() => {
                setIsRulesOpen(true);
                setDisplayedRulesCompactMode(isCompactBase);
                setRulesPageIndex(0);
                setIsPreviousReviewOpen(false);
                setIsExplanationVisible(false);
              }}
              onStart={startQuickStartRound}
            />
          </div>
        ) : null}

        <div
          className="BoardOverlayLayer pointer-events-none absolute z-30"
          style={{
            left: `${BOARD_PANEL_INSETS.left}px`,
            top: `${SCOREBOARD_RENDER_HEIGHT_PX + BOARD_PANEL_INSETS.top}px`,
            right: `${BOARD_PANEL_INSETS.right}px`,
            bottom: `${BOARD_PANEL_INSETS.bottom}px`,
          }}
        >
          {isRulesOpen &&
          (isPreviousHovered || isRestartHovered || isRulesHovered || isModeHovered) ? (
            <div className="absolute inset-0 z-40">
              <GameQuickStartGuide
                isLarge={!isCompactBase}
                visibleBubbles={{
                  reviewPrevious: isPreviousHovered,
                  startNewGame: isRestartHovered,
                  gameRules: isRulesHovered,
                  changeLevel: isModeHovered,
                  quickStart: false,
                }}
              />
            </div>
          ) : null}

          {isPreviousReviewOpen && previousTurn ? (
            <div className="pointer-events-auto absolute inset-0 z-30">
              <section
                className="absolute"
                style={{
                  left: isCompactBase ? "-5px" : "0",
                  top: "0",
                  right: isCompactBase ? "0" : "0",
                  bottom: "0",
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby={reviewTitleId}
              >
                <h2 id={reviewTitleId} className="sr-only">
                  Previous round review
                </h2>
                {isCompactBase ? (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviousReviewOpen(false);
                      setIsExplanationVisible(false);
                    }}
                    className="absolute right-[20px] top-[12px] z-10 text-[20px] leading-none"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                    aria-label="Close review"
                  >
                    ×
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsPreviousReviewOpen(false);
                      setIsExplanationVisible(false);
                    }}
                    className="absolute right-[20px] top-[12px] z-10 text-[20px] leading-none"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                    aria-label="Close review"
                  >
                    ×
                  </button>
                )}
                {isCompactBase ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <ReviewCardIllustration
                      card={currentReviewCards[0] ?? FALLBACK_SINGLE_CARD}
                      isExplanationVisible={isExplanationVisible}
                    />
                  </div>
                ) : isExplanationVisible ? (
                  <div className="absolute inset-0 overflow-hidden">
                    <MultiCardLayer
                      cards={currentReviewCards}
                      count={reviewCardCount}
                      renderContentOnly
                      cardScale={largeExplanationCardScale}
                      answerBadgeBottom={largeExplanationBadgeBottom}
                      answerBadgeScale={largeExplanationBadgeScale}
                      contentClassName={largeExplanationCardContentClassName}
                      rowClassName={largeExplanationRowClassName}
                      showAnswerBadges
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 overflow-hidden">
                    <MultiCardLayer
                      cards={currentReviewCards}
                      count={reviewCardCount}
                      renderContentOnly
                      contentClassName={largeReviewCardContentClassName}
                      rowClassName={largeReviewRowClassName}
                    />
                  </div>
                )}
                <div
                  className={
                    isCompactBase
                      ? "absolute inset-x-0 top-[15px]"
                      : `absolute inset-0 ${PANEL_OVERLAY_PADDING_CLASS}`
                  }
                >
                  <div className="relative flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() =>
                        setIsExplanationVisible((current) => !current)
                      }
                      className="whitespace-nowrap text-[15px] leading-none text-[#22304a] underline underline-offset-2"
                      style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                    >
                      {isExplanationVisible ? "Hide explanation" : "Show explanation"}
                    </button>
                    {isExplanationVisible && reviewExplanation.length > 0 ? (
                      <div
                        className={
                          isCompactBase
                            ? "mt-3 w-full px-[10px] text-center text-[#22304a]"
                            : "mt-3 w-full text-center text-[#22304a]"
                        }
                        style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                      >
                        {isCompactBase ? (
                          <div className="text-[14px] leading-snug">
                            {reviewExplanation.map((paragraph) => (
                              <p key={paragraph.key} className="mb-3 last:mb-0">
                                {paragraph.content}
                              </p>
                            ))}
                          </div>
                        ) : (
                          <div className="text-[14px] leading-snug">
                            {reviewExplanation.map((paragraph) => (
                              <p key={paragraph.key} className="mb-3 last:mb-0">
                                {paragraph.content}
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </section>
            </div>
          ) : null}

          {isRoundFinished && !isRulesOpen && !isPreviousReviewOpen ? (
            <div className="pointer-events-none absolute inset-0 z-30">
              <div
                className="absolute flex -translate-y-[20px] flex-col items-center justify-center px-10 text-center text-[#22304a]"
                style={{
                  left: isCompactBase ? "-5px" : "0",
                  top: "0",
                  right: isCompactBase ? "0" : "0",
                  bottom: "0",
                }}
              >
                <p
                  className="text-[22px] leading-none"
                  style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                >
                  Round complete
                </p>
                <p
                  className="mt-6 text-[22px] leading-none"
                  style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                >
                  Score: {score}/{answeredCount}
                </p>
                <p
                  className="mt-8 max-w-[250px] text-[18px] leading-snug"
                  style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                >
                  Click the paw in the top right corner to play again
                </p>
              </div>
            </div>
          ) : null}

          {isRulesOpen ? (
            <section
              className={`pointer-events-auto absolute z-30 flex flex-col text-[#22304a] ${PANEL_OVERLAY_PADDING_CLASS}`}
              style={{
                left: "0",
                top: "0",
                right: "0",
                bottom: "0",
              }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={rulesTitleId}
            >
              <button
                type="button"
                onClick={() => setIsRulesOpen(false)}
                className="absolute right-[20px] top-[12px] z-10 text-[20px] leading-none"
                style={{
                  fontFamily: '"Hannotate TC", sans-serif',
                  fontWeight: 700,
                  color: fixedDetails.board.dark,
                }}
                aria-label="Close rules"
              >
                ×
              </button>
              <header className="relative text-center">
                <p
                  id={rulesTitleId}
                  className="text-[19px] leading-none"
                  style={{
                    fontFamily: '"Hannotate TC", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {currentRulesPage.title}
                </p>
              </header>

              <article className="mt-3 flex-1 min-h-0">
                <div
                  className="h-full px-1 text-left text-[15px] leading-[1.35] text-[#22304a]"
                  style={{
                    fontFamily: '"Hannotate TC", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {isRulesTransitioning ? null : (
                    <>
                      {currentRulesPage.paragraphs.map((paragraph: string) => (
                        <p
                          key={paragraph}
                          className={
                            paragraph === "One-card rules:"
                              ? "mb-3 text-center font-semibold last:mb-0"
                              : "mb-3 last:mb-0"
                          }
                        >
                          {paragraph}
                        </p>
                      ))}
                    </>
                  )}
                </div>
              </article>

              <nav
                className="mt-2 flex items-center justify-between gap-3"
                aria-label="Rules pages"
              >
                {canGoBack ? (
                  <button
                    type="button"
                    onClick={() =>
                      setRulesPageIndex((current) => Math.max(0, current - 1))
                    }
                    className="rounded-full px-2 py-1 text-[15px]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                  >
                    Back
                  </button>
                ) : (
                  <div className="w-[58px]" aria-hidden="true" />
                )}

              <p
                className="shrink-0 text-[13px] leading-none text-[#4e627c]"
                style={{
                  fontFamily: '"Hannotate TC", sans-serif',
                  fontWeight: 400,
                }}
              >
                {isRulesTransitioning
                  ? ""
                  : `${rulesPageIndex + 1}/${rulesPages.length}`}
              </p>

                {canGoNext ? (
                  <button
                    type="button"
                    onClick={() =>
                      setRulesPageIndex((current) =>
                        Math.min(rulesPages.length - 1, current + 1),
                      )
                    }
                    className="rounded-full px-2 py-1 text-[15px]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <div className="w-[58px]" aria-hidden="true" />
                )}
              </nav>
            </section>
          ) : null}
        </div>

        <div className="BoardControlLayer pointer-events-none absolute inset-0 z-40">
          {showPreviousControl || isRulesOpen ? (
            <button
              type="button"
              onClick={() => {
                if (isRulesOpen || isAnswerFeedbackActive) {
                  return;
                }

                if (isPreviousReviewOpen) {
                  setIsPreviousReviewOpen(false);
                  setIsExplanationVisible(false);
                  return;
                }

                setIsPreviousReviewOpen(true);
                setIsExplanationVisible(false);
              }}
              onMouseEnter={() => setIsPreviousHovered(true)}
              onMouseLeave={() => setIsPreviousHovered(false)}
              onFocus={() => setIsPreviousHovered(true)}
              onBlur={() => setIsPreviousHovered(false)}
              className="pointer-events-auto absolute rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{
                left: "0",
                top: "64px",
                width: "74px",
                height: "64px",
              }}
              aria-label="Review the previous round"
            />
          ) : null}

          <button
            type="button"
            onClick={() => {
              if (isRulesOpen) {
                return;
              }

              setHoveredAnswer(null);
              setIsPreviousReviewOpen(false);
              setIsExplanationVisible(false);
              if (isQuickStartOpen) {
                startQuickStartRound();
                return;
              }

              restartRound();
            }}
            onMouseEnter={() => setIsRestartHovered(true)}
            onMouseLeave={() => setIsRestartHovered(false)}
            onFocus={() => setIsRestartHovered(true)}
            onBlur={() => setIsRestartHovered(false)}
            className="pointer-events-auto absolute rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              right: "0",
              top: "64px",
              width: "86px",
              height: "66px",
            }}
            aria-label="Restart round"
          />

          <button
            type="button"
              onClick={() => {
                if (isAnswerFeedbackActive) {
                  return;
                }

                setIsRulesOpen((current) => !current);
                setDisplayedRulesCompactMode(isCompactBase);
                setRulesPageIndex(0);
              setIsPreviousReviewOpen(false);
              setIsExplanationVisible(false);
            }}
            onMouseEnter={() => setIsRulesHovered(true)}
            onMouseLeave={() => setIsRulesHovered(false)}
            onFocus={() => setIsRulesHovered(true)}
            onBlur={() => setIsRulesHovered(false)}
              className="pointer-events-auto absolute rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={{
                left: "0",
                bottom: "0",
                width: "74px",
                height: "64px",
              }}
              aria-label="Show rules"
              disabled={isAnswerFeedbackActive}
            />

          <button
            type="button"
            onClick={toggleBoardMode}
            onMouseEnter={() => setIsModeHovered(true)}
            onMouseLeave={() => setIsModeHovered(false)}
            onFocus={() => setIsModeHovered(true)}
            onBlur={() => setIsModeHovered(false)}
            className="pointer-events-auto absolute rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{
              right: "0",
              bottom: "0",
              width: "112px",
              height: "84px",
            }}
            aria-label="Toggle board size"
            disabled={isAnswerFeedbackActive}
          />
        </div>
        </div>
      </div>
    </div>
  );

  return board;
}
