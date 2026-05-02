import { useEffect, useRef, type CSSProperties } from "react";

import correctAnswerPawUrl from "./assets/correct_answer_paw.svg";
import mouseHeadUrl from "./assets/mouse_head.svg";
import mouseLooksUpUrl from "./assets/mouse_looks_up.png";
import mouseStandingUrl from "./assets/mouse_standing.png";
import PathRevealShaftSvg from "./assets/path_reveal_shaft.svg?react";
import PathRevealSpearSvg from "./assets/path_reveal_spear.svg?react";
import wrongAnswerPawUrl from "./assets/wrong_answer_paw.svg";
import {
  getCellAtCoordinate,
  getItemAtCoordinate,
  isSameCoordinate,
} from "./boardUtils";
import { formatDisplayCoordinate } from "./coordinateUtils";
import { HideSqueakItemAsset } from "./itemAssets";
import type {
  HideSqueakCommandStep,
  HideSqueakCoordinate,
  HideSqueakGeneratedRound,
  HideSqueakValidationResult,
} from "./types";

function getColumnLabel(column: number) {
  return formatDisplayCoordinate({ row: 1, column }).replace(/\d+$/, "");
}

function getItemLabel(itemKind: string) {
  return itemKind.replace(/-/g, " ");
}

function getMouseUrl(pose: "looking-up" | "standing" | "head") {
  if (pose === "head") {
    return mouseHeadUrl;
  }

  return pose === "standing" ? mouseStandingUrl : mouseLooksUpUrl;
}

function getCellCenterPercent(
  coordinate: HideSqueakCoordinate,
  columns: number,
  rows: number,
) {
  return {
    x: ((coordinate.column - 0.5) / columns) * 100,
    y: ((coordinate.row - 0.5) / rows) * 100,
  };
}

type HideSqueakPawTrailStep = {
  key: string;
  left: string;
  top: string;
  rotation: string;
  delay: string;
};

function getHideSqueakPawTrailStepCount(
  from: HideSqueakCoordinate,
  to: HideSqueakCoordinate,
) {
  const manhattanDistance =
    Math.abs(to.row - from.row) + Math.abs(to.column - from.column);

  return Math.min(Math.max(manhattanDistance, 2), 5);
}

function createHideSqueakPawTrailSteps(
  from: { x: number; y: number },
  to: { x: number; y: number },
  count: number,
): HideSqueakPawTrailStep[] {
  const verticalDistance = Math.abs(to.y - from.y);
  const controlX = (from.x + to.x) / 2 - (18 + verticalDistance * 0.18);
  const controlY = (from.y + to.y) / 2 + (to.y - from.y) * 0.18;

  return Array.from({ length: count }, (_, index) => {
    const t = (index + 1) / (count + 1);
    const invT = 1 - t;
    const x = invT * invT * from.x + 2 * invT * t * controlX + t * t * to.x;
    const y = invT * invT * from.y + 2 * invT * t * controlY + t * t * to.y;

    const tangentX = 2 * invT * (controlX - from.x) + 2 * t * (to.x - controlX);
    const tangentY = 2 * invT * (controlY - from.y) + 2 * t * (to.y - controlY);
    const rotation = `${(Math.atan2(tangentY, tangentX) * 180) / Math.PI + 90}deg`;

    return {
      key: `hide-squeak-paw-step-${index}`,
      left: `${x}%`,
      top: `${y}%`,
      rotation,
      delay: `${index * 180}ms`,
    };
  });
}

function getHideSqueakPawTrailStyle(
  step: HideSqueakPawTrailStep,
): CSSProperties {
  return {
    left: step.left,
    top: step.top,
    animationDelay: step.delay,
    "--hs-paw-step-rotation": step.rotation,
  } as CSSProperties;
}

function getBoardPathRevealOpacity(stepsBack: number, totalVisibleSteps: number) {
  if (totalVisibleSteps <= 1) {
    return 1;
  }

  const maxStepsBack = totalVisibleSteps - 1;
  const opacityRange = 1 - 0.3;

  return Math.max(0.3, 1 - (stepsBack / maxStepsBack) * opacityRange);
}

