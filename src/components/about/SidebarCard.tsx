import type { ReactNode } from 'react'

import { Card } from '../ui/Card'

type SidebarCardProps = {
  children: ReactNode
  className?: string
  title: ReactNode
}

export function SidebarCard({ children, className = '', title }: SidebarCardProps) {
  return (
    <Card
      className={[
        'rounded-3xl border-border/80 p-[var(--space-5)] shadow-none sm:p-[var(--space-card-padding)] space-y-[var(--space-heading-content)]',
        className,
      ]
        .join(' ')
        .trim()}
    >
      <h2 className="text-base font-semibold text-foreground sm:text-lg">{title}</h2>
      {children}
    </Card>
  )
}
