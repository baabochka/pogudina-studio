import { Card } from '../ui/Card'

export function ComingSoonCard() {
  return (
    <Card className="flex h-full flex-col border-dashed border-border/55 bg-[color:color-mix(in_srgb,var(--surface)_86%,white)] p-5 sm:p-6">
      <div className="mb-4">
        <div className="flex aspect-[3/4] items-center justify-center rounded-[20px] border border-dashed border-border/55 bg-[color:color-mix(in_srgb,var(--surface)_92%,white)] px-5 text-center opacity-90">
          <div className="flex max-w-[220px] flex-col items-center justify-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary/70">
              More to explore
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              More games and interactive experiments coming soon.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <h2 className="text-xl font-semibold tracking-tight text-foreground/85">Coming soon</h2>
        <p className="mt-2 max-w-[58ch] text-sm leading-6 text-muted-foreground">
          I’m building out this section as a home for small browser games, UI experiments, and
          playful prototypes that still reflect the same focus on polish, clarity, and frontend
          craft.
        </p>
      </div>
    </Card>
  )
}
