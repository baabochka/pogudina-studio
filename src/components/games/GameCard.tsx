import { Link } from 'react-router-dom'

import type { Game } from '../../data/games'
import { Card } from '../ui/Card'
import { tagChipClassName } from '../ui/contentStyles'
import { GamePreview } from './GamePreview'

type GameCardProps = {
  game: Game
}

export function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.slug}`} className="cardLink group">
      <Card className="flex h-full flex-col p-5 transition-[border-color,transform,box-shadow] duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:translate-y-[var(--translate-interactive-hover)] group-hover:border-border/90 group-hover:shadow-sm motion-reduce:transform-none motion-reduce:transition-none sm:p-6">
        <div className="mb-6">
          <GamePreview
            src={game.previewImage}
            alt={game.previewAlt}
            imageFit={game.previewImageFit}
            imagePosition={game.previewImagePosition}
            secondaryAlt={game.previewSecondaryAlt}
            secondaryImageFit={game.previewSecondaryImageFit}
            secondaryImagePosition={game.previewSecondaryImagePosition}
            secondarySrc={game.previewSecondaryImage}
            variant={game.previewVariant}
          />
        </div>

        <div className="flex flex-1 flex-col">
          {game.eyebrow ? (
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary/80">
              {game.eyebrow}
            </p>
          ) : null}

          <h2 className="text-[length:var(--font-size-title-xs)] font-[var(--font-weight-semibold)] tracking-tight leading-[var(--line-height-tight)] text-foreground transition-colors duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:text-foreground/90 group-focus-visible:text-foreground/90">
            {game.title}
          </h2>

          <p className="mt-2 max-w-[58ch] text-sm leading-6 text-muted-foreground">
            {game.summary}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {game.tags.map((tag) => (
              <span key={tag} className={tagChipClassName}>
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-6">
            <span className="inline-flex items-center rounded-[var(--radius-pill)] bg-[color:color-mix(in_srgb,var(--primary)_14%,white)] px-[var(--space-chip-inline)] py-[var(--space-chip-block)] text-sm font-semibold text-primary transition-[background-color,color] duration-[var(--duration-interactive)] ease-[var(--easing-interactive)] group-hover:bg-[color:color-mix(in_srgb,var(--primary)_20%,white)] group-focus-visible:bg-[color:color-mix(in_srgb,var(--primary)_20%,white)]">
              View game page
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}
