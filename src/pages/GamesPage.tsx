import { Card } from '../components/ui/Card'
import { Section } from '../components/ui/Section'

const games = [
  {
    title: 'Interactive work can live here',
    status: 'Ready for content',
    description:
      'Your CV does not list shipped game projects yet, so this route is currently positioned as a place for future experiments, prototypes, or game jam work.',
  },
]

export function GamesPage() {
  return (
    <Section
      eyebrow="Games"
      title="A future space for interactive experiments and game-related work."
      description="This route stays in the starter because it fits your requested site structure, but the content is framed honestly around future work rather than invented credits."
    >
      <div className="grid gap-6 md:grid-cols-1">
        {games.map((game) => (
          <Card key={game.title}>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">{game.status}</p>
            <h3 className="mt-3 text-xl font-semibold text-foreground">{game.title}</h3>
            <p className="mt-4 text-muted-foreground">{game.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}
