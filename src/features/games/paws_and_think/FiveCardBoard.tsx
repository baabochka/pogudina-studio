import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import CardFrameSvg from "./assets/card_frame.svg?react";
import { BOARD_MODE_LAYOUTS } from "./boardLayoutConfig";
import type { ResolvedCard } from "./cardResolver";
import reverseCard from "./assets/reverse.svg";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";

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

function SlotTransitionFace({
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

function FiveCardSlotContent({ card }: { card: ResolvedCard }) {
  return (
    <>
      <CardFrameSvg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <ResolvedCardIllustration
        card={card}
        wrapperClassName={null}
        className="relative z-10 block h-auto max-h-full w-full max-w-full"
      />
    </>
  );
}

function FiveCardReverseContent() {
  return (
    <img
      src={reverseCard}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full select-none"
    />
  );
}

function FiveCardSlot({
  card,
  previousCard,
  slotIndex,
  stage,
  transitionRunId,
}: {
  card: ResolvedCard;
  previousCard?: ResolvedCard;
  stage: "idle" | "to-next" | "to-reverse";
  slotIndex: number;
  transitionRunId?: number;
}) {
  if (previousCard && transitionRunId != null && stage !== "idle") {
    return stage === "to-reverse" ? (
      <div
        key={`five-card-to-reverse-${transitionRunId}-${slotIndex}`}
        className="card-transition-scene h-full w-full"
      >
        <div className="card-transition-rotor card-transition-rotor-flipping">
          <SlotTransitionFace side="back">
            <FiveCardSlotContent card={previousCard} />
          </SlotTransitionFace>
          <SlotTransitionFace side="front">
            <FiveCardReverseContent />
          </SlotTransitionFace>
        </div>
      </div>
    ) : (
      <div
        key={`five-card-to-next-${transitionRunId}-${slotIndex}`}
        className="card-transition-scene h-full w-full"
      >
        <div className="card-transition-rotor card-transition-rotor-flipping">
          <SlotTransitionFace side="back">
            <FiveCardReverseContent />
          </SlotTransitionFace>
          <SlotTransitionFace side="front">
            <FiveCardSlotContent card={card} />
          </SlotTransitionFace>
        </div>
      </div>
    );
  }

  return <FiveCardSlotContent card={card} />;
}

export function FiveCardBoard({
  cards,
  contentBounds,
  previousCards,
  transitionRunId,
}: {
  cards: ResolvedCard[];
  contentBounds: { height: number; left: number; top: number; width: number };
  previousCards?: ResolvedCard[] | null;
  transitionRunId?: number;
}) {
  if (previousCards != null && transitionRunId != null) {
    return (
      <FiveCardBoardTransition
        key={transitionRunId}
        cards={cards}
        contentBounds={contentBounds}
        previousCards={previousCards}
        transitionRunId={transitionRunId}
      />
    );
  }

  return (
    <>
      {BOARD_MODE_LAYOUTS["five-card"].cardSlots.map((slot, index) => {
        const card = cards[index];

        if (!card) {
          return null;
        }

        return (
          <div
            key={`${card.illustration}-${index}`}
            className="absolute box-border flex items-center justify-center transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={getBoardRelativeSlotStyle(contentBounds, slot)}
          >
            <FiveCardSlot card={card} stage="idle" slotIndex={index} />
          </div>
        );
      })}
    </>
  );
}

function FiveCardBoardTransition({
  cards,
  contentBounds,
  previousCards,
  transitionRunId,
}: {
  cards: ResolvedCard[];
  contentBounds: { height: number; left: number; top: number; width: number };
  previousCards: ResolvedCard[];
  transitionRunId: number;
}) {
  const [transitionStage, setTransitionStage] = useState<
    "idle" | "to-next" | "to-reverse"
  >("to-reverse");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTransitionStage("to-next");
    }, CARD_TRANSITION_PHASE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <>
      {BOARD_MODE_LAYOUTS["five-card"].cardSlots.map((slot, index) => {
        const card = cards[index];

        if (!card) {
          return null;
        }

        return (
          <div
            key={`${card.illustration}-${index}`}
            className="absolute box-border flex items-center justify-center transition-[left,top,width,height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={getBoardRelativeSlotStyle(contentBounds, slot)}
          >
            <FiveCardSlot
              card={card}
              previousCard={previousCards?.[index]}
              stage={transitionStage}
              slotIndex={index}
              transitionRunId={transitionRunId}
            />
          </div>
        );
      })}
    </>
  );
}
