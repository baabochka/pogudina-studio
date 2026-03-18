import { ComingSoonCard } from '../components/games/ComingSoonCard'
import { GameCard } from '../components/games/GameCard'
import { Section } from '../components/ui/Section'
import { games } from '../data/games'

export function GamesPage() {
  return (
    <Section
      eyebrow="Games"
      title="Interactive frontend experiments"
      description="A small collection of browser-based games and interactive experiments focused on logic, SVG-driven interfaces, and polished UI behavior. Each game is built to feel playful, responsive, and intentional within the same design system as the rest of the portfolio."
    >
      <div className="grid items-stretch gap-6 md:grid-cols-2 xl:grid-cols-3">
        {games.map((game) => (
          <article key={game.slug} className="h-full">
            <GameCard game={game} />
          </article>
        ))}
        <article className="h-full">
          <ComingSoonCard />
        </article>
      </div>
    </Section>
  )
}
