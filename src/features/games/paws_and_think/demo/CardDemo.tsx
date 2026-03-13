import { useState } from "react";

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

  function refreshCard() {
    setSelectedAnswer(null);
    setHoveredAnswer(null);
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

          {BOARD_ANSWER_OPTIONS.map((answer) => (
            <button
              key={answer}
              type="button"
              onClick={() => setSelectedAnswer(answer)}
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
