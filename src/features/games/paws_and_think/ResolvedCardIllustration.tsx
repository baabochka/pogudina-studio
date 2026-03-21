import type { CSSProperties } from "react";

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
  wrapperClassName?: string;
}) {
  const illustrationClassName = className
    ?? (alignBottom
      ? "absolute bottom-0 left-1/2 block h-full w-auto max-w-none -translate-x-1/2"
      : "block h-full w-auto max-w-none");
  const resolvedWrapperClassName = wrapperClassName
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

  switch (card.illustration) {
    case "cat-ball":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <CatBallIllustration
            tokens={createCatBallTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
        </div>
      );
    case "cat-cheese":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <CatCheeseIllustration
            tokens={createCatCheeseTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
        </div>
      );
    case "cat-mouse":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <CatMouseIllustration
            tokens={createCatMouseTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
        </div>
      );
    case "cat-pillow":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <CatPillowIllustration
            tokens={createCatPillowTokens(card.colorA, card.colorB)}
            className={illustrationClassName}
          />
        </div>
      );
    case "ball-cheese":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <CheeseBallIllustration
            tokens={createCheeseBallTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
        </div>
      );
    case "ball-mouse":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <MouseBallIllustration
            tokens={createMouseBallTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
        </div>
      );
    case "ball-pillow":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <PillowBallIllustration
            tokens={createPillowBallTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
        </div>
      );
    case "cheese-mouse":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <MouseCheeseIllustration
            tokens={createMouseCheeseTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
        </div>
      );
    case "cheese-pillow":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <PillowCheeseIllustration
            tokens={createPillowCheeseTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
        </div>
      );
    case "mouse-pillow":
      return (
        <div className={resolvedWrapperClassName} style={style}>
          <PillowMouseIllustration
            tokens={createPillowMouseTokens(card.colorB, card.colorA)}
            className={illustrationClassName}
          />
        </div>
      );
  }
}
