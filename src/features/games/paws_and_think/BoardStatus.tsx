import { SCOREBOARD_RENDER_HEIGHT_PX } from "./boardLayoutConfig";

const statusLabelStyle = {
  fontFamily: '"Hannotate TC", sans-serif',
  fontSize: "17px",
  fontWeight: 700,
  lineHeight: 1,
} as const;

const statusValueStyle = {
  fontFamily: '"Hannotate TC", sans-serif',
  fontSize: "17px",
  fontWeight: 700,
  lineHeight: 1,
} as const;

function StatusStat({
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
      <span className="text-white" style={statusLabelStyle}>
        {label}
      </span>
      <span
        className="inline-flex min-w-[54px] items-center justify-center rounded-[7px] bg-[var(--board-light-fill)] px-4 py-3 text-white"
        style={statusValueStyle}
      >
        {value}
      </span>
    </div>
  );
}

export function BoardStatus({
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
      className="pointer-events-none absolute inset-x-0 top-0 z-30 grid grid-cols-3 items-center rounded-t-[10px] px-5"
      style={{
        height: `${SCOREBOARD_RENDER_HEIGHT_PX}px`,
        background: "var(--board-dark-fill)",
        borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
      }}
      aria-hidden="true"
    >
      <StatusStat isCompact={!isBoardStretched} label="Time:" value={timeLeft} />
      <StatusStat isCompact={!isBoardStretched} label="Score:" value={score} />
      <StatusStat isCompact={!isBoardStretched} label="Best:" value={bestTotal} />
    </div>
  );
}
