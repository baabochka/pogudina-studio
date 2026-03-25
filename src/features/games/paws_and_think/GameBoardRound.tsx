import {
  useCallback,
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { AnswerChoicesLayer } from "./AnswerChoicesLayer";
import { BoardDecorationLayer } from "./BoardDecorationLayer";
import { BoardFrame } from "./BoardFrame";
import { BoardHud } from "./BoardHud";
import { CardSlotsLayer } from "./CardSlotsLayer";
import { HintPawStep } from "./HintPawStep";
import { GameQuickStartGuide } from "./GameQuickStartGuide";
import { ReviewCardIllustration } from "./ReviewCardIllustration";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";
import reverseCard from "./assets/reverse.svg";
import {
  BOARD_MODE_LAYOUTS,
  STRETCHED_BOARD_VIEWBOX,
  BOARD_VIEWBOX,
  COMPACT_OVERLAY_BOUNDS,
  CONTROL_LAYOUT,
  STRETCHED_ANSWER_CENTERS,
} from "./boardLayoutConfig";
import {
  ORIGINAL_COLOR_BY_OBJECT,
  type ObjectName,
  type PaletteName,
} from "./cardResolver";
import { useGameSession } from "./useGameSession";
import {
  ANSWER_BUTTON_CENTERS,
  ANSWER_PAW_STROKE_COLOR,
  BOARD_ANSWER_OPTIONS,
  BOARD_CONTROL_OVERLAYS,
  CORRECT_ANSWER_PAW_FILL_COLOR,
  createPawTrailSteps,
  getPawTrailStyle,
  INCORRECT_ANSWER_PAW_FILL_COLOR,
  PAW_TRAIL_FILL_COLOR,
  PAW_TRAIL_STROKE_COLOR,
} from "./gameBoardRoundConfig";
import type { BoardControlName } from "./gameBoardRoundConfig";
import type { ResolvedCard } from "./cardResolver";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";
import type { GameMode } from "./gameMode";
import { fixedDetails } from "./palettes";

type CardTransitionStage = "idle" | "to-reverse" | "to-next";

const OBJECT_BY_ORIGINAL_COLOR = Object.entries(
  ORIGINAL_COLOR_BY_OBJECT,
).reduce(
  (accumulator, [objectName, colorName]) => {
    accumulator[colorName as PaletteName] = objectName as ObjectName;
    return accumulator;
  },
  {} as Record<PaletteName, ObjectName>,
);

const SINGLE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "Each object has one original color: cat is orange, mouse is grey, cheese is yellow, ball is blue, and pillow is red. The tokens on the right show the correct color for each object.",
      "If an object on the card has its original color, that object is the correct answer.",
      "Example: if you see an orange cat on a blue pillow, the correct answer is cat.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "If none of the objects on the card have their original colors, the answer is the object that is missing from the card and whose color is also missing.",
      "To solve it, first remove the objects that are already on the card.",
      "Then remove any object whose original color is already visible on the card.",
      "The only object left is the correct answer.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "Example: if you see a grey mouse on a blue pillow, first remove mouse and pillow because they are already on the card.",
      "Then remove mouse and ball because grey and blue are already on the card.",
      "The only answer left is cheese.",
      "Choose an answer by clicking one of the tokens on the right. If you choose wrong, the paw trail will guide you to the correct answer.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "Use the top-right paw to restart.",
      "Use the back-arrow paw to review the previous answer.",
    ],
  },
] as const;

const FIVE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "In five-card mode, the answer to the round is the answer that repeats twice across the five cards.",
      "Solve each card using the one-card rules, then choose the answer that appears twice.",
      "One-card rules:",
      "Each object has one original color: cat is orange, mouse is grey, cheese is yellow, ball is blue, and pillow is red.",
      "If an object on the card has its original color, that object is the correct answer for that card.",
      "If none of the objects on the card have their original colors, remove the shown objects and any object whose original color is already visible on the card.",
      "The only answer left is the correct answer for that card. After solving all five cards, pick the answer that repeats twice.",
      "Use the top-right paw to restart and the back-arrow paw to review the previous answer.",
    ],
  },
] as const;

