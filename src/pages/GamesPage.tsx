import { GameBoardRound } from "../features/games/paws_and_think/GameBoardRound";
import { Section } from "../components/ui/Section";

export function GamesPage() {
  return (
    <Section
      eyebrow="Games"
      title="Paws and Think"
      description="A playful logic game built around color matching, quick deduction, and a little bit of pressure from the clock. Each card shows two objects, but only one token can be the correct answer. Sometimes the answer is an object shown on the card in its original color. If neither object is in its original color, you solve the puzzle by eliminating the objects on the card and the objects whose original colors are already visible. The one token left is the answer."
    >
      <GameBoardRound />
    </Section>
  );
}
