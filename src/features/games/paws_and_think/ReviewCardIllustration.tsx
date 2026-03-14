import type { ResolvedCard } from "./cardResolver";
import { ResolvedCardIllustration } from "./ResolvedCardIllustration";

type ReviewCardIllustrationProps = {
  card: ResolvedCard;
  isExplanationVisible: boolean;
};

const REVIEW_EXPLANATION_SCALE = 0.5;

export function ReviewCardIllustration({
  card,
  isExplanationVisible,
}: ReviewCardIllustrationProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      {isExplanationVisible ? (
        <div className="absolute inset-0 flex items-end justify-center">
          <div
            className="h-full"
            style={{
              transform: `scale(${REVIEW_EXPLANATION_SCALE})`,
              transformOrigin: "center bottom",
            }}
          >
            <ResolvedCardIllustration card={card} />
          </div>
        </div>
      ) : (
        <ResolvedCardIllustration card={card} alignBottom />
      )}
    </div>
  );
}
