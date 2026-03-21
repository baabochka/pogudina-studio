import type { ReactNode } from 'react'

import { Card } from '../ui/Card'

type ContentSectionCardProps = {
  children: ReactNode
  className?: string
  title: ReactNode
}

export function ContentSectionCard({
  children,
  className = '',
  title,
}: ContentSectionCardProps) {
  return (
    <Card className={['space-y-[var(--space-heading-content)]', className].join(' ').trim()}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      {children}
    </Card>
  )
}
