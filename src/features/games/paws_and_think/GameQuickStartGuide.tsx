import type { CSSProperties, ReactNode } from "react";
import {
  type GuideBubbleBounds as BubbleBounds,
  type GuideBubbleName as BubbleName,
  QUICK_START_GUIDE_LAYOUT,
} from "./boardConfig";
import {
  QUICK_START_BODY_PARAGRAPHS,
  QUICK_START_BUBBLE_LABELS,
  QUICK_START_HEADING,
} from "./boardContent";

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
  const guide = isLarge ? QUICK_START_GUIDE_LAYOUT.large : QUICK_START_GUIDE_LAYOUT.small;
  const isVisible = (bubbleName: BubbleName) => visibleBubbles?.[bubbleName] ?? true;
  const bodyParagraphs = isLarge
    ? QUICK_START_BODY_PARAGRAPHS.large
    : QUICK_START_BODY_PARAGRAPHS.small;

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
            {QUICK_START_BUBBLE_LABELS.reviewPrevious.split("\n").map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </p>
        </HintBubble>
      ) : null}

      {isVisible("startNewGame") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.startNewGame)}
          className="px-4 text-[11px] leading-[1.1]"
        >
          <GuideAction onClick={onStart}>
            <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>
              {QUICK_START_BUBBLE_LABELS.startNewGame}
            </p>
          </GuideAction>
        </HintBubble>
      ) : null}

      {isVisible("changeLevel") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.changeLevel)}
          className="px-3 text-[11px] leading-[1.1]"
        >
          <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>
            {QUICK_START_BUBBLE_LABELS.changeLevel}
          </p>
        </HintBubble>
      ) : null}

      {isVisible("gameRules") ? (
        <HintBubble
          style={getBoundsStyle(guide.bubbles.gameRules)}
          className="px-3 text-[11px] leading-[1.1]"
        >
          <GuideAction onClick={onOpenRules}>
            <p style={{ fontFamily: '"Hannotate TC", sans-serif' }}>
              {QUICK_START_BUBBLE_LABELS.gameRules}
            </p>
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
              {QUICK_START_HEADING}
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
