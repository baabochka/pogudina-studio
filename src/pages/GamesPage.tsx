import { ComingSoonCard } from '../components/games/ComingSoonCard'
import { GameCard } from '../components/games/GameCard'
import { Section } from '../components/ui/Section'
import { games } from '../data/games'

export function GamesPage() {
  return (
    <Section
      eyebrow="Games"
      title="Interactive frontend experiments"
      titleAs="h1"
      description="A small collection of browser-based games and interactive experiments focused on logic, SVG-driven interfaces, and polished UI behavior. Each game is built to feel playful, responsive, and intentional within the same design system as the rest of the portfolio."
    >
      <ul className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <li key={game.slug} className="h-full">
            <GameCard game={game} />
          </li>
        ))}
        <li className="h-full">
          <ComingSoonCard />
        </li>
      </ul>
    </Section>
  )
}
