import { useEffect, useState, type ReactNode } from "react";

import { AnswerTokenBadge } from "./AnswerTokenBadge";
import CardFrameSvg from "./assets/card_frame.svg?react";
import reverseCard from "./assets/reverse.svg";
import type { ResolvedCard } from "./cardResolver";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";

export type CardCount = 3 | 4 | 5 | 6;

const ROW_LAYOUTS: Record<CardCount, number[]> = {
  3: [3],
  4: [2, 2],
  5: [3, 2],
  6: [3, 3],
};

function CardFrame({
  answerBadgeBottom,
  card,
  scale = 1,
  answerBadgeScale = 1,
  showAnswerBadge = false,
}: {
  answerBadgeBottom?: string;
  card: ResolvedCard;
  scale?: number;
  answerBadgeScale?: number;
  showAnswerBadge?: boolean;
}) {
  return (
    <div
      className="relative shrink-0"
      style={{
        height: `${180 * scale}px`,
        width: `${120 * scale}px`,
      }}
    >
      <CardFrameSvg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
      />
      <ResolvedCardIllustration
        card={card}
        wrapperClassName={null}
        className="relative z-10 block h-auto max-h-full w-full max-w-full"
      />
      {showAnswerBadge && card.targetAnswer ? (
        <AnswerTokenBadge
          answer={card.targetAnswer}
          bottom={answerBadgeBottom}
          scale={answerBadgeScale}
        />
      ) : null}
    </div>
  );
}

function ReverseCardFrame() {
  return (
    <img
      src={reverseCard}
      alt=""
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 block h-full w-full select-none"
    />
  );
}

