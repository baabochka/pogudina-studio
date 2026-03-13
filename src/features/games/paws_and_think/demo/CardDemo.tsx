import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import {
  resolveCard,
  type IllustrationName,
  type ObjectName,
  type ResolvedCard,
} from "../cardResolver";
import {
  createCatBallTokens,
  createCatCheeseTokens,
  createCatMouseTokens,
  createCatPillowTokens,
  createCheeseBallTokens,
  createMouseBallTokens,
  createMouseCheeseTokens,
  createPillowBallTokens,
  createPillowCheeseTokens,
  createPillowMouseTokens,
} from "../colorRules";
import { GameBoardSmallIllustration } from "../illustrations/GameBoardSmallIllustration";
import { CatBallIllustration } from "../illustrations/CatBallIllustration";
import { CatCheeseIllustration } from "../illustrations/CatCheeseIllustration";
import { CatMouseIllustration } from "../illustrations/CatMouseIllustration";
import { CatPillowIllustration } from "../illustrations/CatPillowIllustration";
import { CheeseBallIllustration } from "../illustrations/CheeseBallIllustration";
import { MouseBallIllustration } from "../illustrations/MouseBallIllustration";
import { MouseCheeseIllustration } from "../illustrations/MouseCheeseIllustration";
import { PillowBallIllustration } from "../illustrations/PillowBallIllustration";
import { PillowCheeseIllustration } from "../illustrations/PillowCheeseIllustration";
import { PillowMouseIllustration } from "../illustrations/PillowMouseIllustration";
import { basePalettes, fixedDetails, neutrals } from "../palettes";

const ILLUSTRATION_OPTIONS: IllustrationName[] = [
  "cat-ball",
  "cat-cheese",
  "cat-mouse",
  "cat-pillow",
  "ball-cheese",
  "ball-mouse",
  "ball-pillow",
  "cheese-mouse",
  "cheese-pillow",
  "mouse-pillow",
];

const TARGET_ANSWER_OPTIONS: ResolvedCard["objectA"][] = [
  "cat",
  "pillow",
  "mouse",
  "cheese",
  "ball",
];
const BOARD_ANSWER_OPTIONS: ObjectName[] = [
  "mouse",
  "cat",
  "cheese",
  "ball",
  "pillow",
];
const ANSWER_BUTTON_OVERLAYS: Record<
  ObjectName,
  { className: string; label: string }
> = {
  mouse: { className: "right-[0.8%] top-[14.2%] h-[14.5%] w-[19%]", label: "Mouse" },
  cat: { className: "right-[0.8%] top-[27.7%] h-[14.5%] w-[19%]", label: "Cat" },
  cheese: { className: "right-[0.8%] top-[41.8%] h-[14.5%] w-[19%]", label: "Cheese" },
  ball: { className: "right-[0.8%] top-[55.8%] h-[14.5%] w-[19%]", label: "Ball" },
  pillow: { className: "right-[0.8%] top-[69.8%] h-[14.5%] w-[19%]", label: "Pillow" },
};
const CORRECT_ANSWER_PAW_FILL_COLOR = `${fixedDetails.accent.light}CC`;
const INCORRECT_ANSWER_PAW_FILL_COLOR = `${basePalettes.red.light}CC`;
const ANSWER_PAW_STROKE_COLOR = neutrals.black;
const BOARD_VIEWBOX = { width: 320.82, height: 431.15 };
const ANSWER_BUTTON_CENTERS: Record<ObjectName, { x: number; y: number }> = {
  mouse: { x: 291.13, y: 93.25 },
  cat: { x: 291.13, y: 154.47 },
  cheese: { x: 291.13, y: 213.04 },
  ball: { x: 291.13, y: 274.25 },
  pillow: { x: 291.13, y: 334.47 },
};
const PAW_TRAIL_FILL_COLOR = `${fixedDetails.accent.light}D9`;
const PAW_TRAIL_STROKE_COLOR = neutrals.black;

type PawTrailStep = {
  key: string;
  left: string;
  top: string;
  rotation: string;
  delay: string;
};

function formatOptionLabel(value: string) {
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" + ");
}

