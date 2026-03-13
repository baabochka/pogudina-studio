import { GameBoardRound } from "../features/games/paws_and_think/GameBoardRound";
import { Section } from "../components/ui/Section";

export function GamesPage() {
  return (
    <Section
      eyebrow="Games"
      title="A timed board round built on the reusable card system."
      description="Answer as many cards as you can in sixty seconds while the board tracks score, best score, validation feedback, and rotating illustrations."
    >
      <GameBoardRound />
    </Section>
  );
}