function RulesNavArrow({ direction }: { direction: "next" | "previous" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className={direction === "next" ? "h-6 w-9 shrink-0" : "h-6 w-9 shrink-0"}
      fill="none"
      style={direction === "next" ? { transform: "scaleX(-1)" } : undefined}
    >
      <g
        transform={direction === "next" ? "translate(0 -3)" : "translate(0 -3)"}
      >
        <path
          fill={fixedDetails.board.dark}
          d="m20.56,11.81c.15.43-.17.96-.7,1.19-.54.23-1.09.06-1.24-.37-.7-2.01-2.1-3.09-3.86-2.96-1.71.13-3.59,1.38-5.04,3.36.43.24.77.51.94.76,0,.02,0,.04,0,.07-.52.75-2.72,1.43-3.63,1.44-.05,0-.1-.02-.13-.05-.53-.52-1.13-2.15-.8-2.92,0-.02.03-.04.06-.05.49-.15,1.19-.09,1.89.09,1.09-1.5,2.39-2.69,3.77-3.46,1.04-.58,2.12-.93,3.21-1,2.58-.18,4.6,1.24,5.52,3.9Z"
        />
      </g>
    </svg>
  );
}

function formatColoredObject(color: PaletteName, object: ObjectName) {
  return `${color} ${object}`;
}

type ReviewExplanationParagraph = {
  content: ReactNode;
  key: string;
};

function CardTransitionFace({
  children,
  side,
}: {
  children: ReactNode;
  side: "back" | "front";
}) {
  return (
    <div
      className={`card-transition-face ${side === "front" ? "card-transition-face-front" : "card-transition-face-back"} flex items-center justify-center`}
    >
      {children}
    </div>
  );
}

function CardFlipTransition({
  backFace,
  className = "",
  frontFace,
  transitionKey,
}: {
  backFace: ReactNode;
  className?: string;
  frontFace: ReactNode;
  transitionKey: string;
}) {
  return (
    <div key={transitionKey} className="card-transition-scene h-full w-full">
      <div className={`card-transition-rotor ${className}`.trim()}>
        <CardTransitionFace side="back">{frontFace}</CardTransitionFace>
        <CardTransitionFace side="front">{backFace}</CardTransitionFace>
      </div>
    </div>
  );
}

function getOverlayStyle(
  layout: { height: number; left: number; top: number; width: number },
  rootViewBox: { height: number; width: number },
  translateX = 0,
  translateY = 0,
): CSSProperties {
  const left = layout.left + (translateX / rootViewBox.width) * 100;
  const top = layout.top + (translateY / rootViewBox.height) * 100;
  const formatPercent = (value: number) => {
    const nearestInteger = Math.round(value);

    if (Math.abs(value) < 0.01) {
      return "0";
    }

    if (Math.abs(value - nearestInteger) < 0.01) {
      return `${nearestInteger}%`;
    }

    return `${value}%`;
  };

  return {
    left: formatPercent(left),
    top: formatPercent(top),
    width: formatPercent(layout.width),
    height: formatPercent(layout.height),
  };
}

function getFixedControlStyle(
  control: keyof typeof CONTROL_LAYOUT,
): CSSProperties {
  const layout = CONTROL_LAYOUT[control];
  const CONTROL_HIT_SCALE = control === "restart" ? 1.2 : 1.6;
  const widthPx = (layout.width / 100) * BOARD_VIEWBOX.width * CONTROL_HIT_SCALE;
  const heightPx =
    (layout.height / 100) * BOARD_VIEWBOX.height * CONTROL_HIT_SCALE;

  switch (control) {
    case "previous":
      return {
        left: "0",
        top: "64px",
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      };
    case "restart":
      return {
        right: "0",
        top: "64px",
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      };
    case "rules":
      return {
        left: "0",
        bottom: "0",
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      };
    case "five-card-mode":
      return {
        right: "0",
        bottom: "0",
        width: `${widthPx}px`,
        height: `${heightPx}px`,
      };
  }
}

