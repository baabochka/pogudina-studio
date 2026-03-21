import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { FiveCardBoard } from "./FiveCardBoard";
import { HintPawStep } from "./HintPawStep";
import { GameQuickStartGuide } from "./GameQuickStartGuide";
import { ReviewCardIllustration } from "./ReviewCardIllustration";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";
import reverseCard from "./assets/reverse.svg";
import {
  ORIGINAL_COLOR_BY_OBJECT,
  type ObjectName,
  type PaletteName,
} from "./cardResolver";
import { GameBoardSmallIllustration } from "./illustrations/GameBoardSmallIllustration";
import { useGameSession } from "./useGameSession";
import {
  ANSWER_BUTTON_CENTERS,
  ANSWER_BUTTON_OVERLAYS,
  ANSWER_PAW_STROKE_COLOR,
  BOARD_ANSWER_OPTIONS,
  BOARD_CONTROL_OVERLAYS,
  BOARD_VIEWBOX,
  CORRECT_ANSWER_PAW_FILL_COLOR,
  createPawTrailSteps,
  getPawTrailStyle,
  INCORRECT_ANSWER_PAW_FILL_COLOR,
  PAW_TRAIL_FILL_COLOR,
  PAW_TRAIL_STROKE_COLOR,
} from "./gameBoardRoundConfig";
import type { BoardControlName } from "./gameBoardRoundConfig";
import type { ResolvedCard } from "./cardResolver";
import { CARD_TRANSITION_PHASE_MS } from "./gameSessionUtils";
import type { GameMode } from "./gameMode";
import { fixedDetails } from "./palettes";

type CardTransitionStage = "idle" | "to-reverse" | "to-next";
type OverlayLayout = {
  height: number;
  left: number;
  top: number;
  width: number;
};

const BOARD_FRAME_PIECES = [
  { key: "right", x: 259.59, y: 115.09, width: 61.78, height: 304.96 },
  { key: "top", x: 90.92, y: 51.96, width: 84.72, height: 33.3 },
  { key: "bottom", x: 89.52, y: 450.58, width: 87.52, height: 33.3 },
  { key: "left", x: 0.02, y: 116.01, width: 28.38, height: 303.11 },
] as const;

const BOARD_HORIZONTAL_STRETCH_SCALE = 3.5;
const BOARD_VERTICAL_STRETCH_SCALE = 1.2;
const RIGHT_FRAME_X = 259.59;
const RIGHT_FRAME_TOP_Y = 115.09;
const RIGHT_FRAME_WIDTH = 61.78;
const TOKEN_STACK_CENTER_SPACING = 65;
const TOKEN_STACK_TOP_OFFSET = -20;
const HORIZONTAL_STRETCH_OFFSET =
  BOARD_FRAME_PIECES[1].width * (BOARD_HORIZONTAL_STRETCH_SCALE - 1);
const VERTICAL_STRETCH_OFFSET =
  BOARD_FRAME_PIECES[3].height * (BOARD_VERTICAL_STRETCH_SCALE - 1);

const SCORE_BACKGROUND_PIECE = {
  x: 0.02,
  y: 0,
  width: 321.34,
  height: 51.95,
} as const;

const FIVE_CARD_BOARD_BOUNDS = {
  x: 0.02,
  y: 51.95,
  width: BOARD_VIEWBOX.width,
  height: BOARD_VIEWBOX.height - 51.95,
} as const;

const SINGLE_CARD_BOARD_BOUNDS = {
  left: "0.11%",
  top: "10.83%",
  width: "89.6%",
  height: "89.1%",
} as const;

const COMPACT_OVERLAY_BOUNDS = {
  left: "8.81%",
  top: "17.62%",
  width: "71.95%",
  height: "75.49%",
} as const;

const ANSWER_BUTTON_LAYOUT: Record<ObjectName, OverlayLayout> = {
  mouse: { left: 80.4, top: 23.8, width: 19.3, height: 12.8 },
  cat: { left: 80.4, top: 36.5, width: 19.3, height: 12.8 },
  cheese: { left: 80.4, top: 48.6, width: 19.3, height: 12.8 },
  ball: { left: 80.4, top: 61.2, width: 19.3, height: 12.8 },
  pillow: { left: 80.4, top: 73.7, width: 19.3, height: 12.8 },
};

const TOKEN_WIDTH = (ANSWER_BUTTON_LAYOUT.mouse.width / 100) * BOARD_VIEWBOX.width;
const TOKEN_HEIGHT = (ANSWER_BUTTON_LAYOUT.mouse.height / 100) * BOARD_VIEWBOX.height;
const STRETCHED_RIGHT_FRAME_HEIGHT = BOARD_FRAME_PIECES[0].height * BOARD_VERTICAL_STRETCH_SCALE;
const TOKEN_STACK_HEIGHT =
  TOKEN_HEIGHT + TOKEN_STACK_CENTER_SPACING * (BOARD_ANSWER_OPTIONS.length - 1);
const TOKEN_STACK_TOP =
  RIGHT_FRAME_TOP_Y +
  (STRETCHED_RIGHT_FRAME_HEIGHT - TOKEN_STACK_HEIGHT) / 2 +
  TOKEN_STACK_TOP_OFFSET;
const TOKEN_STACK_LEFT =
  RIGHT_FRAME_X + HORIZONTAL_STRETCH_OFFSET + (RIGHT_FRAME_WIDTH - TOKEN_WIDTH) / 2;

