import type { CSSProperties, ReactNode } from "react";

import GameQuickStartSvg from "./assets/game_quick_start.svg?react";
import GameQuickStartLargeSvg from "./assets/game_quick_start_large.svg?react";
import { RawSvgIllustration } from "./illustrations/RawSvgIllustration";

const SMALL_GUIDE = {
  Svg: GameQuickStartSvg,
  viewBox: {
    width: 288,
    height: 431.15,
  },
  bounds: {
    reviewPrevious: { x: 56.97, y: 53.57, width: 82.24, height: 25.33 },
    startNewGame: { x: 163.2, y: 69.36, width: 78.69, height: 25.33 },
    quickStart: { x: 49.94, y: 125.1, width: 185.45, height: 164.92 },
    changeLevel: { x: 171.75, y: 334.86, width: 70.31, height: 25.33 },
    gameRules: { x: 58.09, y: 350.61, width: 64.88, height: 25.33 },
  },
} as const;

const LARGE_GUIDE = {
  Svg: GameQuickStartLargeSvg,
  viewBox: {
    width: 619.71,
    height: 574.08,
  },
  bounds: {
    reviewPrevious: { x: 65.83, y: 72.09, width: 82.24, height: 25.33 },
    startNewGame: { x: 447.14, y: 87.88, width: 78.69, height: 25.33 },
    quickStart: { x: 330.7, y: 193.32, width: 185.45, height: 164.92 },
    changeLevel: { x: 454.46, y: 465.77, width: 70.31, height: 25.33 },
    gameRules: { x: 66.95, y: 481.22, width: 64.88, height: 25.33 },
  },
} as const;

function getBoundsStyle(bounds: {
  x: number;
  y: number;
  width: number;
  height: number;
}, viewBox: {
  width: number;
  height: number;
}): CSSProperties {
  return {
    left: `${(bounds.x / viewBox.width) * 100}%`,
    top: `${(bounds.y / viewBox.height) * 100}%`,
    width: `${(bounds.width / viewBox.width) * 100}%`,
    height: `${(bounds.height / viewBox.height) * 100}%`,
  };
}

function GuideLabel({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className: string;
  style: CSSProperties;
}) {
  return (
    <div
      className={`absolute flex items-center justify-center text-center text-[11px] leading-[1.2] text-[#22304a] ${className}`.trim()}
      style={{ ...style, fontFamily: '"Hannotate TC", sans-serif' }}
    >
      {children}
    </div>
  );
}

export function GameQuickStartGuide({ isLarge = false }: { isLarge?: boolean }) {
  const guide = isLarge ? LARGE_GUIDE : SMALL_GUIDE;

  return (
    <div className="relative h-full w-full">
      <RawSvgIllustration
        Svg={guide.Svg}
        ariaLabel="Quick start guide showing the board controls"
        className="h-full w-full"
        style={{}}
      />

      <div className="pointer-events-none absolute inset-0">
        <GuideLabel
          style={getBoundsStyle(guide.bounds.reviewPrevious, guide.viewBox)}
          className="px-1 text-[10px]"
        >
          Review previous
          <br />
          response
        </GuideLabel>

        <GuideLabel
          style={getBoundsStyle(guide.bounds.startNewGame, guide.viewBox)}
          className="px-1 text-[10px]"
        >
          Start new game
        </GuideLabel>

        <GuideLabel
          style={getBoundsStyle(guide.bounds.changeLevel, guide.viewBox)}
          className="px-1 text-[10px]"
        >
          Change level
        </GuideLabel>

        <GuideLabel
          style={getBoundsStyle(guide.bounds.gameRules, guide.viewBox)}
          className="px-1 text-[10px]"
        >
          Game rules
        </GuideLabel>

        <div
          className="absolute flex flex-col items-center justify-center px-4 text-center text-[#22304a]"
          style={getBoundsStyle(guide.bounds.quickStart, guide.viewBox)}
        >
          <p
            className="max-w-[10.5rem] text-[12px] font-semibold leading-[1.25]"
            style={{ fontFamily: '"Hannotate TC", sans-serif' }}
          >
            Use the tokens on the right to choose the correct answer.
          </p>
          <div
            className="mt-3 max-w-[11rem] space-y-2 text-[11px] leading-[1.3]"
            style={{ fontFamily: '"Hannotate TC", sans-serif' }}
          >
            <p>Match the object whose original color appears on the card.</p>
            <p>If none match, eliminate the shown objects and shown colors.</p>
            <p>The only token left is the answer.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
