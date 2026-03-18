import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import { HintPawStep } from "./HintPawStep";
import { ReviewCardIllustration } from "./ReviewCardIllustration";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";
import reverseCard from "./assets/reverse.svg";
import {
  ORIGINAL_COLOR_BY_OBJECT,
  type ObjectName,
  type PaletteName,
} from "./cardResolver";
import { GameBoardSmallIllustration } from "./illustrations/GameBoardSmallIllustration";
import { useGameSession } from "./useGameSession";
import {
  ANSWER_BUTTON_CENTERS,
  ANSWER_BUTTON_OVERLAYS,
  ANSWER_PAW_STROKE_COLOR,
  BOARD_ANSWER_OPTIONS,
  BOARD_CONTROL_OVERLAYS,
  BOARD_VIEWBOX,
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

const RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "Look at the colors on the card.",
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
      className={`card-transition-face ${side === "front" ? "card-transition-face-front" : "card-transition-face-back"} flex items-center justify-start`}
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

export function GameBoardRound({
  boardHeightClassName = "h-[483.89px]",
}: {
  boardHeightClassName?: string;
} = {}) {
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPreviousReviewOpen, setIsPreviousReviewOpen] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const {
    card,
    selectedAnswer,
    previousTurn,
    score,
    answeredCount,
    bestTotal,
    timeLeft,
    pawTrailRunId,
    cardSequence,
    canAnswer,
    isRoundFinished,
    submitAnswer,
    restartRound,
  } = useGameSession(isRulesOpen || isPreviousReviewOpen);
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
  const lastRenderedCardRef = useRef(card);
  const effectiveHoveredAnswer =
    canAnswer && !isRulesOpen && !isPreviousReviewOpen ? hoveredAnswer : null;
  const clampedRulesPageIndex = Math.min(
    rulesPageIndex,
    RULES_PAGES.length - 1,
  );
  const currentRulesPage = RULES_PAGES[clampedRulesPageIndex];
  const canGoToPreviousRulesPage = clampedRulesPageIndex > 0;
  const canGoToNextRulesPage = clampedRulesPageIndex < RULES_PAGES.length - 1;
  const closeRules = () => setIsRulesOpen(false);
  const closePreviousReview = () => {
    setIsPreviousReviewOpen(false);
    setIsExplanationVisible(false);
  };
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
  }, [card, cardSequence]);

  const answerPawFillColor =
    selectedAnswer == null
      ? undefined
      : selectedAnswer === card.targetAnswer
        ? CORRECT_ANSWER_PAW_FILL_COLOR
        : INCORRECT_ANSWER_PAW_FILL_COLOR;
  const answerPawStrokeColor =
    selectedAnswer == null ? undefined : ANSWER_PAW_STROKE_COLOR;

  const pawTrailSteps = useMemo(() => {
    if (
      !selectedAnswer ||
      !card.targetAnswer ||
      selectedAnswer === card.targetAnswer
    ) {
      return [];
    }

    return createPawTrailSteps(
      ANSWER_BUTTON_CENTERS[selectedAnswer],
      ANSWER_BUTTON_CENTERS[card.targetAnswer],
      3,
      pawTrailRunId,
    );
  }, [card.targetAnswer, pawTrailRunId, selectedAnswer]);

  const targetHintPosition =
    selectedAnswer && card.targetAnswer && selectedAnswer !== card.targetAnswer
      ? ANSWER_BUTTON_CENTERS[card.targetAnswer]
      : null;
  const targetHintDelay =
    pawTrailSteps.length > 0 ? `${pawTrailSteps.length * 180 + 220}ms` : "0ms";
  const isAnimatingCardTransition =
    cardTransitionStage !== "idle" && previousCard != null;
  const scoreboardNumberStyle = {
    fontFamily: '"Hannotate TC", sans-serif',
    fontSize: "17px",
    fontWeight: 700,
    lineHeight: 1,
  } as const;
  const previousReviewExplanation = previousTurn
    ? getReviewExplanation(previousTurn.card)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <div className={`relative ${boardHeightClassName}`}>
          <GameBoardSmallIllustration
            className="h-full w-auto"
            selectedAnswer={
              isPreviousReviewOpen
                ? previousTurn?.selectedAnswer
                : (selectedAnswer ?? undefined)
            }
            hoveredAnswer={effectiveHoveredAnswer ?? undefined}
            hoveredControl={hoveredControl ?? undefined}
            isPreviousReviewActive={isPreviousReviewOpen}
            showPreviousControl={isPreviousReviewAvailable}
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
            highlightedAnswer={
              isPreviousReviewOpen ? previousTurn?.correctAnswer : undefined
            }
            highlightedAnswerPawFillColor={
              isPreviousReviewOpen ? CORRECT_ANSWER_PAW_FILL_COLOR : undefined
            }
            highlightedAnswerPawStrokeColor={
              isPreviousReviewOpen ? ANSWER_PAW_STROKE_COLOR : undefined
            }
            highlightedAnswerPawClassName={
              isPreviousReviewOpen ? "h-9 w-9" : undefined
            }
          />

          <div
            className="pointer-events-none absolute inset-0 text-white"
            aria-hidden="true"
          >
            <div
              className="absolute left-[24.37%] top-[5.29%] -translate-x-1/2 -translate-y-1/2 leading-none"
              style={scoreboardNumberStyle}
            >
              {timeLeft}
            </div>
            <div
              className="absolute left-[57.22%] top-[5.29%] -translate-x-1/2 -translate-y-1/2 leading-none"
              style={scoreboardNumberStyle}
            >
              {score}
            </div>
            <div
              className="absolute left-[90.06%] top-[5.29%] -translate-x-1/2 -translate-y-1/2 leading-none"
              style={scoreboardNumberStyle}
            >
              {bestTotal}
            </div>
          </div>

          <div
            className={
              isRulesOpen || isPreviousReviewOpen
                ? "absolute left-[8.81%] top-[17.62%] h-[75.49%] w-[71.95%]"
                : "absolute left-[0.11%] top-[10.83%] h-[89.1%] w-[89.6%] [perspective:1200px]"
            }
          >
            {isRulesOpen ? (
              <section
                className="flex h-full w-full flex-col px-5 pt-6 pb-4 text-[#22304a]"
                aria-label="Game rules"
              >
                <header className="relative text-center">
                  <button
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
                    className="text-[17px] leading-none"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {currentRulesPage.title}
                  </p>
                </header>

                <article
                  className="mt-2 flex-1 px-1 text-left text-[13px] leading-[1.3] text-[#22304a]"
                  style={{
                    fontFamily: '"Hannotate TC", sans-serif',
                    fontWeight: 400,
                  }}
                >
                  {currentRulesPage.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mb-3 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
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
                      className="flex items-center gap-1 rounded-full px-1 py-1 text-[14px]"
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
                    className="shrink-0 text-[12px] leading-none text-[#4e627c]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    {rulesPageIndex + 1}/{RULES_PAGES.length}
                  </p>

                  {canGoToNextRulesPage ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRulesPageIndex((current) =>
                          Math.min(RULES_PAGES.length - 1, current + 1),
                        )
                      }
                      className="flex items-center gap-1 rounded-full px-1 py-1 text-[14px]"
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
            ) : isPreviousReviewOpen && previousTurn ? (
              <div className="relative h-full w-full">
                <ReviewCardIllustration
                  card={previousTurn.card}
                  isExplanationVisible={isExplanationVisible}
                />
              </div>
            ) : isRoundFinished ? (
              <div
                className="flex h-full w-full -translate-y-[20px] flex-col items-center justify-center px-10 text-center text-[#22304a]"
                style={{ fontFamily: '"Hannotate TC", sans-serif' }}
              >
                <p className="text-[22px] leading-none">Round complete</p>
                <p className="mt-6 text-[22px] leading-none">
                  Score: {score}/{answeredCount}
                </p>
                <p className="mt-8 max-w-[250px] text-[18px] leading-snug">
                  Click the paw in the top right corner to play again
                </p>
              </div>
            ) : isAnimatingCardTransition ? (
              cardTransitionStage === "to-reverse" ? (
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
                      className="pointer-events-none -mt-[10px] ml-[45px] block h-[70%] w-auto max-w-none select-none"
                    />
                  }
                />
              ) : (
                <CardFlipTransition
                  transitionKey={`to-next-${cardSequence}`}
                  className="card-transition-rotor-flipping"
                  frontFace={
                    <img
                      src={reverseCard}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none -mt-[10px] ml-[45px] block h-[70%] w-auto max-w-none select-none"
                    />
                  }
                  backFace={<ResolvedCardIllustration card={displayCard} />}
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-start">
                <ResolvedCardIllustration card={displayCard} />
              </div>
            )}
          </div>

          {isPreviousReviewOpen && previousTurn ? (
            <div className="absolute left-[8.81%] top-[17.62%] z-10 h-[75.49%] w-[71.95%]">
              <div className="absolute inset-x-0 top-[15px]">
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      setIsExplanationVisible((current) => !current)
                    }
                    className="whitespace-nowrap text-[14px] leading-none text-[#22304a] underline underline-offset-2"
                    style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                  >
                    {isExplanationVisible
                      ? "Hide explanation"
                      : "Show explanation"}
                  </button>
                  {isExplanationVisible ? (
                    <div
                      className="mt-2 w-full px-[10px] text-center text-[12px] leading-snug text-[#22304a]"
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

          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
            {isInteractionOverlayOpen
              ? null
              : pawTrailSteps.map((step) => (
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
            {!isInteractionOverlayOpen && targetHintPosition ? (
              <div
                key={`target-paw-${pawTrailRunId}`}
                className="paw-step-target absolute"
                style={{
                  left: `${(targetHintPosition.x / BOARD_VIEWBOX.width) * 100}%`,
                  top: `${(targetHintPosition.y / BOARD_VIEWBOX.height) * 100}%`,
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

          {BOARD_ANSWER_OPTIONS.map((answer) => (
            <button
              key={answer}
              type="button"
              onClick={() => {
                if (isRulesOpen) {
                  closeRules();
                }

                if (isRoundFinished) {
                  restartRound();
                  return;
                }

                if (isPreviousReviewOpen) {
                  closePreviousReview();
                  return;
                }

                submitAnswer(answer);
              }}
              onMouseEnter={() => {
                if (canAnswer) {
                  setHoveredAnswer(answer);
                }
              }}
              onMouseLeave={() =>
                setHoveredAnswer((current) =>
                  current === answer ? null : current,
                )
              }
              onFocus={() => {
                if (canAnswer) {
                  setHoveredAnswer(answer);
                }
              }}
              onBlur={() =>
                setHoveredAnswer((current) =>
                  current === answer ? null : current,
                )
              }
              data-answer-object={answer}
              data-selected={selectedAnswer === answer}
              data-hovered={effectiveHoveredAnswer === answer}
              disabled={(!canAnswer && !isRoundFinished) || isPreviousReviewOpen}
              className={`absolute ${ANSWER_BUTTON_OVERLAYS[answer].className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default`}
              aria-label={`Choose ${ANSWER_BUTTON_OVERLAYS[answer].label} as the answer`}
            />
          ))}

          {isPreviousReviewAvailable ? (
            <button
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
              className={`absolute ${BOARD_CONTROL_OVERLAYS.previous.className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
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
              if (isRulesOpen) {
                closeRules();
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

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
            className={`absolute ${BOARD_CONTROL_OVERLAYS.restart.className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            aria-label={BOARD_CONTROL_OVERLAYS.restart.label}
          />

          <button
            type="button"
            onClick={() => {
              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

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
            className={`absolute ${BOARD_CONTROL_OVERLAYS.rules.className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            aria-label={BOARD_CONTROL_OVERLAYS.rules.label}
          />

          <button
            type="button"
            onClick={() => {
              if (isRulesOpen) {
                closeRules();
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
                return;
              }
            }}
            className={`absolute ${BOARD_CONTROL_OVERLAYS["five-card-mode"].className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            aria-label={
              isPreviousReviewOpen
                ? "Return to the current game"
                : BOARD_CONTROL_OVERLAYS["five-card-mode"].label
            }
          />
        </div>
      </div>
    </div>
  );
}
