import { SCOREBOARD_RENDER_HEIGHT_PX } from "./boardLayoutConfig";

const FRAME_DIMENSIONS = {
  bottomHeight: 41.6,
  bottomInset: 0,
  leftWidth: 35.75,
  rightWidth: 76.85,
  sideBottomInset: 64,
  sideTopInset: 128,
  topHeight: 41.35,
  topInset: 64,
  horizontalLeftInset: 92,
  horizontalRightInset: 146,
} as const;

export function BoardFrame() {
  return (
    <>
      <div
        className="absolute transition-[left,top,width,height] duration-280 ease-out"
        style={{
          left: 0,
          right: 0,
          top: 0,
          height: `${SCOREBOARD_RENDER_HEIGHT_PX}px`,
          background: "var(--board-dark-fill)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      />
      <div
        className="absolute transition-[left,right,top,bottom,width,height] duration-280 ease-out"
        style={{
          left: `${FRAME_DIMENSIONS.horizontalLeftInset}px`,
          right: `${FRAME_DIMENSIONS.horizontalRightInset}px`,
          top: `${FRAME_DIMENSIONS.topInset}px`,
          height: `${FRAME_DIMENSIONS.topHeight}px`,
          background: "var(--board-light-fill)",
        }}
      />
      <div
        className="absolute transition-[left,right,top,bottom,width,height] duration-280 ease-out"
        style={{
          left: `${FRAME_DIMENSIONS.horizontalLeftInset}px`,
          right: `${FRAME_DIMENSIONS.horizontalRightInset}px`,
          bottom: `${FRAME_DIMENSIONS.bottomInset}px`,
          height: `${FRAME_DIMENSIONS.bottomHeight}px`,
          background: "var(--board-light-fill)",
        }}
      />
      <div
        className="absolute transition-[left,right,top,bottom,width,height] duration-280 ease-out"
        style={{
          left: 0,
          top: `${FRAME_DIMENSIONS.sideTopInset}px`,
          bottom: `${FRAME_DIMENSIONS.sideBottomInset}px`,
          width: `${FRAME_DIMENSIONS.leftWidth}px`,
          background: "var(--board-light-fill)",
        }}
      />
      <div
        className="absolute transition-[left,right,top,bottom,width,height] duration-280 ease-out"
        style={{
          right: 0,
          top: `${FRAME_DIMENSIONS.sideTopInset}px`,
          bottom: `${FRAME_DIMENSIONS.sideBottomInset}px`,
          width: `${FRAME_DIMENSIONS.rightWidth}px`,
          background: "var(--board-light-fill)",
        }}
      />
    </>
  );
}