function renderResolvedIllustration(card: ResolvedCard) {
  const className = "block h-full w-auto max-w-none";

  switch (card.illustration) {
    case "cat-ball":
      return (
        <CatBallIllustration
          tokens={createCatBallTokens(card.colorA, card.colorB)}
          className={className}
        />
      );
    case "cat-cheese":
      return (
        <CatCheeseIllustration
          tokens={createCatCheeseTokens(card.colorA, card.colorB)}
          className={className}
        />
      );
    case "cat-mouse":
      return (
        <CatMouseIllustration
          tokens={createCatMouseTokens(card.colorA, card.colorB)}
          className={className}
        />
      );
    case "cat-pillow":
      return (
        <CatPillowIllustration
          tokens={createCatPillowTokens(card.colorA, card.colorB)}
          className={className}
        />
      );
    case "ball-cheese":
      return (
        <CheeseBallIllustration
          tokens={createCheeseBallTokens(card.colorB, card.colorA)}
          className={className}
        />
      );
    case "ball-mouse":
      return (
        <MouseBallIllustration
          tokens={createMouseBallTokens(card.colorB, card.colorA)}
          className={className}
        />
      );
    case "ball-pillow":
      return (
        <PillowBallIllustration
          tokens={createPillowBallTokens(card.colorB, card.colorA)}
          className={className}
        />
      );
    case "cheese-mouse":
      return (
        <MouseCheeseIllustration
          tokens={createMouseCheeseTokens(card.colorB, card.colorA)}
          className={className}
        />
      );
    case "cheese-pillow":
      return (
        <PillowCheeseIllustration
          tokens={createPillowCheeseTokens(card.colorB, card.colorA)}
          className={className}
        />
      );
    case "mouse-pillow":
      return (
        <PillowMouseIllustration
          tokens={createPillowMouseTokens(card.colorB, card.colorA)}
          className={className}
        />
      );
  }
}

function SmallPawStep({
  fill,
  stroke,
  className = "h-9 w-9",
}: {
  fill: string;
  stroke: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 90 90" className={`${className} overflow-visible`} aria-hidden="true">
      <g transform="translate(45 45) scale(0.98) translate(-45 -45)">
        <path
          d="m45.22,15.81c5.69,2.07,14.56,7.05,10.58,14.76-2.29,4.4-8.47,12.81-13.03,10.56-8.44-5.3-18.55-14.82-6.73-22.78,2.56-1.73,6.03-3.11,9.18-2.54Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="m48.07,87.66c-10.5-.67-24.87-2.58-23.57-15.54.78-11.12,6.8-22.47,18.55-25.01,13.09-2.53,22.36,9.39,27.52,19.66,7.15,14.51-11.89,20.23-22.5,20.89Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="m13.52,55.28c-17.33,1.25-12.87-28.66,6.68-23.36,5.16,1.08,5.72,5.68,6.3,9.79,1.67,11.72.07,13.31-12.98,13.57Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="m76.06,25.23c7.13-.07,12.51,5.87,12.45,13.77-.04,5.18-9.41,11.39-17.22,11.45-2.73,0-7.82-10.33-7.87-15.98-.05-5.41,5.08-9.14,12.64-9.23Z"
          fill={fill}
          stroke={stroke}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}

function createPawTrailSteps(
  from: { x: number; y: number },
  to: { x: number; y: number },
  count: number,
  runId: number,
): PawTrailStep[] {
  const verticalDistance = Math.abs(to.y - from.y);
  const controlX = (from.x + to.x) / 2 - (92 + verticalDistance * 0.18);
  const controlY = (from.y + to.y) / 2 + (to.y - from.y) * 0.18;

  return Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / (count + 1);
    const invT = 1 - t;
    const x = invT * invT * from.x + 2 * invT * t * controlX + t * t * to.x;
    const y = invT * invT * from.y + 2 * invT * t * controlY + t * t * to.y;

    const tangentX = 2 * invT * (controlX - from.x) + 2 * t * (to.x - controlX);
    const tangentY = 2 * invT * (controlY - from.y) + 2 * t * (to.y - controlY);
    const rotation = `${(Math.atan2(tangentY, tangentX) * 180) / Math.PI + 90}deg`;

    return {
      key: `paw-step-${runId}-${index}`,
      left: `${(x / BOARD_VIEWBOX.width) * 100}%`,
      top: `${(y / BOARD_VIEWBOX.height) * 100}%`,
      rotation,
      delay: `${index * 180}ms`,
    };
  });
}

