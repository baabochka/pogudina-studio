import { useEffect, useState, type ReactNode } from "react";

import reverseCard from "./assets/reverse.svg";
import type { ResolvedCard } from "./cardResolver";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";

function SingleCardTransitionFace({
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

function SingleCardFront({ card }: { card: ResolvedCard }) {
  return <ResolvedCardIllustration card={card} alignBottom />;
}

function SingleCardReverse() {
  return (
    <div className="absolute inset-0 flex items-center justify-center p-[10px]">
      <img
        src={reverseCard}
        alt=""
        aria-hidden="true"
        className="pointer-events-none block h-full w-full select-none object-contain"
      />
    </div>
  );
}

function SingleCardTransition({
  card,
  previousCard,
  transitionRunId,
}: {
  card: ResolvedCard;
  previousCard: ResolvedCard;
  transitionRunId: number;
}) {
  const [transitionStage, setTransitionStage] = useState<"to-next" | "to-reverse">(
    "to-reverse",
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTransitionStage("to-next");
    }, CARD_TRANSITION_PHASE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return transitionStage === "to-reverse" ? (
    <div
      key={`single-card-to-reverse-${transitionRunId}`}
      className="card-transition-scene h-full w-full"
    >
      <div className="card-transition-rotor card-transition-rotor-flipping">
        <SingleCardTransitionFace side="back">
          <SingleCardFront card={previousCard} />
        </SingleCardTransitionFace>
        <SingleCardTransitionFace side="front">
          <SingleCardReverse />
        </SingleCardTransitionFace>
      </div>
    </div>
  ) : (
    <div
      key={`single-card-to-next-${transitionRunId}`}
      className="card-transition-scene h-full w-full"
    >
      <div className="card-transition-rotor card-transition-rotor-flipping">
        <SingleCardTransitionFace side="back">
          <SingleCardReverse />
        </SingleCardTransitionFace>
        <SingleCardTransitionFace side="front">
          <SingleCardFront card={card} />
        </SingleCardTransitionFace>
      </div>
    </div>
  );
}

export function SingleCardLayer({
  card,
  previousCard,
  transitionRunId,
  bounds,
}: {
  card: ResolvedCard;
  previousCard?: ResolvedCard;
  transitionRunId?: number;
  bounds: {
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
}) {
  return (
    <div
      className="absolute"
      style={{
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
        right: `${bounds.right}px`,
        bottom: `${bounds.bottom}px`,
      }}
    >
      {previousCard && transitionRunId != null ? (
        <SingleCardTransition
          key={transitionRunId}
          card={card}
          previousCard={previousCard}
          transitionRunId={transitionRunId}
        />
      ) : (
        <SingleCardFront card={card} />
      )}
    </div>
  );
}
