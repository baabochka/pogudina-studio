import type { ReactNode } from 'react'

type SidebarCardProps = {
  children: ReactNode
  className?: string
  title: string
}

export function SidebarCard({ children, className = '', title }: SidebarCardProps) {
  return (
    <div
      className={[
        'rounded-3xl border border-border/80 bg-surface px-5 py-5 sm:px-6 sm:py-6',
        className,
      ]
        .join(' ')
        .trim()}
    >
      <h2 className="text-base font-semibold text-foreground sm:text-lg">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  )
}
