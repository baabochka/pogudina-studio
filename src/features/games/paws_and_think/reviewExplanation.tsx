import type { ReactNode } from "react";

import {
  ORIGINAL_COLOR_BY_OBJECT,
  type ObjectName,
  type PaletteName,
} from "./cardResolver";

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