function getReviewExplanation(card: {
  objectA: ObjectName;
  objectB: ObjectName;
  colorA: PaletteName;
  colorB: PaletteName;
  targetAnswer?: ObjectName;
}): ReviewExplanationParagraph[] {
  const firstObjectIsCorrectlyColored =
    ORIGINAL_COLOR_BY_OBJECT[card.objectA] === card.colorA;
  const secondObjectIsCorrectlyColored =
    ORIGINAL_COLOR_BY_OBJECT[card.objectB] === card.colorB;

  if (firstObjectIsCorrectlyColored || secondObjectIsCorrectlyColored) {
    const correctlyColoredObject = firstObjectIsCorrectlyColored
      ? formatColoredObject(card.colorA, card.objectA)
      : formatColoredObject(card.colorB, card.objectB);

    return [
      {
        key: "correctly-colored",
        content: (
          <>
            The tokens on the right show the correct color for each object. This
            card has <strong>{correctlyColoredObject}</strong>, and it is in its
            original color. So the correct answer is{" "}
            <strong>{correctlyColoredObject}</strong>.
          </>
        ),
      },
    ];
  }

  const firstRemovedByColor = OBJECT_BY_ORIGINAL_COLOR[card.colorA];
  const secondRemovedByColor = OBJECT_BY_ORIGINAL_COLOR[card.colorB];
  const correctAnswerText = card.targetAnswer
    ? formatColoredObject(
        ORIGINAL_COLOR_BY_OBJECT[card.targetAnswer],
        card.targetAnswer,
      )
    : "the correct answer";

  return [
    {
      key: "card-contents",
      content: (
        <>
          This card has{" "}
          <strong>{formatColoredObject(card.colorA, card.objectA)}</strong> and{" "}
          <strong>{formatColoredObject(card.colorB, card.objectB)}</strong>, and
          neither one is in its original color. The tokens on the right show the
          correct color for each object.
        </>
      ),
    },
    {
      key: "remove-objects",
      content: (
        <>
          So the answer is not <strong>{card.objectA}</strong> or{" "}
          <strong>{card.objectB}</strong>. And the answer is not{" "}
          <strong>{firstRemovedByColor}</strong> or{" "}
          <strong>{secondRemovedByColor}</strong>.
        </>
      ),
    },
    {
      key: "remaining-answer",
      content: (
        <>
          This leaves us with the only possible answer:{" "}
          <strong>{correctAnswerText}</strong>.
        </>
      ),
    },
  ];
}

function getFiveCardReviewExplanation(previousTurn: {
  cards: ResolvedCard[];
  correctAnswer: ObjectName;
}) {
  const repeatedAnswer = formatColoredObject(
    ORIGINAL_COLOR_BY_OBJECT[previousTurn.correctAnswer],
    previousTurn.correctAnswer,
  );

  return [
    {
      key: "five-card-explanation",
      content: (
        <>
          In five-card mode each card has a solution, which can be found
          according to one-card rules. The overall answer will be the token
          that repeats for two different cards. Here, that repeated answer is{" "}
          <strong>{repeatedAnswer}</strong>.
        </>
      ),
    },
  ] satisfies ReviewExplanationParagraph[];
}

