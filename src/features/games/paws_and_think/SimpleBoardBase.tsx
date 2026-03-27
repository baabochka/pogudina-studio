import { BoardStatus } from "./BoardStatus";
import { SCOREBOARD_RENDER_HEIGHT_PX } from "./boardLayoutConfig";
import { BOARD_PANEL_INSETS } from "./boardPanelLayout";

export function SimpleBoardBase({
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
    <>
      <BoardStatus
        bestTotal={bestTotal}
        isBoardStretched={isBoardStretched}
        score={score}
        timeLeft={timeLeft}
      />

      <div
        className="absolute inset-x-0 bottom-0 z-0"
        style={{
          top: `${SCOREBOARD_RENDER_HEIGHT_PX}px`,
          background: "var(--board-light-fill)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute z-0"
        style={{
          left: `${BOARD_PANEL_INSETS.left}px`,
          top: `${SCOREBOARD_RENDER_HEIGHT_PX + BOARD_PANEL_INSETS.top}px`,
          right: `${BOARD_PANEL_INSETS.right}px`,
          bottom: `${BOARD_PANEL_INSETS.bottom}px`,
        }}
        aria-hidden="true"
      >
        <div className="h-full w-full rounded-[44px] bg-white" />
      </div>
    </>
  );
}
