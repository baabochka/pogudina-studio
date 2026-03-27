import type { CSSProperties, ReactNode } from "react";

type BubbleName =
  | "changeLevel"
  | "gameRules"
  | "quickStart"
  | "reviewPrevious"
  | "startNewGame";

const SMALL_GUIDE = {
  bubbles: {
    reviewPrevious: { left: 15, top: 15, width: 115, height: 35 },
    startNewGame: { right: 15, top: 15, width: 115, height: 35 },
    quickStart: { right: 10, top: 84, width: 260, height: 270 },
    changeLevel: { right: 15, bottom: 15, width: 90, height: 35 },
    gameRules: { left: 15, bottom: 15, width: 90, height: 35 },
  },
} as const;

const LARGE_GUIDE = {
  bubbles: {
    reviewPrevious: { left: 15, top: 15, width: 115, height: 35 },
    startNewGame: { right: 15, top: 15, width: 115, height: 35 },
    quickStart: { right: 10, top: 96, width: 260, height: 270 },
    changeLevel: { right: 15, bottom: 15, width: 90, height: 35 },
    gameRules: { left: 15, bottom: 15, width: 90, height: 35 },
  },
} as const;

type BubbleBounds = {
  width: number;
  height: number;
  bottom?: number;
  left?: number;
  right?: number;
  top?: number;
};

function getBoundsStyle(bounds: BubbleBounds): CSSProperties {
  return {
    ...(bounds.left != null ? { left: `${bounds.left}px` } : null),
    ...(bounds.right != null ? { right: `${bounds.right}px` } : null),
    ...(bounds.top != null ? { top: `${bounds.top}px` } : null),
    ...(bounds.bottom != null ? { bottom: `${bounds.bottom}px` } : null),
    width: `${bounds.width}px`,
    height: `${bounds.height}px`,
  };
}

function HintBubble({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style: CSSProperties;
}) {
  return (
    <div
      className={[
        "absolute flex items-center justify-center rounded-[16px]",
        "border border-[#38272c] bg-[#d3bebe]/88 px-3 py-2 text-center text-[#22304a]",
        "shadow-[0_8px_18px_rgba(56,39,44,0.18)] backdrop-blur-[1px]",
        className ?? "",
      ].join(" ")}
      style={style}
    >
      {children}
    </div>
  );
}

function GuideAction({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick?: () => void;
}) {
  if (!onClick) {
    return <>{children}</>;
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="pointer-events-auto inline-flex h-full w-full items-center justify-center rounded-[16px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22304a] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
    >
      {children}
    </button>
  );
}

export function GameQuickStartGuide({
  isLarge = false,
  onOpenRules,
  onStart,
  visibleBubbles,
}: {
  isLarge?: boolean;
  onOpenRules?: () => void;
  onStart?: () => void;
  visibleBubbles?: Partial<Record<BubbleName, boolean>>;
}) {
  const guide = isLarge ? LARGE_GUIDE : SMALL_GUIDE;
  const isVisible = (bubbleName: BubbleName) => visibleBubbles?.[bubbleName] ?? true;
  const bodyParagraphs = isLarge
    ? [
        "Solve each card using the one-card rules.",
        "Pick the token that repeats twice across the cards.",
      ]
    : [
        "Match the object whose original color appears on the card.",
        "If nothing matches, eliminate the shown objects and the shown colors.",
        "The only token left is the answer.",
      ];

  return (
    <section
      className="absolute inset-0 pointer-events-none"
      aria-label="Quick start guide"
    >
      {isVisible("reviewPrevious") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.reviewPrevious)}
          className="px-4 text-[11px] leading-[1.1]"
        >
          <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>
            Review previous
            <br />
            response
          </p>
        </HintBubble>
      ) : null}

      {isVisible("startNewGame") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.startNewGame)}
          className="px-4 text-[11px] leading-[1.1]"
        >
          <GuideAction onClick={onStart}>
            <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>Start new game</p>
          </GuideAction>
        </HintBubble>
      ) : null}

      {isVisible("changeLevel") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.changeLevel)}
          className="px-3 text-[11px] leading-[1.1]"
        >
          <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>Change level</p>
        </HintBubble>
      ) : null}

      {isVisible("gameRules") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.gameRules)}
          className="px-3 text-[11px] leading-[1.1]"
        >
          <GuideAction onClick={onOpenRules}>
            <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>Game rules</p>
          </GuideAction>
        </HintBubble>
      ) : null}

      {isVisible("quickStart") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.quickStart)}
          className="flex-col px-5 py-6"
        >
          <div
            className="flex h-full flex-col items-center justify-center"
            style={{ fontFamily: '"Hannotate TC", sans-serif' }}
          >
            <p className="max-w-[13rem] text-[14px] font-semibold leading-[1.25]">
              Use the tokens on the right to choose the correct answer.
            </p>
            <div className="mt-4 max-w-[13rem] space-y-3 text-[13px] leading-[1.3]">
              {bodyParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <button
              type="button"
              onClick={onStart}
              className="pointer-events-auto mt-5 rounded-full border border-[#38272c] bg-[#fff7f2] px-5 py-2 text-[12px] font-semibold text-[#22304a] shadow-[0_2px_0_rgba(56,39,44,0.14)] transition-transform duration-150 hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22304a] focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              Start playing
            </button>
          </div>
        </HintBubble>
      ) : null}
    </section>
  );
}
