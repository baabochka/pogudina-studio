import {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import type {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  PointerEvent as ReactPointerEvent,
  Ref,
} from "react";

import cheeseDragUrl from "./assets/cheese_drag.svg";
import difficultyLadderUrl from "./assets/difficulty_ladder.svg";
import moreInfoUrl from "./assets/more_info.svg";
import { DirectionsBubble } from "./DirectionsBubble";
import MouseGoingUpDownSvg from "./assets/mouse_going_up_down.svg?react";
import MouseRotationMiddleSvg from "./assets/mouse_rotation_middle.svg?react";
import MouseRotationStartSvg from "./assets/mouse_rotation_start.svg?react";
import MouseRotationTowardLeftSvg from "./assets/mouse_rotation_toward_left.svg?react";
import MouseRotationTowardRightSvg from "./assets/mouse_rotation_toward_right.svg?react";
import MouseRunningSvg from "./assets/mouse_running.svg?react";
import MouseStandingSvg from "./assets/mouse_standing.svg?react";
import PinBoardSvg from "./assets/pin_board.svg?react";
import PinnedBoardSvg from "./assets/pinned_board.svg?react";
import ReviewPreviousSvg from "./assets/review_previous.svg?react";
import restartGameSameBoardUrl from "./assets/restart_game_same_board.svg";
import restartGameUrl from "./assets/restart_game.svg";
import SettingsSvg from "./assets/settings.svg?react";
import {
  applyAnswerModelToRound,
  validateTypedCoordinateAnswer,
} from "./answerGeneration";
import { HIDE_SQUEAK_BOARD_CONSTRAINTS } from "./boardConstraints";
import { generateBoardLayout } from "./boardGeneration";
import { HIDE_SQUEAK_DIFFICULTY_PRESETS } from "./difficultyPresets";
import { HideSqueakAnswerPanel } from "./HideSqueakAnswerPanel";
import { HideSqueakBoardSurface } from "./HideSqueakBoardSurface";
import { HideSqueakCommandPanel } from "./HideSqueakCommandPanel";
import { HideSqueakReviewPanel } from "./HideSqueakReviewPanel";
import { generatePuzzleRound } from "./roundGeneration";
import {
  createHideSqueakSessionState,
  reduceHideSqueakSessionState,
} from "./sessionState";
import type {
  HideSqueakBoardDefinition,
  HideSqueakBoardSize,
  HideSqueakCoordinate,
  HideSqueakDifficulty,
  HideSqueakItem,
  HideSqueakPreviousRoundSnapshot,
} from "./types";

const NEXT_ROUND_DELAY_MS = 1200;
const NEXT_ROUND_DELAY_AFTER_WRONG_MS = 1800;
const TIMER_TICK_INTERVAL_MS = 250;
const HIDE_SQUEAK_BEST_TIMED_SCORE_KEY = "hide-squeak-best-timed-score";
const DIFFICULTY_LADDER_ORDER: HideSqueakDifficulty[] = [
  "super-hard",
  "hard",
  "medium",
  "easy",
];
const ICON_CONTROL_CLASS_NAME =
  "flex h-11 w-11 items-center justify-center rounded-full bg-transparent shadow-none transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2";
const ICON_CONTROL_INTERACTION_CLASS_NAME =
  "hover:opacity-90 active:opacity-75";
const TOGGLE_SHELL_CLASS_NAME =
  "inline-flex w-fit rounded-[18px] border-[3px] border-hs-textSecondary bg-hs-highlight p-0.5 shadow-hs-soft";
const TOGGLE_BUTTON_CLASS_NAME =
  "font-game rounded-[18px] px-3 py-1.5 text-[1rem] leading-none shadow-none transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel";
const GAME_CHROME_RADIUS_CLASS_NAME = "rounded-[22px]";
const GAME_CHROME_TOP_RADIUS_CLASS_NAME = "rounded-t-[22px]";
const SETTINGS_SECTION_LABEL_CLASS_NAME =
  "font-game text-[1.12rem] font-semibold leading-none tracking-[0.01em] text-hs-textStrong";
const DIFFICULTY_ROW_HEIGHT_PX = 52;
const DIFFICULTY_ROW_GAP_PX = 6;
const DIFFICULTY_MOUSE_SIZE = {
  height: 54,
  width: 40,
} as const;
const DIFFICULTY_LADDER_LEFT_PX = 8;
const DIFFICULTY_LADDER_WIDTH_PX = 30;
const DIFFICULTY_MOUSE_LEFT_PX = 4;
const DIFFICULTY_MOUSE_TOP_OFFSET_PX = -1;
const DIFFICULTY_MOUSE_IDLE_UP_TOP_ADJUSTMENT_PX = 10;
const DIFFICULTY_MOUSE_IDLE_BOTTOM_RIGHT_TOP_PX = 180;
const DIFFICULTY_MOUSE_IDLE_BOTTOM_RIGHT_FINAL_TOP_PX = 178;
const DIFFICULTY_MOUSE_CHEESE_ABOVE_OFFSET_PX = 30;
const DIFFICULTY_MOUSE_CHEESE_BELOW_OFFSET_PX = 65;
const DIFFICULTY_MOUSE_CHEESE_SIZE_PX = 20;
const DIFFICULTY_ROW_PADDING_LEFT_PX = 62;
const DIFFICULTY_ROW_HIGHLIGHT_LEFT_PX = 46;
const DIFFICULTY_MOVE_DURATION_PER_STEP_MS = 200;
const DIFFICULTY_TURN_FRAME_DURATION_MS = 85;
const DIFFICULTY_TURN_SETTLE_PAUSE_MS = 50;
const DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS = 90;
const DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS =
  DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS;
const DIFFICULTY_PRE_MOVE_UP_TURN_SETTLE_PAUSE_MS =
  DIFFICULTY_TURN_SETTLE_PAUSE_MS;
const DIFFICULTY_DRAG_CATCH_UP_DURATION_MS = 140;
const DIFFICULTY_BOTTOM_TURN_FRAME_DURATION_MS =
  DIFFICULTY_TURN_FRAME_DURATION_MS;
const DIFFICULTY_BOTTOM_TURN_SETTLE_PAUSE_MS = DIFFICULTY_TURN_SETTLE_PAUSE_MS;
const DIFFICULTY_SINGLE_STEP_MOVE_DURATION_MS = 260;
const DIFFICULTY_WHISKER_WIGGLE_DELAY_MS = 50;
const DIFFICULTY_WHISKER_WIGGLE_DURATION_MS = 200;
const HIDE_SQUEAK_GAME_BASE_WIDTH_PX = 788;
const HIDE_SQUEAK_GAME_BASE_HEIGHT_PX = 601;

type CommandDisplayMode = "symbol" | "text";
type HideSqueakSettingsDraft = {
  commandDisplayMode: CommandDisplayMode;
  difficulty: HideSqueakDifficulty;
  playMode: "timed" | "endless";
};
type DifficultyTravelDirection = "up" | "down";
type DifficultyMouseVisualState =
  | "idleLeft"
  | "idleRight"
  | "idleBottomRight"
  | "preTurnLookUp"
  | "preTurnStraightDown"
  | "movingUp"
  | "movingDown"
  | "turningStartLeft"
  | "turningMiddleLeft"
  | "turningTowardLeft"
  | "turningStartRight"
  | "turningMiddleRight"
  | "turningTowardRight";

function getDifficultyLabelForLadder(difficulty: HideSqueakDifficulty) {
  return difficulty === "super-hard"
    ? "Super hard"
    : getDifficultyLabel(difficulty);
}

function getDifficultyIndex(difficulty: HideSqueakDifficulty) {
  return DIFFICULTY_LADDER_ORDER.indexOf(difficulty);
}

function getDifficultyMouseTop(index: number) {
  return (
    index * (DIFFICULTY_ROW_HEIGHT_PX + DIFFICULTY_ROW_GAP_PX) +
    DIFFICULTY_ROW_HEIGHT_PX / 2 -
    DIFFICULTY_MOUSE_SIZE.height / 2
  );
}

// function getInitialSettledMouseStateForDifficulty(
//   difficulty: HideSqueakDifficulty,
// ): DifficultyMouseVisualState {
//   return difficulty === "medium" || difficulty === "easy"
//     ? "idleRight"
//     : "idleLeft";
// }

function getSettledMouseStateForDirection(
  direction: DifficultyTravelDirection,
): DifficultyMouseVisualState {
  return direction === "up" ? "idleRight" : "idleLeft";
}

function getInitialMouseStateForDifficulty(
  difficulty: HideSqueakDifficulty,
): DifficultyMouseVisualState {
  return difficulty === "super-hard" ? "idleLeft" : "idleRight";
}

function getDifficultyTrackHeight() {
  return (
    DIFFICULTY_LADDER_ORDER.length * DIFFICULTY_ROW_HEIGHT_PX +
    (DIFFICULTY_LADDER_ORDER.length - 1) * DIFFICULTY_ROW_GAP_PX
  );
}

function getDifficultyTopForMouseState(
  difficulty: HideSqueakDifficulty,
  mouseState: DifficultyMouseVisualState,
) {
  const displayIndex = getDifficultyIndex(difficulty);
  const upFacingTopAdjustment =
    (mouseState === "idleRight" && difficulty !== "easy") ||
    mouseState === "idleBottomRight" ||
    mouseState === "turningStartRight" ||
    mouseState === "turningMiddleRight" ||
    mouseState === "turningTowardRight" ||
    (mouseState === "movingUp" && difficulty !== "super-hard")
      ? DIFFICULTY_MOUSE_IDLE_UP_TOP_ADJUSTMENT_PX
      : 0;
  const isBottomTurnOrSettledRight =
    (difficulty === "easy" &&
      (mouseState === "turningStartRight" ||
        mouseState === "turningMiddleRight" ||
        mouseState === "turningTowardRight")) ||
    mouseState === "idleBottomRight";

  if (mouseState === "idleBottomRight") {
    return DIFFICULTY_MOUSE_IDLE_BOTTOM_RIGHT_FINAL_TOP_PX;
  }

  if (isBottomTurnOrSettledRight) {
    return DIFFICULTY_MOUSE_IDLE_BOTTOM_RIGHT_TOP_PX;
  }

  return (
    getDifficultyMouseTop(displayIndex) +
    DIFFICULTY_MOUSE_TOP_OFFSET_PX +
    upFacingTopAdjustment
  );
}

function getNearestDifficultyForMouseTop(mouseTop: number) {
  let nearestDifficulty = DIFFICULTY_LADDER_ORDER[0];
  let nearestDistance = Number.POSITIVE_INFINITY;

  for (const difficulty of DIFFICULTY_LADDER_ORDER) {
    const difficultyTop = getDifficultyMouseTop(getDifficultyIndex(difficulty));
    const distance = Math.abs(mouseTop - difficultyTop);

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestDifficulty = difficulty;
    }
  }

  return nearestDifficulty;
}