function BoardPathOverlay({
  steps,
  rows,
  columns,
}: {
  steps: HideSqueakCommandStep[];
  rows: number;
  columns: number;
}) {
  if (steps.length === 0) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[4]"
      aria-hidden="true"
    >
      {steps.map((step, visibleIndex) => {
        const from = getCellCenterPercent(step.from, columns, rows);
        const to = getCellCenterPercent(step.to, columns, rows);
        const deltaX = to.x - from.x;
        const deltaY = to.y - from.y;
        const distance = Math.hypot(deltaX, deltaY);
        const rotation = (Math.atan2(deltaY, deltaX) * 180) / Math.PI + 90;
        const stepsBack = steps.length - 1 - visibleIndex;
        const revealOpacity = getBoardPathRevealOpacity(stepsBack, steps.length);
        const isLatestVisibleStep = visibleIndex === steps.length - 1;
        const shaftClassName = isLatestVisibleStep
          ? "absolute left-1/2 top-[12px] h-[calc(100%-18px)] w-[6px] -translate-x-1/2"
          : "absolute left-1/2 top-[8px] h-[calc(100%-15px)] w-[6px] -translate-x-1/2";

        return (
          <div
            key={`path-reveal-${step.index}-${step.command.direction}-${step.command.steps}`}
            className="absolute overflow-visible text-hs-textPrimary"
            style={{
              left: `${from.x}%`,
              top: `${from.y}%`,
              width: "15px",
              height: `${distance}%`,
              minHeight: "15px",
              transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
              transformOrigin: "center bottom",
            }}
          >
            <PathRevealShaftSvg
              focusable="false"
              className={shaftClassName}
              style={{ opacity: revealOpacity }}
            />
            {isLatestVisibleStep ? (
              <PathRevealSpearSvg
                focusable="false"
                className="absolute left-1/2 top-[10px] h-[8px] w-[15px] -translate-x-1/2"
                style={{ opacity: revealOpacity }}
              />
            ) : (
              <div
                className="absolute left-1/2 top-0 h-[8px] w-[8px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-current"
                style={{ opacity: revealOpacity }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function HideSqueakBoardSurface({
  round,
  showMouse = false,
  visibleMouseCoordinate = null,
  pathSteps = [],
  activeCoordinate,
  selectedCoordinate = null,
  validationResult = "idle",
  isInteractive = false,
  correctAnswerCoordinate = null,
  wrongAnswerCoordinate = null,
  showStartLabel = true,
  mousePose = "looking-up",
  isReviewMode = false,
  isRulesMode = false,
  isMobileLayout = false,
  isCompactMobileChrome = false,
  onActiveCoordinateChange,
  onCellSelect,
}: {
  round: HideSqueakGeneratedRound;
  showMouse?: boolean;
  visibleMouseCoordinate?: HideSqueakCoordinate | null;
  pathSteps?: HideSqueakCommandStep[];
  activeCoordinate: HideSqueakCoordinate | null;
  selectedCoordinate?: HideSqueakCoordinate | null;
  validationResult?: HideSqueakValidationResult;
  isInteractive?: boolean;
  correctAnswerCoordinate?: HideSqueakCoordinate | null;
  wrongAnswerCoordinate?: HideSqueakCoordinate | null;
  showStartLabel?: boolean;
  mousePose?: "looking-up" | "standing" | "head";
  isReviewMode?: boolean;
  isRulesMode?: boolean;
  isMobileLayout?: boolean;
  isCompactMobileChrome?: boolean;
  onActiveCoordinateChange?: (coordinate: HideSqueakCoordinate) => void;
  onCellSelect?: (coordinate: HideSqueakCoordinate) => void;
}) {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const columns = Array.from(
    { length: round.board.size.columns },
    (_, index) => index + 1,
  );
  const rows = Array.from(
    { length: round.board.size.rows },
    (_, index) => index + 1,
  );
  const mouseUrl = getMouseUrl(mousePose);
  const shouldShowAnimatedCorrectAnswer =
    validationResult === "wrong" &&
    wrongAnswerCoordinate != null &&
    correctAnswerCoordinate != null;
  const correctAnswerCenter =
    shouldShowAnimatedCorrectAnswer && correctAnswerCoordinate
      ? getCellCenterPercent(
          correctAnswerCoordinate,
          round.board.size.columns,
          round.board.size.rows,
        )
      : null;
  const wrongAnswerCenter =
    shouldShowAnimatedCorrectAnswer && wrongAnswerCoordinate
      ? getCellCenterPercent(
          wrongAnswerCoordinate,
          round.board.size.columns,
          round.board.size.rows,
        )
      : null;
  const pawTrailStepCount =
    shouldShowAnimatedCorrectAnswer &&
    wrongAnswerCoordinate &&
    correctAnswerCoordinate
      ? getHideSqueakPawTrailStepCount(
          wrongAnswerCoordinate,
          correctAnswerCoordinate,
        )
      : 0;
  const coordinateGutterPx = isMobileLayout ? (isCompactMobileChrome ? 21 : 25) : 31;
  const rowCoordinateClassName = isMobileLayout
    ? isCompactMobileChrome
      ? "font-game grid pb-1 text-[1rem] font-semibold leading-none text-hs-coordinate"
      : "font-game grid pb-1 text-[1.12rem] font-semibold leading-none text-hs-coordinate"
    : "font-game grid pb-1 text-[1.45rem] font-semibold leading-none text-hs-coordinate";
  const columnCoordinateClassName = isMobileLayout
    ? isCompactMobileChrome
      ? "font-game grid w-full min-w-0 text-[1rem] font-semibold uppercase leading-none text-hs-coordinate"
      : "font-game grid w-full min-w-0 text-[1.12rem] font-semibold uppercase leading-none text-hs-coordinate"
    : "font-game grid w-full min-w-0 text-[1.45rem] font-semibold uppercase leading-none text-hs-coordinate";
  const pawTrailSteps =
    wrongAnswerCenter && correctAnswerCenter
      ? createHideSqueakPawTrailSteps(
          wrongAnswerCenter,
          correctAnswerCenter,
          pawTrailStepCount,
        )
      : [];
  const targetPawDelay =
    pawTrailSteps.length > 0 ? `${pawTrailSteps.length * 180 + 220}ms` : "0ms";
  const wrongAnswerPawClassName = isCompactMobileChrome
    ? "pointer-events-none absolute z-[4] h-[44%] w-[44%] object-contain"
    : "pointer-events-none absolute z-[4] h-[54%] w-[54%] object-contain";
  const correctAnswerPawClassName = isCompactMobileChrome
    ? "pointer-events-none absolute z-[4] h-[38%] w-[38%] object-contain"
    : "pointer-events-none absolute z-[4] h-[44%] w-[44%] object-contain";
  const revealedAnswerPawClassName = isCompactMobileChrome
    ? "pointer-events-none absolute z-[4] h-[28%] w-[28%] object-contain"
    : "pointer-events-none absolute z-[4] h-[34%] w-[34%] object-contain";

  useEffect(() => {
    if (!activeCoordinate) {
      return;
    }

    const button =
      buttonRefs.current[formatDisplayCoordinate(activeCoordinate)];

    if (button && document.activeElement !== button) {
      button.focus();
    }
  }, [activeCoordinate, round.id]);

  function moveActiveCoordinate(
    currentCoordinate: HideSqueakCoordinate,
    nextRow: number,
    nextColumn: number,
  ) {
    const boundedCoordinate = {
      row: Math.min(Math.max(nextRow, 1), round.board.size.rows),
      column: Math.min(Math.max(nextColumn, 1), round.board.size.columns),
    };

    if (
      boundedCoordinate.row !== currentCoordinate.row ||
      boundedCoordinate.column !== currentCoordinate.column
    ) {
      onActiveCoordinateChange?.(boundedCoordinate);
    }
  }

  return (
    <div className="w-full min-w-0 max-w-full space-y-1">
      <div
        className="grid w-full min-w-0 max-w-full items-stretch gap-1"
        style={{ gridTemplateColumns: `${coordinateGutterPx}px minmax(0, 1fr)` }}
      >
        <div
          className={rowCoordinateClassName}
          style={{ gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))` }}
          aria-hidden="true"
        >
          {rows.map((row) => (
            <div
              key={`row-${row}`}
              className="flex items-center justify-center"
            >
              {row}
            </div>
          ))}
        </div>

        <div
          className={[
            "relative w-full min-w-0 max-w-full aspect-square rounded-[18px] border-[4px] border-hs-boardBorder bg-hs-board shadow-hs-soft",
            isMobileLayout ? "overflow-hidden" : "",
          ].join(" ")}
        >
          <BoardPathOverlay
            steps={pathSteps}
            rows={round.board.size.rows}
            columns={round.board.size.columns}
          />
          {shouldShowAnimatedCorrectAnswer && correctAnswerCenter ? (
            <div
              className="pointer-events-none absolute inset-0 z-[5]"
              aria-hidden="true"
            >
              {pawTrailSteps.map((step) => (
                <img
                  key={step.key}
                  src={correctAnswerPawUrl}
                  alt=""
                  className={[
                    "hsHideSqueakPawTrail absolute object-contain",
                    isCompactMobileChrome ? "h-9 w-9" : "h-12 w-12",
                  ].join(" ")}
                  style={getHideSqueakPawTrailStyle(step)}
                />
              ))}

              <img
                src={correctAnswerPawUrl}
                alt=""
                className={[
                  "hsHideSqueakPawTarget absolute object-contain",
                  isCompactMobileChrome ? "h-6 w-6" : "h-8 w-8",
                ].join(" ")}
                style={{
                  left: `${correctAnswerCenter.x}%`,
                  top: `${correctAnswerCenter.y}%`,
                  animationDelay: targetPawDelay,
                }}
              />
            </div>
          ) : null}
          <div
            className="grid h-full w-full overflow-hidden rounded-[14px]"
            style={{
              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${rows.length}, minmax(0, 1fr))`,
            }}
          >
            {rows.flatMap((row) =>
              columns.map((column) => {
                const coordinate = { row, column };
                const cell = getCellAtCoordinate(round.board, coordinate);
                const item = getItemAtCoordinate(round.board, coordinate);
                const isStart = isSameCoordinate(
                  coordinate,
                  round.startingCoordinate,
                );
                const isVisibleMouse =
                  visibleMouseCoordinate != null &&
                  isSameCoordinate(coordinate, visibleMouseCoordinate);
                const isActive = activeCoordinate
                  ? isSameCoordinate(coordinate, activeCoordinate)
                  : false;
                const shouldSuppressStartHighlight =
                  isStart &&
                  (isRulesMode ||
                    (!isReviewMode &&
                      (round.difficulty === "hard" ||
                        round.difficulty === "super-hard")));
                const isSelected = selectedCoordinate
                  ? isSameCoordinate(coordinate, selectedCoordinate)
                  : false;
                const isCorrectAnswer =
                  correctAnswerCoordinate != null &&
                  isSameCoordinate(coordinate, correctAnswerCoordinate);
                const isWrongAnswer =
                  wrongAnswerCoordinate != null &&
                  isSameCoordinate(coordinate, wrongAnswerCoordinate);
                const showMouseToken =
                  isVisibleMouse ||
                  (showMouse &&
                    isStart &&
                    !visibleMouseCoordinate &&
                    !isRulesMode);
                const interactiveLabel = `${formatDisplayCoordinate(coordinate)}${
                  item ? `, ${getItemLabel(item.kind)}` : ""
                }${isStart ? ", start" : ""}${showMouseToken ? ", mouse visible" : ""}`;
                const shouldShowCorrectHighlight =
                  validationResult === "correct"
                    ? isSelected
                    : validationResult === "wrong" ||
                        validationResult === "revealed"
                      ? isCorrectAnswer
                      : false;

                return (
                  <button
                    key={`${row}-${column}`}
                    ref={(element) => {
                      buttonRefs.current[formatDisplayCoordinate(coordinate)] =
                        element;
                    }}
                    type="button"
                    disabled={!isInteractive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => onCellSelect?.(coordinate)}
                    onFocus={() => onActiveCoordinateChange?.(coordinate)}
                    onKeyDown={(event) => {
                      switch (event.key) {
                        case "ArrowUp":
                          event.preventDefault();
                          moveActiveCoordinate(coordinate, row - 1, column);
                          break;
                        case "ArrowRight":
                          event.preventDefault();
                          moveActiveCoordinate(coordinate, row, column + 1);
                          break;
                        case "ArrowDown":
                          event.preventDefault();
                          moveActiveCoordinate(coordinate, row + 1, column);
                          break;
                        case "ArrowLeft":
                          event.preventDefault();
                          moveActiveCoordinate(coordinate, row, column - 1);
                          break;
                        case " ":
                        case "Enter":
                          event.preventDefault();
                          onCellSelect?.(coordinate);
                          break;
                      }
                    }}
                    aria-label={interactiveLabel}
                    className={[
                      // Keep board-cell focus styling minimal for now; revisit a dedicated rounded focus ring later.
                      "relative flex aspect-square items-center justify-center overflow-hidden bg-hs-board transition duration-150 focus-visible:z-10 focus-visible:outline-none disabled:cursor-default",
                      isInteractive ? "hover:bg-hs-highlightSoft" : "",
                      shouldShowCorrectHighlight ? "bg-hs-highlight" : "",
                      isWrongAnswer ? "bg-hs-wrong/30" : "",
                      isActive && !shouldSuppressStartHighlight
                        ? "before:pointer-events-none before:absolute before:inset-[4px] before:rounded-[10px] before:shadow-[inset_0_0_0_4px_color-mix(in_srgb,var(--hs-control)_55%,transparent)]"
                        : "",
                    ].join(" ")}
                    style={{
                      borderTop:
                        row > 1
                          ? "2px solid color-mix(in srgb, var(--hs-grid) 68%, transparent)"
                          : undefined,
                      borderLeft:
                        column > 1
                          ? "2px solid color-mix(in srgb, var(--hs-grid) 68%, transparent)"
                          : undefined,
                    }}
                  >
                    {showStartLabel ? (
                      isStart ? (
                        <span
                          className={[
                            "font-game pointer-events-none absolute z-[6] font-semibold leading-none text-hs-textPrimary",
                            mousePose === "standing"
                              ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[10px] border-[2px] border-[color:color-mix(in_srgb,var(--hs-textPrimary)_55%,white)] bg-hs-board px-2 py-1 text-[1rem]"
                              : "top-[7%] text-[clamp(1.2rem,2vw,2.02rem)]",
                          ].join(" ")}
                        >
                          Start
                        </span>
                      ) : null
                    ) : null}

                    {item ? (
                      <HideSqueakItemAsset
                        item={item}
                        aria-hidden="true"
                        className={[
                          "pointer-events-none relative z-[2] h-[70%] w-[70%]",
                          isReviewMode ? "opacity-65" : "",
                          showMouseToken
                            ? "translate-x-[13%] translate-y-[13%]"
                            : "",
                        ].join(" ")}
                      />
                    ) : null}

                    {showMouseToken ? (
                      <img
                        src={mouseUrl}
                        alt=""
                        aria-hidden="true"
                        className={[
                          "pointer-events-none absolute z-[4] object-contain",
                          mousePose === "head"
                            ? item
                              ? "h-[48%] w-[48%] translate-y-[calc(11%+10px)]"
                              : "h-[53%] w-[53%] translate-y-[5px]"
                            : item
                              ? "h-[54%] w-[54%] -translate-y-[2%]"
                              : "h-[64%] w-[64%]",
                        ].join(" ")}
                      />
                    ) : null}

                    {isWrongAnswer ? (
                      <img
                        src={wrongAnswerPawUrl}
                        alt=""
                        aria-hidden="true"
                        className={wrongAnswerPawClassName}
                      />
                    ) : null}

                    {isCorrectAnswer && !shouldShowAnimatedCorrectAnswer ? (
                      <img
                        src={correctAnswerPawUrl}
                        alt=""
                        aria-hidden="true"
                        className={
                          validationResult === "revealed"
                            ? revealedAnswerPawClassName
                            : correctAnswerPawClassName
                        }
                      />
                    ) : null}

                    {cell?.kind === "empty" && isInteractive ? (
                      <span className="sr-only">
                        {formatDisplayCoordinate(coordinate)}
                      </span>
                    ) : null}
                  </button>
                );
              }),
            )}
          </div>
        </div>
      </div>

      <div
        className="grid w-full min-w-0 max-w-full items-center gap-1"
        style={{ gridTemplateColumns: `${coordinateGutterPx}px minmax(0, 1fr)` }}
        aria-hidden="true"
      >
        <div />
        <div
          className={columnCoordinateClassName}
          style={{
            gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
          }}
        >
          {columns.map((column) => (
            <div
              key={`column-${column}`}
              className="flex items-center justify-center"
            >
              {getColumnLabel(column)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