export function CardDemo() {
  const [card, setCard] = useState<ResolvedCard>(() => resolveCard({}));
  const [selectedIllustration, setSelectedIllustration] = useState<
    IllustrationName | ""
  >("");
  const [selectedTargetAnswer, setSelectedTargetAnswer] = useState<
    ResolvedCard["objectA"] | ""
  >("");
  const [selectedAnswer, setSelectedAnswer] = useState<ObjectName | null>(null);
  const [hoveredAnswer, setHoveredAnswer] = useState<ObjectName | null>(null);
  const [pawTrailRunId, setPawTrailRunId] = useState(0);

  function refreshCard() {
    setSelectedAnswer(null);
    setHoveredAnswer(null);
    setPawTrailRunId(0);
    setCard(
      resolveCard({
        illustration: selectedIllustration || undefined,
        targetAnswer: selectedTargetAnswer || undefined,
      }),
    );
  }

  const answerPawFillColor =
    selectedAnswer == null
      ? undefined
      : selectedAnswer === card.targetAnswer
        ? CORRECT_ANSWER_PAW_FILL_COLOR
        : INCORRECT_ANSWER_PAW_FILL_COLOR;
  const answerPawStrokeColor = selectedAnswer == null ? undefined : ANSWER_PAW_STROKE_COLOR;
  const pawTrailSteps = useMemo(() => {
    if (!selectedAnswer || !card.targetAnswer || selectedAnswer === card.targetAnswer) {
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

  function handleAnswerSelect(answer: ObjectName) {
    setSelectedAnswer(answer);

    if (card.targetAnswer && answer !== card.targetAnswer) {
      setPawTrailRunId((current) => current + 1);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-center">
        <div className="relative h-[431.15px]">
          <GameBoardSmallIllustration
            className="h-full w-auto"
            selectedAnswer={selectedAnswer ?? undefined}
            hoveredAnswer={hoveredAnswer ?? undefined}
            answerPawFillColor={answerPawFillColor}
            answerPawStrokeColor={answerPawStrokeColor}
          />

          <div className="absolute inset-y-0 left-[0.05%] flex w-[89.8%] items-center justify-start">
            {renderResolvedIllustration(card)}
          </div>

          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            {pawTrailSteps.map((step) => (
              <div
                key={step.key}
                className="paw-step-trail absolute"
                style={
                  {
                    left: step.left,
                    top: step.top,
                    animationDelay: step.delay,
                    "--paw-step-rotation": step.rotation,
                  } as CSSProperties
                }
              >
                <SmallPawStep fill={PAW_TRAIL_FILL_COLOR} stroke={PAW_TRAIL_STROKE_COLOR} className="h-11 w-11" />
              </div>
            ))}
            {targetHintPosition ? (
              <div
                key={`target-paw-${pawTrailRunId}`}
                className="paw-step-target absolute"
                style={
                  {
                    left: `${(targetHintPosition.x / BOARD_VIEWBOX.width) * 100}%`,
                    top: `${(targetHintPosition.y / BOARD_VIEWBOX.height) * 100}%`,
                    animationDelay: targetHintDelay,
                  } as CSSProperties
                }
              >
                <SmallPawStep fill={PAW_TRAIL_FILL_COLOR} stroke={PAW_TRAIL_STROKE_COLOR} className="h-9 w-9" />
              </div>
            ) : null}
          </div>

          {BOARD_ANSWER_OPTIONS.map((answer) => (
            <button
              key={answer}
              type="button"
              onClick={() => handleAnswerSelect(answer)}
              onMouseEnter={() => setHoveredAnswer(answer)}
              onMouseLeave={() => setHoveredAnswer((current) => (current === answer ? null : current))}
              onFocus={() => setHoveredAnswer(answer)}
              onBlur={() => setHoveredAnswer((current) => (current === answer ? null : current))}
              data-answer-object={answer}
              data-selected={selectedAnswer === answer}
              data-hovered={hoveredAnswer === answer}
              className={`absolute ${ANSWER_BUTTON_OVERLAYS[answer].className} rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
              aria-label={`Choose ${ANSWER_BUTTON_OVERLAYS[answer].label} as the answer`}
            />
          ))}

          <button
            type="button"
            onClick={refreshCard}
            className="absolute right-[1.8%] top-[1.8%] h-[12.5%] w-[18%] rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="Generate new card from current settings"
          />
        </div>
      </div>

      <form
        onSubmit={(event) => event.preventDefault()}
        className="mx-auto max-w-3xl rounded-[2rem] border border-border bg-surface p-6"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            <span>Illustration</span>
            <select
              value={selectedIllustration}
              onChange={(event) =>
                setSelectedIllustration(
                  event.target.value as IllustrationName | "",
                )
              }
              className="rounded-full border border-border bg-background px-4 py-3 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <option value="">Any illustration</option>
              {ILLUSTRATION_OPTIONS.map((illustration) => (
                <option key={illustration} value={illustration}>
                  {formatOptionLabel(illustration)}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm font-medium text-muted-foreground">
            <span>Target answer</span>
            <select
              value={selectedTargetAnswer}
              onChange={(event) =>
                setSelectedTargetAnswer(
                  event.target.value as ResolvedCard["objectA"] | "",
                )
              }
              className="rounded-full border border-border bg-background px-4 py-3 text-foreground outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <option value="">No target answer</option>
              {TARGET_ANSWER_OPTIONS.map((targetAnswer) => (
                <option key={targetAnswer} value={targetAnswer}>
                  {formatOptionLabel(targetAnswer)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Adjust the controls, then click the refresh icon on the board to
          generate a new card.
        </p>
      </form>
    </div>
  );
}