function getSettledMouseStateForDifficultyAndDirection(
  difficulty: HideSqueakDifficulty,
  direction: DifficultyTravelDirection,
): DifficultyMouseVisualState {
  if (direction === "up") {
    return difficulty === "easy" ? "idleBottomRight" : "idleRight";
  }

  return "idleLeft";
}

function isMouseInAnimatedTransitionState(
  mouseState: DifficultyMouseVisualState,
) {
  return (
    mouseState === "movingUp" ||
    mouseState === "movingDown" ||
    mouseState === "turningStartLeft" ||
    mouseState === "turningMiddleLeft" ||
    mouseState === "turningTowardLeft" ||
    mouseState === "turningStartRight" ||
    mouseState === "turningMiddleRight" ||
    mouseState === "turningTowardRight" ||
    mouseState === "preTurnLookUp" ||
    mouseState === "preTurnStraightDown"
  );
}

function getCurrentVisualDifficultyAnchor(
  displayDifficulty: HideSqueakDifficulty,
  mouseState: DifficultyMouseVisualState,
  fallbackDifficulty: HideSqueakDifficulty,
) {
  if (isMouseInAnimatedTransitionState(mouseState)) {
    return displayDifficulty;
  }

  return fallbackDifficulty;
}

function DifficultyLadderSelector({
  selectedDifficulty,
  initialMouseState,
  onSelect,
  onSettledMouseStateChange,
}: {
  selectedDifficulty: HideSqueakDifficulty;
  initialMouseState: DifficultyMouseVisualState;
  onSelect: (difficulty: HideSqueakDifficulty) => void;
  onSettledMouseStateChange: (mouseState: DifficultyMouseVisualState) => void;
}) {
  const selectorRef = useRef<HTMLDivElement | null>(null);
  const [displayDifficulty, setDisplayDifficulty] =
    useState<HideSqueakDifficulty>(selectedDifficulty);
  const [mouseState, setMouseState] =
    useState<DifficultyMouseVisualState>(initialMouseState);
  const [isWhiskersWiggling, setIsWhiskersWiggling] = useState(false);
  const [mouseMoveDurationMs, setMouseMoveDurationMs] = useState(
    DIFFICULTY_MOVE_DURATION_PER_STEP_MS,
  );
  const [isDraggingMouse, setIsDraggingMouse] = useState(false);
  const [isMouseHovered, setIsMouseHovered] = useState(false);
  const [isDragTurning, setIsDragTurning] = useState(false);
  const [dragMouseTop, setDragMouseTop] = useState<number | null>(null);
  const [dragMouseTransitionMs, setDragMouseTransitionMs] = useState(0);
  const [dragFacingDirection, setDragFacingDirection] =
    useState<DifficultyTravelDirection | null>(null);
  const previousSelectionRef = useRef<HideSqueakDifficulty>(selectedDifficulty);
  const animationTimeoutsRef = useRef<number[]>([]);
  const dragSessionRef = useRef<{
    lastClientY: number;
    direction: DifficultyTravelDirection;
    pendingTop: number;
    releaseClientY: number | null;
  } | null>(null);

  function queueAnimationTimeout(
    callback: () => void,
    delayMs: number,
  ): number {
    const timeoutId = window.setTimeout(callback, delayMs);
    animationTimeoutsRef.current.push(timeoutId);
    return timeoutId;
  }

  function clearAnimationTimeouts() {
    animationTimeoutsRef.current.forEach((timeoutId) =>
      window.clearTimeout(timeoutId),
    );
    animationTimeoutsRef.current = [];
  }

  function startWhiskerWiggle() {
    queueAnimationTimeout(() => {
      setIsWhiskersWiggling(true);

      queueAnimationTimeout(() => {
        setIsWhiskersWiggling(false);
      }, DIFFICULTY_WHISKER_WIGGLE_DURATION_MS);
    }, DIFFICULTY_WHISKER_WIGGLE_DELAY_MS);
  }

  function settleMouse(nextState: DifficultyMouseVisualState) {
    setMouseState(nextState);
    startWhiskerWiggle();
  }

  function runTurnSequence(
    startState: DifficultyMouseVisualState,
    middleState: DifficultyMouseVisualState,
    towardState: DifficultyMouseVisualState,
    nextState: DifficultyMouseVisualState,
    frameDurationMs: number,
    settlePauseMs: number,
  ) {
    setMouseState(startState);
    queueAnimationTimeout(() => {
      setMouseState(middleState);
    }, frameDurationMs);
    queueAnimationTimeout(() => {
      setMouseState(towardState);
    }, frameDurationMs * 2);
    queueAnimationTimeout(
      () => {
        settleMouse(nextState);
      },
      frameDurationMs * 3 + settlePauseMs,
    );
  }

  function runLeftTurnSequence(
    nextState: DifficultyMouseVisualState,
    frameDurationMs: number,
    settlePauseMs: number,
  ) {
    runTurnSequence(
      "turningStartLeft",
      "turningMiddleLeft",
      "turningTowardLeft",
      nextState,
      frameDurationMs,
      settlePauseMs,
    );
  }

  function runRightTurnSequence(
    nextState: DifficultyMouseVisualState,
    frameDurationMs: number,
    settlePauseMs: number,
  ) {
    runTurnSequence(
      "turningStartRight",
      "turningMiddleRight",
      "turningTowardRight",
      nextState,
      frameDurationMs,
      settlePauseMs,
    );
  }

  function startMoveSequence(
    nextDifficulty: HideSqueakDifficulty,
    travelDirection: DifficultyTravelDirection,
    moveDurationMs: number,
    targetIdleState: DifficultyMouseVisualState,
    shouldRunSuperHardTurnSequence: boolean,
    shouldRunEasyTurnSequence: boolean,
  ) {
    setMouseMoveDurationMs(moveDurationMs);
    setIsWhiskersWiggling(false);
    setMouseState(travelDirection === "up" ? "movingUp" : "movingDown");
    setDisplayDifficulty(nextDifficulty);

    queueAnimationTimeout(() => {
      if (shouldRunSuperHardTurnSequence) {
        runLeftTurnSequence(
          "idleLeft",
          DIFFICULTY_TURN_FRAME_DURATION_MS,
          DIFFICULTY_TURN_SETTLE_PAUSE_MS,
        );
        return;
      }

      if (shouldRunEasyTurnSequence) {
        runRightTurnSequence(
          "idleBottomRight",
          DIFFICULTY_BOTTOM_TURN_FRAME_DURATION_MS,
          DIFFICULTY_BOTTOM_TURN_SETTLE_PAUSE_MS,
        );
        return;
      }

      settleMouse(targetIdleState);
    }, moveDurationMs);
  }

  function runPreMoveDownTurnSequence(
    nextDifficulty: HideSqueakDifficulty,
    travelDirection: DifficultyTravelDirection,
    moveDurationMs: number,
    targetIdleState: DifficultyMouseVisualState,
    shouldRunSuperHardTurnSequence: boolean,
    shouldRunEasyTurnSequence: boolean,
  ) {
    setIsWhiskersWiggling(false);
    setMouseState("turningStartLeft");

    queueAnimationTimeout(() => {
      setMouseState("turningMiddleLeft");
    }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS);
    queueAnimationTimeout(() => {
      setMouseState("turningTowardLeft");
    }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS * 2);
    queueAnimationTimeout(() => {
      setMouseState("preTurnStraightDown");
    }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS * 3);
    queueAnimationTimeout(
      () => {
        startMoveSequence(
          nextDifficulty,
          travelDirection,
          moveDurationMs,
          targetIdleState,
          shouldRunSuperHardTurnSequence,
          shouldRunEasyTurnSequence,
        );
      },
      DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS * 3 +
        DIFFICULTY_TURN_SETTLE_PAUSE_MS,
    );
  }

  function runPreMoveUpTurnSequence(
    nextDifficulty: HideSqueakDifficulty,
    travelDirection: DifficultyTravelDirection,
    moveDurationMs: number,
    targetIdleState: DifficultyMouseVisualState,
    shouldRunSuperHardTurnSequence: boolean,
    shouldRunEasyTurnSequence: boolean,
  ) {
    setIsWhiskersWiggling(false);
    setMouseState("turningStartRight");

    queueAnimationTimeout(() => {
      setMouseState("turningMiddleRight");
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS);
    queueAnimationTimeout(() => {
      setMouseState("turningTowardRight");
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS * 2);
    queueAnimationTimeout(() => {
      setMouseState("preTurnLookUp");
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS * 3);
    queueAnimationTimeout(
      () => {
        startMoveSequence(
          nextDifficulty,
          travelDirection,
          moveDurationMs,
          targetIdleState,
          shouldRunSuperHardTurnSequence,
          shouldRunEasyTurnSequence,
        );
      },
      DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS * 3 +
        DIFFICULTY_PRE_MOVE_UP_TURN_SETTLE_PAUSE_MS,
    );
  }

  function runDragDirectionTurnSequence(
    direction: DifficultyTravelDirection,
    anchorTop: number,
  ) {
    clearAnimationTimeouts();
    setIsWhiskersWiggling(false);
    setDragFacingDirection(direction);
    setIsDragTurning(true);
    setDragMouseTransitionMs(0);
    setDragMouseTop(anchorTop);

    if (direction === "down") {
      setMouseState("turningStartLeft");
      queueAnimationTimeout(() => {
        setMouseState("turningMiddleLeft");
      }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS);
      queueAnimationTimeout(() => {
        setMouseState("turningTowardLeft");
      }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS * 2);
      queueAnimationTimeout(() => {
        setMouseState("preTurnStraightDown");
      }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS * 3);
      queueAnimationTimeout(() => {
        setIsDragTurning(false);
        setDragMouseTransitionMs(DIFFICULTY_DRAG_CATCH_UP_DURATION_MS);
        setDragMouseTop(dragSessionRef.current?.pendingTop ?? anchorTop);
      }, DIFFICULTY_PRE_MOVE_TURN_FRAME_DURATION_MS * 3);
      return;
    }

    setMouseState("turningStartRight");
    queueAnimationTimeout(() => {
      setMouseState("turningMiddleRight");
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS);
    queueAnimationTimeout(() => {
      setMouseState("turningTowardRight");
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS * 2);
    queueAnimationTimeout(() => {
      setMouseState("preTurnLookUp");
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS * 3);
    queueAnimationTimeout(() => {
      setIsDragTurning(false);
      setDragMouseTransitionMs(DIFFICULTY_DRAG_CATCH_UP_DURATION_MS);
      setDragMouseTop(dragSessionRef.current?.pendingTop ?? anchorTop);
    }, DIFFICULTY_PRE_MOVE_UP_TURN_FRAME_DURATION_MS * 3);
  }

  function handleDragRelease(clientY: number) {
    const selectorRect = selectorRef.current?.getBoundingClientRect();
    const currentDirection =
      dragSessionRef.current?.direction ?? dragFacingDirection ?? "up";

    if (isDragTurning && dragSessionRef.current) {
      dragSessionRef.current.releaseClientY = clientY;
      return;
    }

    setIsDraggingMouse(false);
    setIsDragTurning(false);
    dragSessionRef.current = null;
    clearAnimationTimeouts();

    if (!selectorRect) {
      setDragMouseTop(null);
      setDragFacingDirection(null);
      settleMouse(
        getSettledMouseStateForDifficultyAndDirection(
          selectedDifficulty,
          currentDirection,
        ),
      );
      return;
    }

    const nextTop = Math.max(
      0,
      Math.min(
        clientY - selectorRect.top - DIFFICULTY_MOUSE_SIZE.height / 2,
        getDifficultyTrackHeight() - DIFFICULTY_MOUSE_SIZE.height,
      ),
    );
    const snappedDifficulty = getNearestDifficultyForMouseTop(nextTop);
    const settledMouseState = getSettledMouseStateForDifficultyAndDirection(
      snappedDifficulty,
      currentDirection,
    );
    const snappedTop = getDifficultyTopForMouseState(
      snappedDifficulty,
      settledMouseState,
    );

    setDisplayDifficulty(snappedDifficulty);
    setDragMouseTop(snappedTop);
    setDragMouseTransitionMs(120);

    queueAnimationTimeout(() => {
      setMouseState(settledMouseState);
      setDragMouseTop(null);
      setDragMouseTransitionMs(0);
      setDragFacingDirection(null);
      previousSelectionRef.current = snappedDifficulty;
      onSelect(snappedDifficulty);
      startWhiskerWiggle();
    }, 120);
  }

  useEffect(() => {
    if (selectedDifficulty === previousSelectionRef.current) {
      return;
    }

    clearAnimationTimeouts();

    const previousDifficulty = getCurrentVisualDifficultyAnchor(
      displayDifficulty,
      mouseState,
      previousSelectionRef.current,
    );
    const previousIndex = getDifficultyIndex(previousDifficulty);
    const nextIndex = getDifficultyIndex(selectedDifficulty);

    if (nextIndex === previousIndex) {
      return;
    }

    const travelDirection: DifficultyTravelDirection =
      nextIndex < previousIndex ? "up" : "down";
    const shouldRunSuperHardTurnSequence =
      selectedDifficulty === "super-hard" && travelDirection === "up";
    const shouldRunEasyTurnSequence =
      selectedDifficulty === "easy" && travelDirection === "down";
    const shouldRunPreMoveDownTurnSequence =
      mouseState === "idleRight" && travelDirection === "down";
    const shouldRunPreMoveUpTurnSequence =
      mouseState === "idleLeft" && travelDirection === "up";
    const targetIdleState = shouldRunEasyTurnSequence
      ? "idleBottomRight"
      : shouldRunSuperHardTurnSequence
        ? "idleLeft"
        : getSettledMouseStateForDirection(travelDirection);
    const stepDistance = Math.abs(nextIndex - previousIndex);
    const moveDurationMs =
      stepDistance === 1
        ? DIFFICULTY_SINGLE_STEP_MOVE_DURATION_MS
        : Math.max(1, stepDistance) * DIFFICULTY_MOVE_DURATION_PER_STEP_MS;
    queueAnimationTimeout(() => {
      if (shouldRunPreMoveDownTurnSequence) {
        runPreMoveDownTurnSequence(
          selectedDifficulty,
          travelDirection,
          moveDurationMs,
          targetIdleState,
          shouldRunSuperHardTurnSequence,
          shouldRunEasyTurnSequence,
        );
        return;
      }

      if (shouldRunPreMoveUpTurnSequence) {
        runPreMoveUpTurnSequence(
          selectedDifficulty,
          travelDirection,
          moveDurationMs,
          targetIdleState,
          shouldRunSuperHardTurnSequence,
          shouldRunEasyTurnSequence,
        );
        return;
      }

      startMoveSequence(
        selectedDifficulty,
        travelDirection,
        moveDurationMs,
        targetIdleState,
        shouldRunSuperHardTurnSequence,
        shouldRunEasyTurnSequence,
      );
    }, 0);

    previousSelectionRef.current = selectedDifficulty;
  }, [displayDifficulty, mouseState, selectedDifficulty]);

  useEffect(() => {
    return () => {
      clearAnimationTimeouts();
    };
  }, []);

  useEffect(() => {
    if (!isDraggingMouse) {
      return;
    }

    function handlePointerMove(event: PointerEvent) {
      if (!selectorRef.current || !dragSessionRef.current) {
        return;
      }

      const selectorRect = selectorRef.current.getBoundingClientRect();
      const nextTop = Math.max(
        0,
        Math.min(
          event.clientY - selectorRect.top - DIFFICULTY_MOUSE_SIZE.height / 2,
          getDifficultyTrackHeight() - DIFFICULTY_MOUSE_SIZE.height,
        ),
      );
      const deltaY = event.clientY - dragSessionRef.current.lastClientY;
      let nextDirection =
        deltaY < -2
          ? "up"
          : deltaY > 2
            ? "down"
            : dragSessionRef.current.direction;
      const nearestDifficulty = getNearestDifficultyForMouseTop(nextTop);

      if (nearestDifficulty === "super-hard" && nextDirection === "up") {
        nextDirection = "down";
      } else if (nearestDifficulty === "easy" && nextDirection === "down") {
        nextDirection = "up";
      }

      dragSessionRef.current.pendingTop = nextTop;

      if (!isDragTurning) {
        setDragMouseTransitionMs(0);
        setDragMouseTop(nextTop);
      }

      if (nextDirection !== dragSessionRef.current.direction) {
        dragSessionRef.current.direction = nextDirection;
        const anchorTop = getDifficultyTopForMouseState(
          nearestDifficulty,
          nextDirection === "down" ? "preTurnStraightDown" : "preTurnLookUp",
        );
        runDragDirectionTurnSequence(nextDirection, anchorTop);
      }

      dragSessionRef.current.lastClientY = event.clientY;
    }

    function handlePointerUp(event: PointerEvent) {
      handleDragRelease(event.clientY);
    }

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragFacingDirection, isDragTurning, isDraggingMouse, selectedDifficulty]);

  useEffect(() => {
    if (!isDraggingMouse || isDragTurning || !dragSessionRef.current) {
      return;
    }

    if (dragSessionRef.current.releaseClientY == null) {
      return;
    }

    const releaseClientY = dragSessionRef.current.releaseClientY;
    dragSessionRef.current.releaseClientY = null;
    handleDragRelease(releaseClientY);
  }, [isDragTurning, isDraggingMouse]);

  useEffect(() => {
    if (
      mouseState === "idleLeft" ||
      mouseState === "idleRight" ||
      mouseState === "idleBottomRight"
    ) {
      onSettledMouseStateChange(mouseState);
    }
  }, [mouseState, onSettledMouseStateChange]);

  function handleKeyDown(
    event: ReactKeyboardEvent<HTMLButtonElement>,
    difficulty: HideSqueakDifficulty,
  ) {
    const currentIndex = getDifficultyIndex(difficulty);

    if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      onSelect(
        DIFFICULTY_LADDER_ORDER[Math.max(0, currentIndex - 1)] ?? difficulty,
      );
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      onSelect(
        DIFFICULTY_LADDER_ORDER[
          Math.min(DIFFICULTY_LADDER_ORDER.length - 1, currentIndex + 1)
        ] ?? difficulty,
      );
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      onSelect(DIFFICULTY_LADDER_ORDER[0]);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      onSelect(DIFFICULTY_LADDER_ORDER[DIFFICULTY_LADDER_ORDER.length - 1]);
    }
  }

  function handleMousePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (
      event.button !== 0 ||
      !(
        mouseState === "idleLeft" ||
        mouseState === "idleRight" ||
        mouseState === "idleBottomRight"
      )
    ) {
      return;
    }

    clearAnimationTimeouts();
    setIsWhiskersWiggling(false);
    setIsDraggingMouse(true);
    setIsDragTurning(false);
    const direction = mouseState === "idleLeft" ? "down" : "up";
    const neutralMouseState =
      direction === "up" ? "preTurnLookUp" : "preTurnStraightDown";
    const currentRenderedTop =
      dragMouseTop ??
      getDifficultyTopForMouseState(displayDifficulty, mouseState);
    setMouseState(neutralMouseState);
    setDragMouseTop(currentRenderedTop);
    setDragMouseTransitionMs(0);

    dragSessionRef.current = {
      lastClientY: event.clientY,
      direction,
      pendingTop: currentRenderedTop,
      releaseClientY: null,
    };
    setDragFacingDirection(direction);
  }

  const mouseTop =
    dragMouseTop ??
    getDifficultyTopForMouseState(displayDifficulty, mouseState);
  const selectedRowTop =
    getDifficultyIndex(selectedDifficulty) *
    (DIFFICULTY_ROW_HEIGHT_PX + DIFFICULTY_ROW_GAP_PX);
  const trackHeight = getDifficultyTrackHeight();
  const mouseRotation =
    mouseState === "movingUp" ||
    mouseState === "idleRight" ||
    mouseState === "idleBottomRight" ||
    mouseState === "preTurnLookUp" ||
    ((mouseState === "turningStartRight" ||
      mouseState === "turningMiddleRight") &&
      (selectedDifficulty === "easy" ||
        (isDraggingMouse && dragFacingDirection === "up") ||
        displayDifficulty !== selectedDifficulty))
      ? "rotate(180deg)"
      : "none";
  const isUpFacingMouse = mouseRotation === "rotate(180deg)";
  const isMouseMoving =
    mouseState === "movingUp" || mouseState === "movingDown";
  const shouldShowCheeseDrag = isMouseHovered || isDraggingMouse;
  const cheeseDragOpacity = isDraggingMouse ? 1 : 0.5;
  const cheeseAboveTop = -DIFFICULTY_MOUSE_CHEESE_ABOVE_OFFSET_PX;
  const cheeseBelowTop = DIFFICULTY_MOUSE_CHEESE_BELOW_OFFSET_PX;
  const isCheeseClippedAtTop = mouseTop + cheeseAboveTop < 0;
  const isCheeseClippedAtBottom =
    mouseTop + cheeseBelowTop + DIFFICULTY_MOUSE_CHEESE_SIZE_PX > trackHeight;
  const showCheeseAbove = isUpFacingMouse
    ? !isCheeseClippedAtTop
    : isCheeseClippedAtBottom;
  const showCheeseBelow = isUpFacingMouse
    ? isCheeseClippedAtTop
    : !isCheeseClippedAtBottom;
  const CurrentMouseSvg =
    mouseState === "turningStartLeft"
      ? MouseRotationStartSvg
      : mouseState === "turningStartRight"
        ? MouseRotationStartSvg
        : mouseState === "turningMiddleLeft"
          ? MouseRotationMiddleSvg
          : mouseState === "turningMiddleRight"
            ? MouseRotationMiddleSvg
            : mouseState === "turningTowardLeft"
              ? MouseRotationTowardLeftSvg
              : mouseState === "turningTowardRight"
                ? MouseRotationTowardRightSvg
                : MouseGoingUpDownSvg;

  return (
    <div
      ref={selectorRef}
      role="radiogroup"
      aria-label="Difficulty"
      className="relative w-full"
      style={{
        minHeight: `${trackHeight}px`,
      }}
    >
      <img
        src={difficultyLadderUrl}
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute"
        style={{
          left: `${DIFFICULTY_LADDER_LEFT_PX}px`,
          top: "0",
          height: `${trackHeight}px`,
          width: `${DIFFICULTY_LADDER_WIDTH_PX}px`,
        }}
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-[1] rounded-[14px] bg-hs-controlSelected shadow-hs-button transition-[top] duration-150 ease-out"
        style={{
          left: `${DIFFICULTY_ROW_HIGHLIGHT_LEFT_PX}px`,
          top: `${selectedRowTop}px`,
          width: "120px",
          height: `${DIFFICULTY_ROW_HEIGHT_PX}px`,
        }}
      />

      <div
        onPointerEnter={() => setIsMouseHovered(true)}
        onPointerLeave={() => setIsMouseHovered(false)}
        onPointerDown={handleMousePointerDown}
        className={[
          "absolute z-[3] touch-none transition-[top] duration-200 ease-out",
          shouldShowCheeseDrag ? "cursor-none" : "cursor-grab",
          isDraggingMouse ? "active:cursor-none" : "active:cursor-grabbing",
        ].join(" ")}
        style={{
          left: `${DIFFICULTY_MOUSE_LEFT_PX}px`,
          top: `${mouseTop}px`,
          height: `${DIFFICULTY_MOUSE_SIZE.height}px`,
          width: `${DIFFICULTY_MOUSE_SIZE.width}px`,
          transitionDuration: isDraggingMouse
            ? `${dragMouseTransitionMs}ms`
            : dragMouseTop != null
              ? "120ms"
              : getDifficultyTopForMouseState(displayDifficulty, mouseState) ===
                    DIFFICULTY_MOUSE_IDLE_BOTTOM_RIGHT_TOP_PX ||
                  mouseState === "idleBottomRight"
                ? "0ms"
                : `${mouseMoveDurationMs}ms`,
        }}
      >
        {shouldShowCheeseDrag ? (
          <>
            <img
              src={cheeseDragUrl}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute transition-[opacity,transform] duration-200 ease-out"
              style={{
                left: `${(DIFFICULTY_MOUSE_SIZE.width - DIFFICULTY_MOUSE_CHEESE_SIZE_PX) / 2}px`,
                top: `${cheeseAboveTop}px`,
                height: `${DIFFICULTY_MOUSE_CHEESE_SIZE_PX}px`,
                width: `${DIFFICULTY_MOUSE_CHEESE_SIZE_PX}px`,
                opacity: showCheeseAbove ? cheeseDragOpacity : 0,
                transform: `scale(${showCheeseAbove ? 1 : 0})`,
                transformOrigin: "center center",
              }}
            />
            <img
              src={cheeseDragUrl}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute transition-[opacity,transform] duration-200 ease-out"
              style={{
                left: `${(DIFFICULTY_MOUSE_SIZE.width - DIFFICULTY_MOUSE_CHEESE_SIZE_PX) / 2}px`,
                top: `${cheeseBelowTop}px`,
                height: `${DIFFICULTY_MOUSE_CHEESE_SIZE_PX}px`,
                width: `${DIFFICULTY_MOUSE_CHEESE_SIZE_PX}px`,
                opacity: showCheeseBelow ? cheeseDragOpacity : 0,
                transform: `scale(${showCheeseBelow ? 1 : 0})`,
                transformOrigin: "center center",
              }}
            />
          </>
        ) : null}
        <CurrentMouseSvg
          aria-hidden="true"
          focusable="false"
          className={[
            "hsDifficultyMouseSvg h-full w-full overflow-visible object-contain",
            isMouseMoving ? "hsDifficultyMouseMoving" : "",
            isDraggingMouse ? "hsDifficultyMouseDragging" : "",
            isWhiskersWiggling ? "hsDifficultyMouseWhiskersWiggle" : "",
            !isWhiskersWiggling &&
            (mouseState === "idleLeft" ||
              mouseState === "idleRight" ||
              mouseState === "idleBottomRight")
              ? "hsDifficultyMouseIdleLife"
              : "",
            mouseState === "idleLeft" ? "hsDifficultyMouseIdleLeft" : "",
            mouseState === "idleRight" ? "hsDifficultyMouseIdleRight" : "",
            mouseState === "idleBottomRight"
              ? "hsDifficultyMouseIdleBottomRight"
              : "",
            mouseState === "turningTowardRight"
              ? "hsDifficultyMouseTurningTowardRight"
              : "",
          ].join(" ")}
          style={
            {
              "--hs-difficulty-mouse-transform": mouseRotation,
            } as CSSProperties
          }
        />
      </div>

      <div className="relative z-[2] flex flex-col gap-[6px]">
        {DIFFICULTY_LADDER_ORDER.map((difficulty) => {
          const isSelected = difficulty === selectedDifficulty;

          return (
            <button
              key={difficulty}
              type="button"
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => onSelect(difficulty)}
              onKeyDown={(event) => handleKeyDown(event, difficulty)}
              className={[
                "font-game relative flex min-h-[52px] w-full items-center rounded-[14px] px-3 text-left text-[1rem] font-semibold leading-tight transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel",
                isSelected
                  ? "bg-transparent text-hs-textStrong"
                  : "bg-transparent text-hs-textSecondary hover:bg-hs-controlHover/45 hover:text-hs-textPrimary active:bg-hs-controlActive/55",
              ].join(" ")}
              style={{ paddingLeft: `${DIFFICULTY_ROW_PADDING_LEFT_PX}px` }}
            >
              {getDifficultyLabelForLadder(difficulty)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function getBoardSizeForDifficulty(
  difficulty: HideSqueakDifficulty,
): HideSqueakBoardSize {
  if (difficulty === "easy") {
    return {
      rows: 4,
      columns: 4,
    };
  }

  return HIDE_SQUEAK_BOARD_CONSTRAINTS.size;
}

function getPinnedItemsForSize(
  pinnedItems: HideSqueakItem[] | null,
  size: HideSqueakBoardSize,
) {
  if (!pinnedItems || pinnedItems.length === 0) {
    return null;
  }

  const fittingItems = pinnedItems.filter(
    (item) =>
      item.coordinate.row <= size.rows &&
      item.coordinate.column <= size.columns,
  );

  return fittingItems.length >=
    HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints.minTotalItems
    ? fittingItems
    : null;
}

function createBoardDefinition(
  pinnedItems: HideSqueakItem[] | null,
  size: HideSqueakBoardSize,
): HideSqueakBoardDefinition {
  const fittedPinnedItems = getPinnedItemsForSize(pinnedItems, size);

  if (fittedPinnedItems && fittedPinnedItems.length > 0) {
    return {
      mode: "pinned",
      items: fittedPinnedItems,
    };
  }

  return {
    mode: "random",
    itemDefinitions: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemDefinitions,
  };
}

function createPlayableRound(
  difficulty: HideSqueakDifficulty,
  pinnedItems: HideSqueakItem[] | null,
) {
  const boardSize = getBoardSizeForDifficulty(difficulty);
  const boardResult = generateBoardLayout({
    size: boardSize,
    itemConstraints: HIDE_SQUEAK_BOARD_CONSTRAINTS.itemConstraints,
    definition: createBoardDefinition(pinnedItems, boardSize),
  });

  return applyAnswerModelToRound(
    generatePuzzleRound({
      boardResult,
      difficulty,
    }),
  );
}

function getTimeBadgeValue(
  roundNumber: number,
  remainingSeconds: number,
  isTimed: boolean,
) {
  return isTimed
    ? String(Math.max(0, remainingSeconds))
    : String(Math.max(1, roundNumber));
}

function getDifficultyLabel(difficulty: HideSqueakDifficulty) {
  if (difficulty === "super-hard") {
    return "Super hard";
  }

  return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
}

function BoardIconButton({
  icon,
  label,
  isActive = false,
  disabled = false,
  className = "",
  iconClassName = "h-10 w-10 object-contain",
  onClick,
}: {
  icon: string;
  label: string;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className={[
        ICON_CONTROL_CLASS_NAME,
        "focus-visible:ring-offset-hs-shell",
        disabled ? "opacity-45" : ICON_CONTROL_INTERACTION_CLASS_NAME,
        isActive ? "opacity-90" : "",
        className,
      ].join(" ")}
    >
      <img src={icon} alt="" aria-hidden="true" className={iconClassName} />
    </button>
  );
}

function RestartBoardButton({
  isPinned,
  onClick,
}: {
  isPinned: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={
        isPinned ? "Start a new round on the pinned board" : "Start a new round"
      }
      onClick={onClick}
      className={[
        ICON_CONTROL_CLASS_NAME,
        ICON_CONTROL_INTERACTION_CLASS_NAME,
        "relative self-end focus-visible:ring-offset-hs-shell",
      ].join(" ")}
    >
      <img
        src={isPinned ? restartGameSameBoardUrl : restartGameUrl}
        alt=""
        aria-hidden="true"
        className={
          isPinned
            ? "absolute bottom-[3px] left-[2px] h-[45.3px] w-[41.3px] object-contain"
            : "h-10 w-10 object-contain"
        }
      />
    </button>
  );
}

function SettingsIcon({ outlined = false }: { outlined?: boolean }) {
  return (
    <SettingsSvg
      aria-hidden="true"
      focusable="false"
      className={[
        "h-5 w-5 overflow-visible object-contain",
        outlined
          ? "[&_path]:fill-none [&_path]:stroke-[#005358] [&_path]:stroke-[1.75px]"
          : "text-hs-panel",
      ].join(" ")}
    />
  );
}

function SettingsButton({
  label,
  outlined = false,
  className = "",
  onClick,
  buttonRef,
}: {
  label: string;
  outlined?: boolean;
  className?: string;
  onClick: () => void;
  buttonRef?: Ref<HTMLButtonElement>;
}) {
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={label}
      onClick={onClick}
      className={[
        ICON_CONTROL_CLASS_NAME,
        "focus-visible:ring-offset-hs-topbar",
        className,
      ].join(" ")}
    >
      <SettingsIcon outlined={outlined} />
    </button>
  );
}

function BoardPinButton({
  isPinned,
  onClick,
}: {
  isPinned: boolean;
  onClick: () => void;
}) {
  const PinSvg = isPinned ? PinnedBoardSvg : PinBoardSvg;

  return (
    <button
      type="button"
      aria-label={isPinned ? "Unpin board" : "Pin board"}
      onClick={onClick}
      className={[
        ICON_CONTROL_CLASS_NAME,
        "absolute z-10 p-0 focus-visible:ring-offset-hs-shell",
        "bottom-[5px] left-[5px] h-[35px] w-[35px]",
      ].join(" ")}
    >
      <PinSvg
        aria-hidden="true"
        focusable="false"
        className={[
          "h-full w-full",
          "[&_#pin]:origin-center [&_#pin]:transition-transform [&_#pin]:duration-150",
          isPinned
            ? "hover:[&_#pin]:-translate-y-[3px] active:[&_#pin]:translate-y-[1px]"
            : "hover:[&_#pin]:translate-y-[3px] active:[&_#pin]:translate-y-[5px]",
        ].join(" ")}
      />
    </button>
  );
}

function ReviewPreviousButton({
  isReviewOpen,
  hasPreviousRound,
  onClick,
}: {
  isReviewOpen: boolean;
  hasPreviousRound: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={!hasPreviousRound}
      onClick={onClick}
      aria-label={isReviewOpen ? "Close review" : "Review previous round"}
      className={[
        ICON_CONTROL_CLASS_NAME,
        "self-end text-hs-topbar focus-visible:ring-offset-hs-shell",
        hasPreviousRound
          ? ICON_CONTROL_INTERACTION_CLASS_NAME
          : "cursor-default",
        isReviewOpen ? "opacity-90" : "",
      ].join(" ")}
    >
      <ReviewPreviousSvg
        aria-hidden="true"
        focusable="false"
        className={[
          "h-10 w-10 object-contain",
          !hasPreviousRound ? "[&_#review-arrow]:opacity-0" : "",
        ].join(" ")}
      />
    </button>
  );
}

function TopStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="font-ui flex items-center gap-2 leading-none">
      <span className="text-[1rem] font-medium text-hs-textInverse/72">
        {label}:
      </span>
      <span className="min-w-[3.15rem] rounded-[12px] bg-[#3c707b] px-2.5 py-[0.32rem] text-center text-[1.24rem] font-semibold text-[#07383b]">
        {value}
      </span>
    </div>
  );
}

const MemoizedDifficultyLadderSelector = memo(DifficultyLadderSelector);

const SettingsTimerToggle = memo(function SettingsTimerToggle({
  playMode,
  onSelectTimed,
  onSelectEndless,
}: {
  playMode: "timed" | "endless";
  onSelectTimed: () => void;
  onSelectEndless: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p className={SETTINGS_SECTION_LABEL_CLASS_NAME}>Timer</p>
      <div className={TOGGLE_SHELL_CLASS_NAME}>
        <button
          type="button"
          onClick={onSelectTimed}
          className={[
            TOGGLE_BUTTON_CLASS_NAME,
            playMode === "timed"
              ? "scale-[1.02] bg-hs-controlActive text-hs-textStrong shadow-hs-soft"
              : "text-hs-textSecondary hover:bg-hs-controlHover hover:text-hs-textPrimary active:bg-hs-controlActive/80",
          ].join(" ")}
        >
          On
        </button>
        <button
          type="button"
          onClick={onSelectEndless}
          className={[
            TOGGLE_BUTTON_CLASS_NAME,
            playMode === "endless"
              ? "scale-[1.02] bg-hs-controlActive text-hs-textStrong shadow-hs-soft"
              : "text-hs-textSecondary hover:bg-hs-controlHover hover:text-hs-textPrimary active:bg-hs-controlActive/80",
          ].join(" ")}
        >
          Off
        </button>
      </div>
    </div>
  );
});

const SettingsDirectionsToggle = memo(function SettingsDirectionsToggle({
  commandDisplayMode,
  onSelectText,
  onSelectSymbol,
}: {
  commandDisplayMode: CommandDisplayMode;
  onSelectText: () => void;
  onSelectSymbol: () => void;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-2">
      <p className={SETTINGS_SECTION_LABEL_CLASS_NAME}>Directions style</p>
      <div className={TOGGLE_SHELL_CLASS_NAME}>
        <button
          type="button"
          onClick={onSelectText}
          className={[
            TOGGLE_BUTTON_CLASS_NAME,
            "px-2.5 text-[0.98rem]",
            commandDisplayMode === "text"
              ? "scale-[1.02] bg-hs-controlActive text-hs-textStrong shadow-hs-soft"
              : "text-hs-textSecondary hover:bg-hs-controlHover hover:text-hs-textPrimary active:bg-hs-controlActive/80",
          ].join(" ")}
        >
          Words
        </button>
        <button
          type="button"
          onClick={onSelectSymbol}
          className={[
            TOGGLE_BUTTON_CLASS_NAME,
            "px-2.5 text-[1.65rem]",
            commandDisplayMode === "symbol"
              ? "scale-[1.02] bg-hs-controlActive text-hs-textStrong shadow-hs-soft"
              : "text-hs-textSecondary hover:bg-hs-controlHover hover:text-hs-textPrimary active:bg-hs-controlActive/80",
          ].join(" ")}
          aria-label="Show arrow directions"
        >
          ↑→↓
        </button>
      </div>
    </div>
  );
});

const HideSqueakSettingsPanel = memo(function HideSqueakSettingsPanel({
  settingsRef,
  draftSettings,
  settingsDifficultyMouseState,
  onClose,
  onSelectDifficulty,
  onSettledMouseStateChange,
  onSelectTimed,
  onSelectEndless,
  onSelectText,
  onSelectSymbol,
}: {
  settingsRef: Ref<HTMLDivElement>;
  draftSettings: HideSqueakSettingsDraft;
  settingsDifficultyMouseState: DifficultyMouseVisualState;
  onClose: () => void;
  onSelectDifficulty: (difficulty: HideSqueakDifficulty) => void;
  onSettledMouseStateChange: (mouseState: DifficultyMouseVisualState) => void;
  onSelectTimed: () => void;
  onSelectEndless: () => void;
  onSelectText: () => void;
  onSelectSymbol: () => void;
}) {
  return (
    <div
      ref={settingsRef}
      className={`absolute right-0 top-0 z-30 w-[260px] ${GAME_CHROME_RADIUS_CLASS_NAME} border-[3px] border-hs-textSecondary bg-hs-panel px-4 pb-4 pt-5 font-ui text-hs-textPrimary shadow-hs-panel`}
    >
      <SettingsButton
        label="Close settings"
        outlined
        className="absolute right-[13px] top-[7px] focus-visible:ring-offset-hs-panel"
        onClick={onClose}
      />

      <div className="flex flex-col items-start gap-5 pt-2">
        <div className="flex w-full flex-col items-start gap-2">
          <p className={SETTINGS_SECTION_LABEL_CLASS_NAME}>Difficulty</p>
          <MemoizedDifficultyLadderSelector
            selectedDifficulty={draftSettings.difficulty}
            initialMouseState={settingsDifficultyMouseState}
            onSelect={onSelectDifficulty}
            onSettledMouseStateChange={onSettledMouseStateChange}
          />
        </div>

        <SettingsTimerToggle
          playMode={draftSettings.playMode}
          onSelectTimed={onSelectTimed}
          onSelectEndless={onSelectEndless}
        />

        <SettingsDirectionsToggle
          commandDisplayMode={draftSettings.commandDisplayMode}
          onSelectText={onSelectText}
          onSelectSymbol={onSelectSymbol}
        />
      </div>
    </div>
  );
});

export function HideSqueakGame() {
  const gameViewportRef = useRef<HTMLDivElement | null>(null);
  const [state, dispatch] = useReducer(
    reduceHideSqueakSessionState,
    createHideSqueakSessionState({
      difficulty: "easy",
    }),
  );
  const [availableWidth, setAvailableWidth] = useState<number | null>(null);
  const [commandDisplayMode, setCommandDisplayMode] =
    useState<CommandDisplayMode>("text");
  const [boardFocusState, setBoardFocusState] = useState<{
    roundId: string | null;
    coordinate: HideSqueakCoordinate | null;
  }>({
    roundId: null,
    coordinate: null,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [draftSettings, setDraftSettings] = useState<HideSqueakSettingsDraft>({
    commandDisplayMode,
    difficulty: state.difficulty,
    playMode: state.playMode,
  });
  const [settingsDifficultyMouseState, setSettingsDifficultyMouseState] =
    useState<DifficultyMouseVisualState>(
      getInitialMouseStateForDifficulty(state.difficulty),
    );
  const [isBoardPinned, setIsBoardPinned] = useState(false);
  const [pinnedBoardItems, setPinnedBoardItems] = useState<
    HideSqueakItem[] | null
  >(null);
  const [reviewAnswerState] = useState<{
    roundId: string | null;
    revealed: boolean;
  }>({
    roundId: null,
    revealed: false,
  });
  const timerLastTickAtRef = useRef<number | null>(null);
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const settingsButtonRef = useRef<HTMLButtonElement | null>(null);
  const currentRound = state.currentRound;
  const isAwaitingNextRound =
    state.phase === "paused" &&
    (state.progress.validationResult === "correct" ||
      state.progress.validationResult === "wrong");
  const isReviewOpen = state.reviewState.isOpen && state.previousRound != null;
  const isRulesOpen = state.phase === "rules";

  const openSettingsPanel = useCallback(() => {
    setDraftSettings({
      commandDisplayMode,
      difficulty: state.difficulty,
      playMode: state.playMode,
    });
    setIsSettingsOpen(true);
  }, [commandDisplayMode, state.difficulty, state.playMode]);

  const closeSettingsPanel = useCallback(() => {
    setIsSettingsOpen(false);

    if (draftSettings.difficulty !== state.difficulty) {
      dispatch({
        type: "set-difficulty",
        difficulty: draftSettings.difficulty,
      });
    }

    if (draftSettings.playMode !== state.playMode) {
      dispatch({ type: "set-play-mode", playMode: draftSettings.playMode });
    }

    if (draftSettings.commandDisplayMode !== commandDisplayMode) {
      setCommandDisplayMode(draftSettings.commandDisplayMode);
    }
  }, [commandDisplayMode, draftSettings, state.difficulty, state.playMode]);

  const handleSelectDraftDifficulty = useCallback(
    (difficulty: HideSqueakDifficulty) => {
      setDraftSettings((current) =>
        current.difficulty === difficulty
          ? current
          : { ...current, difficulty },
      );
    },
    [],
  );

  const handleSelectTimedPlayMode = useCallback(() => {
    setDraftSettings((current) =>
      current.playMode === "timed"
        ? current
        : { ...current, playMode: "timed" },
    );
  }, []);

  const handleSelectEndlessPlayMode = useCallback(() => {
    setDraftSettings((current) =>
      current.playMode === "endless"
        ? current
        : { ...current, playMode: "endless" },
    );
  }, []);

  const handleSelectTextDirections = useCallback(() => {
    setDraftSettings((current) =>
      current.commandDisplayMode === "text"
        ? current
        : { ...current, commandDisplayMode: "text" },
    );
  }, []);

  const handleSelectSymbolDirections = useCallback(() => {
    setDraftSettings((current) =>
      current.commandDisplayMode === "symbol"
        ? current
        : { ...current, commandDisplayMode: "symbol" },
    );
  }, []);

  const handleSettingsButtonClick = useCallback(() => {
    if (isSettingsOpen) {
      closeSettingsPanel();
      return;
    }

    openSettingsPanel();
  }, [closeSettingsPanel, isSettingsOpen, openSettingsPanel]);

  useEffect(() => {
    const viewportElement = gameViewportRef.current;

    if (!viewportElement || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateAvailableWidth = () => {
      setAvailableWidth(viewportElement.clientWidth);
    };

    updateAvailableWidth();

    const observer = new ResizeObserver(() => {
      updateAvailableWidth();
    });

    observer.observe(viewportElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedBestScore = window.localStorage.getItem(
      HIDE_SQUEAK_BEST_TIMED_SCORE_KEY,
    );

    if (!savedBestScore) {
      return;
    }

    const parsedBestScore = Number.parseInt(savedBestScore, 10);

    if (!Number.isNaN(parsedBestScore)) {
      dispatch({
        type: "restore-timed-best",
        bestTimedScore: parsedBestScore,
      });
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      HIDE_SQUEAK_BEST_TIMED_SCORE_KEY,
      String(state.progress.bestTimedScore),
    );
  }, [state.progress.bestTimedScore]);

  useEffect(() => {
    if (state.phase !== "boot" && state.phase !== "generating-round") {
      return;
    }

    const nextRound = createPlayableRound(
      state.difficulty,
      isBoardPinned ? pinnedBoardItems : null,
    );
    dispatch({
      type: "round-generated",
      round: nextRound,
    });
  }, [isBoardPinned, pinnedBoardItems, state.difficulty, state.phase]);

  useEffect(() => {
    if (!isAwaitingNextRound) {
      return;
    }

    const nextRoundDelayMs =
      state.progress.validationResult === "wrong"
        ? NEXT_ROUND_DELAY_AFTER_WRONG_MS
        : NEXT_ROUND_DELAY_MS;

    const timeoutId = window.setTimeout(() => {
      dispatch({ type: "start-round-generation" });
    }, nextRoundDelayMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    isAwaitingNextRound,
    state.previousRound?.round.id,
    state.progress.validationResult,
  ]);

  useEffect(() => {
    if (
      !state.timer.isEnabled ||
      state.timer.isPaused ||
      state.phase === "finished"
    ) {
      timerLastTickAtRef.current = null;
      return;
    }

    timerLastTickAtRef.current = Date.now();

    const intervalId = window.setInterval(() => {
      const now = Date.now();
      const lastTickAt = timerLastTickAtRef.current ?? now;
      const elapsedSeconds = Math.floor((now - lastTickAt) / 1000);

      if (elapsedSeconds <= 0) {
        return;
      }

      timerLastTickAtRef.current = lastTickAt + elapsedSeconds * 1000;
      dispatch({
        type: "tick-timer",
        seconds: elapsedSeconds,
      });
    }, TIMER_TICK_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
      timerLastTickAtRef.current = null;
    };
  }, [state.phase, state.timer.isEnabled, state.timer.isPaused]);

  useEffect(() => {
    if (!isSettingsOpen) {
      return;
    }

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node | null;

      if (
        settingsRef.current?.contains(target) ||
        settingsButtonRef.current?.contains(target)
      ) {
        return;
      }

      closeSettingsPanel();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeSettingsPanel();
      }
    }

    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeSettingsPanel, isSettingsOpen]);

  function clearHintIfOpen() {
    if (state.hintState.isOpen) {
      dispatch({ type: "close-hint" });
    }
  }

  function toggleBoardPin() {
    setIsBoardPinned((current) => {
      const next = !current;

      if (next) {
        const sourceRound = currentRound ?? state.previousRound?.round ?? null;
        setPinnedBoardItems(sourceRound ? sourceRound.board.items : null);
      } else {
        setPinnedBoardItems(null);
      }

      return next;
    });
  }

  if (!currentRound || !currentRound.answerModel) {
    return null;
  }

  const reviewSnapshot: HideSqueakPreviousRoundSnapshot | null =
    state.previousRound;
  const reviewStepCount = reviewSnapshot?.round.commandSteps.length ?? 0;
  const boundedReviewStepIndex =
    state.reviewState.selectedStepIndex == null
      ? null
      : Math.min(
          Math.max(state.reviewState.selectedStepIndex, 0),
          Math.max(reviewStepCount - 1, 0),
        );
  const isReviewLastStepSelected =
    isReviewOpen &&
    reviewSnapshot &&
    boundedReviewStepIndex != null &&
    boundedReviewStepIndex === reviewStepCount - 1;
  const reviewAnswerRevealed =
    isReviewOpen && reviewSnapshot
      ? reviewAnswerState.roundId === reviewSnapshot.round.id
        ? reviewAnswerState.revealed
        : reviewSnapshot.result === "correct" || !!isReviewLastStepSelected
      : false;
  const reviewVisibleSteps =
    isReviewOpen && reviewSnapshot
      ? state.reviewState.visibility === "full-path"
        ? reviewSnapshot.round.commandSteps
        : boundedReviewStepIndex == null
          ? []
          : reviewSnapshot.round.commandSteps.slice(
              0,
              boundedReviewStepIndex + 1,
            )
      : [];
  const reviewBoardActiveCoordinate =
    isReviewOpen &&
    reviewSnapshot &&
    state.reviewState.visibility === "step-by-step" &&
    boundedReviewStepIndex == null
      ? reviewSnapshot.round.startingCoordinate
      : null;

  const activeCoordinate =
    boardFocusState.roundId === currentRound.id && boardFocusState.coordinate
      ? boardFocusState.coordinate
      : currentRound.startingCoordinate;
  const displayRound =
    isReviewOpen && reviewSnapshot ? reviewSnapshot.round : currentRound;
  const isBoardClickMode = currentRound.answerModel.kind === "board-cell";
  const showMouseOnBoard =
    HIDE_SQUEAK_DIFFICULTY_PRESETS[currentRound.difficulty].showMouseOnBoard;
  const shouldShowRulesBoardMouse =
    isRulesOpen && (currentRound.difficulty === "easy" || currentRound.difficulty === "medium");
  const shouldShowBoardMouse = isReviewOpen
    ? false
    : showMouseOnBoard || shouldShowRulesBoardMouse;
  const selectedWrongCoordinate =
    state.progress.validationResult === "wrong" &&
    state.progress.selectedAnswer &&
    !(
      state.progress.selectedAnswer.row === currentRound.answer.row &&
      state.progress.selectedAnswer.column === currentRound.answer.column
    )
      ? state.progress.selectedAnswer
      : null;
  const correctAnswerCoordinate =
    state.progress.validationResult !== "idle" ? currentRound.answer : null;
  const reviewWrongCoordinate =
    isReviewOpen &&
    reviewSnapshot?.result === "wrong" &&
    reviewSnapshot.selectedAnswer &&
    !(
      reviewSnapshot.selectedAnswer.row === reviewSnapshot.round.answer.row &&
      reviewSnapshot.selectedAnswer.column ===
        reviewSnapshot.round.answer.column
    )
      ? reviewSnapshot.selectedAnswer
      : null;
  const timeValue = getTimeBadgeValue(
    state.progress.roundNumber,
    state.timer.remainingSeconds,
    state.playMode === "timed",
  );
  const isAppliedTimedMode = state.playMode === "timed";
  const isWideBubbleMode =
    !isReviewOpen &&
    !isRulesOpen &&
    (currentRound.difficulty === "hard" ||
      currentRound.difficulty === "super-hard");
  const isDenseReviewBubbleMode =
    isReviewOpen &&
    reviewSnapshot != null &&
    (reviewSnapshot.round.difficulty === "hard" ||
      reviewSnapshot.round.difficulty === "super-hard");
  const hasReviewPreviousAccess = state.previousRound != null;
  const gameScale =
    availableWidth != null
      ? Math.min(1, availableWidth / HIDE_SQUEAK_GAME_BASE_WIDTH_PX)
      : 1;
  const scaledGameWidth = HIDE_SQUEAK_GAME_BASE_WIDTH_PX * gameScale;
  const scaledGameHeight = HIDE_SQUEAK_GAME_BASE_HEIGHT_PX * gameScale;

  return (
    <div ref={gameViewportRef} className="w-full overflow-visible">
      <div
        className="relative overflow-visible"
        style={{
          width: scaledGameWidth ? `${scaledGameWidth}px` : undefined,
          height: scaledGameHeight ? `${scaledGameHeight}px` : undefined,
        }}
      >
        <div
          className={`${GAME_CHROME_RADIUS_CLASS_NAME} bg-hs-shell shadow-hs-panel`}
          style={{
            width: `${HIDE_SQUEAK_GAME_BASE_WIDTH_PX}px`,
            height: `${HIDE_SQUEAK_GAME_BASE_HEIGHT_PX}px`,
            transform: `scale(${gameScale})`,
            transformOrigin: "top left",
          }}
        >
      <div className="relative">
        {isSettingsOpen ? (
          <div
            className={`absolute inset-0 z-20 ${GAME_CHROME_RADIUS_CLASS_NAME} bg-white/45`}
            aria-hidden="true"
          />
        ) : null}

        <div
          className={`relative z-[1] ${GAME_CHROME_TOP_RADIUS_CLASS_NAME} bg-hs-topbar pl-[25px] pr-3.5 py-[9px]`}
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-5">
              {isAppliedTimedMode ? (
                <TopStat label="Time" value={timeValue} />
              ) : null}
              <TopStat label="Score" value={String(state.progress.score)} />
              <TopStat label="Streak" value={String(state.progress.streak)} />
            </div>

            <SettingsButton
              buttonRef={settingsButtonRef}
              label={isSettingsOpen ? "Close settings" : "Open settings"}
              outlined={isSettingsOpen}
              className="h-10 w-10"
              onClick={handleSettingsButtonClick}
            />
          </div>
        </div>

        <div className="relative z-[1] px-2.5 pb-3.5 pt-2.5">
          <div className="grid grid-cols-[minmax(0,1fr)_250px] items-start gap-2.5">
            <div className="grid gap-1.5">
              <div className="grid grid-cols-[44px_minmax(0,1fr)_44px] items-end gap-1.5">
                <ReviewPreviousButton
                  isReviewOpen={isReviewOpen}
                  hasPreviousRound={hasReviewPreviousAccess}
                  onClick={() => {
                    if (!hasReviewPreviousAccess || !state.previousRound) {
                      return;
                    }

                    dispatch({
                      type: isReviewOpen ? "close-review" : "open-review",
                    });
                  }}
                />

                <div className="font-ui mx-auto flex min-h-[36px] w-auto max-w-[400px] items-center justify-center rounded-[18px] bg-hs-panel px-5 py-2 text-center text-[1rem] font-medium leading-[1.15] text-hs-textSecondary">
                  {isReviewOpen
                    ? "You can review the previous round here"
                    : "Figure out which item the mouse found."}
                </div>

                <RestartBoardButton
                  isPinned={isBoardPinned}
                  onClick={() => {
                    if (state.phase === "finished") {
                      dispatch({ type: "restart-session" });
                      return;
                    }

                    dispatch({ type: "start-round-generation" });
                  }}
                />
              </div>

              <div className="relative pr-[35px]">
                <HideSqueakBoardSurface
                  round={displayRound}
                  showMouse={shouldShowBoardMouse}
                  visibleMouseCoordinate={null}
                  pathSteps={isReviewOpen ? reviewVisibleSteps : []}
                  activeCoordinate={
                    isReviewOpen
                      ? reviewBoardActiveCoordinate
                      : activeCoordinate
                  }
                  selectedCoordinate={
                    isReviewOpen ? null : state.progress.selectedAnswer
                  }
                  validationResult={
                    isReviewOpen ? "idle" : state.progress.validationResult
                  }
                  isInteractive={
                    (isReviewOpen &&
                      state.reviewState.visibility === "step-by-step" &&
                      boundedReviewStepIndex == null) ||
                    (!isReviewOpen &&
                      !isRulesOpen &&
                      (state.phase === "playing" || state.phase === "hint") &&
                      isBoardClickMode)
                  }
                  correctAnswerCoordinate={
                    isReviewOpen && reviewSnapshot
                      ? reviewAnswerRevealed
                        ? reviewSnapshot.round.answer
                        : null
                      : correctAnswerCoordinate
                  }
                  wrongAnswerCoordinate={
                    isReviewOpen
                      ? reviewWrongCoordinate
                      : selectedWrongCoordinate
                  }
                  showStartLabel={
                    isReviewOpen
                      ? true
                      : HIDE_SQUEAK_DIFFICULTY_PRESETS[currentRound.difficulty]
                          .showMouseOnBoard && !isRulesOpen
                  }
                  mousePose={isReviewOpen ? "standing" : "head"}
                  isReviewMode={isReviewOpen}
                  onActiveCoordinateChange={(coordinate) => {
                    if (isReviewOpen) {
                      return;
                    }

                    clearHintIfOpen();
                    setBoardFocusState({
                      roundId: currentRound.id,
                      coordinate,
                    });
                  }}
                  onCellSelect={(coordinate) => {
                    if (isReviewOpen) {
                      if (
                        reviewSnapshot &&
                        state.reviewState.visibility === "step-by-step" &&
                        boundedReviewStepIndex == null &&
                        coordinate.row ===
                          reviewSnapshot.round.startingCoordinate.row &&
                        coordinate.column ===
                          reviewSnapshot.round.startingCoordinate.column
                      ) {
                        dispatch({
                          type: "set-review-step",
                          stepIndex: 0,
                        });
                      }
                      return;
                    }

                    if (
                      isRulesOpen ||
                      (state.phase !== "playing" && state.phase !== "hint") ||
                      !isBoardClickMode
                    ) {
                      return;
                    }

                    clearHintIfOpen();
                    dispatch({
                      type: "submit-coordinate-answer",
                      coordinate,
                    });
                  }}
                />

                <BoardPinButton
                  isPinned={isBoardPinned}
                  onClick={toggleBoardPin}
                />

                <BoardIconButton
                  icon={moreInfoUrl}
                  label={isRulesOpen ? "Close rules" : "Open rules"}
                  isActive={isRulesOpen}
                  className="absolute bottom-0 right-[-10px] z-10"
                  onClick={() => {
                    dispatch({
                      type: isRulesOpen ? "close-rules" : "open-rules",
                    });
                  }}
                />
              </div>
            </div>

            <DirectionsBubble
              MouseSvg={isReviewOpen ? MouseRunningSvg : MouseStandingSvg}
              showTail={!isReviewOpen}
              showMouse
              bubbleWrapperClassName={
                isWideBubbleMode
                  ? "absolute bottom-0 left-[-35px] mb-0 mr-0"
                  : ""
              }
              bubbleClassName={
                isDenseReviewBubbleMode
                  ? "box-border w-[220px] min-w-[220px] max-w-[220px] px-3.5 pb-4 pt-4"
                  : isWideBubbleMode
                  ? "box-border w-[285px] min-w-[285px] max-w-[285px] pb-5"
                  : ""
              }
              mouseClassName={
                isDenseReviewBubbleMode || isWideBubbleMode ? "h-[88px] w-[88px]" : ""
              }
              tailClassName={
                isDenseReviewBubbleMode || isWideBubbleMode ? "right-[80px]" : ""
              }
            >
              {isReviewOpen && reviewSnapshot ? (
                <HideSqueakReviewPanel
                  snapshot={reviewSnapshot}
                  visibility={state.reviewState.visibility}
                  selectedStepIndex={boundedReviewStepIndex}
                  onSelectStep={(stepIndex) =>
                    dispatch({
                      type: "set-review-step",
                      stepIndex,
                    })
                  }
                  onVisibilityChange={(visibility) =>
                    dispatch({
                      type: "set-review-visibility",
                      visibility,
                    })
                  }
                />
              ) : (
                <>
                  <HideSqueakCommandPanel
                    round={currentRound}
                    displayMode={commandDisplayMode}
                    isRules={isRulesOpen}
                  />
                  {!isRulesOpen ? (
                    <HideSqueakAnswerPanel
                      key={currentRound.id}
                      round={currentRound}
                      validationResult={state.progress.validationResult}
                      isWaitingForNextRound={isAwaitingNextRound}
                      onInteraction={clearHintIfOpen}
                      onCoordinateSelect={(coordinate) => {
                        if (
                          state.phase !== "playing" &&
                          state.phase !== "hint"
                        ) {
                          return;
                        }

                        clearHintIfOpen();
                        dispatch({
                          type: "submit-coordinate-answer",
                          coordinate,
                        });
                      }}
                      onTypedSubmit={(input) => {
                        const validation = validateTypedCoordinateAnswer(
                          input,
                          {
                            answer: currentRound.answer,
                            board: currentRound.board,
                          },
                        );

                        if (validation.isValidFormat) {
                          clearHintIfOpen();
                          dispatch({
                            type: "submit-typed-answer",
                            input,
                          });
                        }

                        return validation;
                      }}
                    />
                  ) : null}
                </>
              )}
            </DirectionsBubble>
          </div>
        </div>

        {isSettingsOpen ? (
          <HideSqueakSettingsPanel
            settingsRef={settingsRef}
            draftSettings={draftSettings}
            settingsDifficultyMouseState={settingsDifficultyMouseState}
            onClose={closeSettingsPanel}
            onSelectDifficulty={handleSelectDraftDifficulty}
            onSettledMouseStateChange={setSettingsDifficultyMouseState}
            onSelectTimed={handleSelectTimedPlayMode}
            onSelectEndless={handleSelectEndlessPlayMode}
            onSelectText={handleSelectTextDirections}
            onSelectSymbol={handleSelectSymbolDirections}
          />
        ) : null}
      </div>
        </div>
      </div>
    </div>
  );
}
