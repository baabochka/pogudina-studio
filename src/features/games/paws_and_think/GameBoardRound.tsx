import { useEffect, useMemo, useRef, useState } from "react";

import { HintPawStep } from "./HintPawStep";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";
import reverseCard from "./assets/reverse.svg";
import { GameBoardSmallIllustration } from "./illustrations/GameBoardSmallIllustration";
import { useGameSession } from "./useGameSession";
import {
  ANSWER_BUTTON_CENTERS,
  ANSWER_BUTTON_OVERLAYS,
  ANSWER_PAW_STROKE_COLOR,
  BOARD_ANSWER_OPTIONS,
  BOARD_VIEWBOX,
  CORRECT_ANSWER_PAW_FILL_COLOR,
  createPawTrailSteps,
  getPawTrailStyle,
  INCORRECT_ANSWER_PAW_FILL_COLOR,
  PAW_TRAIL_FILL_COLOR,
  PAW_TRAIL_STROKE_COLOR,
} from "./gameBoardRoundConfig";
import type { ResolvedCard } from "./cardResolver";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";

type CardTransitionStage = "idle" | "to-reverse" | "to-next";

export function GameBoardRound() {
  const {
    card,
    selectedAnswer,
    validationResult,
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
  } = useGameSession();
  const [hoveredAnswer, setHoveredAnswer] = useState<
    null | (typeof BOARD_ANSWER_OPTIONS)[number]
  >(null);
  const [displayCard, setDisplayCard] = useState(card);
  const [previousCard, setPreviousCard] = useState<ResolvedCard | null>(null);
  const [cardTransitionStage, setCardTransitionStage] =
    useState<CardTransitionStage>("idle");
  const timeoutRefs = useRef<number[]>([]);
  const lastRenderedCardRef = useRef(card);
  const effectiveHoveredAnswer = canAnswer ? hoveredAnswer : null;

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

  return (
    <div className="space-y-6">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-3 text-center sm:gap-6">
        <div className="min-w-24 rounded-full border border-border bg-surface px-4 py-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Time
          </p>
          <p className="text-2xl font-semibold text-foreground">{timeLeft}</p>
        </div>
        <div className="min-w-24 rounded-full border border-border bg-surface px-4 py-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Score
          </p>
          <p className="text-2xl font-semibold text-foreground">{score}</p>
        </div>
        <div className="min-w-24 rounded-full border border-border bg-surface px-4 py-2">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Best Total
          </p>
          <p className="text-2xl font-semibold text-foreground">{bestTotal}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative h-[431.15px]">
          <GameBoardSmallIllustration
            className="h-full w-auto"
            selectedAnswer={selectedAnswer ?? undefined}
            hoveredAnswer={effectiveHoveredAnswer ?? undefined}
            answerPawFillColor={answerPawFillColor}
            answerPawStrokeColor={answerPawStrokeColor}
          />

          <div className="absolute inset-y-0 left-[0.05%] w-[89.8%] [perspective:1200px]">
            {isAnimatingCardTransition ? (
              cardTransitionStage === "to-reverse" ? (
                <div
                  key={`to-reverse-${cardSequence}`}
                  className="card-transition-flip-phase relative h-full w-full"
                >
                  <div className="card-transition-face card-transition-face-back flex items-center justify-start">
                    <ResolvedCardIllustration card={previousCard} />
                  </div>

                  <div className="card-transition-face card-transition-face-front flex items-center justify-start">
                    <img
                      src={reverseCard}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none -mt-[10px] ml-[45px] block h-[70%] w-auto max-w-none select-none"
                    />
                  </div>
                </div>
              ) : (
                <div
                  key={`to-next-${cardSequence}`}
                  className="card-transition-flip-phase-reverse relative h-full w-full"
                >
                  <div className="card-transition-face card-transition-face-back flex items-center justify-start">
                    <img
                      src={reverseCard}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none -mt-[10px] ml-[45px] block h-[70%] w-auto max-w-none select-none"
                    />
                  </div>

                  <div className="card-transition-face card-transition-face-front flex items-center justify-start">
                    <ResolvedCardIllustration card={displayCard} />
                  </div>
                </div>
              )
            ) : (
              <div className="flex h-full w-full items-center justify-start">
                <ResolvedCardIllustration card={displayCard} />
              </div>
            )}
          </div>

          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
          >
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
              onClick={() => submitAnswer(answer)}
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
              disabled={!canAnswer}
              className={`absolute ${ANSWER_BUTTON_OVERLAYS[answer].className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default`}
              aria-label={`Choose ${ANSWER_BUTTON_OVERLAYS[answer].label} as the answer`}
            />
          ))}

          <button
            type="button"
            onClick={restartRound}
            className="absolute right-[1.8%] top-[1.8%] h-[12.5%] w-[18%] rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Restart the round"
          />
        </div>
      </div>

      {isRoundFinished ? (
        <div className="mx-auto max-w-md rounded-[2rem] border border-border bg-surface px-8 py-6 text-center">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
            Round Complete!
          </p>
          <p className="mt-4 text-2xl font-semibold text-foreground">
            Score: {score} / {answeredCount}
          </p>
          <p className="mt-2 text-lg text-foreground">Best total: {bestTotal}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Click the refresh button to play again.
          </p>
        </div>
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          {validationResult === "wrong"
            ? "Follow the paw trail hint to the correct answer."
            : "Pick the object whose original color appears on the card."}
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground">
        Cards advance automatically after validation. The round avoids reusing
        the same illustration within the last three cards.
      </div>
    </div>
  );
}
