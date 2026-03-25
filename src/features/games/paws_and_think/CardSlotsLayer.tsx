import type { CSSProperties, ReactNode } from "react";

import { BOARD_MODE_LAYOUTS } from "./boardLayoutConfig";
import type { ResolvedCard } from "./cardResolver";
import { FiveCardBoard } from "./FiveCardBoard";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";

function getSlotStyle(slot: {
  height: number;
  left: number;
  top: number;
  width: number;
}): CSSProperties {
  return {
    left: `${slot.left}%`,
    top: `${slot.top}%`,
    width: `${slot.width}%`,
    height: `${slot.height}%`,
  };
}

function getBoardRelativeSlotStyle(
  bounds: { height: number; left: number; top: number; width: number },
  slot: { height: number; left: number; top: number; width: number },
): CSSProperties {
  return {
    left: `${bounds.left + (bounds.width * slot.left) / 100}%`,
    top: `${bounds.top + (bounds.height * slot.top) / 100}%`,
    width: `${(bounds.width * slot.width) / 100}%`,
    height: `${(bounds.height * slot.height) / 100}%`,
  };
}

export function ContentLayerViewport({
  children,
  isStretched,
}: {
  children: ReactNode;
  isStretched: boolean;
}) {
  const bounds = isStretched
    ? BOARD_MODE_LAYOUTS["five-card"].contentBounds
    : BOARD_MODE_LAYOUTS["single-card"].contentBounds;

  return (
    <div
      className={
        isStretched
          ? "absolute [perspective:1200px] transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          : "absolute transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      }
      style={getSlotStyle(bounds)}
    >
      {children}
    </div>
  );
}

export function CardSlotsLayer({
  cards,
  isBoardStretched,
  previousCards,
  transitionRunId,
}: {
  cards: ResolvedCard[];
  isBoardStretched: boolean;
  previousCards?: ResolvedCard[] | null;
  transitionRunId?: number;
}) {
  if (isBoardStretched) {
    return (
      <FiveCardBoard
        cards={cards}
        contentBounds={BOARD_MODE_LAYOUTS["five-card"].contentBounds}
        previousCards={previousCards}
        transitionRunId={transitionRunId}
      />
    );
  }

  return (
    <div
      className="absolute flex items-center justify-center transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
      style={getBoardRelativeSlotStyle(
        BOARD_MODE_LAYOUTS["single-card"].contentBounds,
        BOARD_MODE_LAYOUTS["single-card"].cardSlots[0],
      )}
    >
      <ResolvedCardIllustration
        card={cards[0]}
        wrapperClassName={null}
      />
    </div>
  );
}
