import { useEffect, useState, type CSSProperties, type ReactNode } from "react";

import CardFrameSvg from "./assets/card_frame.svg?react";
import type { ResolvedCard } from "./cardResolver";
import reverseCard from "./assets/reverse.svg";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";
import { FIVE_CARD_LAYOUT_VIEWBOX, FIVE_CARD_SLOTS } from "./fiveCardLayout";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";

const CARD_FRAME_INSET = {
  x: (28.38 / 288) * 100,
  y: (33.31 / 432) * 100,
  width: (231.24 / 288) * 100,
  height: (365.39 / 432) * 100,
} as const;

function getSlotStyle({
  height,
  width,
  x,
  y,
}: {
  height: number;
  width: number;
  x: number;
  y: number;
}): CSSProperties {
  return {
    left: `${(x / FIVE_CARD_LAYOUT_VIEWBOX.width) * 100}%`,
    top: `${(y / FIVE_CARD_LAYOUT_VIEWBOX.height) * 100}%`,
    width: `${(width / FIVE_CARD_LAYOUT_VIEWBOX.width) * 100}%`,
    height: `${(height / FIVE_CARD_LAYOUT_VIEWBOX.height) * 100}%`,
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
      <div
        className="absolute"
        style={{
          left: `${CARD_FRAME_INSET.x}%`,
          top: `${CARD_FRAME_INSET.y}%`,
          width: `${CARD_FRAME_INSET.width}%`,
          height: `${CARD_FRAME_INSET.height}%`,
        }}
      >
        <ResolvedCardIllustration
          card={card}
          wrapperClassName="flex h-full w-full items-center justify-center"
          className="block h-auto max-h-full w-full max-w-full"
        />
      </div>
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
  previousCards,
  transitionRunId,
}: {
  cards: ResolvedCard[];
  previousCards?: ResolvedCard[] | null;
  transitionRunId?: number;
}) {
  if (previousCards != null && transitionRunId != null) {
    return (
      <FiveCardBoardTransition
        key={transitionRunId}
        cards={cards}
        previousCards={previousCards}
        transitionRunId={transitionRunId}
      />
    );
  }

  return (
    <div className="relative h-full w-full">
      {FIVE_CARD_SLOTS.map((slot, index) => {
        const card = cards[index];

        if (!card) {
          return null;
        }

        return (
          <div
            key={`${card.illustration}-${index}`}
            className="absolute"
            style={getSlotStyle(slot)}
          >
            <FiveCardSlot card={card} stage="idle" slotIndex={index} />
          </div>
        );
      })}
    </div>
  );
}

function FiveCardBoardTransition({
  cards,
  previousCards,
  transitionRunId,
}: {
  cards: ResolvedCard[];
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
    <div className="relative h-full w-full">
      {FIVE_CARD_SLOTS.map((slot, index) => {
        const card = cards[index];

        if (!card) {
          return null;
        }

        return (
          <div
            key={`${card.illustration}-${index}`}
            className="absolute"
            style={getSlotStyle(slot)}
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
    </div>
  );
}
