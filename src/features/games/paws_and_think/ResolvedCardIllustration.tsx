import type { CSSProperties, ReactElement } from "react";

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
} from "./colorRules";
import type { ResolvedCard } from "./cardResolver";
import { CatBallIllustration } from "./illustrations/CatBallIllustration";
import { CatCheeseIllustration } from "./illustrations/CatCheeseIllustration";
import { CatMouseIllustration } from "./illustrations/CatMouseIllustration";
import { CatPillowIllustration } from "./illustrations/CatPillowIllustration";
import { CheeseBallIllustration } from "./illustrations/CheeseBallIllustration";
import { MouseBallIllustration } from "./illustrations/MouseBallIllustration";
import { MouseCheeseIllustration } from "./illustrations/MouseCheeseIllustration";
import { PillowBallIllustration } from "./illustrations/PillowBallIllustration";
import { PillowCheeseIllustration } from "./illustrations/PillowCheeseIllustration";
import { PillowMouseIllustration } from "./illustrations/PillowMouseIllustration";

export function ResolvedCardIllustration({
  card,
  illustrationScale,
  illustrationTranslateY,
  alignBottom = false,
  className,
  wrapperClassName,
}: {
  card: ResolvedCard;
  illustrationScale?: number;
  illustrationTranslateY?: string;
  alignBottom?: boolean;
  className?: string;
  wrapperClassName?: string | null;
}) {
  const illustrationClassName = className
    ?? (alignBottom
      ? "absolute bottom-0 left-1/2 block h-full w-auto max-w-none -translate-x-1/2"
      : "block h-full w-auto max-w-none");
  const resolvedWrapperClassName = wrapperClassName === null
    ? null
    : wrapperClassName
    ?? (alignBottom ? "relative h-full w-full" : "h-full");
  const style = illustrationScale || illustrationTranslateY
    ? ({
        ...(illustrationScale
          ? { "--illustration-scale": illustrationScale }
          : {}),
        ...(illustrationTranslateY
          ? { "--illustration-translate-y": illustrationTranslateY }
          : {}),
      } as CSSProperties)
    : undefined;

  function renderIllustration(illustration: ReactElement) {
    if (resolvedWrapperClassName === null) {
      return illustration;
    }

    return (
      <div className={resolvedWrapperClassName} style={style}>
        {illustration}
      </div>
    );
  }

  switch (card.illustration) {
    case "cat-ball":
      return renderIllustration(
          <CatBallIllustration
            tokens={createCatBallTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
      );
    case "cat-cheese":
      return renderIllustration(
          <CatCheeseIllustration
            tokens={createCatCheeseTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
      );
    case "cat-mouse":
      return renderIllustration(
          <CatMouseIllustration
            tokens={createCatMouseTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
      );
    case "cat-pillow":
      return renderIllustration(
          <CatPillowIllustration
            tokens={createCatPillowTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
      );
    case "ball-cheese":
      return renderIllustration(
          <CheeseBallIllustration
            tokens={createCheeseBallTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
      );
    case "ball-mouse":
      return renderIllustration(
          <MouseBallIllustration
            tokens={createMouseBallTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
      );
    case "ball-pillow":
      return renderIllustration(
          <PillowBallIllustration
            tokens={createPillowBallTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
      );
    case "cheese-mouse":
      return renderIllustration(
          <MouseCheeseIllustration
            tokens={createMouseCheeseTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
      );
    case "cheese-pillow":
      return renderIllustration(
          <PillowCheeseIllustration
            tokens={createPillowCheeseTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
      );
    case "mouse-pillow":
      return renderIllustration(
          <PillowMouseIllustration
            tokens={createPillowMouseTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
      );
  }
}