function TransitionFace({
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

export function MultiCardLayer({
  cards,
  count,
  className = "absolute z-5",
  contentClassName = "flex h-full w-full flex-col items-center justify-center gap-8",
  rowClassName = "flex w-full items-center justify-center gap-8",
  renderContentOnly = false,
  cardScale = 1,
  answerBadgeScale = 1,
  answerBadgeBottom,
  previousCards,
  showAnswerBadges = false,
  transitionRunId,
}: {
  cards: ResolvedCard[];
  count: CardCount;
  className?: string;
  contentClassName?: string;
  rowClassName?: string;
  renderContentOnly?: boolean;
  cardScale?: number;
  answerBadgeScale?: number;
  answerBadgeBottom?: string;
  previousCards?: ResolvedCard[] | null;
  showAnswerBadges?: boolean;
  transitionRunId?: number;
}) {
  if (previousCards != null && transitionRunId != null) {
    return (
      <MultiCardTransition
        key={transitionRunId}
        cards={cards}
        count={count}
        className={className}
        contentClassName={contentClassName}
        rowClassName={rowClassName}
        renderContentOnly={renderContentOnly}
        cardScale={cardScale}
        answerBadgeScale={answerBadgeScale}
        answerBadgeBottom={answerBadgeBottom}
        previousCards={previousCards}
        showAnswerBadges={showAnswerBadges}
        transitionRunId={transitionRunId}
      />
    );
  }

  return renderMultiCardContent({
    answerBadgeBottom,
    answerBadgeScale,
    cardScale,
    cards,
    className,
    contentClassName,
    count,
    renderContentOnly,
    rowClassName,
    showAnswerBadges,
  });
}

function renderMultiCardContent({
  answerBadgeBottom,
  answerBadgeScale = 1,
  cardScale = 1,
  cards,
  className,
  contentClassName,
  count,
  renderContentOnly,
  rowClassName,
  showAnswerBadges = false,
}: {
  answerBadgeBottom?: string;
  answerBadgeScale?: number;
  cardScale?: number;
  cards: ResolvedCard[];
  className: string;
  contentClassName: string;
  count: CardCount;
  renderContentOnly: boolean;
  rowClassName: string;
  showAnswerBadges?: boolean;
}) {
  const rows = ROW_LAYOUTS[count];
  const rowCards = rows.reduce<
    {
      cards: ResolvedCard[];
      rowIndex: number;
    }[]
  >((accumulator, cardsInRow, rowIndex) => {
    const startIndex = accumulator.reduce(
      (total, row) => total + row.cards.length,
      0,
    );

    accumulator.push({
      cards: cards.slice(startIndex, startIndex + cardsInRow),
      rowIndex,
    });

    return accumulator;
  }, []);

  const content = (
    <div className={contentClassName}>
      {rowCards.map((row) => (
        <div
          key={`row-${count}-${row.rowIndex}`}
          className={rowClassName}
        >
          {row.cards.map((card, cardIndex) => (
            <CardFrame
              key={`${card.illustration}-${row.rowIndex}-${cardIndex}`}
              card={card}
              answerBadgeBottom={answerBadgeBottom}
              scale={cardScale}
              answerBadgeScale={answerBadgeScale}
              showAnswerBadge={showAnswerBadges}
            />
          ))}
        </div>
      ))}
    </div>
  );

  if (renderContentOnly) {
    return content;
  }

  return (
    <div
      className={className}
      style={{
        left: "40px",
        top: "104px",
        right: "80px",
        bottom: "40px",
      }}
    >
      {content}
    </div>
  );
}

function MultiCardTransition({
  cards,
  count,
  className,
  contentClassName,
  rowClassName,
  renderContentOnly,
  cardScale = 1,
  answerBadgeScale = 1,
  answerBadgeBottom,
  previousCards,
  showAnswerBadges = false,
  transitionRunId,
}: {
  cards: ResolvedCard[];
  count: CardCount;
  className: string;
  contentClassName: string;
  rowClassName: string;
  renderContentOnly: boolean;
  cardScale?: number;
  answerBadgeScale?: number;
  answerBadgeBottom?: string;
  previousCards: ResolvedCard[];
  showAnswerBadges?: boolean;
  transitionRunId: number;
}) {
  const [transitionStage, setTransitionStage] = useState<"to-next" | "to-reverse">(
    "to-reverse",
  );
  const transitionRows = ROW_LAYOUTS[count].reduce<
    {
      cards: ResolvedCard[];
      previousCards: ResolvedCard[];
      rowIndex: number;
    }[]
  >((accumulator, cardsInRow, rowIndex) => {
    const startIndex = accumulator.reduce(
      (total, row) => total + row.cards.length,
      0,
    );

    accumulator.push({
      cards: cards.slice(startIndex, startIndex + cardsInRow),
      previousCards: previousCards.slice(startIndex, startIndex + cardsInRow),
      rowIndex,
    });

    return accumulator;
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setTransitionStage("to-next");
    }, CARD_TRANSITION_PHASE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const content = (
    <div className={contentClassName}>
      {transitionRows.map((row) => {
        return (
          <div
            key={`transition-row-${count}-${row.rowIndex}`}
            className={rowClassName}
          >
            {row.cards.map((card, cardIndex) => (
              <div
                key={`${card.illustration}-${row.rowIndex}-${cardIndex}-${transitionRunId}`}
                className="relative shrink-0"
                style={{
                  height: `${180 * cardScale}px`,
                  width: `${120 * cardScale}px`,
                }}
              >
                {transitionStage === "to-reverse" ? (
                  <div
                    key={`card-to-reverse-${transitionRunId}-${row.rowIndex}-${cardIndex}`}
                    className="card-transition-scene h-full w-full"
                  >
                    <div className="card-transition-rotor card-transition-rotor-flipping">
                      <TransitionFace side="back">
                        <CardFrame
                          card={row.previousCards[cardIndex] ?? card}
                          answerBadgeBottom={answerBadgeBottom}
                          scale={cardScale}
                          answerBadgeScale={answerBadgeScale}
                          showAnswerBadge={showAnswerBadges}
                        />
                      </TransitionFace>
                      <TransitionFace side="front">
                        <ReverseCardFrame />
                      </TransitionFace>
                    </div>
                  </div>
                ) : (
                  <div
                    key={`card-to-next-${transitionRunId}-${row.rowIndex}-${cardIndex}`}
                    className="card-transition-scene h-full w-full"
                  >
                    <div className="card-transition-rotor card-transition-rotor-flipping">
                      <TransitionFace side="back">
                        <ReverseCardFrame />
                      </TransitionFace>
                      <TransitionFace side="front">
                        <CardFrame
                          card={card}
                          answerBadgeBottom={answerBadgeBottom}
                          scale={cardScale}
                          answerBadgeScale={answerBadgeScale}
                          showAnswerBadge={showAnswerBadges}
                        />
                      </TransitionFace>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );

  if (renderContentOnly) {
    return content;
  }

  return (
    <div
      className={className}
      style={{
        left: "40px",
        top: "104px",
        right: "80px",
        bottom: "40px",
      }}
    >
      {content}
    </div>
  );
}
