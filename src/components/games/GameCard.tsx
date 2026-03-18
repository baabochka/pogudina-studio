import { Link } from 'react-router-dom'

import type { Game } from '../../data/games'
import { GamePreview } from './GamePreview'

type GameCardProps = {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/games/${game.slug}`}
      className="cardLink group flex h-full flex-col rounded-3xl border border-border bg-surface p-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)] transition duration-200 ease-out hover:-translate-y-[2px] hover:border-border/90 hover:shadow-sm motion-reduce:transform-none motion-reduce:transition-none sm:p-6"
    >
      <div className="mb-6">
        <GamePreview
          src={game.previewImage}
          alt={game.previewAlt}
          variant={game.previewVariant}
        />
      </div>

      <div className="flex flex-1 flex-col">
        {game.eyebrow ? (
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
            {game.eyebrow}
          </p>
        ) : null}

        <h2 className="text-xl font-semibold tracking-tight text-foreground transition-colors duration-200 ease-out group-hover:text-foreground/90 group-focus-visible:text-foreground/90">
          {game.title}
        </h2>

        <p className="mt-2 max-w-[58ch] text-sm leading-6 text-muted-foreground">
          {game.summary}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/80 bg-[color:color-mix(in_srgb,var(--surface)_82%,white)] px-3 py-1 text-xs font-medium text-foreground/80"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <span className="inline-flex items-center rounded-full bg-[color:color-mix(in_srgb,var(--primary)_14%,white)] px-3 py-1.5 text-sm font-semibold text-primary transition-colors duration-200 ease-out group-hover:bg-[color:color-mix(in_srgb,var(--primary)_20%,white)] group-focus-visible:bg-[color:color-mix(in_srgb,var(--primary)_20%,white)]">
            View game page
          </span>
        </div>
      </div>
    </Link>
  )
}