const COMPACT_ANSWER_BUTTON_CENTERS: Record<ObjectName, { x: number; y: number }> = {
  mouse: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2,
  },
  cat: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING,
  },
  cheese: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 2,
  },
  ball: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 3,
  },
  pillow: {
    x: TOKEN_STACK_LEFT + TOKEN_WIDTH / 2,
    y: TOKEN_STACK_TOP + TOKEN_HEIGHT / 2 + TOKEN_STACK_CENTER_SPACING * 4,
  },
};

const CONTROL_LAYOUT: Record<BoardControlName, OverlayLayout> = {
  previous: { left: 0.9, top: 11.1, width: 13.8, height: 11.4 },
  restart: { left: 80.1, top: 11.7, width: 19.1, height: 11.8 },
  rules: { left: 0.2, top: 91.1, width: 13.8, height: 8.6 },
  "five-card-mode": { left: 78.8, top: 86.8, width: 20.8, height: 13.1 },
};

const OBJECT_BY_ORIGINAL_COLOR = Object.entries(
  ORIGINAL_COLOR_BY_OBJECT,
).reduce(
  (accumulator, [objectName, colorName]) => {
    accumulator[colorName as PaletteName] = objectName as ObjectName;
    return accumulator;
  },
  {} as Record<PaletteName, ObjectName>,
);

const SINGLE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "Each object has one original color: cat is orange, mouse is grey, cheese is yellow, ball is blue, and pillow is red. The tokens on the right show the correct color for each object.",
      "If an object on the card has its original color, that object is the correct answer.",
      "Example: if you see an orange cat on a blue pillow, the correct answer is cat.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "If none of the objects on the card have their original colors, the answer is the object that is missing from the card and whose color is also missing.",
      "To solve it, first remove the objects that are already on the card.",
      "Then remove any object whose original color is already visible on the card.",
      "The only object left is the correct answer.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "Example: if you see a grey mouse on a blue pillow, first remove mouse and pillow because they are already on the card.",
      "Then remove mouse and ball because grey and blue are already on the card.",
      "The only answer left is cheese.",
      "Choose an answer by clicking one of the tokens on the right. If you choose wrong, the paw trail will guide you to the correct answer.",
    ],
  },
  {
    title: "How to play",
    paragraphs: [
      "Use the top-right paw to restart.",
      "Use the back-arrow paw to review the previous answer.",
    ],
  },
] as const;

const FIVE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "In five-card mode, the answer to the round is the answer that repeats twice across the five cards.",
      "Solve each card using the one-card rules, then choose the answer that appears twice.",
      "One-card rules:",
      "Each object has one original color: cat is orange, mouse is grey, cheese is yellow, ball is blue, and pillow is red.",
      "If an object on the card has its original color, that object is the correct answer for that card.",
      "If none of the objects on the card have their original colors, remove the shown objects and any object whose original color is already visible on the card.",
      "The only answer left is the correct answer for that card. After solving all five cards, pick the answer that repeats twice.",
      "Use the top-right paw to restart and the back-arrow paw to review the previous answer.",
    ],
  },
] as const;

function RulesNavArrow({ direction }: { direction: "next" | "previous" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 16"
      className={direction === "next" ? "h-6 w-9 shrink-0" : "h-6 w-9 shrink-0"}
      fill="none"
      style={direction === "next" ? { transform: "scaleX(-1)" } : undefined}
    >
      <g
        transform={direction === "next" ? "translate(0 -3)" : "translate(0 -3)"}
      >
        <path
          fill={fixedDetails.board.dark}
          d="m20.56,11.81c.15.43-.17.96-.7,1.19-.54.23-1.09.06-1.24-.37-.7-2.01-2.1-3.09-3.86-2.96-1.71.13-3.59,1.38-5.04,3.36.43.24.77.51.94.76,0,.02,0,.04,0,.07-.52.75-2.72,1.43-3.63,1.44-.05,0-.1-.02-.13-.05-.53-.52-1.13-2.15-.8-2.92,0-.02.03-.04.06-.05.49-.15,1.19-.09,1.89.09,1.09-1.5,2.39-2.69,3.77-3.46,1.04-.58,2.12-.93,3.21-1,2.58-.18,4.6,1.24,5.52,3.9Z"
        />
      </g>
    </svg>
  );
}

function formatColoredObject(color: PaletteName, object: ObjectName) {
  return `${color} ${object}`;
}

type ReviewExplanationParagraph = {
  content: ReactNode;
  key: string;
};

