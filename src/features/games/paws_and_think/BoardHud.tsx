import { SCOREBOARD_RENDER_HEIGHT_PX } from "./boardLayoutConfig";

const hudLabelStyle = {
  fontFamily: '"Hannotate TC", sans-serif',
  fontSize: "17px",
  fontWeight: 700,
  lineHeight: 1,
} as const;

const hudValueStyle = {
  fontFamily: '"Hannotate TC", sans-serif',
  fontSize: "17px",
  fontWeight: 700,
  lineHeight: 1,
} as const;

function HudStat({
  isCompact,
  label,
  value,
}: {
  isCompact: boolean;
  label: string;
  value: number;
}) {
  return (
    <div className={`flex items-center justify-center ${isCompact ? "gap-1.5" : "gap-2.5"}`}>
      <span className="text-white" style={hudLabelStyle}>
        {label}
      </span>
      <span
        className="inline-flex min-w-[54px] items-center justify-center rounded-[7px] bg-[var(--board-light-fill)] px-4 py-3 text-white"
        style={hudValueStyle}
      >
        {value}
      </span>
    </div>
  );
}

export function BoardHud({
  bestTotal,
  isBoardStretched,
  score,
  timeLeft,
}: {
  bestTotal: number;
  isBoardStretched: boolean;
  score: number;
  timeLeft: number;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-30 grid grid-cols-3 items-center px-5"
      style={{ height: `${SCOREBOARD_RENDER_HEIGHT_PX}px` }}
      aria-hidden="true"
    >
      <HudStat isCompact={!isBoardStretched} label="Time:" value={timeLeft} />
      <HudStat isCompact={!isBoardStretched} label="Score:" value={score} />
      <HudStat isCompact={!isBoardStretched} label="Best:" value={bestTotal} />
    </div>
  );
}
