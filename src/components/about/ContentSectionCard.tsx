import type { ReactNode } from 'react'

import { Card } from '../ui/Card'

type ContentSectionCardProps = {
  children: ReactNode
  className?: string
  title: string
}

export function ContentSectionCard({
  children,
  className = '',
  title,
}: ContentSectionCardProps) {
  return (
    <Card className={['p-6 sm:p-7', className].join(' ').trim()}>
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </Card>
  )
}
