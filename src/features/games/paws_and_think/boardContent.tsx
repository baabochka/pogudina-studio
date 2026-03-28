import type { ReactNode } from "react";

import {
  ORIGINAL_COLOR_BY_OBJECT,
  type ObjectName,
  type PaletteName,
} from "./cardResolver";
import type { GuideBubbleName } from "./boardConfig";

export const SINGLE_CARD_RULES_PAGES = [
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

export const FIVE_CARD_RULES_PAGES = [
  {
    title: "How to play",
    paragraphs: [
      "In the multiple-cards mode, the answer to the round is the answer that repeats twice across the cards.",
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

const OBJECT_BY_ORIGINAL_COLOR = Object.entries(
  ORIGINAL_COLOR_BY_OBJECT,
).reduce(
  (accumulator, [objectName, colorName]) => {
    accumulator[colorName as PaletteName] = objectName as ObjectName;
    return accumulator;
  },
  {} as Record<PaletteName, ObjectName>,
);

function formatColoredObject(color: PaletteName, object: ObjectName) {
  return `${color} ${object}`;
}

export type ReviewExplanationParagraph = {
  content: ReactNode;
  key: string;
};

export function getReviewExplanation(card: {
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

export function getMultiCardReviewExplanation({
  correctAnswer,
}: {
  correctAnswer: ObjectName;
}) {
  const repeatedAnswer = formatColoredObject(
    ORIGINAL_COLOR_BY_OBJECT[correctAnswer],
    correctAnswer,
  );

  return [
    {
      key: "multi-card-explanation",
      content: (
        <>
          In the multiple-cards mode each card has a solution, which can be found
          according to one-card rules. The overall answer will be the token
          that repeats for two different cards. Here, that repeated answer is{" "}
          <strong>{repeatedAnswer}</strong>.
        </>
      ),
    },
  ] satisfies ReviewExplanationParagraph[];
}

export const QUICK_START_BUBBLE_LABELS: Record<
  Exclude<GuideBubbleName, "quickStart">,
  string
> = {
  changeLevel: "Change level",
  gameRules: "Game rules",
  reviewPrevious: "Review previous\nresponse",
  startNewGame: "Start new game",
};

export const QUICK_START_BODY_PARAGRAPHS = {
  large: [
    "Solve each card using the one-card rules.",
    "Pick the token that repeats twice across the cards.",
  ],
  small: [
    "Match the object whose original color appears on the card.",
    "If nothing matches, eliminate the shown objects and the shown colors.",
    "The only token left is the answer.",
  ],
} as const;

export const QUICK_START_HEADING =
  "Use the tokens on the right to choose the correct answer.";