export function GameBoardRound({
  onModeChange,
}: {
  onModeChange?: (mode: GameMode) => void;
} = {}) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("single-card");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPreviousReviewOpen, setIsPreviousReviewOpen] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const {
    card,
    cards,
    correctAnswer,
    selectedAnswer,
    previousTurn,
    score,
    answeredCount,
    bestTotal,
    timeLeft,
    pawTrailRunId,
    cardSequence,
    isCardTransitioning,
    canAnswer,
    isRoundFinished,
    submitAnswer,
    restartRound,
  } = useGameSession({
    isPaused: isRulesOpen || isPreviousReviewOpen || !hasStarted,
    mode: gameMode,
  });
  const [hoveredAnswer, setHoveredAnswer] = useState<
    null | (typeof BOARD_ANSWER_OPTIONS)[number]
  >(null);
  const [hoveredControl, setHoveredControl] = useState<BoardControlName | null>(
    null,
  );
  const [displayCard, setDisplayCard] = useState(card);
  const [previousCard, setPreviousCard] = useState<ResolvedCard | null>(null);
  const [cardTransitionStage, setCardTransitionStage] =
    useState<CardTransitionStage>("idle");
  const [rulesPageIndex, setRulesPageIndex] = useState(0);
  const timeoutRefs = useRef<number[]>([]);
  const isBoardStretched = gameMode === "five-card";
  const lastRenderedCardRef = useRef(card);
  const suppressNextCardTransitionRef = useRef(false);
  const lastOverlayTriggerRef = useRef<HTMLElement | null>(null);
  const previousOverlayOpenRef = useRef(false);
  const rulesCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const explanationToggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousControlButtonRef = useRef<HTMLButtonElement | null>(null);
  const rulesControlButtonRef = useRef<HTMLButtonElement | null>(null);
  const fiveCardModeButtonRef = useRef<HTMLButtonElement | null>(null);
  const rulesTitleId = useId();
  const reviewTitleId = useId();
  const effectiveHoveredAnswer =
    hasStarted && canAnswer && !isRulesOpen && !isPreviousReviewOpen
      ? hoveredAnswer
      : null;
  const rulesPages =
    gameMode === "five-card" ? FIVE_CARD_RULES_PAGES : SINGLE_CARD_RULES_PAGES;
  const clampedRulesPageIndex = Math.min(
    rulesPageIndex,
    rulesPages.length - 1,
  );
  const currentRulesPage = rulesPages[clampedRulesPageIndex];
  const canGoToPreviousRulesPage = clampedRulesPageIndex > 0;
  const canGoToNextRulesPage = clampedRulesPageIndex < rulesPages.length - 1;
  const closeRules = useCallback(() => setIsRulesOpen(false), []);
  const closePreviousReview = useCallback(() => {
    suppressNextCardTransitionRef.current = true;
    setPreviousCard(null);
    setCardTransitionStage("idle");
    setDisplayCard(card);
    lastRenderedCardRef.current = card;
    setIsPreviousReviewOpen(false);
    setIsExplanationVisible(false);
  }, [card]);
  const isPreviousReviewAvailable = previousTurn != null;
  const isInteractionOverlayOpen = isRulesOpen || isPreviousReviewOpen;

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (isRulesOpen) {
      rulesCloseButtonRef.current?.focus();
      previousOverlayOpenRef.current = true;
      return;
    }

    if (isPreviousReviewOpen) {
      explanationToggleButtonRef.current?.focus();
      previousOverlayOpenRef.current = true;
      return;
    }

    if (previousOverlayOpenRef.current) {
      lastOverlayTriggerRef.current?.focus();
      previousOverlayOpenRef.current = false;
    }
  }, [isPreviousReviewOpen, isRulesOpen]);

  useEffect(() => {
    if (!isInteractionOverlayOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();

      if (isRulesOpen) {
        closeRules();
        return;
      }

      if (isPreviousReviewOpen) {
        closePreviousReview();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [
    closePreviousReview,
    closeRules,
    isInteractionOverlayOpen,
    isPreviousReviewOpen,
    isRulesOpen,
  ]);

  useEffect(() => {
    if (suppressNextCardTransitionRef.current) {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current = [];
      suppressNextCardTransitionRef.current = false;
      lastRenderedCardRef.current = card;
      return;
    }

    if (isBoardStretched) {
      lastRenderedCardRef.current = card;
      return;
    }

    if (lastRenderedCardRef.current === card) {
      return;
    }

    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutRefs.current = [];

    const outgoingCard = lastRenderedCardRef.current;
    setPreviousCard(outgoingCard);
    setDisplayCard(card);
    setCardTransitionStage("to-reverse");

    const toNextTimeoutId = window.setTimeout(() => {
      setCardTransitionStage("to-next");
    }, CARD_TRANSITION_PHASE_MS);

    const finishTimeoutId = window.setTimeout(() => {
      setCardTransitionStage("idle");
      setPreviousCard(null);
      lastRenderedCardRef.current = card;
    }, CARD_TRANSITION_PHASE_MS * 2);

    timeoutRefs.current = [toNextTimeoutId, finishTimeoutId];
  }, [card, cardSequence, isBoardStretched]);

  const answerPawFillColor =
    selectedAnswer == null
      ? undefined
      : selectedAnswer === correctAnswer
        ? CORRECT_ANSWER_PAW_FILL_COLOR
        : INCORRECT_ANSWER_PAW_FILL_COLOR;
  const answerPawStrokeColor =
    selectedAnswer == null ? undefined : ANSWER_PAW_STROKE_COLOR;

  const activeRootViewBox = isBoardStretched
    ? STRETCHED_BOARD_VIEWBOX
    : BOARD_VIEWBOX;
  const activeAnswerCenters = isBoardStretched
    ? STRETCHED_ANSWER_CENTERS
    : ANSWER_BUTTON_CENTERS;

  const pawTrailSteps = useMemo(() => {
    if (
      !selectedAnswer ||
      !correctAnswer ||
      selectedAnswer === correctAnswer
    ) {
      return [];
    }

    return createPawTrailSteps(
      activeAnswerCenters[selectedAnswer],
      activeAnswerCenters[correctAnswer],
      3,
      pawTrailRunId,
      activeRootViewBox,
    );
  }, [activeAnswerCenters, activeRootViewBox, correctAnswer, pawTrailRunId, selectedAnswer]);

  const targetHintPosition =
    selectedAnswer && correctAnswer && selectedAnswer !== correctAnswer
      ? activeAnswerCenters[correctAnswer]
      : null;
  const targetHintDelay =
    pawTrailSteps.length > 0 ? `${pawTrailSteps.length * 180 + 220}ms` : "0ms";
  const isAnimatingCardTransition =
    cardTransitionStage !== "idle" && previousCard != null;
  const previousReviewExplanation = previousTurn
    ? previousTurn.mode === "five-card"
      ? getFiveCardReviewExplanation(previousTurn)
      : getReviewExplanation(previousTurn.cards[0])
    : [];
  const useCompactOverlayViewport =
    (isRulesOpen && !isBoardStretched) ||
    (isPreviousReviewOpen && previousTurn?.mode !== "five-card");
  const shouldRenderHintLayer =
    !isInteractionOverlayOpen &&
    (pawTrailSteps.length > 0 || targetHintPosition != null);

  useEffect(() => {
    onModeChange?.(gameMode);
  }, [gameMode, onModeChange]);

  return (
    <>
        <div
          className="BaseBoardLayer pointer-events-none absolute inset-0 z-0"
          aria-hidden="true"
        >
        <BoardFrame />
        </div>

        <div className="CardSlotsLayer absolute inset-0 z-10">
          {isRulesOpen ? null : isPreviousReviewOpen && previousTurn ? (
              <section
                className="absolute"
                style={getOverlayStyle(
                  useCompactOverlayViewport
                    ? COMPACT_OVERLAY_BOUNDS
                    : isBoardStretched
                      ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
                      : BOARD_MODE_LAYOUTS["single-card"].contentBounds,
                  activeRootViewBox,
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby={reviewTitleId}
              >
                <h2 id={reviewTitleId} className="sr-only">
                  Previous card review
                </h2>
                {previousTurn.mode === "five-card" ? (
                  isExplanationVisible ? (
                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                      <div
                        className="h-full w-full"
                        style={{
                          transform: "scale(0.8)",
                          transformOrigin: "center bottom",
                        }}
                      >
                        <CardSlotsLayer
                          cards={previousTurn.cards}
                          isBoardStretched
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                      <div
                        className="h-full w-full"
                        style={{
                          transform: "scale(0.9)",
                          transformOrigin: "center bottom",
                        }}
                      >
                        <CardSlotsLayer
                          cards={previousTurn.cards}
                          isBoardStretched
                        />
                      </div>
                    </div>
                  )
                ) : (
                  <ReviewCardIllustration
                    card={previousTurn.cards[0]}
                    isExplanationVisible={isExplanationVisible}
                  />
                )}
              </section>
            ) : isRoundFinished ? null : isAnimatingCardTransition ? (
              cardTransitionStage === "to-reverse" ? (
                <div
                  className="absolute"
                  style={getOverlayStyle(
                    isBoardStretched
                      ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
                      : BOARD_MODE_LAYOUTS["single-card"].contentBounds,
                    activeRootViewBox,
                  )}
                >
                  <CardFlipTransition
                    transitionKey={`to-reverse-${cardSequence}`}
                    className="card-transition-rotor-flipping"
                    frontFace={
                      <ResolvedCardIllustration card={previousCard} />
                    }
                    backFace={
                      <img
                        src={reverseCard}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none -mt-[10px] block h-[70%] w-auto max-w-none select-none"
                      />
                    }
                  />
                </div>
              ) : (
                <div
                  className="absolute"
                  style={getOverlayStyle(
                    isBoardStretched
                      ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
                      : BOARD_MODE_LAYOUTS["single-card"].contentBounds,
                    activeRootViewBox,
                  )}
                >
                  <CardFlipTransition
                    transitionKey={`to-next-${cardSequence}`}
                    className="card-transition-rotor-flipping"
                    frontFace={
                      <img
                        src={reverseCard}
                        alt=""
                        aria-hidden="true"
                        className="pointer-events-none -mt-[10px] block h-[70%] w-auto max-w-none select-none"
                      />
                    }
                    backFace={<ResolvedCardIllustration card={displayCard} />}
                  />
                </div>
              )
            ) : !hasStarted ? null : isBoardStretched ? (
              <CardSlotsLayer
                cards={cards}
                isBoardStretched
                previousCards={
                  isCardTransitioning && previousTurn?.mode === "five-card"
                    ? previousTurn.cards
                    : undefined
                }
                transitionRunId={isCardTransitioning ? cardSequence : undefined}
              />
            ) : (
              <CardSlotsLayer
                cards={[displayCard]}
                isBoardStretched={false}
              />
            )}
        </div>

        <div className="DecorationLayer absolute inset-0 z-20">
          <BoardDecorationLayer
            hoveredControl={hoveredControl}
            isPreviousReviewActive={isPreviousReviewOpen}
            isRulesActive={isRulesOpen}
            showPreviousControl={isPreviousReviewAvailable}
          />
        </div>

        {isRulesOpen ? (
          <div className="OverlayLayer absolute inset-0 z-40">
            <section
              className={`absolute flex flex-col text-[#22304a] ${
                isBoardStretched ? "pt-14 pl-12 pb-12 pr-24" : "px-5 pt-6 pb-4"
              }`}
              style={getOverlayStyle(
                useCompactOverlayViewport
                  ? COMPACT_OVERLAY_BOUNDS
                  : isBoardStretched
                    ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
                    : BOARD_MODE_LAYOUTS["single-card"].contentBounds,
                activeRootViewBox,
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={rulesTitleId}
            >
              <header className="relative text-center">
                <button
                  ref={rulesCloseButtonRef}
                  type="button"
                  onClick={closeRules}
                  className="absolute right-0 -top-[10px] text-[20px] leading-none"
                  style={{
                    fontFamily: '"Hannotate TC", sans-serif',
                    fontWeight: 700,
                    color: fixedDetails.board.dark,
                  }}
                  aria-label="Close rules"
                >
                  ×
                </button>
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

              <article className="mt-2 flex-1 min-h-0">
                <div
                  className="h-full px-1 text-left text-[15px] leading-[1.35] text-[#22304a]"
                  style={{
                    fontFamily: '"Hannotate TC", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {currentRulesPage.paragraphs.map((paragraph) => (
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
                </div>
              </article>

              <nav
                className="mt-2 flex items-center justify-between gap-3"
                aria-label="Rules pages"
              >
                {canGoToPreviousRulesPage ? (
                  <button
                    type="button"
                    onClick={() =>
                      setRulesPageIndex((current) => Math.max(0, current - 1))
                    }
                    className="flex items-center gap-1 rounded-full px-1 py-1 text-[15px]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                  >
                    <RulesNavArrow direction="previous" />
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
                  {rulesPageIndex + 1}/{rulesPages.length}
                </p>

                {canGoToNextRulesPage ? (
                  <button
                    type="button"
                    onClick={() =>
                      setRulesPageIndex((current) =>
                        Math.min(rulesPages.length - 1, current + 1),
                      )
                    }
                    className="flex items-center gap-1 rounded-full px-1 py-1 text-[15px]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                  >
                    Next
                    <RulesNavArrow direction="next" />
                  </button>
                ) : (
                  <div className="w-[58px]" aria-hidden="true" />
                )}
              </nav>
            </section>
          </div>
        ) : null}

        {isRoundFinished &&
        !isExplanationVisible &&
        !isRulesOpen &&
        !isPreviousReviewOpen ? (
          <div className="OverlayLayer pointer-events-none absolute inset-0 z-40">
            <div
              className={`absolute flex -translate-y-[20px] flex-col items-center justify-center text-center text-[#22304a] ${
                isBoardStretched ? "pl-10 pr-20" : "px-10"
              }`}
              style={{
                ...getOverlayStyle(
                  useCompactOverlayViewport
                    ? COMPACT_OVERLAY_BOUNDS
                    : isBoardStretched
                      ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
                      : BOARD_MODE_LAYOUTS["single-card"].contentBounds,
                  activeRootViewBox,
                ),
                fontFamily: '"Hannotate TC", sans-serif',
              }}
            >
              <p className="text-[22px] leading-none">Round complete</p>
              <p className="mt-6 text-[22px] leading-none">
                Score: {score}/{answeredCount}
              </p>
              <p className="mt-8 max-w-[250px] text-[18px] leading-snug">
                Click the paw in the top right corner to play again
              </p>
            </div>
          </div>
        ) : null}

        <div className="InteractionLayer absolute inset-0 z-30">
        <BoardHud
          bestTotal={bestTotal}
          isBoardStretched={isBoardStretched}
          score={score}
          timeLeft={timeLeft}
        />

          {!hasStarted ? (
            <div
              className="absolute z-30"
              style={getOverlayStyle(
                isBoardStretched
                  ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
                  : BOARD_MODE_LAYOUTS["single-card"].contentBounds,
                activeRootViewBox,
              )}
            >
              <GameQuickStartGuide isLarge={isBoardStretched} />
            </div>
          ) : null}

          {isPreviousReviewOpen && previousTurn ? (
            <div
              className="absolute z-40"
              style={
                previousTurn.mode === "five-card"
                  ? getOverlayStyle(BOARD_MODE_LAYOUTS["five-card"].contentBounds, STRETCHED_BOARD_VIEWBOX)
                  : getOverlayStyle(COMPACT_OVERLAY_BOUNDS, BOARD_VIEWBOX)
              }
            >
              <div
                className={
                  previousTurn.mode === "five-card"
                    ? "absolute inset-0 pt-14 pl-12 pb-12 pr-24"
                    : "absolute inset-x-0 top-[15px]"
                }
              >
                <div className="relative flex flex-col items-center">
                  {!isExplanationVisible ? (
                    <button
                      type="button"
                      onClick={closePreviousReview}
                      className="absolute right-[15px] top-0 text-[20px] leading-none"
                      style={{
                        fontFamily: '"Hannotate TC", sans-serif',
                        fontWeight: 700,
                        color: fixedDetails.board.dark,
                      }}
                      aria-label="Close review"
                    >
                      ×
                    </button>
                  ) : null}
                  <button
                    ref={explanationToggleButtonRef}
                    type="button"
                    onClick={() =>
                      setIsExplanationVisible((current) => !current)
                    }
                    className="whitespace-nowrap text-[15px] leading-none text-[#22304a] underline underline-offset-2"
                    style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                  >
                    {isExplanationVisible
                      ? "Hide explanation"
                      : "Show explanation"}
                  </button>
                  {isExplanationVisible ? (
                    <div
                      className={
                        previousTurn.mode === "five-card"
                          ? "mt-2 w-full text-center text-[14px] leading-snug text-[#22304a]"
                          : "mt-2 w-full px-[10px] text-center text-[14px] leading-snug text-[#22304a]"
                      }
                      style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                    >
                      {previousReviewExplanation.map((paragraph) => (
                        <p key={paragraph.key} className="mb-1 last:mb-0">
                          {paragraph.content}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          ) : null}

          {shouldRenderHintLayer ? (
            <div className="pointer-events-none absolute inset-0 z-50" aria-hidden="true">
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
                    left: `${(targetHintPosition.x / activeRootViewBox.width) * 100}%`,
                    top: `${(targetHintPosition.y / activeRootViewBox.height) * 100}%`,
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

          <AnswerChoicesLayer
            canAnswer={canAnswer}
            disabledByOverlay={isPreviousReviewOpen || isRulesOpen}
            hasStarted={hasStarted}
            hoveredAnswer={effectiveHoveredAnswer}
            isBoardStretched={isBoardStretched}
            isRoundFinished={isRoundFinished}
            highlightedAnswer={
              isPreviousReviewOpen ? previousTurn?.correctAnswer ?? null : null
            }
            answerPawFillColor={
              isPreviousReviewOpen
                ? previousTurn?.wasCorrect
                  ? CORRECT_ANSWER_PAW_FILL_COLOR
                  : INCORRECT_ANSWER_PAW_FILL_COLOR
                : answerPawFillColor
            }
            answerPawStrokeColor={
              isPreviousReviewOpen
                ? previousTurn?.selectedAnswer
                  ? ANSWER_PAW_STROKE_COLOR
                  : undefined
                : answerPawStrokeColor
            }
            highlightedAnswerPawFillColor={
              isPreviousReviewOpen ? CORRECT_ANSWER_PAW_FILL_COLOR : undefined
            }
            highlightedAnswerPawStrokeColor={
              isPreviousReviewOpen ? ANSWER_PAW_STROKE_COLOR : undefined
            }
            onAnswerBlur={(answer) =>
              setHoveredAnswer((current) =>
                current === answer ? null : current,
              )
            }
            onAnswerClick={(answer) => {
              if (isRulesOpen) {
                closeRules();
              }

              if (isRoundFinished) {
                setHasStarted(true);
                restartRound();
                return;
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
                return;
              }

              if (!hasStarted) {
                return;
              }

              submitAnswer(answer);
            }}
            onAnswerFocus={(answer) => {
              if (hasStarted && canAnswer) {
                setHoveredAnswer(answer);
              }
            }}
            onAnswerHoverEnd={(answer) =>
              setHoveredAnswer((current) =>
                current === answer ? null : current,
              )
            }
            onAnswerHoverStart={(answer) => {
              if (hasStarted && canAnswer) {
                setHoveredAnswer(answer);
              }
            }}
            selectedAnswer={
              isPreviousReviewOpen
                ? previousTurn?.selectedAnswer ?? null
                : selectedAnswer
            }
          />

            {isPreviousReviewAvailable ? (
            <button
              ref={previousControlButtonRef}
              type="button"
              onClick={() => {
                if (isRulesOpen) {
                  closeRules();
                }

                if (isPreviousReviewOpen) {
                  closePreviousReview();
                  return;
                }

                if (previousTurn == null) {
                  return;
                }

                lastOverlayTriggerRef.current = previousControlButtonRef.current;
                setIsPreviousReviewOpen(true);
                setIsExplanationVisible(false);
              }}
              onMouseEnter={() => setHoveredControl("previous")}
              onMouseLeave={() =>
                setHoveredControl((current) =>
                  current === "previous" ? null : current,
                )
              }
              onFocus={() => setHoveredControl("previous")}
              onBlur={() =>
                setHoveredControl((current) =>
                  current === "previous" ? null : current,
                )
              }
              className="absolute z-40 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={getFixedControlStyle("previous")}
              aria-label={
                isPreviousReviewOpen
                  ? "Return to the current game"
                  : BOARD_CONTROL_OVERLAYS.previous.label
              }
            />
            ) : null}

            <button
            type="button"
            onClick={() => {
              setHoveredAnswer(null);

              if (isRulesOpen) {
                closeRules();
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

              setHasStarted(true);
              restartRound();
            }}
            onMouseEnter={() => setHoveredControl("restart")}
            onMouseLeave={() =>
              setHoveredControl((current) =>
                current === "restart" ? null : current,
              )
            }
            onFocus={() => setHoveredControl("restart")}
            onBlur={() =>
              setHoveredControl((current) =>
                current === "restart" ? null : current,
              )
            }
            className="absolute z-40 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={getFixedControlStyle("restart")}
            aria-label={BOARD_CONTROL_OVERLAYS.restart.label}
            />

            <button
            ref={rulesControlButtonRef}
            type="button"
            onClick={() => {
              setHoveredAnswer(null);

              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

              lastOverlayTriggerRef.current = rulesControlButtonRef.current;
              setIsRulesOpen((current) => !current);
              setRulesPageIndex(0);
            }}
            onMouseEnter={() => setHoveredControl("rules")}
            onMouseLeave={() =>
              setHoveredControl((current) =>
                current === "rules" ? null : current,
              )
            }
            onFocus={() => setHoveredControl("rules")}
            onBlur={() =>
              setHoveredControl((current) =>
                current === "rules" ? null : current,
              )
            }
            className="absolute z-40 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={getFixedControlStyle("rules")}
            aria-label={BOARD_CONTROL_OVERLAYS.rules.label}
            />

          <button
            ref={fiveCardModeButtonRef}
            type="button"
            onClick={() => {
              setHoveredAnswer(null);

              if (isRulesOpen) {
                closeRules();
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

              const nextMode =
                gameMode === "five-card" ? "single-card" : "five-card";

              suppressNextCardTransitionRef.current = true;
              setPreviousCard(null);
              setCardTransitionStage("idle");
              setDisplayCard(card);
              lastRenderedCardRef.current = card;
              setGameMode(nextMode);
              restartRound(nextMode);
            }}
            onMouseEnter={() => setHoveredControl("five-card-mode")}
            onMouseLeave={() =>
              setHoveredControl((current) =>
                current === "five-card-mode" ? null : current,
              )
            }
            onFocus={() => setHoveredControl("five-card-mode")}
            onBlur={() =>
              setHoveredControl((current) =>
                current === "five-card-mode" ? null : current,
              )
            }
            className="absolute z-40 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={getFixedControlStyle("five-card-mode")}
            aria-label={
              isBoardStretched
                ? "Switch to single card mode"
                : "Switch to five card mode"
            }
          />
        </div>
    </>
  );
}
