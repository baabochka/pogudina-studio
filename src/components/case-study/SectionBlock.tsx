import type { ReactNode } from 'react'

type SectionBlockProps = {
  children: ReactNode
  contentClassName?: string
  id?: string
  title: string
}

export function SectionBlock({
  children,
  contentClassName = '',
  id,
  title,
}: SectionBlockProps) {
  return (
    <section
      id={id}
      className="border-t border-border/80 pt-[var(--space-10)] first:border-t-0 first:pt-0 sm:pt-[var(--space-12)]"
    >
      <h2 className="text-[length:var(--font-size-title-xs)] font-[var(--font-weight-semibold)] tracking-tight leading-[var(--line-height-tight)] text-foreground">
        {title}
      </h2>
      <div
        className={[
          'mt-[var(--space-5)] space-y-[var(--space-4)] text-[length:var(--font-size-body)] leading-[var(--line-height-body)] text-muted-foreground',
          contentClassName,
        ]
          .join(' ')
          .trim()}
      >
        {children}
      </div>
    </section>
  )
}