function CardTransitionFace({
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

function CardFlipTransition({
  backFace,
  className = "",
  frontFace,
  transitionKey,
}: {
  backFace: ReactNode;
  className?: string;
  frontFace: ReactNode;
  transitionKey: string;
}) {
  return (
    <div key={transitionKey} className="card-transition-scene h-full w-full">
      <div className={`card-transition-rotor ${className}`.trim()}>
        <CardTransitionFace side="back">{frontFace}</CardTransitionFace>
        <CardTransitionFace side="front">{backFace}</CardTransitionFace>
      </div>
    </div>
  );
}

function BoardFrame({ isStretched }: { isStretched: boolean }) {
  const horizontalStretchScale = isStretched
    ? BOARD_HORIZONTAL_STRETCH_SCALE
    : 1;
  const verticalStretchScale = isStretched
    ? BOARD_VERTICAL_STRETCH_SCALE
    : 1;
  const horizontalOffset = isStretched ? HORIZONTAL_STRETCH_OFFSET : 0;
  const verticalOffset = isStretched ? VERTICAL_STRETCH_OFFSET : 0;

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute"
        style={{
          left: `${(SCORE_BACKGROUND_PIECE.x / BOARD_VIEWBOX.width) * 100}%`,
          top: `${(SCORE_BACKGROUND_PIECE.y / BOARD_VIEWBOX.height) * 100}%`,
          width: `${(
            (SCORE_BACKGROUND_PIECE.width + horizontalOffset) /
            BOARD_VIEWBOX.width
          ) * 100}%`,
          height: `${(SCORE_BACKGROUND_PIECE.height / BOARD_VIEWBOX.height) * 100}%`,
          background: "var(--board-dark-fill)",
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      />

      {BOARD_FRAME_PIECES.map((piece) => (
        <div
          key={piece.key}
          className="absolute"
          style={{
            left: `${(
              (piece.x +
                (piece.key === "right" ? horizontalOffset : 0)) /
              BOARD_VIEWBOX.width
            ) * 100}%`,
            top: `${(
              (piece.y +
                (piece.key === "bottom" ? verticalOffset : 0)) /
              BOARD_VIEWBOX.height
            ) * 100}%`,
            width: `${(
              (piece.width *
                (piece.key === "top" || piece.key === "bottom"
                  ? horizontalStretchScale
                  : 1)) /
              BOARD_VIEWBOX.width
            ) * 100}%`,
            height: `${(
              (piece.height *
                (piece.key === "left" || piece.key === "right"
                  ? verticalStretchScale
                  : 1)) /
              BOARD_VIEWBOX.height
            ) * 100}%`,
            background: "var(--board-light-fill)",
          }}
        />
      ))}
    </div>
  );
}

function getOverlayStyle(
  layout: OverlayLayout,
  translateX = 0,
  translateY = 0,
): CSSProperties {
  return {
    left: `${layout.left + (translateX / BOARD_VIEWBOX.width) * 100}%`,
    top: `${layout.top + (translateY / BOARD_VIEWBOX.height) * 100}%`,
    width: `${layout.width}%`,
    height: `${layout.height}%`,
  };
}

function getCompactTokenOverlayStyle(answer: ObjectName): CSSProperties {
  const index = BOARD_ANSWER_OPTIONS.indexOf(answer);
  const top = TOKEN_STACK_TOP + index * TOKEN_STACK_CENTER_SPACING;

  return {
    left: `${(TOKEN_STACK_LEFT / BOARD_VIEWBOX.width) * 100}%`,
    top: `${(top / BOARD_VIEWBOX.height) * 100}%`,
    width: `${(TOKEN_WIDTH / BOARD_VIEWBOX.width) * 100}%`,
    height: `${(TOKEN_HEIGHT / BOARD_VIEWBOX.height) * 100}%`,
  };
}

function getReviewExplanation(card: {
  objectA: ObjectName;
  objectB: ObjectName;
  colorA: PaletteName;
  colorB: PaletteName;
  targetAnswer?: ObjectName;
}): ReviewExplanationParagraph[] {
  const firstObjectIsCorrectlyColored =
    ORIGINAL_COLOR_BY_OBJECT[card.objectA] === card.colorA;
  const secondObjectIsCorrectlyColored =
    ORIGINAL_COLOR_BY_OBJECT[card.objectB] === card.colorB;

  if (firstObjectIsCorrectlyColored || secondObjectIsCorrectlyColored) {
    const correctlyColoredObject = firstObjectIsCorrectlyColored
      ? formatColoredObject(card.colorA, card.objectA)
      : formatColoredObject(card.colorB, card.objectB);

    return [
      {
        key: "correctly-colored",
        content: (
          <>
            The tokens on the right show the correct color for each object. This
            card has <strong>{correctlyColoredObject}</strong>, and it is in its
            original color. So the correct answer is{" "}
            <strong>{correctlyColoredObject}</strong>.
          </>
        ),
      },
    ];
  }

  const firstRemovedByColor = OBJECT_BY_ORIGINAL_COLOR[card.colorA];
  const secondRemovedByColor = OBJECT_BY_ORIGINAL_COLOR[card.colorB];
  const correctAnswerText = card.targetAnswer
    ? formatColoredObject(
        ORIGINAL_COLOR_BY_OBJECT[card.targetAnswer],
        card.targetAnswer,
      )
    : "the correct answer";

  return [
    {
      key: "card-contents",
      content: (
        <>
          This card has{" "}
          <strong>{formatColoredObject(card.colorA, card.objectA)}</strong> and{" "}
          <strong>{formatColoredObject(card.colorB, card.objectB)}</strong>, and
          neither one is in its original color. The tokens on the right show the
          correct color for each object.
        </>
      ),
    },
    {
      key: "remove-objects",
      content: (
        <>
          So the answer is not <strong>{card.objectA}</strong> or{" "}
          <strong>{card.objectB}</strong>. And the answer is not{" "}
          <strong>{firstRemovedByColor}</strong> or{" "}
          <strong>{secondRemovedByColor}</strong>.
        </>
      ),
    },
    {
      key: "remaining-answer",
      content: (
        <>
          This leaves us with the only possible answer:{" "}
          <strong>{correctAnswerText}</strong>.
        </>
      ),
    },
  ];
}

function getFiveCardReviewExplanation(previousTurn: {
  cards: ResolvedCard[];
  correctAnswer: ObjectName;
}) {
  const repeatedAnswer = formatColoredObject(
    ORIGINAL_COLOR_BY_OBJECT[previousTurn.correctAnswer],
    previousTurn.correctAnswer,
  );

  return [
    {
      key: "five-card-explanation",
      content: (
        <>
          In five-card mode each card has a solution, which can be found
          according to one-card rules. The overall answer will be the token
          that repeats for two different cards. Here, that repeated answer is{" "}
          <strong>{repeatedAnswer}</strong>.
        </>
      ),
    },
  ] satisfies ReviewExplanationParagraph[];
}

export function GameBoardRound({
  boardHeightClassName = "h-[483.89px]",
}: {
  boardHeightClassName?: string;
} = {}) {
  const [hasStarted, setHasStarted] = useState(false);
  const [gameMode, setGameMode] = useState<GameMode>("single-card");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isPreviousReviewOpen, setIsPreviousReviewOpen] = useState(false);
  const [isExplanationVisible, setIsExplanationVisible] = useState(false);
  const {
    card,
    cards,
    correctAnswer,
    selectedAnswer,
    previousTurn,
    score,
    answeredCount,
    bestTotal,
    timeLeft,
    pawTrailRunId,
    cardSequence,
    isCardTransitioning,
    canAnswer,
    isRoundFinished,
    submitAnswer,
    restartRound,
  } = useGameSession({
    isPaused: isRulesOpen || isPreviousReviewOpen || !hasStarted,
    mode: gameMode,
  });
  const [hoveredAnswer, setHoveredAnswer] = useState<
    null | (typeof BOARD_ANSWER_OPTIONS)[number]
  >(null);
  const [hoveredControl, setHoveredControl] = useState<BoardControlName | null>(
    null,
  );
  const [displayCard, setDisplayCard] = useState(card);
  const [previousCard, setPreviousCard] = useState<ResolvedCard | null>(null);
  const [cardTransitionStage, setCardTransitionStage] =
    useState<CardTransitionStage>("idle");
  const [rulesPageIndex, setRulesPageIndex] = useState(0);
  const timeoutRefs = useRef<number[]>([]);
  const isBoardStretched = gameMode === "five-card";
  const lastRenderedCardRef = useRef(card);
  const suppressNextCardTransitionRef = useRef(false);
  const lastOverlayTriggerRef = useRef<HTMLElement | null>(null);
  const previousOverlayOpenRef = useRef(false);
  const rulesCloseButtonRef = useRef<HTMLButtonElement | null>(null);
  const explanationToggleButtonRef = useRef<HTMLButtonElement | null>(null);
  const previousControlButtonRef = useRef<HTMLButtonElement | null>(null);
  const rulesControlButtonRef = useRef<HTMLButtonElement | null>(null);
  const fiveCardModeButtonRef = useRef<HTMLButtonElement | null>(null);
  const rulesTitleId = useId();
  const reviewTitleId = useId();
  const effectiveHoveredAnswer =
    hasStarted && canAnswer && !isRulesOpen && !isPreviousReviewOpen
      ? hoveredAnswer
      : null;
  const rulesPages =
    gameMode === "five-card" ? FIVE_CARD_RULES_PAGES : SINGLE_CARD_RULES_PAGES;
  const clampedRulesPageIndex = Math.min(
    rulesPageIndex,
    rulesPages.length - 1,
  );
  const currentRulesPage = rulesPages[clampedRulesPageIndex];
  const canGoToPreviousRulesPage = clampedRulesPageIndex > 0;
  const canGoToNextRulesPage = clampedRulesPageIndex < rulesPages.length - 1;
  const closeRules = () => setIsRulesOpen(false);
  const closePreviousReview = () => {
    setIsPreviousReviewOpen(false);
    setIsExplanationVisible(false);
  };
  const isPreviousReviewAvailable = previousTurn != null;
  const isInteractionOverlayOpen = isRulesOpen || isPreviousReviewOpen;

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeoutId) =>
        window.clearTimeout(timeoutId),
      );
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (isRulesOpen) {
      rulesCloseButtonRef.current?.focus();
      previousOverlayOpenRef.current = true;
      return;
    }

    if (isPreviousReviewOpen) {
      explanationToggleButtonRef.current?.focus();
      previousOverlayOpenRef.current = true;
      return;
    }

    if (previousOverlayOpenRef.current) {
      lastOverlayTriggerRef.current?.focus();
      previousOverlayOpenRef.current = false;
    }
  }, [isPreviousReviewOpen, isRulesOpen]);

  useEffect(() => {
    if (!isInteractionOverlayOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();

      if (isRulesOpen) {
        closeRules();
        return;
      }

      if (isPreviousReviewOpen) {
        closePreviousReview();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isInteractionOverlayOpen, isPreviousReviewOpen, isRulesOpen]);

  useEffect(() => {
    if (suppressNextCardTransitionRef.current) {
      timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutRefs.current = [];
      suppressNextCardTransitionRef.current = false;
      lastRenderedCardRef.current = card;
      return;
    }

    if (isBoardStretched) {
      lastRenderedCardRef.current = card;
      return;
    }

    if (lastRenderedCardRef.current === card) {
      return;
    }

    timeoutRefs.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
    timeoutRefs.current = [];

    const outgoingCard = lastRenderedCardRef.current;
    setPreviousCard(outgoingCard);
    setDisplayCard(card);
    setCardTransitionStage("to-reverse");

    const toNextTimeoutId = window.setTimeout(() => {
      setCardTransitionStage("to-next");
    }, CARD_TRANSITION_PHASE_MS);

    const finishTimeoutId = window.setTimeout(() => {
      setCardTransitionStage("idle");
      setPreviousCard(null);
      lastRenderedCardRef.current = card;
    }, CARD_TRANSITION_PHASE_MS * 2);

    timeoutRefs.current = [toNextTimeoutId, finishTimeoutId];
  }, [card, cardSequence, isBoardStretched]);

  const answerPawFillColor =
    selectedAnswer == null
      ? undefined
      : selectedAnswer === correctAnswer
        ? CORRECT_ANSWER_PAW_FILL_COLOR
        : INCORRECT_ANSWER_PAW_FILL_COLOR;
  const answerPawStrokeColor =
    selectedAnswer == null ? undefined : ANSWER_PAW_STROKE_COLOR;

  const activeAnswerCenters = isBoardStretched
    ? COMPACT_ANSWER_BUTTON_CENTERS
    : ANSWER_BUTTON_CENTERS;

  const pawTrailSteps = useMemo(() => {
    if (
      !selectedAnswer ||
      !correctAnswer ||
      selectedAnswer === correctAnswer
    ) {
      return [];
    }

    return createPawTrailSteps(
      activeAnswerCenters[selectedAnswer],
      activeAnswerCenters[correctAnswer],
      3,
      pawTrailRunId,
    );
  }, [activeAnswerCenters, correctAnswer, pawTrailRunId, selectedAnswer]);

  const targetHintPosition =
    selectedAnswer && correctAnswer && selectedAnswer !== correctAnswer
      ? activeAnswerCenters[correctAnswer]
      : null;
  const targetHintDelay =
    pawTrailSteps.length > 0 ? `${pawTrailSteps.length * 180 + 220}ms` : "0ms";
  const isAnimatingCardTransition =
    cardTransitionStage !== "idle" && previousCard != null;
  const scoreboardNumberStyle = {
    fontFamily: '"Hannotate TC", sans-serif',
    fontSize: "17px",
    fontWeight: 700,
    lineHeight: 1,
  } as const;
  const boardFrameStyle = {
    "--board-light-fill": fixedDetails.board.light,
    "--board-dark-fill": fixedDetails.board.dark,
  } as CSSProperties;
  const previousReviewExplanation = previousTurn
    ? previousTurn.mode === "five-card"
      ? getFiveCardReviewExplanation(previousTurn)
      : getReviewExplanation(previousTurn.cards[0])
    : [];
  const answerOverlayTranslateY = {
    mouse:
      isBoardStretched
        ? 0
        : 0,
    cat:
      isBoardStretched
        ? 0
        : 0,
    cheese:
      isBoardStretched
        ? 0
        : 0,
    ball:
      isBoardStretched
        ? 0
        : 0,
    pillow:
      isBoardStretched
        ? 0
        : 0,
  } satisfies Record<ObjectName, number>;
  const horizontalOverlayOffset = isBoardStretched ? HORIZONTAL_STRETCH_OFFSET : 0;
  const verticalOverlayOffset = isBoardStretched ? VERTICAL_STRETCH_OFFSET : 0;
  const fiveCardBoardAreaStyle = {
    left: `${(FIVE_CARD_BOARD_BOUNDS.x / BOARD_VIEWBOX.width) * 100}%`,
    top: `${(FIVE_CARD_BOARD_BOUNDS.y / BOARD_VIEWBOX.height) * 100}%`,
    width: `${(
      (FIVE_CARD_BOARD_BOUNDS.width + horizontalOverlayOffset) /
      BOARD_VIEWBOX.width
    ) * 100}%`,
    height: `${(
      (FIVE_CARD_BOARD_BOUNDS.height + verticalOverlayOffset) /
      BOARD_VIEWBOX.height
    ) * 100}%`,
  } satisfies CSSProperties;
  const useCompactOverlayViewport =
    (isRulesOpen && !isBoardStretched) ||
    (isPreviousReviewOpen && previousTurn?.mode !== "five-card");
  const activeBoardAreaStyle =
    isBoardStretched ? fiveCardBoardAreaStyle : SINGLE_CARD_BOARD_BOUNDS;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-start">
        <div
          className="relative"
          style={{
            paddingBottom: isBoardStretched ? `${VERTICAL_STRETCH_OFFSET}px` : undefined,
            paddingRight: isBoardStretched ? `${HORIZONTAL_STRETCH_OFFSET}px` : undefined,
          }}
        >
          <div
            className={`relative overflow-visible ${boardHeightClassName}`}
            style={boardFrameStyle}
          >
            <BoardFrame isStretched={isBoardStretched} />

            <GameBoardSmallIllustration
              className="relative h-full w-auto"
              selectedAnswer={
                isPreviousReviewOpen
                  ? previousTurn?.selectedAnswer
                  : (selectedAnswer ?? undefined)
              }
              hoveredAnswer={effectiveHoveredAnswer ?? undefined}
              hoveredControl={hoveredControl ?? undefined}
              isPreviousReviewActive={isPreviousReviewOpen}
              isRulesActive={isRulesOpen}
              showPreviousControl={isPreviousReviewAvailable}
              answerPawFillColor={
                isPreviousReviewOpen
                  ? previousTurn?.wasCorrect
                    ? CORRECT_ANSWER_PAW_FILL_COLOR
                    : INCORRECT_ANSWER_PAW_FILL_COLOR
                  : answerPawFillColor
              }
              answerPawStrokeColor={
                isPreviousReviewOpen
                  ? previousTurn?.selectedAnswer
                    ? ANSWER_PAW_STROKE_COLOR
                    : undefined
                  : answerPawStrokeColor
              }
              highlightedAnswer={
                isPreviousReviewOpen ? previousTurn?.correctAnswer : undefined
              }
              highlightedAnswerPawFillColor={
                isPreviousReviewOpen ? CORRECT_ANSWER_PAW_FILL_COLOR : undefined
              }
              highlightedAnswerPawStrokeColor={
                isPreviousReviewOpen ? ANSWER_PAW_STROKE_COLOR : undefined
              }
              isBoardStretched={isBoardStretched}
            />

            <div
              className="pointer-events-none absolute inset-0 text-white"
              aria-hidden="true"
            >
            <div
              className="absolute left-[24.37%] top-[5.29%] -translate-x-1/2 -translate-y-1/2 leading-none"
              style={scoreboardNumberStyle}
            >
              {timeLeft}
            </div>
            <div
              className="absolute left-[57.22%] top-[5.29%] -translate-x-1/2 -translate-y-1/2 leading-none"
              style={scoreboardNumberStyle}
            >
              {score}
            </div>
            <div
              className="absolute left-[90.06%] top-[5.29%] -translate-x-1/2 -translate-y-1/2 leading-none"
              style={scoreboardNumberStyle}
            >
              {bestTotal}
            </div>
            </div>

            <div
              className={
                useCompactOverlayViewport
                  ? "absolute"
                  : "absolute [perspective:1200px]"
              }
              style={
                useCompactOverlayViewport
                  ? COMPACT_OVERLAY_BOUNDS
                  : activeBoardAreaStyle
              }
            >
            {isRulesOpen ? (
              <section
                className={`flex h-full w-full flex-col text-[#22304a] ${
                  isBoardStretched
                    ? "pt-14 pl-12 pb-12 pr-24"
                    : "px-5 pt-6 pb-4"
                }`}
                role="dialog"
                aria-modal="true"
                aria-labelledby={rulesTitleId}
              >
                <header className="relative text-center">
                  <button
                    ref={rulesCloseButtonRef}
                    type="button"
                    onClick={closeRules}
                    className="absolute right-0 -top-[10px] text-[20px] leading-none"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                      color: fixedDetails.board.dark,
                    }}
                    aria-label="Close rules"
                  >
                    ×
                  </button>
                  <p
                    id={rulesTitleId}
                    className="text-[19px] leading-none"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {currentRulesPage.title}
                  </p>
                </header>

                <article
                  className="mt-2 flex-1 min-h-0"
                >
                  <div
                    className="h-full px-1 text-left text-[15px] leading-[1.35] text-[#22304a]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    {currentRulesPage.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className={
                          paragraph === "One-card rules:"
                            ? "mb-3 text-center font-semibold last:mb-0"
                            : "mb-3 last:mb-0"
                        }
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </article>

                <nav
                  className="mt-2 flex items-center justify-between gap-3"
                  aria-label="Rules pages"
                >
                  {canGoToPreviousRulesPage ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRulesPageIndex((current) => Math.max(0, current - 1))
                      }
                      className="flex items-center gap-1 rounded-full px-1 py-1 text-[15px]"
                      style={{
                        fontFamily: '"Hannotate TC", sans-serif',
                        fontWeight: 700,
                        color: fixedDetails.board.dark,
                      }}
                    >
                      <RulesNavArrow direction="previous" />
                      Back
                    </button>
                  ) : (
                    <div className="w-[58px]" aria-hidden="true" />
                  )}

                  <p
                    className="shrink-0 text-[13px] leading-none text-[#4e627c]"
                    style={{
                      fontFamily: '"Hannotate TC", sans-serif',
                      fontWeight: 400,
                    }}
                  >
                    {rulesPageIndex + 1}/{rulesPages.length}
                  </p>

                  {canGoToNextRulesPage ? (
                    <button
                      type="button"
                      onClick={() =>
                        setRulesPageIndex((current) =>
                          Math.min(rulesPages.length - 1, current + 1),
                        )
                      }
                      className="flex items-center gap-1 rounded-full px-1 py-1 text-[15px]"
                      style={{
                        fontFamily: '"Hannotate TC", sans-serif',
                        fontWeight: 700,
                        color: fixedDetails.board.dark,
                      }}
                    >
                      Next
                      <RulesNavArrow direction="next" />
                    </button>
                  ) : (
                    <div className="w-[58px]" aria-hidden="true" />
                  )}
                </nav>
              </section>
            ) : isPreviousReviewOpen && previousTurn ? (
              <section
                className="relative h-full w-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby={reviewTitleId}
              >
                <h2 id={reviewTitleId} className="sr-only">
                  Previous card review
                </h2>
                {previousTurn.mode === "five-card" ? (
                  isExplanationVisible ? (
                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                      <div
                        className="h-full w-full"
                        style={{
                          transform: "scale(0.8)",
                          transformOrigin: "center bottom",
                        }}
                      >
                        <FiveCardBoard cards={previousTurn.cards} />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex items-end justify-center pb-12">
                      <div
                        className="h-full w-full"
                        style={{
                          transform: "scale(0.9)",
                          transformOrigin: "center bottom",
                        }}
                      >
                        <FiveCardBoard cards={previousTurn.cards} />
                      </div>
                    </div>
                  )
                ) : (
                  <ReviewCardIllustration
                    card={previousTurn.cards[0]}
                    isExplanationVisible={isExplanationVisible}
                  />
                )}
              </section>
            ) : isRoundFinished ? (
              <div
                className={`flex h-full w-full -translate-y-[20px] flex-col items-center justify-center text-center text-[#22304a] ${
                  isBoardStretched ? "pl-10 pr-20" : "px-10"
                }`}
                style={{ fontFamily: '"Hannotate TC", sans-serif' }}
              >
                <p className="text-[22px] leading-none">Round complete</p>
                <p className="mt-6 text-[22px] leading-none">
                  Score: {score}/{answeredCount}
                </p>
                <p className="mt-8 max-w-[250px] text-[18px] leading-snug">
                  Click the paw in the top right corner to play again
                </p>
              </div>
            ) : isAnimatingCardTransition ? (
              cardTransitionStage === "to-reverse" ? (
                <CardFlipTransition
                  transitionKey={`to-reverse-${cardSequence}`}
                  className="card-transition-rotor-flipping"
                  frontFace={
                    <ResolvedCardIllustration card={previousCard} />
                  }
                  backFace={
                    <img
                      src={reverseCard}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none -mt-[10px] block h-[70%] w-auto max-w-none select-none"
                    />
                  }
                />
              ) : (
                <CardFlipTransition
                  transitionKey={`to-next-${cardSequence}`}
                  className="card-transition-rotor-flipping"
                  frontFace={
                    <img
                      src={reverseCard}
                      alt=""
                      aria-hidden="true"
                      className="pointer-events-none -mt-[10px] block h-[70%] w-auto max-w-none select-none"
                    />
                  }
                  backFace={<ResolvedCardIllustration card={displayCard} />}
                />
              )
            ) : !hasStarted ? (
              <GameQuickStartGuide isLarge={isBoardStretched} />
            ) : isBoardStretched ? (
              <FiveCardBoard
                cards={cards}
                previousCards={
                  isCardTransitioning && previousTurn?.mode === "five-card"
                    ? previousTurn.cards
                    : undefined
                }
                transitionRunId={isCardTransitioning ? cardSequence : undefined}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ResolvedCardIllustration card={displayCard} />
              </div>
            )}
            </div>

            {isPreviousReviewOpen && previousTurn ? (
            <div
              className={
                previousTurn.mode === "five-card"
                  ? "absolute z-10"
                  : "absolute z-10"
              }
              style={
                previousTurn.mode === "five-card"
                  ? fiveCardBoardAreaStyle
                  : COMPACT_OVERLAY_BOUNDS
              }
            >
              <div
                className={
                  previousTurn.mode === "five-card"
                    ? "absolute inset-0 pt-14 pl-12 pb-12 pr-24"
                    : "absolute inset-x-0 top-[15px]"
                }
              >
                <div className="flex flex-col items-center">
                  <button
                    ref={explanationToggleButtonRef}
                    type="button"
                    onClick={() =>
                      setIsExplanationVisible((current) => !current)
                    }
                    className="whitespace-nowrap text-[15px] leading-none text-[#22304a] underline underline-offset-2"
                    style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                  >
                    {isExplanationVisible
                      ? "Hide explanation"
                      : "Show explanation"}
                  </button>
                  {isExplanationVisible ? (
                    <div
                      className={
                        previousTurn.mode === "five-card"
                          ? "mt-2 w-full text-center text-[14px] leading-snug text-[#22304a]"
                          : "mt-2 w-full px-[10px] text-center text-[14px] leading-snug text-[#22304a]"
                      }
                      style={{ fontFamily: '"Hannotate TC", sans-serif' }}
                    >
                      {previousReviewExplanation.map((paragraph) => (
                        <p key={paragraph.key} className="mb-1 last:mb-0">
                          {paragraph.content}
                        </p>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            ) : null}

            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
            {isInteractionOverlayOpen
              ? null
              : pawTrailSteps.map((step) => (
                  <div
                    key={step.key}
                    className="paw-step-trail absolute"
                    style={getPawTrailStyle(step)}
                  >
                    <HintPawStep
                      fill={PAW_TRAIL_FILL_COLOR}
                      stroke={PAW_TRAIL_STROKE_COLOR}
                      className="h-11 w-11"
                    />
                  </div>
                ))}
            {!isInteractionOverlayOpen && targetHintPosition ? (
              <div
                key={`target-paw-${pawTrailRunId}`}
                className="paw-step-target absolute"
                style={{
                  left: `${(targetHintPosition.x / BOARD_VIEWBOX.width) * 100}%`,
                  top: `${(targetHintPosition.y / BOARD_VIEWBOX.height) * 100}%`,
                  animationDelay: targetHintDelay,
                }}
              >
                <HintPawStep
                  fill={PAW_TRAIL_FILL_COLOR}
                  stroke={PAW_TRAIL_STROKE_COLOR}
                  className="h-9 w-9"
                />
              </div>
            ) : null}
            </div>

            {BOARD_ANSWER_OPTIONS.map((answer) => (
            <button
              key={answer}
              type="button"
              onClick={() => {
                if (isRulesOpen) {
                  closeRules();
                }

                if (isRoundFinished) {
                  setHasStarted(true);
                  restartRound();
                  return;
                }

                if (isPreviousReviewOpen) {
                  closePreviousReview();
                  return;
                }

                if (!hasStarted) {
                  return;
                }

                submitAnswer(answer);
              }}
              onMouseEnter={() => {
                if (hasStarted && canAnswer) {
                  setHoveredAnswer(answer);
                }
              }}
              onMouseLeave={() =>
                setHoveredAnswer((current) =>
                  current === answer ? null : current,
                )
              }
              onFocus={() => {
                if (hasStarted && canAnswer) {
                  setHoveredAnswer(answer);
                }
              }}
              onBlur={() =>
                setHoveredAnswer((current) =>
                  current === answer ? null : current,
                )
              }
              data-answer-object={answer}
              data-selected={selectedAnswer === answer}
              data-hovered={effectiveHoveredAnswer === answer}
              disabled={
                (!hasStarted || !canAnswer) && !isRoundFinished || isPreviousReviewOpen
              }
              className="absolute z-20 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-default"
              style={
                isBoardStretched
                  ? getCompactTokenOverlayStyle(answer)
                  : getOverlayStyle(
                      ANSWER_BUTTON_LAYOUT[answer],
                      horizontalOverlayOffset,
                      answerOverlayTranslateY[answer],
                    )
              }
              aria-label={`Choose ${ANSWER_BUTTON_OVERLAYS[answer].label} as the answer`}
            />
          ))}

            {isPreviousReviewAvailable ? (
            <button
              ref={previousControlButtonRef}
              type="button"
              onClick={() => {
                if (isRulesOpen) {
                  closeRules();
                }

                if (isPreviousReviewOpen) {
                  closePreviousReview();
                  return;
                }

                if (previousTurn == null) {
                  return;
                }

                lastOverlayTriggerRef.current = previousControlButtonRef.current;
                setIsPreviousReviewOpen(true);
                setIsExplanationVisible(false);
              }}
              onMouseEnter={() => setHoveredControl("previous")}
              onMouseLeave={() =>
                setHoveredControl((current) =>
                  current === "previous" ? null : current,
                )
              }
              onFocus={() => setHoveredControl("previous")}
              onBlur={() =>
                setHoveredControl((current) =>
                  current === "previous" ? null : current,
                )
              }
              className="absolute z-20 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={getOverlayStyle(CONTROL_LAYOUT.previous)}
              aria-label={
                isPreviousReviewOpen
                  ? "Return to the current game"
                  : BOARD_CONTROL_OVERLAYS.previous.label
              }
            />
            ) : null}

            <button
            type="button"
            onClick={() => {
              if (isRulesOpen) {
                closeRules();
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

              setHasStarted(true);
              restartRound();
            }}
            onMouseEnter={() => setHoveredControl("restart")}
            onMouseLeave={() =>
              setHoveredControl((current) =>
                current === "restart" ? null : current,
              )
            }
            onFocus={() => setHoveredControl("restart")}
            onBlur={() =>
              setHoveredControl((current) =>
                current === "restart" ? null : current,
              )
            }
            className="absolute z-20 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={getOverlayStyle(
              CONTROL_LAYOUT.restart,
              horizontalOverlayOffset,
            )}
            aria-label={BOARD_CONTROL_OVERLAYS.restart.label}
            />

            <button
            ref={rulesControlButtonRef}
            type="button"
            onClick={() => {
              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

              lastOverlayTriggerRef.current = rulesControlButtonRef.current;
              setIsRulesOpen((current) => !current);
              setRulesPageIndex(0);
            }}
            onMouseEnter={() => setHoveredControl("rules")}
            onMouseLeave={() =>
              setHoveredControl((current) =>
                current === "rules" ? null : current,
              )
            }
            onFocus={() => setHoveredControl("rules")}
            onBlur={() =>
              setHoveredControl((current) =>
                current === "rules" ? null : current,
              )
            }
            className="absolute z-20 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={getOverlayStyle(
              CONTROL_LAYOUT.rules,
              0,
              verticalOverlayOffset,
            )}
            aria-label={BOARD_CONTROL_OVERLAYS.rules.label}
            />

            <button
            ref={fiveCardModeButtonRef}
            type="button"
            onClick={() => {
              if (isRulesOpen) {
                closeRules();
              }

              if (isPreviousReviewOpen) {
                closePreviousReview();
              }

              const nextMode =
                gameMode === "five-card" ? "single-card" : "five-card";

              suppressNextCardTransitionRef.current = true;
              setPreviousCard(null);
              setCardTransitionStage("idle");
              setDisplayCard(card);
              lastRenderedCardRef.current = card;
              setGameMode(nextMode);
              restartRound(nextMode);
            }}
            onMouseEnter={() => setHoveredControl("five-card-mode")}
            onMouseLeave={() =>
              setHoveredControl((current) =>
                current === "five-card-mode" ? null : current,
              )
            }
            onFocus={() => setHoveredControl("five-card-mode")}
            onBlur={() =>
              setHoveredControl((current) =>
                current === "five-card-mode" ? null : current,
              )
            }
            className="absolute z-20 rounded-full bg-transparent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={getOverlayStyle(
              CONTROL_LAYOUT["five-card-mode"],
              horizontalOverlayOffset,
              verticalOverlayOffset,
            )}
            aria-label={
              isBoardStretched
                ? "Switch to single card mode"
                : "Switch to five card mode"
            }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
