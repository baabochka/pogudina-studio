import type { ReactNode } from 'react'

import { Card } from '../components/ui/Card'

type GameCardProps = {
  title: string
  description: string
  children: ReactNode
}

export function GameCard({ title, description, children }: GameCardProps) {
  return (
    <Card className="h-full bg-[linear-gradient(180deg,var(--surface),color-mix(in_srgb,var(--accent)_12%,var(--surface)))]">
      <div className="flex h-full flex-col gap-5">
        <div className="rounded-[2rem] border border-border bg-background/70 p-5 sm:p-6">
          {children}
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  )
}
