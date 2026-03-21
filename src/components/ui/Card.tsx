import type { HTMLAttributes, ReactNode } from 'react'

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
}

export function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div
      className={[
        'rounded-[var(--radius-xl)] border border-border bg-surface p-[var(--space-card-padding)] shadow-[var(--shadow-card)]',
        className,
      ]
        .join(' ')
        .trim()}
      {...props}
    >
      {children}
    </div>
  )
}
