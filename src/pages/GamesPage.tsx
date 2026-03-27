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
      <ul className="grid items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <li key={game.slug} className="mx-auto h-full w-full min-w-[200px] max-w-[350px]">
            <GameCard game={game} />
          </li>
        ))}
        <li className="mx-auto h-full w-full min-w-[200px] max-w-[350px]">
          <ComingSoonCard />
        </li>
      </ul>
    </Section>
  )
}
