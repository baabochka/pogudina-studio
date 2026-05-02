import { useState } from "react";

import { formatDisplayCoordinate } from "./coordinateUtils";
import type {
  HideSqueakCoordinate,
  HideSqueakGeneratedRound,
  HideSqueakTypedAnswerValidation,
  HideSqueakValidationResult,
} from "./types";

const ANSWER_BUTTON_CLASS_NAME =
  "answer-choises font-game rounded-[16px] border-[3px] border-hs-textPrimary bg-hs-board px-3 py-1 text-[1.18rem] font-semibold leading-none text-hs-textPrimary shadow-hs-soft transition duration-150 hover:bg-hs-controlHover/30 active:bg-hs-controlActive/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel disabled:cursor-not-allowed disabled:opacity-60";
const ANSWER_INPUT_CLASS_NAME =
  "font-game h-10 w-22 rounded-[16px] border-[3px] border-hs-textSecondary bg-hs-board px-2.5 text-center text-[1.18rem] font-semibold uppercase text-hs-textPrimary shadow-hs-soft transition duration-150 hover:bg-hs-controlHover/25 active:bg-hs-controlActive/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hs-focus focus-visible:ring-offset-2 focus-visible:ring-offset-hs-panel disabled:cursor-not-allowed disabled:opacity-60";

export function HideSqueakAnswerPanel({
  round,
  validationResult,
  isWaitingForNextRound,
  onCoordinateSelect,
  onTypedSubmit,
  onInteraction,
  isCompactMobile = false,
  isNarrowCompactMobile = false,
  useCompactSingleRowAnswers = false,
}: {
  round: HideSqueakGeneratedRound;
  validationResult: HideSqueakValidationResult;
  isWaitingForNextRound: boolean;
  onCoordinateSelect?: (coordinate: HideSqueakCoordinate) => void;
  onTypedSubmit?: (input: string) => HideSqueakTypedAnswerValidation;
  onInteraction?: () => void;
  isCompactMobile?: boolean;
  isNarrowCompactMobile?: boolean;
  useCompactSingleRowAnswers?: boolean;
}) {
  const [typedValue, setTypedValue] = useState("");
  const [typedValidation, setTypedValidation] =
    useState<HideSqueakTypedAnswerValidation | null>(null);
  const answerModel = round.answerModel;
  const useCompactChoiceRow =
    useCompactSingleRowAnswers &&
    answerModel?.kind === "multiple-choice" &&
    answerModel.options.length === 4;

  if (!answerModel || answerModel.kind === "board-cell") {
    return null;
  }

  function handleTypedSubmit() {
    if (!onTypedSubmit) {
      return;
    }

    const nextValidation = onTypedSubmit(typedValue);
    setTypedValidation(nextValidation);

    if (nextValidation.isValidFormat) {
      setTypedValue(nextValidation.normalizedLabel ?? typedValue);
    }
  }

  return (
    <div
      className={[
        "rounded-[20px] border-[3px] border-hs-panelMuted/90 bg-hs-panelMuted text-hs-textPrimary shadow-[inset_0_0_0_3px_color-mix(in_srgb,var(--hs-highlight)_38%,transparent)]",
        isNarrowCompactMobile
          ? "mt-1.5 p-1.5"
          : isCompactMobile
            ? "mt-1.5 p-1"
            : "mt-2 p-1.5",
      ].join(" ")}
    >
      {answerModel.kind === "multiple-choice" ? (
        <div
          className={
            isNarrowCompactMobile
              ? "space-y-1.25"
              : isCompactMobile
                ? "space-y-1.5"
                : "space-y-2"
          }
        >
          <div className="text-center">
            <h4
              className={[
                "font-game font-medium leading-none text-hs-textSecondary",
                isCompactMobile ? "text-[1rem]" : "text-[1.12rem]",
              ].join(" ")}
            >
              Answer:
            </h4>
          </div>

          <div
            className={[
              "pb-0.5",
              useCompactChoiceRow
                ? isNarrowCompactMobile
                  ? "grid grid-cols-4 gap-2 pl-2 pr-2"
                  : "grid grid-cols-4 gap-1.5 pl-2 pr-2"
                : isCompactMobile
                  ? "grid grid-cols-2 gap-1.5"
                  : "grid grid-cols-2 gap-2",
            ].join(" ")}
          >
            {answerModel.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={[
                  ANSWER_BUTTON_CLASS_NAME,
                  isCompactMobile ? "mx-auto w-full max-w-[80px]" : "",
                  isNarrowCompactMobile
                    ? "rounded-[13px] px-1.5 py-0.5 text-[0.94rem]"
                    : isCompactMobile
                      ? "rounded-[14px] px-2 py-0.5 text-[1rem]"
                      : "",
                ].join(" ")}
                disabled={validationResult !== "idle" || isWaitingForNextRound}
                onFocus={onInteraction}
                onClick={() => {
                  onInteraction?.();
                  onCoordinateSelect?.(option.coordinate);
                }}
                aria-label={`Answer option ${option.label}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {answerModel.kind === "typed-coordinate" ? (
        <div
          className={
            isNarrowCompactMobile
              ? "space-y-1.25"
              : isCompactMobile
                ? "space-y-1.5"
                : "space-y-2"
          }
        >
          <div
            className={[
              "flex items-center justify-center",
              isNarrowCompactMobile
                ? "gap-1.5"
                : isCompactMobile
                  ? "gap-2"
                  : "gap-2.5",
            ].join(" ")}
          >
            <h4
              className={[
                "font-game font-medium leading-none text-hs-textSecondary",
                isCompactMobile ? "text-[1rem]" : "text-[1.12rem]",
              ].join(" ")}
            >
              Answer:
            </h4>
            <input
              type="text"
              inputMode="text"
              autoCapitalize="characters"
              autoCorrect="off"
              spellCheck={false}
              value={typedValue}
              disabled={validationResult !== "idle" || isWaitingForNextRound}
              onChange={(event) => {
                onInteraction?.();
                setTypedValue(event.target.value.toUpperCase());
                if (typedValidation) {
                  setTypedValidation(null);
                }
              }}
              onFocus={onInteraction}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onInteraction?.();
                  handleTypedSubmit();
                }
              }}
              className={[
                ANSWER_INPUT_CLASS_NAME,
                isNarrowCompactMobile
                  ? "h-8.5 w-[4.6rem] rounded-[13px] text-[0.98rem]"
                  : isCompactMobile
                    ? "h-9 w-20 rounded-[14px] text-[1rem]"
                    : "",
              ].join(" ")}
              aria-label="Coordinate answer"
            />
          </div>
          <p
            className={[
              "font-ui text-center text-hs-textSecondary",
              isNarrowCompactMobile
                ? "text-[0.76rem] leading-3.5"
                : isCompactMobile
                  ? "text-[0.8rem] leading-4"
                  : "text-[0.88rem] leading-5",
            ].join(" ")}
          >
            (coordinates like {formatDisplayCoordinate({ row: 1, column: 1 })},{" "}
            {formatDisplayCoordinate({ row: 3, column: 3 })}, etc)
          </p>
          {typedValidation && !typedValidation.isValidFormat ? (
            <p className="font-ui text-center text-sm text-hs-wrong">
              Enter a valid in-bounds coordinate.
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
