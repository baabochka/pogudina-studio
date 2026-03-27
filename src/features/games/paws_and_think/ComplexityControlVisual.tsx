import { fixedDetails } from "./palettes";

const COMPLEXITY_OPTIONS = [3, 4, 5, 6] as const;

export function ComplexityControlVisual({
  selectedComplexity,
}: {
  selectedComplexity: 3 | 4 | 5 | 6 | null;
}) {
  const selectedIndex =
    selectedComplexity == null
      ? null
      : COMPLEXITY_OPTIONS.indexOf(selectedComplexity);

  return (
    <div className="pointer-events-none absolute bottom-[5px] left-1/2 z-30 -translate-x-1/2">
      <div
        className="flex items-center gap-3 rounded-full px-3 py-1.5 shadow-sm"
        style={{
          background:
            "color-mix(in srgb, #f3e5df 90%, white)",
          boxShadow: "0 2px 0 rgba(0, 0, 0, 0.12)",
          opacity: selectedComplexity == null ? 0.82 : 1,
        }}
        aria-hidden="true"
      >
        <span
          className="whitespace-nowrap text-[12px] leading-none"
          style={{
            color: fixedDetails.board.dark,
            fontFamily: '"Hannotate TC", sans-serif',
            fontWeight: 700,
          }}
        >
          Choose complexity
        </span>

        <div className="relative flex h-7 w-[126px] items-center justify-between px-2">
          <div
            className="absolute inset-x-2 top-1/2 h-[3px] -translate-y-1/2 rounded-full"
            style={{
              background: "rgba(0, 81, 87, 0.2)",
            }}
          />

          {selectedIndex != null ? (
            <div
              className="absolute top-1/2 h-[22px] w-[22px] -translate-y-1/2 rounded-full transition-[left] duration-300 ease-out"
              style={{
                left: `calc(8px + ${selectedIndex} * ((100% - 16px - 22px) / 3))`,
                background: fixedDetails.board.dark,
                boxShadow: "0 1px 0 rgba(0, 0, 0, 0.16)",
              }}
            />
          ) : null}

          {COMPLEXITY_OPTIONS.map((option, index) => {
            const isSelected = selectedComplexity === option;

            return (
              <div
                key={option}
                className="relative z-10 flex w-[22px] items-center justify-center"
                style={{
                  color: isSelected ? "#ffffff" : fixedDetails.board.dark,
                  transform:
                    selectedIndex === index ? "scale(1)" : "scale(0.96)",
                  transition: "color 220ms ease, transform 220ms ease",
                }}
              >
                <span
                  className="text-[13px] leading-none"
                  style={{
                    fontFamily: '"Hannotate TC", sans-serif',
                    fontWeight: 700,
                  }}
                >
                  {option}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
