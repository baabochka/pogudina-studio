import { GameBoardSmallIllustration } from '../../features/games/paws_and_think/illustrations/GameBoardSmallIllustration'

export function PawsAndThinkPreview() {
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-border/70 bg-[color:color-mix(in_srgb,var(--surface)_84%,white)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_color-mix(in_srgb,var(--primary)_10%,transparent),_transparent_58%)]" />
      <div className="absolute inset-x-0 bottom-[-10%] top-[8%] flex items-start justify-center">
        <GameBoardSmallIllustration className="h-full" showPreviousControl={false} />
      </div>
    </div>
  )
}
